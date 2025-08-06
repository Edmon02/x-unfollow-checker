#!/usr/bin/env node

/**
 * Icon Generator for X Unfollow Checker Extension
 * Creates simple placeholder icons if none exist
 * For production, replace with professional icons
 */

const fs = require('fs');
const path = require('path');

class IconGenerator {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.iconsDir = path.join(this.rootDir, 'icons');
    this.sizes = [16, 32, 48, 128];
  }

  async generateIcons() {
    console.log('🎨 Generating extension icons...\n');

    try {
      this.createIconsDirectory();
      this.generateSVGIcons();
      console.log('✅ Icons generated successfully!\n');
      console.log('📝 Note: These are placeholder icons. For production, replace with:');
      console.log('   - Professional design icons');
      console.log('   - PNG format with transparency');
      console.log('   - Proper branding elements');
      console.log('   - High-quality graphics\n');
    } catch (error) {
      console.error('❌ Icon generation failed:', error.message);
      process.exit(1);
    }
  }

  createIconsDirectory() {
    if (!fs.existsSync(this.iconsDir)) {
      fs.mkdirSync(this.iconsDir, { recursive: true });
      console.log('📁 Created icons directory');
    }
  }

  generateSVGIcons() {
    console.log('🔧 Creating SVG icon templates...');

    for (const size of this.sizes) {
      const svgContent = this.createSVGIcon(size);
      const svgPath = path.join(this.iconsDir, `icon${size}.svg`);

      fs.writeFileSync(svgPath, svgContent);
      console.log(`✅ Created icon${size}.svg`);
    }

    // Also create a base template
    const baseTemplate = this.createBaseTemplate();
    const templatePath = path.join(this.iconsDir, 'icon-template.svg');
    fs.writeFileSync(templatePath, baseTemplate);
    console.log('✅ Created icon-template.svg (editable base)');
  }

  createSVGIcon(size) {
    const strokeWidth = Math.max(1, size / 16);
    const fontSize = Math.max(8, size / 4);
    const iconSize = size * 0.6;
    const centerX = size / 2;
    const centerY = size / 2;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${centerX}" cy="${centerY}" r="${size / 2 - 2}" 
          fill="url(#gradient)" stroke="#1da1f2" stroke-width="${strokeWidth}"/>
  
  <!-- Gradient definition -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1da1f2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1991db;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Search/unfollow icon -->
  <g transform="translate(${centerX - iconSize / 2}, ${centerY - iconSize / 2})">
    <!-- Magnifying glass -->
    <circle cx="${iconSize * 0.35}" cy="${iconSize * 0.35}" r="${iconSize * 0.25}" 
            fill="none" stroke="white" stroke-width="${strokeWidth * 1.5}"/>
    <line x1="${iconSize * 0.55}" y1="${iconSize * 0.55}" 
          x2="${iconSize * 0.75}" y2="${iconSize * 0.75}" 
          stroke="white" stroke-width="${strokeWidth * 1.5}" stroke-linecap="round"/>
    
    <!-- X mark (unfollow indicator) -->
    <g transform="translate(${iconSize * 0.6}, ${iconSize * 0.1})">
      <line x1="0" y1="0" x2="${iconSize * 0.3}" y2="${iconSize * 0.3}" 
            stroke="#ff4444" stroke-width="${strokeWidth * 2}" stroke-linecap="round"/>
      <line x1="${iconSize * 0.3}" y1="0" x2="0" y2="${iconSize * 0.3}" 
            stroke="#ff4444" stroke-width="${strokeWidth * 2}" stroke-linecap="round"/>
    </g>
  </g>
  
  <!-- Size indicator text (only for larger icons) -->
  ${
    size >= 32
      ? `
  <text x="${centerX}" y="${size - 4}" 
        font-family="Arial, sans-serif" font-size="${Math.max(6, fontSize / 2)}" 
        fill="#666" text-anchor="middle">${size}</text>
  `
      : ''
  }
</svg>`;
  }

  createBaseTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Base template for professional icon design -->
  
  <!-- Background -->
  <rect width="128" height="128" rx="24" fill="url(#bgGradient)"/>
  
  <!-- Gradient definitions -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1da1f2"/>
      <stop offset="100%" style="stop-color:#1991db"/>
    </linearGradient>
    
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f0f0f0"/>
    </linearGradient>
  </defs>
  
  <!-- Main icon content -->
  <g transform="translate(16, 16)">
    <!-- Search magnifying glass -->
    <circle cx="35" cy="35" r="25" 
            fill="none" stroke="url(#iconGradient)" stroke-width="6"/>
    <line x1="55" y1="55" x2="75" y2="75" 
          stroke="url(#iconGradient)" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Unfollow X indicator -->
    <g transform="translate(60, 10)">
      <circle cx="16" cy="16" r="20" fill="#ff4444"/>
      <line x1="8" y1="8" x2="24" y2="24" 
            stroke="white" stroke-width="4" stroke-linecap="round"/>
      <line x1="24" y1="8" x2="8" y2="24" 
            stroke="white" stroke-width="4" stroke-linecap="round"/>
    </g>
    
    <!-- Optional: Twitter/X logo element -->
    <!-- Add your custom branding here -->
    
  </g>
  
  <!-- Optional: Brand text -->
  <text x="64" y="110" font-family="Arial, sans-serif" font-size="12" 
        fill="white" text-anchor="middle" opacity="0.8">UNFOLLOW</text>
</svg>`;
  }

  createInstructions() {
    const instructionsPath = path.join(this.iconsDir, 'README.md');
    const instructions = `# Extension Icons

## Current Status
This directory contains automatically generated placeholder icons for the X Unfollow Checker extension.

## Files Generated
- \`icon16.svg\` - 16x16 pixel icon (browser toolbar)
- \`icon32.svg\` - 32x32 pixel icon (browser toolbar, high DPI)
- \`icon48.svg\` - 48x48 pixel icon (extensions page)
- \`icon128.svg\` - 128x128 pixel icon (Chrome Web Store, large displays)
- \`icon-template.svg\` - Editable base template

## For Production Use

### Required Format
The extension manifest expects PNG files:
- \`icon16.png\`
- \`icon32.png\`
- \`icon48.png\`
- \`icon128.png\`

### Creating Professional Icons

1. **Design Tools**
   - Adobe Illustrator or Inkscape (vector)
   - Photoshop or GIMP (raster)
   - Figma or Sketch (UI design)

2. **Design Guidelines**
   - Use consistent branding colors
   - Ensure readability at small sizes (16x16)
   - Include recognizable elements (search, X logo, unfollow concept)
   - Use transparency for rounded corners
   - Test on different backgrounds

3. **Technical Requirements**
   - PNG format with transparency
   - Square aspect ratio
   - Clean edges and crisp lines
   - Optimized file size

4. **Conversion Process**
   - Edit \`icon-template.svg\` or create new design
   - Export as PNG at required sizes
   - Replace the generated SVG files
   - Test in browser extension

### Color Scheme Suggestions
- Primary: #1da1f2 (Twitter Blue)
- Secondary: #1991db (Darker Blue)
- Accent: #ff4444 (Red for unfollow)
- Text: #ffffff (White)
- Background: Gradient or solid color

### Icon Concepts
- Magnifying glass + X mark
- Twitter bird + unfollow symbol
- User icons with minus signs
- Search + filter metaphor
`;

    fs.writeFileSync(instructionsPath, instructions);
    console.log('✅ Created icons/README.md with instructions');
  }

  convertSVGToPNG() {
    // Note: This would require additional dependencies like sharp or puppeteer
    // For now, we'll just create the SVG files and provide instructions
    console.log('💡 To convert SVG to PNG:');
    console.log('   1. Use online converters like convertio.co');
    console.log('   2. Use design tools (Illustrator, Photoshop)');
    console.log('   3. Use command line tools (ImageMagick, rsvg-convert)');
    console.log('   4. Use Node.js libraries (sharp, puppeteer)');
  }
}

