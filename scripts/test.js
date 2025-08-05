#!/usr/bin/env node

/**
 * Test script for X Unfollow Checker Extension
 * Validates extension files and functionality
 */

const fs = require('fs');
const path = require('path');

class ExtensionTester {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.errors = [];
        this.warnings = [];
        this.tests = 0;
        this.passed = 0;
    }

    async runTests() {
        console.log('🧪 Running X Unfollow Checker Extension Tests...\n');

        try {
            await this.testManifest();
            await this.testFiles();
            await this.testJavaScript();
            await this.testCSS();
            await this.testHTML();
            await this.testIcons();

            this.printResults();

            if (this.errors.length > 0) {
                process.exit(1);
            }

        } catch (error) {
            console.error('❌ Test runner failed:', error.message);
            process.exit(1);
        }
    }

    test(description, testFn) {
        this.tests++;
        try {
            const result = testFn();
            if (result !== false) {
                this.passed++;
                console.log(`✅ ${description}`);
                return true;
            } else {
                this.errors.push(description);
                console.log(`❌ ${description}`);
                return false;
            }
        } catch (error) {
            this.errors.push(`${description}: ${error.message}`);
            console.log(`❌ ${description}: ${error.message}`);
            return false;
        }
    }

    warn(message) {
        this.warnings.push(message);
        console.log(`⚠️  ${message}`);
    }

    async testManifest() {
        console.log('📋 Testing manifest.json...');

        const manifestPath = path.join(this.rootDir, 'manifest.json');

        this.test('manifest.json exists', () => {
            return fs.existsSync(manifestPath);
        });

        if (!fs.existsSync(manifestPath)) return;

        let manifest;
        this.test('manifest.json is valid JSON', () => {
            const content = fs.readFileSync(manifestPath, 'utf8');
            manifest = JSON.parse(content);
            return true;
        });

        if (!manifest) return;

        this.test('manifest version is 3', () => {
            return manifest.manifest_version === 3;
        });

        this.test('extension name is present', () => {
            return manifest.name && manifest.name.length > 0;
        });

        this.test('extension version is present', () => {
            return manifest.version && /^\d+\.\d+\.\d+$/.test(manifest.version);
        });

        this.test('extension description is present', () => {
            return manifest.description && manifest.description.length > 10;
        });

        this.test('required permissions are present', () => {
            const requiredPerms = ['activeTab', 'storage'];
            return requiredPerms.every(perm => manifest.permissions?.includes(perm));
        });

        this.test('host permissions include X/Twitter', () => {
            const hostPerms = manifest.host_permissions || [];
            return hostPerms.some(perm => perm.includes('x.com') || perm.includes('twitter.com'));
        });

        this.test('background script is defined', () => {
            return manifest.background?.service_worker === 'background.js';
        });

        this.test('content script is defined', () => {
            return manifest.content_scripts?.length > 0 &&
                manifest.content_scripts[0].js?.includes('content.js');
        });

        this.test('action popup is defined', () => {
            return manifest.action?.default_popup === 'popup.html';
        });

        this.test('icons are defined', () => {
            const icons = manifest.icons;
            return icons && icons['16'] && icons['32'] && icons['48'] && icons['128'];
        });

        console.log('');
    }

    async testFiles() {
        console.log('📁 Testing required files...');

        const requiredFiles = [
            'background.js',
            'content.js',
            'popup.html',
            'popup.css',
            'popup.js'
        ];

        for (const file of requiredFiles) {
            this.test(`${file} exists`, () => {
                return fs.existsSync(path.join(this.rootDir, file));
            });
        }

        const optionalFiles = [
            'README.md',
            'package.json',
            'LICENSE'
        ];

        for (const file of optionalFiles) {
            const filePath = path.join(this.rootDir, file);
            if (!fs.existsSync(filePath)) {
                this.warn(`Optional file missing: ${file}`);
            }
        }

        console.log('');
    }

    async testJavaScript() {
        console.log('📜 Testing JavaScript files...');

        const jsFiles = ['background.js', 'content.js', 'popup.js'];

        for (const file of jsFiles) {
            const filePath = path.join(this.rootDir, file);

            if (!fs.existsSync(filePath)) continue;

            this.test(`${file} is valid JavaScript`, () => {
                const content = fs.readFileSync(filePath, 'utf8');

                // Basic syntax check
                try {
                    new Function(content);
                    return true;
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        throw new Error(`Syntax error: ${error.message}`);
                    }
                    return true; // Other errors might be due to browser APIs
                }
            });

            this.test(`${file} has proper structure`, () => {
                const content = fs.readFileSync(filePath, 'utf8');

                // Check for common patterns
                if (file === 'background.js') {
                    return content.includes('chrome.runtime.onMessage') ||
                        content.includes('chrome.runtime.onInstalled');
                } else if (file === 'content.js') {
                    return content.includes('document.querySelector') ||
                        content.includes('window.location');
                } else if (file === 'popup.js') {
                    return content.includes('document.getElementById') ||
                        content.includes('addEventListener');
                }

                return true;
            });

            this.test(`${file} has error handling`, () => {
                const content = fs.readFileSync(filePath, 'utf8');
                return content.includes('try') && content.includes('catch') ||
                    content.includes('.catch(') ||
                    content.includes('error');
            });
        }

        console.log('');
    }

    async testCSS() {
        console.log('🎨 Testing CSS files...');

        const cssPath = path.join(this.rootDir, 'popup.css');

        if (!fs.existsSync(cssPath)) {
            this.errors.push('popup.css not found');
            return;
        }

        this.test('popup.css has content', () => {
            const content = fs.readFileSync(cssPath, 'utf8');
            return content.length > 100;
        });

        this.test('popup.css has basic styles', () => {
            const content = fs.readFileSync(cssPath, 'utf8');
            return content.includes('body') &&
                content.includes('button') &&
                content.includes('popup-container');
        });

        this.test('popup.css has responsive design', () => {
            const content = fs.readFileSync(cssPath, 'utf8');
            return content.includes('@media') || content.includes('flex') || content.includes('grid');
        });

        console.log('');
    }

    async testHTML() {
        console.log('📄 Testing HTML files...');

        const htmlPath = path.join(this.rootDir, 'popup.html');

        if (!fs.existsSync(htmlPath)) {
            this.errors.push('popup.html not found');
            return;
        }

        this.test('popup.html is valid HTML', () => {
            const content = fs.readFileSync(htmlPath, 'utf8');
            return content.includes('<!DOCTYPE html>') &&
                content.includes('<html') &&
                content.includes('<head>') &&
                content.includes('<body>');
        });

        this.test('popup.html links CSS file', () => {
            const content = fs.readFileSync(htmlPath, 'utf8');
            return content.includes('popup.css');
        });

        this.test('popup.html links JavaScript file', () => {
            const content = fs.readFileSync(htmlPath, 'utf8');
            return content.includes('popup.js');
        });

        this.test('popup.html has required elements', () => {
            const content = fs.readFileSync(htmlPath, 'utf8');
            return content.includes('start-scan-btn') &&
                content.includes('results-section') &&
                content.includes('allowlist');
        });

        this.test('popup.html has proper meta tags', () => {
            const content = fs.readFileSync(htmlPath, 'utf8');
            return content.includes('charset="UTF-8"') &&
                content.includes('viewport');
        });

        console.log('');
    }

    async testIcons() {
        console.log('🎨 Testing icons...');

        const iconsDir = path.join(this.rootDir, 'icons');
        const iconSizes = [16, 32, 48, 128];

        this.test('icons directory exists', () => {
            return fs.existsSync(iconsDir);
        });

        if (!fs.existsSync(iconsDir)) {
            this.warn('Icons directory not found. Extension will use default icons.');
            return;
        }

        for (const size of iconSizes) {
            const pngPath = path.join(iconsDir, `icon${size}.png`);
            const svgPath = path.join(iconsDir, `icon${size}.svg`);

            if (fs.existsSync(pngPath)) {
                this.test(`icon${size}.png exists`, () => true);

                this.test(`icon${size}.png is not empty`, () => {
                    const stats = fs.statSync(pngPath);
                    return stats.size > 0;
                });
            } else if (fs.existsSync(svgPath)) {
                this.warn(`icon${size}.png missing, but SVG found. Convert SVG to PNG for production.`);
            } else {
                this.warn(`icon${size}.png missing. Extension may not display properly.`);
            }
        }

        console.log('');
    }

    printResults() {
        console.log('📊 Test Results Summary');
        console.log('========================');
        console.log(`Tests run: ${this.tests}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.errors.length}`);
        console.log(`Warnings: ${this.warnings.length}`);

        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(error => console.log(`   - ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            this.warnings.forEach(warning => console.log(`   - ${warning}`));
        }

        if (this.errors.length === 0) {
            console.log('\n✅ All tests passed! Extension is ready for use.');
        } else {
            console.log('\n❌ Some tests failed. Please fix the errors before using the extension.');
        }

        console.log('');
    }
}

// File size analyzer
class FileSizeAnalyzer {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
    }

    analyze() {
        console.log('📏 File Size Analysis');
        console.log('====================');

        const files = [
            'manifest.json',
            'background.js',
            'content.js',
            'popup.html',
            'popup.css',
            'popup.js'
        ];

        let totalSize = 0;

        for (const file of files) {
            const filePath = path.join(this.rootDir, file);
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const size = this.formatBytes(stats.size);
                console.log(`${file.padEnd(20)}: ${size}`);
                totalSize += stats.size;
            }
        }

        // Check icons
        const iconsDir = path.join(this.rootDir, 'icons');
        if (fs.existsSync(iconsDir)) {
            const iconFiles = fs.readdirSync(iconsDir).filter(f => f.endsWith('.png') || f.endsWith('.svg'));
            let iconSize = 0;

            for (const iconFile of iconFiles) {
                const iconPath = path.join(iconsDir, iconFile);
                const stats = fs.statSync(iconPath);
                iconSize += stats.size;
            }

            if (iconSize > 0) {
                console.log(`icons/ (${iconFiles.length} files)`.padEnd(20) + `: ${this.formatBytes(iconSize)}`);
                totalSize += iconSize;
            }
        }

        console.log('-'.repeat(30));
        console.log(`Total size`.padEnd(20) + `: ${this.formatBytes(totalSize)}`);

        // Size recommendations
        console.log('\n💡 Size Recommendations:');
        if (totalSize > 1024 * 1024) {
            console.log('   ⚠️  Extension is quite large (>1MB). Consider optimization.');
        } else if (totalSize > 512 * 1024) {
            console.log('   ⚠️  Extension is moderately large (>512KB). Monitor size.');
        } else {
            console.log('   ✅ Extension size is reasonable.');
        }

        console.log('');
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Performance suggestions
class PerformanceAnalyzer {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
    }

    analyze() {
        console.log('⚡ Performance Analysis');
        console.log('=====================');

        const suggestions = [];

        // Check JavaScript file sizes
        const jsFiles = ['background.js', 'content.js', 'popup.js'];
        for (const file of jsFiles) {
            const filePath = path.join(this.rootDir, file);
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');

                if (stats.size > 50 * 1024) {
                    suggestions.push(`${file} is large (${this.formatBytes(stats.size)}). Consider code splitting.`);
                }

                // Check for common performance issues
                if (content.includes('setInterval') && !content.includes('clearInterval')) {
                    suggestions.push(`${file} uses setInterval without cleanup. Memory leak risk.`);
                }

                if (content.includes('innerHTML') && content.includes('+=')) {
                    suggestions.push(`${file} uses innerHTML +=. Consider more efficient DOM manipulation.`);
                }
            }
        }

        // Check CSS
        const cssPath = path.join(this.rootDir, 'popup.css');
        if (fs.existsSync(cssPath)) {
            const content = fs.readFileSync(cssPath, 'utf8');
            const lines = content.split('\n').length;

            if (lines > 1000) {
                suggestions.push('popup.css is very long. Consider CSS organization or minification.');
            }

            // Check for potential performance issues
            if (content.includes('*')) {
                suggestions.push('popup.css uses universal selector (*). May impact performance.');
            }
        }

        if (suggestions.length === 0) {
            console.log('✅ No performance issues detected.');
        } else {
            console.log('💡 Performance Suggestions:');
            suggestions.forEach(suggestion => console.log(`   - ${suggestion}`));
        }

        console.log('');
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Main execution
async function main() {
    const tester = new ExtensionTester();
    await tester.runTests();

    const sizeAnalyzer = new FileSizeAnalyzer();
    sizeAnalyzer.analyze();

    const perfAnalyzer = new PerformanceAnalyzer();
    perfAnalyzer.analyze();
}

// Run if this script is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { ExtensionTester, FileSizeAnalyzer, PerformanceAnalyzer };