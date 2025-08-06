# Installation Guide - X Unfollow Checker

This guide will walk you through installing the X Unfollow Checker extension on
different browsers.

## 📋 Prerequisites

- A modern web browser (Chrome 88+, Firefox 109+, or Edge 88+)
- Access to X (Twitter) account
- Basic computer skills

## 🔽 Download Extension Files

First, you need to get the extension files:

### Option 1: Download from GitHub

1. Go to the GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder on your computer

### Option 2: Clone with Git

```bash
git clone https://github.com/Edmon02/x-unfollow-checker
cd x-unfollow-checker
```

## 🎨 Create Extension Icons

The extension needs icon files. Create or download 16x16, 32x32, 48x48, and
128x128 pixel PNG icons:

1. Create an `icons` folder in the extension directory
2. Add these files:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

**Icon Design Tips:**

- Use a simple, recognizable design
- Include the X logo or unfollow concept
- Ensure good contrast for visibility
- Keep it simple for small sizes

## 🌐 Browser Installation

### Google Chrome / Microsoft Edge

1. **Open Extensions Page**
   - Chrome: Go to `chrome://extensions/`
   - Edge: Go to `edge://extensions/`

2. **Enable Developer Mode**
   - Find the "Developer mode" toggle in the top right
   - Turn it ON

3. **Load Extension**
   - Click "Load unpacked" button
   - Navigate to your extension folder
   - Select the folder containing `manifest.json`
   - Click "Select Folder"

4. **Verify Installation**
   - Extension should appear in the list
   - Look for the extension icon in the toolbar
   - If not visible, click the puzzle piece icon and pin it

### Mozilla Firefox

1. **Open Debug Page**
   - Go to `about:debugging#/runtime/this-firefox`

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..."
   - Navigate to your extension folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Verify Installation**
   - Extension appears in the temporary extensions list
   - Icon should be visible in the toolbar

**Note**: In Firefox, temporary extensions are removed when you restart the
browser. For permanent installation, you'll need to sign and distribute the
extension.

### Safari (macOS)

Safari requires additional steps for extension development:

1. **Enable Developer Menu**
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"

2. **Convert to Safari Extension**
   - You'll need to convert the WebExtension to Safari format
   - Use Xcode or online conversion tools
   - This is more complex and may require developer account

## ✅ Verification Steps

After installation, verify the extension works:

1. **Check Icon**
   - Extension icon visible in browser toolbar
   - Clicking opens the popup interface

2. **Test on X**
   - Go to [x.com](https://x.com) and log in
   - Navigate to your following page
   - Click the extension icon
   - Should show "Ready to scan" status

3. **Check Permissions**
   - Extension should request minimal permissions
   - Only needs access to x.com and local storage

## 🔧 Troubleshooting

### Extension Won't Load

**Problem**: "Failed to load extension" error

**Solutions**:

- Check that all files are present (manifest.json, background.js, etc.)
- Verify manifest.json syntax is correct
- Ensure icon files exist in the icons folder
- Try refreshing the extensions page

### Extension Loads But Doesn't Work

**Problem**: Extension appears but popup is blank or features don't work

**Solutions**:

- Check browser console for JavaScript errors
- Verify you're on the correct X page (/following)
- Disable other extensions temporarily
- Clear browser cache and reload

### Icons Not Displaying

**Problem**: Extension works but shows default icon

**Solutions**:

- Verify icon files are in the correct icons/ folder
- Check file names match manifest.json exactly
- Ensure icons are PNG format
- Try refreshing the extension

### Permission Errors

**Problem**: Extension can't access X pages

**Solutions**:

- Verify host_permissions in manifest.json
- Try reloading the extension
- Check if other extensions are blocking access
- Ensure you're logged into X

## 🔄 Updating the Extension

To update the extension with new features:

1. **Download New Version**
   - Get the latest files from GitHub
   - Replace old files with new ones

2. **Reload Extension**
   - Go to extensions page
   - Find X Unfollow Checker
   - Click the refresh/reload button
   - Or disable and re-enable the extension

3. **Clear Data (if needed)**
   - If major changes, you may need to clear stored data
   - Go to extension details → Storage → Clear

## 📱 Mobile Installation

Browser extensions typically don't work on mobile browsers. For mobile users:

- **Firefox Mobile**: Supports some extensions, but installation is complex
- **Chrome Mobile**: No extension support
- **Safari Mobile**: No extension support

Consider using the desktop version for full functionality.

## 🛡️ Security Considerations

### Before Installing

- **Source Verification**: Only install from trusted sources
- **Code Review**: If technically inclined, review the code
- **Permissions**: Check what permissions the extension requests
- **Reputation**: Look for reviews and ratings

### After Installing

- **Monitor Behavior**: Watch for unusual browser behavior
- **Data Privacy**: Extension only stores data locally
- **Regular Updates**: Keep extension updated for security fixes
- **Backup Settings**: Export your allowlist and settings regularly

## 🔍 Advanced Installation Options

### For Developers

**Development Mode Features**:

- Real-time code editing
- Console debugging
- Performance monitoring
- Extension reloading

**Build Process**:

```bash
# If using build tools
npm install
npm run build
npm run test
```

### Enterprise Deployment

**Group Policy (Chrome)**:

- Add extension to enterprise policies
- Deploy via Google Admin Console
- Control permissions centrally

**Firefox Enterprise**:

- Use Firefox ESR
- Deploy via Active Directory
- Configure via policies.json

## 📞 Getting Help

If you encounter issues during installation:

1. **Check Documentation**
   - README.md for general information
   - GitHub Issues for known problems

2. **Browser Help**
   - Chrome: [Extension Help](https://support.google.com/chrome/answer/9658361)
   - Firefox:
     [Add-on Help](https://support.mozilla.org/kb/find-and-install-add-ons-add-features-to-firefox)
   - Edge:
     [Extension Help](https://support.microsoft.com/en-us/microsoft-edge/add-turn-off-or-remove-extensions-in-microsoft-edge-9c0ec68c-2fbc-2f2c-9ff0-bdc76f46b026)

3. **Community Support**
   - GitHub Discussions
   - Stack Overflow (tag: browser-extension)
   - Reddit communities

## ✨ Post-Installation Tips

### First-Time Setup

1. **Configure Settings**
   - Adjust scroll delay if needed
   - Set preferred batch size
   - Enable/disable notifications

2. **Create Allowlist**
   - Add important accounts you want to keep
   - Import existing allowlist if available

3. **Test Scan**
   - Start with a small test scan
   - Verify results accuracy
   - Check performance

### Best Practices

- **Regular Scanning**: Scan monthly or quarterly
- **Backup Data**: Export allowlist and settings
- **Stay Updated**: Update extension when new versions available
- **Monitor Performance**: Watch for browser slowdowns

---

**Next Steps**: Once installed, check out the [Usage Guide](USAGE.md) to learn
how to use all the extension's features effectively.
