#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Release Cleaner
 * Cleans up old release files
 */

const fs = require("fs");
const path = require("path");

class ReleaseCleaner {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.releasesDir = path.join(this.rootDir, "releases");
  }

  async cleanReleases(keepCount = 5) {
    console.log("🧹 FitGirl Watchlist Extension - Release Cleaner");
    console.log("==============================================\n");

    try {
      if (!fs.existsSync(this.releasesDir)) {
        console.log("📁 No releases directory found. Nothing to clean.");
        return;
      }

      const files = fs.readdirSync(this.releasesDir);
      const releaseFiles = files.filter(
        (file) =>
          file.startsWith("fitgirl-watchlist-") &&
          (file.endsWith(".zip") || file.endsWith(".xpi"))
      );

      if (releaseFiles.length <= keepCount) {
        console.log(
          `📦 Found ${releaseFiles.length} release files. Keeping all (limit: ${keepCount}).`
        );
        return;
      }

      // Sort by modification time (newest first)
      const sortedFiles = releaseFiles
        .map((file) => ({
          name: file,
          path: path.join(this.releasesDir, file),
          mtime: fs.statSync(path.join(this.releasesDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime - a.mtime);

      const filesToDelete = sortedFiles.slice(keepCount);
      const filesToKeep = sortedFiles.slice(0, keepCount);

      console.log(`📦 Found ${releaseFiles.length} release files.`);
      console.log(`✅ Keeping ${filesToKeep.length} newest files:`);
      filesToKeep.forEach((file) => {
        console.log(`  - ${file.name}`);
      });

      if (filesToDelete.length > 0) {
        console.log(`\n🗑️  Deleting ${filesToDelete.length} old files:`);
        filesToDelete.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
            console.log(`  ✓ Deleted: ${file.name}`);
          } catch (error) {
            console.error(
              `  ❌ Failed to delete ${file.name}: ${error.message}`
            );
          }
        });
      }

      console.log("\n🎉 Release cleanup complete!");
    } catch (error) {
      console.error("❌ Error cleaning releases:", error.message);
      process.exit(1);
    }
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const keepCount = parseInt(args[0]) || 5;

  if (args.includes("--help") || args.includes("-h")) {
    console.log("FitGirl Watchlist Extension - Release Cleaner");
    console.log("=============================================\n");
    console.log("Usage:");
    console.log("  node scripts/clean-releases.js [keep-count]\n");
    console.log("Arguments:");
    console.log(
      "  keep-count    Number of recent releases to keep (default: 5)\n"
    );
    console.log("Examples:");
    console.log("  node scripts/clean-releases.js");
    console.log("  node scripts/clean-releases.js 10\n");
    process.exit(0);
  }

  const cleaner = new ReleaseCleaner();
  cleaner.cleanReleases(keepCount).catch(console.error);
}

module.exports = ReleaseCleaner;
