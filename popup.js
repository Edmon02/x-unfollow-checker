// Popup script for X Unfollow Checker
class PopupManager {
  constructor() {
    this.currentTab = 'scanner';
    this.scanResults = [];
    this.allowlist = [];
    this.scanHistory = [];
    this.settings = {};
    this.isScanning = false;
    this.selectedUsers = new Set();

    this.init();
  }

  async init() {
    // Initialize event listeners
    this.initializeEventListeners();

    // Load initial data
    await this.loadInitialData();

    // Check if we're on the correct page
    await this.checkCurrentPage();

    // Set up message listener for scan updates
    this.setupMessageListener();

    console.log('Popup initialized');
  }

  initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Scanner controls
    document.getElementById('start-scan-btn').addEventListener('click', () => {
      this.startScan();
    });

    document.getElementById('stop-scan-btn').addEventListener('click', () => {
      this.stopScan();
    });

    // Results actions
    document.getElementById('export-results-btn').addEventListener('click', () => {
      this.exportResults();
    });

    document.getElementById('select-all-btn').addEventListener('click', () => {
      this.toggleSelectAll();
    });

    document.getElementById('search-results').addEventListener('input', e => {
      this.filterResults(e.target.value);
    });

    // Allowlist controls
    document.getElementById('add-user-btn').addEventListener('click', () => {
      this.addToAllowlist();
    });

    const addUserInput = document.getElementById('add-user-input');

    addUserInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        this.addToAllowlist();
      }
    });

    // Real-time validation feedback
    addUserInput.addEventListener('input', e => {
      this.validateUsernameInput(e.target);
    });

    addUserInput.addEventListener('paste', e => {
      // Allow paste but validate after a short delay
      setTimeout(() => this.validateUsernameInput(e.target), 10);
    });

    document.getElementById('import-allowlist-btn').addEventListener('click', () => {
      this.importAllowlist();
    });

    document.getElementById('export-allowlist-btn').addEventListener('click', () => {
      this.exportAllowlist();
    });

    document.getElementById('clear-allowlist-btn').addEventListener('click', () => {
      this.clearAllowlist();
    });

    // History controls
    document.getElementById('clear-history-btn').addEventListener('click', () => {
      this.clearHistory();
    });

    // Settings controls
    document.getElementById('scroll-delay').addEventListener('input', e => {
      document.getElementById('scroll-delay-value').textContent = e.target.value + 'ms';
    });

    document.getElementById('batch-size').addEventListener('input', e => {
      document.getElementById('batch-size-value').textContent = e.target.value;
    });

    document.getElementById('save-settings-btn').addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('reset-settings-btn').addEventListener('click', () => {
      this.resetSettings();
    });

    // File input for imports
    document.getElementById('file-input').addEventListener('change', e => {
      this.handleFileImport(e.target.files[0]);
    });

    // About link
    document.getElementById('about-link').addEventListener('click', e => {
      e.preventDefault();
      this.showAbout();
    });
  }

  async loadInitialData() {
    try {
      // First test if background script is responding
      console.log('🔧 DEBUG: Testing background script connection...');
      const testResponse = await chrome.runtime.sendMessage({ type: 'GET_ALLOWLIST' });
      console.log('🔧 DEBUG: Background script test response:', testResponse);

      if (!testResponse) {
        throw new Error('Background script is not responding. Extension may need to be reloaded.');
      }

      // Load allowlist
      const allowlistResponse = await chrome.runtime.sendMessage({ type: 'GET_ALLOWLIST' });
      if (allowlistResponse.success) {
        this.allowlist = allowlistResponse.allowlist;
        this.updateAllowlistDisplay();
      }

      // Load settings
      const settingsResponse = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
      if (settingsResponse.success) {
        this.settings = settingsResponse.settings;
        this.updateSettingsDisplay();
      }

      // Load scan history
      const historyResponse = await chrome.runtime.sendMessage({ type: 'GET_SCAN_HISTORY' });
      if (historyResponse.success) {
        this.scanHistory = historyResponse.scanHistory;
        this.updateHistoryDisplay();
      }
    } catch (error) {
      console.error('🔧 DEBUG: Error loading initial data:', error);
      this.showError('Failed to connect to extension background. Please reload the extension.');
    }
  }

  async checkCurrentPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url) {
        this.showPageWarning("Cannot detect current page. Please make sure you're on X.");
        return;
      }

      const url = tab.url.toLowerCase();

      if (!url.includes('x.com') && !url.includes('twitter.com')) {
        this.showPageWarning('Please navigate to X (Twitter) to use this extension.');
        return;
      }

      if (!url.includes('/following')) {
        this.showPageWarning('Please navigate to your Following page on X to start scanning.');
        return;
      }

      // Check if it's actually a user's following page (not just any page with "following" in URL)
      if (!url.match(/\/([\w\d_]+)\/following/)) {
        this.showPageWarning(
          "Please navigate to a user's Following page (e.g., x.com/username/following)."
        );
        return;
      }

      // Hide warning if on correct page
      document.getElementById('page-warning').classList.add('hidden');

      // Enable scan button
      const startBtn = document.getElementById('start-scan-btn');
      if (startBtn) {
        startBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error checking current page:', error);
      this.showPageWarning("Unable to detect current page. Please make sure you're on X.");
    }
  }

  showPageWarning(message) {
    const warningElement = document.getElementById('page-warning');
    warningElement.querySelector('.warning-text').textContent = message;
    warningElement.classList.remove('hidden');

    // Disable scan button
    document.getElementById('start-scan-btn').disabled = true;
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'SCAN_STATUS_UPDATE') {
        this.handleScanStatusUpdate(message.status);
      }
    });
  }

  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    this.currentTab = tabName;

    // Refresh data for specific tabs
    if (tabName === 'allowlist') {
      this.updateAllowlistDisplay();
    } else if (tabName === 'history') {
      this.updateHistoryDisplay();
    } else if (tabName === 'settings') {
      this.updateSettingsDisplay();
    }
  }

  async startScan() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Update UI to show we're attempting to start
      this.updateStatusCard('🔄', 'Connecting...', 'Establishing connection with the page...');

      // Check if content script is loaded
      let response;
      try {
        response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SCAN_STATUS' });
        console.log('Content script status response:', response);
      } catch (error) {
        // Content script not loaded, try to inject it
        console.log('Content script not found, injecting...', error);
        this.updateStatusCard('🔄', 'Initializing...', 'Loading extension components...');

        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });

          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Try to connect again
          response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SCAN_STATUS' });
          console.log('Content script status after injection:', response);
        } catch (injectionError) {
          console.error('Failed to inject content script:', injectionError);
          throw new Error(
            "Could not load extension on this page. Please refresh the page and try again. Make sure you're on a X.com following page."
          );
        }
      }

      // Verify we're on the right page by checking the response
      if (!response || !response.success) {
        throw new Error(
          "Extension could not connect to the page. Please make sure you're on X.com and refresh the page."
        );
      }

      // Send message to content script to start scan
      this.updateStatusCard('🔄', 'Starting scan...', 'Initializing the scanning process...');
      response = await chrome.tabs.sendMessage(tab.id, { type: 'START_SCAN' });
      console.log('Start scan response:', response);

      if (response && response.success) {
        this.isScanning = true;
        this.updateScanUI(true);
        this.updateStatusCard(
          '🔄',
          'Scanning...',
          'Analyzing your following list, this may take a few minutes.'
        );
        this.showSuccess('Scan started successfully!');
      } else {
        throw new Error(response?.error || 'Failed to start scan');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      this.updateStatusCard('❌', 'Scan failed', error.message, true);
      this.showError('Failed to start scan: ' + error.message);
    }
  }

  async stopScan() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'STOP_SCAN' });

      if (response && response.success) {
        this.isScanning = false;
        this.updateScanUI(false);
        this.updateStatusCard('⏸️', 'Scan stopped', 'Scan was stopped by user.');
      }
    } catch (error) {
      console.error('Error stopping scan:', error);
      this.showError('Failed to stop scan: ' + error.message);
    }
  }

  handleScanStatusUpdate(status) {
    if (status.isComplete) {
      this.isScanning = false;
      // Raw results from scan
      const rawResults = status.results.nonMutualFollowers || [];
      // Apply allowlist filtering
      this.scanResults = this.filterResultsWithAllowlist(rawResults);
      this.updateScanUI(false);
      this.updateStatusCard(
        '✅',
        'Scan completed!',
        `Found ${this.scanResults.length} non-mutual followers (excluded ${this.allowlist.length} allowlisted) out of ${status.results.totalFollowing} total following.`
      );
      this.displayResults(this.scanResults);

      // Switch to scanner tab if not already there
      if (this.currentTab !== 'scanner') {
        this.switchTab('scanner');
      }
    } else {
      // Update progress
      this.updateStatusCard('🔄', 'Scanning...', status.message);
    }
  }

  // Filter an array of user result objects against current allowlist (case-insensitive)
  filterResultsWithAllowlist(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }
    if (!Array.isArray(this.allowlist) || this.allowlist.length === 0) {
      return results;
    }
    const allowSet = new Set(this.allowlist.map(u => u.toLowerCase()));
    return results.filter(u => !allowSet.has((u.username || '').toLowerCase()));
  }

  // Re-filter current results after allowlist changes
  refilterCurrentResults() {
    if (!this.scanResults || this.scanResults.length === 0) {
      return;
    }
    const before = this.scanResults.length;
    this.scanResults = this.filterResultsWithAllowlist(this.scanResults);
    const after = this.scanResults.length;
    if (after !== before) {
      /* eslint-disable-next-line no-console */
      console.log(`🔧 DEBUG: Refiltered scan results after allowlist change. Removed ${before - after} entries.`);
      this.displayResults(this.scanResults);
      // Clear selections because indices may have shifted
      this.selectedUsers.clear();
      this.updateSelectAllButton();
    }
  }

  updateScanUI(isScanning) {
    const startBtn = document.getElementById('start-scan-btn');
    const stopBtn = document.getElementById('stop-scan-btn');

    if (isScanning) {
      startBtn.classList.add('hidden');
      stopBtn.classList.remove('hidden');
    } else {
      startBtn.classList.remove('hidden');
      stopBtn.classList.add('hidden');
    }
  }

  updateStatusCard(icon, title, message, isError = false) {
    const statusCard = document.getElementById('status-card');
    const statusIcon = statusCard.querySelector('.status-icon');
    const statusText = statusCard.querySelector('.status-text');
    const statusDetails = document.getElementById('status-details');

    statusIcon.textContent = icon;
    statusText.textContent = title;
    statusDetails.textContent = message;

    // Update card styling
    statusCard.classList.remove('scanning', 'completed', 'error');
    if (isError) {
      statusCard.classList.add('error');
    } else if (this.isScanning) {
      statusCard.classList.add('scanning');
    } else if (icon === '✅') {
      statusCard.classList.add('completed');
    }
  }

  displayResults(results) {
    this.scanResults = results;
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('results-count').textContent = `${results.length} found`;

    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    if (results.length === 0) {
      resultsList.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #6c757d;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🎉</div>
          <div style="font-weight: 600; margin-bottom: 5px;">Great news!</div>
          <div style="font-size: 0.9rem;">All users you follow also follow you back.</div>
        </div>
      `;
      return;
    }

    results.forEach((user, index) => {
      const resultItem = this.createResultItem(user, index);
      resultsList.appendChild(resultItem);
    });
  }

  createResultItem(user, index) {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.dataset.username = user.username.toLowerCase();
    item.dataset.displayName = user.displayName.toLowerCase();

    item.innerHTML = `
      <input type="checkbox" class="result-checkbox" data-index="${index}">
      <div class="result-info">
        <a href="${user.profileUrl}" target="_blank" class="result-username">@${user.username}</a>
        <div class="result-display-name">${user.displayName}</div>
      </div>
      <div class="result-actions">
        <button class="result-btn add-to-allowlist-btn" data-username="${user.username}">
          Add to Allowlist
        </button>
      </div>
    `;

    // Add event listeners
    const checkbox = item.querySelector('.result-checkbox');
    checkbox.addEventListener('change', e => {
      if (e.target.checked) {
        this.selectedUsers.add(index);
      } else {
        this.selectedUsers.delete(index);
      }
      this.updateSelectAllButton();
    });

    const allowlistBtn = item.querySelector('.add-to-allowlist-btn');
    allowlistBtn.addEventListener('click', () => {
      this.addUserToAllowlist(user.username);
    });

    return item;
  }

  filterResults(query) {
    const resultItems = document.querySelectorAll('.result-item');
    const searchTerm = query.toLowerCase().trim();

    resultItems.forEach(item => {
      const username = item.dataset.username;
      const displayName = item.dataset.displayName;

      if (username.includes(searchTerm) || displayName.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.result-checkbox');
    const selectAllBtn = document.getElementById('select-all-btn');
    const allSelected = this.selectedUsers.size === checkboxes.length;

    if (allSelected) {
      // Deselect all
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      this.selectedUsers.clear();
      selectAllBtn.innerHTML = '<span class="btn-icon">☑️</span>Select All';
    } else {
      // Select all visible items
      checkboxes.forEach((checkbox, index) => {
        const item = checkbox.closest('.result-item');
        if (item.style.display !== 'none') {
          checkbox.checked = true;
          this.selectedUsers.add(index);
        }
      });
      selectAllBtn.innerHTML = '<span class="btn-icon">☐</span>Deselect All';
    }
  }

  updateSelectAllButton() {
    const checkboxes = document.querySelectorAll('.result-checkbox');
    const selectAllBtn = document.getElementById('select-all-btn');
    const allSelected = this.selectedUsers.size === checkboxes.length;

    if (allSelected && checkboxes.length > 0) {
      selectAllBtn.innerHTML = '<span class="btn-icon">☐</span>Deselect All';
    } else {
      selectAllBtn.innerHTML = '<span class="btn-icon">☑️</span>Select All';
    }
  }

  exportResults() {
    if (this.scanResults.length === 0) {
      this.showError('No results to export');
      return;
    }
    // Defensive: ensure allowlist filtering applied
    const filtered = this.filterResultsWithAllowlist(this.scanResults);
    const selectedResults = this.selectedUsers.size > 0
      ? filtered.filter((_, index) => this.selectedUsers.has(index))
      : filtered;

    const exportData = {
      exportDate: new Date().toISOString(),
      type: 'non_mutual_followers',
      count: selectedResults.length,
      users: selectedResults.map(user => ({
        username: user.username,
        displayName: user.displayName,
        profileUrl: user.profileUrl
      }))
    };

    this.downloadJSON(
      exportData,
      `x-unfollow-checker-results-${new Date().toISOString().split('T')[0]}.json`
    );
  }

  // Allowlist Management
  async addToAllowlist() {
    const input = document.getElementById('add-user-input');
    let username = input.value.trim();

    console.log('🔧 DEBUG: Starting addToAllowlist with input:', username);

    // Remove @ symbol if present
    username = username.replace(/^@+/, '');

    console.log('🔧 DEBUG: Cleaned username:', username);

    // Validate input
    if (!username) {
      console.log('🔧 DEBUG: Empty username detected');
      this.showError('Please enter a username');
      input.focus();
      return;
    }

    // Validate username format (Twitter usernames can contain letters, numbers, and underscores)
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(username)) {
      console.log('🔧 DEBUG: Invalid username format:', username);
      this.showError(
        'Invalid username format. Use only letters, numbers, and underscores (max 15 characters)'
      );
      input.focus();
      return;
    }

    console.log('🔧 DEBUG: Current allowlist:', this.allowlist);

    // Check if already in allowlist (but don't prevent, let backend handle it)
    const isAlreadyInList = this.allowlist.some(
      user => user.toLowerCase() === username.toLowerCase()
    );
    if (isAlreadyInList) {
      console.log('🔧 DEBUG: User already in allowlist');
      this.showError(`@${username} is already in your allowlist`);
      input.value = '';
      return;
    }

    // Show loading state
    const addButton = document.getElementById('add-user-btn');
    const originalText = addButton.innerHTML;
    addButton.innerHTML = '<span class="btn-icon">⏳</span>Adding...';
    addButton.disabled = true;

    try {
      console.log('🔧 DEBUG: Sending ADD_TO_ALLOWLIST message for:', username);

      // Test if chrome.runtime is available
      if (!chrome.runtime || !chrome.runtime.sendMessage) {
        throw new Error('Chrome runtime not available. Extension may need to be reloaded.');
      }

      // Create a promise with timeout to prevent hanging
      const messagePromise = chrome.runtime.sendMessage({
        type: 'ADD_TO_ALLOWLIST',
        username: username.toLowerCase() // Store in lowercase for consistency
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Request timeout - background script not responding')),
          10000
        )
      );

      const response = await Promise.race([messagePromise, timeoutPromise]);

      console.log('🔧 DEBUG: Raw response from background:', response);

      if (!response) {
        throw new Error(
          'No response received from background script. Extension may need to be reloaded.'
        );
      }

      if (response.success) {
        console.log('🔧 DEBUG: Successfully added to allowlist');
        this.allowlist = response.allowlist || [];
        this.updateAllowlistDisplay();
        input.value = '';
        this.showSuccess(`✅ Added @${username} to allowlist`);

        // Update results if scan results are displayed
        if (this.scanResults && this.scanResults.length > 0) {
          this.scanResults = this.scanResults.filter(
            user => user.username.toLowerCase() !== username.toLowerCase()
          );
          this.displayResults(this.scanResults);
        }
      } else {
        const errorMessage = response.error || 'Unknown error from background script';
        console.error('🔧 DEBUG: Background script returned error:', errorMessage);
        this.showError(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error('🔧 DEBUG: Exception in addToAllowlist:', error);

      // Provide more specific error messages
      if (error.message.includes('Extension context invalidated')) {
        this.showError('Extension was reloaded. Please refresh the page and try again.');
      } else if (error.message.includes('Could not establish connection')) {
        this.showError(
          'Connection error. Please close and reopen the extension popup, or reload the extension.'
        );
      } else if (error.message.includes('runtime not available')) {
        this.showError('Extension runtime error. Please reload the extension and try again.');
      } else {
        this.showError(`Failed to add user: ${error.message}`);
      }
    } finally {
      // Restore button state
      console.log('🔧 DEBUG: Restoring button state');
      addButton.innerHTML = originalText;
      addButton.disabled = false;
    }
  }

  validateUsernameInput(input) {
    const username = input.value.trim().replace(/^@+/, '');
    const addButton = document.getElementById('add-user-btn');

    // Remove existing validation classes
    input.classList.remove('input-valid', 'input-invalid');

    if (!username) {
      // Empty input - neutral state
      addButton.disabled = false;
      input.style.borderColor = '';
      return;
    }

    // Check format
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(username)) {
      input.classList.add('input-invalid');
      input.style.borderColor = '#dc3545';
      addButton.disabled = true;
      return;
    }

    // Check if already in allowlist
    if (this.allowlist.some(user => user.toLowerCase() === username.toLowerCase())) {
      input.classList.add('input-invalid');
      input.style.borderColor = '#ffc107';
      addButton.disabled = true;
      return;
    }

    // Valid input
    input.classList.add('input-valid');
    input.style.borderColor = '#28a745';
    addButton.disabled = false;
  }

  async removeFromAllowlist(username) {
    console.log('Removing from allowlist:', username);

    if (!username) {
      this.showError('Username is required');
      return;
    }

    // Show loading state if there's a remove button
    const removeButtons = document.querySelectorAll(`[data-username="${username}"] .remove-btn`);
    removeButtons.forEach(btn => {
      btn.textContent = 'Removing...';
      btn.disabled = true;
    });

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'REMOVE_FROM_ALLOWLIST',
        username: username
      });

      console.log('Remove response:', response);

      if (response && response.success) {
        this.allowlist = response.allowlist;
        this.updateAllowlistDisplay();
        this.showSuccess(`✅ Removed @${username} from allowlist`);
      } else {
        const errorMessage = response?.error || 'Failed to remove user from allowlist';
        console.error('Failed to remove from allowlist:', errorMessage);
        this.showError(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error removing from allowlist:', error);

      if (error.message.includes('Extension context invalidated')) {
        this.showError('Extension was reloaded. Please refresh the page and try again.');
      } else if (error.message.includes('Could not establish connection')) {
        this.showError('Connection error. Please refresh the page and try again.');
      } else {
        this.showError(`Failed to remove user: ${error.message}`);
      }
    } finally {
      // Restore button state
      removeButtons.forEach(btn => {
        btn.textContent = 'Remove';
        btn.disabled = false;
      });
    }
  }

  updateAllowlistDisplay() {
    document.getElementById('allowlist-count').textContent = this.allowlist.length;

    const allowlistList = document.getElementById('allowlist-list');
    allowlistList.innerHTML = '';

    if (this.allowlist.length === 0) {
      allowlistList.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #6c757d;">
          <div style="font-size: 2rem; margin-bottom: 10px;">📝</div>
          <div style="font-weight: 600; margin-bottom: 5px;">No users in allowlist</div>
          <div style="font-size: 0.9rem;">Add users you want to exclude from non-mutual followers.</div>
        </div>
      `;
      return;
    }

    this.allowlist.forEach(username => {
      const item = document.createElement('div');
      item.className = 'allowlist-item';
      item.innerHTML = `
        <div class="allowlist-username">@${username}</div>
        <button class="remove-from-allowlist-btn" data-username="${username}">Remove</button>
      `;

      const removeBtn = item.querySelector('.remove-from-allowlist-btn');
      removeBtn.addEventListener('click', () => {
        this.removeFromAllowlist(username);
      });

      allowlistList.appendChild(item);
    });

    // Re-filter any existing scan results after allowlist change
    this.refilterCurrentResults();
  }

  importAllowlist() {
    document.getElementById('file-input').click();
  }

  exportAllowlist() {
    if (this.allowlist.length === 0) {
      this.showError('No allowlist to export');
      return;
    }

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      type: 'allowlist',
      count: this.allowlist.length,
      allowlist: this.allowlist
    };

    this.downloadJSON(
      exportData,
      `x-unfollow-checker-allowlist-${new Date().toISOString().split('T')[0]}.json`
    );
  }

  async clearAllowlist() {
    if (
      !confirm('Are you sure you want to clear the entire allowlist? This action cannot be undone.')
    ) {
      return;
    }

    try {
      // Clear allowlist by setting it to empty array
      const response = await chrome.runtime.sendMessage({
        type: 'IMPORT_DATA',
        data: {
          version: '1.0.0',
          data: { allowlist: [] }
        }
      });

      if (response.success) {
        this.allowlist = [];
        this.updateAllowlistDisplay();
        this.showSuccess('Allowlist cleared successfully');
      } else {
        this.showError(response.error);
      }
    } catch (error) {
      this.showError('Failed to clear allowlist');
    }
  }

  // History Management
  updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (this.scanHistory.length === 0) {
      historyList.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #6c757d;">
          <div style="font-size: 2rem; margin-bottom: 10px;">📊</div>
          <div style="font-weight: 600; margin-bottom: 5px;">No scan history</div>
          <div style="font-size: 0.9rem;">Your scan results will appear here.</div>
        </div>
      `;
      return;
    }

    this.scanHistory.forEach(scan => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const date = new Date(scan.date).toLocaleString();
      const duration = this.formatDuration(scan.duration);

      item.innerHTML = `
        <div class="history-date">${date}</div>
        <div class="history-stats">
          <div class="history-stat">
            <div class="history-stat-number">${scan.totalFollowing}</div>
            <div class="history-stat-label">Total Following</div>
          </div>
          <div class="history-stat">
            <div class="history-stat-number">${scan.nonMutualCount}</div>
            <div class="history-stat-label">Non-Mutual</div>
          </div>
        </div>
        <div class="history-duration">Scan duration: ${duration}</div>
      `;

      historyList.appendChild(item);
    });
  }

  async clearHistory() {
    if (
      !confirm('Are you sure you want to clear the scan history? This action cannot be undone.')
    ) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({ type: 'CLEAR_SCAN_HISTORY' });

      if (response.success) {
        this.scanHistory = [];
        this.updateHistoryDisplay();
        this.showSuccess('Scan history cleared');
      } else {
        this.showError('Failed to clear history');
      }
    } catch (error) {
      this.showError('Failed to clear history');
    }
  }

  // Settings Management
  updateSettingsDisplay() {
    if (!this.settings) return;

    const scrollDelay = document.getElementById('scroll-delay');
    const batchSize = document.getElementById('batch-size');
    const enableNotifications = document.getElementById('enable-notifications');

    if (this.settings.scrollDelay) {
      scrollDelay.value = this.settings.scrollDelay;
      document.getElementById('scroll-delay-value').textContent = this.settings.scrollDelay + 'ms';
    }

    if (this.settings.batchSize) {
      batchSize.value = this.settings.batchSize;
      document.getElementById('batch-size-value').textContent = this.settings.batchSize;
    }

    if (this.settings.enableNotifications !== undefined) {
      enableNotifications.checked = this.settings.enableNotifications;
    }
  }

  async saveSettings() {
    const settings = {
      scrollDelay: parseInt(document.getElementById('scroll-delay').value),
      batchSize: parseInt(document.getElementById('batch-size').value),
      enableNotifications: document.getElementById('enable-notifications').checked
    };

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        settings: settings
      });

      if (response.success) {
        this.settings = response.settings;
        this.showSuccess('Settings saved successfully');
      } else {
        this.showError('Failed to save settings');
      }
    } catch (error) {
      this.showError('Failed to save settings');
    }
  }

  async resetSettings() {
    if (!confirm('Reset all settings to default values?')) {
      return;
    }

    const defaultSettings = {
      scrollDelay: 2000,
      batchSize: 50,
      enableNotifications: true
    };

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        settings: defaultSettings
      });

      if (response.success) {
        this.settings = response.settings;
        this.updateSettingsDisplay();
        this.showSuccess('Settings reset to default');
      } else {
        this.showError('Failed to reset settings');
      }
    } catch (error) {
      this.showError('Failed to reset settings');
    }
  }

  // File handling
  async handleFileImport(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.type === 'allowlist' && data.allowlist) {
        // Import allowlist
        const response = await chrome.runtime.sendMessage({
          type: 'IMPORT_DATA',
          data: {
            version: '1.0.0',
            data: { allowlist: data.allowlist }
          }
        });

        if (response.success) {
          this.allowlist = data.allowlist;
          this.updateAllowlistDisplay();
          this.showSuccess(`Imported ${data.allowlist.length} users to allowlist`);
        } else {
          this.showError('Failed to import allowlist');
        }
      } else {
        this.showError('Invalid file format');
      }
    } catch (error) {
      this.showError('Failed to read file: ' + error.message);
    }

    // Reset file input
    document.getElementById('file-input').value = '';
  }

  // Utility functions
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;

    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #1da1f2 0%, #1991db 100%)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showAbout() {
    const aboutContent = `
      <div style="text-align: center; padding: 20px;">
        <h2 style="margin-bottom: 15px; color: #1da1f2;">X Unfollow Checker v1.0.0</h2>
        <p style="margin-bottom: 15px; color: #6c757d; line-height: 1.5;">
          A powerful browser extension to help you manage your X (Twitter) following list by identifying users who don't follow you back.
        </p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin-bottom: 10px; color: #333;">Features:</h3>
          <ul style="text-align: left; color: #6c757d; line-height: 1.6;">
            <li>Automatic scanning of your following list</li>
            <li>Smart allowlist management</li>
            <li>Export functionality for results</li>
            <li>Detailed scan history</li>
            <li>Customizable settings</li>
          </ul>
        </div>
        <p style="font-size: 0.8rem; color: #6c757d;">
          This extension respects X's terms of service and only analyzes publicly visible data.
        </p>
      </div>
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    `;

    modalContent.innerHTML =
      aboutContent +
      `
      <div style="text-align: center; padding: 0 20px 20px;">
        <button id="close-about" style="
          background: #1da1f2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        ">Close</button>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close handlers
    document.getElementById('close-about').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
