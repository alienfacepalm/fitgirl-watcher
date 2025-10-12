#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Properly resizes PNG images using nearest-neighbor interpolation
 */
class ImageResizer {
  constructor() {
    this.sourcePath = path.join(process.cwd(), 'assets', 'fitgirl.png');
    this.outputDir = path.join(process.cwd(), 'assets', 'icons');
  }

  async resize() {
    console.log('🎨 Resizing fitgirl.png to create proper icon sizes...');

    try {
      const sourceImage = this.loadPNG(this.sourcePath);
      console.log(`📐 Source: ${sourceImage.width}x${sourceImage.height}`);

      const sizes = [16, 48, 128];

      for (const size of sizes) {
        console.log(`\n🔄 Creating ${size}x${size} icon...`);
        const resized = this.resizeImage(sourceImage, size, size);
        const pngData = this.createPNG(resized);
        
        const outputPath = path.join(this.outputDir, `icon${size}.png`);
        fs.writeFileSync(outputPath, pngData);
        console.log(`  ✓ Saved icon${size}.png (${(pngData.length / 1024).toFixed(2)} KB)`);
      }

      console.log('\n✅ All icons resized successfully!');

    } catch (error) {
      console.error('❌ Error:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }

  loadPNG(filePath) {
    const buffer = fs.readFileSync(filePath);
    
    // Verify PNG signature
    const sig = buffer.slice(0, 8);
    const expectedSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    if (!sig.equals(expectedSig)) {
      throw new Error('Not a valid PNG file');
    }

    let offset = 8;
    let width, height, bitDepth, colorType;
    let pixelData = null;

    // Parse PNG chunks
    while (offset < buffer.length) {
      const chunkLength = buffer.readUInt32BE(offset);
      const chunkType = buffer.toString('ascii', offset + 4, offset + 8);
      const chunkData = buffer.slice(offset + 8, offset + 8 + chunkLength);

      if (chunkType === 'IHDR') {
        width = chunkData.readUInt32BE(0);
        height = chunkData.readUInt32BE(4);
        bitDepth = chunkData.readUInt8(8);
        colorType = chunkData.readUInt8(9);
      } else if (chunkType === 'IDAT') {
        if (!pixelData) {
          pixelData = chunkData;
        } else {
          pixelData = Buffer.concat([pixelData, chunkData]);
        }
      } else if (chunkType === 'IEND') {
        break;
      }

      offset += 12 + chunkLength;
    }

    // Decompress pixel data
    const decompressed = zlib.inflateSync(pixelData);
    
    // Remove filter bytes and get raw RGBA data
    const bytesPerPixel = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
    const scanlineLength = 1 + width * bytesPerPixel;
    const rgba = Buffer.alloc(width * height * 4);

    for (let y = 0; y < height; y++) {
      const scanlineStart = y * scanlineLength;
      const filterType = decompressed[scanlineStart];
      
      for (let x = 0; x < width; x++) {
        const srcOffset = scanlineStart + 1 + x * bytesPerPixel;
        const destOffset = (y * width + x) * 4;

        if (colorType === 6) { // RGBA
          rgba[destOffset] = decompressed[srcOffset];
          rgba[destOffset + 1] = decompressed[srcOffset + 1];
          rgba[destOffset + 2] = decompressed[srcOffset + 2];
          rgba[destOffset + 3] = decompressed[srcOffset + 3];
        } else if (colorType === 2) { // RGB
          rgba[destOffset] = decompressed[srcOffset];
          rgba[destOffset + 1] = decompressed[srcOffset + 1];
          rgba[destOffset + 2] = decompressed[srcOffset + 2];
          rgba[destOffset + 3] = 255;
        }
      }
    }

    return { width, height, data: rgba };
  }

  resizeImage(source, targetWidth, targetHeight) {
    const { width: srcWidth, height: srcHeight, data: srcData } = source;
    const destData = Buffer.alloc(targetWidth * targetHeight * 4);

    // Use bilinear interpolation for better quality
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        // Calculate source coordinates
        const srcX = (x / targetWidth) * srcWidth;
        const srcY = (y / targetHeight) * srcHeight;

        // Get the four surrounding pixels
        const x1 = Math.floor(srcX);
        const y1 = Math.floor(srcY);
        const x2 = Math.min(x1 + 1, srcWidth - 1);
        const y2 = Math.min(y1 + 1, srcHeight - 1);

        // Calculate interpolation weights
        const fx = srcX - x1;
        const fy = srcY - y1;

        // Get pixel colors
        const getPixel = (px, py) => {
          const offset = (py * srcWidth + px) * 4;
          return [
            srcData[offset],
            srcData[offset + 1],
            srcData[offset + 2],
            srcData[offset + 3]
          ];
        };

        const p1 = getPixel(x1, y1);
        const p2 = getPixel(x2, y1);
        const p3 = getPixel(x1, y2);
        const p4 = getPixel(x2, y2);

        // Bilinear interpolation
        const destOffset = (y * targetWidth + x) * 4;
        for (let i = 0; i < 4; i++) {
          const top = p1[i] * (1 - fx) + p2[i] * fx;
          const bottom = p3[i] * (1 - fx) + p4[i] * fx;
          destData[destOffset + i] = Math.round(top * (1 - fy) + bottom * fy);
        }
      }
    }

    return { width: targetWidth, height: targetHeight, data: destData };
  }

  createPNG(image) {
    const { width, height, data } = image;

    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0);
    ihdr.write('IHDR', 4);
    ihdr.writeUInt32BE(width, 8);
    ihdr.writeUInt32BE(height, 12);
    ihdr.writeUInt8(8, 16); // bit depth
    ihdr.writeUInt8(6, 17); // color type (RGBA)
    ihdr.writeUInt8(0, 18); // compression
    ihdr.writeUInt8(0, 19); // filter
    ihdr.writeUInt8(0, 20); // interlace
    ihdr.writeUInt32BE(this.crc32(ihdr.slice(4, 21)), 21);

    // Add filter byte to each scanline
    const scanlineLength = 1 + width * 4;
    const imageData = Buffer.alloc(scanlineLength * height);
    
    for (let y = 0; y < height; y++) {
      imageData[y * scanlineLength] = 0; // no filter
      data.copy(imageData, y * scanlineLength + 1, y * width * 4, (y + 1) * width * 4);
    }

    // Compress
    const compressed = zlib.deflateSync(imageData, { level: 9 });

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
}

if (require.main === module) {
  const resizer = new ImageResizer();
  resizer.resize().catch(console.error);
}

module.exports = ImageResizer;

