// BLANK SHOP - Modern JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Lucide icons when available
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Main app initialization
function initializeApp() {
    initializeMobileMenu();
    initializeSearch();
    initializeFavorites();
    loadFeaturedProducts();
    initializeNewsletter();
    initializeSmoothScrolling();
    initializeFilters();
    initializeContactForm();
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const isOpen = mobileNav.classList.contains('active');
            
            // Update button icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterProducts(query);
        });
    }
}

// Product filtering
function filterProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const brand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || brand.includes(query) || query === '') {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// Favorites functionality
let favorites = JSON.parse(localStorage.getItem('blankShopFavorites')) || [];

function initializeFavorites() {
    updateFavoritesCount();
}

function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('blankShopFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
    updateFavoriteButtons();
}

function updateFavoritesCount() {
    const countElement = document.getElementById('favorites-count');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        const isFavorite = favorites.includes(productId);
        
        btn.classList.toggle('active', isFavorite);
        
        const icon = btn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isFavorite ? 'heart' : 'heart');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    });
}

// Old embedded data removed - now loading from JSON
;

// Load products from JSON file
function loadFeaturedProducts() {
    try {
        console.log('Loading products from JSON...');
        
        fetch('./data/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Products loaded successfully:', data.products.length);
                
                // Filter featured products or use first 12 products
                const featuredProducts = data.products.filter(product => product.featured === true);
                const productsToShow = featuredProducts.length > 0 ? featuredProducts : data.products.slice(0, 12);
                
                console.log('Products to display:', productsToShow.length);
                displayProducts(productsToShow);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                // Try to load embedded data as fallback
                loadEmbeddedProducts();
            });
    } catch (error) {
        console.error('Error in loadFeaturedProducts:', error);
        loadEmbeddedProducts();
    }
}

// Fallback embedded products (only 4 products for emergency)
function loadEmbeddedProducts() {
    console.log('Loading embedded fallback products...');
    
    const fallbackProducts = [
        {
            "id": 1,
            "title": "Nike Air Max 270 Damskie",
            "brand": { "name": "Nike" },
            "category": { "name": "Obuwie", "slug": "obuwie" },
            "basePrice": 679.00,
            "salePrice": 499.00,
            "featured": true,
            "images": [{ "url": "./images/products/nike-air-max-270.jpg", "alt": "Nike Air Max 270" }]
        },
        {
            "id": 2, 
            "title": "Zara Płaszcz Trench Damski",
            "brand": { "name": "Zara" },
            "category": { "name": "Moda damska", "slug": "damska" },
            "basePrice": 399.00,
            "salePrice": 259.00,
            "featured": true,
            "images": [{ "url": "./images/products/zara-coat.jpg", "alt": "Zara trench coat" }]
        },
        {
            "id": 3,
            "title": "Adidas Hoodie Premium", 
            "brand": { "name": "Adidas" },
            "category": { "name": "Moda męska", "slug": "meska" },
            "basePrice": 289.00,
            "salePrice": 199.00,
            "featured": true,
            "images": [{ "url": "./images/products/adidas-hoodie.jpg", "alt": "Adidas Hoodie" }]
        },
        {
            "id": 4,
            "title": "Skórzana Torebka Damska",
            "brand": { "name": "Premium Leather" },
            "category": { "name": "Akcesoria", "slug": "akcesoria" },
            "basePrice": 459.00,
            "salePrice": 329.00,
            "featured": true,
            "images": [{ "url": "./images/products/leather-bag.jpg", "alt": "Skórzana Torebka" }]
        }
    ];
    
    displayProducts(fallbackProducts);
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center">Brak produktów do wyświetlenia.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Initialize favorite buttons for new products
    initializeProductEvents();
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function createProductCard(product) {
    const discountPercent = product.salePrice 
        ? Math.round((product.basePrice - product.salePrice) / product.basePrice * 100)
        : 0;
    
    const mainImage = product.images && product.images.length > 0 
        ? product.images[0].url 
        : './images/placeholder.jpg';
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${mainImage}" alt="${product.title}" loading="lazy">
                <button class="favorite-btn" data-product-id="${product.id}" aria-label="Dodaj do ulubionych">
                    <i data-lucide="heart"></i>
                </button>
                ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
            </div>
            <div class="product-content">
                <div class="product-brand">${product.brand.name}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    ${product.salePrice ? `
                        <span class="current-price">${product.salePrice.toFixed(2)} zł</span>
                        <span class="original-price">${product.basePrice.toFixed(2)} zł</span>
                    ` : `
                        <span class="current-price">${product.basePrice.toFixed(2)} zł</span>
                    `}
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCartFromCard('${product.id}', '${product.title}', ${product.salePrice || product.basePrice}, ${product.basePrice}, '${mainImage}')" aria-label="Dodaj do koszyka">
                        <i data-lucide="shopping-bag"></i>
                        Dodaj do koszyka
                    </button>
                    <a href="product-details.html?id=${product.id}" class="btn-product">Zobacz szczegóły</a>
                </div>
            </div>
        </div>
    `;
}

function initializeProductEvents() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = parseInt(this.dataset.productId);
            toggleFavorite(productId);
        });
    });
    
    updateFavoriteButtons();
}

function displayErrorMessage() {
    const container = document.getElementById('products-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message text-center">
                <i data-lucide="alert-circle" class="error-icon"></i>
                <h3>Nie można załadować produktów</h3>
                <p>Przepraszamy za utrudnienia. Spróbuj odświeżyć stronę.</p>
                <button onclick="loadFeaturedProducts()" class="btn-primary">Spróbuj ponownie</button>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Newsletter functionality
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // Simulate subscription
                showNotification('Dziękujemy za zapisanie się do newslettera!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Podaj prawidłowy adres email.', 'error');
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header-modern')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Zamknij">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .error-message {
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .error-icon {
        width: 3rem;
        height: 3rem;
        margin: 0 auto 1rem;
        color: #ef4444;
    }
`;

document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.stat-item, .category-card, .product-card');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header-modern');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    });
}

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = './images/placeholder.jpg';
            this.alt = 'Zdjęcie niedostępne';
        });
    });
});

