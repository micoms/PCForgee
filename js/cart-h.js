// Shared Cart Functions for PC Forge Website

// Add item to cart
function addToCart(productId) {
    // Get existing cart from localStorage
    const cart = localStorage.getItem('pcforge-cart');
    let cartItems = cart ? JSON.parse(cart) : {};
    
    // Add or increment the item
    cartItems[productId] = (cartItems[productId] || 0) + 1;
    
    // Save back to localStorage
    localStorage.setItem('pcforge-cart', JSON.stringify(cartItems));
    
    // Show success message
    alert('Product added to cart!');
    
    // Update cart count if the element exists
    updateCartCount();
}

// Buy now function - adds to cart and goes to checkout
function buyNow(productId) {
    // Get existing cart from localStorage
    const cart = localStorage.getItem('pcforge-cart');
    let cartItems = cart ? JSON.parse(cart) : {};
    
    // Add or increment the item
    cartItems[productId] = (cartItems[productId] || 0) + 1;
    
    // Save back to localStorage
    localStorage.setItem('pcforge-cart', JSON.stringify(cartItems));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = localStorage.getItem('pcforge-cart');
        const cartItems = cart ? JSON.parse(cart) : {};
        
        let totalItems = 0;
        for (let productId in cartItems) {
            totalItems += cartItems[productId];
        }
        
        cartCountElement.textContent = totalItems;
    }
}

// Update cart button in navigation to show count and link to cart
function updateCartButton() {
    const cartButton = document.querySelector('.cart-btn');
    if (cartButton) {
        cartButton.innerHTML = 'Cart (<span id="cart-count">0</span>)';
        cartButton.onclick = function() {
            window.location.href = 'cart.html';
        };
        updateCartCount();
    }
}

// Initialize cart functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartButton();
    updateCartCount();
});
