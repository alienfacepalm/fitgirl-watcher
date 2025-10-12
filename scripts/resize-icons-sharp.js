const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [16, 48, 128];
const inputPath = path.join(__dirname, "../assets/fitgirl.png");
const outputDir = path.join(__dirname, "../assets/icons");

async function resizeIcons() {
  console.log("🎨 Resizing icons with Sharp (high quality)...");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error("❌ Error: fitgirl.png not found at", inputPath);
    process.exit(1);
  }

  // Resize for each size
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon${size}.png`);

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Crop a square from the right side of the image (where the face is)
      const cropSize = Math.min(metadata.width, metadata.height);
      const left = metadata.width - cropSize; // Start from the right
      const top = 0;

      await sharp(inputPath)
        .extract({
          left: left,
          top: top,
          width: cropSize,
          height: cropSize,
        })
        .resize(size, size, {
          kernel: "lanczos3",
        })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);

      console.log(`  ✓ Created ${size}x${size} icon`);
    } catch (error) {
      console.error(`  ❌ Error creating ${size}x${size} icon:`, error.message);
    }
  }

  console.log("✅ Icon resizing complete!");
}

resizeIcons().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
