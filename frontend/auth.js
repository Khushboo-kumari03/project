// API endpoint
const API_URL = 'http://localhost:4001/api';

// DOM Elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// Toggle forms
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = '';
    signupForm.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.style.display = '';
    loginForm.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

// Login logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    successMessage.textContent = '';
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showError('All fields are required');
        return;
    }
    
    try {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner"></div> Logging in...';
        
        console.log('Attempting login with:', { email }); // Debug log
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        if (response.ok && data.token) {
            // Store user data in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id || data.user._id);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userName', data.user.username || data.user.fullName);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Verify stored data
            console.log('Stored user data:', {
                userId: localStorage.getItem('userId'),
                token: localStorage.getItem('token'),
                userName: localStorage.getItem('userName')
            });
            
            showSuccess('Login successful! Redirecting...');
            loginForm.reset();
            
            // Get redirect URL or default to index.html
            const redirectUrl = sessionStorage.getItem('redirectUrl') || 'index.html';
            sessionStorage.removeItem('redirectUrl');
            
            // Redirect after success message
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);
        } else {
            showError(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred. Please try again later.');
    } finally {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Login';
    }
});

// Signup logic
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    successMessage.textContent = '';
    const fullname = document.getElementById('signup-fullname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    if (!fullname || !email || !password || !confirmPassword) {
        showError('All fields are required');
        return;
    }
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    try {
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            showSuccess('Account created successfully! Redirecting to login...');
            signupForm.reset();
            setTimeout(() => {
                loginTab.click();
            }, 1500);
        } else {
            showError(data.message || 'Failed to create account');
        }
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    } catch (error) {
        showError('An error occurred. Please try again later.');
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Input validation (optional, can be expanded)
function validateInput(input, type) {
    const value = input.value.trim();
    switch(type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                return false;
            }
            break;
        case 'password':
            if (value.length < 6) {
                input.classList.add('error');
                return false;
            }
            break;
        case 'fullname':
            if (value.length < 2) {
                input.classList.add('error');
                return false;
            }
            break;
    }
    input.classList.remove('error');
    return true;
}

document.getElementById('login-email').addEventListener('input', e => validateInput(e.target, 'email'));
document.getElementById('login-password').addEventListener('input', e => validateInput(e.target, 'password'));
document.getElementById('signup-fullname').addEventListener('input', e => validateInput(e.target, 'fullname'));
document.getElementById('signup-email').addEventListener('input', e => validateInput(e.target, 'email'));
document.getElementById('signup-password').addEventListener('input', e => validateInput(e.target, 'password'));
document.getElementById('signup-confirm-password').addEventListener('input', e => {
    const password = document.getElementById('signup-password').value;
    if (e.target.value !== password) {
        e.target.classList.add('error');
    } else {
        e.target.classList.remove('error');
    }
});

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html';
    }
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push('Password should be at least 8 characters long');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include at least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include at least one lowercase letter');
    }

    // Number check
    if (/[0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include at least one number');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include at least one special character');
    }

    return { strength, feedback };
}

// Update password strength indicator
function updatePasswordStrength(password) {
    const { strength, feedback } = checkPasswordStrength(password);
    
    strengthBar.className = 'strength-bar';
    if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Medium password';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

// Show loading state
function showLoading() {
    const submitButton = document.querySelector('.auth-button');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <div class="spinner"></div>
        <span>Please wait...</span>
    `;
    submitButton.dataset.originalText = originalText;
}

// Hide loading state
function hideLoading() {
    const submitButton = document.querySelector('.auth-button');
    submitButton.disabled = false;
    submitButton.innerHTML = submitButton.dataset.originalText;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Check for remembered user
function checkRememberedUser() {
    if (localStorage.getItem('rememberMe') === 'true' && localStorage.getItem('token')) {
        const email = localStorage.getItem('rememberedEmail');
        if (email) {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = email;
                const rememberCheckbox = document.querySelector('input[name="remember"]');
                if (rememberCheckbox) {
                    rememberCheckbox.checked = true;
                }
            }
        }
    }
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    
    // Check for remembered user on page load
    checkRememberedUser();
    
    // Store email when remember me is checked
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    const emailInput = document.getElementById('email');
    
    if (rememberCheckbox && emailInput) {
        rememberCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        });
    }
}

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
    });
}

if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', (e) => {
        const password = passwordInput.value;
        if (e.target.value !== password) {
            e.target.setCustomValidity('Passwords do not match');
        } else {
            e.target.setCustomValidity('');
        }
    });
}

// Social login handlers
document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = e.target.classList.contains('google') ? 'google' : 'facebook';
        showNotification(`${provider} login coming soon!`, 'info');
    });
}); 