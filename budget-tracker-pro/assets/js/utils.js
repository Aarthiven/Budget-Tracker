/**
 * Budget Tracker Pro - Utility Functions
 * Contains helper functions used throughout the application
 */

// Utility object to hold all utility functions
const Utils = {
    
    /**
     * Format currency amount
     * @param {number} amount - The amount to format
     * @param {string} currency - Currency code (default: USD)
     * @param {string} locale - Locale for formatting (default: en-US)
     * @returns {string} Formatted currency string
     */
    formatCurrency(amount, currency = CONFIG.CURRENCY.CODE, locale = CONFIG.CURRENCY.LOCALE) {
        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        } catch (error) {
            console.warn('Currency formatting failed, using fallback:', error);
            return `${CONFIG.CURRENCY.SYMBOL}${amount.toFixed(2)}`;
        }
    },

    /**
     * Format date for display
     * @param {Date|string} date - Date to format
     * @param {string} format - Format type ('display', 'input', 'chart')
     * @returns {string} Formatted date string
     */
    formatDate(date, format = 'display') {
        const dateObj = new Date(date);
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid Date';
        }

        const options = {
            display: { year: 'numeric', month: 'short', day: 'numeric' },
            input: { year: 'numeric', month: '2-digit', day: '2-digit' },
            chart: { year: 'numeric', month: 'short' },
            long: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            }
        };

        if (format === 'input') {
            return dateObj.toISOString().split('T')[0];
        }

        return dateObj.toLocaleDateString(CONFIG.CURRENCY.LOCALE, options[format] || options.display);
    },

    /**
     * Get relative time string (e.g., "2 days ago")
     * @param {Date|string} date - Date to compare
     * @returns {string} Relative time string
     */
    getRelativeTime(date) {
        const now = new Date();
        const dateObj = new Date(date);
        const diffInSeconds = Math.floor((now - dateObj) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }

        return 'Just now';
    },

    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate number input
     * @param {string|number} value - Value to validate
     * @param {number} min - Minimum value (optional)
     * @param {number} max - Maximum value (optional)
     * @returns {boolean} True if valid number
     */
    isValidNumber(value, min = null, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    },

    /**
     * Sanitize HTML string
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Get category info by value
     * @param {string} categoryValue - Category value
     * @param {string} type - Transaction type ('income' or 'expense')
     * @returns {Object} Category information
     */
    getCategoryInfo(categoryValue, type) {
        const categories = CATEGORIES[type] || [];
        return categories.find(cat => cat.value === categoryValue) || {
            value: categoryValue,
            label: categoryValue,
            icon: 'fas fa-question'
        };
    },

    /**
     * Get category icon
     * @param {string} categoryValue - Category value
     * @returns {string} Category icon emoji
     */
    getCategoryIcon(categoryValue) {
        return CATEGORY_ICONS[categoryValue] || '📝';
    },

    /**
     * Calculate percentage
     * @param {number} value - Value
     * @param {number} total - Total value
     * @returns {number} Percentage
     */
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    /**
     * Format percentage
     * @param {number} percentage - Percentage value
     * @returns {string} Formatted percentage string
     */
    formatPercentage(percentage) {
        return `${percentage.toFixed(1)}%`;
    },

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${this.sanitizeHtml(message)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 16px;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add to document
        document.body.appendChild(notification);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
    },

    /**
     * Get notification icon based on type
     * @param {string} type - Notification type
     * @returns {string} Icon class
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    /**
     * Local storage helper functions
     */
    storage: {
        /**
         * Set item in localStorage
         * @param {string} key - Storage key
         * @param {any} value - Value to store
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        },

        /**
         * Get item from localStorage
         * @param {string} key - Storage key
         * @param {any} defaultValue - Default value if key doesn't exist
         * @returns {any} Stored value or default
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Failed to read from localStorage:', error);
                return defaultValue;
            }
        },

        /**
         * Remove item from localStorage
         * @param {string} key - Storage key
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Failed to remove from localStorage:', error);
            }
        },

        /**
         * Clear all localStorage
         */
        clear() {
            try {
                localStorage.clear();
            } catch (error) {
                console.error('Failed to clear localStorage:', error);
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
