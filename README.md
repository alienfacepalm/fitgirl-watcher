# FitGirl Repacks Watchlist Extension

A browser extension that adds a watchlist feature to FitGirl repacks website, allowing you to bookmark games and set reminders to check them out later.

---

## 🎯 **WANT TO INSTALL? CLICK BELOW!** 🎯

**[⬇️ DOWNLOAD NOW ⬇️](https://github.com/alienfacepalm/fitgirl-watcher/releases/latest)**

*Pick your browser and follow the 3 simple steps below!*

---

## 🚀 Quick Start (For Users)

### 1. Download
**👉 [CLICK HERE TO DOWNLOAD](https://github.com/alienfacepalm/fitgirl-watcher/releases/latest) 👈**

Then pick your browser:
- **🟢 [Chrome Download](https://github.com/alienfacepalm/fitgirl-watcher/releases/latest/download/fitgirl-watchlist-*-chrome.zip)** - `fitgirl-watchlist-*-chrome.zip`
- **🔵 [Edge Download](https://github.com/alienfacepalm/fitgirl-watcher/releases/latest/download/fitgirl-watchlist-*-edge.zip)** - `fitgirl-watchlist-*-edge.zip`
- **🦁 [Safari Download](https://github.com/alienfacepalm/fitgirl-watcher/releases/latest/download/fitgirl-watchlist-*-safari.zip)** - `fitgirl-watchlist-*-safari.zip`
- **🦊 [Firefox Download](https://github.com/alienfacepalm/fitgirl-watcher/releases/latest/download/fitgirl-watchlist-*-firefox.xpi)** - `fitgirl-watchlist-*-firefox.xpi`

### 2. Install

**🟢 Chrome/Edge:**
1. **Extract the ZIP file** (double-click it)
2. **Click here:** [chrome://extensions/](chrome://extensions/) (Chrome) or [edge://extensions/](edge://extensions/) (Edge)
3. **Toggle "Developer mode"** (top-right corner)
4. **Click "Load unpacked"** and select the extracted folder

**🦁 Safari:**
1. **Extract the ZIP file** (double-click it)
2. **Open Safari** → **Preferences** → **Advanced**
3. **Check "Show Develop menu in menu bar"**
4. **Go to Develop** → **Show Extension Builder**
5. **Click "+"** and select the extracted folder

**🦊 Firefox:**
1. **Click here:** [about:debugging](about:debugging)
2. **Click "This Firefox"** → **"Load Temporary Add-on"**
3. **Select the .xpi file** you downloaded

### 3. Use
**🎮 [CLICK HERE TO START USING THE EXTENSION](https://fitgirl-repacks.site) 🎮**

Visit the FitGirl website and start adding games to your watchlist!

---

## ✨ Features

- 🎮 **Easy Watchlist Management**: Add games to your watchlist with a single click
- ⏰ **Smart Reminders**: Set custom reminder intervals (default: 7 days)
- 🔔 **Desktop Notifications**: Get notified when it's time to check your watchlist
- 📱 **Modern UI**: Clean, responsive interface that works on all devices
- 💾 **Data Export/Import**: Backup and restore your watchlist data
- 🎯 **Smart Detection**: Automatically detects game items on FitGirl pages

---

# 👨‍💻 For Developers

## Installation

### Package Manager

- PNPM is preferred for this repo (faster, disk-efficient). If you don't have it:

  ```bash
  # Install PNPM (choose one)
  # Corepack (Node 16.13+):
  corepack enable && corepack prepare pnpm@latest --activate

  # npm:
  npm install -g pnpm

  # Homebrew (macOS/Linux):
  brew install pnpm

  # Curl (official install script):
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  ```

  You can still use npm, but commands and lockfile are optimized for pnpm.

### Easy Installation with Native Installers

The easiest way to install the extension is using the native HTML installers:

1. **Download the latest release** from the [Releases](https://github.com/alienfacepalm/fitgirl-watcher/releases) page
2. **Extract the installer package** for your browser:
   - `fitgirl-watchlist-chrome-installer.zip` for Chrome/Edge
   - `fitgirl-watchlist-firefox-installer.zip` for Firefox
   - `fitgirl-watchlist-installers.zip` for both browsers
3. **Run the installer**:
   - **Any OS**: Simply double-click the `.html` installer file
   - The installer will open in your default browser
   - Follow the on-screen instructions to set preferences and install

The native installer uses only standard web technologies (HTML, CSS, JavaScript) and works on any modern browser without requiring additional software.

### Quick Build & Install

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/alienfacepalm/fitgirl-watcher.git
   cd fitgirl-watcher
   ```

2. **Install Dependencies**

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install
   ```

3. **Generate Icons** (Required)

   ```bash
   # Using pnpm
   pnpm run icons
   # Or using npm
   npm run icons
   # Then open assets/generate-icons.html in your browser and download the PNG icons
   ```

4. **Build the Extension**

   ```bash
   # Build for all platforms
   pnpm run build
   # or build for specific platforms
   pnpm run build:chrome
   pnpm run build:firefox

   # Or using npm
   npm run build
   npm run build:chrome
   npm run build:firefox
   ```

5. **Create Installers** (Optional but Recommended)

   ```bash
   # Create native HTML installers (recommended)
   pnpm run native-installers
   # Or create script-based installers
   pnpm run installers
   # Or create everything at once
   pnpm run build:native-installers
   ```

6. **Install the Extension**
   - **Easy Installation**: Use the native HTML installers in `dist/native-installers/` - just double-click any `.html` file
   - **Script-based Installation**: Use the installers in `dist/installers/` - run the appropriate script for your browser and OS
   - **Manual Installation**:
     - **Chrome/Edge**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `dist/chrome/`
     - **Firefox**: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select `dist/firefox/manifest.json`

### From Source (Developer Mode)

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/alienfacepalm/fitgirl-watcher.git
   cd fitgirl-watcher
   ```

2. **Generate Icons** (Required)

   - Open `assets/generate-icons.html` in your browser
   - Click the download buttons to generate the required PNG icons
   - Place the downloaded PNG files in the `assets/icons/` directory

3. **Build and Load the Extension**
   ```bash
   npm run build
   ```
   - Open Chrome/Edge and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `dist/chrome/` folder
   - The extension should now appear in your extensions list

### Browser Compatibility

- ✅ Chrome 88+ (Manifest V3)
- ✅ Edge 88+ (Manifest V3)
- ✅ Firefox (with minor modifications)

## Usage

### Adding Games to Watchlist

1. Visit any page on `fitgirl-repacks.site`
2. Look for the "Add to Watchlist" button (➕) next to game items
3. Click the button to add the game to your watchlist
4. The button will change to "In Watchlist" (✅) to confirm

### Managing Your Watchlist

1. Click the extension icon in your browser toolbar
2. View all your watchlisted games
3. Use the search and sort features to organize your list
4. Click "Visit" to open the game page
5. Click "Remove" to remove games from your watchlist

### Settings

1. Open the extension popup
2. Click the "Settings" tab
3. Configure:
   - **Reminder Interval**: How often to remind you (1-365 days)
   - **Reminder Time**: What time to show notifications
   - **Notifications**: Enable/disable desktop notifications

### Data Management

- **Export**: Download your watchlist as a JSON file
- **Import**: Restore your watchlist from a previously exported file
- **Clear All**: Remove all watchlist data (use with caution!)

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension standard
- **Storage**: Uses Chrome's local storage API (no external database required)
- **Background Script**: Handles data persistence and reminder scheduling
- **Content Script**: Injects UI elements into FitGirl pages
- **Popup Interface**: Provides watchlist management and settings

### Data Storage

The extension stores data locally in your browser using Chrome's storage API:

- Watchlist items are stored with unique IDs
- Settings are stored separately for easy management
- All data is automatically synced across devices (if Chrome sync is enabled)

### Permissions

- `storage`: Save and retrieve watchlist data
- `activeTab`: Access current tab information
- `scripting`: Inject content scripts into FitGirl pages
- `notifications`: Show desktop notifications for reminders
- `alarms`: Schedule reminder checks
- `host_permissions`: Access fitgirl-repacks.site domain

## Development

### Project Structure

```
fitgirl-watcher/
├── src/                  # Source files
│   ├── manifest.json     # Chrome/Edge manifest (Manifest V3)
│   ├── manifest-firefox.json # Firefox manifest (Manifest V2)
│   ├── background.js     # Background service worker
│   ├── content.js        # Content script for FitGirl pages
│   ├── popup.html        # Extension popup interface
│   ├── popup.js          # Popup functionality
│   ├── popup.css         # Popup styling
│   └── styles.css        # Content script styling
├── assets/               # Static assets
│   ├── icons/            # Extension icons
│   │   ├── icon.svg      # Source SVG icon
│   │   ├── icon16.png    # 16x16 PNG (required)
│   │   ├── icon48.png    # 48x48 PNG (required)
│   │   └── icon128.png   # 128x128 PNG (required)
│   └── generate-icons.html # Icon generation helper
├── scripts/              # Build scripts
│   ├── build.js          # Universal build script
│   ├── build-chrome.js   # Chrome/Edge build script
│   ├── build-firefox.js  # Firefox build script
│   ├── build.config.js   # Build configuration
│   ├── build.bat         # Windows build script
│   └── build.sh          # Unix build script
├── docs/                 # Documentation
│   ├── BUILD.md          # Build guide
│   └── install.md        # Installation guide
├── tests/                # Test files (future)
├── dist/                 # Build output (generated)
├── package.json          # Project metadata
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

### Building

The extension includes a comprehensive build system for multiple browsers and user-friendly installers:

#### Available Build Commands

```bash
# Basic builds
pnpm run build              # Build for all platforms
pnpm run build:chrome       # Build for Chrome/Edge only
pnpm run build:firefox      # Build for Firefox only

# Installer creation
pnpm run installers         # Create user-friendly installers
pnpm run native-installers  # Create native HTML installers
pnpm run package:installers # Package installers into zip files

# Combined commands
pnpm run build:installers   # Build + create installers
pnpm run build:native-installers # Build + create native installers

# Manual release helpers (see Releases section below)
bash scripts/release.sh patch
bash scripts/release.sh minor
bash scripts/release.sh major
bash scripts/release.sh prerelease
```

#### Build Output

The build system creates several types of packages:

1. **Extension Packages** (in `dist/`):

   - `fitgirl-watchlist-chrome-v1.0.0.zip` - Chrome/Edge extension
   - `fitgirl-watchlist-firefox-v1.0.0.xpi` - Firefox extension

2. **Installer Packages** (in `dist/packages/`):

   - `fitgirl-watchlist-chrome-installer-v1.0.0.zip` - Chrome/Edge installer
   - `fitgirl-watchlist-firefox-installer-v1.0.0.zip` - Firefox installer
   - `fitgirl-watchlist-installers-v1.0.0.zip` - Combined installer (both browsers)

3. **Native HTML Installers** (in `dist/native-installers/`):

   - `chrome-installer.html` - Chrome/Edge installer (double-click to run)
   - `firefox-installer.html` - Firefox installer (double-click to run)
   - `combined-installer.html` - Both browsers installer (double-click to run)

4. **Script-based Installers** (in `dist/installers/`):

   - `chrome/` - Chrome/Edge installer with scripts for Windows, macOS, Linux
   - `firefox/` - Firefox installer with scripts for Windows, macOS, Linux

5. **Release Packages** (in `releases/`):
   - `fitgirl-watchlist-{version}-{timestamp}-chrome.zip` - Chrome/Edge extension
   - `fitgirl-watchlist-{version}-{timestamp}-firefox.xpi` - Firefox extension
   - `fitgirl-watchlist-{version}-{timestamp}-installers.zip` - Script-based installers
   - `fitgirl-watchlist-{version}-{timestamp}-native-installers.zip` - HTML installers
   - `fitgirl-watchlist-{version}-{timestamp}-complete.zip` - All packages combined
   - `RELEASE_NOTES_{version}.md` - Release notes
   - `CHANGELOG.md` - Complete changelog

#### Release System

The project includes an automated release system with semantic versioning:

- **Automatic Version Bumping**: Uses semantic versioning (major.minor.patch)
- **Timestamped Filenames**: Each release includes a timestamp for uniqueness
- **Comprehensive Packaging**: Creates all necessary packages automatically
- **Release Notes**: Generates detailed release notes and changelog
- **Documentation**: Includes comprehensive installation guides in each package

The extension includes a comprehensive build system for multiple browsers:

```bash
# Build for all platforms
npm run build

# Build for specific platforms
npm run build:chrome
npm run build:firefox

# Clean build directory
npm run clean
```

### Build Output

The build process creates platform-specific packages:

```
dist/
├── chrome/                    # Chrome/Edge extension files
├── firefox/                   # Firefox extension files
├── fitgirl-watchlist-chrome-v1.0.0.zip
└── fitgirl-watchlist-firefox-v1.0.0.xpi
```

### Platform Differences

- **Chrome/Edge**: Uses Manifest V3 with service worker background script
- **Firefox**: Uses Manifest V2 with persistent background script

See [BUILD.md](BUILD.md) for detailed build instructions.

### Packaging

To create distribution packages:

```bash
npm run package
```

This builds the extension and creates installable packages for both platforms.

## Releases

Manual, script-driven releases with semantic versioning and assets in `releases/`:

```bash
# One-time (Husky hooks)
pnpm install
pnpm exec husky init

# Ensure zip exists on Linux
sudo apt update && sudo apt install -y zip

# Create a release (choose one bump): major | minor | patch | prerelease
bash scripts/release.sh patch

# Push commit and tag
git push && git push origin v$(node -p "require('./package.json').version")
```

Then upload the artifacts from `releases/` to GitHub Releases if desired: https://github.com/alienfacepalm/fitgirl-watcher/releases

## Troubleshooting

### Common Issues

1. **Icons not showing**: Make sure you've generated the PNG icons and placed them in the `icons/` directory
2. **Extension not working**: Check that you're on a `fitgirl-repacks.site` page
3. **Notifications not working**: Ensure notifications are enabled in your browser settings
4. **Data not saving**: Check that the extension has storage permissions

### Debug Mode

1. Open Chrome DevTools (F12)
2. Go to the "Console" tab
3. Look for any error messages from the extension
4. Check the "Application" tab → "Storage" → "Local Storage" for data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is not affiliated with FitGirl Repacks. It's an independent tool created to enhance the user experience on the FitGirl website.

## Support

If you encounter any issues or have suggestions:

1. Check the [Issues](https://github.com/alienfacepalm/fitgirl-watcher/issues) page
2. Create a new issue with detailed information
3. Include your browser version and extension version

---

**Happy gaming! 🎮**
# fitgirl-watcher
