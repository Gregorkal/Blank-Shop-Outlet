// Favorites Page JavaScript for BLANK SHOP

// Product data (copied from app.js for consistency)
const productsData = {
  "products": [
    {
      "id": 1,
      "title": "Nike Air Max 270 Damskie",
      "slug": "nike-air-max-270-damskie",
      "description": "Kultowe Nike Air Max 270 w kolorowej edycji damskiej. Doskonała amortyzacja i nowoczesny design. Wyjątkowa kolorystyka z kolorowymi sznurówkami.",
      "shortDescription": "Kultowe Nike Air Max 270 w kolorowej edycji",
      "brand": {
        "id": 1,
        "name": "Nike",
        "slug": "nike"
      },
      "category": {
        "id": 1,
        "name": "Obuwie",
        "slug": "obuwie"
      },
      "basePrice": 679.00,
      "salePrice": 499.00,
      "condition": "NEW",
      "featured": true,
      "images": [
        {
          "id": 1,
          "url": "./images/products/nike-air-max-270.jpg",
          "alt": "Nike Air Max 270 - kolorowa edycja damska",
          "order": 1
        }
      ]
    },
    {
      "id": 2,
      "title": "Zara Płaszcz Trench Damski",
      "slug": "zara-plaszcz-trench-damski",
      "description": "Elegancki trench coat w granatowym kolorze. Ponadczasowy styl i doskonała jakość. Klasyczny krój z paskiem w talii.",
      "shortDescription": "Elegancki trench coat w granatowym kolorze",
      "brand": {
        "id": 2,
        "name": "Zara",
        "slug": "zara"
      },
      "category": {
        "id": 2,
        "name": "Moda damska",
        "slug": "damska"
      },
      "basePrice": 399.00,
      "salePrice": 259.00,
      "condition": "NEW",
      "featured": true,
      "images": [
        {
          "id": 3,
          "url": "./images/products/zara-coat.jpg",
          "alt": "Zara trench coat - granatowy",
          "order": 1
        }
      ]
    },
    {
      "id": 3,
      "title": "Adidas Hoodie Premium",
      "slug": "adidas-hoodie-premium",
      "description": "Wygodna bluza z kapturem marki Adidas. Wykonana z wysokiej jakości materiałów. Doskonała na chłodniejsze dni.",
      "shortDescription": "Wygodna bluza z kapturem marki Adidas",
      "brand": {
        "id": 3,
        "name": "Adidas",
        "slug": "adidas"
      },
      "category": {
        "id": 3,
        "name": "Moda męska",
        "slug": "meska"
      },
      "basePrice": 289.00,
      "salePrice": 199.00,
      "condition": "NEW",
      "featured": true,
      "images": [
        {
          "id": 4,
          "url": "./images/products/adidas-hoodie.jpg",
          "alt": "Adidas Hoodie Premium",
          "order": 1
        }
      ]
    },
    {
      "id": 4,
      "title": "Skórzana Torebka Damska",
      "slug": "skorzana-torebka-damska",
      "description": "Elegancka skórzana torebka w kolorze brązowym. Praktyczna i stylowa. Doskonała do codziennego użytku.",
      "shortDescription": "Elegancka skórzana torebka w kolorze brązowym",
      "brand": {
        "id": 4,
        "name": "Premium Leather",
        "slug": "premium-leather"
      },
      "category": {
        "id": 4,
        "name": "Akcesoria",
        "slug": "akcesoria"
      },
      "basePrice": 459.00,
      "salePrice": 329.00,
      "condition": "NEW",
      "featured": true,
      "images": [
        {
          "id": 5,
          "url": "./images/products/leather-bag.jpg",
          "alt": "Skórzana Torebka Damska",
          "order": 1
        }
      ]
    }
  ]
};

// Current state
let favorites = JSON.parse(localStorage.getItem('blankShopFavorites')) || [];
let currentView = 'grid';
let currentSort = 'date'; // date, price-low, price-high, name

// DOM elements
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const favoritesContent = document.getElementById('favorites-content');
const searchInput = document.getElementById('search-input');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeFavoritesPage();
    initializeMobileMenu();
    initializeSearch();
});

// Initialize the favorites page
function initializeFavoritesPage() {
    // Simulate loading
    setTimeout(() => {
        loadFavoriteProducts();
        updateFavoritesCount();
        updatePageStats();
        
        loadingState.style.display = 'none';
        
        if (favorites.length === 0) {
            emptyState.style.display = 'flex';
            favoritesContent.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            favoritesContent.style.display = 'grid';
        }
    }, 800);
}

// Load and display favorite products
function loadFavoriteProducts() {
    if (favorites.length === 0) return;
    
    // Get favorite products from data
    const favoriteProducts = productsData.products.filter(product => 
        favorites.includes(product.id)
    );
    
    // Sort products
    const sortedProducts = sortProducts(favoriteProducts);
    
    // Display products
    displayFavoriteProducts(sortedProducts);
    
    // Update view buttons
    updateViewButtons();
}

// Sort products based on current sort setting
function sortProducts(products) {
    switch(currentSort) {
        case 'price-low':
            return products.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
        case 'price-high':
            return products.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
        case 'name':
            return products.sort((a, b) => a.title.localeCompare(b.title));
        case 'date':
        default:
            // Keep the order they were added (reverse order of favorites array)
            return products.sort((a, b) => favorites.indexOf(b.id) - favorites.indexOf(a.id));
    }
}

