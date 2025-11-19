// API endpoints
const API_URL = 'http://localhost:4001/api';

// Currency conversion rate (1 USD to INR)
const USD_TO_INR = 83.0; // Current approximate rate

// Format currency in Indian Rupees
function formatCurrency(amount) {
    const inrAmount = amount * USD_TO_INR;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(inrAmount);
}

// Cart functionality
let cart = [];
let cartTotal = 0;
let products = []; // Will be populated from API

// User state
let currentUser = null;

// DOM Elements
const cartButton = document.querySelector('.cart-button');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const productsGrid = document.querySelector('.products-grid');
const dealsGrid = document.querySelector('.deals-grid');
const searchInput = document.querySelector('.search-bar input');
const accountLink = document.querySelector('a[href="#account"]');
const accountModal = document.querySelector('.account-modal');
const closeModal = document.querySelector('.close-modal');
const signupLink = document.querySelector('a[href="#signup"]');
const loginLink = document.querySelector('#login-link');
const signupModal = document.querySelector('.signup-modal');
const signupForm = document.getElementById('signup-form');
const userProfile = document.querySelector('.user-profile');
const userName = document.querySelector('.user-name');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const profileBtn = document.getElementById('profile-btn');
const ordersBtn = document.getElementById('orders-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('account-form');
const guestActions = document.getElementById('guest-actions');
const profileLink = document.getElementById('profile-link');

// Fetch home data
async function fetchHomeData() {
    try {
        const response = await fetch(`${API_URL}/home`);
        const result = await response.json();

        if (result.success) {
            // Update products if available
            if (result.data.products) {
                products = result.data.products;
                displayProducts();
            }

            // Update categories if available
            if (result.data.categories) {
                const categoriesDropdown = document.querySelector('.dropdown-content');
                if (categoriesDropdown) {
                    categoriesDropdown.innerHTML = result.data.categories.map(category =>
                        `<a href="category.html?category=${category}">${category}</a>`
                    ).join('');
                }
            }
        }
    } catch (error) {
        console.error('Error fetching home data:', error);
    }
}

// Initialize the page
async function init() {
    try {
        await checkAuthStatus();
        await fetchHomeData();
        await fetchProducts();
        await fetchDeals();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing page:', error);
        showNotification('Error loading page. Please try again later.', 'error');
    }
}

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.products) {
            products = data.products.map(product => ({
                id: product._id,
                name: product.productname,
                price: product.price,
                image: product.imageUrl || 'https://via.placeholder.com/150',
                category: product.category,
                description: product.description,
                stockQuantity: product.stockQuantity,
                rating: product.rating
            }));
            displayProducts();
        } else {
            throw new Error('No products data received');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        showNotification('Error loading products. Please try again later.');
    }
}

// Fetch deals from API
async function fetchDeals() {
    try {
        const response = await fetch(`${API_URL}/products/deals`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.deals) {
            displayDeals(data.deals);
        }
    } catch (error) {
        console.error('Error fetching deals:', error);
        showNotification('Error loading deals. Please try again later.');
    }
}

