/**
 * Budget Tracker Pro - Charts Module
 * Handles all chart-related functionality using Chart.js
 */

const Charts = {
    // Chart instances
    expenseChart: null,
    incomeChart: null,
    trendChart: null,
    overviewChart: null,

    /**
     * Initialize charts module
     */
    init() {
        this.setupChartDefaults();
        this.updateAllCharts();
        this.setupEventListeners();
    },

    /**
     * Setup Chart.js default configuration
     */
    setupChartDefaults() {
        Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#6b7280';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.padding = 20;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const analyticsPeriod = document.getElementById('analyticsPeriod');
        if (analyticsPeriod) {
            analyticsPeriod.addEventListener('change', () => this.updateAllCharts());
        }
    },

    /**
     * Update all charts
     */
    updateAllCharts() {
        this.updateExpenseChart();
        this.updateIncomeChart();
        this.updateTrendChart();
        this.updateOverviewChart();
    },

    /**
     * Update expense breakdown chart
     */
    updateExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }

        // Get expense data
        const expenseData = this.getExpenseData();
        
        if (expenseData.labels.length === 0) {
            this.showEmptyChart(ctx, 'No expense data available');
            return;
        }

        this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: expenseData.labels,
                datasets: [{
                    data: expenseData.values,
                    backgroundColor: CONFIG.EXPENSE_COLORS,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, index) => ({
                                    text: `${label}: ${Utils.formatCurrency(data.datasets[0].data[index])}`,
                                    fillStyle: data.datasets[0].backgroundColor[index],
                                    strokeStyle: data.datasets[0].backgroundColor[index],
                                    lineWidth: 0,
                                    pointStyle: 'circle'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${Utils.formatCurrency(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    },

    /**
     * Update income sources chart
     */
    updateIncomeChart() {
        const canvas = document.getElementById('incomeChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.incomeChart) {
            this.incomeChart.destroy();
        }

        // Get income data
        const incomeData = this.getIncomeData();
        
        if (incomeData.labels.length === 0) {
            this.showEmptyChart(ctx, 'No income data available');
            return;
        }

        this.incomeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: incomeData.labels,
                datasets: [{
                    data: incomeData.values,
                    backgroundColor: CONFIG.INCOME_COLORS,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, index) => ({
                                    text: `${label}: ${Utils.formatCurrency(data.datasets[0].data[index])}`,
                                    fillStyle: data.datasets[0].backgroundColor[index],
                                    strokeStyle: data.datasets[0].backgroundColor[index],
                                    lineWidth: 0,
                                    pointStyle: 'circle'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${Utils.formatCurrency(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    },

    /**
     * Update monthly trend chart
     */
    updateTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.trendChart) {
            this.trendChart.destroy();
        }

        // Get trend data
        const trendData = this.getTrendData();
        
        if (trendData.labels.length === 0) {
            this.showEmptyChart(ctx, 'No data available for trend analysis');
            return;
        }

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: trendData.income,
                        borderColor: CONFIG.CHART_COLORS.SUCCESS,
                        backgroundColor: CONFIG.CHART_COLORS.SUCCESS + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: CONFIG.CHART_COLORS.SUCCESS,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Expenses',
                        data: trendData.expenses,
                        borderColor: CONFIG.CHART_COLORS.DANGER,
                        backgroundColor: CONFIG.CHART_COLORS.DANGER + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: CONFIG.CHART_COLORS.DANGER,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${Utils.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            padding: 10
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            padding: 10,
                            callback: (value) => Utils.formatCurrency(value)
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    },

    /**
     * Update overview chart (mini expense chart)
     */
    updateOverviewChart() {
        const canvas = document.getElementById('overviewExpenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.overviewChart) {
            this.overviewChart.destroy();
        }

        // Get expense data (top 5 categories)
        const expenseData = this.getExpenseData(5);
        
        if (expenseData.labels.length === 0) {
            this.showEmptyChart(ctx, 'No expense data');
            return;
        }

        this.overviewChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: expenseData.labels,
                datasets: [{
                    data: expenseData.values,
                    backgroundColor: CONFIG.EXPENSE_COLORS.slice(0, expenseData.labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${Utils.formatCurrency(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 800
                }
            }
        });
    },

    /**
     * Get expense data for charts
     * @param {number} limit - Limit number of categories (optional)
     * @returns {Object} Chart data object
     */
    getExpenseData(limit = null) {
        if (!Transactions || !Transactions.transactions) {
            return { labels: [], values: [] };
        }

        const categoryTotals = Transactions.getCategoryTotals('expense');
        
        // Sort by amount and limit if specified
        let sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a);
        
        if (limit) {
            sortedCategories = sortedCategories.slice(0, limit);
        }

        return {
            labels: sortedCategories.map(([category]) => {
                const categoryInfo = Utils.getCategoryInfo(category, 'expense');
                return categoryInfo.label.replace(/^[^\s]+\s/, ''); // Remove emoji
            }),
            values: sortedCategories.map(([, amount]) => amount)
        };
    },

    /**
     * Get income data for charts
     * @returns {Object} Chart data object
     */
    getIncomeData() {
        if (!Transactions || !Transactions.transactions) {
            return { labels: [], values: [] };
        }

        const categoryTotals = Transactions.getCategoryTotals('income');
        
        // Sort by amount
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a);

        return {
            labels: sortedCategories.map(([category]) => {
                const categoryInfo = Utils.getCategoryInfo(category, 'income');
                return categoryInfo.label.replace(/^[^\s]+\s/, ''); // Remove emoji
            }),
            values: sortedCategories.map(([, amount]) => amount)
        };
    },

    /**
     * Get trend data for charts
     * @returns {Object} Chart data object
     */
    getTrendData() {
        if (!Transactions || !Transactions.transactions) {
            return { labels: [], income: [], expenses: [] };
        }

        // Group transactions by month
        const monthlyData = {};
        
        Transactions.transactions.forEach(transaction => {
            const monthKey = Utils.formatDate(transaction.date, 'chart');
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expenses: 0 };
            }
            
            if (transaction.type === 'income') {
                monthlyData[monthKey].income += transaction.amount;
            } else {
                monthlyData[monthKey].expenses += transaction.amount;
            }
        });

        // Sort months chronologically
        const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        return {
            labels: sortedMonths,
            income: sortedMonths.map(month => monthlyData[month].income),
            expenses: sortedMonths.map(month => monthlyData[month].expenses)
        };
    },

    /**
     * Show empty chart message
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} message - Message to display
     */
    showEmptyChart(ctx, message) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Inter, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2);
    },

    /**
     * Destroy all charts
     */
    destroyAllCharts() {
        [this.expenseChart, this.incomeChart, this.trendChart, this.overviewChart].forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
}
