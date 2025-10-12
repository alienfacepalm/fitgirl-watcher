#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Converts ICO file to PNG by extracting BMP data and converting to PNG
 */
class FaviconConverter {
  constructor() {
    this.icoPath = path.join(process.cwd(), 'assets', 'icons', 'favicon.ico');
    this.outputDir = path.join(process.cwd(), 'assets', 'icons');
  }

  convert() {
    console.log('🎨 Converting favicon.ico to PNG files...');

    try {
      const icoBuffer = fs.readFileSync(this.icoPath);
      
      // Parse ICO header
      const reserved = icoBuffer.readUInt16LE(0); // Should be 0
      const type = icoBuffer.readUInt16LE(2); // Should be 1 for ICO
      const count = icoBuffer.readUInt16LE(4);
      
      console.log(`📦 ICO file contains ${count} image(s)`);
      
      // Parse directory entries
      for (let i = 0; i < count; i++) {
        const offset = 6 + (i * 16);
        const width = icoBuffer[offset] === 0 ? 256 : icoBuffer[offset];
        const height = icoBuffer[offset + 1] === 0 ? 256 : icoBuffer[offset + 1];
        const colorCount = icoBuffer[offset + 2];
        const planes = icoBuffer.readUInt16LE(offset + 4);
        const bitCount = icoBuffer.readUInt16LE(offset + 6);
        const imageSize = icoBuffer.readUInt32LE(offset + 8);
        const imageOffset = icoBuffer.readUInt32LE(offset + 12);
        
        console.log(`\n📐 Image ${i + 1}: ${width}x${height}, ${bitCount}bit`);
        
        // Extract image data
        const imageData = icoBuffer.slice(imageOffset, imageOffset + imageSize);
        
        // Check if it's PNG (starts with PNG signature)
        const isPNG = imageData[0] === 0x89 && imageData[1] === 0x50 && 
                      imageData[2] === 0x4E && imageData[3] === 0x47;
        
        if (isPNG) {
          console.log('  ✓ Already PNG format');
          this.savePNG(imageData, width, height);
        } else {
          console.log('  🔄 Converting BMP to PNG...');
          const png = this.bmpToPng(imageData, width, height, bitCount);
          if (png) {
            this.savePNG(png, width, height);
          }
        }
      }
      
      console.log('\n✅ Conversion complete!');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  bmpToPng(bmpData, width, height, bitDepth) {
    try {
      // Skip BMP header (40 bytes for BITMAPINFOHEADER)
      const headerSize = bmpData.readUInt32LE(0);
      const bmpWidth = bmpData.readInt32LE(4);
      const bmpHeight = Math.abs(bmpData.readInt32LE(8)) / 2; // ICO stores height*2
      const actualBitCount = bmpData.readUInt16LE(14);
      
      // Calculate where pixel data starts
      let pixelDataOffset = headerSize;
      
      // For 32-bit images with alpha
      if (actualBitCount === 32) {
        const colorTableSize = 0; // No color table for 32-bit
        pixelDataOffset += colorTableSize;
        
        // Extract RGBA pixel data
        const bytesPerRow = width * 4;
        const rawPixelData = Buffer.alloc(height * bytesPerRow);
        
        // BMP is stored bottom-up, we need to flip it
        for (let y = 0; y < height; y++) {
          const srcRow = (height - 1 - y) * bytesPerRow;
          const destRow = y * bytesPerRow;
          for (let x = 0; x < width * 4; x += 4) {
            const offset = pixelDataOffset + srcRow + x;
            // BMP stores as BGRA, convert to RGBA
            rawPixelData[destRow + x] = bmpData[offset + 2];     // R
            rawPixelData[destRow + x + 1] = bmpData[offset + 1]; // G
            rawPixelData[destRow + x + 2] = bmpData[offset];     // B
            rawPixelData[destRow + x + 3] = bmpData[offset + 3]; // A
          }
        }
        
        return this.createPNG(rawPixelData, width, height, true);
      }
      
      return null;
      
    } catch (error) {
      console.error('  ❌ BMP conversion error:', error.message);
      return null;
    }
  }

  createPNG(pixelData, width, height, hasAlpha = true) {
    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0); // chunk length
    ihdr.write('IHDR', 4);
    ihdr.writeUInt32BE(width, 8);
    ihdr.writeUInt32BE(height, 12);
    ihdr.writeUInt8(8, 16); // bit depth
    ihdr.writeUInt8(hasAlpha ? 6 : 2, 17); // color type (6 = RGBA, 2 = RGB)
    ihdr.writeUInt8(0, 18); // compression
    ihdr.writeUInt8(0, 19); // filter
    ihdr.writeUInt8(0, 20); // interlace
    ihdr.writeUInt32BE(this.crc32(ihdr.slice(4, 21)), 21);
    
    // Prepare image data with filter bytes
    const bytesPerPixel = hasAlpha ? 4 : 3;
    const scanlineSize = 1 + width * bytesPerPixel;
    const imageData = Buffer.alloc(scanlineSize * height);
    
    for (let y = 0; y < height; y++) {
      const offset = y * scanlineSize;
      imageData[offset] = 0; // no filter
      pixelData.copy(imageData, offset + 1, y * width * bytesPerPixel, (y + 1) * width * bytesPerPixel);
    }
    
    // Compress image data
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

  savePNG(pngData, width, height) {
    // Determine filename based on size
    let filename;
    if (width <= 16) filename = 'icon16.png';
    else if (width <= 48) filename = 'icon48.png';
    else filename = 'icon128.png';
    
    const outputPath = path.join(this.outputDir, filename);
    fs.writeFileSync(outputPath, pngData);
    console.log(`  ✓ Saved as ${filename}`);
  }
}

if (require.main === module) {
  const converter = new FaviconConverter();
  converter.convert();
}

module.exports = FaviconConverter;