// Export functions for external use
window.BlankShop = {
    toggleFavorite,
    showNotification,
    loadFeaturedProducts
};

// Cart integration function
function addToCartFromCard(id, name, price, originalPrice, image) {
    if (typeof window.cartManager !== 'undefined') {
        const product = {
            id: id,
            name: name,
            price: price,
            originalPrice: originalPrice !== price ? originalPrice : null,
            image: image
        };
        window.cartManager.addToCart(product);
    } else {
        console.warn('Cart manager not available');
    }
}

// Make function globally available
window.addToCartFromCard = addToCartFromCard;

// Advanced Filters and Sorting
let currentFilters = {
    sort: 'featured',
    brand: '',
    size: '',
    maxPrice: 1000,
    search: ''
};

let allProducts = [];
let filteredProducts = [];

function initializeFilters() {
    const sortSelect = document.getElementById('sort-select');
    const brandFilter = document.getElementById('brand-filter');
    const sizeFilter = document.getElementById('size-filter');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const clearFiltersBtn = document.getElementById('clear-filters');

    if (!sortSelect) return; // Not on a category page

    // Load products for current category
    loadCategoryProducts();

    // Sort change handler
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyFilters();
        });
    }

    // Brand filter handler
    if (brandFilter) {
        brandFilter.addEventListener('change', function() {
            currentFilters.brand = this.value;
            applyFilters();
        });
    }

    // Size filter handler
    if (sizeFilter) {
        sizeFilter.addEventListener('change', function() {
            currentFilters.size = this.value;
            applyFilters();
        });
    }

    // Price filter handler
    if (priceFilter && priceValue) {
        priceFilter.addEventListener('input', function() {
            currentFilters.maxPrice = parseInt(this.value);
            priceValue.textContent = this.value + ' zł';
            applyFilters();
        });
    }

    // Clear filters handler
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
}

