#!/usr/bin/env node

/**
 * Build script for X Unfollow Checker Extension
 * Creates production-ready builds for different browsers
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExtensionBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.buildDir = path.join(this.rootDir, 'build');
    this.distDir = path.join(this.rootDir, 'dist');

    this.requiredFiles = [
      'manifest.json',
      'background.js',
      'content.js',
      'popup.html',
      'popup.css',
      'popup.js'
    ];

    this.optionalFiles = ['README.md', 'INSTALLATION.md', 'LICENSE'];

    this.iconSizes = [16, 32, 48, 128];
  }

  async build() {
    console.log('🚀 Building X Unfollow Checker Extension...\n');

    try {
      await this.validateFiles();
      await this.createDirectories();
      await this.buildChrome();
      await this.buildFirefox();
      await this.buildEdge();
      await this.createZipFiles();

      console.log('✅ Build completed successfully!\n');
      console.log('📁 Build files created in:');
      console.log(`   - ${this.distDir}/chrome/`);
      console.log(`   - ${this.distDir}/firefox/`);
      console.log(`   - ${this.distDir}/edge/`);
      console.log(`   - ${this.distDir}/x-unfollow-checker-chrome.zip`);
      console.log(`   - ${this.distDir}/x-unfollow-checker-firefox.zip`);
      console.log(`   - ${this.distDir}/x-unfollow-checker-edge.zip`);
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  async validateFiles() {
    console.log('🔍 Validating files...');

    // Check required files
    for (const file of this.requiredFiles) {
      const filePath = path.join(this.rootDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    // Check icons
    const iconsDir = path.join(this.rootDir, 'icons');
    if (fs.existsSync(iconsDir)) {
      for (const size of this.iconSizes) {
        const iconPath = path.join(iconsDir, `icon${size}.png`);
        if (!fs.existsSync(iconPath)) {
          console.warn(`⚠️  Icon missing: icons/icon${size}.png`);
        }
      }
    } else {
      console.warn('⚠️  Icons directory not found. Extension will use default icons.');
    }

    // Validate manifest.json
    const manifestPath = path.join(this.rootDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    if (manifest.manifest_version !== 3) {
      throw new Error('Invalid manifest version. Expected version 3.');
    }

    console.log('✅ File validation passed\n');
  }

  async createDirectories() {
    console.log('📁 Creating build directories...');

    // Clean and create directories
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true });
    }
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true });
    }

    fs.mkdirSync(this.buildDir, { recursive: true });
    fs.mkdirSync(this.distDir, { recursive: true });
    fs.mkdirSync(path.join(this.distDir, 'chrome'), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, 'firefox'), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, 'edge'), { recursive: true });

    console.log('✅ Directories created\n');
  }

  async buildChrome() {
    console.log('🟢 Building Chrome version...');

    const chromeDir = path.join(this.distDir, 'chrome');

    // Copy all files
    this.copyFiles(chromeDir);

    // Chrome-specific manifest modifications
    const manifestPath = path.join(chromeDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Ensure Chrome compatibility
    manifest.minimum_chrome_version = '88';

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('✅ Chrome build completed\n');
  }

  async buildFirefox() {
    console.log('🟠 Building Firefox version...');

    const firefoxDir = path.join(this.distDir, 'firefox');

    // Copy all files
    this.copyFiles(firefoxDir);

    // Firefox-specific manifest modifications
    const manifestPath = path.join(firefoxDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Add Firefox-specific fields
    manifest.browser_specific_settings = {
      gecko: {
        id: 'x-unfollow-checker@example.com',
        strict_min_version: '109.0'
      }
    };

    // Firefox uses different permission format for some cases
    if (manifest.host_permissions) {
      // Firefox handles host permissions differently in MV3
      manifest.permissions = manifest.permissions || [];
      manifest.permissions = [...new Set([...manifest.permissions, ...manifest.host_permissions])];
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('✅ Firefox build completed\n');
  }

  async buildEdge() {
    console.log('🔵 Building Edge version...');

    const edgeDir = path.join(this.distDir, 'edge');

    // Copy all files
    this.copyFiles(edgeDir);

    // Edge-specific manifest modifications
    const manifestPath = path.join(edgeDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Ensure Edge compatibility
    manifest.minimum_edge_version = '88';

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('✅ Edge build completed\n');
  }

  copyFiles(targetDir) {
    // Copy required files
    for (const file of this.requiredFiles) {
      const sourcePath = path.join(this.rootDir, file);
      const targetPath = path.join(targetDir, file);
      fs.copyFileSync(sourcePath, targetPath);
    }

    // Copy optional files
    for (const file of this.optionalFiles) {
      const sourcePath = path.join(this.rootDir, file);
      if (fs.existsSync(sourcePath)) {
        const targetPath = path.join(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
      }
    }

    // Copy icons directory if it exists
    const iconsDir = path.join(this.rootDir, 'icons');
    if (fs.existsSync(iconsDir)) {
      const targetIconsDir = path.join(targetDir, 'icons');
      fs.mkdirSync(targetIconsDir, { recursive: true });

      const iconFiles = fs.readdirSync(iconsDir);
      for (const iconFile of iconFiles) {
        if (iconFile.endsWith('.png')) {
          fs.copyFileSync(path.join(iconsDir, iconFile), path.join(targetIconsDir, iconFile));
        }
      }
    }
  }

  async createZipFiles() {
    console.log('📦 Creating ZIP files...');

    const browsers = ['chrome', 'firefox', 'edge'];

    for (const browser of browsers) {
      const sourceDir = path.join(this.distDir, browser);
      const zipPath = path.join(this.distDir, `x-unfollow-checker-${browser}.zip`);

      await this.createZip(sourceDir, zipPath);
      console.log(`✅ Created ${browser} ZIP file`);
    }

    console.log('✅ All ZIP files created\n');
  }

  async createZip(sourceDir, zipPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        resolve();
      });

      archive.on('error', err => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  async getStats() {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      browsers: {}
    };

    const browsers = ['chrome', 'firefox', 'edge'];

    for (const browser of browsers) {
      const browserDir = path.join(this.distDir, browser);
      const zipPath = path.join(this.distDir, `x-unfollow-checker-${browser}.zip`);

      if (fs.existsSync(browserDir) && fs.existsSync(zipPath)) {
        const zipStats = fs.statSync(zipPath);
        stats.browsers[browser] = {
          zipSize: this.formatBytes(zipStats.size)
        };
        stats.totalSize += zipStats.size;
      }
    }

    return stats;
  }

  formatBytes(bytes) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the build if this script is executed directly
if (require.main === module) {
  const builder = new ExtensionBuilder();
  builder.build().catch(console.error);
}

module.exports = ExtensionBuilder;
