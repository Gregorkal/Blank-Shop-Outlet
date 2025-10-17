// Cart Management JavaScript
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.renderCart();
        this.setupEventListeners();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('blankshop_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('blankshop_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} dodano do koszyka!`);
        this.renderCart();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getCartItemCount();
        }
    }

    // Render cart items
    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');

        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';

        cartItemsContainer.innerHTML = this.cart.map(item => this.renderCartItem(item)).join('');
        this.updateCartSummary();
    }

    // Render individual cart item
    renderCartItem(item) {
        const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">
                        <span class="current-price">${item.price.toFixed(2)} zł</span>
                        ${item.originalPrice ? `<span class="original-price">${item.originalPrice.toFixed(2)} zł</span>` : ''}
                        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                    </div>
                </div>
                
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i data-lucide="minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                    
                    <div class="item-total">
                        ${(item.price * item.quantity).toFixed(2)} zł
                    </div>
                    
                    <button class="remove-btn" onclick="cartManager.removeFromCart('${item.id}')" aria-label="Usuń produkt">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Update cart summary
    updateCartSummary() {
        const totalItemsElement = document.getElementById('total-items');
        const subtotalElement = document.getElementById('subtotal');
        const totalPriceElement = document.getElementById('total-price');

        const itemCount = this.getCartItemCount();
        const total = this.getCartTotal();

        if (totalItemsElement) totalItemsElement.textContent = itemCount;
        if (subtotalElement) subtotalElement.textContent = `${total.toFixed(2)} zł`;
        if (totalPriceElement) totalPriceElement.textContent = `${total.toFixed(2)} zł`;
    }

    // Setup event listeners
    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showNotification('Dodaj produkty do koszyka przed przejściem do płatności', 'warning');
                    return;
                }
                // Redirect to checkout page
                window.location.href = './checkout.html';
            });
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Initialize icon
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Export for use in other scripts
window.cartManager = cartManager;

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    cartManager.updateCartCount();
    
    // Re-initialize Lucide icons after rendering
    if (window.lucide) {
        window.lucide.createIcons();
    }
});