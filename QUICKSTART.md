# Quick Start Guide

Get your site up and running with the Z43 Cards Theme in 5 minutes.

## Prerequisites

- Hugo Extended v0.112.0 or higher
- Git
- Dart Sass (for local development)

## Step 1: Create a New Site

```bash
# Create a new Hugo site
hugo new site my-site
cd my-site

# Initialize as Hugo module
hugo mod init github.com/yourusername/my-site
```

## Step 2: Add the Theme

Add to your `config.yaml`:

```yaml
module:
  imports:
    - path: github.com/temporalinterference/z43-cards-theme
```

## Step 3: Configure Your Site

Create a minimal `config.yaml`:

```yaml
baseURL: https://yourdomain.com
languageCode: en-us
title: My Awesome Site

module:
  imports:
    - path: github.com/temporalinterference/z43-cards-theme

params:
  description: |
    Your site description here.

  # Customize colors
  colors:
    background: "#e0e8f0"
    emphasis: "#1b3764"
    link: "#1485b5"

  # Use system fonts or add your own
  fonts:
    body: "system-ui, sans-serif"
    heading: "Georgia, serif"
```

## Step 4: Add Custom Fonts (Optional)

If you want custom web fonts, use [Google Webfonts Helper](https://gwfh.mranftl.com/fonts):

1. **Visit [gwfh.mranftl.com/fonts](https://gwfh.mranftl.com/fonts)**
   - Search for your font (e.g., "Roboto")
   - Select charsets (usually "latin" is enough)
   - Select font styles/weights you need

2. **Copy the CSS** from step 3 on the page
   - Click "Modern Browsers" tab
   - The CSS @font-face rules are ready to copy

3. **Download the fonts** (step 4 on the page)
   - Click the download button
   - Extract the .woff2 files to `assets/fonts/`

4. **Create `assets/scss/custom.scss`** and paste the CSS:

```scss
/* Paste the CSS from Google Webfonts Helper here */
/* Example for Roboto: */

/* roboto-regular - latin */
@font-face {
  font-display: swap;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url('{{ (resources.Get "fonts/roboto-v30-latin-regular.woff2").RelPermalink }}') format('woff2');
}

/* roboto-700 - latin */
@font-face {
  font-display: swap;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url('{{ (resources.Get "fonts/roboto-v30-latin-700.woff2").RelPermalink }}') format('woff2');
}

/* Note: Wrap the font path with Hugo's resources.Get as shown above */
```

5. **Update config.yaml**:

```yaml
params:
  fonts:
    body: "'Roboto', sans-serif"
    heading: "'Roboto', serif"  # or use a different font
```

> **💡 Tip**: Google Webfonts Helper provides self-hosted fonts with better privacy and performance than Google Fonts CDN. The CSS snippets are copy-ready - just wrap the file paths with Hugo's `resources.Get`!

## Step 5: Create Your First Card

```bash
# Create a card
mkdir -p content/cards/welcome
```

Create `content/cards/welcome/index.md`:

```markdown
---
title: "Welcome!"
---

This is my first card. Click the + to see more details.
```

Create `content/cards/welcome/modal.md`:

```markdown
---
id: welcome
---

# Welcome to My Site

This is the detailed content that appears in the modal when you click the card.

You can add:
- Lists
- Images
- Tables
- And more!
```

## Step 6: Create Your Homepage

Create `content/_index.md`:

```markdown
---
title: Home
---

{{< title >}}My Awesome Site{{< /title >}}

{{< section >}}My Cards{{< /section >}}

{{< card-holder >}}
{{< card welcome >}}
{{< /card-holder >}}
```

## Step 7: Initialize and Run

```bash
# Download theme
hugo mod get -u

# Initialize UIKit (one-time setup)
bash "$(hugo config mounts | jq -rs '.[] | select(.path | contains("z43-cards-theme")) | .dir')/init-theme.sh"

# Start server
hugo server
```

Visit `http://localhost:1313` 🎉

## Step 8: Deploy (Optional)

### Option A: GitHub Pages

1. Copy the deployment workflow:
   ```bash
   mkdir -p .github/workflows
   cp $(hugo mod vendor)/github.com/temporalinterference/z43-cards-theme/.github/workflows/deploy-hugo.yaml .github/workflows/
   ```

2. Enable GitHub Pages in repository **Settings** → **Pages**
3. Push to `main` branch

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

### Option B: Netlify

Create `netlify.toml`:

```toml
[build]
  publish = "public"
  command = "hugo --gc --minify"

[build.environment]
  HUGO_VERSION = "0.152.2"
  DART_SASS_VERSION = "1.90.0"
```

Connect your repository in Netlify dashboard.

## Next Steps

### Add More Cards

```bash
mkdir -p content/cards/my-new-card
# Add index.md and modal.md
```

### Customize Styling

See [README.md](README.md#custom-styling) for advanced customization.

### Add Navigation

Create `content/navigation.md` and use the navbar partial.

### Use More Shortcodes

Available shortcodes:
- `{{< card name >}}` - Display a card
- `{{< section >}}Title{{< /section >}}` - Section heading
- `{{< modal-image src="img.jpg" >}}` - Image modal
- `{{< modal-movie src="video.mp4" >}}` - Video modal
- `{{< image-text src="img.jpg" >}}...{{< /image-text >}}` - Image with text
- And more! See [README.md](README.md#available-shortcodes)

## Troubleshooting

### "failed to download modules"

Make sure you have Go installed and in your PATH. Or use the prebuilt binaries from GitHub.

### CSS not loading

Ensure Dart Sass is installed:
```bash
# macOS
brew install sass/sass/sass

# Linux
curl -LO https://github.com/sass/dart-sass/releases/download/1.90.0/dart-sass-1.90.0-linux-x64.tar.gz
tar -xf dart-sass-1.90.0-linux-x64.tar.gz
export PATH="$PWD/dart-sass:$PATH"
```

### Cards not showing

- Check that card directories are in `content/cards/`
- Ensure `index.md` exists in each card directory
- Verify card names match in shortcodes

## Getting Help

- 📖 Full documentation: [README.md](README.md)
- 🚀 Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Report issues: [GitHub Issues](https://github.com/temporalinterference/z43-cards-theme/issues)
- 💡 See examples: Check the ti-solutions-2024 repository

## Example Sites

- **TI-Solutions**: [temporalinterference.com](https://temporalinterference.com) - The original site using this theme

---

**Ready to build something amazing? Let's go! 🚀**
