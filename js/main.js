/**
 * Wild Form Yoga - Main JavaScript
 */

// ==========================================
// Mobile Navigation
// ==========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ==========================================
// Product Image Carousel
// ==========================================
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const images = track.querySelectorAll('img');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dots = carousel.querySelectorAll('.carousel-dots .dot');
        let currentIndex = 0;

        function showImage(index) {
            // Handle wrapping
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;
            currentIndex = index;

            // Update images
            images.forEach((img, i) => {
                img.classList.toggle('active', i === currentIndex);
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Button handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
        }

        // Dot handlers
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showImage(i));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showImage(currentIndex + 1); // Swipe left, go next
                } else {
                    showImage(currentIndex - 1); // Swipe right, go prev
                }
            }
        }, { passive: true });
    });
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', initCarousels);

// ==========================================
// Reviews Carousel
// ==========================================
function initReviewsCarousel() {
    const reviewsSection = document.querySelector('.reviews-carousel');
    if (!reviewsSection) return;

    const reviews = reviewsSection.querySelectorAll('.review');
    const prevBtn = document.querySelector('.reviews-nav .review-btn.prev');
    const nextBtn = document.querySelector('.reviews-nav .review-btn.next');
    const dotsContainer = document.querySelector('.review-dots');
    let currentIndex = 0;

    // Create dots
    reviews.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showReview(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function showReview(index) {
        if (index < 0) index = reviews.length - 1;
        if (index >= reviews.length) index = 0;
        currentIndex = index;

        reviews.forEach((review, i) => {
            review.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => showReview(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => showReview(currentIndex + 1));
    }

    // Auto-advance every 5 seconds
    setInterval(() => {
        showReview(currentIndex + 1);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', initReviewsCarousel);

// ==========================================
// Newsletter Form
// ==========================================
const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        // Placeholder - replace with actual newsletter signup logic
        alert(`Thank you for subscribing with: ${email}\n\nNote: This is a demo. Connect to your email service to enable subscriptions.`);
        form.reset();
    });
});

// ==========================================
// Shopify Buy Button Integration
// ==========================================

/**
 * Shopify Configuration
 *
 * To connect your Shopify store:
 * 1. Create a Shopify store at shopify.com
 * 2. Install the "Buy Button" sales channel
 * 3. Create products for each yoga mat
 * 4. Get your credentials from the Buy Button settings
 * 5. Update the configuration below with your credentials
 */

const SHOPIFY_CONFIG = {
    // Replace these with your actual Shopify credentials
    domain: 'your-store.myshopify.com',
    storefrontAccessToken: 'your-storefront-access-token',

    // Product IDs - replace with your actual Shopify product IDs
    products: {
        'tiger-mat': 'your-tiger-mat-product-id',
        'panda-mat': 'your-panda-mat-product-id',
        'gorilla-mat': 'your-gorilla-mat-product-id',
        'aztec-tiger-mat': 'your-aztec-tiger-mat-product-id',
        'kids-tiger-mat': 'your-kids-tiger-mat-product-id',
        'kids-panda-mat': 'your-kids-panda-mat-product-id',
        'kids-gorilla-mat': 'your-kids-gorilla-mat-product-id',
        'kids-aztec-tiger-mat': 'your-kids-aztec-tiger-mat-product-id'
    }
};

/**
 * Initialize Shopify Buy Button
 * Uncomment and configure once you have your Shopify store set up
 */
function initShopifyBuyButton() {
    if (typeof ShopifyBuy === 'undefined') {
        console.log('Shopify Buy Button SDK not loaded. Add to Cart buttons will use demo mode.');
        return;
    }

    const client = ShopifyBuy.buildClient({
        domain: SHOPIFY_CONFIG.domain,
        storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
    });

    // Store the client globally for use in cart operations
    window.shopifyClient = client;

    // Create a cart
    client.checkout.create().then((checkout) => {
        window.shopifyCheckout = checkout;
    });
}

/**
 * Add product to cart
 * @param {string} productId - The product identifier
 */
function addToCart(productId) {
    const shopifyProductId = SHOPIFY_CONFIG.products[productId];

    // Demo mode - show message when Shopify is not configured
    if (!window.shopifyClient || !shopifyProductId || shopifyProductId.includes('your-')) {
        showDemoCartMessage(productId);
        return;
    }

    // Real Shopify integration
    const lineItems = [{
        variantId: shopifyProductId,
        quantity: 1
    }];

    window.shopifyClient.checkout.addLineItems(window.shopifyCheckout.id, lineItems)
        .then((checkout) => {
            window.shopifyCheckout = checkout;
            window.location.href = checkout.webUrl;
        })
        .catch((error) => {
            console.error('Error adding to cart:', error);
            alert('There was an error adding this item to your cart. Please try again.');
        });
}

/**
 * Show demo cart message
 * @param {string} productId - The product identifier
 */
function showDemoCartMessage(productId) {
    const productNames = {
        'tiger-mat': 'Tiger Mat',
        'panda-mat': 'Panda Mat',
        'gorilla-mat': 'Gorilla Mat',
        'aztec-tiger-mat': 'Aztec Tiger Mat',
        'kids-tiger-mat': 'Kids Tiger Mat',
        'kids-panda-mat': 'Kids Panda Mat',
        'kids-gorilla-mat': 'Kids Gorilla Mat',
        'kids-aztec-tiger-mat': 'Kids Aztec Tiger Mat'
    };

    const productName = productNames[productId] || 'Product';

    alert(
        `${productName} added to cart!\n\n` +
        `This is a demo. To enable real checkout:\n` +
        `1. Set up your Shopify store\n` +
        `2. Update SHOPIFY_CONFIG in js/main.js\n` +
        `3. Add your product IDs`
    );
}

// ==========================================
// Add to Cart Button Handlers
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Shopify (if available)
    initShopifyBuyButton();

    // Attach click handlers to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.dataset.product;
            addToCart(productId);
        });
    });
});

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// Intersection Observer for Animations
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.product-card, .animal-card, .team-card, .info-card, .shop-product-card').forEach(el => {
    observer.observe(el);
});

