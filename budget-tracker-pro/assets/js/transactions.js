/**
 * Budget Tracker Pro - Transactions Module
 * Handles all transaction-related functionality
 */

const Transactions = {
    // Transaction data
    transactions: [],
    currentPage: 1,
    itemsPerPage: CONFIG.PAGINATION.TRANSACTIONS_PER_PAGE,

    /**
     * Initialize transactions module
     */
    init() {
        this.loadTransactions();
        this.setupEventListeners();
        this.updateCategories();
        this.setDefaultDate();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Transaction form submission
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleAddTransaction(e));
        }

        // Type change to update categories
        const typeSelect = document.getElementById('type');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateCategories());
        }

        // Filter and sort changes
        const filterType = document.getElementById('filterType');
        const sortBy = document.getElementById('sortBy');
        
        if (filterType) {
            filterType.addEventListener('change', () => this.filterAndDisplayTransactions());
        }
        
        if (sortBy) {
            sortBy.addEventListener('change', () => this.filterAndDisplayTransactions());
        }
    },

    /**
     * Load transactions from storage or use sample data
     */
    loadTransactions() {
        const stored = Utils.storage.get(CONFIG.STORAGE_KEYS.TRANSACTIONS);
        
        if (stored && stored.length > 0) {
            this.transactions = stored.map(t => ({
                ...t,
                date: new Date(t.date)
            }));
        } else {
            // Use sample data for demo
            this.transactions = SAMPLE_TRANSACTIONS.map(t => ({
                ...t,
                date: new Date(t.date)
            }));
            this.saveTransactions();
        }
    },

    /**
     * Save transactions to storage
     */
    saveTransactions() {
        Utils.storage.set(CONFIG.STORAGE_KEYS.TRANSACTIONS, this.transactions);
    },

    /**
     * Update category dropdown based on selected type
     */
    updateCategories() {
        const typeSelect = document.getElementById('type');
        const categorySelect = document.getElementById('category');
        
        if (!typeSelect || !categorySelect) return;
        
        const selectedType = typeSelect.value;
        const categories = CATEGORIES[selectedType] || [];
        
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.value;
            option.textContent = category.label;
            categorySelect.appendChild(option);
        });
    },

    /**
     * Set default date to today
     */
    setDefaultDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = Utils.formatDate(new Date(), 'input');
        }
    },

    /**
     * Handle add transaction form submission
     * @param {Event} event - Form submission event
     */
    async handleAddTransaction(event) {
        event.preventDefault();
        
        const formData = this.getFormData();
        
        if (!this.validateFormData(formData)) {
            return;
        }
        
        try {
            // Show loading state
            this.setFormLoading(true);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Create new transaction
            const newTransaction = {
                id: Utils.generateId(),
                ...formData,
                date: new Date(formData.date)
            };
            
            // Add to transactions array
            this.transactions.push(newTransaction);
            
            // Save to storage
            this.saveTransactions();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.resetForm();
            
            // Update displays
            this.updateAllDisplays();
            
            // Show notification
            Utils.showNotification('Transaction added successfully!', 'success');
            
        } catch (error) {
            console.error('Error adding transaction:', error);
            Utils.showNotification('Failed to add transaction. Please try again.', 'error');
        } finally {
            this.setFormLoading(false);
        }
    },

    /**
     * Get form data
     * @returns {Object} Form data object
     */
    getFormData() {
        return {
            description: document.getElementById('description').value.trim(),
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value,
            notes: document.getElementById('notes').value.trim()
        };
    },

    /**
     * Validate form data
     * @param {Object} data - Form data to validate
     * @returns {boolean} True if valid
     */
    validateFormData(data) {
        if (!data.description) {
            Utils.showNotification('Please enter a description', 'error');
            return false;
        }
        
        if (!Utils.isValidNumber(data.amount, 0.01)) {
            Utils.showNotification('Please enter a valid amount greater than 0', 'error');
            return false;
        }
        
        if (!data.type || !data.category) {
            Utils.showNotification('Please select type and category', 'error');
            return false;
        }
        
        if (!data.date) {
            Utils.showNotification('Please select a date', 'error');
            return false;
        }
        
        return true;
    },

    /**
     * Set form loading state
     * @param {boolean} loading - Loading state
     */
    setFormLoading(loading) {
        const submitBtn = document.querySelector('.submit-btn');
        const formInputs = document.querySelectorAll('#transactionForm input, #transactionForm select');
        
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Transaction';
            }
        }
        
        formInputs.forEach(input => {
            input.disabled = loading;
        });
    },

    /**
     * Show success message
     */
    showSuccessMessage() {
        const successDiv = document.getElementById('addSuccess');
        if (successDiv) {
            successDiv.classList.remove('hidden');
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 3000);
        }
    },

    /**
     * Reset form
     */
    resetForm() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.reset();
            this.updateCategories();
            this.setDefaultDate();
        }
    },

    /**
     * Update all displays
     */
    updateAllDisplays() {
        this.updateRecentTransactions();
        this.filterAndDisplayTransactions();
        
        // Update dashboard if available
        if (typeof Dashboard !== 'undefined') {
            Dashboard.updateSummary();
            Dashboard.updateOverviewChart();
        }
        
        // Update charts if available
        if (typeof Charts !== 'undefined') {
            Charts.updateAllCharts();
        }
    },

    /**
     * Update recent transactions display
     */
    updateRecentTransactions() {
        const container = document.getElementById('recentTransactions');
        if (!container) return;
        
        if (this.transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions yet</p>
                    <small>Add your first transaction to get started</small>
                </div>
            `;
            return;
        }
        
        const recentTransactions = this.transactions
            .slice(-CONFIG.PAGINATION.RECENT_TRANSACTIONS_LIMIT)
            .reverse();
        
        container.innerHTML = recentTransactions.map(transaction => 
            this.createTransactionHTML(transaction, false)
        ).join('');
    },

    /**
     * Filter and display all transactions
     */
    filterAndDisplayTransactions() {
        const filterType = document.getElementById('filterType')?.value || 'all';
        const sortBy = document.getElementById('sortBy')?.value || 'date';
        
        let filteredTransactions = this.transactions.filter(transaction => {
            if (filterType === 'all') return true;
            return transaction.type === filterType;
        });
        
        // Sort transactions
        filteredTransactions.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'amount':
                    return b.amount - a.amount;
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
        
        this.displayTransactions(filteredTransactions);
        this.updatePagination(filteredTransactions.length);
    },

    /**
     * Display transactions with pagination
     * @param {Array} transactions - Transactions to display
     */
    displayTransactions(transactions) {
        const container = document.getElementById('allTransactions');
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No transactions found</p>
                    <small>Try adjusting your filters</small>
                </div>
            `;
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedTransactions = transactions.slice(startIndex, endIndex);
        
        container.innerHTML = paginatedTransactions.map(transaction => 
            this.createTransactionHTML(transaction, true)
        ).join('');
    },

    /**
     * Create HTML for a transaction item
     * @param {Object} transaction - Transaction object
     * @param {boolean} showActions - Whether to show action buttons
     * @returns {string} HTML string
     */
    createTransactionHTML(transaction, showActions = false) {
        const categoryInfo = Utils.getCategoryInfo(transaction.category, transaction.type);
        const icon = Utils.getCategoryIcon(transaction.category);
        const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
        const amountPrefix = transaction.type === 'income' ? '+' : '-';
        
        return `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-info">
                    <div class="transaction-icon">
                        ${icon}
                    </div>
                    <div class="transaction-details">
                        <h4>${Utils.sanitizeHtml(transaction.description)}</h4>
                        <p>
                            ${categoryInfo.label} • ${Utils.formatDate(transaction.date)}
                            ${transaction.notes ? `• ${Utils.sanitizeHtml(transaction.notes)}` : ''}
                        </p>
                    </div>
                </div>
                <div class="transaction-actions">
                    <span class="transaction-amount ${amountClass}">
                        ${amountPrefix}${Utils.formatCurrency(transaction.amount)}
                    </span>
                    ${showActions ? `
                        <button class="btn-icon btn-danger" onclick="Transactions.deleteTransaction('${transaction.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Update pagination
     * @param {number} totalItems - Total number of items
     */
    updatePagination(totalItems) {
        const container = document.getElementById('transactionsPagination');
        if (!container) return;
        
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination-controls">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="Transactions.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
            `;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<span class="pagination-current">${i}</span>`;
            } else {
                paginationHTML += `
                    <button class="pagination-btn" onclick="Transactions.goToPage(${i})">${i}</button>
                `;
            }
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn" onclick="Transactions.goToPage(${this.currentPage + 1})">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
    },

    /**
     * Go to specific page
     * @param {number} page - Page number
     */
    goToPage(page) {
        this.currentPage = page;
        this.filterAndDisplayTransactions();
    },

    /**
     * Delete transaction
     * @param {string} id - Transaction ID
     */
    deleteTransaction(id) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        
        try {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateAllDisplays();
            Utils.showNotification('Transaction deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            Utils.showNotification('Failed to delete transaction', 'error');
        }
    },

    /**
     * Get transactions by type
     * @param {string} type - Transaction type ('income' or 'expense')
     * @returns {Array} Filtered transactions
     */
    getTransactionsByType(type) {
        return this.transactions.filter(t => t.type === type);
    },

    /**
     * Get total amount by type
     * @param {string} type - Transaction type
     * @returns {number} Total amount
     */
    getTotalByType(type) {
        return this.getTransactionsByType(type)
            .reduce((total, transaction) => total + transaction.amount, 0);
    },

    /**
     * Get transactions by category
     * @param {string} type - Transaction type
     * @returns {Object} Transactions grouped by category
     */
    getTransactionsByCategory(type) {
        return this.getTransactionsByType(type)
            .reduce((acc, transaction) => {
                if (!acc[transaction.category]) {
                    acc[transaction.category] = [];
                }
                acc[transaction.category].push(transaction);
                return acc;
            }, {});
    },

    /**
     * Get category totals
     * @param {string} type - Transaction type
     * @returns {Object} Category totals
     */
    getCategoryTotals(type) {
        return this.getTransactionsByType(type)
            .reduce((acc, transaction) => {
                acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
                return acc;
            }, {});
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Transactions;
}
