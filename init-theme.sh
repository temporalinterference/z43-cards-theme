#!/bin/bash
# Initialize Z43 Cards Theme
# This script fetches the UIKit submodule which is required for the theme to work.
# Run this once after installing the theme as a Hugo module.

set -e

echo "🎨 Initializing Z43 Cards Theme..."

# Determine the theme directory - use the directory where this script lives
THEME_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📁 Theme directory: $THEME_DIR"

# Check if UIKit is already initialized
if [ -f "$THEME_DIR/assets/uikit/package.json" ]; then
    echo "✅ UIKit submodule already initialized"
    exit 0
fi

# Check if we're in a read-only Hugo module cache
if [ ! -w "$THEME_DIR" ]; then
    echo "⚠️  Theme directory is read-only (Hugo module cache)"
    echo "📦 Making theme writable and fetching UIKit..."

    # Make the directory writable
    chmod -R u+w "$THEME_DIR"
fi

# Initialize the UIKit submodule
echo "📦 Fetching UIKit submodule..."

if [ ! -f "$THEME_DIR/.gitmodules" ]; then
    echo "❌ Error: .gitmodules not found in theme directory"
    exit 1
fi

# Check if this is a git repository
if [ -d "$THEME_DIR/.git" ]; then
    # We're in a git repo, use git submodule
    cd "$THEME_DIR"
    git submodule update --init --recursive
else
    # We're in Hugo module cache (no .git), clone UIKit directly
    echo "📥 Cloning UIKit directly (not a git repository)..."
    UIKIT_URL=$(grep -A2 "assets/uikit" "$THEME_DIR/.gitmodules" | grep url | awk '{print $3}')
    git clone --depth 1 "$UIKIT_URL" "$THEME_DIR/assets/uikit"
fi

echo "✅ Theme initialization complete!"
echo ""
echo "You can now run 'hugo server' to start your site."
