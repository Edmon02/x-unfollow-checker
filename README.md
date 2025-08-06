# 🔍 X Unfollow Checker

<div align="center">

![X Unfollow Checker Logo](icons/icon128.png)

**A powerful Chrome extension to help you manage your X (Twitter) following
list**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)](https://developer.chrome.com/docs/extensions/mv3/)

_Identify users who don't follow you back with beautiful UI and powerful
features_

[🚀 Installation](#-installation) • [✨ Features](#-features) •
[📖 Usage](#-usage) • [🛠️ Development](#️-development) • [📄 License](#-license)

</div>

---

## ✨ Features

### 🔍 **Smart Scanning**

- **Automatic Detection**: Intelligently scrolls through your entire following
  list
- **Mutual vs Non-Mutual**: Identifies who follows you back and who doesn't
- **Real-time Progress**: Live updates during scanning process
- **Error Handling**: Robust handling of network issues and rate limits

### 📋 **Allowlist Management**

- **Smart Exclusions**: Add users you want to keep following regardless
- **Bulk Operations**: Import/export allowlists for easy management
- **Real-time Validation**: Input validation with visual feedback
- **Case Insensitive**: Works with @username or username formats

### 📊 **Data Management**

- **Export Results**: Download scan results as JSON files
- **Scan History**: Track your scanning activity over time
- **Import/Export**: Backup and restore your allowlists
- **Data Privacy**: All data stored locally on your device

### 🎨 **Modern Interface**

- **Glass Morphism Design**: Beautiful transparent interface with blur effects
- **Responsive Layout**: Works perfectly on all screen sizes
- **Custom Scrollbars**: Elegant gradient scrollbars throughout
- **Smooth Animations**: Delightful micro-interactions and transitions
- **Dark Theme**: Eye-friendly design optimized for extended use

### ⚙️ **Customizable Settings**

- **Scan Speed Control**: Adjust scroll delay (500ms - 5000ms)
- **Batch Size Options**: Configure processing batch sizes (10-100)
- **Notification Preferences**: Enable/disable completion notifications

---

## 🚀 Installation

### Method 1: Chrome Web Store (Recommended)

_Coming Soon - Extension will be available on the Chrome Web Store_

### Method 2: From Source (Development)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Edmon02/x-unfollow-checker.git
   cd x-unfollow-checker
   ```

2. **Install Dependencies** (Optional)

   ```bash
   npm install
   ```

3. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the project folder

4. **Load in Edge**
   - Open `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

5. **Load in Firefox**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

---

## 📖 Usage

### 🎯 Quick Start

1. **Navigate to X**: Go to [x.com](https://x.com) and sign in
2. **Visit Following Page**: Go to `x.com/yourusername/following`
3. **Open Extension**: Click the extension icon in your browser toolbar
4. **Start Scanning**: Click the "🔍 Start Scan" button

### 📱 Using the Interface

#### Scanner Tab

- **Start/Stop Scanning**: Control the scanning process
- **Real-time Progress**: Watch as the extension analyzes your following list
- **Results Display**: View non-mutual followers with profile links
- **Bulk Actions**: Select multiple users for batch operations

#### Allowlist Tab

- **Add Users**: Type usernames (with or without @) to exclude from scans
- **Manage List**: View, edit, and remove allowlisted users
- **Import/Export**: Backup your allowlist or share with other devices

#### History Tab

- **Scan History**: View previous scan results and statistics
- **Performance Metrics**: See scan duration and efficiency data
- **Data Management**: Clear old history to free up space

#### Settings Tab

- **Scroll Delay**: Adjust scanning speed (slower = more reliable)
- **Batch Size**: Control processing chunk sizes
- **Notifications**: Toggle completion alerts

### 🎨 Interface Features

#### Glass Morphism Design

The extension features a modern glass morphism interface with:

- **Transparent Backgrounds**: Beautiful backdrop blur effects
- **Gradient Borders**: Subtle colorful borders throughout
- **Custom Scrollbars**: Animated gradient scrollbars
- **Smooth Transitions**: Delightful hover and click animations

#### Smart Input Validation

- **Real-time Feedback**: Green/red borders for valid/invalid input
- **Format Detection**: Automatically handles @username or username
- **Duplicate Prevention**: Warns if user already in allowlist

---

## 🛠️ Development

### 📁 Project Structure

```
x-unfollow-checker/
├── 📄 manifest.json         # Extension configuration
├── 🎨 popup.html           # Main interface
├── 💻 popup.js             # UI logic and interactions
├── 🎨 popup.css            # Glass morphism styling
├── 🔧 background.js        # Service worker & data management
├── 📜 content.js           # X.com page interaction
├── 📁 icons/               # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── 📁 scripts/             # Build and utility scripts
│   ├── build.js
│   ├── generate-icons.js
│   └── test.js
├── 📄 package.json         # Dependencies and scripts
├── 📋 README.md           # This file
├── 📋 INSTALLATION.md     # Detailed installation guide
└── 🚫 .gitignore          # Git ignore rules
```

### 🧪 Testing

#### Automated Tests

```bash
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
```

#### Manual Testing

```bash
npm run test:manual        # Open test interface
```

#### Debug Mode

- Open browser console (F12) for detailed logs
- Background script console: `chrome://extensions/` → "Inspect views"
- Use test page: Open `test-extension.html` in browser

### 🔧 Building

```bash
npm run build              # Build for production
npm run build:dev          # Build for development
npm run icons              # Generate icon variants
```

### 🐛 Common Issues

#### "Could not establish connection"

- **Cause**: Background script not responding
- **Fix**: Reload extension in `chrome://extensions/`

#### "Extension context invalidated"

- **Cause**: Extension was reloaded during operation
- **Fix**: Refresh the X.com page and try again

#### Scan not working

- **Cause**: Not on correct page or content script failed
- **Fix**: Navigate to `x.com/username/following` and refresh

---

## 🔒 Privacy & Security

### 📊 Data Collection

- **No External Servers**: All data stored locally on your device
- **No Personal Data**: Only analyzes publicly visible following lists
- **No Tracking**: Extension doesn't track your usage or behavior
- **No Ads**: Completely ad-free experience

### 🛡️ Permissions

- **Active Tab**: To interact with X.com pages
- **Storage**: To save allowlists and settings locally
- **Host Permissions**: Limited to x.com and twitter.com only

### 🔐 Security

- **Manifest V3**: Uses latest Chrome extension security model
- **Content Security Policy**: Strict CSP prevents code injection
- **Local Storage Only**: No data transmitted to external servers

---

## 🤝 Contributing

We welcome contributions! Please see our
[Contributing Guidelines](CONTRIBUTING.md) for details.

### 🐞 Bug Reports

[Open an issue](https://github.com/Edmon02/x-unfollow-checker/issues) with:

- Browser version
- Extension version
- Steps to reproduce
- Console error messages

### 💡 Feature Requests

[Suggest new features](https://github.com/Edmon02/x-unfollow-checker/issues) or
improvements!

### 🔧 Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

---

## 🙏 Acknowledgments

- Chrome Extension team for excellent documentation
- X (Twitter) for providing accessible APIs
- Contributors and beta testers
- Open source community for inspiration

---

<div align="center">

**Made with ❤️ by [Edmon02](https://github.com/Edmon02)**

[⭐ Star this repo](https://github.com/Edmon02/x-unfollow-checker) •
[🐛 Report bug](https://github.com/Edmon02/x-unfollow-checker/issues) •
[💡 Request feature](https://github.com/Edmon02/x-unfollow-checker/issues)

</div>

**Disclaimer**: This extension is not affiliated with X Corp. Use responsibly
and in accordance with X's terms of service.