// ==========================================
// Shop Tabs
// ==========================================
function initShopTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });

            // Re-initialize carousels in the newly visible tab
            initCarousels();
        });
    });
}

document.addEventListener('DOMContentLoaded', initShopTabs);

// ==========================================
// Bundle Builder
// ==========================================
function initBundleBuilder() {
    const adultMatInputs = document.querySelectorAll('input[name="adult-mat"]');
    const kidsMatInputs = document.querySelectorAll('input[name="kids-mat"]');
    const selectedAdultSpan = document.getElementById('selected-adult');
    const selectedKidsSpan = document.getElementById('selected-kids');
    const addBundleBtn = document.getElementById('add-bundle-to-cart');

    if (!adultMatInputs.length || !kidsMatInputs.length) return;

    function updateBundleSummary() {
        const selectedAdult = document.querySelector('input[name="adult-mat"]:checked');
        const selectedKids = document.querySelector('input[name="kids-mat"]:checked');

        // Update display text
        if (selectedAdultSpan) {
            selectedAdultSpan.textContent = selectedAdult
                ? selectedAdult.dataset.name
                : 'Not selected';
        }
        if (selectedKidsSpan) {
            selectedKidsSpan.textContent = selectedKids
                ? selectedKids.dataset.name
                : 'Not selected';
        }

        // Enable/disable the add to cart button
        if (addBundleBtn) {
            addBundleBtn.disabled = !(selectedAdult && selectedKids);
        }
    }

    // Add listeners to all radio buttons
    adultMatInputs.forEach(input => {
        input.addEventListener('change', updateBundleSummary);
    });

    kidsMatInputs.forEach(input => {
        input.addEventListener('change', updateBundleSummary);
    });

    // Handle bundle add to cart
    if (addBundleBtn) {
        addBundleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedAdult = document.querySelector('input[name="adult-mat"]:checked');
            const selectedKids = document.querySelector('input[name="kids-mat"]:checked');

            if (selectedAdult && selectedKids) {
                const adultName = selectedAdult.dataset.name;
                const kidsName = selectedKids.dataset.name;

                // Demo mode message
                alert(
                    `Bundle added to cart!\n\n` +
                    `Adult Mat: ${adultName} - $150\n` +
                    `Kids Mat: ${kidsName} - $80 (discounted from $100)\n` +
                    `Total: $230 + FREE shipping!\n\n` +
                    `This is a demo. To enable real checkout:\n` +
                    `1. Set up your Shopify store\n` +
                    `2. Update SHOPIFY_CONFIG in js/main.js\n` +
                    `3. Add your product IDs`
                );
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initBundleBuilder);

// ==========================================
// Product Details Modal
// ==========================================
const productData = {
    'tiger-mat': {
        name: 'Tiger Mat',
        description: 'Honor the majestic Bengal tiger with this striking mat. Eco-friendly materials, superior grip, and a powerful reminder of what we\'re protecting.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '72" x 26" (tiger silhouette shape)',
            '5mm thickness for joint support'
        ],
        price: '$150',
        images: ['images/tiger.jpg', 'images/tiger-2.jpg'],
        badge: 'Bestseller'
    },
    'panda-mat': {
        name: 'Panda Mat',
        description: 'Celebrate conservation success with the gentle giant panda. A symbol of hope and the power of protection efforts.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '72" x 26" (panda silhouette shape)',
            '5mm thickness for joint support'
        ],
        price: '$150',
        images: ['images/panda.jpg', 'images/panda-2.jpg']
    },
    'gorilla-mat': {
        name: 'Gorilla Mat',
        description: 'Channel the quiet strength of the mountain gorilla. Each mat supports the protection of their forest habitats.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '72" x 26" (gorilla silhouette shape)',
            '5mm thickness for joint support'
        ],
        price: '$150',
        images: ['images/gorilla.jpg', 'images/gorilla-2.png']
    },
    'aztec-tiger-mat': {
        name: 'Aztec Tiger Mat',
        description: 'A bold fusion of ancient Aztec artistry and tiger power. This striking design brings cultural heritage to your practice.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '72" x 26" (tiger silhouette shape)',
            '5mm thickness for joint support'
        ],
        price: '$150',
        images: ['images/aztec-tiger-2.png', 'images/aztec-tiger.png'],
        badge: 'New'
    },
    'kids-tiger-mat': {
        name: 'Kids Tiger Mat',
        description: 'A smaller version of our beloved Tiger Mat, perfectly sized for young yogis. Same eco-friendly materials and quality.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '48" x 18" (tiger silhouette shape)',
            '4mm thickness for comfort'
        ],
        price: '$100',
        images: ['images/tiger.jpg', 'images/tiger-2.jpg']
    },
    'kids-panda-mat': {
        name: 'Kids Panda Mat',
        description: 'The gentle panda, sized for little ones. Perfect for introducing children to yoga and conservation.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '48" x 18" (panda silhouette shape)',
            '4mm thickness for comfort'
        ],
        price: '$100',
        images: ['images/panda.jpg', 'images/panda-2.jpg']
    },
    'kids-gorilla-mat': {
        name: 'Kids Gorilla Mat',
        description: 'The mighty gorilla for your mighty little one. Built for durability and fun.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '48" x 18" (gorilla silhouette shape)',
            '4mm thickness for comfort'
        ],
        price: '$100',
        images: ['images/gorilla.jpg', 'images/gorilla-2.png']
    },
    'kids-aztec-tiger-mat': {
        name: 'Kids Aztec Tiger Mat',
        description: 'Bold Aztec artistry in a kid-friendly size. A colorful companion for young practitioners.',
        features: [
            'Premium natural rubber base',
            'Non-slip microfiber top',
            '48" x 18" (tiger silhouette shape)',
            '4mm thickness for comfort'
        ],
        price: '$100',
        images: ['images/aztec-tiger-2.png', 'images/aztec-tiger.png']
    }
};

