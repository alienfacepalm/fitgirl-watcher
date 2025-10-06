#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Simple icon generator following best practices
 * - Only essential sizes (16, 32, 48, 64, 128, 256, 512)
 * - Clean, simple design
 * - Both naming conventions (icon-16.png and icon16.png)
 * - No unnecessary complexity
 */
class SimpleIconGenerator {
  constructor() {
    this.sourceDir = path.resolve(__dirname, "..");
    this.iconsDir = path.join(this.sourceDir, "assets", "icons");
    this.sizes = [16, 32, 48, 64, 128, 256, 512];
  }

  generateIcons() {
    console.log("🎨 Generating simple, clean icons...");
    
    // Ensure icons directory exists
    if (!fs.existsSync(this.iconsDir)) {
      fs.mkdirSync(this.iconsDir, { recursive: true });
    }

    // Generate icons for all essential sizes
    this.sizes.forEach(size => {
      this.createPNGIcon(size);
    });

    // Create standard naming convention files
    this.createStandardNaming();

    console.log("✅ Simple icon system created!");
    console.log("📁 Essential sizes: 16, 32, 48, 64, 128, 256, 512px");
    console.log("🎨 Clean blue gradient design");
  }

  createPNGIcon(size) {
    const iconPath = path.join(this.iconsDir, `icon-${size}.png`);
    const pngData = this.createSimplePNG(size);
    fs.writeFileSync(iconPath, pngData);
    console.log(`  ✓ icon-${size}.png`);
  }

  createStandardNaming() {
    // Create files with standard naming convention
    this.sizes.forEach(size => {
      const sourcePath = path.join(this.iconsDir, `icon-${size}.png`);
      const destPath = path.join(this.iconsDir, `icon${size}.png`);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
    console.log("  ✓ Created standard naming convention files");
  }

  createSimplePNG(size) {
    // Create a simple, clean PNG icon
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR chunk
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(size, 0);
    ihdrData.writeUInt32BE(size, 4);
    ihdrData[8] = 8;  // Bit depth
    ihdrData[9] = 2;  // Color type (RGB)
    ihdrData[10] = 0; // Compression
    ihdrData[11] = 0; // Filter
    ihdrData[12] = 0; // Interlace
    
    const ihdr = this.createChunk('IHDR', ihdrData);
    
    // Create clean blue gradient image data
    const imageData = Buffer.alloc(size * size * 3);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 3;
        
        // Simple blue gradient - clean and professional
        const r = Math.floor(59 + (x / size) * 20);   // 59-79 blue range
        const g = Math.floor(130 + (y / size) * 20);  // 130-150 blue range  
        const b = 246;                                 // Solid blue
        
        imageData[index] = r;
        imageData[index + 1] = g;
        imageData[index + 2] = b;
      }
    }
    
    const idat = this.createChunk('IDAT', imageData);
    const iend = this.createChunk('IEND', Buffer.alloc(0));
    
    return Buffer.concat([signature, ihdr, idat, iend]);
  }

  createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, 'ascii');
    const chunk = Buffer.concat([length, typeBuffer, data]);
    
    // CRC calculation
    let crc = 0xffffffff;
    const buffer = Buffer.concat([typeBuffer, data]);
    for (let i = 0; i < buffer.length; i++) {
      crc ^= buffer[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc >>>= 1;
        }
      }
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    
    return Buffer.concat([chunk, crcBuffer]);
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new SimpleIconGenerator();
  generator.generateIcons();
}

module.exports = SimpleIconGenerator;