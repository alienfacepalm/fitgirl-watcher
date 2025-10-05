#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Package Enhancer
 * Adds comprehensive installation instructions to zip and xpi packages
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class PackageEnhancer {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.config = {
      extensionName: "FitGirl Repacks Watchlist",
      version: "1.0.0",
      author: "FitGirl Watchlist Team",
      description:
        "A browser extension to create a watchlist for FitGirl repacks with reminder functionality",
      homepage: "https://github.com/yourusername/fitgirl-watchlist-extension",
    };
  }

  async enhancePackages() {
    console.log("📦 FitGirl Watchlist Extension - Package Enhancer");
    console.log("===============================================\n");

    try {
      // Check if dist directory exists
      if (!fs.existsSync(this.distDir)) {
        console.error(
          '❌ dist/ directory not found. Please run "pnpm run build" first.'
        );
        process.exit(1);
      }

      // Enhance Chrome package
      await this.enhanceChromePackage();

      // Enhance Firefox package
      await this.enhanceFirefoxPackage();

      console.log("\n🎉 Package Enhancement Complete!");
      console.log("===============================");
      console.log("📁 Enhanced packages with comprehensive installation instructions");
      console.log("📋 Each package now includes:");
      console.log("  - Detailed README.md with step-by-step instructions");
      console.log("  - Visual installation guide");
      console.log("  - Troubleshooting section");
      console.log("  - Feature overview");
    } catch (error) {
      console.error("❌ Error enhancing packages:", error.message);
      process.exit(1);
    }
  }

  async enhanceChromePackage() {
    console.log("\n🌐 Enhancing Chrome/Edge package...");

    const chromeDir = path.join(this.distDir, "chrome");
    if (!fs.existsSync(chromeDir)) {
      throw new Error(
        'Chrome build not found. Please run "pnpm run build" first.'
      );
    }

    // Create comprehensive README
    this.createChromeReadme(chromeDir);

    // Create visual installation guide
    this.createInstallationGuide(chromeDir, "Chrome/Edge");

    // Create troubleshooting guide
    this.createTroubleshootingGuide(chromeDir);

    console.log("  ✅ Chrome/Edge package enhanced");
  }

  async enhanceFirefoxPackage() {
    console.log("\n🦊 Enhancing Firefox package...");

    const firefoxDir = path.join(this.distDir, "firefox");
    if (!fs.existsSync(firefoxDir)) {
      throw new Error(
        'Firefox build not found. Please run "pnpm run build" first.'
      );
    }

    // Create comprehensive README
    this.createFirefoxReadme(firefoxDir);

    // Create visual installation guide
    this.createInstallationGuide(firefoxDir, "Firefox");

    // Create troubleshooting guide
    this.createTroubleshootingGuide(firefoxDir);

    console.log("  ✅ Firefox package enhanced");
  }

  createChromeReadme(extensionDir) {
    const readmeContent = `# ${this.config.extensionName} - Chrome/Edge Extension

## 🎮 About This Extension

${this.config.description}

**Version:** ${this.config.version}  
**Author:** ${this.config.author}  
**Website:** ${this.config.homepage}

## ✨ Features

- 🎯 **Easy Watchlist Management**: Add games to your watchlist with a single click
- ⏰ **Smart Reminders**: Set custom reminder intervals (default: 7 days)
- 🔔 **Desktop Notifications**: Get notified when it's time to check your watchlist
- 📱 **Modern UI**: Clean, responsive interface that works on all devices
- 💾 **Data Export/Import**: Backup and restore your watchlist data
- 🎯 **Smart Detection**: Automatically detects game items on fitgirl-repacks.site

## 🚀 Quick Installation

### Method 1: Load Unpacked (Recommended)

1. **Open Chrome/Edge Extensions Page**
   - Chrome: Go to \`chrome://extensions/\`
   - Edge: Go to \`edge://extensions/\`

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select this folder (the one containing this README)
   - The extension should now appear in your extensions list

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in the toolbar
   - Find "${this.config.extensionName}"
   - Click the pin icon to keep it visible

### Method 2: Drag and Drop

1. **Open Extensions Page**
   - Go to \`chrome://extensions/\` (Chrome) or \`edge://extensions/\` (Edge)

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch

3. **Drag and Drop**
   - Simply drag this entire folder onto the extensions page
   - The extension will be automatically installed

## 📋 Step-by-Step Installation Guide

### Step 1: Prepare Your Browser

1. Open Chrome or Microsoft Edge
2. Navigate to the extensions page:
   - **Chrome**: Type \`chrome://extensions/\` in the address bar
   - **Edge**: Type \`edge://extensions/\` in the address bar
3. Press Enter

### Step 2: Enable Developer Mode

1. Look for the "Developer mode" toggle in the top-right corner
2. Click the toggle to enable it
3. You should see additional buttons appear: "Load unpacked", "Pack extension", etc.

### Step 3: Install the Extension

1. Click the "Load unpacked" button
2. Navigate to and select this folder (the one containing manifest.json)
3. Click "Select Folder" or "Open"
4. The extension should now appear in your extensions list

### Step 4: Verify Installation

1. Look for "${this.config.extensionName}" in your extensions list
2. Make sure it's enabled (toggle should be blue/on)
3. You should see the extension icon in your browser toolbar

### Step 5: Test the Extension

1. Visit \`https://fitgirl-repacks.site/\`
2. You should see a purple top bar with "FitGirl Watchlist"
3. Look for "Add to Watchlist" buttons (➕) next to game items
4. Click the extension icon to open the popup and manage your watchlist

## 🎯 How to Use

### Adding Games to Watchlist

1. Visit any page on \`fitgirl-repacks.site\`
2. Look for the "Add to Watchlist" button (➕) next to game items
3. Click the button to add the game to your watchlist
4. The button will change to "In Watchlist" (✅) to confirm

### Managing Your Watchlist

1. Click the extension icon in your browser toolbar
2. View all your watchlisted games
3. Use the search and filter options to find specific games
4. Click on any game to visit its page
5. Remove games from your watchlist as needed

### Setting Reminders

1. Open the extension popup
2. Go to the "Settings" tab
3. Adjust the reminder interval (default: 7 days)
4. Enable/disable desktop notifications
5. Your settings will be saved automatically

## 🔧 Troubleshooting

### Extension Not Appearing

- **Check Developer Mode**: Make sure "Developer mode" is enabled
- **Refresh Extensions Page**: Reload the extensions page and try again
- **Check Folder**: Ensure you selected the correct folder containing manifest.json

### Extension Not Working on FitGirl

- **Check URL**: Make sure you're on \`fitgirl-repacks.site\` (not the old domain)
- **Refresh Page**: Try refreshing the page after installing the extension
- **Check Permissions**: Ensure the extension has permission to access the site

### Icons Not Showing

- **Check Icon Files**: Make sure icon16.png, icon48.png, and icon128.png exist in the icons/ folder
- **File Names**: Icon files must be named exactly as specified
- **File Format**: Icons must be in PNG format

### Notifications Not Working

- **Browser Settings**: Check that notifications are enabled in your browser settings
- **Extension Settings**: Make sure notifications are enabled in the extension settings
- **System Settings**: Ensure your operating system allows notifications from your browser

### Data Not Saving

- **Storage Permissions**: The extension needs storage permissions to save your watchlist
- **Browser Storage**: Check if your browser's storage is full or disabled
- **Private/Incognito Mode**: The extension may not work properly in private browsing mode

## 📁 File Structure

\`\`\`
${this.config.extensionName}/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for FitGirl pages
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── styles.css            # Content script styling
├── icons/                # Extension icons
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
├── README.md             # This file
├── INSTALLATION.md       # Detailed installation guide
└── TROUBLESHOOTING.md    # Troubleshooting guide
\`\`\`

## 🔄 Updates

To update the extension:

1. Download the latest version
2. Remove the old extension from \`chrome://extensions/\`
3. Follow the installation steps again
4. Your watchlist data will be preserved

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Visit the project page: ${this.config.homepage}
3. Check browser console for error messages (F12 → Console tab)

## 📄 License

This extension is provided as-is for educational and personal use.

---

**Enjoy managing your FitGirl repacks watchlist! 🎮**
`;

    fs.writeFileSync(path.join(extensionDir, "README.md"), readmeContent);
  }

  createFirefoxReadme(extensionDir) {
    const readmeContent = `# ${this.config.extensionName} - Firefox Extension

## 🎮 About This Extension

${this.config.description}

**Version:** ${this.config.version}  
**Author:** ${this.config.author}  
**Website:** ${this.config.homepage}

## ✨ Features

- 🎯 **Easy Watchlist Management**: Add games to your watchlist with a single click
- ⏰ **Smart Reminders**: Set custom reminder intervals (default: 7 days)
- 🔔 **Desktop Notifications**: Get notified when it's time to check your watchlist
- 📱 **Modern UI**: Clean, responsive interface that works on all devices
- 💾 **Data Export/Import**: Backup and restore your watchlist data
- 🎯 **Smart Detection**: Automatically detects game items on fitgirl-repacks.site

## 🚀 Quick Installation

### Method 1: Load Temporary Add-on (Recommended)

1. **Open Firefox Debugging Page**
   - Go to \`about:debugging\`

2. **Select This Firefox**
   - Click "This Firefox" in the left sidebar

3. **Load the Extension**
   - Click "Load Temporary Add-on" button
   - Navigate to and select the \`manifest.json\` file in this folder
   - The extension should now appear in your add-ons list

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in the toolbar
   - Find "${this.config.extensionName}"
   - Click the pin icon to keep it visible

### Method 2: Drag and Drop

1. **Open Debugging Page**
   - Go to \`about:debugging\`

2. **Select This Firefox**
   - Click "This Firefox" in the left sidebar

3. **Drag and Drop**
   - Simply drag the \`manifest.json\` file onto the debugging page
   - The extension will be automatically installed

## 📋 Step-by-Step Installation Guide

### Step 1: Prepare Firefox

1. Open Mozilla Firefox
2. Navigate to the debugging page by typing \`about:debugging\` in the address bar
3. Press Enter

### Step 2: Select This Firefox

1. In the left sidebar, click "This Firefox"
2. You should see options for loading temporary add-ons

### Step 3: Install the Extension

1. Click the "Load Temporary Add-on" button
2. Navigate to this folder and select the \`manifest.json\` file
3. Click "Open"
4. The extension should now appear in your add-ons list

### Step 4: Verify Installation

1. Look for "${this.config.extensionName}" in your add-ons list
2. Make sure it's enabled
3. You should see the extension icon in your browser toolbar

### Step 5: Test the Extension

1. Visit \`https://fitgirl-repacks.site/\`
2. You should see a purple top bar with "FitGirl Watchlist"
3. Look for "Add to Watchlist" buttons (➕) next to game items
4. Click the extension icon to open the popup and manage your watchlist

## ⚠️ Important Notes for Firefox

### Temporary Installation

- This is a **temporary installation**
- The extension will be removed when you restart Firefox
- For permanent installation, you need to sign the extension through Mozilla's process

### Permanent Installation (Advanced)

To make the installation permanent:

1. **Sign the Extension**
   - You need to submit the extension to Mozilla for signing
   - Visit: https://addons.mozilla.org/developers/
   - Follow Mozilla's submission process

2. **Alternative: Developer Mode**
   - Install Firefox Developer Edition
   - Use the same temporary installation method
   - Developer Edition allows unsigned extensions

## 🎯 How to Use

### Adding Games to Watchlist

1. Visit any page on \`fitgirl-repacks.site\`
2. Look for the "Add to Watchlist" button (➕) next to game items
3. Click the button to add the game to your watchlist
4. The button will change to "In Watchlist" (✅) to confirm

### Managing Your Watchlist

1. Click the extension icon in your browser toolbar
2. View all your watchlisted games
3. Use the search and filter options to find specific games
4. Click on any game to visit its page
5. Remove games from your watchlist as needed

### Setting Reminders

1. Open the extension popup
2. Go to the "Settings" tab
3. Adjust the reminder interval (default: 7 days)
4. Enable/disable desktop notifications
5. Your settings will be saved automatically

## 🔧 Troubleshooting

### Extension Not Appearing

- **Check Debugging Page**: Make sure you're on \`about:debugging\` and selected "This Firefox"
- **Check manifest.json**: Ensure you selected the correct manifest.json file
- **Refresh Page**: Reload the debugging page and try again

### Extension Not Working on FitGirl

- **Check URL**: Make sure you're on \`fitgirl-repacks.site\` (not the old domain)
- **Refresh Page**: Try refreshing the page after installing the extension
- **Check Permissions**: Ensure the extension has permission to access the site

### Icons Not Showing

- **Check Icon Files**: Make sure icon16.png, icon48.png, and icon128.png exist in the icons/ folder
- **File Names**: Icon files must be named exactly as specified
- **File Format**: Icons must be in PNG format

### Notifications Not Working

- **Browser Settings**: Check that notifications are enabled in Firefox settings
- **Extension Settings**: Make sure notifications are enabled in the extension settings
- **System Settings**: Ensure your operating system allows notifications from Firefox

### Data Not Saving

- **Storage Permissions**: The extension needs storage permissions to save your watchlist
- **Browser Storage**: Check if Firefox's storage is full or disabled
- **Private Mode**: The extension may not work properly in private browsing mode

## 📁 File Structure

\`\`\`
${this.config.extensionName}/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for FitGirl pages
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── styles.css            # Content script styling
├── icons/                # Extension icons
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
├── README.md             # This file
├── INSTALLATION.md       # Detailed installation guide
└── TROUBLESHOOTING.md    # Troubleshooting guide
\`\`\`

## 🔄 Updates

To update the extension:

1. Download the latest version
2. Remove the old extension from \`about:debugging\`
3. Follow the installation steps again
4. Your watchlist data will be preserved

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Visit the project page: ${this.config.homepage}
3. Check browser console for error messages (F12 → Console tab)

## 📄 License

This extension is provided as-is for educational and personal use.

---

**Enjoy managing your FitGirl repacks watchlist! 🎮**
`;

    fs.writeFileSync(path.join(extensionDir, "README.md"), readmeContent);
  }

  createInstallationGuide(extensionDir, browserType) {
    const guideContent = `# Installation Guide - ${browserType}

## 🎯 Visual Installation Steps

### Step 1: Open Extensions Page

${browserType === "Chrome/Edge" ? 
`**Chrome:**
1. Open Chrome browser
2. Type \`chrome://extensions/\` in the address bar
3. Press Enter

**Edge:**
1. Open Microsoft Edge browser
2. Type \`edge://extensions/\` in the address bar
3. Press Enter` :
`**Firefox:**
1. Open Firefox browser
2. Type \`about:debugging\` in the address bar
3. Press Enter
4. Click "This Firefox" in the left sidebar`}

