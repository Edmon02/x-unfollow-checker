# Development Guide

This guide will help you set up your development environment and contribute to X
Unfollow Checker.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm 8+
- **Git** for version control
- **Chrome/Edge/Firefox** for testing
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Chrome Extension Developer Tools

### Setup

1. **Clone and Setup**

   ```bash
   git clone https://github.com/Edmon02/x-unfollow-checker.git
   cd x-unfollow-checker
   npm install
   ```

2. **Load Extension in Browser**

   ```bash
   # Chrome/Edge
   # 1. Open chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked"
   # 4. Select this project folder

   # Firefox
   # 1. Open about:debugging#/runtime/this-firefox
   # 2. Click "Load Temporary Add-on"
   # 3. Select manifest.json
   ```

3. **Start Development**
   ```bash
   npm run dev          # Development build with watching
   npm run test         # Run tests
   npm run lint         # Check code quality
   ```

## 🏗️ Development Workflow

### Daily Development

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit source files
   - Extension auto-reloads in browser
   - Check console for errors

3. **Test Changes**

   ```bash
   npm test             # Run all tests
   npm run test:manual  # Open test interface
   ```

4. **Check Code Quality**
   ```bash
   npm run lint         # Fix linting issues
   npm run format       # Format code
   ```

### Git Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Commits**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

## 🧪 Testing

### Manual Testing

1. **Load Extension**
   - Install in browser as unpacked extension
   - Navigate to X.com
   - Test all features thoroughly

2. **Test Interface**

   ```bash
   npm run test:manual
   ```

   Opens `tests/test-extension.html` for interactive testing

3. **Console Debugging**
   - **Popup Console**: Right-click popup → Inspect
   - **Background Console**: chrome://extensions/ → "Inspect views"
   - **Content Script**: F12 on X.com page

### Automated Testing

```bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
```

### Browser Compatibility

```bash
npm run test:browser:chrome   # Chrome-specific tests
npm run test:browser:firefox  # Firefox-specific tests
npm run test:browser:edge     # Edge-specific tests
```

## 🔧 Build System

### Build Commands

```bash
npm run build              # Development build
npm run build:prod         # Production build (optimized)
npm run clean              # Clean build artifacts
npm run package            # Create distribution package
```

### Build Process

1. **Validation** - Check manifest.json and icons
2. **Linting** - ESLint code quality checks
3. **Testing** - Run test suite
4. **Optimization** - Minify and optimize files
5. **Packaging** - Create .zip for distribution

## 🎨 UI Development

### Glass Morphism Design System

The extension uses a glass morphism design with these principles:

```css
/* Glass morphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

/* Gradient scrollbars */
.custom-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #667eea, #764ba2);
}
```

### CSS Guidelines

- Use CSS custom properties for theming
- Follow BEM methodology for class names
- Mobile-first responsive design
- Smooth transitions for all interactions

### Component Structure

```javascript
// UI Component Pattern
class UIComponent {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    // Create HTML structure
  }

  bindEvents() {
    // Add event listeners
  }
}
```

## 📁 File Structure

### Core Files

- **`manifest.json`** - Extension configuration
- **`popup.html/js/css`** - Main interface
- **`background.js`** - Service worker
- **`content.js`** - X.com page integration

### Development Files

- **`scripts/`** - Build tools
- **`tests/`** - Test files
- **`docs/`** - Documentation
- **`.github/`** - CI/CD configuration

## 🔍 Debugging

### Common Debug Scenarios

1. **Extension Not Loading**

   ```bash
   # Check manifest.json syntax
   npm run validate-manifest

   # Check console errors
   # chrome://extensions/ → Details → Inspect views
   ```

2. **Content Script Issues**

   ```javascript
   // Add debug logging
   console.log('🔧 DEBUG: Content script loaded');

   // Check page detection
   if (!window.location.href.includes('x.com')) {
     console.warn('Not on X.com');
   }
   ```

3. **Message Passing Problems**

   ```javascript
   // Background script
   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
     console.log('🔧 Message received:', message);
     // Always return true for async responses
     return true;
   });

   // Popup script
   const response = await chrome.runtime.sendMessage({
     type: 'TEST_MESSAGE'
   });
   console.log('🔧 Response:', response);
   ```

### Debug Tools

- **Chrome DevTools**: For popup and content script debugging
- **Extension Console**: chrome://extensions/ → "Inspect views"
- **Network Tab**: Monitor API calls and resources
- **Performance Tab**: Profile scanning performance

## 🔒 Security Guidelines

### Code Security

- Never use `eval()` or `innerHTML` with user data
- Validate all inputs before processing
- Use Content Security Policy (CSP)
- Follow principle of least privilege

### Extension Security

- Request minimal permissions
- Sanitize data from X.com
- Use secure communication patterns
- Avoid storing sensitive data

### Example: Safe HTML Insertion

```javascript
// ❌ Dangerous
element.innerHTML = userInput;

// ✅ Safe
element.textContent = userInput;

// ✅ Safe with validation
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}
```

## 📦 Publishing

### Preparation

1. **Version Bump**

   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   npm version minor  # 1.0.0 → 1.1.0
   npm version major  # 1.0.0 → 2.0.0
   ```

2. **Build for Production**

   ```bash
   npm run build:prod
   ```

3. **Create Package**
   ```bash
   npm run package
   ```

### Chrome Web Store

1. **Developer Dashboard**
   - Upload package zip
   - Fill store listing
   - Submit for review

2. **Store Assets**
   - Screenshots (1280x800, 640x400)
   - Promotional tile (440x280)
   - Description and keywords

### GitHub Release

```bash
git tag v1.0.0
git push origin v1.0.0
# Create release on GitHub with CHANGELOG.md notes
```

## 🎯 Performance Guidelines

### Scanning Performance

- Use requestIdleCallback for non-critical work
- Implement progressive loading
- Batch DOM operations
- Cache repeated calculations

### Memory Management

```javascript
// Clean up event listeners
component.destroy = function () {
  element.removeEventListener('click', this.handleClick);
};

// Use WeakMap for object associations
const elementData = new WeakMap();
```

### Best Practices

- Minimize DOM queries
- Use efficient selectors
- Implement virtual scrolling for large lists
- Profile with Chrome DevTools

## 🐛 Common Issues

### Extension Context Invalidated

**Problem**: Extension reloaded during development **Solution**:

```javascript
try {
  await chrome.runtime.sendMessage({ type: 'PING' });
} catch (error) {
  console.log('Extension context invalidated, please reload');
}
```

### Content Script Not Injected

**Problem**: Script doesn't run on X.com **Solution**: Check manifest.json
matches patterns

### Background Script Not Responding

**Problem**: No response from background script **Solution**: Check service
worker is active in chrome://extensions/

## 📚 Learning Resources

### Chrome Extension Development

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

### Web Technologies

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

### Tools and Libraries

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Git Best Practices](https://git-scm.com/doc)

---

Happy coding! 🚀 If you have questions, check the
[Contributing Guide](../CONTRIBUTING.md) or open an issue.
