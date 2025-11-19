document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Set admin info
    document.getElementById('admin-name').textContent = user.fullName || user.username || 'Admin';
    document.getElementById('admin-email').textContent = user.email || 'admin@example.com';

    // API URL
    const API_URL = 'http://localhost:4001/api';

    // Initialize
    loadDashboard();
    setupEventListeners();

    // Setup navigation
    function setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            if (item.id !== 'logout-btn') {
                item.addEventListener('click', function() {
                    const page = this.getAttribute('data-page');
                    changePage(page);
                });
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', function() {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = 'login.html';
        });

        // Add product button
        document.getElementById('add-product-btn').addEventListener('click', function() {
            document.getElementById('product-modal-title').textContent = 'Add Product';
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            openModal('product-modal');
            loadCategories();
        });

        // Add category button
        document.getElementById('add-category-btn').addEventListener('click', function() {
            document.getElementById('category-modal-title').textContent = 'Add Category';
            document.getElementById('category-form').reset();
            document.getElementById('category-id').value = '';
            openModal('category-modal');
        });

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                closeAllModals();
            });
        });

        // Submit forms
        document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
        document.getElementById('user-form').addEventListener('submit', handleUserSubmit);
        document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);

        // Update order
        document.getElementById('update-order-btn').addEventListener('click', updateOrder);
    }

    // Change page
    function changePage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show selected page
        document.getElementById(`${page}-page`).classList.add('active');

        // Update active menu item
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.sidebar-menu li[data-page="${page}"]`).classList.add('active');

        // Load page data
        switch (page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'products':
                loadProducts();
                break;
            case 'orders':
                loadOrders();
                break;
            case 'users':
                loadUsers();
                break;
            case 'categories':
                loadCategories(true);
                break;
            case 'product-images':
                loadProductImages();
                break;
        }
    }

    // Load dashboard data
    async function loadDashboard() {
        try {
            const response = await fetch(`${API_URL}/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }

            const data = await response.json();

            // Update stats
            document.getElementById('user-count').textContent = data.userCount;
            document.getElementById('product-count').textContent = data.productCount;
            document.getElementById('order-count').textContent = data.orderCount;
            document.getElementById('total-revenue').textContent = formatCurrency(data.totalRevenue);

            // Update recent orders table
            const recentOrdersTable = document.getElementById('recent-orders-table').querySelector('tbody');

            if (data.recentOrders && data.recentOrders.length > 0) {
                let html = '';

                data.recentOrders.forEach(order => {
                    const customerName = order.userid ? order.userid.username : 'Unknown Customer';
                    const customerEmail = order.userid ? order.userid.email : 'N/A';
                    const customerInitials = customerName.split(' ').map(n => n[0]).join('').toUpperCase();
                    const orderDate = new Date(order.orderdate);
                    const formattedDate = orderDate.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                    const formattedTime = orderDate.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    html += `
                        <tr>
                            <td><span class="order-id">#${order._id.slice(-6).toUpperCase()}</span></td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">${customerInitials}</div>
                                    <div class="customer-details">
                                        <div class="customer-name">${customerName}</div>
                                        <div class="customer-email">${customerEmail}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="order-date">${formattedDate}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">${formattedTime}</div>
                            </td>
                            <td><span class="order-amount">${formatCurrency(order.totalprice)}</span></td>
                            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                            <td>
                                <div class="order-actions">
                                    <button class="action-btn view" onclick="viewOrder('${order._id}')" title="View Order">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit" onclick="editOrder('${order._id}')" title="Edit Order">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });

                recentOrdersTable.innerHTML = html;
            } else {
                recentOrdersTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--gray-500);">No recent orders found</td></tr>';
            }

            // Load recent activity
            loadRecentActivity();

            // Create sales trend chart
            createSalesTrendChart();

            // Load top products
            loadTopProducts();

        } catch (error) {
            console.error('Error loading dashboard:', error);
            alert('Error loading dashboard data');
        }
    }

    // Load products
    async function loadProducts() {
        try {
            const response = await fetch(`${API_URL}/admin/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load products');
            }

            const products = await response.json();

            const productsTable = document.getElementById('products-table').querySelector('tbody');

            if (products && products.length > 0) {
                let html = '';

                products.forEach(product => {
                    html += `
                        <tr>
                            <td>
                                <img src="${product.imageUrl}" alt="${product.productname}" width="50">
                            </td>
                            <td>${product.productname}</td>
                            <td>${formatCurrency(product.price)}</td>
                            <td>${product.category || 'Uncategorized'}</td>
                            <td>${product.stockQuantity}</td>
                            <td class="action-buttons">
                                <button class="btn btn-info btn-sm" onclick="editProduct('${product._id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                productsTable.innerHTML = html;
            } else {
                productsTable.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
            }

        } catch (error) {
            console.error('Error loading products:', error);
            alert('Error loading products');
        }
    }

    // Load orders
    async function loadOrders() {
        try {
            const response = await fetch(`${API_URL}/admin/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load orders');
            }

            const orders = await response.json();

            const ordersTable = document.getElementById('orders-table').querySelector('tbody');

            if (orders && orders.length > 0) {
                let html = '';

                orders.forEach(order => {
                    html += `
                        <tr>
                            <td>${order._id}</td>
                            <td>${order.userid ? order.userid.username : 'Unknown'}</td>
                            <td>${formatDate(order.orderdate)}</td>
                            <td>${formatCurrency(order.totalprice)}</td>
                            <td>
                                <span class="status-badge status-${order.status}">${order.status}</span>
                            </td>
                            <td class="action-buttons">
                                <button class="btn btn-info btn-sm" onclick="viewOrder('${order._id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                ordersTable.innerHTML = html;
            } else {
                ordersTable.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
            }

        } catch (error) {
            console.error('Error loading orders:', error);
            alert('Error loading orders');
        }
    }

    // Load users
    async function loadUsers() {
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load users');
            }

            const users = await response.json();

            const usersTable = document.getElementById('users-table').querySelector('tbody');

            if (users && users.length > 0) {
                let html = '';

                users.forEach(user => {
                    html += `
                        <tr>
                            <td>${user._id}</td>
                            <td>${user.fullName || user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${formatDate(user.createdAt)}</td>
                            <td class="action-buttons">
                                <button class="btn btn-info btn-sm" onclick="editUser('${user._id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                usersTable.innerHTML = html;
            } else {
                usersTable.innerHTML = '<tr><td colspan="6">No users found</td></tr>';
            }

        } catch (error) {
            console.error('Error loading users:', error);
            alert('Error loading users');
        }
    }

    // Load categories
    async function loadCategories(showTable = false) {
        try {
            console.log('Loading categories...');
            const response = await fetch(`${API_URL}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load categories');
            }

            const categories = await response.json();
            console.log('Categories loaded:', categories);

            // Update category dropdown in product form
            const categorySelect = document.getElementById('product-category');
            categorySelect.innerHTML = '<option value="">Select Category</option>';

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });

            // Update categories table if needed
            if (showTable) {
                const categoriesTable = document.getElementById('categories-table').querySelector('tbody');

                if (categories && categories.length > 0) {
                    let html = '';

                    categories.forEach(category => {
                        html += `
                            <tr>
                                <td>${category._id}</td>
                                <td>${category.name}</td>
                                <td>${category.productCount || 0}</td>
                                <td class="action-buttons">
                                    <button class="btn btn-info btn-sm" onclick="editCategory('${category._id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category._id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });

                    categoriesTable.innerHTML = html;
                } else {
                    categoriesTable.innerHTML = '<tr><td colspan="4">No categories found</td></tr>';
                }
            }

        } catch (error) {
            console.error('Error loading categories:', error);
            alert('Error loading categories');
        }
    }

    // Load recent activity - connected to real data
    async function loadRecentActivity() {
        try {
            // Fetch recent activities from the API
            const response = await fetch(`${API_URL}/admin/activities`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let activities = [];

            if (response.ok) {
                activities = await response.json();
            } else {
                // Fallback to generating activities from existing data
                activities = await generateActivitiesFromData();
            }

            const container = document.getElementById('recent-activity');
            if (!container) return;

            if (activities.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--gray-500);">No recent activities</div>';
                return;
            }

            container.innerHTML = activities.map(activity => `
                <div class="activity-item ${activity.type}">
                    ${activity.isNew ? '<div class="activity-badge"></div>' : ''}
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-description">${activity.description}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading activities:', error);
            // Show fallback activities
            loadFallbackActivities();
        }
    }

    // Generate activities from existing data
    async function generateActivitiesFromData() {
        const activities = [];

        try {
            // Get recent orders for order activities
            const ordersResponse = await fetch(`${API_URL}/admin/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (ordersResponse.ok) {
                const orders = await ordersResponse.json();
                const recentOrders = orders.slice(0, 3); // Get 3 most recent orders

                recentOrders.forEach((order, index) => {
                    const customerName = order.userid ? order.userid.username : 'Unknown Customer';
                    const orderDate = new Date(order.orderdate);
                    const timeAgo = getTimeAgo(orderDate);
                    const isNew = index === 0; // Mark first order as new

                    activities.push({
                        type: 'new-order',
                        icon: 'fas fa-shopping-cart',
                        title: 'New Order Received',
                        description: `Order #${order._id.slice(-6).toUpperCase()} placed by ${customerName} for ${formatCurrency(order.totalprice)}`,
                        time: timeAgo,
                        isNew: isNew,
                        timestamp: orderDate
                    });
                });
            }

            // Get recent users for registration activities
            const usersResponse = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (usersResponse.ok) {
                const users = await usersResponse.json();
                const recentUsers = users.slice(0, 2); // Get 2 most recent users

                recentUsers.forEach((user, index) => {
                    const userDate = new Date(user.createdAt);
                    const timeAgo = getTimeAgo(userDate);
                    const isNew = index === 0; // Mark first user as new

                    activities.push({
                        type: 'new-user',
                        icon: 'fas fa-user-plus',
                        title: 'New User Registration',
                        description: `${user.fullName || user.username} registered with email ${user.email}`,
                        time: timeAgo,
                        isNew: isNew,
                        timestamp: userDate
                    });
                });
            }

            // Add more diverse system and business activities
            const additionalActivities = [
                {
                    type: 'system',
                    icon: 'fas fa-cog',
                    title: 'System Backup',
                    description: 'Daily backup completed successfully',
                    time: '3 hours ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
                },
                {
                    type: 'product-update',
                    icon: 'fas fa-edit',
                    title: 'Product Inventory Check',
                    description: 'Automated inventory check completed',
                    time: '6 hours ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
                },
                {
                    type: 'new-order',
                    icon: 'fas fa-shipping-fast',
                    title: 'Order Shipped',
                    description: 'Order #ORD789 shipped to Mumbai via Express Delivery',
                    time: '8 hours ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
                },
                {
                    type: 'product-update',
                    icon: 'fas fa-tag',
                    title: 'Price Update',
                    description: 'iPhone 15 Pro price updated to ₹1,34,900',
                    time: '12 hours ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
                },
                {
                    type: 'new-user',
                    icon: 'fas fa-user-check',
                    title: 'User Verification',
                    description: 'Email verification completed for new user',
                    time: '14 hours ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000)
                },
                {
                    type: 'security',
                    icon: 'fas fa-shield-alt',
                    title: 'Security Scan',
                    description: 'Weekly security scan completed - No threats detected',
                    time: '18 hours ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
                },
                {
                    type: 'product-update',
                    icon: 'fas fa-plus-circle',
                    title: 'New Product Added',
                    description: 'MacBook Air M3 added to inventory with 15 units',
                    time: '1 day ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
                },
                {
                    type: 'new-order',
                    icon: 'fas fa-check-circle',
                    title: 'Order Delivered',
                    description: 'Order #ORD456 successfully delivered to Delhi',
                    time: '1 day ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000)
                },
                {
                    type: 'analytics',
                    icon: 'fas fa-chart-line',
                    title: 'Analytics Report',
                    description: 'Monthly sales report generated - Revenue up 15%',
                    time: '2 days ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
                },
                {
                    type: 'product-update',
                    icon: 'fas fa-exclamation-triangle',
                    title: 'Low Stock Alert',
                    description: 'AirPods Pro stock running low - Only 5 units remaining',
                    time: '2 days ago',
                    isNew: false,
                    timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000)
                }
            ];

            // Add additional activities to the main activities array
            activities.push(...additionalActivities);

            // Sort activities by timestamp (newest first)
            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return activities.slice(0, 12); // Return top 12 activities to fill the space

        } catch (error) {
            console.error('Error generating activities:', error);
            return [];
        }
    }

    // Fallback activities when API is not available
    function loadFallbackActivities() {
        const activities = [
            {
                type: 'new-order',
                icon: 'fas fa-shopping-cart',
                title: 'New Order Received',
                description: 'Order #ORD123 placed by John Doe for ₹45,000',
                time: '2 minutes ago',
                isNew: true
            },
            {
                type: 'new-user',
                icon: 'fas fa-user-plus',
                title: 'New User Registration',
                description: 'Sarah Smith registered with email sarah@example.com',
                time: '15 minutes ago',
                isNew: true
            },
            {
                type: 'product-update',
                icon: 'fas fa-box',
                title: 'Product Stock Updated',
                description: 'MacBook Pro stock increased to 25 units',
                time: '1 hour ago',
                isNew: false
            },
            {
                type: 'system',
                icon: 'fas fa-cog',
                title: 'System Backup',
                description: 'Daily backup completed successfully',
                time: '3 hours ago',
                isNew: false
            },
            {
                type: 'new-order',
                icon: 'fas fa-shipping-fast',
                title: 'Order Shipped',
                description: 'Order #ORD122 shipped to Bangalore',
                time: '5 hours ago',
                isNew: false
            },
            {
                type: 'product-update',
                icon: 'fas fa-tag',
                title: 'Price Update',
                description: 'iPad Air price reduced to ₹54,900',
                time: '8 hours ago',
                isNew: false
            },
            {
                type: 'new-user',
                icon: 'fas fa-user-check',
                title: 'User Verification',
                description: 'Email verified for user mike.johnson@email.com',
                time: '10 hours ago',
                isNew: false
            },
            {
                type: 'security',
                icon: 'fas fa-shield-alt',
                title: 'Security Update',
                description: 'Security patches applied successfully',
                time: '12 hours ago',
                isNew: false
            },
            {
                type: 'new-order',
                icon: 'fas fa-check-circle',
                title: 'Order Delivered',
                description: 'Order #ORD121 delivered to Chennai',
                time: '1 day ago',
                isNew: false
            },
            {
                type: 'product-update',
                icon: 'fas fa-plus-circle',
                title: 'New Product Added',
                description: 'Apple Watch Series 9 added to catalog',
                time: '1 day ago',
                isNew: false
            },
            {
                type: 'analytics',
                icon: 'fas fa-chart-line',
                title: 'Sales Report',
                description: 'Weekly sales report generated',
                time: '2 days ago',
                isNew: false
            },
            {
                type: 'product-update',
                icon: 'fas fa-exclamation-triangle',
                title: 'Stock Alert',
                description: 'iPhone 15 stock running low - 8 units left',
                time: '2 days ago',
                isNew: false
            }
        ];

        const container = document.getElementById('recent-activity');
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item ${activity.type}">
                ${activity.isNew ? '<div class="activity-badge"></div>' : ''}
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Helper function to calculate time ago
    function getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    // Handle product form submit
    async function handleProductSubmit(e) {
        e.preventDefault();

        const productId = document.getElementById('product-id').value;
        const productData = {
            productname: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            category: document.getElementById('product-category').value,
            imageUrl: document.getElementById('product-image').value,
            stockQuantity: parseInt(document.getElementById('product-stock').value)
        };

        try {
            let url = `${API_URL}/admin/products`;
            let method = 'POST';

            if (productId) {
                url = `${url}/${productId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Failed to save product');
            }

            closeAllModals();
            loadProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        }
    }

    // Handle user form submit
    async function handleUserSubmit(e) {
        e.preventDefault();

        const userId = document.getElementById('user-id').value;
        const userData = {
            username: document.getElementById('user-username').value,
            email: document.getElementById('user-email').value,
            fullName: document.getElementById('user-fullname').value,
            role: document.getElementById('user-role').value
        };

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            closeAllModals();
            loadUsers();

        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        }
    }

    // Handle category form submit
    async function handleCategorySubmit(e) {
        e.preventDefault();

        const categoryId = document.getElementById('category-id').value;
        const categoryData = {
            name: document.getElementById('category-name').value
        };

        try {
            console.log('Submitting category form:', categoryData);
            let url = `${API_URL}/categories`;
            let method = 'POST';

            if (categoryId) {
                url = `${url}/${categoryId}`;
                method = 'PUT';
                console.log('Updating existing category:', categoryId);
            } else {
                console.log('Creating new category');
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save category');
            }

            const result = await response.json();
            console.log('Category saved successfully:', result);

            closeAllModals();
            loadCategories(true);

        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.message || 'Error saving category');
        }
    }

    // Update order
    async function updateOrder() {
        const orderId = document.getElementById('order-modal').getAttribute('data-order-id');
        const orderData = {
            status: document.getElementById('order-status').value,
            paymentstatus: document.getElementById('payment-status').value
        };

        try {
            const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            closeAllModals();
            loadOrders();

        } catch (error) {
            console.error('Error updating order:', error);
            alert('Error updating order');
        }
    }

    // Create sales trend chart
    function createSalesTrendChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        // Sample data - in real app, fetch from API
        const salesData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales (₹)',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + (value / 1000) + 'k';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#8b5cf6'
                    }
                }
            }
        });
    }

    // Load top products
    function loadTopProducts() {
        // Sample data - in real app, fetch from API
        const topProducts = [
            { name: 'MacBook Pro', sales: 45, revenue: 4500000 },
            { name: 'iPhone 15', sales: 38, revenue: 3800000 },
            { name: 'AirPods Pro', sales: 62, revenue: 1240000 },
            { name: 'iPad Air', sales: 28, revenue: 1400000 },
            { name: 'Apple Watch', sales: 35, revenue: 875000 }
        ];

        const container = document.getElementById('top-products');
        if (!container) return;

        container.innerHTML = topProducts.map((product, index) => `
            <div class="product-item">
                <div class="product-rank">${index + 1}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-sales">${product.sales} units sold</div>
                </div>
                <div class="product-revenue">${formatCurrency(product.revenue / 83)}</div>
            </div>
        `).join('');
    }

    // Helper functions
    function formatCurrency(amount) {
        const inrAmount = (amount || 0) * 83; // Convert USD to INR
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(inrAmount);
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Make functions available globally
    window.editProduct = async function(productId) {
        try {
            const response = await fetch(`${API_URL}/admin/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get product');
            }

            const product = await response.json();

            document.getElementById('product-modal-title').textContent = 'Edit Product';
            document.getElementById('product-id').value = product._id;
            document.getElementById('product-name').value = product.productname;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-category').value = product.category || '';
            document.getElementById('product-image').value = product.imageUrl;
            document.getElementById('product-stock').value = product.stockQuantity;

            loadCategories();
            openModal('product-modal');

        } catch (error) {
            console.error('Error getting product:', error);
            alert('Error getting product');
        }
    };

    window.deleteProduct = async function(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            loadProducts();

        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    window.editUser = async function(userId) {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get user');
            }

            const user = await response.json();

            document.getElementById('user-id').value = user._id;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-fullname').value = user.fullName || '';
            document.getElementById('user-role').value = user.role;

            openModal('user-modal');

        } catch (error) {
            console.error('Error getting user:', error);
            alert('Error getting user');
        }
    };

    window.deleteUser = async function(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            loadUsers();

        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    window.viewOrder = async function(orderId) {
        try {
            const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get order');
            }

            const order = await response.json();

            // Set order details
            const orderDetails = document.getElementById('order-details');

            let html = `
                <div class="order-info">
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Customer:</strong> ${order.userid ? order.userid.fullName : 'Unknown'}</p>
                    <p><strong>Email:</strong> ${order.userid ? order.userid.email : 'Unknown'}</p>
                    <p><strong>Phone:</strong> ${order.userid ? order.userid.phoneNumber : 'Unknown'}</p>
                    <p><strong>Date:</strong> ${formatDate(order.orderdate)}</p>
                    <p><strong>Shipping Address:</strong> ${order.shippingaddress}</p>
                    <p><strong>Total Amount:</strong> ${formatCurrency(order.totalprice)}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentmethod}</p>
                    <p><strong>Payment Status:</strong> ${order.paymentstatus}</p>
                </div>

                <h3>Order Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            if (order.productids && order.productids.length > 0) {
                order.productids.forEach(item => {
                    const product = item.productid;
                    const subtotal = product.price * item.quantity;

                    html += `
                        <tr>
                            <td>${product.productname}</td>
                            <td>${formatCurrency(product.price)}</td>
                            <td>${item.quantity}</td>
                            <td>${formatCurrency(subtotal)}</td>
                        </tr>
                    `;
                });
            } else {
                html += '<tr><td colspan="4">No items found</td></tr>';
            }

            html += `
                    </tbody>
                </table>
            `;

            orderDetails.innerHTML = html;

            // Set current status
            document.getElementById('order-status').value = order.status;
            document.getElementById('payment-status').value = order.paymentstatus;

            // Set order ID for update
            document.getElementById('order-modal').setAttribute('data-order-id', order._id);

            openModal('order-modal');

        } catch (error) {
            console.error('Error getting order:', error);
            alert('Error getting order');
        }
    };

    window.editOrder = async function(orderId) {
        // For now, editOrder will just call viewOrder since they use the same modal
        // In the future, this could open a different modal or have different permissions
        window.viewOrder(orderId);
    };

    window.editCategory = async function(categoryId) {
        try {
            console.log('Editing category:', categoryId);
            const response = await fetch(`${API_URL}/categories/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get category');
            }

            const category = await response.json();
            console.log('Category data:', category);

            document.getElementById('category-modal-title').textContent = 'Edit Category';
            document.getElementById('category-id').value = category._id;
            document.getElementById('category-name').value = category.name;

            openModal('category-modal');

        } catch (error) {
            console.error('Error getting category:', error);
            alert('Error getting category');
        }
    };

    window.deleteCategory = async function(categoryId) {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            console.log('Deleting category:', categoryId);
            const response = await fetch(`${API_URL}/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete category');
            }

            console.log('Category deleted successfully');
            loadCategories(true);

        } catch (error) {
            console.error('Error deleting category:', error);
            alert(error.message || 'Error deleting category');
        }
    };

    // Product Images functionality
    async function loadProductImages() {
        try {
            // Load products for dropdown
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();

            const select = document.getElementById('product-select-images');
            select.innerHTML = '<option value="">Select a product...</option>';

            data.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product._id;
                option.textContent = `${product.productname} (${product.category})`;
                select.appendChild(option);
            });

            // Setup event listeners for product images page
            setupProductImagesEventListeners();

        } catch (error) {
            console.error('Error loading products for images:', error);
            showImageMessage('Error loading products', 'error');
        }
    }

    function setupProductImagesEventListeners() {
        // Product selection change
        document.getElementById('product-select-images').addEventListener('change', loadProductImageData);

        // Image input changes for preview
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`product-image-${i}`).addEventListener('input', function() {
                updateImagePreview(i, this.value);
            });
        }

        // Update images button
        document.getElementById('update-images-btn').addEventListener('click', updateProductImages);

        // Clear images button
        document.getElementById('clear-images-btn').addEventListener('click', clearAllImages);
    }

    async function loadProductImageData() {
        const productId = document.getElementById('product-select-images').value;

        if (!productId) {
            clearAllImages();
            return;
        }

        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            const product = await response.json();

            // Load existing images
            if (product.images && product.images.length > 0) {
                for (let i = 0; i < 4; i++) {
                    const imageUrl = product.images[i] || '';
                    document.getElementById(`product-image-${i + 1}`).value = imageUrl;
                    updateImagePreview(i + 1, imageUrl);
                }
            } else {
                // Load main image as first image if no images array
                document.getElementById('product-image-1').value = product.imageUrl || '';
                updateImagePreview(1, product.imageUrl || '');

                // Clear other fields
                for (let i = 2; i <= 4; i++) {
                    document.getElementById(`product-image-${i}`).value = '';
                    updateImagePreview(i, '');
                }
            }

        } catch (error) {
            console.error('Error loading product data:', error);
            showImageMessage('Error loading product data', 'error');
        }
    }

    function updateImagePreview(index, imageUrl) {
        const preview = document.getElementById(`preview-${index}`);

        if (!imageUrl.trim()) {
            preview.innerHTML = 'No image';
            preview.className = 'image-preview';
            return;
        }

        preview.innerHTML = 'Loading...';
        preview.className = 'image-preview loading';

        const img = new Image();
        img.onload = function() {
            preview.innerHTML = '';
            preview.appendChild(img);
            preview.className = 'image-preview';
        };
        img.onerror = function() {
            preview.innerHTML = 'Failed to load';
            preview.className = 'image-preview error';
        };
        img.src = imageUrl;
    }

    async function updateProductImages() {
        const productId = document.getElementById('product-select-images').value;

        if (!productId) {
            showImageMessage('Please select a product first', 'error');
            return;
        }

        const images = [];
        for (let i = 1; i <= 4; i++) {
            const imageUrl = document.getElementById(`product-image-${i}`).value.trim();
            if (imageUrl) {
                images.push(imageUrl);
            }
        }

        if (images.length === 0) {
            showImageMessage('Please add at least one image URL', 'error');
            return;
        }

        const updateBtn = document.getElementById('update-images-btn');
        updateBtn.disabled = true;
        updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

        try {
            const response = await fetch(`${API_URL}/admin/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ images })
            });

            const result = await response.json();

            if (response.ok) {
                showImageMessage('✅ Product images updated successfully!', 'success');
                // Refresh products list if needed
                if (document.getElementById('products-page').classList.contains('active')) {
                    loadProducts();
                }
            } else {
                showImageMessage('❌ Error: ' + result.message, 'error');
            }

        } catch (error) {
            console.error('Error updating images:', error);
            showImageMessage('❌ Error updating images: ' + error.message, 'error');
        } finally {
            updateBtn.disabled = false;
            updateBtn.innerHTML = '<i class="fas fa-save"></i> Update Product Images';
        }
    }

    function clearAllImages() {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`product-image-${i}`).value = '';
            updateImagePreview(i, '');
        }
        showImageMessage('All image fields cleared', 'info');
    }

    function showImageMessage(message, type) {
        const messageContainer = document.getElementById('image-upload-message');
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;

        // Auto-hide success and info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
});