// Create a simple PNG generator using canvas (Node.js)
class SimplePNGGenerator {
  constructor() {
    this.iconsDir = path.join(__dirname, '..', 'icons');
    this.sizes = [16, 32, 48, 128];
  }

  async generatePNGIcons() {
    console.log('🖼️  Generating simple PNG icons...');

    try {
      // Try to use canvas if available
      const { createCanvas } = require('canvas');

      for (const size of this.sizes) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        this.drawIcon(ctx, size);

        const buffer = canvas.toBuffer('image/png');
        const pngPath = path.join(this.iconsDir, `icon${size}.png`);

        fs.writeFileSync(pngPath, buffer);
        console.log(`✅ Created icon${size}.png`);
      }
    } catch (error) {
      console.log('⚠️  Canvas not available. SVG icons created instead.');
      console.log('   Install canvas for PNG generation: npm install canvas');
      return false;
    }

    return true;
  }

  drawIcon(ctx, size) {
    const center = size / 2;
    const radius = size / 2 - 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Background circle with gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1da1f2');
    gradient.addColorStop(1, '#1991db');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#1991db';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Search icon
    const iconSize = size * 0.6;
    const iconOffset = (size - iconSize) / 2;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(1, size / 16);
    ctx.lineCap = 'round';

    // Magnifying glass circle
    const glassRadius = iconSize * 0.25;
    const glassX = iconOffset + iconSize * 0.35;
    const glassY = iconOffset + iconSize * 0.35;

    ctx.beginPath();
    ctx.arc(glassX, glassY, glassRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Magnifying glass handle
    const handleStartX = glassX + glassRadius * 0.7;
    const handleStartY = glassY + glassRadius * 0.7;
    const handleEndX = iconOffset + iconSize * 0.75;
    const handleEndY = iconOffset + iconSize * 0.75;

    ctx.beginPath();
    ctx.moveTo(handleStartX, handleStartY);
    ctx.lineTo(handleEndX, handleEndY);
    ctx.stroke();

    // X mark (unfollow indicator)
    if (size >= 32) {
      const xSize = iconSize * 0.15;
      const xX = iconOffset + iconSize * 0.75;
      const xY = iconOffset + iconSize * 0.15;

      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = Math.max(2, size / 20);

      ctx.beginPath();
      ctx.moveTo(xX - xSize, xY - xSize);
      ctx.lineTo(xX + xSize, xY + xSize);
      ctx.moveTo(xX + xSize, xY - xSize);
      ctx.lineTo(xX - xSize, xY + xSize);
      ctx.stroke();
    }
  }
}

// Main execution
async function main() {
  const generator = new IconGenerator();
  await generator.generateIcons();
  generator.createInstructions();
  generator.convertSVGToPNG();

  // Try to generate PNG icons if canvas is available
  const pngGenerator = new SimplePNGGenerator();
  const pngCreated = await pngGenerator.generatePNGIcons();

  if (pngCreated) {
    console.log('\n🎉 PNG icons created successfully!');
  } else {
    console.log('\n📝 Manual PNG conversion required.');
    console.log('   Use the SVG files as templates to create PNG versions.');
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { IconGenerator, SimplePNGGenerator };