function initProductModal() {
    const modal = document.getElementById('product-modal');
    const modalContent = modal?.querySelector('.modal-content');
    const modalClose = modal?.querySelector('.modal-close');
    const detailButtons = document.querySelectorAll('.details-btn');

    if (!modal || !modalContent) return;

    // Open modal when clicking details button
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering the radio button

            const productId = btn.dataset.product;
            const product = productData[productId];

            if (product) {
                modalContent.innerHTML = createProductCard(product, productId);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Initialize carousel in modal if there are multiple images
                if (product.images.length > 1) {
                    initCarousels();
                }
            }
        });
    });

    // Close modal
    modalClose?.addEventListener('click', () => {
        closeModal();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function createProductCard(product, productId) {
    const hasCarousel = product.images.length > 1;
    const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';

    let imageHtml;
    if (hasCarousel) {
        const imagesHtml = product.images.map((img, i) =>
            `<img src="${img}" alt="${product.name} - View ${i + 1}" class="${i === 0 ? 'active' : ''}">`
        ).join('');
        const dotsHtml = product.images.map((_, i) =>
            `<span class="dot ${i === 0 ? 'active' : ''}"></span>`
        ).join('');

        imageHtml = `
            <div class="carousel">
                <div class="carousel-track">${imagesHtml}</div>
                <button class="carousel-btn prev" aria-label="Previous image">&larr;</button>
                <button class="carousel-btn next" aria-label="Next image">&rarr;</button>
                <div class="carousel-dots">${dotsHtml}</div>
            </div>
            ${badgeHtml}
        `;
    } else {
        imageHtml = `<img src="${product.images[0]}" alt="${product.name}">${badgeHtml}`;
    }

    const featuresHtml = product.features.map(f => `<li>${f}</li>`).join('');

    return `
        <div class="shop-product-card">
            <div class="product-image-large">
                ${imageHtml}
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <ul class="product-features">
                    ${featuresHtml}
                </ul>
                <div class="product-price-row">
                    <span class="product-price">${product.price}</span>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initProductModal);