### Step 2: Enable Developer Mode

${browserType === "Chrome/Edge" ? 
`1. Look for the "Developer mode" toggle in the top-right corner
2. Click the toggle to enable it
3. You should see additional buttons appear: "Load unpacked", "Pack extension", etc.` :
`1. You should see "Load Temporary Add-on" button
2. This is already available in Firefox debugging mode`}

### Step 3: Install the Extension

${browserType === "Chrome/Edge" ? 
`1. Click the "Load unpacked" button
2. Navigate to and select this folder (the one containing manifest.json)
3. Click "Select Folder" or "Open"` :
`1. Click the "Load Temporary Add-on" button
2. Navigate to this folder and select the manifest.json file
3. Click "Open"`}

### Step 4: Verify Installation

1. Look for "${this.config.extensionName}" in your extensions/add-ons list
2. Make sure it's enabled
3. You should see the extension icon in your browser toolbar

### Step 5: Test the Extension

1. Visit \`https://fitgirl-repacks.site/\`
2. You should see a purple top bar with "FitGirl Watchlist"
3. Look for "Add to Watchlist" buttons (➕) next to game items
4. Click the extension icon to open the popup

## 🎮 First Time Setup

### Setting Your Preferences

1. **Open Extension Popup**
   - Click the extension icon in your toolbar

2. **Go to Settings**
   - Click the "Settings" tab in the popup

3. **Configure Reminders**
   - Set your preferred reminder interval (default: 7 days)
   - Enable/disable desktop notifications

4. **Save Settings**
   - Your preferences are saved automatically

### Adding Your First Game

1. **Visit FitGirl Repacks**
   - Go to \`https://fitgirl-repacks.site/\`

2. **Find a Game**
   - Browse the available games
   - Look for the "Add to Watchlist" button (➕) next to game items

3. **Add to Watchlist**
   - Click the "Add to Watchlist" button
   - The button will change to "In Watchlist" (✅)

4. **Manage Your Watchlist**
   - Click the extension icon to view your watchlist
   - Use search and filter options to organize your games

## 🔧 Common Installation Issues

### "Load unpacked" Button Not Visible
- **Solution**: Make sure "Developer mode" is enabled
- **Chrome/Edge**: Toggle the switch in the top-right corner
- **Firefox**: This button should always be visible in debugging mode

### "This folder is not a valid extension"
- **Solution**: Make sure you selected the correct folder
- **Check**: The folder should contain manifest.json, background.js, content.js, etc.
- **Chrome/Edge**: Select the entire folder, not individual files
- **Firefox**: Select the manifest.json file specifically

### Extension Icon Not Appearing
- **Solution**: Check if the extension is enabled
- **Chrome/Edge**: Go to \`chrome://extensions/\` and ensure the toggle is on
- **Firefox**: Go to \`about:debugging\` and check the add-on status

### Extension Not Working on FitGirl Site
- **Solution**: Verify you're on the correct domain
- **Correct URL**: \`https://fitgirl-repacks.site/\`
- **Wrong URL**: \`https://fit-girl.repacks/\` (old domain)
- **Action**: Refresh the page after installing the extension

## 📱 Mobile Installation

**Note**: Browser extensions typically don't work on mobile browsers. This extension is designed for desktop browsers only.

## 🔄 Updating the Extension

### How to Update

1. **Download Latest Version**
   - Get the newest version from the project page

2. **Remove Old Extension**
   - Go to extensions page
   - Remove the old version

3. **Install New Version**
   - Follow the installation steps again
   - Your data will be preserved

### Data Preservation

- Your watchlist data is stored in your browser
- Updating the extension won't lose your data
- Data is tied to your browser profile

## 🆘 Need Help?

If you're still having trouble:

1. **Check Browser Console**
   - Press F12 to open developer tools
   - Look for error messages in the Console tab

2. **Verify File Structure**
   - Make sure all required files are present
   - Check that manifest.json is valid

3. **Try Different Method**
   - If "Load unpacked" doesn't work, try drag and drop
   - Restart your browser and try again

4. **Contact Support**
   - Visit the project page: ${this.config.homepage}
   - Check for known issues and solutions

---

**Happy gaming! 🎮**
`;

    fs.writeFileSync(path.join(extensionDir, "INSTALLATION.md"), guideContent);
  }

  createTroubleshootingGuide(extensionDir) {
    const troubleshootingContent = `# Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Extension Installation Issues

#### "Load unpacked" Button Not Visible
**Problem**: The "Load unpacked" button is not showing in the extensions page.

**Solutions**:
- **Chrome/Edge**: Enable "Developer mode" by toggling the switch in the top-right corner
- **Firefox**: Make sure you're on \`about:debugging\` and clicked "This Firefox"
- Refresh the extensions page and try again

#### "This folder is not a valid extension"
**Problem**: Browser says the folder is not a valid extension.

**Solutions**:
- **Chrome/Edge**: Select the entire folder containing manifest.json, not individual files
- **Firefox**: Select the manifest.json file specifically, not the folder
- Verify that manifest.json exists in the selected location
- Check that all required files are present (background.js, content.js, popup.html, etc.)

#### Extension Icon Not Appearing in Toolbar
**Problem**: The extension is installed but the icon doesn't show in the toolbar.

**Solutions**:
- Check if the extension is enabled in the extensions page
- Look for the extension in the extensions menu (puzzle piece icon)
- Pin the extension to the toolbar for easy access
- Restart your browser

### Extension Functionality Issues

#### Extension Not Working on FitGirl Site
**Problem**: The extension doesn't activate or show buttons on fitgirl-repacks.site.

**Solutions**:
- **Check URL**: Make sure you're on \`https://fitgirl-repacks.site/\` (not the old domain)
- **Refresh Page**: Reload the page after installing the extension
- **Check Permissions**: Ensure the extension has permission to access the site
- **Disable Other Extensions**: Try disabling other extensions that might conflict

#### "Add to Watchlist" Buttons Not Appearing
**Problem**: The purple top bar appears but no watchlist buttons are visible.

**Solutions**:
- **Wait for Page Load**: The buttons are added after the page fully loads
- **Check Page Structure**: The extension looks for specific HTML elements
- **Try Different Pages**: Test on different game pages
- **Refresh Page**: Reload the page and wait for buttons to appear

#### Watchlist Data Not Saving
**Problem**: Games added to watchlist disappear after refreshing.

**Solutions**:
- **Check Storage Permissions**: The extension needs storage permissions
- **Clear Browser Cache**: Clear your browser's cache and cookies
- **Check Private Mode**: The extension may not work in private/incognito mode
- **Disable Ad Blockers**: Some ad blockers interfere with extension storage

### Notification Issues

#### Desktop Notifications Not Working
**Problem**: No notifications appear when reminders are due.

**Solutions**:
- **Browser Settings**: Check that notifications are enabled in your browser settings
- **Extension Settings**: Make sure notifications are enabled in the extension popup
- **System Settings**: Ensure your operating system allows notifications from your browser
- **Check Notification Center**: Notifications might be going to your system's notification center

#### Reminders Not Triggering
**Problem**: Reminders are set but never appear.

**Solutions**:
- **Check Reminder Settings**: Verify the reminder interval is set correctly
- **Check Date/Time**: Ensure your system date and time are correct
- **Browser Background**: Make sure your browser is running (not closed)
- **Extension Status**: Verify the extension is still enabled and running

### Performance Issues

#### Extension Slowing Down Browser
**Problem**: Browser becomes slow after installing the extension.

**Solutions**:
- **Check Watchlist Size**: Large watchlists might impact performance
- **Clear Old Data**: Remove old or unused watchlist entries
- **Update Extension**: Make sure you're using the latest version
- **Restart Browser**: Close and reopen your browser

#### High Memory Usage
**Problem**: Extension uses too much memory.

**Solutions**:
- **Limit Watchlist Size**: Keep your watchlist under 100 items
- **Clear Browser Cache**: Clear your browser's cache regularly
- **Disable Unused Features**: Turn off notifications if not needed
- **Update Browser**: Make sure you're using the latest browser version

### Data Issues

#### Watchlist Data Lost
**Problem**: All watchlist data has disappeared.

**Solutions**:
- **Check Browser Profile**: Data is tied to your browser profile
- **Check Sync Settings**: If using browser sync, check sync status
- **Restore from Backup**: Use the export/import feature if you have backups
- **Check Storage**: Ensure your browser's storage isn't full

#### Import/Export Not Working
**Problem**: Can't export or import watchlist data.

**Solutions**:
- **Check File Format**: Import files must be in JSON format
- **Check File Size**: Large files might not import properly
- **Browser Permissions**: Ensure the browser can access downloaded files
- **Try Different Browser**: Test import/export in a different browser

### Browser-Specific Issues

#### Chrome/Edge Issues
**Problem**: Extension works differently in Chrome vs Edge.

**Solutions**:
- **Update Browser**: Make sure you're using the latest version
- **Check Extensions**: Disable other extensions that might conflict
- **Clear Data**: Clear browser data and reinstall extension
- **Check Permissions**: Verify all required permissions are granted

#### Firefox Issues
**Problem**: Extension doesn't work properly in Firefox.

**Solutions**:
- **Check Manifest Version**: Firefox uses Manifest V2, Chrome uses V3
- **Temporary Installation**: Remember that Firefox installations are temporary
- **Developer Edition**: Try Firefox Developer Edition for better extension support
- **Check about:config**: Verify Firefox settings allow extensions

## 🔍 Debugging Steps

### Enable Debug Mode

1. **Open Developer Tools**
   - Press F12 or right-click → "Inspect"

2. **Check Console Tab**
   - Look for error messages
   - Note any red error text

3. **Check Network Tab**
   - Verify that extension files are loading
   - Look for failed requests

### Check Extension Status

1. **Go to Extensions Page**
   - Chrome/Edge: \`chrome://extensions/\`
   - Firefox: \`about:debugging\`

2. **Check Extension Details**
   - Verify it's enabled
   - Check for error messages
   - Look at permissions

3. **Test on Different Pages**
   - Try the extension on different FitGirl pages
   - Test with different browsers

### Collect Information for Support

If you need help, collect this information:

1. **Browser Information**
   - Browser name and version
   - Operating system
   - Extension version

2. **Error Messages**
   - Screenshots of any error messages
   - Console error logs
   - Steps to reproduce the issue

3. **Extension Status**
   - Whether extension is enabled
   - Any error messages in extensions page
   - Watchlist size and settings

## 🆘 Getting Help

### Self-Help Resources

1. **Check This Guide**: Review all sections above
2. **Project Documentation**: Visit ${this.config.homepage}
3. **Browser Help**: Check your browser's extension documentation

### Contact Support

1. **Project Issues**: Report bugs on the project page
2. **Browser Support**: Contact your browser's support team
3. **Community Forums**: Ask for help in relevant communities

### Before Asking for Help

Please try these steps first:

1. ✅ Restart your browser
2. ✅ Clear browser cache and cookies
3. ✅ Disable other extensions temporarily
4. ✅ Try the extension in a different browser
5. ✅ Check that you're on the correct website (fitgirl-repacks.site)

---

**Most issues can be resolved by following the solutions above. If you're still having trouble, don't hesitate to ask for help! 🆘**
`;

    fs.writeFileSync(path.join(extensionDir, "TROUBLESHOOTING.md"), troubleshootingContent);
  }
}

// Run the package enhancer
if (require.main === module) {
  const enhancer = new PackageEnhancer();
  enhancer.enhancePackages().catch(console.error);
}

module.exports = PackageEnhancer;