// Display products in the products grid
function displayProducts() {
    if (!products.length) {
        productsGrid.innerHTML = '<p>No products available</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-content">
                <div class="product-image" onclick="viewProductDetail('${product._id || product.id}')">
                    <img src="${product.imageUrl || product.image}" alt="${product.productname || product.name}">
                </div>
                <div class="product-info">
                    <div class="product-details">
                        <h3 class="product-name" onclick="viewProductDetail('${product._id || product.id}')">${product.productname || product.name}</h3>
                        <p class="description">${product.description || ''}</p>
                        <p class="price">${formatCurrency(product.price)}</p>
                        <div class="rating">Rating: ${product.rating || 'No ratings'}</div>
                    </div>
                    <div class="product-actions">
                        <button onclick="addToCart('${product._id || product.id}', this)" class="add-to-cart" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Display deals
function displayDeals(deals) {
    if (!deals.length) {
        dealsGrid.innerHTML = '<p>No deals available</p>';
        return;
    }

    dealsGrid.innerHTML = deals.map(product => `
        <div class="deal-card">
            <div class="product-content">
                <div class="deal-image" onclick="viewProductDetail('${product._id}')">
                    <img src="${product.imageUrl}" alt="${product.productname}">
                </div>
                <div class="product-info">
                    <div class="product-details">
                        <h3 class="deal-name" onclick="viewProductDetail('${product._id}')">${product.productname}</h3>
                        <p class="description">${product.description || ''}</p>
                        <p class="original-price">${formatCurrency(product.originalPrice)}</p>
                        <p class="deal-price">${formatCurrency(product.price)}</p>
                    </div>
                    <div class="product-actions">
                        <button onclick="addToCart('${product._id}', this)" class="add-to-cart" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Store current page and redirect to login
function redirectToLogin() {
    // Store current URL for redirect after login
    sessionStorage.setItem('redirectUrl', window.location.href);
    window.location.href = 'auth.html';
}

// Add product to cart
async function addToCart(productId, buttonElement = null) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    console.log('DEBUG addToCart:', { userId, productId }); // Debug log

    // Find the button that was clicked
    const button = buttonElement || document.querySelector(`button[onclick*="${productId}"]`);

    try {
        console.log('AddToCart - Current auth state:', {
            userId,
            hasToken: !!token,
            productId
        });

        if (!userId || !token) {
            console.log('No auth data found, redirecting to login');
            showNotification('Please login to add items to cart', 'error');
            sessionStorage.setItem('redirectUrl', window.location.href);
            window.location.href = 'auth.html';
            return;
        }

        // Show loading state on button
        if (button) {
            button.classList.add('loading');
            button.innerHTML = '<i class="fas fa-spinner"></i><span>Adding...</span>';
        }
        showLoading();

        // Add to cart
        const response = await fetch(`${API_URL}/cart/${userId}/${productId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: 1
            })
        });

        const data = await response.json();
        console.log('Add to cart response:', data);

        if (response.ok) {
            // Show success state on button
            if (button) {
                button.classList.remove('loading');
                button.classList.add('success');
                button.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
            }

            showNotification('Product added to cart successfully!', 'success');
            await updateCartCount();

            // Add bounce animation to cart button
            const cartButton = document.querySelector('.cart-button');
            if (cartButton) {
                cartButton.classList.add('bounce');
                setTimeout(() => {
                    cartButton.classList.remove('bounce');
                }, 600);
            }

            // Reset button after 2 seconds
            if (button) {
                setTimeout(() => {
                    button.classList.remove('success');
                    button.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>';
                }, 2000);
            }

            if (confirm('Product added to cart! Would you like to view your cart?')) {
                window.location.href = 'cart.html';
            }
        } else {
            // Reset button on error
            if (button) {
                button.classList.remove('loading');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>';
            }

            if (response.status === 401) {
                console.log('Auth failed, clearing storage');
                localStorage.clear();
                showNotification('Session expired. Please login again', 'error');
                sessionStorage.setItem('redirectUrl', window.location.href);
                window.location.href = 'auth.html';
            } else {
                showNotification(data.message || 'Failed to add product to cart', 'error');
            }
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        // Reset button on error
        if (button) {
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>';
        }
        showNotification('Error adding product to cart', 'error');
    } finally {
        hideLoading();
    }
}

// Update cart count
async function updateCartCount() {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        console.log('UpdateCartCount - Current auth state:', {
            userId,
            hasToken: !!token
        });

        if (!userId || !token) {
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = '0';
            });
            return;
        }

        const response = await fetch(`${API_URL}/cart/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Cart count response status:', response.status);

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Auth failed in updateCartCount');
                localStorage.clear();
                window.location.href = 'auth.html';
                return;
            }
            throw new Error('Failed to fetch cart count');
        }

        const data = await response.json();
        console.log('Cart count data:', data);

        if (data.carts) {
            const totalItems = data.carts.reduce((sum, item) => sum + item.quantity, 0);
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = totalItems.toString();
            });
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Check authentication status
async function checkAuthStatus() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    console.log('Checking auth status:', {
        userId,
        hasToken: !!token
    });

    if (!userId || !token) {
        console.log('No auth data found');
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log('Auth check failed, clearing storage');
            localStorage.clear();
            return false;
        }

        const userData = await response.json();
        console.log('Auth check successful:', userData);
        return true;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page initializing...');
    const isAuthenticated = await checkAuthStatus();

    if (isAuthenticated) {
        console.log('User is authenticated, updating cart');
        await updateCartCount();
    } else {
        console.log('User is not authenticated');
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = '0';
        });
    }
});

// Handle login
async function handleLogin(email, password) {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // Store user data in localStorage consistently
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id || data.user._id);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userName', data.user.username || data.user.fullName);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Verify token immediately after login
            const verifyResponse = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });

            if (!verifyResponse.ok) {
                throw new Error('Failed to verify authentication');
            }

            const userData = await verifyResponse.json();

            // Update UI
            updateUserUI(userData);
            showNotification('Login successful!', 'success');

            // Close modal if exists
            const accountModal = document.querySelector('.account-modal');
            if (accountModal) {
                accountModal.style.display = 'none';
            }

            // Update cart count
            await updateCartCount();

            // Redirect to previous page or home
            const redirectUrl = sessionStorage.getItem('redirectUrl') || 'index.html';
            sessionStorage.removeItem('redirectUrl');
            window.location.href = redirectUrl;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message, 'error');
        // Clear any partial data on login failure
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } finally {
        hideLoading();
    }
}

// Handle signup
async function handleSignup(fullname, email, password) {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullname, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created successfully! Please login.', 'success');
            // Switch to login modal
            const signupModal = document.querySelector('.signup-modal');
            const accountModal = document.querySelector('.account-modal');
            if (signupModal && accountModal) {
                signupModal.style.display = 'none';
                accountModal.style.display = 'block';
            }
            // Reset form
            signupForm.reset();
        } else {
            throw new Error(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Update UI based on user state
function updateUserUI(userData) {
    if (guestActions && userProfile && userName) {
        // Hide guest actions, show user profile
        guestActions.style.display = 'none';
        userProfile.style.display = 'flex';
        // Update user name
        userName.textContent = userData.fullName || userData.fullname || userData.username || userData.email;
        // Update profile link in navbar
        if (profileLink) {
            profileLink.style.display = 'inline-block';
            profileLink.textContent = userData.fullName || userData.fullname || userData.username || 'Profile';
        }
        // Update dropdown details
        const dropdown = userProfile.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.innerHTML = `
                <div style="padding: 1rem; border-bottom: 1px solid #eee;">
                    <strong>${userData.fullName || userData.fullname || userData.username || ''}</strong><br>
                    <small>${userData.email || ''}</small><br>
                    <small>${userData.username ? 'Username: ' + userData.username : ''}</small>
                </div>
                <a href="#profile"><i class="fas fa-user"></i> Profile</a>
                <a href="#orders"><i class="fas fa-shopping-bag"></i> Orders</a>
                <a href="#settings"><i class="fas fa-cog"></i> Settings</a>
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
            // Add logout event
            const logoutBtn = dropdown.querySelector('#logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
        }
        currentUser = userData;
    }
}

