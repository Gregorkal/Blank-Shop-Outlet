// Product page JavaScript for BLANK SHOP

// Product images
const productImages = [
    {
        src: './images/products/nike-air-max-270.jpg',
        alt: 'Nike Air Max 270 - widok z boku'
    },
    {
        src: './images/products/nike-air-max-270.jpg', 
        alt: 'Nike Air Max 270 - widok z przodu'
    },
    {
        src: './images/products/nike-air-max-270.jpg',
        alt: 'Nike Air Max 270 - widok z tyłu'
    },
    {
        src: './images/products/nike-air-max-270.jpg',
        alt: 'Nike Air Max 270 - szczegół podeszwy'
    }
];

// Current state
let currentImageIndex = 0;
let selectedSize = null;
let selectedVariant = null;
let favorites = JSON.parse(localStorage.getItem('blankshop_favorites') || '[]');

// DOM elements
const mainImage = document.getElementById('mainImage');
const imageCounter = document.getElementById('imageCounter');
const contactBtn = document.getElementById('contactBtn');
const backToTopBtn = document.getElementById('backToTop');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateFavoriteButton();
    updateBackToTopButton();
    
    // Add scroll listener for back to top button
    window.addEventListener('scroll', updateBackToTopButton);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
});

// Image gallery functions
function setMainImage(index) {
    if (index < 0 || index >= productImages.length) return;
    
    currentImageIndex = index;
    
    // Update main image
    mainImage.src = productImages[index].src;
    mainImage.alt = productImages[index].alt;
    
    // Update image counter
    imageCounter.textContent = `${index + 1} / ${productImages.length}`;
    
    // Update thumbnail active state
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('border-green-500');
            thumb.classList.remove('border-transparent');
        } else {
            thumb.classList.remove('border-green-500');
            thumb.classList.add('border-transparent');
        }
    });
}

function nextImage() {
    const nextIndex = (currentImageIndex + 1) % productImages.length;
    setMainImage(nextIndex);
}

function previousImage() {
    const prevIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    setMainImage(prevIndex);
}

// Size selection
function selectSize(button, size) {
    // Remove active class from all size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white', 'border-green-600');
        btn.classList.add('border-gray-300');
    });
    
    // Add active class to selected button
    button.classList.add('bg-green-600', 'text-white', 'border-green-600');
    button.classList.remove('border-gray-300');
    
    selectedSize = size;
    updateContactButton();
    
    showNotification(`Wybrano rozmiar: ${size}`);
}

// Variant selection
function selectVariant(button, variant) {
    // Remove active class from all variant buttons
    document.querySelectorAll('.variant-btn').forEach(btn => {
        btn.classList.remove('border-green-500', 'bg-green-50');
        btn.classList.add('border-gray-300');
    });
    
    // Add active class to selected button
    button.classList.add('border-green-500', 'bg-green-50');
    button.classList.remove('border-gray-300');
    
    selectedVariant = variant;
    updateContactButton();
    
    const variantName = button.querySelector('.font-medium').textContent;
    showNotification(`Wybrano: ${variantName}`);
}

// Update contact button state
function updateContactButton() {
    if (selectedSize) {
        contactBtn.disabled = false;
        contactBtn.innerHTML = `
            <i data-lucide="phone" class="h-5 w-5"></i>
            Kontakt w sprawie zakupu
        `;
        contactBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        contactBtn.classList.add('hover:bg-green-700');
    } else {
        contactBtn.disabled = true;
        contactBtn.innerHTML = `
            <i data-lucide="phone" class="h-5 w-5"></i>
            Wybierz rozmiar
        `;
        contactBtn.classList.add('opacity-50', 'cursor-not-allowed');
        contactBtn.classList.remove('hover:bg-green-700');
    }
    
    // Recreate icons
    lucide.createIcons();
}

