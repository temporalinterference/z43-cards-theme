#!/bin/bash
# Initialize Z43 Cards Theme
# This script fetches the UIKit submodule which is required for the theme to work.
# Run this once after installing the theme as a Hugo module.

set -e

echo "🎨 Initializing Z43 Cards Theme..."

# Determine the theme directory
# If running from the theme directory itself
if [ -f "go.mod" ] && grep -q "z43-cards-theme" go.mod; then
    THEME_DIR="."
else
    # If running from a Hugo site, find the theme in the module cache
    THEME_DIR=$(hugo mod graph 2>/dev/null | grep z43-cards-theme | awk '{print $2}' | head -1)

    if [ -z "$THEME_DIR" ]; then
        echo "❌ Could not find z43-cards-theme module."
        echo "   Make sure you have added the theme to your config.yaml:"
        echo "   module:"
        echo "     imports:"
        echo "       - path: github.com/temporalinterference/z43-cards-theme"
        echo ""
        echo "   Then run: hugo mod get"
        exit 1
    fi
fi

echo "📁 Theme directory: $THEME_DIR"

# Check if UIKit is already initialized
if [ -f "$THEME_DIR/assets/uikit/package.json" ]; then
    echo "✅ UIKit submodule already initialized"
    exit 0
fi

# Initialize the UIKit submodule
echo "📦 Fetching UIKit submodule..."
cd "$THEME_DIR"

if [ ! -f ".gitmodules" ]; then
    echo "❌ Error: .gitmodules not found in theme directory"
    exit 1
fi

git submodule update --init --recursive

echo "✅ Theme initialization complete!"
echo ""
echo "You can now run 'hugo server' to start your site."
