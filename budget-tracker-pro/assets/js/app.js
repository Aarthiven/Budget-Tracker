/**
 * Budget Tracker Pro - Main Application
 * Entry point and application initialization
 */

const App = {
    // Application state
    isInitialized: false,
    version: CONFIG.VERSION,

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log(`🚀 Initializing Budget Tracker Pro v${this.version}`);
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize modules in order
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Hide loading screen
            await this.hideLoadingScreen();
            
            // Initialize authentication
            if (typeof Auth !== 'undefined') {
                Auth.init();
            }
            
            this.isInitialized = true;
            console.log('✅ Budget Tracker Pro initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Budget Tracker Pro:', error);
            this.handleInitializationError(error);
        }
    },

    /**
     * Initialize all modules
     */
    async initializeModules() {
        const modules = [
            { name: 'Utils', module: Utils },
            { name: 'Auth', module: Auth },
            { name: 'Dashboard', module: Dashboard },
            { name: 'Transactions', module: Transactions },
            { name: 'Charts', module: Charts }
        ];

        for (const { name, module } of modules) {
            try {
                if (module && typeof module.init === 'function') {
                    console.log(`📦 Initializing ${name} module...`);
                    await module.init();
                }
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${name} module:`, error);
            }
        }
    },

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason);
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.updateOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.updateOnlineStatus(false);
        });

        // Handle visibility change (tab focus/blur)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isInitialized) {
                // Refresh data when tab becomes visible
                this.refreshData();
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Handle clicks outside modals/dropdowns
        document.addEventListener('click', (event) => {
            this.handleGlobalClick(event);
        });
    },

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('fade-out');
        }
    },

    /**
     * Hide loading screen
     */
    async hideLoadingScreen() {
        // Ensure minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, CONFIG.ANIMATIONS.LOADING_MIN));
        
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, CONFIG.ANIMATIONS.SLOW);
        }
    },

    /**
     * Handle initialization errors
     * @param {Error} error - The error that occurred
     */
    handleInitializationError(error) {
        const errorMessage = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                text-align: center;
                max-width: 400px;
                z-index: 10000;
            ">
                <h2 style="color: #ef4444; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Initialization Error
                </h2>
                <p style="margin-bottom: 1rem; color: #6b7280;">
                    Failed to initialize Budget Tracker Pro. Please refresh the page and try again.
                </p>
                <button onclick="location.reload()" style="
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    Refresh Page
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorMessage);
    },

    /**
     * Handle global errors
     * @param {Error} error - The error that occurred
     */
    handleGlobalError(error) {
        console.error('Global error handled:', error);
        
        // Don't show error notifications for minor issues
        if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
            return;
        }
        
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification(
                'An unexpected error occurred. Please refresh the page if issues persist.',
                'error',
                5000
            );
        }
    },

    /**
     * Update online status indicator
     * @param {boolean} isOnline - Online status
     */
    updateOnlineStatus(isOnline) {
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            const icon = statusIndicator.querySelector('i');
            const text = statusIndicator.querySelector('span');
            
            if (isOnline) {
                icon.className = 'fas fa-circle online';
                text.textContent = 'Online';
            } else {
                icon.className = 'fas fa-circle offline';
                text.textContent = 'Offline';
            }
        }
        
        // Show notification
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification(
                isOnline ? 'Connection restored' : 'You are offline',
                isOnline ? 'success' : 'warning',
                3000
            );
        }
    },

    /**
     * Refresh application data
     */
    refreshData() {
        try {
            if (typeof Dashboard !== 'undefined') {
                Dashboard.updateSummary();
            }
            
            if (typeof Transactions !== 'undefined') {
                Transactions.updateRecentTransactions();
                Transactions.filterAndDisplayTransactions();
            }
            
            if (typeof Charts !== 'undefined') {
                Charts.updateAllCharts();
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    },

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardShortcuts(event) {
        // Only handle shortcuts when not typing in inputs
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + key combinations
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    if (typeof Dashboard !== 'undefined') {
                        Dashboard.showTab('overview');
                    }
                    break;
                case '2':
                    event.preventDefault();
                    if (typeof Dashboard !== 'undefined') {
                        Dashboard.showTab('add-transaction');
                    }
                    break;
                case '3':
                    event.preventDefault();
                    if (typeof Dashboard !== 'undefined') {
                        Dashboard.showTab('transactions');
                    }
                    break;
                case '4':
                    event.preventDefault();
                    if (typeof Dashboard !== 'undefined') {
                        Dashboard.showTab('analytics');
                    }
                    break;
                case 's':
                    event.preventDefault();
                    if (typeof Dashboard !== 'undefined') {
                        Dashboard.exportData();
                    }
                    break;
            }
        }

        // Escape key to close modals/notifications
        if (event.key === 'Escape') {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => notification.remove());
        }
    },

    /**
     * Handle global clicks
     * @param {MouseEvent} event - Click event
     */
    handleGlobalClick(event) {
        // Close dropdowns when clicking outside
        const dropdowns = document.querySelectorAll('.dropdown.open');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('open');
            }
        });
    },

    /**
     * Get application info
     * @returns {Object} Application information
     */
    getAppInfo() {
        return {
            name: CONFIG.APP_NAME,
            version: this.version,
            isInitialized: this.isInitialized,
            modules: {
                auth: typeof Auth !== 'undefined',
                dashboard: typeof Dashboard !== 'undefined',
                transactions: typeof Transactions !== 'undefined',
                charts: typeof Charts !== 'undefined',
                utils: typeof Utils !== 'undefined'
            }
        };
    },

    /**
     * Reset application to initial state
     */
    reset() {
        if (confirm('Are you sure you want to reset the application? This will clear all data and reload the page.')) {
            // Clear all storage
            if (typeof Utils !== 'undefined' && Utils.storage) {
                Utils.storage.clear();
            }
            
            // Reload page
            location.reload();
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App globally available for debugging
window.BudgetTrackerApp = App;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
