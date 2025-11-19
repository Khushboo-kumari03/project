const API_URL = 'http://localhost:4001/api';
let cartData = null;
let selectedPaymentMethod = null;
let orderDetails = null;

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndLoadCart();
    updateUserUI();
    setupEventListeners();
});

function setupEventListeners() {
    // Close modal when clicking the X
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('receiptModal').style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('receiptModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Download receipt button
    document.getElementById('downloadReceiptBtn').addEventListener('click', downloadReceipt);
}

async function checkAuthAndLoadCart() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        window.location.href = 'auth.html';
        return;
    }

    try {
        await loadCart();
    } catch (error) {
        console.error('Error loading cart:', error);
        if (error.message === 'Unauthorized') {
            localStorage.clear();
            window.location.href = 'auth.html';
        }
    }
}

async function loadCart() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        window.location.href = 'auth.html';
        return;
    }

    try {
        console.log('Fetching cart data...');
        console.log('User ID:', userId);
        console.log('Token:', token ? 'Token exists' : 'No token');

        const response = await fetch(`${API_URL}/cart/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = 'auth.html';
                return;
            }

            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Cart data:', data);

        if (!data.carts || data.carts.length === 0) {
            alert('Your cart is empty. Please add items to your cart before checkout.');
            window.location.href = 'cart-page.html';
            return;
        }

        cartData = data.carts;
        displayPaymentPage(data.carts);
    } catch (error) {
        console.error('Error in loadCart:', error);
        alert(`Error loading cart: ${error.message}. Please try again.`);
        window.location.href = 'cart-page.html';
    }
}

function displayPaymentPage(cartItems) {
    const container = document.getElementById('paymentContainer');
    let subtotal = 0;
    let itemsHtml = '';

    // Calculate subtotal and prepare items HTML for summary
    cartItems.forEach(item => {
        const product = item.productid;
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        itemsHtml += `
            <div class="order-item">
                <span>${product.productname} x ${item.quantity}</span>
                <span>₹${(itemTotal * 83).toFixed(0)}</span>
            </div>
        `;
    });

    // Calculate summary values with INR conversion
    const subtotalINR = subtotal * 83;
    const tax = subtotalINR * 0.1; // 10% tax
    const shipping = 50 * 83; // Fixed shipping cost in INR
    const total = subtotalINR + tax + shipping;

    // Prepare the complete payment page HTML
    container.innerHTML = `
        <div class="payment-details">
            <div class="payment-section">
                <h2>Shipping Information</h2>
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" required>
                </div>
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" required>
                </div>
                <div class="form-group">
                    <label for="state">State</label>
                    <input type="text" id="state" required>
                </div>
                <div class="form-group">
                    <label for="zipCode">ZIP Code</label>
                    <input type="text" id="zipCode" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" required>
                </div>
            </div>

            <div class="payment-section">
                <h2>Payment Method</h2>
                <div class="payment-methods">
                    <div class="payment-method" data-method="credit-card" onclick="selectPaymentMethod('credit-card')">
                        <i class="fas fa-credit-card"></i>
                        <p>Credit Card</p>
                    </div>
                    <div class="payment-method" data-method="debit-card" onclick="selectPaymentMethod('debit-card')">
                        <i class="fas fa-credit-card"></i>
                        <p>Debit Card</p>
                    </div>
                    <div class="payment-method" data-method="upi" onclick="selectPaymentMethod('upi')">
                        <i class="fas fa-mobile-alt"></i>
                        <p>UPI</p>
                    </div>
                    <div class="payment-method" data-method="cod" onclick="selectPaymentMethod('cod')">
                        <i class="fas fa-money-bill-wave"></i>
                        <p>Cash on Delivery</p>
                    </div>
                </div>

                <div id="payment-details-container">
                    <!-- Payment details will be loaded here based on selection -->
                </div>
            </div>
        </div>

        <div class="order-summary">
            <h2 class="summary-header">Order Summary</h2>
            <div class="summary-row">
                <span>Items (${cartItems.length}):</span>
                <span>₹${subtotalINR.toFixed(0)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>₹${tax.toFixed(0)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>₹${shipping.toFixed(0)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>₹${total.toFixed(0)}</span>
            </div>
            <div class="order-items">
                ${itemsHtml}
            </div>
            <button class="pay-btn" id="payButton" disabled onclick="placeOrder()">
                Complete Payment
            </button>
        </div>
    `;

    // Update cart count in navigation
    document.querySelector('.cart-count').textContent = cartItems.length;
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // Update UI to show selected method
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`.payment-method[data-method="${method}"]`).classList.add('selected');

    // Enable the pay button
    document.getElementById('payButton').disabled = false;

    // Show appropriate payment details form
    const detailsContainer = document.getElementById('payment-details-container');

    if (method === 'credit-card' || method === 'debit-card') {
        detailsContainer.innerHTML = `
            <div class="card-details">
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="form-group">
                    <label for="cardName">Name on Card</label>
                    <input type="text" id="cardName" required>
                </div>
                <div class="form-group">
                    <label for="expiry">Expiry Date</label>
                    <input type="text" id="expiry" placeholder="MM/YY" required>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" required>
                </div>
            </div>
        `;
    } else if (method === 'upi') {
        detailsContainer.innerHTML = `
            <div class="form-group">
                <label for="upiId">UPI ID</label>
                <input type="text" id="upiId" placeholder="example@upi" required>
            </div>
        `;
    } else if (method === 'cod') {
        detailsContainer.innerHTML = `
            <p style="color: #666;">Pay with cash upon delivery. Our delivery partner will collect the payment.</p>
        `;
    }
}

async function placeOrder() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        window.location.href = 'auth.html';
        return;
    }

    // Validate shipping information
    const fullName = document.getElementById('fullName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Validate all shipping fields
    if (!fullName) {
        alert('Please enter your full name');
        document.getElementById('fullName').focus();
        return;
    }

    if (!address) {
        alert('Please enter your address');
        document.getElementById('address').focus();
        return;
    }

    if (!city) {
        alert('Please enter your city');
        document.getElementById('city').focus();
        return;
    }

    if (!state) {
        alert('Please enter your state');
        document.getElementById('state').focus();
        return;
    }

    if (!zipCode) {
        alert('Please enter your ZIP code');
        document.getElementById('zipCode').focus();
        return;
    }

    if (!phone) {
        alert('Please enter your phone number');
        document.getElementById('phone').focus();
        return;
    }

    // Validate phone number (numbers only)
    if (!/^\d+$/.test(phone)) {
        alert('Phone number must contain only numbers');
        document.getElementById('phone').focus();
        return;
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }

    // Validate payment details based on selected method
    if (selectedPaymentMethod === 'credit-card' || selectedPaymentMethod === 'debit-card') {
        const cardNumber = document.getElementById('cardNumber')?.value.trim();
        const cardName = document.getElementById('cardName')?.value.trim();
        const expiry = document.getElementById('expiry')?.value.trim();
        const cvv = document.getElementById('cvv')?.value.trim();

        if (!cardNumber) {
            alert('Please enter your card number');
            document.getElementById('cardNumber').focus();
            return;
        }

        if (!cardName) {
            alert('Please enter the name on your card');
            document.getElementById('cardName').focus();
            return;
        }

        if (!expiry) {
            alert('Please enter the expiry date');
            document.getElementById('expiry').focus();
            return;
        }

        if (!cvv) {
            alert('Please enter the CVV');
            document.getElementById('cvv').focus();
            return;
        }
    } else if (selectedPaymentMethod === 'upi') {
        const upiId = document.getElementById('upiId')?.value.trim();

        if (!upiId) {
            alert('Please enter your UPI ID');
            document.getElementById('upiId').focus();
            return;
        }
    }

    // Disable the pay button and show loading state
    const payButton = document.getElementById('payButton');
    payButton.disabled = true;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        console.log('Processing order...');

        // Calculate order totals with INR conversion
        let subtotal = 0;
        cartData.forEach(item => {
            subtotal += item.productid.price * item.quantity;
        });

        const subtotalINR = subtotal * 83;
        const tax = subtotalINR * 0.1;
        const shipping = 50 * 83;
        const total = subtotalINR + tax + shipping;

        // Create order object
        const orderData = {
            userId: userId,
            items: cartData.map(item => ({
                productId: item.productid._id,
                quantity: item.quantity,
                price: item.productid.price
            })),
            shippingAddress: `${address}, ${city}, ${state} ${zipCode}`,
            paymentMethod: selectedPaymentMethod,
            subtotal: subtotalINR,
            tax: tax,
            shipping: shipping,
            total: total
        };

        console.log('Order data:', orderData);

        // Store order details for receipt
        orderDetails = {
            orderId: generateOrderId(),
            date: new Date().toISOString(),
            customerName: fullName,
            shippingAddress: `${address}, ${city}, ${state} ${zipCode}`,
            phone: phone,
            paymentMethod: selectedPaymentMethod,
            items: cartData.map(item => ({
                name: item.productid.productname,
                quantity: item.quantity,
                price: item.productid.price * 83,
                total: item.productid.price * item.quantity * 83
            })),
            subtotal: subtotalINR,
            tax: tax,
            shipping: shipping,
            total: total
        };

        console.log('Order details for receipt:', orderDetails);

        // Simulate API call to create order
        // In a real application, you would send orderData to your backend
        console.log('Simulating API call to create order...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Order created successfully!');

        // Show receipt
        showReceipt();

        // Clear cart (in a real app, this would be done by the backend)
        // Here we're just simulating it
        document.querySelector('.cart-count').textContent = '0';

    } catch (error) {
        console.error('Error placing order:', error);
        alert(`Error placing order: ${error.message}. Please try again.`);

        // Re-enable the pay button
        payButton.disabled = false;
        payButton.innerHTML = 'Complete Payment';
    }
}

function generateOrderId() {
    // Generate a random order ID
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showReceipt() {
    // Format the receipt
    const receiptContent = document.getElementById('receiptContent');

    // Format date
    const orderDate = new Date(orderDetails.date);
    const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();

    // Create receipt HTML
    receiptContent.innerHTML = `
        <div class="receipt-header">
            <h2>V-!magine</h2>
            <p>Order Receipt</p>
        </div>

        <div class="receipt-details">
            <div class="receipt-row">
                <strong>Order ID:</strong>
                <span>${orderDetails.orderId}</span>
            </div>
            <div class="receipt-row">
                <strong>Date:</strong>
                <span>${formattedDate}</span>
            </div>
            <div class="receipt-row">
                <strong>Customer:</strong>
                <span>${orderDetails.customerName}</span>
            </div>
            <div class="receipt-row">
                <strong>Shipping Address:</strong>
                <span>${orderDetails.shippingAddress}</span>
            </div>
            <div class="receipt-row">
                <strong>Phone:</strong>
                <span>${orderDetails.phone}</span>
            </div>
            <div class="receipt-row">
                <strong>Payment Method:</strong>
                <span>${formatPaymentMethod(orderDetails.paymentMethod)}</span>
            </div>
        </div>

        <div class="receipt-items">
            ${orderDetails.items.map(item => `
                <div class="receipt-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${item.total.toFixed(0)}</span>
                </div>
            `).join('')}
        </div>

        <div class="receipt-row">
            <span>Subtotal:</span>
            <span>₹${orderDetails.subtotal.toFixed(0)}</span>
        </div>
        <div class="receipt-row">
            <span>Tax (10%):</span>
            <span>₹${orderDetails.tax.toFixed(0)}</span>
        </div>
        <div class="receipt-row">
            <span>Shipping:</span>
            <span>₹${orderDetails.shipping.toFixed(0)}</span>
        </div>
        <div class="receipt-total">
            <span>Total: ₹${orderDetails.total.toFixed(0)}</span>
        </div>
    `;

    // Update success message
    const successMessage = document.querySelector('.success-message');
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order #${orderDetails.orderId} has been confirmed.</p>
        <p>A confirmation email will be sent to your registered email address.</p>
    `;

    // Show the modal
    document.getElementById('receiptModal').style.display = 'block';

    // Clear the payment form
    const paymentContainer = document.getElementById('paymentContainer');
    paymentContainer.innerHTML = `
        <div class="payment-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order #${orderDetails.orderId} has been confirmed.</p>
            <p>You can view your receipt by clicking the button below.</p>
            <button class="view-receipt-btn" onclick="document.getElementById('receiptModal').style.display = 'block';">
                View Receipt
            </button>
            <a href="index.html" class="continue-shopping-btn">
                Continue Shopping
            </a>
        </div>
    `;

    // Add styles for the success page
    const style = document.createElement('style');
    style.textContent = `
        .payment-success {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 40px;
            text-align: center;
            grid-column: 1 / -1;
        }

        .success-icon {
            font-size: 5rem;
            color: #28a745;
            margin-bottom: 20px;
        }

        .payment-success h2 {
            color: #2D3250;
            margin-bottom: 15px;
        }

        .payment-success p {
            color: #666;
            margin-bottom: 10px;
        }

        .view-receipt-btn {
            background: #2D3250;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            margin-right: 10px;
            transition: background 0.2s;
        }

        .view-receipt-btn:hover {
            background: #424769;
        }

        .continue-shopping-btn {
            display: inline-block;
            background: #F6B17A;
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            margin-top: 20px;
            transition: background 0.2s;
        }

        .continue-shopping-btn:hover {
            background: #e9935c;
        }
    `;
    document.head.appendChild(style);
}

function formatPaymentMethod(method) {
    switch (method) {
        case 'credit-card': return 'Credit Card';
        case 'debit-card': return 'Debit Card';
        case 'upi': return 'UPI';
        case 'cod': return 'Cash on Delivery';
        default: return method;
    }
}

async function downloadReceipt() {
    const { jsPDF } = window.jspdf;
    const receiptElement = document.getElementById('receiptContent');

    try {
        // Create a new PDF
        const doc = new jsPDF('p', 'mm', 'a4');

        // Use html2canvas to capture the receipt as an image
        const canvas = await html2canvas(receiptElement, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

        // Save the PDF
        doc.save(`receipt_${orderDetails.orderId}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

function updateUserUI() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userInfo = document.querySelector('.user-info');

    if (userId && userName) {
        userInfo.innerHTML = `
            <span style="margin-right: 10px;">${userName}</span>
            <button onclick="logout()" style="background: none; border: none; color: #fff; cursor: pointer;">
                <i class="fas fa-sign-out-alt"></i>
            </button>`;
    } else {
        userInfo.innerHTML = '<a href="auth.html"><i class="fas fa-user"></i></a>';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'auth.html';
}
