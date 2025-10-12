#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

class LogoFetcher {
  constructor() {
    this.targetUrl = 'https://fitgirl-repacks.site/';
    this.iconsDir = path.join(process.cwd(), 'assets', 'icons');
  }

  async fetch() {
    console.log('🔍 Fetching FitGirl logo from website...');
    
    try {
      const html = await this.fetchHTML(this.targetUrl);
      const logoUrl = this.extractLogoUrl(html);
      
      if (logoUrl) {
        console.log(`✓ Found logo: ${logoUrl}`);
        await this.downloadLogo(logoUrl);
      } else {
        console.warn('⚠️  Could not find logo URL in HTML');
        this.createFallbackLogo();
      }
    } catch (error) {
      console.error('❌ Error fetching logo:', error.message);
      console.log('📝 Creating fallback logo...');
      this.createFallbackLogo();
    }
  }

  fetchHTML(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  extractLogoUrl(html) {
    // Look for common logo patterns
    const patterns = [
      /<img[^>]*src=["']([^"']*logo[^"']*)["']/i,
      /<img[^>]*class=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']*)["']/i,
      /<a[^>]*class=["'][^"']*logo[^"']*["'][^>]*>\s*<img[^>]*src=["']([^"']*)["']/i,
      /header[^>]*>\s*<[^>]*>\s*<img[^>]*src=["']([^"']*)["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let url = match[1];
        // Convert relative URLs to absolute
        if (url.startsWith('//')) {
          url = 'https:' + url;
        } else if (url.startsWith('/')) {
          url = 'https://fitgirl-repacks.site' + url;
        } else if (!url.startsWith('http')) {
          url = 'https://fitgirl-repacks.site/' + url;
        }
        return url;
      }
    }
    return null;
  }

  async downloadLogo(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          // Follow redirect
          return this.downloadLogo(res.headers.location).then(resolve).catch(reject);
        }

        const ext = path.extname(url).toLowerCase() || '.png';
        const filename = 'fitgirl-logo' + ext;
        const filepath = path.join(this.iconsDir, filename);

        if (!fs.existsSync(this.iconsDir)) {
          fs.mkdirSync(this.iconsDir, { recursive: true });
        }

        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded logo to ${filepath}`);
          
          // If it's SVG or PNG, create the icon sizes
          if (ext === '.png') {
            this.createIconSizesFromPNG(filepath);
          } else if (ext === '.svg') {
            console.log('📝 SVG downloaded. Use assets/generate-icons.html to create PNG icons.');
            fs.copyFileSync(filepath, path.join(this.iconsDir, 'icon.svg'));
          }
          resolve();
        });

        fileStream.on('error', reject);
      }).on('error', reject);
    });
  }

  createIconSizesFromPNG(sourcePath) {
    // Note: Without external libraries, we can't resize PNGs easily
    // So we'll just copy the source as the base icon
    const sizes = [16, 48, 128];
    console.log('📝 To create proper icon sizes, use assets/generate-icons.html');
    console.log('   or manually resize the downloaded logo');
  }

  createFallbackLogo() {
    if (!fs.existsSync(this.iconsDir)) {
      fs.mkdirSync(this.iconsDir, { recursive: true });
    }

    // Create a simple SVG logo inspired by FitGirl branding (pink theme)
    const svg = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff1744;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f50057;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="#fff" stroke-width="3"/>
  <g transform="translate(64, 64)">
    <!-- Stylized "FG" letters -->
    <text x="0" y="10" text-anchor="middle" fill="white" font-family="Arial Black, sans-serif" font-size="42" font-weight="900">FG</text>
  </g>
</svg>`;

    const svgPath = path.join(this.iconsDir, 'icon.svg');
    fs.writeFileSync(svgPath, svg);
    console.log(`✓ Created fallback FitGirl-themed logo: ${svgPath}`);
    console.log('📝 Use assets/generate-icons.html to convert to PNG');
  }
}

if (require.main === module) {
  const fetcher = new LogoFetcher();
  fetcher.fetch().catch(console.error);
}

module.exports = LogoFetcher;

