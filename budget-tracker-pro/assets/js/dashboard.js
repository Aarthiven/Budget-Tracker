/**
 * Budget Tracker Pro - Dashboard Module
 * Handles dashboard functionality and navigation
 */

const Dashboard = {
    // Current active tab
    currentTab: 'overview',

    /**
     * Initialize dashboard
     */
    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.updateSummary();
        this.updateOverviewChart();
        this.showTab('overview');
        
        // Initialize other modules
        if (typeof Transactions !== 'undefined') {
            Transactions.init();
        }
        
        if (typeof Charts !== 'undefined') {
            Charts.init();
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.showTab(tabName);
            });
        });

        // Window resize handler for charts
        window.addEventListener('resize', Utils.debounce(() => {
            if (typeof Charts !== 'undefined') {
                Charts.updateAllCharts();
            }
        }, 250));
    },

    /**
     * Show specific tab
     * @param {string} tabName - Name of tab to show
     */
    showTab(tabName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all tabs
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${tabName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to selected tab
        const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Update current tab
        this.currentTab = tabName;

        // Handle tab-specific actions
        this.handleTabChange(tabName);
    },

    /**
     * Handle tab change actions
     * @param {string} tabName - Name of the tab
     */
    handleTabChange(tabName) {
        switch (tabName) {
            case 'analytics':
                // Update charts when analytics tab is shown
                setTimeout(() => {
                    if (typeof Charts !== 'undefined') {
                        Charts.updateAllCharts();
                    }
                }, 100);
                break;
                
            case 'transactions':
                // Update transactions list
                if (typeof Transactions !== 'undefined') {
                    Transactions.filterAndDisplayTransactions();
                }
                break;
                
            case 'add-transaction':
                // Focus on description field
                setTimeout(() => {
                    const descriptionField = document.getElementById('description');
                    if (descriptionField) {
                        descriptionField.focus();
                    }
                }, 100);
                break;
        }
    },

    /**
     * Update current date display
     */
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = Utils.formatDate(new Date(), 'long');
        }
    },

    /**
     * Update financial summary
     */
    updateSummary() {
        if (!Transactions || !Transactions.transactions) {
            return;
        }

        const totalIncome = Transactions.getTotalByType('income');
        const totalExpenses = Transactions.getTotalByType('expense');
        const currentBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (currentBalance / totalIncome) * 100 : 0;

        // Update balance
        const balanceElement = document.getElementById('currentBalance');
        if (balanceElement) {
            balanceElement.textContent = Utils.formatCurrency(currentBalance);
            
            // Update balance color
            if (currentBalance >= 0) {
                balanceElement.className = 'stat-value';
                balanceElement.style.color = CONFIG.CHART_COLORS.SUCCESS;
            } else {
                balanceElement.className = 'stat-value';
                balanceElement.style.color = CONFIG.CHART_COLORS.DANGER;
            }
        }

        // Update total income
        const incomeElement = document.getElementById('totalIncome');
        if (incomeElement) {
            incomeElement.textContent = Utils.formatCurrency(totalIncome);
        }

        // Update total expenses
        const expensesElement = document.getElementById('totalExpenses');
        if (expensesElement) {
            expensesElement.textContent = Utils.formatCurrency(totalExpenses);
        }

        // Update savings rate
        const savingsElement = document.getElementById('savingsRate');
        if (savingsElement) {
            savingsElement.textContent = Utils.formatPercentage(savingsRate);
        }

        // Update recent transactions
        if (typeof Transactions !== 'undefined') {
            Transactions.updateRecentTransactions();
        }
    },

    /**
     * Update overview chart
     */
    updateOverviewChart() {
        if (typeof Charts !== 'undefined') {
            Charts.updateOverviewChart();
        }
    },

    /**
     * Export data functionality
     */
    exportData() {
        try {
            if (!Transactions || !Transactions.transactions) {
                Utils.showNotification('No data to export', 'warning');
                return;
            }

            const data = {
                transactions: Transactions.transactions,
                exportDate: new Date().toISOString(),
                version: CONFIG.VERSION
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `budget-tracker-export-${Utils.formatDate(new Date(), 'input')}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            Utils.showNotification('Data exported successfully!', 'success');
            
        } catch (error) {
            console.error('Export error:', error);
            Utils.showNotification('Failed to export data', 'error');
        }
    },

    /**
     * Clear all data functionality
     */
    clearAllData() {
        const confirmMessage = 'Are you sure you want to clear all data? This action cannot be undone.';
        
        if (!confirm(confirmMessage)) {
            return;
        }

        // Double confirmation for safety
        const doubleConfirm = prompt('Type "DELETE" to confirm data deletion:');
        if (doubleConfirm !== 'DELETE') {
            Utils.showNotification('Data deletion cancelled', 'info');
            return;
        }

        try {
            // Clear transactions
            if (Transactions) {
                Transactions.transactions = [];
                Transactions.saveTransactions();
            }

            // Clear other stored data
            Utils.storage.clear();

            // Update displays
            this.updateSummary();
            
            if (typeof Charts !== 'undefined') {
                Charts.updateAllCharts();
            }
            
            if (typeof Transactions !== 'undefined') {
                Transactions.updateRecentTransactions();
                Transactions.filterAndDisplayTransactions();
            }

            Utils.showNotification('All data cleared successfully', 'success');
            
        } catch (error) {
            console.error('Clear data error:', error);
            Utils.showNotification('Failed to clear data', 'error');
        }
    },

    /**
     * Get dashboard statistics
     * @returns {Object} Dashboard statistics
     */
    getStatistics() {
        if (!Transactions || !Transactions.transactions) {
            return {
                totalTransactions: 0,
                totalIncome: 0,
                totalExpenses: 0,
                currentBalance: 0,
                savingsRate: 0,
                topExpenseCategory: null,
                topIncomeCategory: null
            };
        }

        const totalIncome = Transactions.getTotalByType('income');
        const totalExpenses = Transactions.getTotalByType('expense');
        const currentBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (currentBalance / totalIncome) * 100 : 0;

        // Get top categories
        const expenseTotals = Transactions.getCategoryTotals('expense');
        const incomeTotals = Transactions.getCategoryTotals('income');
        
        const topExpenseCategory = Object.keys(expenseTotals).length > 0 
            ? Object.entries(expenseTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0]
            : null;
            
        const topIncomeCategory = Object.keys(incomeTotals).length > 0
            ? Object.entries(incomeTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0]
            : null;

        return {
            totalTransactions: Transactions.transactions.length,
            totalIncome,
            totalExpenses,
            currentBalance,
            savingsRate,
            topExpenseCategory,
            topIncomeCategory
        };
    },

    /**
     * Show loading state
     * @param {boolean} loading - Loading state
     */
    setLoading(loading) {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            if (loading) {
                loadingScreen.classList.remove('fade-out');
            } else {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }
    },

    /**
     * Handle window beforeunload event
     */
    handleBeforeUnload() {
        // Save any pending data
        if (Transactions && Transactions.transactions) {
            Transactions.saveTransactions();
        }
    }
};

// Global functions for HTML onclick handlers
function showTab(tabName) {
    Dashboard.showTab(tabName);
}

function exportData() {
    Dashboard.exportData();
}

function clearAllData() {
    Dashboard.clearAllData();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    Dashboard.handleBeforeUnload();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
