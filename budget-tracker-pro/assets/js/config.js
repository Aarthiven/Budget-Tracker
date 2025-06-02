/**
 * Budget Tracker Pro - Configuration
 * Contains all application configuration and constants
 */

// Application Configuration
const CONFIG = {
    // Application Info
    APP_NAME: 'Budget Tracker Pro',
    VERSION: '1.0.0',
    
    // Demo Credentials
    DEMO_EMAIL: 'demo@example.com',
    DEMO_PASSWORD: 'demo123',
    
    // Local Storage Keys
    STORAGE_KEYS: {
        TRANSACTIONS: 'budget_tracker_transactions',
        USER_PREFERENCES: 'budget_tracker_preferences',
        LAST_LOGIN: 'budget_tracker_last_login'
    },
    
    // Chart Colors
    CHART_COLORS: {
        PRIMARY: '#6366f1',
        SUCCESS: '#10b981',
        DANGER: '#ef4444',
        WARNING: '#f59e0b',
        INFO: '#3b82f6',
        PURPLE: '#8b5cf6',
        PINK: '#ec4899',
        INDIGO: '#6366f1',
        TEAL: '#14b8a6',
        ORANGE: '#f97316'
    },
    
    // Expense Chart Colors
    EXPENSE_COLORS: [
        '#ef4444', '#f97316', '#f59e0b', '#eab308',
        '#84cc16', '#22c55e', '#10b981', '#14b8a6',
        '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
        '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
    ],
    
    // Income Chart Colors
    INCOME_COLORS: [
        '#10b981', '#059669', '#047857', '#065f46',
        '#064e3b', '#22c55e', '#16a34a', '#15803d'
    ],
    
    // Animation Durations
    ANIMATIONS: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
        LOADING_MIN: 1000
    },
    
    // Pagination
    PAGINATION: {
        TRANSACTIONS_PER_PAGE: 10,
        RECENT_TRANSACTIONS_LIMIT: 5
    },
    
    // Date Formats
    DATE_FORMATS: {
        DISPLAY: 'MMM DD, YYYY',
        INPUT: 'YYYY-MM-DD',
        CHART: 'MMM YYYY'
    },
    
    // Currency Settings
    CURRENCY: {
        CODE: 'USD',
        SYMBOL: '$',
        LOCALE: 'en-US'
    }
};

// Transaction Categories
const CATEGORIES = {
    income: [
        { value: 'salary', label: '💼 Salary', icon: 'fas fa-briefcase' },
        { value: 'business', label: '🏢 Business', icon: 'fas fa-building' },
        { value: 'investment', label: '📊 Investment', icon: 'fas fa-chart-line' },
        { value: 'freelance', label: '💻 Freelance', icon: 'fas fa-laptop' },
        { value: 'rental', label: '🏠 Rental Income', icon: 'fas fa-home' },
        { value: 'dividend', label: '💰 Dividend', icon: 'fas fa-coins' },
        { value: 'bonus', label: '🎁 Bonus', icon: 'fas fa-gift' },
        { value: 'refund', label: '↩️ Refund', icon: 'fas fa-undo' },
        { value: 'other', label: '📝 Other', icon: 'fas fa-ellipsis-h' }
    ],
    expense: [
        { value: 'food', label: '🍽️ Food & Dining', icon: 'fas fa-utensils' },
        { value: 'rent', label: '🏠 Rent & Housing', icon: 'fas fa-home' },
        { value: 'utilities', label: '⚡ Utilities', icon: 'fas fa-bolt' },
        { value: 'transportation', label: '🚗 Transportation', icon: 'fas fa-car' },
        { value: 'entertainment', label: '🎬 Entertainment', icon: 'fas fa-film' },
        { value: 'shopping', label: '🛍️ Shopping', icon: 'fas fa-shopping-bag' },
        { value: 'healthcare', label: '🏥 Healthcare', icon: 'fas fa-hospital' },
        { value: 'education', label: '📚 Education', icon: 'fas fa-graduation-cap' },
        { value: 'insurance', label: '🛡️ Insurance', icon: 'fas fa-shield-alt' },
        { value: 'debt', label: '💳 Debt Payment', icon: 'fas fa-credit-card' },
        { value: 'savings', label: '🐷 Savings', icon: 'fas fa-piggy-bank' },
        { value: 'travel', label: '✈️ Travel', icon: 'fas fa-plane' },
        { value: 'fitness', label: '💪 Fitness', icon: 'fas fa-dumbbell' },
        { value: 'subscription', label: '📱 Subscriptions', icon: 'fas fa-mobile-alt' },
        { value: 'gift', label: '🎁 Gifts', icon: 'fas fa-gift' },
        { value: 'other', label: '📝 Other', icon: 'fas fa-ellipsis-h' }
    ]
};

