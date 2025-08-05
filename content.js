// Content script for X Unfollow Checker
class XUnfollowChecker {
  constructor() {
    this.isScanning = false;
    this.processedUsers = new Set();
    this.nonMutualFollowers = [];
    this.totalFollowing = 0;
    this.allowlist = [];
    this.settings = {};
    this.startTime = null;
    this.observer = null;
    this.consecutiveNoNewUsers = 0;
    this.maxConsecutiveNoNewUsers = 5;
    
    this.init();
  }

  init() {
    console.log('X Unfollow Checker content script initializing...');
    console.log('Current URL:', window.location.href);
    console.log('Is following page:', this.isFollowingPage());
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Check if we're on the correct page
    if (!this.isFollowingPage()) {
      console.log('Not on following page, extension ready but inactive');
      return;
    }
    
    // Add extension indicator
    this.addExtensionIndicator();
    
    console.log('X Unfollow Checker initialized and ready on following page');
  }

  isFollowingPage() {
    const url = window.location.href;
    const pathname = window.location.pathname;
    
    // Check for following page patterns
    return (
      url.includes('/following') ||
      pathname.includes('/following') ||
      url.match(/\/[^\/]+\/following/) ||
      pathname.match(/\/[^\/]+\/following/)
    );
  }

  addExtensionIndicator() {
    // Add a subtle indicator that the extension is active
    const indicator = document.createElement('div');
    indicator.id = 'x-unfollow-checker-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #1d9bf0;
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      z-index: 9999;
      display: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    indicator.textContent = 'X Unfollow Checker Ready';
    document.body.appendChild(indicator);
  }

  handleMessage(message, sender, sendResponse) {
    console.log('Content script received message:', message);
    
    if (message.type === 'START_SCAN') {
      if (this.isScanning) {
        sendResponse({ success: false, error: 'Scan already in progress' });
        return;
      }
      
      if (!this.isFollowingPage()) {
        sendResponse({ success: false, error: 'Not on a following page. Please navigate to a user\'s following page (e.g., x.com/username/following).' });
        return;
      }
      
      // Handle async operation
      this.startScan()
        .then(() => {
          console.log('Scan started successfully');
          sendResponse({ success: true });
        })
        .catch((error) => {
          console.error('Scan error:', error);
          sendResponse({ success: false, error: error.message });
        });
      
      // Return true to indicate we will send a response asynchronously
      return true;
      
    } else if (message.type === 'STOP_SCAN') {
      this.stopScan();
      sendResponse({ success: true });
      
    } else if (message.type === 'GET_SCAN_STATUS') {
      sendResponse({
        success: true,
        isScanning: this.isScanning,
        processedCount: this.processedUsers.size,
        nonMutualCount: this.nonMutualFollowers.length,
        isOnFollowingPage: this.isFollowingPage(),
        currentUrl: window.location.href
      });
    }
  }

  async startScan() {
    console.log('Starting scan...');
    console.log('Current URL:', window.location.href);
    console.log('Is following page:', this.isFollowingPage());
    
    if (!this.isFollowingPage()) {
      throw new Error('Not on a following page. Please navigate to a user\'s following page.');
    }
    
    this.isScanning = true;
    this.startTime = Date.now();
    this.processedUsers.clear();
    this.nonMutualFollowers = [];
    this.consecutiveNoNewUsers = 0;
    
    // Show indicator
    const indicator = document.getElementById('x-unfollow-checker-indicator');
    if (indicator) {
      indicator.style.display = 'block';
      indicator.textContent = 'Scanning...';
    }
    
    try {
      // Load allowlist and settings
      console.log('Loading allowlist and settings...');
      const [allowlistResponse, settingsResponse] = await Promise.all([
        chrome.runtime.sendMessage({ type: 'GET_ALLOWLIST' }),
        chrome.runtime.sendMessage({ type: 'GET_SETTINGS' })
      ]);
      
      this.allowlist = allowlistResponse?.allowlist || [];
      this.settings = settingsResponse?.settings || { scrollDelay: 2000, batchSize: 50 };
      
      console.log('Loaded allowlist:', this.allowlist.length, 'users');
      console.log('Settings:', this.settings);
      
      // Check for JavaScript availability
      if (!this.checkJavaScriptAvailability()) {
        throw new Error('JavaScript is not available or blocked by privacy extensions');
      }
      
      // Check if we can find user elements
      await this.processCurrentUsers();
      if (this.processedUsers.size === 0) {
        // Try to scroll down a bit and check again
        console.log('No users found initially, trying to scroll and wait...');
        await this.scrollToLoadMore();
        await this.delay(3000);
        await this.processCurrentUsers();
        
        if (this.processedUsers.size === 0) {
          throw new Error('Could not find any user elements on this page. Make sure you\'re on a following page with loaded content.');
        }
      }
      
      // Send initial status
      this.sendStatusUpdate('Scan initialized, found initial users...');
      
      // Start the scanning process
      await this.scanFollowing();
      
    } catch (error) {
      console.error('Scan failed:', error);
      this.isScanning = false;
      if (indicator) {
        indicator.style.display = 'none';
      }
      this.sendStatusUpdate('Scan failed: ' + error.message, true);
      throw error;
    }
  }

