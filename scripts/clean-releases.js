#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 FitGirl Watchlist - Clean Releases');
console.log('=====================================\n');

// Clean local releases directory
const releasesDir = path.join(__dirname, '..', 'releases');
if (fs.existsSync(releasesDir)) {
  console.log('🗑️  Removing local releases directory...');
  fs.rmSync(releasesDir, { recursive: true, force: true });
  console.log('✅ Local releases cleaned\n');
} else {
  console.log('ℹ️  No local releases directory found\n');
}

// Clean GitHub releases
console.log('🌐 Cleaning GitHub releases...');
console.log('⚠️  This requires GitHub CLI (gh) to be installed and authenticated.\n');

try {
  // Check if gh is available
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('❌ GitHub CLI (gh) is not installed or not in PATH.');
    console.log('\nTo delete GitHub releases manually:');
    console.log('1. Go to: https://github.com/alienfacepalm/fitgirl-watcher/releases');
    console.log('2. Click on each release');
    console.log('3. Click "Delete" button at the bottom');
    console.log('\nOr install GitHub CLI:');
    console.log('- Windows (as admin): choco install gh -y');
    console.log('- Or download from: https://cli.github.com/');
    process.exit(1);
  }

  // Get all releases
  const releases = execSync('gh release list --repo alienfacepalm/fitgirl-watcher --limit 100', {
    encoding: 'utf-8',
  }).trim();

  if (!releases) {
    console.log('✅ No GitHub releases found\n');
  } else {
    const releaseLines = releases.split('\n');
    console.log(`Found ${releaseLines.length} release(s) to delete:\n`);

    for (const line of releaseLines) {
      const tag = line.split('\t')[2]; // Tag is the 3rd column
      if (tag) {
        console.log(`  Deleting release: ${tag}`);
        try {
          execSync(`gh release delete ${tag} --repo alienfacepalm/fitgirl-watcher --yes`, {
            stdio: 'inherit',
          });
        } catch (error) {
          console.log(`  ⚠️  Failed to delete ${tag}`);
        }
      }
    }

    console.log('\n✅ GitHub releases cleaned');
  }

  // Delete all tags
  console.log('\n🏷️  Cleaning Git tags...');
  try {
    const tags = execSync('git tag', { encoding: 'utf-8' }).trim();
    if (tags) {
      const tagList = tags.split('\n');
      for (const tag of tagList) {
        console.log(`  Deleting tag: ${tag}`);
        execSync(`git tag -d ${tag}`, { stdio: 'inherit' });
        try {
          execSync(`git push origin :refs/tags/${tag}`, { stdio: 'inherit' });
        } catch (error) {
          console.log(`  ⚠️  Failed to delete remote tag ${tag}`);
        }
      }
      console.log('✅ Git tags cleaned');
    } else {
      console.log('✅ No Git tags found');
    }
  } catch (error) {
    console.log('ℹ️  No Git tags to clean');
  }

} catch (error) {
  console.error('\n❌ Error cleaning GitHub releases:', error.message);
  process.exit(1);
}

console.log('\n🎉 Cleanup Complete!');
console.log('You can now create a fresh 1.0.0 release with: pnpm run release:1.0.0\n');
