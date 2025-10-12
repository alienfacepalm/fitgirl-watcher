#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class EdgeBuilder {
  constructor() {
    this.sourceDir = process.cwd();
    this.buildDir = path.join(this.sourceDir, "dist", "edge");
    this.version = this.getVersion();
  }

  getVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      return packageJson.version;
    } catch (error) {
      console.error("Error reading package.json:", error.message);
      return "1.0.0";
    }
  }

  async build() {
    console.log("🚀 Building FitGirl Watchlist for Microsoft Edge...");
    console.log(`📦 Version: ${this.version}`);

    try {
      this.cleanBuildDir();
      this.createBuildDir();
      this.copyFiles();
      await this.generateIcons();
      this.updateManifestVersion();
      this.createZipPackage();

      console.log("✅ Edge build completed successfully!");
      console.log(`📁 Build output: ${this.buildDir}`);
      console.log(
        `📦 Package: dist/fitgirl-watchlist-edge-v${this.version}.zip`
      );
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      process.exit(1);
    }
  }

  cleanBuildDir() {
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
    }
  }

  createBuildDir() {
    fs.mkdirSync(this.buildDir, { recursive: true });
  }

  copyFiles() {
    const filesToCopy = [
      "src/manifest.json",
      "src/background.js",
      "src/content.js",
      "src/popup.html",
      "src/popup.js",
      "src/popup.css",
      "src/styles.css",
    ];

    const dirsToCopy = ["assets/icons"];

    console.log("📋 Copying files...");

    filesToCopy.forEach((file) => {
      const sourcePath = path.join(this.sourceDir, file);
      const destFileName = path.basename(file);
      const destPath = path.join(this.buildDir, destFileName);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✓ ${destFileName}`);
      } else {
        console.warn(`  ⚠️  ${file} not found, skipping...`);
      }
    });

    dirsToCopy.forEach((dir) => {
      const sourcePath = path.join(this.sourceDir, dir);
      const destDirName = path.basename(dir);
      const destPath = path.join(this.buildDir, destDirName);

      if (fs.existsSync(sourcePath)) {
        this.copyDir(sourcePath, destPath);
        console.log(`  ✓ ${destDirName}/`);
      } else {
        console.warn(`  ⚠️  ${dir}/ not found, skipping...`);
      }
    });
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

  async generateIcons() {
    const iconsDir = path.join(this.buildDir, "icons");
    const requiredIcons = ["icon16.png", "icon48.png", "icon128.png"];
    console.log("🎨 Checking icons...");
    const missingIcons = requiredIcons.filter(
      (icon) => !fs.existsSync(path.join(iconsDir, icon))
    );
    if (missingIcons.length > 0) {
      console.log(`⚠️  Missing icons: ${missingIcons.join(", ")}`);
      console.log("📝 Please generate icons using generate-icons.html");
      console.log("   or create them manually in the icons/ directory");
      this.createPlaceholderIcons(iconsDir, missingIcons);
    } else {
      console.log("  ✓ All required icons found");
    }
  }

  createPlaceholderIcons(iconsDir, missingIcons) {
    console.log("🔧 Creating placeholder PNG icons...");

    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    missingIcons.forEach((icon) => {
      const size = parseInt(icon.match(/\d+/)[0]);
      const pngPath = path.join(iconsDir, icon);
      
      // Create a simple PNG file programmatically
      const png = this.createSimplePNG(size, size);
      fs.writeFileSync(pngPath, png);
      console.log(`  ✓ Created ${icon} (${size}x${size})`);
    });
  }

  createSimplePNG(width, height) {
    // Create a minimal PNG file with FitGirl pink/red gradient
    // PNG signature + IHDR + IDAT + IEND chunks
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0); // chunk length
    ihdr.write('IHDR', 4);
    ihdr.writeUInt32BE(width, 8);
    ihdr.writeUInt32BE(height, 12);
    ihdr.writeUInt8(8, 16); // bit depth
    ihdr.writeUInt8(2, 17); // color type (RGB)
    ihdr.writeUInt8(0, 18); // compression
    ihdr.writeUInt8(0, 19); // filter
    ihdr.writeUInt8(0, 20); // interlace
    ihdr.writeUInt32BE(this.crc32(ihdr.slice(4, 21)), 21);
    
    // Create gradient-like image data (FitGirl pink/red gradient)
    const scanlineSize = 1 + width * 3; // filter byte + RGB pixels
    const imageData = Buffer.alloc(scanlineSize * height);
    
    for (let y = 0; y < height; y++) {
      const offset = y * scanlineSize;
      imageData[offset] = 0; // no filter
      
      for (let x = 0; x < width; x++) {
        const pixelOffset = offset + 1 + x * 3;
        // Gradient from bright pink (#ff1744) to deep pink (#f50057)
        const ratio = y / height;
        imageData[pixelOffset] = Math.floor(255 + (245 - 255) * ratio);     // R
        imageData[pixelOffset + 1] = Math.floor(23 + (0 - 23) * ratio);     // G
        imageData[pixelOffset + 2] = Math.floor(68 + (87 - 68) * ratio);    // B
      }
    }
    
    // Compress image data
    const zlib = require('zlib');
    const compressed = zlib.deflateSync(imageData);
    
    // IDAT chunk
    const idat = Buffer.alloc(12 + compressed.length);
    idat.writeUInt32BE(compressed.length, 0);
    idat.write('IDAT', 4);
    compressed.copy(idat, 8);
    idat.writeUInt32BE(this.crc32(idat.slice(4, 8 + compressed.length)), 8 + compressed.length);
    
    // IEND chunk
    const iend = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);
    
    return Buffer.concat([signature, ihdr, idat, iend]);
  }

  crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc = crc ^ buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  updateManifestVersion() {
    const manifestPath = path.join(this.buildDir, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      manifest.version = this.version;
      // Edge uses MV3 like Chrome; no changes required by default
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("  ✓ Updated manifest version");
    }
  }

  createZipPackage() {
    const zipName = `fitgirl-watchlist-edge-v${this.version}.zip`;
    const zipPath = path.join(this.sourceDir, "dist", zipName);
    console.log("📦 Creating zip package...");
    try {
      const isWindows = process.platform === "win32";
      if (isWindows) {
        const psCommand = `Compress-Archive -Path "${this.buildDir}\\*" -DestinationPath "${zipPath}" -Force`;
        execSync(`powershell -Command "${psCommand}"`, { stdio: "pipe" });
      } else {
        execSync(`cd "${this.buildDir}" && zip -r "${zipPath}" .`, {
          stdio: "pipe",
        });
      }
      console.log(`  ✓ Created ${zipName}`);
    } catch (error) {
      console.warn("⚠️  Failed to create zip package:", error.message);
      console.log(
        "   You can manually zip the contents of the dist/edge/ directory"
      );
    }
  }
}

if (require.main === module) {
  const builder = new EdgeBuilder();
  builder.build().catch(console.error);
}

module.exports = EdgeBuilder;
