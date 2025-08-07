// Login & Signup Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form switching
    initializeFormSwitching();
    
    // Initialize form interactions
    initializeFormInteractions();
    
    // Initialize password strength checker
    initializePasswordStrength();
    
    // Initialize form submissions
    initializeFormSubmissions();
});

// Form switching functionality
function initializeFormSwitching() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetForm = this.getAttribute('data-form');
            
            // Remove active class from all buttons and forms
            toggleBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked button and corresponding form
            this.classList.add('active');
            document.getElementById(targetForm + '-form').classList.add('active');
        });
    });
}

// Switch to signup form
function switchToSignup() {
    document.querySelector('[data-form="signup"]').click();
}

// Switch to login form
function switchToLogin() {
    document.querySelector('[data-form="login"]').click();
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentNode.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        toggleBtn.className = 'fa-solid fa-eye';
    }
}

// Form interactions
function initializeFormInteractions() {
    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            showNotification(`${provider} authentication would be handled here`, 'info');
        });
    });
    
    // Forgot password link
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
}

// Password strength checker
function initializePasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
}

function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let feedback = 'Very Weak';
    let color = '#dc3545';
    
    // Check length
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength += 20;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength += 20;
    
    // Check for numbers
    if (/\d/.test(password)) strength += 15;
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
    
    // Determine feedback and color
    if (strength <= 30) {
        feedback = 'Very Weak';
        color = '#dc3545';
    } else if (strength <= 50) {
        feedback = 'Weak';
        color = '#fd7e14';
    } else if (strength <= 70) {
        feedback = 'Good';
        color = '#ffc107';
    } else if (strength <= 90) {
        feedback = 'Strong';
        color = '#20c997';
    } else {
        feedback = 'Very Strong';
        color = '#28a745';
    }
    
    strengthBar.style.width = strength + '%';
    strengthBar.style.background = color;
    strengthText.textContent = feedback;
    strengthText.style.color = color;
}

// Form submissions
function initializeFormSubmissions() {
    // Login form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Signup form
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
}

// Handle login
function handleLogin() {
    const submitBtn = document.querySelector('.login-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success and redirect
        showLoginSuccessModal();
    }, 2000);
}

// Handle signup
function handleSignup() {
    const submitBtn = document.querySelector('.signup-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate signup process
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success and redirect
        showSignupSuccessModal();
    }, 2500);
}

// Login success modal
function showLoginSuccessModal() {
    showSuccessModal(
        'Welcome Back!',
        'You have successfully signed into your GIGACHAD account.',
        'Continue to Dashboard',
        '../gym detail/gym_detail.html'
    );
}

// Signup success modal
function showSignupSuccessModal() {
    showSuccessModal(
        'Account Created Successfully!',
        'Welcome to GIGACHAD! Your fitness journey starts now.',
        'Explore Gyms',
        '../homepage/homepage.html'
    );
}

// Generic success modal
function showSuccessModal(title, message, buttonText, redirectUrl) {
    const modal = document.createElement('div');
    modal.className = 'success-modal-overlay';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-header">
                <div class="success-icon">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
            
            <div class="success-actions">
                <button class="btn-primary" onclick="window.location.href='${redirectUrl}'">
                    <i class="fa-solid fa-arrow-right"></i>
                    ${buttonText}
                </button>
                <button class="btn-secondary" onclick="closeSuccessModal()">
                    <i class="fa-solid fa-xmark"></i>
                    Stay Here
                </button>
            </div>
        </div>
    `;
    
    // Add styles
    const styles = `
        <style>
        .success-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-modal-content {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            width: 90%;
            animation: bounceIn 0.5s ease;
        }
        
        .success-header {
            margin-bottom: 2rem;
        }
        
        .success-icon {
            font-size: 5rem;
            color: #28a745;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
        }
        
        .success-header h2 {
            color: #1a2e40;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .success-header p {
            color: #6c757d;
            font-size: 1.4rem;
            line-height: 1.5;
        }
        
        .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .success-actions button {
            padding: 1.5rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.4rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .btn-primary {
            background: #1a2e40;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2c4a5e;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #1a2e40;
            border: 2px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        </style>
    `;
    
    if (!document.querySelector('.auth-modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.className = 'auth-modal-styles';
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Auto redirect after 5 seconds
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 5000);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Forgot password modal
function showForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'forgot-modal-overlay';
    modal.innerHTML = `
        <div class="forgot-modal-content">
            <div class="modal-header">
                <h3>Reset Your Password</h3>
                <button class="modal-close" onclick="closeForgotModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form class="forgot-form">
                    <div class="form-group">
                        <label for="forgot-email">Email Address</label>
                        <div class="input-group">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" id="forgot-email" placeholder="Enter your email" required>
                        </div>
                    </div>
                    <button type="submit" class="submit-btn">
                        <i class="fa-solid fa-paper-plane"></i>
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // Add styles for forgot modal (reuse existing modal styles)
    const forgotStyles = `
        <style>
        .forgot-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .forgot-modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 450px;
            overflow: hidden;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #1a2e40;
            font-size: 2rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #6c757d;
            padding: 0.5rem;
            border-radius: 50%;
        }
        
        .modal-close:hover {
            background: #f8f9fa;
            color: #1a2e40;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .modal-body p {
            margin-bottom: 1.5rem;
            color: #6c757d;
            line-height: 1.5;
        }
        </style>
    `;
    
    if (!document.querySelector('.forgot-modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.className = 'forgot-modal-styles';
        styleElement.innerHTML = forgotStyles;
        document.head.appendChild(styleElement);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    const forgotForm = modal.querySelector('.forgot-form');
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        showNotification(`Password reset link sent to ${email}`, 'success');
        closeForgotModal();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeForgotModal();
        }
    });
}

function closeForgotModal() {
    const modal = document.querySelector('.forgot-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-solid fa-${getIconForType(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 130px;
        right: 20px;
        background: ${getColorForType(type)};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getIconForType(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getColorForType(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

// Add notification animations
const notificationStyles = `
    <style>
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    </style>
`;

if (!document.querySelector('.notification-styles')) {
    const styleElement = document.createElement('div');
    styleElement.className = 'notification-styles';
    styleElement.innerHTML = notificationStyles;
    document.head.appendChild(styleElement);
}
