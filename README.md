# X Unfollow Checker Browser Extension

A powerful and user-friendly browser extension that helps you manage your X (Twitter) following list by identifying users who don't follow you back.

## 🌟 Features

- **Automatic Scanning**: Intelligently scrolls through your entire following list
- **Smart Detection**: Identifies mutual vs non-mutual followers
- **Allowlist Management**: Exclude specific users from being flagged
- **Export Functionality**: Export results and allowlists as JSON files
- **Scan History**: Keep track of your previous scans
- **Customizable Settings**: Adjust scan speed and batch sizes
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Cross-Browser Support**: Works on Chrome, Firefox, and Edge

## 🚀 Installation

### From Source (Development)

1. **Download the Extension**
   ```bash
   git clone https://github.com/Edmon02/x-unfollow-checker
   cd x-unfollow-checker
   ```

2. **Load in Chrome/Edge**
   - Open `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

3. **Load in Firefox**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

### From Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store and Firefox Add-ons store.

## 📋 Usage

### Getting Started

1. **Navigate to X**: Go to [x.com](https://x.com) and log in
2. **Go to Following Page**: Navigate to your following page (`x.com/yourusername/following`)
3. **Open Extension**: Click the extension icon in your browser toolbar
4. **Start Scanning**: Click "Start Scan" to begin analysis

### Using the Scanner

The scanner automatically:
- Scrolls through your entire following list
- Checks each user for the "Follows back" indicator
- Excludes users in your allowlist
- Provides real-time progress updates

### Managing Your Allowlist

The allowlist lets you exclude specific users from being flagged:

1. **Add Users**: Enter username (without @) and click "Add"
2. **Quick Add**: Use "Add to Allowlist" button in scan results
3. **Import/Export**: Backup and restore your allowlist
4. **Bulk Management**: Clear entire allowlist when needed

### Viewing Results

Scan results show:
- **Username**: Clickable link to user profile
- **Display Name**: User's display name
- **Actions**: Add to allowlist or select for bulk operations

### Scan History

Keep track of your scanning activity:
- **Date & Time**: When each scan was performed
- **Statistics**: Total following vs non-mutual followers
- **Duration**: How long each scan took

### Settings

Customize the extension behavior:
- **Scroll Delay**: Time between page scrolls (1-5 seconds)
- **Batch Size**: Users processed per batch (25-100)
- **Notifications**: Enable/disable completion notifications

## 🛠️ Technical Details

### Architecture

- **Content Script**: Handles page scanning and DOM interaction
- **Background Script**: Manages data storage and message passing
- **Popup Interface**: User interface for all extension features
- **Storage**: Uses browser's local storage for data persistence

### Browser Compatibility

- **Chrome**: Version 88+
- **Firefox**: Version 109+
- **Edge**: Version 88+

### Permissions

The extension requires minimal permissions:
- `activeTab`: Access to current X tab for scanning
- `storage`: Save allowlist and settings locally
- `https://x.com/*`: Access to X website only

### Privacy & Security

- **No External Servers**: All data stays on your device
- **No API Calls**: Uses only public page data
- **No Data Collection**: Extension doesn't track or collect user data
- **Local Storage**: All settings and lists stored locally

## 🔧 Development

### File Structure

```
x-unfollow-checker/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js             # Content script
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Building from Source

1. **Clone Repository**
   ```bash
   git clone https://github.com/Edmon02/x-unfollow-checker
   cd x-unfollow-checker
   ```

2. **Create Icons** (if not provided)
   - Create 16x16, 32x32, 48x48, and 128x128 PNG icons
   - Place in `icons/` directory

3. **Test Extension**
   - Load as developer extension in browser
   - Test on X following page
   - Verify all features work correctly

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚨 Important Notes

### X Terms of Service

This extension:
- Only accesses publicly visible data
- Doesn't automate any actions (like unfollowing)
- Respects rate limits and page structure
- Complies with X's terms of service

### Limitations

- **JavaScript Required**: Extension won't work if JavaScript is disabled
- **Privacy Extensions**: Some privacy extensions may interfere with functionality
- **Page Changes**: X layout changes may require extension updates
- **Rate Limits**: Very large following lists may take significant time to scan

### Troubleshooting

**Extension Not Working?**
- Ensure you're on the correct page (`x.com/username/following`)
- Check that JavaScript is enabled
- Temporarily disable privacy extensions
- Refresh the page and try again

**Scan Taking Too Long?**
- Increase scroll delay in settings
- Check your internet connection
- Large following lists (1000+) naturally take longer

**Missing Users in Results?**
- Some users may be in your allowlist
- Private accounts may not show "Follows back" indicator
- Recently followed users may not have updated status

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/Edmon02/x-unfollow-checker/issues)
- **Questions**: Check [Discussions](https://github.com/Edmon02/x-unfollow-checker/discussions)
- **X Help**: For X-specific issues, visit [X Help Center](https://help.x.com)

## 🙏 Acknowledgments

- Icons provided by [Your Icon Source]
- UI inspiration from modern extension designs
- Thanks to the open-source community for browser extension resources

---

**Disclaimer**: This extension is not affiliated with X Corp. Use responsibly and in accordance with X's terms of service.