// Show guest UI
function showGuestUI() {
    if (guestActions && userProfile) {
        guestActions.style.display = 'flex';
        userProfile.style.display = 'none';
        if (profileLink) {
            profileLink.style.display = 'none';
        }
    }
}

// Handle logout
function logout() {
    // Clear all stored data
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;

    // Update UI
    showGuestUI();

    // Show notification
    showNotification('Logged in successfully', 'info');

    // Reset cart count
    document.querySelector('.cart-count').textContent = '0';
}

// Show loading state
function showLoading() {
    const button = document.querySelector('.auth-button');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<div class="spinner"></div> Loading...';
    }
}

// Hide loading state
function hideLoading() {
    const button = document.querySelector('.auth-button');
    if (button) {
        button.disabled = false;
        button.innerHTML = 'Login';
    }
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

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate to cart page instead of opening sidebar
            window.location.href = 'cart.html';
        });
    }

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Search functionality
    const searchButton = document.querySelector('.search-bar button');

    // Search on input (real-time search with suggestions)
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length >= 1) {
            showSearchSuggestions(searchTerm);
        } else {
            hideSearchSuggestions();
            displayProducts();
        }

        if (searchTerm.length >= 2) {
            await performSearch(searchTerm);
        }
    });

    // Search on button click
    if (searchButton) {
        searchButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length >= 1) {
                await performSearch(searchTerm);
            }
        });
    }

    // Search on Enter key press
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length >= 1) {
                await performSearch(searchTerm);
            }
        }
    });

    // Account modal
    accountLink.addEventListener('click', (e) => {
        e.preventDefault();
        accountModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            accountModal.style.display = 'none';
        }
    });

    // Show signup modal
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'block';
        accountModal.style.display = 'none';
    });

    // Show login modal
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        accountModal.style.display = 'block';
        signupModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (e.target === accountModal) {
            accountModal.style.display = 'none';
        }
    });

    // Close modals when clicking close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            signupModal.style.display = 'none';
            accountModal.style.display = 'none';
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            await handleLogin(email, password);
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = e.target.querySelector('#fullname').value;
            const email = e.target.querySelector('#email').value;
            const password = e.target.querySelector('#password').value;
            const confirmPassword = e.target.querySelector('#confirm-password').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            await handleSignup(fullname, email, password);
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Profile button
    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // TODO: Implement profile page navigation
        showNotification('Profile page coming soon!', 'info');
    });

    // Orders button
    ordersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // TODO: Implement orders page navigation
        showNotification('Orders page coming soon!', 'info');
    });

    // Login button
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        accountModal.style.display = 'block';
    });

    // Signup button
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'block';
    });

    // User profile dropdown
    if (userProfile) {
        userProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            const dropdown = userProfile.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
        // Hide dropdown when clicking outside
        window.addEventListener('click', function () {
            const dropdown = userProfile.querySelector('.user-dropdown');
            if (dropdown) dropdown.style.display = 'none';
        });
    }
}

