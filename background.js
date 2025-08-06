// Background script for X Unfollow Checker
class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    // Listen for extension installation
    chrome.runtime.onInstalled.addListener(this.handleInstalled.bind(this));

    // Note: Message listener is set up globally at the bottom of the file

    // Initialize default storage
    this.initializeStorage();
  }

  async handleInstalled(details) {
    if (details.reason === 'install') {
      console.log('X Unfollow Checker installed');
      // Set default values
      await chrome.storage.local.set({
        allowlist: [],
        scanHistory: [],
        settings: {
          scrollDelay: 2000,
          batchSize: 50,
          enableNotifications: true
        }
      });
    }
  }

  async handleMessage(message, sender, sendResponse) {
    console.log('🔧 DEBUG: Background received message:', message);
    console.log('🔧 DEBUG: Message sender:', sender);

    try {
      let result;
      switch (message.type) {
      case 'PING':
        console.log('🔧 DEBUG: Handling PING');
        result = { success: true, message: 'PONG' };
        break;

      case 'GET_ALLOWLIST':
        console.log('🔧 DEBUG: Handling GET_ALLOWLIST');
        result = await this.getAllowlist();
        break;

      case 'ADD_TO_ALLOWLIST':
        console.log('🔧 DEBUG: Handling ADD_TO_ALLOWLIST for:', message.username);
        result = await this.addToAllowlist(message.username);
        break;

      case 'REMOVE_FROM_ALLOWLIST':
        console.log('🔧 DEBUG: Handling REMOVE_FROM_ALLOWLIST for:', message.username);
        result = await this.removeFromAllowlist(message.username);
        break;

      case 'GET_SETTINGS':
        console.log('🔧 DEBUG: Handling GET_SETTINGS');
        result = await this.getSettings();
        break;

      case 'UPDATE_SETTINGS':
        console.log('🔧 DEBUG: Handling UPDATE_SETTINGS:', message.settings);
        result = await this.updateSettings(message.settings);
        break;

      case 'SAVE_SCAN_RESULTS':
        console.log('🔧 DEBUG: Handling SAVE_SCAN_RESULTS');
        result = await this.saveScanResults(message.results);
        break;

      case 'GET_SCAN_HISTORY':
        console.log('🔧 DEBUG: Handling GET_SCAN_HISTORY');
        result = await this.getScanHistory();
        break;

      case 'CLEAR_SCAN_HISTORY':
        console.log('🔧 DEBUG: Handling CLEAR_SCAN_HISTORY');
        result = await this.clearScanHistory();
        break;

      case 'EXPORT_DATA':
        console.log('🔧 DEBUG: Handling EXPORT_DATA');
        result = await this.exportData();
        break;

      case 'IMPORT_DATA':
        console.log('🔧 DEBUG: Handling IMPORT_DATA');
        result = await this.importData(message.data);
        break;

      default:
        console.warn('🔧 DEBUG: Unknown message type:', message.type);
        result = { success: false, error: 'Unknown message type' };
      }

      console.log('🔧 DEBUG: Sending response:', result);
      sendResponse(result);
      return true; // Keep message channel open for async response
    } catch (error) {
      console.error('🔧 DEBUG: Background script error:', error);
      const errorResponse = { success: false, error: error.message };
      console.log('🔧 DEBUG: Sending error response:', errorResponse);
      sendResponse(errorResponse);
      return true;
    }
  }

  async initializeStorage() {
    const data = await chrome.storage.local.get(['allowlist', 'scanHistory', 'settings']);

    if (!data.allowlist) {
      await chrome.storage.local.set({ allowlist: [] });
    }

    if (!data.scanHistory) {
      await chrome.storage.local.set({ scanHistory: [] });
    }

    if (!data.settings) {
      await chrome.storage.local.set({
        settings: {
          scrollDelay: 2000,
          batchSize: 50,
          enableNotifications: true
        }
      });
    }
  }

  async getAllowlist() {
    const data = await chrome.storage.local.get(['allowlist']);
    return { success: true, allowlist: data.allowlist || [] };
  }

  async addToAllowlist(username) {
    console.log('🔧 DEBUG: addToAllowlist called with:', username);

    if (!username || typeof username !== 'string') {
      console.error('🔧 DEBUG: Invalid username provided:', username);
      return { success: false, error: 'Username is required and must be a string' };
    }

    // Clean and validate username
    const cleanUsername = username.trim().toLowerCase();
    console.log('🔧 DEBUG: Cleaned username:', cleanUsername);

    if (!cleanUsername) {
      console.log('🔧 DEBUG: Username is empty after cleaning');
      return { success: false, error: 'Username cannot be empty' };
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(cleanUsername)) {
      console.log('🔧 DEBUG: Username format invalid:', cleanUsername);
      return {
        success: false,
        error:
          'Invalid username format. Use only letters, numbers, and underscores (max 15 characters)'
      };
    }

    try {
      console.log('🔧 DEBUG: Getting current allowlist from storage...');
      const data = await chrome.storage.local.get(['allowlist']);
      const allowlist = data.allowlist || [];

      console.log('🔧 DEBUG: Current allowlist:', allowlist);

      // Check if already exists (case insensitive)
      const existingUser = allowlist.find(user => user.toLowerCase() === cleanUsername);
      if (existingUser) {
        console.log('🔧 DEBUG:', cleanUsername, 'already in allowlist');
        return {
          success: false,
          error: `@${cleanUsername} is already in your allowlist`,
          allowlist: allowlist
        };
      }

      // Add to allowlist
      allowlist.push(cleanUsername);
      console.log('🔧 DEBUG: Saving updated allowlist to storage:', allowlist);
      await chrome.storage.local.set({ allowlist });

      console.log(
        '🔧 DEBUG: Successfully added',
        cleanUsername,
        'to allowlist. New list:',
        allowlist
      );

      return {
        success: true,
        allowlist,
        message: `Successfully added @${cleanUsername} to allowlist`
      };
    } catch (error) {
      console.error('🔧 DEBUG: Error adding to allowlist:', error);
      return {
        success: false,
        error: `Failed to save to storage: ${error.message}`
      };
    }
  }

  async removeFromAllowlist(username) {
    console.log('Removing from allowlist:', username);

    if (!username || typeof username !== 'string') {
      return { success: false, error: 'Username is required and must be a string' };
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      return { success: false, error: 'Username cannot be empty' };
    }

    try {
      const data = await chrome.storage.local.get(['allowlist']);
      const allowlist = data.allowlist || [];

      console.log('Current allowlist before removal:', allowlist);

      // Find and remove user (case insensitive)
      const filteredList = allowlist.filter(user => user.toLowerCase() !== cleanUsername);

      if (filteredList.length === allowlist.length) {
        return {
          success: false,
          error: `@${cleanUsername} was not found in allowlist`
        };
      }

      await chrome.storage.local.set({ allowlist: filteredList });
      console.log(`Removed ${cleanUsername} from allowlist. New list:`, filteredList);

      return {
        success: true,
        allowlist: filteredList,
        message: `Successfully removed @${cleanUsername} from allowlist`
      };
    } catch (error) {
      console.error('Error removing from allowlist:', error);
      return {
        success: false,
        error: `Failed to save to storage: ${error.message}`
      };
    }
  }

  async getSettings() {
    const data = await chrome.storage.local.get(['settings']);
    return { success: true, settings: data.settings };
  }

  async updateSettings(newSettings) {
    const data = await chrome.storage.local.get(['settings']);
    const settings = { ...data.settings, ...newSettings };
    await chrome.storage.local.set({ settings });
    return { success: true, settings };
  }

  async saveScanResults(results) {
    const data = await chrome.storage.local.get(['scanHistory']);
    const history = data.scanHistory || [];

    const scanEntry = {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      totalFollowing: results.totalFollowing,
      nonMutualCount: results.nonMutualFollowers.length,
      nonMutualFollowers: results.nonMutualFollowers,
      duration: results.duration
    };

    // Keep only last 10 scans
    history.unshift(scanEntry);
    if (history.length > 10) {
      history.splice(10);
    }

    await chrome.storage.local.set({ scanHistory: history });
    return { success: true, scanHistory: history };
  }

  async getScanHistory() {
    const data = await chrome.storage.local.get(['scanHistory']);
    return { success: true, scanHistory: data.scanHistory || [] };
  }

  async clearScanHistory() {
    await chrome.storage.local.set({ scanHistory: [] });
    return { success: true };
  }

  async exportData() {
    const data = await chrome.storage.local.get(['allowlist', 'scanHistory', 'settings']);

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        allowlist: data.allowlist || [],
        scanHistory: data.scanHistory || [],
        settings: data.settings || {}
      }
    };

    return { success: true, exportData };
  }

  async importData(importData) {
    try {
      if (!importData.version || !importData.data) {
        return { success: false, error: 'Invalid import data format' };
      }

      const { allowlist, scanHistory, settings } = importData.data;

      if (allowlist) {
        await chrome.storage.local.set({ allowlist });
      }

      if (scanHistory) {
        await chrome.storage.local.set({ scanHistory });
      }

      if (settings) {
        await chrome.storage.local.set({ settings });
      }

      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to import data: ' + error.message };
    }
  }
}

// Initialize the background service
const backgroundService = new BackgroundService();

// Set up message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('🔧 DEBUG: Message received in global listener:', message);
  console.log('🔧 DEBUG: Sender:', sender);

  try {
    // Call the handleMessage method on the service instance
    const result = backgroundService.handleMessage(message, sender, sendResponse);
    console.log('🔧 DEBUG: handleMessage returned:', result);

    // Return true to indicate we'll send a response asynchronously
    return true;
  } catch (error) {
    console.error('🔧 DEBUG: Error in global message listener:', error);
    sendResponse({ success: false, error: error.message });
    return true;
  }
});
