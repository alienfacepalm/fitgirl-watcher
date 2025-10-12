const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function createGitHubRelease() {
  console.log('🚀 Creating GitHub Release...\n');

  // Read package.json for version
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = packageJson.version;
  const tagName = `v${version}`;

  console.log(`📦 Version: ${version}`);
  console.log(`🏷️  Tag: ${tagName}\n`);

  // Check if gh CLI is installed
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Error: GitHub CLI (gh) is not installed.');
    console.error('\n📥 Install it from: https://cli.github.com/');
    console.error('\nOr create the release manually at:');
    console.error('https://github.com/alienfacepalm/fitgirl-watcher/releases/new');
    process.exit(1);
  }

  // Find release files
  const releasesDir = path.join(__dirname, '../releases');
  const files = fs.readdirSync(releasesDir)
    .filter(f => f.includes(version) && (f.endsWith('.zip') || f.endsWith('.xpi')))
    .map(f => path.join(releasesDir, f));

  if (files.length === 0) {
    console.error('❌ No release files found in releases/ directory');
    process.exit(1);
  }

  console.log('📁 Found release files:');
  files.forEach(f => console.log(`  - ${path.basename(f)}`));
  console.log('');

  // Create release notes
  const releaseNotes = `# FitGirl Watchlist ${tagName}

## 🎮 Features

- ✅ Add games to watchlist from FitGirl Repacks site
- ✅ Automatic reminders (customizable interval)
- ✅ Beautiful FitGirl-themed dark UI (violet, black, green)
- ✅ Intelligent title extraction (removes dates and cleanup)
- ✅ Desktop notifications for due games
- ✅ Welcome toast on site visit (once per hour)
- ✅ High-quality Sharp-based icons
- ✅ Cross-browser support (Chrome, Edge, Firefox)

## 📦 Installation

### Quick Install

1. **Download** the file for your browser below
2. **Extract** the zip file
3. **Load** the extension:
   - **Chrome/Edge**: Go to \`chrome://extensions/\` or \`edge://extensions/\`, enable "Developer mode", click "Load unpacked", select the extracted folder
   - **Firefox**: Go to \`about:debugging\`, click "This Firefox", click "Load Temporary Add-on", select the \`.xpi\` file or \`manifest.json\` from extracted folder

### Files

- \`*-chrome.zip\` - For Google Chrome
- \`*-edge.zip\` - For Microsoft Edge
- \`*-firefox.xpi\` - For Firefox
- \`*-complete.zip\` - All platforms in one package

## 📖 Documentation

See the [README](https://github.com/alienfacepalm/fitgirl-watcher#readme) for full documentation.

## 🐛 Issues

Report issues at: https://github.com/alienfacepalm/fitgirl-watcher/issues
`;

  // Create the release
  try {
    console.log('🎯 Creating GitHub release...\n');
    
    const releaseNotesFile = path.join(releasesDir, 'release-notes-temp.md');
    fs.writeFileSync(releaseNotesFile, releaseNotes);

    const cmd = [
      'gh', 'release', 'create', tagName,
      ...files,
      '--title', `FitGirl Watchlist ${tagName}`,
      '--notes-file', releaseNotesFile
    ].join(' ');

    console.log(`Running: ${cmd}\n`);
    execSync(cmd, { stdio: 'inherit' });

    // Cleanup temp file
    fs.unlinkSync(releaseNotesFile);

    console.log('\n✅ Release created successfully!');
    console.log(`🔗 View at: https://github.com/alienfacepalm/fitgirl-watcher/releases/tag/${tagName}`);
  } catch (error) {
    console.error('\n❌ Error creating release:', error.message);
    console.error('\n📝 Manual steps:');
    console.error('1. Go to: https://github.com/alienfacepalm/fitgirl-watcher/releases/new');
    console.error(`2. Tag: ${tagName}`);
    console.error(`3. Title: FitGirl Watchlist ${tagName}`);
    console.error('4. Upload files from releases/ directory');
    process.exit(1);
  }
}

createGitHubRelease().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


