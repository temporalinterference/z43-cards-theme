# Deployment Guide

This theme includes a reusable GitHub Actions workflow for deploying Hugo sites to GitHub Pages with branch previews.

## Features

✅ **Branch Previews** - Every branch and PR gets its own preview URL
✅ **Incremental Builds** - Only rebuilds what's needed
✅ **PR Comments** - Automatic comments with preview links
✅ **Fork PR Security** - Security checks for contributions from forks
✅ **Dart Sass Support** - Automatically installs Dart Sass
✅ **SEO Protection** - Branch previews are excluded from search engines

## Quick Setup

### 1. Copy the Workflow File

Copy `.github/workflows/deploy-hugo.yaml` from this theme to your site:

```bash
mkdir -p .github/workflows
cp path/to/z43-cards-theme/.github/workflows/deploy-hugo.yaml .github/workflows/
```

### 2. Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 3. Configure Permissions (if needed)

If you get permission errors, go to **Settings** → **Actions** → **General** → **Workflow permissions** and select:
- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

### 4. Push to Main

```bash
git add .github/workflows/deploy-hugo.yaml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

Your site will be deployed to `https://[username].github.io/[repo]/`

## How It Works

### Main Branch
- Deploys to the root of your GitHub Pages site
- Preserves branch preview directories
- Updates on every push to `main`

### Feature Branches
- Creates a preview at `/branch-[branch-name]/`
- Updates on every push to the branch
- Cleaned up when branch is deleted

### Pull Requests
- Creates/updates branch preview
- Posts comment with preview URL
- Runs security checks for fork PRs

### Preview Index
All branch previews are listed at `/previews.html`

## Configuration

### Hugo Version

Update the Hugo version in the workflow:

```yaml
env:
  HUGO_VERSION: 0.152.2  # Change this
```

### Dart Sass Version

Update the Dart Sass version:

```yaml
env:
  DART_SASS_VERSION: 1.90.0  # Change this
```

### Main Branch Name

If you use a different main branch (e.g., `master`), update these lines:

```yaml
on:
  push:
    branches:
      - 'main'  # Change to your main branch
```

And in the workflow logic:

```yaml
if: github.ref != 'refs/heads/main'  # Update this
```

### Security Checks for Fork PRs

The workflow includes security checks for PRs from forks. Customize the allowed paths:

```yaml
ALLOWED_PATTERNS="^content/|^static/|^layouts/|^data/|^i18n/|^assets/"
```

## Advanced Usage

### Custom Base URL

The workflow automatically uses the GitHub Pages URL. To use a custom domain:

1. Set up your custom domain in **Settings** → **Pages**
2. The workflow will automatically use it

### Branch Cleanup

Branch previews are kept for 7 days after the last build. To change this:

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./current-site
    retention-days: 7  # Change this
```

### Environment Variables

You can add Hugo environment variables:

```yaml
- name: Build with Hugo
  env:
    HUGO_ENVIRONMENT: production
    HUGO_ENV: production
    # Add your custom variables here
    MY_CUSTOM_VAR: value
```

## Troubleshooting

### Build Fails with "go: not found"

Make sure your repository has Hugo modules properly configured in `go.mod`.

### Branch Previews Not Working

Check that:
1. The branch has been pushed to GitHub
2. The workflow has completed successfully
3. You're accessing the correct URL: `/branch-[branch-name]/`

### PR Comments Not Posted

Ensure the workflow has the `pull-requests: write` permission:

```yaml
permissions:
  pull-requests: write  # Must be present
```

### Fork PR Security Checks Failing

Review the security check output in the Actions tab. Common issues:
- Large files in the PR
- Changes outside allowed directories
- Suspicious file types

## Other Deployment Options

The workflow can be adapted for other platforms:

### Netlify

Use Netlify's Hugo build image and configure in `netlify.toml`:

```toml
[build]
  publish = "public"
  command = "hugo --gc --minify"

[build.environment]
  HUGO_VERSION = "0.152.2"
  DART_SASS_VERSION = "1.90.0"

[context.production.environment]
  HUGO_ENV = "production"
```

### Vercel

Create `vercel.json`:

```json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.152.2"
    }
  },
  "buildCommand": "hugo --gc --minify",
  "outputDirectory": "public"
}
```

### Render

See the example build script in Hugo documentation.

## Resources

- [Hugo Deployment Documentation](https://gohugo.io/hosting-and-deployment/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
