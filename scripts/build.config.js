// Build configuration for FitGirl Watchlist Extension

module.exports = {
  // Extension metadata
  extension: {
    name: "FitGirl Repacks Watchlist",
    description:
      "Add games from FitGirl repacks to your watchlist with reminders",
    version: "1.0.0",
    author: "Your Name",
    homepage: "https://github.com/yourusername/fitgirl-watchlist-extension",
  },

  // Build settings
  build: {
    // Output directories
    distDir: "dist",
    chromeDir: "dist/chrome",
    firefoxDir: "dist/firefox",

    // File patterns to include in builds
    includeFiles: [
      "src/manifest.json",
      "src/background.js",
      "src/content.js",
      "src/popup.html",
      "src/popup.js",
      "src/popup.css",
      "src/styles.css",
    ],

    // Directories to include
    includeDirs: ["assets/icons"],

    // Files to exclude from builds
    excludeFiles: [
      "*.md",
      "*.json",
      "build*.js",
      "generate-icons.html",
      "install.md",
      "README.md",
      ".git*",
      "node_modules",
      "dist",
    ],

    // Required icon sizes
    requiredIcons: [
      { size: 16, name: "icon16.png" },
      { size: 48, name: "icon48.png" },
      { size: 128, name: "icon128.png" },
    ],
  },

  // Platform-specific settings
  platforms: {
    chrome: {
      manifestFile: "src/manifest.json",
      packageFormat: "zip",
      packageName: "fitgirl-watchlist-chrome-v{VERSION}.zip",
      minChromeVersion: "88",
      permissions: [
        "storage",
        "activeTab",
        "scripting",
        "notifications",
        "alarms",
      ],
      hostPermissions: ["*://fitgirl-repacks.site/*"],
    },

    firefox: {
      manifestFile: "src/manifest-firefox.json",
      packageFormat: "xpi",
      packageName: "fitgirl-watchlist-firefox-v{VERSION}.xpi",
      minFirefoxVersion: "78",
      permissions: [
        "storage",
        "activeTab",
        "notifications",
        "alarms",
        "*://fitgirl-repacks.site/*",
      ],
      geckoId: "fitgirl-watchlist@example.com",
    },
  },

  // Icon generation settings
  icons: {
    // SVG template for generating icons
    svgTemplate: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="#fff" stroke-width="4"/>
        <text x="64" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">🎮</text>
      </svg>
    `,

    // Firefox-specific icon template
    firefoxSvgTemplate: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="#fff" stroke-width="4"/>
        <text x="64" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">🦊</text>
      </svg>
    `,
  },

  // Development settings
  development: {
    // Auto-reload settings
    watchFiles: ["*.js", "*.html", "*.css", "*.json"],

    // Development server settings
    devServer: {
      port: 3000,
      host: "localhost",
    },
  },

  // Validation settings
  validation: {
    // Check for required files before building
    requiredFiles: [
      "src/manifest.json",
      "src/background.js",
      "src/content.js",
      "src/popup.html",
      "src/popup.js",
      "src/popup.css",
      "src/styles.css",
    ],

    // Validate manifest.json structure
    validateManifest: true,

    // Check for icon files
    validateIcons: true,
  },
};
