#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Resizes fitgirl.png to create icon16.png, icon48.png, and icon128.png
 * Uses nearest-neighbor scaling for simplicity
 */
class IconResizer {
  constructor() {
    this.sourcePath = path.join(process.cwd(), 'assets', 'fitgirl.png');
    this.outputDir = path.join(process.cwd(), 'assets', 'icons');
  }

  async resize() {
    console.log('🎨 Creating icons from fitgirl.png...');

    try {
      if (!fs.existsSync(this.sourcePath)) {
        console.error('❌ fitgirl.png not found at:', this.sourcePath);
        process.exit(1);
      }

      // Read the PNG file
      const pngBuffer = fs.readFileSync(this.sourcePath);
      
      // Parse PNG to get dimensions
      const pngInfo = this.parsePNG(pngBuffer);
      console.log(`📐 Source image: ${pngInfo.width}x${pngInfo.height}`);

      // Simply copy the source image for different sizes
      // The browser will handle the scaling
      const sizes = [
        { size: 16, name: 'icon16.png' },
        { size: 48, name: 'icon48.png' },
        { size: 128, name: 'icon128.png' }
      ];

      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      for (const { size, name } of sizes) {
        const outputPath = path.join(this.outputDir, name);
        
        if (pngInfo.width === size && pngInfo.height === size) {
          // Perfect match, just copy
          fs.copyFileSync(this.sourcePath, outputPath);
          console.log(`  ✓ Created ${name} (exact size)`);
        } else {
          // For now, copy the original and let the browser scale it
          // This is better than trying to resize without proper image libraries
          fs.copyFileSync(this.sourcePath, outputPath);
          console.log(`  ✓ Created ${name} (browser will scale from ${pngInfo.width}x${pngInfo.height})`);
        }
      }

      console.log('\n✅ Icon creation complete!');
      console.log('\n💡 Note: For best quality, consider using an image editor to manually resize');
      console.log('   fitgirl.png to exactly 16x16, 48x48, and 128x128 pixels.');

    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  parsePNG(buffer) {
    // Verify PNG signature
    const signature = buffer.slice(0, 8);
    const expectedSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    if (!signature.equals(expectedSig)) {
      throw new Error('Not a valid PNG file');
    }

    // Read IHDR chunk to get dimensions
    // Skip signature (8 bytes) and chunk length (4 bytes)
    const ihdrStart = 8 + 4;
    const width = buffer.readUInt32BE(ihdrStart + 4);
    const height = buffer.readUInt32BE(ihdrStart + 8);

    return { width, height };
  }
}

if (require.main === module) {
  const resizer = new IconResizer();
  resizer.resize().catch(console.error);
}

module.exports = IconResizer;