function loadCategoryProducts() {
    // Get current category from page
    const currentPage = window.location.pathname.split('/').pop();
    let categorySlug = '';

    switch (currentPage) {
        case 'obuwie.html':
            categorySlug = 'obuwie';
            break;
        case 'moda-damska.html':
            categorySlug = 'damska';  // POPRAWIONE: było 'moda-damska'
            break;
        case 'moda-meska.html':
            categorySlug = 'meska';   // POPRAWIONE: było 'moda-meska'
            break;
        case 'akcesoria.html':
            categorySlug = 'akcesoria';
            break;
        default:
            console.warn('Unknown category page:', currentPage);
            return;
    }

    console.log('Loading products for category:', categorySlug);

    // Load products from JSON
    fetch('./data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Total products loaded:', data.products.length);
            
            allProducts = data.products.filter(product => 
                product.category.slug === categorySlug
            );
            
            console.log('Products for category "' + categorySlug + '":', allProducts.length);
            
            filteredProducts = [...allProducts];
            
            // Initialize filters with available brands and sizes
            initializeCategoryFilters(data);
            
            applyFilters();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            displayErrorMessage();
        });
}

function applyFilters() {
    // Start with all products
    filteredProducts = [...allProducts];

    // Apply brand filter
    if (currentFilters.brand) {
        filteredProducts = filteredProducts.filter(product =>
            product.brand.slug === currentFilters.brand
        );
    }

    // Apply size filter
    if (currentFilters.size) {
        filteredProducts = filteredProducts.filter(product =>
            product.sizes && product.sizes.some(size => 
                size.size === currentFilters.size && size.stock > 0
            )
        );
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(product =>
        (product.salePrice || product.basePrice) <= currentFilters.maxPrice
    );

    // Apply search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.brand.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sorting
    switch (currentFilters.sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => 
                (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice)
            );
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => 
                (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice)
            );
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }

    // Update display
    updateProductsDisplay();
    updateActiveFilters();
}

