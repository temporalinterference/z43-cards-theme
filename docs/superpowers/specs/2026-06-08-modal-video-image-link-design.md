# Modal Video (YouTube) & Linked Image — Design

**Date:** 2026-06-08
**Status:** Approved for planning

## Goal

Extend the theme's modal content shortcodes so card **modals** (the detail view that
opens when a card is clicked) can embed:

1. A **YouTube video** (in addition to the existing local-file videos).
2. An **image that is also a link**.

Both shortcodes are used inside a card's `modal.md`, which renders in the wide
modal dialog (not the narrow ~348px card teaser).

## Non-Goals

- No new shortcode names. We extend the existing `modal-movie` and `modal-image`.
- No support for non-YouTube video providers (Vimeo, etc.) yet — a non-YouTube
  URL must fail loudly so it is obvious that it is unsupported (YAGNI; add later).
- No changes to the narrow card teaser rendering.

## Design

### 1. `modal-movie` — accept a YouTube URL or a local file

`modal-movie` currently takes one positional argument: the name of a video
resource in the card's page bundle (resolved via `$.Page.Parent.Resources.Get`),
and renders it as an inline `<video>`. `.Inner` is the caption.

We make the first argument polymorphic:

- **Local file** (argument does **not** start with `http`): unchanged — resolve as
  a page-bundle resource and render the existing `<video>` element. If the
  resource is missing, keep the existing `errorf`.
- **YouTube URL** (argument starts with `http`): parse the 11-character video id
  from any of these forms:
  - `https://www.youtube.com/watch?v=<id>` (and extra query params)
  - `https://youtu.be/<id>`
  - `https://www.youtube.com/embed/<id>`
  - then render a **click-to-load facade** (see below).
- **Any other `http` URL**: `errorf` with a clear "unsupported video URL — only
  YouTube and local files are supported" message.

**Facade markup** (privacy-friendly, no YouTube request until clicked):

```html
<figure>
  <div class="ti-video-embed">
    <button type="button" class="ti-youtube-facade"
            data-embed="https://www.youtube-nocookie.com/embed/<id>?autoplay=1"
            aria-label="Play video">
      <img src="https://i.ytimg.com/vi/<id>/hqdefault.jpg" alt="" loading="lazy">
      <span class="ti-play-badge" aria-hidden="true"></span>
    </button>
  </div>
  <figcaption>{{ .caption | markdownify }}</figcaption>
</figure>
```

- Thumbnail uses **`hqdefault.jpg`**, which exists for every video (never a broken
  poster). It is `480x360` and scales acceptably into the 16:9 box.
- Uses `youtube-nocookie.com` and only loads on click.

The shortcode (`layouts/shortcodes/modal-movie.html`) decides local-vs-URL and
passes a dict to the partial, e.g.
`dict "youtube" <id>` for the URL case or `dict "movie" <resource>` for the local
case, plus `"caption" .Inner`. The partial
(`layouts/partials/modal-movie.html`) branches on which key is present.

### 2. `modal-image` — optional link

`modal-image` currently takes one positional argument (image resource name) and
wraps the resized webp `<img>` in a `<figure>` with `.Inner` as caption. All
existing call sites use a single positional argument, so we add an **optional
second positional argument** `href`:

- `layouts/shortcodes/modal-image.html`: read `.Get 1` as `href` (may be empty),
  pass it into the partial dict.
- `layouts/partials/modal-image.html`: when `href` is non-empty, wrap the `<img>`
  in `<a href="…">…</a>`; otherwise render the `<img>` exactly as today.

External-link new-tab handling is already applied globally by
`partials/openLinkExternal.html` (it sets `target="_blank"` on external anchors at
runtime), so no per-link `target`/`rel` attributes are needed here.

Backward compatible: `{{< modal-image foo.jpg >}}` is unchanged.

### 3. JavaScript — facade → iframe swap

Add a small delegated click handler to `assets/js/custom.js` (inside the existing
`DOMContentLoaded` block, alongside the modal logic):

```js
document.addEventListener('click', (e) => {
    const facade = e.target.closest('.ti-youtube-facade');
    if (!facade) return;
    const src = facade.dataset.embed;
    if (!src) return;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allow',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', facade.getAttribute('aria-label') || 'Video');
    facade.replaceWith(iframe);
});
```

Delegation is used because card modals are already in the DOM at load; a single
document-level listener covers all of them with no per-element wiring.

### 4. SCSS — responsive box + play badge

Add to `assets/scss/theme.scss`:

- `.ti-video-embed` — responsive **16:9** container (e.g. `aspect-ratio: 16 / 9;
  position: relative;`), with its `img`, `button`, and (post-swap) `iframe`
  children filling it (`position:absolute; inset:0; width:100%; height:100%`).
- `.ti-youtube-facade` — reset button styling, `cursor: pointer`, image
  `object-fit: cover`.
- `.ti-play-badge` — centered YouTube-style play triangle/rounded-rectangle badge
  overlay; subtle hover emphasis.

## Usage

```text
{{< modal-movie intro.mp4 >}}A local video{{< /modal-movie >}}
{{< modal-movie "https://youtu.be/dQw4w9WgXcQ" >}}A YouTube video{{< /modal-movie >}}
{{< modal-image diagram.jpg >}}Plain caption{{< /modal-image >}}
{{< modal-image diagram.jpg "https://example.com" >}}Linked image{{< /modal-image >}}
```

## Testing / Verification

- Build the `ti-solutions-2024` test site (`cd ../ti-solutions-2024 && hugo`) and
  confirm no template errors and existing `modal-image` / `modal-movie` usages
  still render unchanged.
- Add a temporary card modal exercising: a YouTube URL (all three URL forms), a
  non-YouTube URL (expect `errorf`), and a linked image; verify the facade renders
  the `hqdefault` thumbnail, clicking swaps in the autoplaying nocookie iframe, and
  the linked image opens the target (external → new tab).

## Files Touched

- `layouts/shortcodes/modal-movie.html`
- `layouts/partials/modal-movie.html`
- `layouts/shortcodes/modal-image.html`
- `layouts/partials/modal-image.html`
- `assets/js/custom.js`
- `assets/scss/theme.scss`
