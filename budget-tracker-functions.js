// Additional JavaScript functions for Budget Tracker Pro

// Delete transaction with confirmation
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction? 🗑️')) {
        const transaction = transactions.find(t => t.id === id);
        transactions = transactions.filter(t => t.id !== id);
        
        updateSummary();
        updateRecentTransactions();
        updateAllTransactions();
        updateAnalytics();
        
        const emoji = transaction.type === 'income' ? '💰' : '💸';
        showNotification(`${emoji} Transaction deleted successfully!`, 'info');
    }
}

// Enhanced summary update with animations
function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    // Update main summary cards
    document.getElementById('balance').textContent = formatCurrency(balance);
    document.getElementById('income').textContent = formatCurrency(income);
    document.getElementById('expenses').textContent = formatCurrency(expenses);
    
    // Update overview stats
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const avgIncome = incomeTransactions.length > 0 ? income / incomeTransactions.length : 0;
    const avgExpense = expenseTransactions.length > 0 ? expenses / expenseTransactions.length : 0;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;
    
    document.getElementById('totalTransactionsOverview').textContent = transactions.length;
    document.getElementById('avgIncomeOverview').textContent = formatCurrency(avgIncome);
    document.getElementById('avgExpenseOverview').textContent = formatCurrency(avgExpense);
    document.getElementById('savingsRateOverview').textContent = Math.round(savingsRate) + '%';
    
    // Update balance card color based on balance
    const balanceCard = document.getElementById('balance-card');
    if (balance >= 0) {
        balanceCard.className = 'bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform';
    } else {
        balanceCard.className = 'bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform';
    }
}

// Update recent transactions with enhanced styling
function updateRecentTransactions() {
    const container = document.getElementById('recent-transactions');
    
    if (transactions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">📝 No transactions yet. Add some to get started!</p>';
        return;
    }
    
    const recentTransactions = transactions.slice(-5).reverse();
    
    container.innerHTML = recentTransactions.map(t => `
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 transform hover:scale-102 border border-gray-200">
            <div class="flex items-center space-x-4">
                <div class="text-3xl">${categoryIcons[t.category] || '📝'}</div>
                <div>
                    <h4 class="font-bold text-gray-900">${t.description}</h4>
                    <p class="text-sm text-gray-600 capitalize">${t.category} • ${formatDate(t.date)}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                </div>
                <div class="text-xs text-gray-500 capitalize font-medium">${t.type}</div>
            </div>
        </div>
    `).join('');
}

// Update all transactions with filtering and sorting
function updateAllTransactions() {
    filterTransactions();
}

// Enhanced filter and sort transactions
function filterTransactions() {
    const filterType = document.getElementById('filterType').value;
    const sortBy = document.getElementById('sortBy').value;
    const container = document.getElementById('all-transactions');
    
    let filteredTransactions = transactions.filter(t => {
        if (filterType === 'all') return true;
        return t.type === filterType;
    });
    
    // Sort transactions
    filteredTransactions.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'amount') {
            return b.amount - a.amount;
        } else if (sortBy === 'category') {
            return a.category.localeCompare(b.category);
        }
        return 0;
    });
    
    if (filteredTransactions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">🔍 No transactions found with current filters.</p>';
        return;
    }
    
    container.innerHTML = filteredTransactions.map(t => `
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg hover:from-gray-50 hover:to-gray-100 transition-all duration-200 transform hover:scale-102 border border-gray-200 shadow-sm">
            <div class="flex items-center space-x-4">
                <div class="text-3xl">${categoryIcons[t.category] || '📝'}</div>
                <div>
                    <h4 class="font-bold text-gray-900">${t.description}</h4>
                    <p class="text-sm text-gray-600 capitalize">${t.category} • ${formatDate(t.date)}</p>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="text-right">
                    <div class="font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                        ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                    </div>
                    <div class="text-xs text-gray-500 capitalize font-medium">${t.type}</div>
                </div>
                <button onclick="deleteTransaction(${t.id})" class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 transform hover:scale-110" title="Delete transaction">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Update analytics with enhanced statistics
function updateAnalytics() {
    updateStats();
    updateCharts();
    updateFinancialHealth();
}

// Enhanced statistics calculation
function updateStats() {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const avgIncome = incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
    const avgExpense = expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    
    document.getElementById('totalTransactions').textContent = transactions.length;
    document.getElementById('avgIncome').textContent = formatCurrency(avgIncome);
    document.getElementById('avgExpense').textContent = formatCurrency(avgExpense);
    document.getElementById('savingsRate').textContent = Math.round(savingsRate) + '%';
}

// Update financial health score
function updateFinancialHealth() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;
    
    // Calculate health score (0-100)
    let healthScore = 50; // Base score
    
    if (balance > 0) healthScore += 20;
    if (savingsRate > 20) healthScore += 15;
    if (savingsRate > 10) healthScore += 10;
    if (transactions.length > 5) healthScore += 5; // Regular tracking
    
    healthScore = Math.min(100, Math.max(0, healthScore));
    
    // Determine status and recommendation
    let status, recommendation;
    if (healthScore >= 80) {
        status = 'Excellent';
        recommendation = 'Keep up the great work! 🌟';
    } else if (healthScore >= 60) {
        status = 'Good';
        recommendation = 'You\'re doing well! 👍';
    } else if (healthScore >= 40) {
        status = 'Fair';
        recommendation = 'Consider reducing expenses 💡';
    } else {
        status = 'Needs Improvement';
        recommendation = 'Focus on budgeting 📊';
    }
    
    document.getElementById('healthScore').textContent = healthScore;
    document.getElementById('budgetStatus').textContent = status;
    document.getElementById('recommendation').textContent = recommendation;
    
    // Update status color
    const statusEl = document.getElementById('budgetStatus');
    if (healthScore >= 80) {
        statusEl.className = 'text-2xl font-bold text-green-600';
    } else if (healthScore >= 60) {
        statusEl.className = 'text-2xl font-bold text-blue-600';
    } else if (healthScore >= 40) {
        statusEl.className = 'text-2xl font-bold text-yellow-600';
    } else {
        statusEl.className = 'text-2xl font-bold text-red-600';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set colors based on type
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
    } else if (type === 'error') {
        notification.className += ' bg-red-500 text-white';
    } else if (type === 'info') {
        notification.className += ' bg-blue-500 text-white';
    }
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Format currency with enhanced formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date with enhanced formatting
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
    });
}
