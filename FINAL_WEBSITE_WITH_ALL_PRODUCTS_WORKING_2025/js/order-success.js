// Order Success Page JavaScript
class OrderSuccessManager {
    constructor() {
        this.orderId = this.getOrderIdFromUrl();
        this.order = null;
        this.init();
    }

    init() {
        this.loadOrder();
        this.displayOrderDetails();
        this.updateCartCount();
    }

    // Get order ID from URL parameters
    getOrderIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('order');
    }

    // Load order from localStorage
    loadOrder() {
        if (!this.orderId) {
            this.redirectToHome();
            return;
        }

        const orders = JSON.parse(localStorage.getItem('blankshop_orders') || '[]');
        this.order = orders.find(order => order.id === this.orderId);

        if (!this.order) {
            this.redirectToHome();
            return;
        }
    }

    // Update cart count in header (should be 0 after successful order)
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
    }

    // Display order details
    displayOrderDetails() {
        if (!this.order) return;

        // Order number and date
        const orderNumberElement = document.getElementById('order-number');
        const orderDateElement = document.getElementById('order-date');
        const paymentMethodElement = document.getElementById('payment-method');

        if (orderNumberElement) orderNumberElement.textContent = this.order.id;
        if (orderDateElement) orderDateElement.textContent = this.formatDate(this.order.date);
        if (paymentMethodElement) paymentMethodElement.textContent = this.getPaymentMethodName(this.order.payment.method);

        // Order items
        this.displayOrderItems();

        // Order totals
        this.displayOrderTotals();

        // Shipping address
        this.displayShippingAddress();
    }

    // Display order items
    displayOrderItems() {
        const orderedItemsContainer = document.getElementById('ordered-items');
        if (!orderedItemsContainer || !this.order.items) return;

        orderedItemsContainer.innerHTML = this.order.items.map(item => `
            <div class="ordered-item">
                <div class="ordered-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="ordered-item-details">
                    <h4 class="ordered-item-name">${item.name}</h4>
                    <div class="ordered-item-info">
                        <span class="ordered-item-price">${item.price.toFixed(2)} zł</span>
                        <span class="ordered-item-quantity">× ${item.quantity}</span>
                    </div>
                </div>
                <div class="ordered-item-total">
                    ${(item.price * item.quantity).toFixed(2)} zł
                </div>
            </div>
        `).join('');
    }

    // Display order totals
    displayOrderTotals() {
        const finalTotalElement = document.getElementById('final-total');
        const discountInfo = document.getElementById('discount-info');
        const usedPromo = document.getElementById('used-promo');
        const discountValue = document.getElementById('discount-value');

        if (finalTotalElement) {
            finalTotalElement.textContent = `${this.order.total.toFixed(2)} zł`;
        }

        // Show discount information if applicable
        if (this.order.discount && this.order.discount > 0) {
            if (discountInfo) {
                discountInfo.style.display = 'flex';
            }
            if (usedPromo) {
                usedPromo.textContent = this.order.promoCode || '';
            }
            if (discountValue) {
                discountValue.textContent = `-${this.order.discount.toFixed(2)} zł`;
            }
        }
    }

    // Display shipping address
    displayShippingAddress() {
        const shippingAddressContainer = document.getElementById('shipping-address');
        if (!shippingAddressContainer || !this.order.shipping) return;

        const shipping = this.order.shipping;
        shippingAddressContainer.innerHTML = `
            <div class="address-details">
                <p class="recipient-name">${shipping.firstName} ${shipping.lastName}</p>
                <p class="address-line">${shipping.address}</p>
                <p class="address-line">${shipping.postalCode} ${shipping.city}</p>
                <p class="contact-info">
                    <i data-lucide="mail"></i> ${shipping.email}<br>
                    <i data-lucide="phone"></i> ${shipping.phone}
                </p>
            </div>
        `;

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('pl-PL', options);
    }

    // Get payment method display name
    getPaymentMethodName(method) {
        const methods = {
            'card': 'Karta płatnicza',
            'blik': 'BLIK',
            'transfer': 'Przelew bankowy',
            'paypal': 'PayPal'
        };
        return methods[method] || method;
    }

    // Redirect to home if order not found
    redirectToHome() {
        setTimeout(() => {
            window.location.href = './index.html';
        }, 3000);
        
        // Show error message
        const successContainer = document.querySelector('.success-container');
        if (successContainer) {
            successContainer.innerHTML = `
                <div class="error-icon">
                    <i data-lucide="x-circle"></i>
                </div>
                <h1 class="error-title">Zamówienie nie zostało znalezione</h1>
                <p class="error-subtitle">Przekierowanie do strony głównej...</p>
                <div class="error-actions">
                    <a href="./index.html" class="btn-primary">
                        <i data-lucide="home"></i>
                        Wróć do strony głównej
                    </a>
                </div>
            `;
            
            // Re-initialize Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }
}

// Initialize order success manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    const orderSuccessManager = new OrderSuccessManager();
    window.orderSuccessManager = orderSuccessManager;
});