# Contributing to X Unfollow Checker

Thank you for your interest in contributing to X Unfollow Checker! We welcome
contributions from the community and are pleased to have you join us.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and
inclusive environment for everyone. Please be kind and professional in all
interactions.

## 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues as you might find
that the bug has already been reported. When creating a bug report, please
include as many details as possible:

### Bug Report Template

```markdown
**Describe the bug** A clear and concise description of what the bug is.

**To Reproduce** Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior** A clear and concise description of what you expected to
happen.

**Screenshots** If applicable, add screenshots to help explain your problem.

**Environment:**

- Browser: [e.g. Chrome 120]
- Extension Version: [e.g. 1.0.0]
- OS: [e.g. macOS 14.0]

**Console Logs** If applicable, include any error messages from the browser
console.

**Additional context** Add any other context about the problem here.
```

## 💡 Suggesting Features

We love feature suggestions! Please check existing issues first to avoid
duplicates. When suggesting a feature:

### Feature Request Template

```markdown
**Is your feature request related to a problem?** A clear and concise
description of what the problem is.

**Describe the solution you'd like** A clear and concise description of what you
want to happen.

**Describe alternatives you've considered** A clear and concise description of
any alternative solutions you've considered.

**Additional context** Add any other context or screenshots about the feature
request here.
```

## 🔧 Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Chrome/Edge browser for testing

### Getting Started

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/x-unfollow-checker.git
   cd x-unfollow-checker
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Load Extension in Browser**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

4. **Make Changes**
   - Edit files as needed
   - Reload extension in browser to see changes

### Project Structure

```
x-unfollow-checker/
├── manifest.json         # Extension configuration
├── popup.html           # Main UI
├── popup.js             # UI logic
├── popup.css            # Styling
├── background.js        # Service worker
├── content.js           # Page interaction
├── icons/               # Extension icons
└── scripts/             # Build scripts
```

### Testing

1. **Manual Testing**
   - Load extension in browser
   - Navigate to X.com
   - Test all features thoroughly

2. **Test Files**

   ```bash
   # Open test page in browser
   open test-extension.html

   # Run test scripts
   npm test
   ```

3. **Console Debugging**
   - Open browser console (F12) for popup debugging
   - Use `chrome://extensions/` → "Inspect views" for background script

## 📝 Pull Request Process

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Keep changes focused and atomic
   - Follow existing code style
   - Add comments where necessary

3. **Test Thoroughly**
   - Test your changes in multiple scenarios
   - Ensure no existing functionality is broken
   - Test on different browser versions if possible

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add: clear description of your changes"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Provide clear title and description
   - Link any related issues

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
      not work as expected)
- [ ] Documentation update

## Testing

- [ ] I have tested these changes locally
- [ ] I have tested on multiple browsers (if applicable)
- [ ] All existing tests pass

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings
- [ ] I have tested that my fix is effective or that my feature works
```

## 🎨 Code Style Guidelines

### JavaScript

- Use ES6+ features where appropriate
- Use `const` and `let` instead of `var`
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

```javascript
// Good
const formatUsername = username => {
  return username.replace(/^@+/, '').toLowerCase();
};

// Add JSDoc for complex functions
/**
 * Scans the following list and identifies non-mutual followers
 * @param {Array} followingList - List of users being followed
 * @param {Array} allowlist - Users to exclude from results
 * @returns {Promise<Array>} Non-mutual followers
 */
async function scanFollowers(followingList, allowlist) {
  // Implementation
}
```

### CSS

- Use consistent naming conventions
- Group related properties together
- Use CSS custom properties for repeated values
- Follow mobile-first responsive design

```css
/* Good */
.button {
  /* Layout */
  display: flex;
  align-items: center;

  /* Styling */
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;

  /* Typography */
  font-size: 14px;
  font-weight: 500;

  /* Animation */
  transition: all 0.3s ease;
}
```

### HTML

- Use semantic HTML elements
- Include proper ARIA labels for accessibility
- Keep structure clean and logical

## 🚀 Release Process

1. **Version Bump**
   - Update `manifest.json` version
   - Update `package.json` version
   - Follow semantic versioning (MAJOR.MINOR.PATCH)

2. **Update Changelog**
   - Add new version section
   - List all changes, fixes, and new features

3. **Test Release**
   - Test thoroughly in clean environment
   - Verify all features work correctly

4. **Create Release**
   - Tag the release in Git
   - Create GitHub release with changelog
   - Upload to Chrome Web Store (if applicable)

## 🆘 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: Contact maintainers directly for sensitive issues

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- About dialog in the extension

Thank you for contributing to X Unfollow Checker! 🎉
