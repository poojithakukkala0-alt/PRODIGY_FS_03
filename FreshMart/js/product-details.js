let currentProduct = null;
let currentQty = 1;

window.addEventListener('DOMContentLoaded', () => {
    loadSingleProductDetails();
});

function loadSingleProductDetails() {
    // 1. Parse out parameters safely from location URL string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-detail-view').innerHTML = `<p style="text-align:center; padding:40px;">Invalid product parameters selected.</p>`;
        return;
    }

    // 2. Locate target element data coordinates from data/products.js
    currentProduct = productsData.find(p => p.id === productId);

    if (!currentProduct) {
        document.getElementById('product-detail-view').innerHTML = `<p style="text-align:center; padding:40px;">Product not found in system database registry.</p>`;
        return;
    }

    // 3. Render precise target elements to active window elements
    document.getElementById('detail-emoji').innerText = currentProduct.emoji;
    document.getElementById('detail-badge').innerText = currentProduct.badge;
    document.getElementById('detail-badge').className = `detail-badge ${currentProduct.badgeClass}`;
    document.getElementById('detail-title').innerText = currentProduct.name;
    document.getElementById('detail-unit').innerText = `Pack Size Configuration: ${currentProduct.unit}`;
    document.getElementById('detail-price').innerText = `₹${currentProduct.price}`;
    document.getElementById('detail-desc').innerText = currentProduct.description;

    updateDetailCartCounter();
}

function changeQty(amount) {
    currentQty += amount;
    if (currentQty < 1) currentQty = 1; // Standard lower guard limit constraint
    document.getElementById('quantity-val').innerText = currentQty;
}

function triggerAddToCart() {
    if (!currentProduct || typeof StorageManager === 'undefined') return;

    let cart = StorageManager.getCart();
    const existingIndex = cart.findIndex(item => item.id === currentProduct.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += currentQty;
    } else {
        cart.push({ ...currentProduct, quantity: currentQty });
    }

    StorageManager.saveCart(cart);
    updateDetailCartCounter();
    alert(`Successfully appended (${currentQty}) units of "${currentProduct.name}" directly to your cart tracking stack!`);
}

function triggerWishlist() {
    if (!currentProduct || typeof StorageManager === 'undefined') return;

    let wishlist = StorageManager.getWishlist();
    const existingIndex = wishlist.findIndex(item => item.id === currentProduct.id);

    if (existingIndex > -1) {
        alert('This particular item is already preserved inside your account saved wishlist!');
        return;
    }

    wishlist.push(currentProduct);
    StorageManager.saveWishlist(wishlist);
    alert(`"${currentProduct.name}" logged cleanly into account favorites drawer.`);
}

function updateDetailCartCounter() {
    const counterElement = document.getElementById('cart-count');
    if (counterElement && typeof StorageManager !== 'undefined') {
        const cart = StorageManager.getCart();
        counterElement.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }
}
