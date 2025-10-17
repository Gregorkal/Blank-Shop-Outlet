// Checkout Management JavaScript
class CheckoutManager {
    constructor() {
        this.cart = this.loadCart();
        this.promoCode = null;
        this.discountAmount = 0;
        this.promoCodes = {
            'WELCOME10': { discount: 0.10, description: '10% zniżki' },
            'SAVE20': { discount: 0.20, description: '20% zniżki' },
            'NEWCLIENT': { discount: 0.15, description: '15% zniżki' },
            'BLACKFRIDAY': { discount: 0.30, description: '30% zniżki' }
        };
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.setupEventListeners();
        this.setupFormValidation();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('blankshop_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const itemCount = this.cart.reduce((count, item) => count + item.quantity, 0);
            cartCountElement.textContent = itemCount;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Payment method change
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => this.handlePaymentMethodChange());
        });

        // Promo code
        const applyPromoBtn = document.getElementById('apply-promo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Form submission
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => this.formatExpiryDate(e));
        }

        // BLIK code formatting
        const blikInput = document.getElementById('blikCode');
        if (blikInput) {
            blikInput.addEventListener('input', (e) => this.formatBlikCode(e));
        }

        // Postal code formatting
        const postalCodeInput = document.getElementById('postalCode');
        if (postalCodeInput) {
            postalCodeInput.addEventListener('input', (e) => this.formatPostalCode(e));
        }
    }

    // Handle payment method change
    handlePaymentMethodChange() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const cardDetails = document.getElementById('card-details');
        const blikDetails = document.getElementById('blik-details');
        const transferDetails = document.getElementById('transfer-details');

        // Hide all payment details
        cardDetails.style.display = 'none';
        blikDetails.style.display = 'none';
        if (transferDetails) transferDetails.style.display = 'none';

        // Show relevant payment details
        switch (selectedMethod) {
            case 'card':
                cardDetails.style.display = 'block';
                break;
            case 'blik':
                blikDetails.style.display = 'block';
                break;
            case 'transfer':
                if (transferDetails) transferDetails.style.display = 'block';
                break;
        }

        // Update required fields
        this.updateRequiredFields(selectedMethod);
    }

    // Update required fields based on payment method
    updateRequiredFields(paymentMethod) {
        const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        const blikFields = ['blikCode'];

        // Reset all payment fields
        [...cardFields, ...blikFields].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.removeAttribute('required');
            }
        });

        // Set required fields based on payment method
        if (paymentMethod === 'card') {
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.setAttribute('required', 'true');
                }
            });
        } else if (paymentMethod === 'blik') {
            blikFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.setAttribute('required', 'true');
                }
            });
        }
    }

    // Format card number input
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }

    // Format expiry date input
    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    // Format BLIK code input
    formatBlikCode(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 3) {
            value = value.substring(0, 3) + ' ' + value.substring(3, 6);
        }
        e.target.value = value;
    }

    // Format postal code input
    formatPostalCode(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '-' + value.substring(2, 5);
        }
        e.target.value = value;
    }

    // Apply promo code
    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const code = promoInput.value.trim().toUpperCase();

        if (!code) {
            this.showNotification('Wprowadź kod rabatowy', 'warning');
            return;
        }

        if (this.promoCodes[code]) {
            this.promoCode = code;
            this.discountAmount = this.calculateSubtotal() * this.promoCodes[code].discount;
            this.updateOrderTotals();
            this.showNotification(`Kod rabatowy zastosowany: ${this.promoCodes[code].description}`, 'success');
            promoInput.disabled = true;
            document.getElementById('apply-promo').textContent = 'Zastosowano';
        } else {
            this.showNotification('Nieprawidłowy kod rabatowy', 'error');
        }
    }

    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Render order summary
    renderOrderSummary() {
        const orderItemsContainer = document.getElementById('order-items');
        if (!orderItemsContainer) return;

        if (this.cart.length === 0) {
            orderItemsContainer.innerHTML = '<p class="empty-order">Brak produktów w koszyku</p>';
            return;
        }

        orderItemsContainer.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p class="order-item-price">${item.price.toFixed(2)} zł × ${item.quantity}</p>
                </div>
                <div class="order-item-total">
                    ${(item.price * item.quantity).toFixed(2)} zł
                </div>
            </div>
        `).join('');

        this.updateOrderTotals();
    }

    // Update order totals
    updateOrderTotals() {
        const totalItemsElement = document.getElementById('total-items');
        const subtotalElement = document.getElementById('subtotal');
        const totalPriceElement = document.getElementById('total-price');
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        const discountCode = document.getElementById('discount-code');

        const itemCount = this.cart.reduce((count, item) => count + item.quantity, 0);
        const subtotal = this.calculateSubtotal();
        const total = subtotal - this.discountAmount;

        if (totalItemsElement) totalItemsElement.textContent = itemCount;
        if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} zł`;
        if (totalPriceElement) totalPriceElement.textContent = `${total.toFixed(2)} zł`;

        // Show/hide discount row
        if (this.discountAmount > 0) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = `-${this.discountAmount.toFixed(2)} zł`;
            discountCode.textContent = this.promoCode;
        } else {
            discountRow.style.display = 'none';
        }
    }

    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById('checkout-form');
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Check if required field is empty
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'To pole jest wymagane';
        }

        // Specific validation rules
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Nieprawidłowy adres e-mail';
                }
                break;

            case 'tel':
                const phoneRegex = /^[0-9+\-\s()]{9,15}$/;
                if (value && !phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Nieprawidłowy numer telefonu';
                }
                break;
        }

        // Custom validation for specific fields
        if (field.id === 'postalCode' && value) {
            const postalRegex = /^[0-9]{2}-[0-9]{3}$/;
            if (!postalRegex.test(value)) {
                isValid = false;
                errorMessage = 'Kod pocztowy powinien mieć format XX-XXX';
            }
        }

        if (field.id === 'cardNumber' && value) {
            const cardRegex = /^[0-9\s]{13,19}$/;
            if (!cardRegex.test(value)) {
                isValid = false;
                errorMessage = 'Nieprawidłowy numer karty';
            }
        }

        if (field.id === 'expiryDate' && value) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(value)) {
                isValid = false;
                errorMessage = 'Data ważności powinna mieć format MM/YY';
            }
        }

        if (field.id === 'cvv' && value) {
            const cvvRegex = /^[0-9]{3,4}$/;
            if (!cvvRegex.test(value)) {
                isValid = false;
                errorMessage = 'CVV powinien mieć 3-4 cyfry';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Show field error
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();

        // Validate all required fields
        const form = e.target;
        const requiredFields = form.querySelectorAll('input[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        // Check terms checkbox
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            isFormValid = false;
            this.showNotification('Musisz zaakceptować regulamin sklepu', 'warning');
        }

        if (!isFormValid) {
            this.showNotification('Sprawdź poprawność wprowadzonych danych', 'error');
            return;
        }

        if (this.cart.length === 0) {
            this.showNotification('Brak produktów w koszyku', 'warning');
            return;
        }

        // Process order
        this.processOrder(form);
    }

    // Process order
    processOrder(form) {
        const submitBtn = document.getElementById('submit-order');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Przetwarzanie...';

        // Simulate payment processing
        setTimeout(() => {
            const formData = new FormData(form);
            const orderData = {
                id: this.generateOrderId(),
                date: new Date().toISOString(),
                items: this.cart,
                total: this.calculateSubtotal() - this.discountAmount,
                shipping: this.getFormData(formData),
                payment: {
                    method: formData.get('paymentMethod'),
                    status: 'completed'
                },
                promoCode: this.promoCode,
                discount: this.discountAmount
            };

            // Save order to localStorage
            this.saveOrder(orderData);

            // Clear cart
            localStorage.removeItem('blankshop_cart');

            // Redirect to success page
            this.redirectToSuccess(orderData.id);

        }, 2000);
    }

    // Get form data
    getFormData(formData) {
        return {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode')
        };
    }

    // Generate order ID
    generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    // Save order to localStorage
    saveOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('blankshop_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('blankshop_orders', JSON.stringify(orders));
    }

    // Redirect to success page
    redirectToSuccess(orderId) {
        window.location.href = `./order-success.html?order=${orderId}`;
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'x-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        if (window.lucide) {
            window.lucide.createIcons();
        }

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize checkout manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    const checkoutManager = new CheckoutManager();
    window.checkoutManager = checkoutManager;
});