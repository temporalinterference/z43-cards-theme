# Z43 Cards Theme

A flexible, card-based Hugo theme with UIKit integration, modal system, and horizontal scrolling. Perfect for creating modern, content-rich websites with a focus on visual presentation.

## 🚀 Quick Start

New to the theme? Check out [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

## Features

- **Card-based Layout**: Self-contained content cards with automatic modal integration
- **UIKit Framework**: Full UIKit CSS/JS framework integration
- **Horizontal Scrolling**: Smooth horizontal card scrolling with mouse/touch support
- **Modal System**: Built-in modal system with URL hash support for deep linking
- **Responsive Design**: Mobile-first, fully responsive layouts
- **Customizable**: Easy color, font, and styling customization via config
- **Hugo Module**: Modern Hugo module architecture for easy versioning and updates

## Installation

### Prerequisites

- Hugo Extended version 0.112.0 or higher
- Dart Sass
- Git

> **💡 Easy Setup with mise**: This theme includes a `mise.toml` file. Install [mise](https://mise.jdx.dev/) and run `mise install` to automatically get the correct versions of Hugo, Dart Sass, and Go. No manual installation needed!

```bash
# Install mise (if you don't have it)
curl https://mise.run | sh

# Then install all required tools
mise install

# Activate mise in your shell (adds to PATH)
mise activate
```

### Using Hugo Modules (Recommended)

1. Initialize your Hugo site as a module (if not already done):

```bash
hugo mod init github.com/yourusername/yoursite
```

2. Add the theme to your `config.yaml`:

```yaml
module:
  imports:
    - path: github.com/temporalinterference/z43-cards-theme
```

3. Fetch the module and initialize the theme:

```bash
hugo mod get -u
bash "$(hugo config mounts | jq -rs '.[] | select(.path | contains("z43-cards-theme")) | .dir')/init-theme.sh"
```

> **Note:** The second command initializes the UIKit dependency which is required for the theme to work. This only needs to be run once after installing the theme.

### Using Git Submodule

Alternatively, you can add the theme as a git submodule:

```bash
git submodule add https://github.com/temporalinterference/z43-cards-theme.git themes/z43-cards-theme
git submodule update --init --recursive
```

Then add to your `config.yaml`:

```yaml
theme: z43-cards-theme
```

## Configuration

See `exampleSite/config.yaml` for a complete configuration example. Key configuration options:

### Colors

Customize your site's color scheme:

```yaml
params:
  colors:
    background: "#e0e8f0"
    emphasis: "#1b3764"
    link: "#1485b5"
    # ... see exampleSite/config.yaml for all options
```

### Fonts

Use custom fonts or system fonts:

```yaml
params:
  fonts:
    body: "Your Body Font, sans-serif"
    heading: "Your Heading Font, serif"
    size: "18px"
    lineHeight: "1.2"
```

To use custom web fonts:

1. Place font files in your site's `assets/fonts/` directory
2. Create `assets/scss/custom.scss` and define `@font-face` rules
3. Reference font names in config.yaml

### Card Dimensions

Adjust card sizes if needed:

```yaml
params:
  card:
    width: "348px"
    height: "557px"
```

## Content Structure

### Creating Cards

Cards are the primary content type. Create a card by adding content to `content/cards/[card-name]/`:

```
content/
└── cards/
    └── my-card/
        ├── index.md      # Card preview content
        ├── modal.md      # Full content (appears in modal)
        ├── teaser.jpg    # Optional teaser image
        └── background.jpg # Optional background image
```

**index.md** (Card preview):
```markdown
---
title: "My Card Title"
hyphenate_mobile: true  # Optional: enable hyphenation on mobile
---

This is the preview text that appears on the card.
```

**modal.md** (Full content):
```markdown
---
id: my-card  # Optional: custom ID for URL hash
---

# Full Content

Detailed content that appears when the card is clicked.
```

### Using Card Shortcode

Display cards in your pages using the shortcode:

```markdown
{{< card my-card >}}
```

### Card Holder

Group multiple cards with horizontal scrolling:

```markdown
{{< card-holder >}}
{{< card card-1 >}}
{{< card card-2 >}}
{{< card card-3 >}}
{{< /card-holder >}}
```

## Available Shortcodes

### Core Shortcodes

- `{{< card card-name >}}` - Display a card
- `{{< card-holder >}}...{{< /card-holder >}}` - Group cards with scrolling
- `{{< section >}}Title{{< /section >}}` - Section heading
- `{{< title >}}Main Title{{< /title >}}` - Main page title

### Modal Shortcodes

- `{{< modal-image src="image.jpg" alt="description" >}}` - Image modal
- `{{< modal-movie src="video.mp4" >}}` - Video modal
- `{{< modal-download file="document.pdf" title="Download" >}}` - Download modal
- `{{< modal-link id="modal-id" >}}Link text{{< /modal-link >}}` - Link to existing modal

### Content Shortcodes

- `{{< image-text src="image.jpg" side="left" >}}...{{< /image-text >}}` - Image with text
- `{{< movie src="video.mp4" >}}` - Embedded video
- `{{< slider >}}...{{< /slider >}}` - Image slider
- `{{< popup id="legal" >}}Popup content{{< /popup >}}` - Legal/info popup

### Typography Shortcodes

- `{{< hyphen >}}word{{< /hyphen >}}` - Enable hyphenation
- `{{< nbr >}}text{{< /nbr >}}` - No-break span

## Custom Styling

To add custom styles beyond theme configuration:

1. Create `assets/scss/custom.scss` in your site
2. Add your custom SCSS:

```scss
// Custom styles
.my-custom-class {
  // your styles
}

// Override theme variables if needed
$card-width: 400px;
```

## Layout Templates

The theme provides these layout templates:

- `baseof.html` - Base template
- `home.html` - Homepage layout
- `single.html` - Single page layout
- `section.html` - Section list layout

## Partials

Available partials for customization:

- `header.html` - Site header
- `navbar.html` - Navigation bar
- `footer.html` - Site footer
- `card.html` - Individual card rendering
- `modal-*.html` - Various modal types

## Development

### Local Development

```bash
# Clone the theme
git clone https://github.com/temporalinterference/z43-cards-theme.git
cd z43-cards-theme

# Initialize submodules (UIKit)
git submodule update --init --recursive

# Run with example site
hugo server -s exampleSite
```

## Deployment

The theme includes a reusable GitHub Actions workflow for deploying to GitHub Pages with branch previews.

**Quick Start:**
```bash
# Copy the workflow to your site
cp .github/workflows/deploy-hugo.yaml /path/to/your/site/.github/workflows/

# Enable GitHub Pages in your repository settings
# Push to main branch and you're done!
```

**Features:**
- 🚀 Automatic deployment to GitHub Pages
- 🔀 Branch previews for every PR and branch
- 💬 Automatic PR comments with preview URLs
- 🔒 Security checks for fork PRs
- 🎨 Dart Sass support included

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions and configuration options.

## Credits

- **Theme Development**: Tobi Oetiker ([oetiker.ch](https://oetiker.ch))
- **Design**: Kevin Eason ([z43.swiss](https://z43.swiss))
- **UI Framework**: [UIKit](https://getuikit.com/)

## License

MIT License - see LICENSE file for details

