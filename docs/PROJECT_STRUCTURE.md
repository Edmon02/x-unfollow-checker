# Project Structure

This document explains the organization and structure of the X Unfollow Checker project.

## 📁 Root Directory

```
x-unfollow-checker/
├── 📄 manifest.json         # Extension manifest (Manifest V3)
├── 🎨 popup.html           # Main popup interface
├── 💻 popup.js             # Popup logic and UI interactions
├── 🎨 popup.css            # Glass morphism styling
├── 🔧 background.js        # Service worker for data management
├── 📜 content.js           # Content script for X.com integration
├── 📄 package.json         # Node.js dependencies and scripts
├── 📄 package-lock.json    # Locked dependency versions
├── 🚫 .gitignore          # Git ignore rules
├── 📋 README.md           # Project documentation
├── 📋 CHANGELOG.md        # Version history
├── 📋 CONTRIBUTING.md     # Contribution guidelines
├── 📋 SECURITY.md         # Security policy
├── 📄 LICENSE             # MIT license
├── 📁 .github/            # GitHub configuration
├── 📁 icons/              # Extension icons
├── 📁 scripts/            # Build and utility scripts
├── 📁 src/                # Source code (for future refactoring)
├── 📁 docs/               # Documentation
└── 📁 tests/              # Test files
```

## 📁 Directory Breakdown

### `.github/`
GitHub-specific configuration files:
- **workflows/**: GitHub Actions CI/CD pipelines
- **ISSUE_TEMPLATE/**: Issue templates for bugs, features, questions
- **pull_request_template.md**: PR template

### `icons/`
Extension icons in various sizes:
- `icon16.png` - Toolbar icon
- `icon32.png` - Management page icon
- `icon48.png` - Extension management
- `icon128.png` - Chrome Web Store

### `scripts/`
Build tools and utility scripts:
- `build.js` - Main build script
- `generate-icons.js` - Icon generation
- `test.js` - Test runner
- `validate-manifest.js` - Manifest validation
- `package.js` - Packaging for distribution

### `src/` (Future)
Organized source code for larger projects:
```
src/
├── components/     # Reusable UI components
├── services/       # Business logic services
├── utils/          # Utility functions
├── styles/         # CSS modules
└── types/          # TypeScript definitions
```

### `docs/`
Additional documentation:
- API documentation
- User guides
- Development guides
- Architecture diagrams

### `tests/`
Test files and test utilities:
- Unit tests
- Integration tests
- End-to-end tests
- Test utilities and mocks

## 🏗️ Architecture Overview

### Extension Components

1. **Popup (`popup.html`, `popup.js`, `popup.css`)**
   - Main user interface
   - Glass morphism design
   - Tab-based navigation
   - Real-time interactions

2. **Background Script (`background.js`)**
   - Service worker (Manifest V3)
   - Data persistence with Chrome Storage API
   - Message handling between components
   - Extension lifecycle management

3. **Content Script (`content.js`)**
   - Injected into X.com pages
   - DOM manipulation and data extraction
   - User interaction detection
   - Scan execution logic

4. **Manifest (`manifest.json`)**
   - Extension configuration
   - Permissions declaration
   - Content script registration
   - Background script setup

### Data Flow

```
Popup ←→ Background Script ←→ Content Script
  ↓           ↓                    ↓
 UI         Storage              X.com
Actions      API                 Pages
```

## 🔧 Build System

### Scripts Overview

- **Development**: `npm run dev` - Development build with watching
- **Production**: `npm run build:prod` - Optimized production build
- **Testing**: `npm test` - Run all tests
- **Packaging**: `npm run package` - Create distribution package
- **Validation**: `npm run validate` - Check manifest and icons

### Build Process

1. **Validation** - Check manifest.json and icons
2. **Linting** - ESLint code quality checks
3. **Testing** - Run unit and integration tests
4. **Building** - Process and optimize files
5. **Packaging** - Create .zip for distribution

## 📦 Dependencies

### Production Dependencies
None - Extension runs standalone in browser

### Development Dependencies
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Rimraf**: Cross-platform file removal
- **Archiver**: ZIP file creation
- **JSONSchema**: Manifest validation

## 🔀 Branching Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Development integration branch

### Feature Branches
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates

### Release Process
1. Feature development in feature branches
2. Merge to `develop` for integration testing
3. Merge to `main` for release
4. Tag releases with semantic versioning

## 📝 File Naming Conventions

### JavaScript Files
- `kebab-case.js` for utility files
- `PascalCase.js` for classes/components
- `camelCase` for variables and functions

### CSS Files
- `kebab-case.css` for stylesheets
- BEM methodology for class names
- CSS custom properties for theming

### Documentation
- `UPPERCASE.md` for important docs (README, LICENSE)
- `PascalCase.md` for guides and documentation

## 🧪 Testing Strategy

### Unit Tests
- Individual function testing
- Component isolation testing
- Mock external dependencies

### Integration Tests
- Component interaction testing
- Chrome API integration
- Data flow validation

### End-to-End Tests
- Full user workflow testing
- Cross-browser compatibility
- Performance testing

## 🔒 Security Considerations

### File Organization
- Sensitive logic in background script
- Input validation in all components
- Secure coding practices throughout

### Permission Management
- Minimal required permissions
- Clear permission justification
- Regular permission audits

## 🚀 Deployment

### Development
1. Load unpacked extension in browser
2. Enable developer mode
3. Point to project root directory

### Production
1. Build optimized package
2. Test in clean browser environment
3. Submit to Chrome Web Store
4. Create GitHub release

## 📚 Documentation Standards

### Code Documentation
- JSDoc comments for functions
- Inline comments for complex logic
- README files in subdirectories

### User Documentation
- Clear installation instructions
- Feature usage guides
- Troubleshooting information

### Developer Documentation
- Architecture explanations
- API documentation
- Contributing guidelines

---

This structure supports the project's growth from a simple extension to a more complex, maintainable codebase while keeping the current flat structure for simplicity.
