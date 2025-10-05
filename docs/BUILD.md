# Build Guide - FitGirl Watchlist Extension

This guide explains how to build the FitGirl Watchlist extension for different browsers.

## Quick Start

```bash
# Build for all platforms
npm run build

# Build for specific platform
npm run build:chrome
npm run build:firefox

# Clean build directory
npm run clean
```

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Required PNG icons** (see Icon Generation section)
3. **All source files** in the project directory

## Build Process

### 1. Generate Icons

Before building, you need to generate the required PNG icons:

```bash
# Open the icon generator in your browser
npm run icons
# Then open assets/generate-icons.html in your browser
```

Or manually create these files in the `assets/icons/` directory:

- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

### 2. Build the Extension

#### Build for All Platforms

```bash
npm run build
# or
node scripts/build.js
```

#### Build for Chrome/Edge Only

```bash
npm run build:chrome
# or
node scripts/build.js chrome
```

#### Build for Firefox Only

```bash
npm run build:firefox
# or
node scripts/build.js firefox
```

### 3. Build Output

The build process creates:

```
dist/
├── chrome/                    # Chrome/Edge extension files
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── styles.css
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── firefox/                   # Firefox extension files
│   ├── manifest.json          # Firefox-specific manifest
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── styles.css
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── fitgirl-watchlist-chrome-v1.0.0.zip
└── fitgirl-watchlist-firefox-v1.0.0.xpi
```

## Platform Differences

### Chrome/Edge (Manifest V3)

- Uses `manifest.json` with Manifest V3 format
- Background script runs as service worker
- Uses `action` instead of `browser_action`
- Requires `host_permissions` for domain access

### Firefox (Manifest V2)

- Uses `manifest-firefox.json` with Manifest V2 format
- Background script runs persistently
- Uses `browser_action` instead of `action`
- Permissions include domain access directly
- Requires `applications.gecko.id` for identification

## Installation

### Chrome/Edge

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select the `dist/chrome/` folder
4. Or install the `.zip` file from `dist/`

### Firefox

1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from `dist/firefox/`
5. Or install the `.xpi` file from `dist/`

## Build Scripts Reference

### Available Scripts

| Script                  | Description                       |
| ----------------------- | --------------------------------- |
| `npm run build`         | Build for all platforms           |
| `npm run build:chrome`  | Build for Chrome/Edge only        |
| `npm run build:firefox` | Build for Firefox only            |
| `npm run build:all`     | Same as `npm run build`           |
| `npm run package`       | Build and show package info       |
| `npm run clean`         | Clean the dist directory          |
| `npm run icons`         | Show icon generation instructions |

### Build Script Options

```bash
# Show help
node build.js --help

# Build specific platform
node build.js chrome
node build.js firefox
node build.js all
```

## Troubleshooting

### Common Issues

#### Missing Icons

```
⚠️ Missing icons: icon16.png, icon48.png, icon128.png
```

**Solution:** Generate icons using `generate-icons.html` or create them manually.

#### Build Fails

```
❌ Build failed: Error message
```

**Solutions:**

- Check that all required files exist
- Ensure Node.js is installed
- Verify file permissions
- Check for syntax errors in source files

#### Extension Won't Load

**Solutions:**

- Verify all required files are present
- Check browser console for errors
- Ensure manifest.json is valid
- Test on `fitgirl-repacks.site` domain

### File Structure Validation

The build process validates these required files:

- `manifest.json` (Chrome) or `manifest-firefox.json` (Firefox)
- `background.js`
- `content.js`
- `popup.html`
- `popup.js`
- `popup.css`
- `styles.css`
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

## Development

### File Watching

The build system can watch for changes during development:

```bash
# Watch for changes and rebuild
node build.js --watch
```

### Configuration

Modify `build.config.js` to customize:

- Build output directories
- File inclusion/exclusion patterns
- Platform-specific settings
- Icon generation templates

### Custom Builds

You can create custom build configurations by modifying the build scripts or configuration file.

## Publishing

### Chrome Web Store

1. Build the extension: `npm run build:chrome`
2. Zip the `dist/chrome/` directory
3. Upload to Chrome Web Store Developer Dashboard

### Firefox Add-ons

1. Build the extension: `npm run build:firefox`
2. Use the generated `.xpi` file
3. Upload to Firefox Add-ons Developer Hub

### Manual Distribution

1. Build for all platforms: `npm run build`
2. Distribute the appropriate package files:
   - Chrome: `fitgirl-watchlist-chrome-v1.0.0.zip`
   - Firefox: `fitgirl-watchlist-firefox-v1.0.0.xpi`

## Version Management

The build system automatically uses the version from `package.json`. To update:

1. Edit `package.json` version field
2. Run the build: `npm run build`
3. The version will be applied to manifests and package names

## Advanced Usage

### Custom Build Configuration

```javascript
// build.config.js
module.exports = {
  extension: {
    name: "My Custom Extension",
    version: "2.0.0",
  },
  build: {
    distDir: "custom-dist",
    includeFiles: ["custom-file.js"],
  },
};
```

### Environment-Specific Builds

```bash
# Development build
NODE_ENV=development npm run build

# Production build
NODE_ENV=production npm run build
```

## Support

For build-related issues:

1. Check this documentation
2. Review the build output for error messages
3. Verify all prerequisites are met
4. Check file permissions and structure

---

**Happy building! 🚀**
