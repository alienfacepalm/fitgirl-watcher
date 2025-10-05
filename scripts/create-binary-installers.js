#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Binary Installer Creator
 * Creates executable binary installers for Chrome/Edge and Firefox extensions
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class BinaryInstallerCreator {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.installersDir = path.join(this.distDir, "installers");
    this.binaryInstallersDir = path.join(this.distDir, "binary-installers");
    this.config = {
      extensionName: "FitGirl Repacks Watchlist",
      version: "1.0.0",
      author: "FitGirl Watchlist Team",
      description:
        "A browser extension to create a watchlist for FitGirl repacks with reminder functionality",
      homepage: "https://github.com/yourusername/fitgirl-watchlist-extension",
    };
  }

  async createBinaryInstallers() {
    console.log("🔧 FitGirl Watchlist Extension - Binary Installer Creator");
    console.log("=======================================================\n");

    try {
      // Check if dist directory exists
      if (!fs.existsSync(this.distDir)) {
        console.error(
          '❌ dist/ directory not found. Please run "pnpm run build" first.'
        );
        process.exit(1);
      }

      // Create binary installers directory
      this.createBinaryInstallersDir();

      // Create Chrome/Edge binary installer
      await this.createChromeBinaryInstaller();

      // Create Firefox binary installer
      await this.createFirefoxBinaryInstaller();

      // Create combined binary installer
      await this.createCombinedBinaryInstaller();

      console.log("\n🎉 Binary Installer Creation Complete!");
      console.log("=====================================");
      console.log(`📁 Binary installers created in: ${this.binaryInstallersDir}`);
      console.log("\n📋 Available Binary Installers:");
      console.log("  - fitgirl-watchlist-chrome-installer.exe (Windows)");
      console.log("  - fitgirl-watchlist-firefox-installer.exe (Windows)");
      console.log("  - fitgirl-watchlist-installers.exe (Windows - both browsers)");
      console.log("  - fitgirl-watchlist-chrome-installer (Linux/macOS)");
      console.log("  - fitgirl-watchlist-firefox-installer (Linux/macOS)");
      console.log("  - fitgirl-watchlist-installers (Linux/macOS - both browsers)");
    } catch (error) {
      console.error("❌ Error creating binary installers:", error.message);
      process.exit(1);
    }
  }

  createBinaryInstallersDir() {
    if (!fs.existsSync(this.binaryInstallersDir)) {
      fs.mkdirSync(this.binaryInstallersDir, { recursive: true });
      console.log("📁 Created binary installers directory");
    }
  }

  async createChromeBinaryInstaller() {
    console.log("\n🌐 Creating Chrome/Edge binary installer...");

    const chromeDir = path.join(this.distDir, "chrome");
    if (!fs.existsSync(chromeDir)) {
      throw new Error(
        'Chrome build not found. Please run "pnpm run build" first.'
      );
    }

    // Create Windows executable installer
    await this.createWindowsInstaller(
      chromeDir,
      "fitgirl-watchlist-chrome-installer.exe",
      "Chrome/Edge"
    );

    // Create Linux/macOS executable installer
    await this.createUnixInstaller(
      chromeDir,
      "fitgirl-watchlist-chrome-installer",
      "Chrome/Edge"
    );

    console.log("  ✅ Chrome/Edge binary installer created");
  }

  async createFirefoxBinaryInstaller() {
    console.log("\n🦊 Creating Firefox binary installer...");

    const firefoxDir = path.join(this.distDir, "firefox");
    if (!fs.existsSync(firefoxDir)) {
      throw new Error(
        'Firefox build not found. Please run "pnpm run build" first.'
      );
    }

    // Create Windows executable installer
    await this.createWindowsInstaller(
      firefoxDir,
      "fitgirl-watchlist-firefox-installer.exe",
      "Firefox"
    );

    // Create Linux/macOS executable installer
    await this.createUnixInstaller(
      firefoxDir,
      "fitgirl-watchlist-firefox-installer",
      "Firefox"
    );

    console.log("  ✅ Firefox binary installer created");
  }

  async createCombinedBinaryInstaller() {
    console.log("\n📦 Creating combined binary installer...");

    // Create temporary combined directory
    const tempDir = path.join(this.binaryInstallersDir, "temp-combined");
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy both extension directories
    this.copyDir(
      path.join(this.distDir, "chrome"),
      path.join(tempDir, "chrome")
    );
    this.copyDir(
      path.join(this.distDir, "firefox"),
      path.join(tempDir, "firefox")
    );

    // Create Windows executable installer
    await this.createWindowsInstaller(
      tempDir,
      "fitgirl-watchlist-installers.exe",
      "Both Browsers"
    );

    // Create Linux/macOS executable installer
    await this.createUnixInstaller(
      tempDir,
      "fitgirl-watchlist-installers",
      "Both Browsers"
    );

    // Clean up temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log("  ✅ Combined binary installer created");
  }

  async createWindowsInstaller(extensionDir, outputName, browserType) {
    const outputPath = path.join(this.binaryInstallersDir, outputName);

    // Create a PowerShell script that will be compiled to executable
    const psScript = this.createWindowsInstallerScript(extensionDir, browserType);
    const psScriptPath = path.join(this.binaryInstallersDir, `${outputName}.ps1`);

    fs.writeFileSync(psScriptPath, psScript);

    try {
      // Try to use ps2exe if available, otherwise create a batch file
      try {
        execSync("ps2exe --version", { stdio: "pipe" });
        // ps2exe is available, create executable
        const command = `ps2exe -inputFile "${psScriptPath}" -outputFile "${outputPath}" -iconFile "${path.join(this.rootDir, "assets/icons/icon.ico")}" -title "${this.config.extensionName} Installer" -description "${this.config.description}" -company "${this.config.author}" -version "${this.config.version}" -copyright "Copyright (c) 2024" -requireAdmin`;
        execSync(command, { stdio: "pipe" });
        console.log(`    ✅ Created Windows executable: ${outputName}`);
      } catch (error) {
        // ps2exe not available, create a batch file that runs PowerShell
        const batchContent = `@echo off
echo Installing ${this.config.extensionName} for ${browserType}...
powershell -ExecutionPolicy Bypass -File "%~dp0${outputName}.ps1"
pause`;
        const batchPath = path.join(this.binaryInstallersDir, `${outputName}.bat`);
        fs.writeFileSync(batchPath, batchContent);
        console.log(`    ⚠️  Created batch file: ${outputName}.bat (ps2exe not available)`);
      }
    } catch (error) {
      console.log(`    ⚠️  Could not create Windows executable: ${error.message}`);
    }
  }

  async createUnixInstaller(extensionDir, outputName, browserType) {
    const outputPath = path.join(this.binaryInstallersDir, outputName);

    // Create a shell script that will be made executable
    const shellScript = this.createUnixInstallerScript(extensionDir, browserType);

    fs.writeFileSync(outputPath, shellScript);

    try {
      // Make it executable
      execSync(`chmod +x "${outputPath}"`);
      console.log(`    ✅ Created Unix executable: ${outputName}`);
    } catch (error) {
      console.log(`    ⚠️  Could not make Unix script executable: ${error.message}`);
    }
  }

  createWindowsInstallerScript(extensionDir, browserType) {
    return `# FitGirl Repacks Watchlist - ${browserType} Installer
# Simple PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "${this.config.extensionName}" -ForegroundColor Cyan
Write-Host "${browserType} Extension Installer v${this.config.version}" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ask user preferences
Write-Host "Let's set up your preferences:" -ForegroundColor Green
Write-Host ""

# Reminder interval
$reminderDays = Read-Host "How many days between reminders? (default: 7)"
if ([string]::IsNullOrWhiteSpace($reminderDays)) { $reminderDays = "7" }

# Desktop notifications
$notifications = Read-Host "Enable desktop notifications? (y/n, default: y)"
if ([string]::IsNullOrWhiteSpace($notifications)) { $notifications = "y" }

# Auto-open browser
$autoOpen = Read-Host "Auto-open browser for installation? (y/n, default: y)"
if ([string]::IsNullOrWhiteSpace($autoOpen)) { $autoOpen = "y" }

Write-Host ""
Write-Host "Your preferences:" -ForegroundColor Yellow
Write-Host "- Reminder interval: $reminderDays days" -ForegroundColor White
Write-Host "- Desktop notifications: $notifications" -ForegroundColor White
Write-Host "- Auto-open browser: $autoOpen" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue with installation? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Installation cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Installing extension..." -ForegroundColor Green

# Save preferences to a config file
$configPath = "${extensionDir}\\user-config.json"
$config = @{
    reminderDays = [int]$reminderDays
    notifications = ($notifications -eq "y" -or $notifications -eq "Y")
    version = "${this.config.version}"
    installed = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

$config | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "✓ Preferences saved" -ForegroundColor Green

# Open browser if requested
if ($autoOpen -eq "y" -or $autoOpen -eq "Y") {
    if ("${browserType}" -eq "Chrome/Edge" -or "${browserType}" -eq "Both Browsers") {
        Write-Host "Opening Chrome extensions page..." -ForegroundColor Blue
        Start-Process "chrome://extensions/"
        Start-Sleep 2
    }
    
    if ("${browserType}" -eq "Firefox" -or "${browserType}" -eq "Both Browsers") {
        Write-Host "Opening Firefox debugging page..." -ForegroundColor Blue
        Start-Process "firefox" -ArgumentList "about:debugging"
        Start-Sleep 2
    }
}

# Open extension folder
Write-Host "Opening extension folder..." -ForegroundColor Blue
Start-Process "explorer.exe" -ArgumentList "${extensionDir}"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. In your browser, enable 'Developer mode' (toggle in top right)" -ForegroundColor White
if ("${browserType}" -eq "Chrome/Edge" -or "${browserType}" -eq "Both Browsers") {
    Write-Host "2. Click 'Load unpacked' and select the extension folder" -ForegroundColor White
}
if ("${browserType}" -eq "Firefox" -or "${browserType}" -eq "Both Browsers") {
    Write-Host "2. Click 'Load Temporary Add-on' and select manifest.json" -ForegroundColor White
}
Write-Host "3. Visit fitgirl-repacks.site to start using the extension!" -ForegroundColor White
Write-Host ""
Write-Host "Extension folder: ${extensionDir}" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"`;
  }

  createUnixInstallerScript(extensionDir, browserType) {
    return `#!/bin/bash

# FitGirl Repacks Watchlist - ${browserType} Installer
# Unix/Linux/macOS Script

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

# Function to print colored text
print_color() {
    echo -e "\${1}\${2}\${NC}"
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Function to detect browser
detect_browser() {
    if command -v google-chrome &> /dev/null; then
        echo "chrome"
    elif command -v chromium-browser &> /dev/null; then
        echo "chromium"
    elif command -v firefox &> /dev/null; then
        echo "firefox"
    else
        echo "none"
    fi
}

# Main installer function
install_extension() {
    local os=$(detect_os)
    local browser=$(detect_browser)
    
    print_color $CYAN "========================================"
    print_color $CYAN "${this.config.extensionName}"
    print_color $CYAN "${browserType} Extension Installer v${this.config.version}"
    print_color $CYAN "========================================"
    echo ""
    
    print_color $GREEN "This installer will help you install the ${this.config.extensionName} extension for ${browserType}."
    echo ""
    
    print_color $YELLOW "Installation Steps:"
    echo "1. Your browser will open to the extensions page"
    echo "2. Enable 'Developer mode' (toggle in top right)"
    echo "3. Click 'Load unpacked' and select the extension folder"
    echo "4. The extension will be installed and ready to use"
    echo ""
    
    print_color $GREEN "The extension works on fitgirl-repacks.site and provides:"
    echo "• Easy watchlist management"
    echo "• Smart reminders"
    echo "• Desktop notifications"
    echo "• Data export/import"
    echo ""
    
    read -p "Press Enter to continue with installation..." -r
    echo ""
    
    # Get the directory where this script is located
    SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
    EXTENSION_PATH="${extensionDir}"
    
    if [[ ! -d "$EXTENSION_PATH" ]]; then
        print_color $RED "Error: Extension directory not found at $EXTENSION_PATH"
        exit 1
    fi
    
    print_color $BLUE "Opening browser and extension folder..."
    
    # Open browser based on type
    if [[ "${browserType}" == "Chrome/Edge" || "${browserType}" == "Both Browsers" ]]; then
        if command -v google-chrome &> /dev/null; then
            google-chrome chrome://extensions/ &
        elif command -v chromium-browser &> /dev/null; then
            chromium-browser chrome://extensions/ &
        elif command -v chrome &> /dev/null; then
            chrome chrome://extensions/ &
        else
            print_color $YELLOW "Chrome not found. Please manually open chrome://extensions/"
        fi
    fi
    
    if [[ "${browserType}" == "Firefox" || "${browserType}" == "Both Browsers" ]]; then
        if command -v firefox &> /dev/null; then
            firefox about:debugging &
        else
            print_color $YELLOW "Firefox not found. Please manually open about:debugging"
        fi
    fi
    
    # Open extension folder
    if [[ "$os" == "macos" ]]; then
        open "$EXTENSION_PATH"
    elif [[ "$os" == "linux" ]]; then
        xdg-open "$EXTENSION_PATH" 2>/dev/null || nautilus "$EXTENSION_PATH" 2>/dev/null || thunar "$EXTENSION_PATH" 2>/dev/null || print_color $YELLOW "Please manually open: $EXTENSION_PATH"
    else
        print_color $YELLOW "Please manually open: $EXTENSION_PATH"
    fi
    
    echo ""
    print_color $GREEN "Installation process started!"
    print_color $YELLOW "Please follow the on-screen instructions in your browser to complete the installation."
    echo ""
    print_color $CYAN "Extension folder: $EXTENSION_PATH"
    echo ""
}

# Run the installer
install_extension`;
  }

  copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Run the binary installer creator
if (require.main === module) {
  const creator = new BinaryInstallerCreator();
  creator.createBinaryInstallers().catch(console.error);
}

module.exports = BinaryInstallerCreator;
