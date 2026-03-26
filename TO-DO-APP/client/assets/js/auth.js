// Authentication functions for the To-Do List application

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Toggle between login and register forms
 * @param {Event} event - Click event
 */
function toggleAuthForm(event) {
  event.preventDefault();
  const loginContainer = document.getElementById('login-form-container');
  const registerContainer = document.getElementById('register-form-container');

  loginContainer.classList.toggle('active');
  registerContainer.classList.toggle('active');

  // Clear error messages
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('register-error').style.display = 'none';

  // Clear forms
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
}

/**
 * Show error message
 * @param {string} formType - 'login' or 'register'
 * @param {string} message - Error message
 */
function showAuthError(formType, message) {
  const errorEl = document.getElementById(`${formType}-error`);
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
}

/**
 * Handle login form submission
 * @param {Event} event - Form submission event
 */
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    showAuthError('login', 'Please enter username and password');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError('login', data.error || 'Login failed');
      return;
    }

    // Store token and user info in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('username', data.username);

    // Redirect to todo app
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Login error:', error);
    showAuthError('login', `Error: ${error.message}`);
  }
});

/**
 * Handle registration form submission
 * @param {Event} event - Form submission event
 */
document.getElementById('register-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    showAuthError('register', 'Please fill in all fields');
    return;
  }

  if (username.length < 3) {
    showAuthError('register', 'Username must be at least 3 characters');
    return;
  }

  if (password.length < 6) {
    showAuthError('register', 'Password must be at least 6 characters');
    return;
  }

  if (password !== confirmPassword) {
    showAuthError('register', 'Passwords do not match');
    return;
  }

  // Simple email validation
  if (!email.includes('@')) {
    showAuthError('register', 'Please enter a valid email');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError('register', data.error || 'Registration failed');
      return;
    }

    // Show success message and switch to login
    showAuthError('register', 'Account created! Please login.');
    document.getElementById('register-error').style.color = 'rgba(100, 200, 100, 0.95)';
    
    setTimeout(() => {
      toggleAuthForm({ preventDefault: () => {} });
      document.getElementById('login-username').focus();
    }, 1500);
  } catch (error) {
    console.error('Registration error:', error);
    showAuthError('register', `Error: ${error.message}`);
  }
});

/**
 * Check if user is already logged in
 */
function checkAuth() {
  const token = localStorage.getItem('token');
  if (token && window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
  }
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