// Display favorite products
function displayFavoriteProducts(products) {
    if (!favoritesContent) return;
    
    favoritesContent.className = `favorites-${currentView}`;
    favoritesContent.innerHTML = products.map(product => createFavoriteCard(product)).join('');
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Create product card for favorites
function createFavoriteCard(product) {
    const discountPercent = product.salePrice 
        ? Math.round((product.basePrice - product.salePrice) / product.basePrice * 100)
        : 0;
    
    const mainImage = product.images && product.images.length > 0 
        ? product.images[0].url 
        : './images/placeholder.jpg';
    
    const savings = product.salePrice ? product.basePrice - product.salePrice : 0;
    
    return `
        <div class="favorite-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${mainImage}" alt="${product.title}" loading="lazy">
                <button class="remove-favorite" onclick="removeFavorite(${product.id})" aria-label="Usuń z ulubionych">
                    <i data-lucide="x"></i>
                </button>
                ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
            </div>
            <div class="product-content">
                <div class="product-brand">${product.brand.name}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.shortDescription}</p>
                <div class="product-price">
                    ${product.salePrice ? `
                        <span class="current-price">${product.salePrice.toFixed(2)} zł</span>
                        <span class="original-price">${product.basePrice.toFixed(2)} zł</span>
                    ` : `
                        <span class="current-price">${product.basePrice.toFixed(2)} zł</span>
                    `}
                </div>
                ${savings > 0 ? `
                    <div class="savings-badge">
                        <i data-lucide="tag"></i>
                        Oszczędzasz ${savings.toFixed(2)} zł
                    </div>
                ` : ''}
                <div class="product-actions">
                    <a href="product-details.html?id=${product.id}" class="btn-primary">
                        <i data-lucide="eye"></i>
                        Zobacz szczegóły
                    </a>
                    <button class="btn-secondary" onclick="removeFavorite(${product.id})">
                        <i data-lucide="heart-off"></i>
                        Usuń
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update favorites count in header
function updateFavoritesCount() {
    const countElement = document.getElementById('favorites-count');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

// Update page statistics
function updatePageStats() {
    const totalFavoritesEl = document.getElementById('total-favorites');
    const totalSavingsEl = document.getElementById('total-savings');
    
    if (totalFavoritesEl) {
        totalFavoritesEl.textContent = favorites.length;
    }
    
    if (totalSavingsEl) {
        const favoriteProducts = productsData.products.filter(product => 
            favorites.includes(product.id)
        );
        
        const totalSavings = favoriteProducts.reduce((sum, product) => {
            if (product.salePrice && product.salePrice < product.basePrice) {
                return sum + (product.basePrice - product.salePrice);
            }
            return sum;
        }, 0);
        
        totalSavingsEl.textContent = `${totalSavings.toFixed(2)} zł`;
    }
}

// Remove product from favorites
function removeFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('blankShopFavorites', JSON.stringify(favorites));
        
        // Update UI
        updateFavoritesCount();
        updatePageStats();
        
        // Reload page content
        if (favorites.length === 0) {
            favoritesContent.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            loadFavoriteProducts();
        }
        
        showNotification('Produkt usunięty z ulubionych', 'info');
    }
}

// Clear all favorites
function clearAllFavorites() {
    document.getElementById('clear-modal').style.display = 'flex';
}

function closeClearModal() {
    document.getElementById('clear-modal').style.display = 'none';
}

function confirmClearAll() {
    favorites = [];
    localStorage.setItem('blankShopFavorites', JSON.stringify(favorites));
    
    updateFavoritesCount();
    updatePageStats();
    
    favoritesContent.style.display = 'none';
    emptyState.style.display = 'flex';
    
    closeClearModal();
    showNotification('Wszystkie ulubione produkty zostały usunięte', 'info');
}

// Toggle sort order
function toggleSort() {
    const sortOptions = ['date', 'price-low', 'price-high', 'name'];
    const currentIndex = sortOptions.indexOf(currentSort);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    currentSort = sortOptions[nextIndex];
    
    // Update sort button text
    const sortBtn = document.getElementById('sort-btn');
    const sortLabels = {
        'date': 'Data dodania',
        'price-low': 'Cena: rosnąco',
        'price-high': 'Cena: malejąco',
        'name': 'Nazwa A-Z'
    };
    
    if (sortBtn) {
        sortBtn.innerHTML = `<i data-lucide="arrow-up-down"></i> ${sortLabels[currentSort]}`;
    }
    
    // Reload products with new sort
    if (favorites.length > 0) {
        loadFavoriteProducts();
    }
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Toggle view mode
function toggleView(viewType) {
    currentView = viewType;
    updateViewButtons();
    
    if (favorites.length > 0) {
        loadFavoriteProducts();
    }
}

function updateViewButtons() {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    
    if (gridBtn && listBtn) {
        gridBtn.classList.toggle('active', currentView === 'grid');
        listBtn.classList.toggle('active', currentView === 'list');
    }
}

// Search functionality
function initializeSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterFavoriteProducts(query);
        });
    }
}

function filterFavoriteProducts(query) {
    const productCards = document.querySelectorAll('.favorite-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const brand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || brand.includes(query) || description.includes(query) || query === '') {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const isOpen = mobileNav.classList.contains('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
        
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

// Notification system
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Zamknij">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('clear-modal');
    if (e.target === modal) {
        closeClearModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'Escape':
            const modal = document.getElementById('clear-modal');
            if (modal && modal.style.display === 'flex') {
                closeClearModal();
            }
            break;
        case '/':
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
            break;
    }
});