function updateProductsDisplay() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i data-lucide="search-x"></i>
                <h3>Brak produktów</h3>
                <p>Nie znaleźliśmy produktów spełniających wybrane kryteria.</p>
                <button class="btn-primary" onclick="clearAllFilters()">Wyczyść filtry</button>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    const productsHTML = filteredProducts.map(product => {
        const isFavorite = favorites.includes(product.id);
        const price = product.salePrice || product.basePrice;
        const originalPrice = product.salePrice ? product.basePrice : null;
        const discount = originalPrice ? Math.round((1 - product.salePrice / product.basePrice) * 100) : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ''}
                ${product.featured ? '<div class="product-badge featured">POLECANE</div>' : ''}
                
                <div class="product-image">
                    <img src="${product.images[0]?.url || './images/placeholder.jpg'}" 
                         alt="${product.images[0]?.alt || product.title}"
                         width="300" height="300" loading="lazy">
                    
                    <div class="product-actions">
                        <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite(${product.id})" 
                                aria-label="Dodaj do ulubionych">
                            <i data-lucide="heart"></i>
                        </button>
                        <button class="action-btn cart-btn" 
                                onclick="addToCartFromCard(${product.id})" 
                                aria-label="Dodaj do koszyka">
                            <i data-lucide="shopping-cart"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-brand">${product.brand.name}</div>
                    <h3 class="product-title">
                        <a href="./produkt-${product.slug}.html">${product.title}</a>
                    </h3>
                    <p class="product-description">${product.shortDescription}</p>
                    
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="current-price">${price.toFixed(2)} zł</span>
                            ${originalPrice ? `<span class="original-price">${originalPrice.toFixed(2)} zł</span>` : ''}
                        </div>
                        
                        ${product.sizes ? `
                            <div class="product-sizes">
                                ${product.sizes.slice(0, 4).map(size => 
                                    `<span class="size-option ${size.stock > 0 ? '' : 'out-of-stock'}">${size.size}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    productsGrid.innerHTML = productsHTML;

    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Update favorites buttons
    updateFavoriteButtons();
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    if (!activeFiltersContainer) return;

    const activeTags = [];

    if (currentFilters.brand) {
        const brandName = document.querySelector(`#brand-filter option[value="${currentFilters.brand}"]`)?.textContent;
        activeTags.push({
            label: `Marka: ${brandName}`,
            type: 'brand'
        });
    }

    if (currentFilters.size) {
        activeTags.push({
            label: `Rozmiar: ${currentFilters.size}`,
            type: 'size'
        });
    }

    if (currentFilters.maxPrice < 1000) {
        activeTags.push({
            label: `Max cena: ${currentFilters.maxPrice} zł`,
            type: 'price'
        });
    }

    if (currentFilters.sort !== 'featured') {
        const sortName = document.querySelector(`#sort-select option[value="${currentFilters.sort}"]`)?.textContent;
        activeTags.push({
            label: `Sortowanie: ${sortName}`,
            type: 'sort'
        });
    }

    const tagsHTML = activeTags.map(tag => `
        <div class="filter-tag">
            ${tag.label}
            <button class="filter-tag-remove" onclick="removeFilter('${tag.type}')">×</button>
        </div>
    `).join('');

    activeFiltersContainer.innerHTML = tagsHTML;
}

function removeFilter(type) {
    switch (type) {
        case 'brand':
            currentFilters.brand = '';
            document.getElementById('brand-filter').value = '';
            break;
        case 'size':
            currentFilters.size = '';
            document.getElementById('size-filter').value = '';
            break;
        case 'price':
            currentFilters.maxPrice = 1000;
            document.getElementById('price-filter').value = 1000;
            document.getElementById('price-value').textContent = '1000 zł';
            break;
        case 'sort':
            currentFilters.sort = 'featured';
            document.getElementById('sort-select').value = 'featured';
            break;
    }
    applyFilters();
}

function clearAllFilters() {
    currentFilters = {
        sort: 'featured',
        brand: '',
        size: '',
        maxPrice: 1000,
        search: ''
    };

    // Reset form elements
    const sortSelect = document.getElementById('sort-select');
    const brandFilter = document.getElementById('brand-filter');
    const sizeFilter = document.getElementById('size-filter');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');

    if (sortSelect) sortSelect.value = 'featured';
    if (brandFilter) brandFilter.value = '';
    if (sizeFilter) sizeFilter.value = '';
    if (priceFilter) priceFilter.value = 1000;
    if (priceValue) priceValue.textContent = '1000 zł';

    applyFilters();
}

// Make functions globally available
window.removeFilter = removeFilter;
window.clearAllFilters = clearAllFilters;

// Contact Form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'subject', 'message'];
            const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
            
            if (missingFields.length > 0) {
                showNotification('Proszę wypełnić wszystkie wymagane pola.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(data.email)) {
                showNotification('Proszę podać prawidłowy adres email.', 'error');
                return;
            }
            
            // Check consent
            if (!data.consent) {
                showNotification('Proszę zaakceptować politykę prywatności.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wysyłanie...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                showNotification('Wiadomość została wysłana pomyślnie! Odpowiemy w ciągu 24 godzin.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Enhanced Newsletter with more options
function enhanceNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        // Add GDPR consent if not exists
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        
        // Check if consent doesn't exist
        if (!newsletterForm.querySelector('.newsletter-consent')) {
            const consentHtml = `
                <div class="newsletter-consent">
                    <label class="checkbox-label">
                        <input type="checkbox" name="newsletter-consent" required>
                        <span class="checkmark"></span>
                        Wyrażam zgodę na otrzymywanie newslettera zgodnie z 
                        <a href="./polityka-prywatnosci.html" target="_blank">Polityką Prywatności</a>
                    </label>
                </div>
            `;
            
            // Insert before submit button
            submitBtn.insertAdjacentHTML('beforebegin', consentHtml);
        }
    }
}

// Initialize category filters with data from JSON
function initializeCategoryFilters(data) {
    const brandFilter = document.getElementById('brand-filter');
    
    if (brandFilter && allProducts.length > 0) {
        // Get unique brands from current category products
        const brands = [...new Set(allProducts.map(p => p.brand.name))].sort();
        
        // Clear existing options except "Wszystkie marki"
        const currentOptions = brandFilter.innerHTML;
        const firstOption = '<option value="">Wszystkie marki</option>';
        
        brandFilter.innerHTML = firstOption + brands.map(brand => 
            `<option value="${brand.toLowerCase().replace(/\s+/g, '-')}">${brand}</option>`
        ).join('');
        
        console.log('Initialized brand filter with', brands.length, 'brands');
    }
}

