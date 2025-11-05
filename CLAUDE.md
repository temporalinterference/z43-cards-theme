# Z43 Cards Theme - Claude Code Instructions

This file provides guidance to Claude Code when working with this Hugo theme.

## Project Overview

This is a Hugo theme module that provides a card-based layout system with UIKit integration. It's designed to be reused across multiple websites, with site-specific customization through config parameters and optional custom SCSS.

## Technologies

- **Hugo**: Static site generator (https://gohugo.io/)
- **UIKit**: CSS/JS framework (https://getuikit.com/) - integrated as git submodule
- Use context7 MCP to stay up-to-date with Hugo and UIKit features

## Theme Architecture

### Customization Strategy

- **Theme-provided**: Layouts, shortcodes, base styles, JavaScript, UIKit
- **Site-specific**: Colors, fonts, logos, content, optional custom SCSS
- **Config-driven**: Colors and fonts are parameterized via `params` in site's config.yaml

### Key Files

- `assets/scss/theme.scss` - Main SCSS with Hugo template variables
- `assets/js/custom.js` - Card scrolling and modal handling
- `layouts/` - All templates and shortcodes
- `exampleSite/config.yaml` - Example configuration showing all options

## Development Guidelines

### Making Theme Changes

1. **Style changes**: Update `assets/scss/theme.scss`
2. **Layout changes**: Update templates in `layouts/`
3. **New shortcodes**: Add to `layouts/shortcodes/`
4. **JavaScript**: Modify `assets/js/custom.js`

### Testing Changes

Test with the original ti-solutions-2024 site:
```bash
cd ../ti-solutions-2024
hugo server
```

### Important Patterns

- **Parameterization**: Use `{{ .Site.Params.colors.emphasis | default "#1b3764" }}` pattern
- **System fonts**: Default to system font stacks, allow override
- **Resource paths**: Theme resources use `resources.Get`, sites can override
- **Modal IDs**: Must start with `modal-` or `popup-` prefix

## Hugo Module Structure

This is a Hugo module (`github.com/temporalinterference/z43-cards-theme`). Sites import it via:
```yaml
module:
  imports:
    - path: github.com/temporalinterference/z43-cards-theme
```

## UIKit Integration

UIKit is included as a git submodule at `assets/uikit/`. The theme uses:
- Pre-built JS from `uikit/dist/`
- SCSS sources from `uikit/src/scss/` for customization

## Card System

The core feature is the card-based content system:
- Cards in `content/cards/[name]/`
- Each card has `index.md` (preview) and optional `modal.md` (detail)
- Shortcode: `{{< card name >}}` renders the card
- JavaScript handles horizontal scrolling and modal behavior

IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