// Contact about product
function contactAboutProduct() {
    if (!selectedSize) {
        showNotification('Proszę wybrać rozmiar', 'error');
        return;
    }
    
    const productDetails = {
        name: 'Nike Air Max 270 Damskie',
        size: selectedSize,
        variant: selectedVariant,
        price: '399,99 zł'
    };
    
    const message = `Witam! Jestem zainteresowany/a zakupem produktu:\n\n` +
                   `Produkt: ${productDetails.name}\n` +
                   `Rozmiar: ${productDetails.size}\n` +
                   `${selectedVariant ? `Wersja: ${document.querySelector('.variant-btn.border-green-500 .font-medium')?.textContent}\n` : ''}` +
                   `Cena: ${productDetails.price}\n\n` +
                   `Proszę o kontakt w sprawie zakupu.`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '+48880167799';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    const emailUrl = `mailto:blankshop@onet.pl?subject=Zapytanie o Nike Air Max 270&body=${encodedMessage}`;
    
    // Try WhatsApp first, fallback to email
    if (window.innerWidth <= 768) {
        // Mobile - try WhatsApp
        window.open(whatsappUrl, '_blank');
    } else {
        // Desktop - show options
        const choice = confirm('Jak chcesz się skontaktować?\n\nOK - WhatsApp\nAnuluj - Email');
        if (choice) {
            window.open(whatsappUrl, '_blank');
        } else {
            window.open(emailUrl, '_blank');
        }
    }
    
    showNotification('Przekierowanie do kontaktu...');
}

// Toggle favorite
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    
    localStorage.setItem('blankshop_favorites', JSON.stringify(favorites));
    updateFavoriteButton();
    
    const action = index > -1 ? 'usunięto z' : 'dodano do';
    showNotification(`Produkt ${action} ulubionych`);
}

// Update favorite button appearance
function updateFavoriteButton() {
    const isFavorited = favorites.includes(1);
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const icon = btn.querySelector('[data-lucide="heart"]');
        if (isFavorited) {
            btn.classList.add('text-red-500', 'border-red-500');
            icon.classList.add('fill-current');
        } else {
            btn.classList.remove('text-red-500', 'border-red-500');
            icon.classList.remove('fill-current');
        }
    });
}

// Share product
function shareProduct() {
    const shareData = {
        title: 'Nike Air Max 270 Damskie - BLANK SHOP',
        text: 'Sprawdź te niesamowite buty Nike Air Max 270 w promocyjnej cenie!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        const shareText = `${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Link skopiowany do schowka!');
        }).catch(() => {
            showNotification('Nie można skopiować linku', 'error');
        });
    }
}

// Keyboard navigation
function handleKeyNavigation(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                previousImage();
            }
            break;
        case 'ArrowRight':
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                nextImage();
            }
            break;
        case 'Escape':
            // Close any open modals or reset selections
            break;
    }
}

// Back to top functionality
function updateBackToTopButton() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.remove('translate-y-20', 'opacity-0');
        backToTopBtn.classList.add('translate-y-0', 'opacity-100');
    } else {
        backToTopBtn.classList.add('translate-y-20', 'opacity-0');
        backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transition-all transform translate-x-full`;
    notification.className += type === 'error' ? ' bg-red-500' : ' bg-green-500';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = './images/placeholder.jpg';
        });
    });
});

// Performance: Lazy load images that are not immediately visible
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Analytics: Track user interactions
function trackEvent(action, category = 'Product') {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: 'Nike Air Max 270 Damskie'
        });
    }
    
    // Facebook Pixel event tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', action, {
            content_name: 'Nike Air Max 270 Damskie',
            content_category: 'Obuwie',
            value: 399.99,
            currency: 'PLN'
        });
    }
}

// Track page view
trackEvent('ViewContent');

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Product page error:', e.error);
});

// Export functions for global use
window.setMainImage = setMainImage;
window.nextImage = nextImage;
window.previousImage = previousImage;
window.selectSize = selectSize;
window.selectVariant = selectVariant;
window.contactAboutProduct = contactAboutProduct;
window.toggleFavorite = toggleFavorite;
window.shareProduct = shareProduct;
window.scrollToTop = scrollToTop;