// Product Details JavaScript for BLANK SHOP

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
let currentProduct = null;
let currentImageIndex = 0;
let favorites = JSON.parse(localStorage.getItem('blankShopFavorites')) || [];

// DOM elements
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const productContent = document.getElementById('product-content');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    updateFavoritesCount();
});

// Get product ID from URL parameters
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load product details
function loadProductDetails() {
    const productId = getProductIdFromURL();
    
    if (!productId) {
        showError();
        return;
    }
    
    // Find product by ID
    currentProduct = productsData.products.find(p => p.id === productId);
    
    if (!currentProduct) {
        showError();
        return;
    }
    
    // Display product
    displayProduct();
}

// Show error state
function showError() {
    loadingState.style.display = 'none';
    errorState.style.display = 'flex';
    productContent.style.display = 'none';
    
    // Update page title
    document.title = 'Produkt nie znaleziony - BLANK SHOP';
}

// Display product
function displayProduct() {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    productContent.style.display = 'block';
    
    // Update page title and meta
    updatePageMeta();
    
    // Update breadcrumbs
    updateBreadcrumbs();
    
    // Display product info
    displayProductInfo();
    
    // Display images
    displayProductImages();
    
    // Update favorite button
    updateFavoriteButton();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Update page meta information
function updatePageMeta() {
    const title = `${currentProduct.title} - BLANK SHOP`;
    const description = currentProduct.description;
    const image = currentProduct.images[0]?.url || './images/placeholder.jpg';
    
    // Update title
    document.title = title;
    document.getElementById('page-title').textContent = title;
    
    // Update meta tags
    document.getElementById('page-description').setAttribute('content', description);
    document.getElementById('page-keywords').setAttribute('content', 
        `${currentProduct.brand.name}, ${currentProduct.category.name}, outlet, promocja`);
    
    // Update Open Graph
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-description').setAttribute('content', description);
    document.getElementById('og-image').setAttribute('content', image);
}

// Update breadcrumbs
function updateBreadcrumbs() {
    document.getElementById('breadcrumb-category').textContent = currentProduct.category.name;
    document.getElementById('breadcrumb-product').textContent = currentProduct.title;
}

// Display product information
function displayProductInfo() {
    // Product header
    document.getElementById('product-brand').textContent = currentProduct.brand.name;
    document.getElementById('product-title').textContent = currentProduct.title;
    document.getElementById('product-description').textContent = currentProduct.description;
    
    // Pricing
    const currentPriceEl = document.getElementById('current-price');
    const originalPriceEl = document.getElementById('original-price');
    const savingsEl = document.getElementById('savings');
    const badgeEl = document.getElementById('product-badge');
    
    if (currentProduct.salePrice && currentProduct.salePrice < currentProduct.basePrice) {
        // Sale price
        currentPriceEl.textContent = `${currentProduct.salePrice.toFixed(2)} zł`;
        originalPriceEl.textContent = `${currentProduct.basePrice.toFixed(2)} zł`;
        originalPriceEl.style.display = 'inline';
        
        // Calculate savings
        const savings = currentProduct.basePrice - currentProduct.salePrice;
        const discountPercent = Math.round((savings / currentProduct.basePrice) * 100);
        
        savingsEl.querySelector('.savings-amount').textContent = `${savings.toFixed(2)} zł`;
        savingsEl.style.display = 'block';
        
        // Show discount badge
        badgeEl.querySelector('.badge-text').textContent = `-${discountPercent}%`;
        badgeEl.style.display = 'block';
    } else {
        // Regular price
        currentPriceEl.textContent = `${currentProduct.basePrice.toFixed(2)} zł`;
        originalPriceEl.style.display = 'none';
        savingsEl.style.display = 'none';
        badgeEl.style.display = 'none';
    }
    
    // Condition
    const conditionText = currentProduct.condition === 'NEW' ? 'Nowy' : 'Używany';
    document.getElementById('product-condition').textContent = conditionText;
}

// Display product images
function displayProductImages() {
    const images = currentProduct.images || [{url: './images/placeholder.jpg', alt: currentProduct.title}];
    
    // Set main image
    const mainImage = document.getElementById('main-image');
    mainImage.src = images[0].url;
    mainImage.alt = images[0].alt || currentProduct.title;
    
    // Update image counter
    document.getElementById('current-image').textContent = '1';
    document.getElementById('total-images').textContent = images.length.toString();
    
    // Generate thumbnails (if multiple images)
    const thumbnailsContainer = document.getElementById('thumbnails');
    if (images.length > 1) {
        thumbnailsContainer.innerHTML = images.map((image, index) => `
            <button class="thumbnail ${index === 0 ? 'active' : ''}" onclick="setMainImage(${index})">
                <img src="${image.url}" alt="${image.alt || currentProduct.title}">
            </button>
        `).join('');
        thumbnailsContainer.style.display = 'flex';
    } else {
        thumbnailsContainer.style.display = 'none';
    }
}

// Image gallery functions
function setMainImage(index) {
    const images = currentProduct.images;
    if (index < 0 || index >= images.length) return;
    
    currentImageIndex = index;
    
    // Update main image
    const mainImage = document.getElementById('main-image');
    mainImage.src = images[index].url;
    mainImage.alt = images[index].alt || currentProduct.title;
    
    // Update counter
    document.getElementById('current-image').textContent = (index + 1).toString();
    
    // Update thumbnails
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function nextImage() {
    const images = currentProduct.images;
    const nextIndex = (currentImageIndex + 1) % images.length;
    setMainImage(nextIndex);
}

function previousImage() {
    const images = currentProduct.images;
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setMainImage(prevIndex);
}

// Favorites functionality
function toggleFavorite() {
    if (!currentProduct) return;
    
    const productId = currentProduct.id;
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        showNotification('Dodano do ulubionych!', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Usunięto z ulubionych!', 'info');
    }
    
    localStorage.setItem('blankShopFavorites', JSON.stringify(favorites));
    updateFavoriteButton();
    updateFavoritesCount();
}

function updateFavoriteButton() {
    if (!currentProduct) return;
    
    const favoriteBtn = document.getElementById('favorite-btn');
    const favoriteToggle = document.querySelector('.favorite-toggle');
    const isFavorite = favorites.includes(currentProduct.id);
    
    // Update header button
    if (favoriteBtn) {
        favoriteBtn.classList.toggle('active', isFavorite);
        const icon = favoriteBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isFavorite ? 'heart' : 'heart');
        }
    }
    
    // Update toggle button text
    if (favoriteToggle) {
        const text = isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
        favoriteToggle.innerHTML = `<i data-lucide="heart"></i> ${text}`;
        favoriteToggle.classList.toggle('active', isFavorite);
    }
}

function updateFavoritesCount() {
    const countElement = document.getElementById('favorites-count');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

// Contact functionality
function contactAboutProduct() {
    document.getElementById('contact-modal').style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contact-modal').style.display = 'none';
}

// Share functionality
function shareProduct() {
    if (navigator.share && currentProduct) {
        navigator.share({
            title: currentProduct.title,
            text: currentProduct.shortDescription,
            url: window.location.href
        });
    } else {
        copyLink();
    }
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Sprawdź ten produkt: ${currentProduct.title}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Link skopiowany do schowka!', 'success');
    }).catch(() => {
        showNotification('Nie można skopiować linka', 'error');
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
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Zamknij">&times;</button>
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
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!currentProduct || !currentProduct.images) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousImage();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextImage();
            break;
        case 'Escape':
            const modal = document.getElementById('contact-modal');
            if (modal.style.display === 'flex') {
                closeContactModal();
            }
            break;
    }
});

// Close modal when clicking outside
document.getElementById('contact-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeContactModal();
    }
});