// Perform search function
async function performSearch(searchTerm) {
    try {
        showLoadingSpinner();
        const response = await fetch(`${API_URL}/products/search?query=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
            throw new Error('Search request failed');
        }

        const data = await response.json();
        hideLoadingSpinner();

        if (data.products && data.products.length > 0) {
            displayFilteredProducts(data.products);
            showSearchResults(searchTerm, data.products.length);
        } else {
            displayNoResults(searchTerm);
        }
    } catch (error) {
        console.error('Error searching products:', error);
        hideLoadingSpinner();
        showNotification('Error searching products. Please try again.');
        displayProducts(); // Fallback to showing all products
    }
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    if (!filteredProducts || filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-content">
                <div class="product-image" onclick="viewProductDetail('${product._id || product.id}')">
                    <img src="${product.imageUrl || product.image}" alt="${product.productname || product.name}">
                </div>
                <div class="product-info">
                    <div class="product-details">
                        <h3 class="product-name" onclick="viewProductDetail('${product._id || product.id}')">${product.productname || product.name}</h3>
                        <p class="description">${product.description || ''}</p>
                        <p class="price">${formatCurrency(product.price)}</p>
                        <div class="rating">Rating: ${product.rating || 'No ratings'}</div>
                    </div>
                    <div class="product-actions">
                        <button onclick="addToCart('${product._id || product.id}', this)" class="add-to-cart" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show search results info
function showSearchResults(searchTerm, resultCount) {
    // Remove existing search info
    const existingInfo = document.querySelector('.search-results-info');
    if (existingInfo) {
        existingInfo.remove();
    }

    // Add search results info
    const searchInfo = document.createElement('div');
    searchInfo.className = 'search-results-info';
    searchInfo.innerHTML = `
        <div class="search-info">
            <p>Found ${resultCount} result${resultCount !== 1 ? 's' : ''} for "${searchTerm}"</p>
            <button onclick="clearSearch()" class="clear-search-btn">
                <i class="fas fa-times"></i> Clear Search
            </button>
        </div>
    `;

    const productsSection = document.querySelector('#products');
    if (productsSection) {
        productsSection.insertBefore(searchInfo, productsGrid);
    }
}

// Display no results message
function displayNoResults(searchTerm) {
    // Remove existing search info
    const existingInfo = document.querySelector('.search-results-info');
    if (existingInfo) {
        existingInfo.remove();
    }

    productsGrid.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Sorry, we couldn't find any products matching "${searchTerm}"</p>
            <p>Try searching with different keywords or browse our categories.</p>
            <button onclick="clearSearch()" class="clear-search-btn">View All Products</button>
        </div>
    `;
}

// Clear search function
function clearSearch() {
    searchInput.value = '';
    const searchInfo = document.querySelector('.search-results-info');
    if (searchInfo) {
        searchInfo.remove();
    }
    displayProducts();
}

// Show loading spinner
function showLoadingSpinner() {
    productsGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Searching products...</p>
        </div>
    `;
}

// Hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Show search suggestions
function showSearchSuggestions(searchTerm) {
    if (!products || products.length === 0) return;

    const suggestions = products.filter(product => {
        const productName = (product.productname || product.name || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const term = searchTerm.toLowerCase();

        return productName.includes(term) ||
               category.includes(term) ||
               description.includes(term);
    }).slice(0, 5); // Limit to 5 suggestions

    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }

    suggestionsContainer.innerHTML = suggestions.map(product => `
        <div class="suggestion-item" onclick="viewProductDetail('${product._id || product.id}')">
            <img src="${product.imageUrl || product.image}" alt="${product.productname || product.name}">
            <div class="suggestion-content">
                <div class="suggestion-name">${product.productname || product.name}</div>
                <div class="suggestion-category">${product.category}</div>
                <div class="suggestion-price">${formatCurrency(product.price)}</div>
            </div>
            <div class="suggestion-action">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    `).join('');

    suggestionsContainer.style.display = 'block';
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Select suggestion
function selectSuggestion(productName) {
    searchInput.value = productName;
    hideSearchSuggestions();
    performSearch(productName);
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    const searchBar = document.querySelector('.search-bar');
    if (searchBar && !searchBar.contains(e.target)) {
        hideSearchSuggestions();
    }
});

// View product detail function
function viewProductDetail(productId) {
    if (!productId) {
        console.error('Product ID is required');
        return;
    }

    // Navigate to product detail page with product ID
    window.location.href = `product-detail.html?id=${productId}`;
}

// Handle home link click
async function handleHomeClick() {
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add event listener for home link
document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleHomeClick();
        });
    }
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);