  stopScan() {
    console.log('Stopping scan...');
    this.isScanning = false;
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    const indicator = document.getElementById('x-unfollow-checker-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
    
    this.sendStatusUpdate('Scan stopped by user', true);
  }

  checkJavaScriptAvailability() {
    // Check for common indicators that JavaScript is blocked
    const jsWarning = document.querySelector('[data-testid="JavaScriptIsNotAvailable"]');
    if (jsWarning) {
      console.log('JavaScript warning found');
      return false;
    }
    
    // Check if we can access basic DOM elements
    const timeline = document.querySelector('[data-testid="primaryColumn"]') || 
                     document.querySelector('[role="main"]') ||
                     document.querySelector('main') ||
                     document.querySelector('#react-root');
                     
    const hasBasicStructure = !!timeline;
    console.log('Basic structure check:', hasBasicStructure);
    
    // Check for React root or any sign that the page has loaded
    const reactRoot = document.querySelector('#react-root') || 
                      document.querySelector('[data-reactroot]') ||
                      document.body.children.length > 0;
                      
    console.log('React/page loaded check:', !!reactRoot);
    
    return hasBasicStructure && reactRoot;
  }

  async scanFollowing() {
    let previousUserCount = 0;
    let stableCount = 0;
    const maxStableIterations = 3;
    
    while (this.isScanning) {
      // Process currently loaded users
      await this.processCurrentUsers();
      
      const currentUserCount = this.processedUsers.size;
      
      // Send progress update
      this.sendStatusUpdate(
        `Processed ${currentUserCount} users, found ${this.nonMutualFollowers.length} non-mutual followers`
      );
      
      // Check if we've found new users
      if (currentUserCount === previousUserCount) {
        stableCount++;
        if (stableCount >= maxStableIterations) {
          console.log('No new users found after multiple attempts, finishing scan');
          break;
        }
      } else {
        stableCount = 0;
        previousUserCount = currentUserCount;
      }
      
      // Scroll to load more users
      await this.scrollToLoadMore();
      
      // Wait before next iteration
      await this.delay(this.settings.scrollDelay || 2000);
    }
    
    if (this.isScanning) {
      await this.finishScan();
    }
  }

  async processCurrentUsers() {
    // Find all user cells - using multiple selectors for robustness
    const userSelectors = [
      '[data-testid="UserCell"]',
      '[data-testid="user-cell"]',
      '[data-testid="cellInnerDiv"]',
      '.r-1habvwh', // Fallback class selector
      'article[role="article"]', // Another fallback
      '[role="button"]:has([dir="ltr"])', // Button containing user info
      'div[data-testid]:has(a[href*="/"])', // Div with testid containing profile links
    ];
    
    let userCells = [];
    for (const selector of userSelectors) {
      try {
        userCells = document.querySelectorAll(selector);
        if (userCells.length > 0) {
          console.log(`Found ${userCells.length} user cells using selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Error with selector ${selector}:`, error);
      }
    }
    
    // If no cells found, try to find any elements with profile links
    if (userCells.length === 0) {
      userCells = document.querySelectorAll('a[href*="/"]');
      userCells = Array.from(userCells).filter(a => {
        const href = a.getAttribute('href');
        return href && href.match(/^\/[^\/]+$/) && !href.includes('/status/') && !href.includes('/photo/');
      }).map(a => a.closest('div')).filter(div => div);
      console.log(`Found ${userCells.length} user cells using profile link fallback`);
    }
    
    console.log(`Processing ${userCells.length} user cells`);
    
    for (const userCell of userCells) {
      if (!this.isScanning) break;
      
      try {
        const userInfo = this.extractUserInfo(userCell);
        if (userInfo && !this.processedUsers.has(userInfo.username)) {
          this.processedUsers.add(userInfo.username);
          console.log(`Processed user: ${userInfo.username}, follows back: ${userInfo.followsBack}`);
          
          // Check if user follows back and is not in allowlist
          if (!userInfo.followsBack && !this.allowlist.includes(userInfo.username)) {
            this.nonMutualFollowers.push(userInfo);
          }
        }
      } catch (error) {
        console.error('Error processing user cell:', error);
      }
    }
  }

  extractUserInfo(userCell) {
    try {
      // Try multiple methods to extract username
      let usernameElement = null;
      let username = '';
      
      // Method 1: Look for profile links
      const profileLinks = userCell.querySelectorAll('a[href*="/"]');
      for (const link of profileLinks) {
        const href = link.getAttribute('href');
        if (href && href.match(/^\/[^\/]+$/) && !href.includes('/status/') && !href.includes('/photo/')) {
          usernameElement = link;
          username = href.substring(1); // Remove leading slash
          break;
        }
      }
      
      // Method 2: Look for text with @
      if (!username) {
        const atElements = userCell.querySelectorAll('*');
        for (const element of atElements) {
          const text = element.textContent || '';
          const match = text.match(/@([a-zA-Z0-9_]+)/);
          if (match) {
            username = match[1];
            usernameElement = element;
            break;
          }
        }
      }
      
      // Method 3: Look for elements with dir="ltr" that might contain usernames
      if (!username) {
        const ltrElements = userCell.querySelectorAll('[dir="ltr"]');
        for (const element of ltrElements) {
          const text = element.textContent.trim();
          // Skip if it looks like a display name (has spaces or special chars)
          if (text && text.match(/^[a-zA-Z0-9_]+$/) && text.length > 2) {
            username = text;
            usernameElement = element;
            break;
          }
        }
      }
      
      if (!username || username.length === 0) {
        return null;
      }
      
      // Clean up username
      username = username.replace(/[@\s]/g, '').trim();
      
      if (!username || username.length === 0) {
        return null;
      }
      
      // Check for "Follows you" or "Follows back" text with multiple language support
      const cellText = userCell.textContent.toLowerCase();
      const followsBack = 
        cellText.includes('follows you') || 
        cellText.includes('follows back') ||
        cellText.includes('te sigue') || // Spanish
        cellText.includes('vous suit') || // French
        cellText.includes('folgt dir') || // German
        cellText.includes('ti segue') || // Italian
        cellText.includes('フォローされています') || // Japanese
        userCell.querySelector('[data-testid="userFollowIndicator"]') !== null ||
        userCell.querySelector('.follows-you-indicator') !== null;
      
      // Extract display name - try multiple approaches
      let displayName = username;
      
      // Look for elements that might contain display name
      const nameElements = [
        ...userCell.querySelectorAll('[dir="ltr"]'),
        ...userCell.querySelectorAll('span[style*="font-weight"]'),
        ...userCell.querySelectorAll('div[style*="font-weight"]'),
        ...userCell.querySelectorAll('a span'),
      ];
      
      for (const element of nameElements) {
        const text = element.textContent.trim();
        if (text && text !== username && !text.includes('@') && text.length > 0) {
          displayName = text;
          break;
        }
      }
      
      const userInfo = {
        username: username,
        displayName: displayName,
        followsBack: followsBack,
        profileUrl: `https://x.com/${username}`
      };
      
      console.log('Extracted user info:', userInfo);
      return userInfo;
      
    } catch (error) {
      console.error('Error extracting user info:', error);
      return null;
    }
  }

  async scrollToLoadMore() {
    const currentHeight = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
    
    // Wait for potential new content to load
    await this.delay(1000);
    
    // Check if new content was loaded
    const newHeight = document.body.scrollHeight;
    if (newHeight === currentHeight) {
      this.consecutiveNoNewUsers++;
    } else {
      this.consecutiveNoNewUsers = 0;
    }
    
    // If we've reached the bottom and no new content is loading
    if (this.consecutiveNoNewUsers >= this.maxConsecutiveNoNewUsers) {
      console.log('Reached bottom of following list');
      return false;
    }
    
    return true;
  }

  async finishScan() {
    this.isScanning = false;
    const duration = Date.now() - this.startTime;
    
    const results = {
      totalFollowing: this.processedUsers.size,
      nonMutualFollowers: this.nonMutualFollowers,
      duration: duration,
      completedAt: new Date().toISOString()
    };
    
    // Save results to storage
    await chrome.runtime.sendMessage({
      type: 'SAVE_SCAN_RESULTS',
      results: results
    });
    
    // Hide indicator
    const indicator = document.getElementById('x-unfollow-checker-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
    
    // Send completion message
    this.sendStatusUpdate(
      `Scan completed! Found ${this.nonMutualFollowers.length} non-mutual followers out of ${this.processedUsers.size} total following.`,
      true
    );
    
    console.log('Scan completed:', results);
  }

  sendStatusUpdate(message, isComplete = false) {
    try {
      chrome.runtime.sendMessage({
        type: 'SCAN_STATUS_UPDATE',
        status: {
          message: message,
          isScanning: this.isScanning,
          processedCount: this.processedUsers.size,
          nonMutualCount: this.nonMutualFollowers.length,
          isComplete: isComplete,
          results: isComplete ? {
            totalFollowing: this.processedUsers.size,
            nonMutualFollowers: this.nonMutualFollowers,
            duration: this.startTime ? Date.now() - this.startTime : 0
          } : null
        }
      }).catch(error => {
        console.error('Failed to send status update:', error);
      });
    } catch (error) {
      console.error('Error sending status update:', error);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the extension when the content script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new XUnfollowChecker();
  });
} else {
  new XUnfollowChecker();
}
