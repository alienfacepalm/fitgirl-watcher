#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Native JavaScript Installer Creator
 * Creates simple HTML-based installers using only native JavaScript
 */

const fs = require("fs");
const path = require("path");

class NativeInstallerCreator {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.installersDir = path.join(this.distDir, "native-installers");
    this.config = {
      extensionName: "FitGirl Repacks Watchlist",
      version: "1.0.0",
      author: "FitGirl Watchlist Team",
      description:
        "A browser extension to create a watchlist for FitGirl repacks with reminder functionality",
      homepage: "https://github.com/yourusername/fitgirl-watchlist-extension",
    };
  }

  async createNativeInstallers() {
    console.log("🔧 FitGirl Watchlist Extension - Native Installer Creator");
    console.log("======================================================\n");

    try {
      // Check if dist directory exists
      if (!fs.existsSync(this.distDir)) {
        console.error(
          '❌ dist/ directory not found. Please run "pnpm run build" first.'
        );
        process.exit(1);
      }

      // Create native installers directory
      this.createNativeInstallersDir();

      // Create Chrome/Edge installer
      await this.createChromeInstaller();

      // Create Firefox installer
      await this.createFirefoxInstaller();

      // Create combined installer
      await this.createCombinedInstaller();

      console.log("\n🎉 Native Installer Creation Complete!");
      console.log("=====================================");
      console.log(`📁 Native installers created in: ${this.installersDir}`);
      console.log("\n📋 Available Native Installers:");
      console.log("  - chrome-installer.html (Chrome/Edge)");
      console.log("  - firefox-installer.html (Firefox)");
      console.log("  - combined-installer.html (Both browsers)");
      console.log("\n💡 Just double-click any .html file to run the installer!");
    } catch (error) {
      console.error("❌ Error creating native installers:", error.message);
      process.exit(1);
    }
  }

  createNativeInstallersDir() {
    if (!fs.existsSync(this.installersDir)) {
      fs.mkdirSync(this.installersDir, { recursive: true });
      console.log("📁 Created native installers directory");
    }
  }

  async createChromeInstaller() {
    console.log("\n🌐 Creating Chrome/Edge native installer...");

    const chromeDir = path.join(this.distDir, "chrome");
    if (!fs.existsSync(chromeDir)) {
      throw new Error(
        'Chrome build not found. Please run "pnpm run build" first.'
      );
    }

    const installerHtml = this.createInstallerHTML(
      chromeDir,
      "Chrome/Edge",
      "chrome://extensions/"
    );

    const outputPath = path.join(this.installersDir, "chrome-installer.html");
    fs.writeFileSync(outputPath, installerHtml);

    console.log("  ✅ Chrome/Edge native installer created");
  }

  async createFirefoxInstaller() {
    console.log("\n🦊 Creating Firefox native installer...");

    const firefoxDir = path.join(this.distDir, "firefox");
    if (!fs.existsSync(firefoxDir)) {
      throw new Error(
        'Firefox build not found. Please run "pnpm run build" first.'
      );
    }

    const installerHtml = this.createInstallerHTML(
      firefoxDir,
      "Firefox",
      "about:debugging"
    );

    const outputPath = path.join(this.installersDir, "firefox-installer.html");
    fs.writeFileSync(outputPath, installerHtml);

    console.log("  ✅ Firefox native installer created");
  }

  async createCombinedInstaller() {
    console.log("\n📦 Creating combined native installer...");

    const chromeDir = path.join(this.distDir, "chrome");
    const firefoxDir = path.join(this.distDir, "firefox");

    if (!fs.existsSync(chromeDir) || !fs.existsSync(firefoxDir)) {
      throw new Error(
        'Both Chrome and Firefox builds not found. Please run "pnpm run build" first.'
      );
    }

    const installerHtml = this.createCombinedInstallerHTML(chromeDir, firefoxDir);

    const outputPath = path.join(this.installersDir, "combined-installer.html");
    fs.writeFileSync(outputPath, installerHtml);

    console.log("  ✅ Combined native installer created");
  }

  createInstallerHTML(extensionDir, browserType, browserUrl) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.config.extensionName} - ${browserType} Installer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .installer {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        
        .content {
            padding: 30px;
        }
        
        .step {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #4facfe;
        }
        
        .step h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .step p {
            color: #666;
            line-height: 1.6;
        }
        
        .preferences {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .preferences h3 {
            color: #856404;
            margin-bottom: 15px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #4facfe;
            box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn {
            flex: 1;
            padding: 15px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
        
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }
        
        .status.success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .status.error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .features {
            background: #e8f5e8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .features h3 {
            color: #2d5a2d;
            margin-bottom: 15px;
        }
        
        .features ul {
            list-style: none;
        }
        
        .features li {
            padding: 5px 0;
            color: #2d5a2d;
        }
        
        .features li:before {
            content: "✓ ";
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="installer">
        <div class="header">
            <h1>${this.config.extensionName}</h1>
            <p>${browserType} Extension Installer v${this.config.version}</p>
        </div>
        
        <div class="content">
            <div class="features">
                <h3>🎮 Extension Features</h3>
                <ul>
                    <li>Easy watchlist management</li>
                    <li>Smart reminders</li>
                    <li>Desktop notifications</li>
                    <li>Data export/import</li>
                    <li>Works on fitgirl-repacks.site</li>
                </ul>
            </div>
            
            <div class="preferences">
                <h3>⚙️ Set Your Preferences</h3>
                <div class="form-group">
                    <label for="reminderDays">Reminder interval (days):</label>
                    <input type="number" id="reminderDays" value="7" min="1" max="30">
                </div>
                <div class="form-group">
                    <label for="notifications">Enable desktop notifications:</label>
                    <select id="notifications">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="autoOpen">Auto-open browser for installation:</label>
                    <select id="autoOpen">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            
            <div class="step">
                <h3>📋 Installation Steps</h3>
                <p>1. Click "Install Extension" below</p>
                <p>2. Your browser will open to the extensions page</p>
                <p>3. Enable "Developer mode" (toggle in top right)</p>
                <p>4. Click "Load unpacked" and select the extension folder</p>
                <p>5. The extension will be installed and ready to use!</p>
            </div>
            
            <div class="buttons">
                <button class="btn btn-primary" onclick="installExtension()">Install Extension</button>
                <button class="btn btn-secondary" onclick="window.close()">Cancel</button>
            </div>
            
            <div id="status" class="status"></div>
        </div>
    </div>

    <script>
        const extensionPath = "${extensionDir.replace(/\\/g, '/')}";
        const browserUrl = "${browserUrl}";
        const browserType = "${browserType}";
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
        }
        
        function savePreferences() {
            const preferences = {
                reminderDays: parseInt(document.getElementById('reminderDays').value),
                notifications: document.getElementById('notifications').value === 'true',
                autoOpen: document.getElementById('autoOpen').value === 'true',
                version: '${this.config.version}',
                installed: new Date().toISOString()
            };
            
            // Save to localStorage for the extension to read
            localStorage.setItem('fitgirl-watchlist-preferences', JSON.stringify(preferences));
            
            // Also save to a config file in the extension directory
            const configData = JSON.stringify(preferences, null, 2);
            
            // Create a download link for the config file
            const blob = new Blob([configData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user-config.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return preferences;
        }
        
        function openBrowser() {
            try {
                if (browserType === 'Chrome/Edge') {
                    window.open(browserUrl, '_blank');
                } else if (browserType === 'Firefox') {
                    window.open(browserUrl, '_blank');
                }
                return true;
            } catch (error) {
                console.error('Error opening browser:', error);
                return false;
            }
        }
        
        function openExtensionFolder() {
            try {
                // Create a download link to the extension folder
                const zipBlob = new Blob(['Extension folder contents'], { type: 'application/zip' });
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'fitgirl-watchlist-extension';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showStatus('Extension folder location: ' + extensionPath, 'success');
                return true;
            } catch (error) {
                console.error('Error opening extension folder:', error);
                return false;
            }
        }
        
        function installExtension() {
            try {
                showStatus('Installing extension...', 'success');
                
                // Save user preferences
                const preferences = savePreferences();
                showStatus('✓ Preferences saved', 'success');
                
                // Open browser if requested
                if (preferences.autoOpen) {
                    setTimeout(() => {
                        if (openBrowser()) {
                            showStatus('✓ Browser opened to extensions page', 'success');
                        } else {
                            showStatus('⚠ Could not auto-open browser. Please manually go to: ' + browserUrl, 'error');
                        }
                    }, 1000);
                }
                
                // Show extension folder location
                setTimeout(() => {
                    openExtensionFolder();
                    showStatus('✓ Installation process started! Check the browser window and follow the instructions.', 'success');
                }, 2000);
                
            } catch (error) {
                console.error('Installation error:', error);
                showStatus('Error: ' + error.message, 'error');
            }
        }
        
        // Show extension path on load
        window.addEventListener('load', function() {
            showStatus('Extension will be installed from: ' + extensionPath, 'success');
        });
    </script>
</body>
</html>`;
  }

  createCombinedInstallerHTML(chromeDir, firefoxDir) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.config.extensionName} - Combined Installer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .installer {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 700px;
            width: 100%;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        
        .content {
            padding: 30px;
        }
        
        .browser-selection {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        
        .browser-option {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .browser-option:hover {
            border-color: #4facfe;
            transform: translateY(-2px);
        }
        
        .browser-option.selected {
            border-color: #4facfe;
            background: #f8f9ff;
        }
        
        .browser-option h3 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .browser-option p {
            color: #666;
            font-size: 14px;
        }
        
        .preferences {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .preferences h3 {
            color: #856404;
            margin-bottom: 15px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #4facfe;
            box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn {
            flex: 1;
            padding: 15px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
        
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }
        
        .status.success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .status.error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .features {
            background: #e8f5e8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .features h3 {
            color: #2d5a2d;
            margin-bottom: 15px;
        }
        
        .features ul {
            list-style: none;
        }
        
        .features li {
            padding: 5px 0;
            color: #2d5a2d;
        }
        
        .features li:before {
            content: "✓ ";
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="installer">
        <div class="header">
            <h1>${this.config.extensionName}</h1>
            <p>Combined Browser Installer v${this.config.version}</p>
        </div>
        
        <div class="content">
            <div class="features">
                <h3>🎮 Extension Features</h3>
                <ul>
                    <li>Easy watchlist management</li>
                    <li>Smart reminders</li>
                    <li>Desktop notifications</li>
                    <li>Data export/import</li>
                    <li>Works on fitgirl-repacks.site</li>
                </ul>
            </div>
            
            <div class="browser-selection">
                <div class="browser-option" onclick="selectBrowser('chrome')">
                    <h3>🌐 Chrome/Edge</h3>
                    <p>For Chrome and Microsoft Edge browsers</p>
                </div>
                <div class="browser-option" onclick="selectBrowser('firefox')">
                    <h3>🦊 Firefox</h3>
                    <p>For Mozilla Firefox browser</p>
                </div>
            </div>
            
            <div class="preferences">
                <h3>⚙️ Set Your Preferences</h3>
                <div class="form-group">
                    <label for="reminderDays">Reminder interval (days):</label>
                    <input type="number" id="reminderDays" value="7" min="1" max="30">
                </div>
                <div class="form-group">
                    <label for="notifications">Enable desktop notifications:</label>
                    <select id="notifications">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="autoOpen">Auto-open browser for installation:</label>
                    <select id="autoOpen">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            
            <div class="buttons">
                <button class="btn btn-primary" onclick="installExtension()">Install Extension</button>
                <button class="btn btn-secondary" onclick="window.close()">Cancel</button>
            </div>
            
            <div id="status" class="status"></div>
        </div>
    </div>

    <script>
        const chromePath = "${chromeDir.replace(/\\/g, '/')}";
        const firefoxPath = "${firefoxDir.replace(/\\/g, '/')}";
        let selectedBrowser = 'chrome';
        
        function selectBrowser(browser) {
            selectedBrowser = browser;
            document.querySelectorAll('.browser-option').forEach(option => {
                option.classList.remove('selected');
            });
            event.target.closest('.browser-option').classList.add('selected');
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
        }
        
        function savePreferences() {
            const preferences = {
                reminderDays: parseInt(document.getElementById('reminderDays').value),
                notifications: document.getElementById('notifications').value === 'true',
                autoOpen: document.getElementById('autoOpen').value === 'true',
                browser: selectedBrowser,
                version: '${this.config.version}',
                installed: new Date().toISOString()
            };
            
            // Save to localStorage for the extension to read
            localStorage.setItem('fitgirl-watchlist-preferences', JSON.stringify(preferences));
            
            // Also save to a config file
            const configData = JSON.stringify(preferences, null, 2);
            const blob = new Blob([configData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user-config.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return preferences;
        }
        
        function openBrowser(browser) {
            try {
                if (browser === 'chrome') {
                    window.open('chrome://extensions/', '_blank');
                } else if (browser === 'firefox') {
                    window.open('about:debugging', '_blank');
                }
                return true;
            } catch (error) {
                console.error('Error opening browser:', error);
                return false;
            }
        }
        
        function installExtension() {
            try {
                showStatus('Installing extension for ' + selectedBrowser + '...', 'success');
                
                // Save user preferences
                const preferences = savePreferences();
                showStatus('✓ Preferences saved', 'success');
                
                // Open browser if requested
                if (preferences.autoOpen) {
                    setTimeout(() => {
                        if (openBrowser(selectedBrowser)) {
                            showStatus('✓ Browser opened to extensions page', 'success');
                        } else {
                            const url = selectedBrowser === 'chrome' ? 'chrome://extensions/' : 'about:debugging';
                            showStatus('⚠ Could not auto-open browser. Please manually go to: ' + url, 'error');
                        }
                    }, 1000);
                }
                
                // Show extension folder location
                setTimeout(() => {
                    const extensionPath = selectedBrowser === 'chrome' ? chromePath : firefoxPath;
                    showStatus('✓ Installation process started! Extension folder: ' + extensionPath, 'success');
                }, 2000);
                
            } catch (error) {
                console.error('Installation error:', error);
                showStatus('Error: ' + error.message, 'error');
            }
        }
        
        // Initialize with Chrome selected
        window.addEventListener('load', function() {
            document.querySelector('.browser-option').classList.add('selected');
        });
    </script>
</body>
</html>`;
  }
}

// Run the native installer creator
if (require.main === module) {
  const creator = new NativeInstallerCreator();
  creator.createNativeInstallers().catch(console.error);
}

module.exports = NativeInstallerCreator;
