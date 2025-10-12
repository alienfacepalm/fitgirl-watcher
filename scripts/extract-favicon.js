#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Extracts PNG images from an ICO file and saves them as separate PNG files
 */
class FaviconExtractor {
  constructor() {
    this.icoPath = path.join(process.cwd(), 'assets', 'icons', 'favicon.ico');
    this.outputDir = path.join(process.cwd(), 'assets', 'icons');
  }

  async extract() {
    console.log('🎨 Extracting PNG images from favicon.ico...');

    try {
      if (!fs.existsSync(this.icoPath)) {
        console.error('❌ favicon.ico not found at:', this.icoPath);
        process.exit(1);
      }

      // Read the ICO file
      const icoBuffer = fs.readFileSync(this.icoPath);
      
      // Parse ICO header
      const iconCount = icoBuffer.readUInt16LE(4);
      console.log(`📦 Found ${iconCount} icon(s) in ICO file`);

      const icons = [];

      // Parse each icon directory entry
      for (let i = 0; i < iconCount; i++) {
        const offset = 6 + (i * 16);
        const width = icoBuffer[offset] || 256;
        const height = icoBuffer[offset + 1] || 256;
        const imageOffset = icoBuffer.readUInt32LE(offset + 12);
        const imageSize = icoBuffer.readUInt32LE(offset + 8);

        icons.push({
          width,
          height,
          offset: imageOffset,
          size: imageSize
        });
      }

      // Extract and save each icon
      for (const icon of icons) {
        const imageData = icoBuffer.slice(icon.offset, icon.offset + icon.size);
        
        // Check if it's a PNG (starts with PNG signature)
        const isPNG = imageData[0] === 0x89 && 
                      imageData[1] === 0x50 && 
                      imageData[2] === 0x4E && 
                      imageData[3] === 0x47;

        if (isPNG) {
          // Determine which size to save as
          let filename;
          if (icon.width === 16 || icon.width === 256 && icons.length === 1) {
            filename = 'icon16.png';
          } else if (icon.width === 48) {
            filename = 'icon48.png';
          } else if (icon.width === 128 || icon.width === 256) {
            filename = 'icon128.png';
          } else {
            // Save with original size name
            filename = `icon${icon.width}.png`;
          }

          const outputPath = path.join(this.outputDir, filename);
          fs.writeFileSync(outputPath, imageData);
          console.log(`  ✓ Extracted ${icon.width}x${icon.height} → ${filename}`);
        } else {
          console.log(`  ⚠️  Skipping ${icon.width}x${icon.height} (not PNG format)`);
        }
      }

      // If we didn't get all required sizes, create them from the largest available
      const requiredSizes = [16, 48, 128];
      const existingSizes = icons.map(i => i.width);
      
      for (const size of requiredSizes) {
        const filename = `icon${size}.png`;
        const filePath = path.join(this.outputDir, filename);
        
        if (!fs.existsSync(filePath)) {
          console.log(`  ⚠️  ${filename} not found in ICO, you may need to resize manually`);
        }
      }

      console.log('✅ Icon extraction complete!');

    } catch (error) {
      console.error('❌ Error extracting icons:', error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const extractor = new FaviconExtractor();
  extractor.extract().catch(console.error);
}

module.exports = FaviconExtractor;