// Category Icons Mapping
const CATEGORY_ICONS = {
    // Income
    salary: '💼',
    business: '🏢',
    investment: '📊',
    freelance: '💻',
    rental: '🏠',
    dividend: '💰',
    bonus: '🎁',
    refund: '↩️',
    
    // Expense
    food: '🍽️',
    rent: '🏠',
    utilities: '⚡',
    transportation: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    healthcare: '🏥',
    education: '📚',
    insurance: '🛡️',
    debt: '💳',
    savings: '🐷',
    travel: '✈️',
    fitness: '💪',
    subscription: '📱',
    gift: '🎁',
    other: '📝'
};

// Sample Data for Demo
const SAMPLE_TRANSACTIONS = [
    {
        id: 1,
        description: 'Monthly Salary',
        amount: 5000,
        type: 'income',
        category: 'salary',
        date: new Date('2024-01-15'),
        notes: 'Regular monthly salary payment'
    },
    {
        id: 2,
        description: 'Grocery Shopping',
        amount: 150,
        type: 'expense',
        category: 'food',
        date: new Date('2024-01-16'),
        notes: 'Weekly grocery shopping at supermarket'
    },
    {
        id: 3,
        description: 'Rent Payment',
        amount: 1200,
        type: 'expense',
        category: 'rent',
        date: new Date('2024-01-01'),
        notes: 'Monthly rent for apartment'
    },
    {
        id: 4,
        description: 'Freelance Project',
        amount: 800,
        type: 'income',
        category: 'freelance',
        date: new Date('2024-01-10'),
        notes: 'Web development project completion'
    },
    {
        id: 5,
        description: 'Electric Bill',
        amount: 120,
        type: 'expense',
        category: 'utilities',
        date: new Date('2024-01-05'),
        notes: 'Monthly electricity bill'
    },
    {
        id: 6,
        description: 'Movie Night',
        amount: 45,
        type: 'expense',
        category: 'entertainment',
        date: new Date('2024-01-12'),
        notes: 'Cinema tickets and snacks'
    },
    {
        id: 7,
        description: 'Investment Dividend',
        amount: 200,
        type: 'income',
        category: 'dividend',
        date: new Date('2024-01-08'),
        notes: 'Quarterly dividend payment'
    },
    {
        id: 8,
        description: 'Gas Station',
        amount: 60,
        type: 'expense',
        category: 'transportation',
        date: new Date('2024-01-14'),
        notes: 'Fuel for car'
    },
    {
        id: 9,
        description: 'Online Course',
        amount: 99,
        type: 'expense',
        category: 'education',
        date: new Date('2024-01-11'),
        notes: 'JavaScript advanced course'
    },
    {
        id: 10,
        description: 'Bonus Payment',
        amount: 1000,
        type: 'income',
        category: 'bonus',
        date: new Date('2024-01-20'),
        notes: 'Year-end performance bonus'
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        CATEGORIES,
        CATEGORY_ICONS,
        SAMPLE_TRANSACTIONS
    };
}
