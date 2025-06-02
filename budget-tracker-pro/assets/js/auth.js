/**
 * Budget Tracker Pro - Authentication Module
 * Handles user authentication and session management
 */

const Auth = {
    // Current user state
    currentUser: null,
    isAuthenticated: false,

    /**
     * Initialize authentication module
     */
    init() {
        this.checkExistingSession();
        this.setupEventListeners();
    },

    /**
     * Setup event listeners for authentication
     */
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Enter key on password field
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin(e);
                }
            });
        }
    },

    /**
     * Check for existing session
     */
    checkExistingSession() {
        const lastLogin = Utils.storage.get(CONFIG.STORAGE_KEYS.LAST_LOGIN);
        
        if (lastLogin) {
            const loginTime = new Date(lastLogin);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            // Auto-login if less than 24 hours
            if (hoursSinceLogin < 24) {
                this.currentUser = {
                    email: CONFIG.DEMO_EMAIL,
                    name: 'Demo User',
                    loginTime: loginTime
                };
                this.isAuthenticated = true;
                this.showDashboard();
                return;
            }
        }
        
        this.showLogin();
    },

    /**
     * Handle login form submission
     * @param {Event} event - Form submission event
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginBtn = document.querySelector('.login-btn');
        const errorDiv = document.getElementById('loginError');
        
        // Validate inputs
        if (!email || !password) {
            this.showLoginError('Please enter both email and password');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            this.showLoginError('Please enter a valid email address');
            return;
        }

        // Show loading state
        this.setLoginLoading(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check credentials
            if (email === CONFIG.DEMO_EMAIL && password === CONFIG.DEMO_PASSWORD) {
                await this.loginSuccess(email);
            } else {
                this.loginFailure('Invalid credentials! Use demo@example.com / demo123');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.loginFailure('An error occurred during login. Please try again.');
        } finally {
            this.setLoginLoading(false);
        }
    },

    /**
     * Handle successful login
     * @param {string} email - User email
     */
    async loginSuccess(email) {
        const now = new Date();
        
        // Set user data
        this.currentUser = {
            email: email,
            name: 'Demo User',
            loginTime: now
        };
        this.isAuthenticated = true;
        
        // Save login time
        Utils.storage.set(CONFIG.STORAGE_KEYS.LAST_LOGIN, now.toISOString());
        
        // Hide error message
        this.hideLoginError();
        
        // Show success feedback
        Utils.showNotification('Login successful! Welcome back.', 'success', 2000);
        
        // Transition to dashboard
        await this.transitionToDashboard();
    },

    /**
     * Handle login failure
     * @param {string} message - Error message
     */
    loginFailure(message) {
        this.showLoginError(message);
        
        // Clear password field
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.value = '';
            passwordField.focus();
        }
        
        // Shake animation for login card
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginCard.style.animation = '';
            }, 500);
        }
    },

    /**
     * Show login error message
     * @param {string} message - Error message
     */
    showLoginError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => this.hideLoginError(), 5000);
        }
    },

    /**
     * Hide login error message
     */
    hideLoginError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    },

    /**
     * Set login button loading state
     * @param {boolean} loading - Loading state
     */
    setLoginLoading(loading) {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            if (loading) {
                loginBtn.disabled = true;
                loginBtn.classList.add('loading');
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            } else {
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        }
    },

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        const toggleBtn = document.querySelector('.toggle-password i');
        
        if (passwordField && toggleBtn) {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleBtn.className = 'fas fa-eye-slash';
            } else {
                passwordField.type = 'password';
                toggleBtn.className = 'fas fa-eye';
            }
        }
    },

    /**
     * Transition from login to dashboard
     */
    async transitionToDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen && dashboard) {
            // Fade out login screen
            loginScreen.style.transition = 'opacity 0.5s ease-out';
            loginScreen.style.opacity = '0';
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Hide login and show dashboard
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            
            // Fade in dashboard
            dashboard.style.opacity = '0';
            dashboard.style.transition = 'opacity 0.5s ease-in';
            
            setTimeout(() => {
                dashboard.style.opacity = '1';
            }, 50);
            
            // Initialize dashboard
            if (typeof Dashboard !== 'undefined') {
                Dashboard.init();
            }
        }
    },

    /**
     * Show login screen
     */
    showLogin() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.style.opacity = '1';
        }
        
        if (dashboard) {
            dashboard.classList.add('hidden');
        }
        
        // Focus on email field
        setTimeout(() => {
            const emailField = document.getElementById('email');
            if (emailField) {
                emailField.focus();
            }
        }, 100);
    },

    /**
     * Show dashboard
     */
    showDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen) {
            loginScreen.classList.add('hidden');
        }
        
        if (dashboard) {
            dashboard.classList.remove('hidden');
            dashboard.style.opacity = '1';
        }
        
        // Initialize dashboard
        if (typeof Dashboard !== 'undefined') {
            Dashboard.init();
        }
    },

    /**
     * Logout user
     */
    async logout() {
        // Confirm logout
        if (!confirm('Are you sure you want to logout?')) {
            return;
        }
        
        try {
            // Clear user data
            this.currentUser = null;
            this.isAuthenticated = false;
            
            // Clear stored session
            Utils.storage.remove(CONFIG.STORAGE_KEYS.LAST_LOGIN);
            
            // Show notification
            Utils.showNotification('You have been logged out successfully.', 'info', 2000);
            
            // Transition to login
            await this.transitionToLogin();
            
        } catch (error) {
            console.error('Logout error:', error);
            Utils.showNotification('An error occurred during logout.', 'error');
        }
    },

    /**
     * Transition from dashboard to login
     */
    async transitionToLogin() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen && dashboard) {
            // Fade out dashboard
            dashboard.style.transition = 'opacity 0.5s ease-out';
            dashboard.style.opacity = '0';
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Hide dashboard and show login
            dashboard.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            
            // Reset login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.reset();
                // Set demo credentials
                document.getElementById('email').value = CONFIG.DEMO_EMAIL;
                document.getElementById('password').value = CONFIG.DEMO_PASSWORD;
            }
            
            // Hide any error messages
            this.hideLoginError();
            
            // Fade in login screen
            loginScreen.style.opacity = '0';
            loginScreen.style.transition = 'opacity 0.5s ease-in';
            
            setTimeout(() => {
                loginScreen.style.opacity = '1';
            }, 50);
        }
    },

    /**
     * Get current user info
     * @returns {Object|null} Current user object
     */
    getCurrentUser() {
        return this.currentUser;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
};

// Global logout function for HTML onclick
function logout() {
    Auth.logout();
}

// Global password toggle function for HTML onclick
function togglePassword() {
    Auth.togglePasswordVisibility();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
