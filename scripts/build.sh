#!/bin/bash

# FitGirl Watchlist Extension Build Script for Unix/Linux/macOS

echo ""
echo "========================================"
echo "FitGirl Watchlist Extension Builder"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found"
    echo "Please run this script from the extension root directory"
    exit 1
fi

# Parse command line arguments
PLATFORM=${1:-all}

# Validate platform argument
if [ "$PLATFORM" != "all" ] && [ "$PLATFORM" != "chrome" ] && [ "$PLATFORM" != "firefox" ]; then
    echo "ERROR: Invalid platform '$PLATFORM'"
    echo "Valid platforms: all, chrome, firefox"
    echo ""
    echo "Usage: ./build.sh [platform]"
    echo "Examples:"
    echo "  ./build.sh"
    echo "  ./build.sh chrome"
    echo "  ./build.sh firefox"
    exit 1
fi

# Make the script executable
chmod +x "$0"

# Run the build
echo "Building for platform: $PLATFORM"
echo ""
node build.js "$PLATFORM"

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Build completed successfully!"
    echo "========================================"
    echo ""
    echo "Output directory: dist/"
    echo ""
    echo "Installation instructions:"
    echo ""
    
    if [ "$PLATFORM" = "all" ]; then
        echo "Chrome/Edge:"
        echo "  1. Go to chrome://extensions/"
        echo "  2. Enable 'Developer mode'"
        echo "  3. Click 'Load unpacked' and select dist/chrome/"
        echo ""
        echo "Firefox:"
        echo "  1. Go to about:debugging"
        echo "  2. Click 'This Firefox'"
        echo "  3. Click 'Load Temporary Add-on'"
        echo "  4. Select dist/firefox/manifest.json"
    elif [ "$PLATFORM" = "chrome" ]; then
        echo "Chrome/Edge:"
        echo "  1. Go to chrome://extensions/"
        echo "  2. Enable 'Developer mode'"
        echo "  3. Click 'Load unpacked' and select dist/chrome/"
    elif [ "$PLATFORM" = "firefox" ]; then
        echo "Firefox:"
        echo "  1. Go to about:debugging"
        echo "  2. Click 'This Firefox'"
        echo "  3. Click 'Load Temporary Add-on'"
        echo "  4. Select dist/firefox/manifest.json"
    fi
else
    echo ""
    echo "========================================"
    echo "Build failed!"
    echo "========================================"
    echo ""
    echo "Please check the error messages above."
    echo "Make sure all required files are present."
    exit 1
fi

echo ""
