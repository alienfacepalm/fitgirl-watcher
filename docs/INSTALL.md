# Installation Guide

## Quick Start

1. **Download the extension files** to a folder on your computer

2. **Generate the required icons**:

   - Open `generate-icons.html` in your web browser
   - Click the download buttons to generate PNG icons
   - Save the downloaded files in the `icons/` folder

3. **Load the extension in Chrome/Edge**:

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right corner)
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now be installed and active

4. **Test the extension**:
   - Visit `https://fitgirl-repacks.site/`
   - Look for the purple top bar with "FitGirl Watchlist"
   - Try adding a game to your watchlist

## Detailed Steps

### Step 1: Prepare the Extension Files

Make sure you have all these files in your extension folder:

- `manifest.json`
- `background.js`
- `content.js`
- `popup.html`
- `popup.js`
- `popup.css`
- `styles.css`
- `icons/icon16.png` (16x16 pixels)
- `icons/icon48.png` (48x48 pixels)
- `icons/icon128.png` (128x128 pixels)

### Step 2: Generate Icons

The extension requires PNG icon files. You can generate them using the included helper:

1. Open `generate-icons.html` in your browser
2. Click the download buttons for each size
3. Save the files in the `icons/` directory with the correct names

### Step 3: Install in Chrome

1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar
3. Toggle "Developer mode" ON (top right corner)
4. Click "Load unpacked" button
5. Navigate to and select your extension folder
6. The extension should appear in your extensions list

### Step 4: Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome toolbar
2. Find "FitGirl Repacks Watchlist"
3. Click the pin icon to keep it visible in the toolbar

### Step 5: Test the Extension

1. Visit `https://fitgirl-repacks.site/`
2. You should see a purple top bar with "FitGirl Watchlist"
3. Look for "Add to Watchlist" buttons next to games
4. Click the extension icon to open the popup and manage your watchlist

## Troubleshooting

### Extension Not Loading

- Make sure all required files are present
- Check that the PNG icons are in the `icons/` folder
- Verify the `manifest.json` file is valid JSON

### Icons Not Showing

- Ensure you have generated the PNG icons
- Check that the icon files are named correctly (icon16.png, icon48.png, icon128.png)
- Verify the icons are in the `icons/` directory

### Extension Not Working on FitGirl

- Make sure you're on a `fitgirl-repacks.site` domain page
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the page

### Notifications Not Working

- Check browser notification permissions
- Go to Chrome Settings → Privacy and Security → Site Settings → Notifications
- Make sure notifications are allowed for the extension

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "FitGirl Repacks Watchlist"
3. Click "Remove"
4. Confirm the removal

Your watchlist data will be deleted when you uninstall the extension.
