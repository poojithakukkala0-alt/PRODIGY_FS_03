window.addEventListener('DOMContentLoaded', () => {
    renderWishlistPage();
});

function renderWishlistPage() {
    const targetGrid = document.getElementById('wishlist-grid-target');
    if (!targetGrid) return;

    // Grab dynamic array arrays safely out from browser memory registers
    const items = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];

    if (items.length === 0) {
        targetGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding: 60px 20px; width:100%;">
                <span style="font-size:4rem">❤️</span>
                <p style="color:var(--text-muted); margin-top:15px; font-size:1.1rem">Your wishlist dashboard is empty.</p>
                <a href="products.html" style="background:var(--brand-dark-green); color:#fff; text-decoration:none; padding:10px 20px; border-radius:8px; display:inline-block; margin-top:15px; font-weight:600;">Discover Produce Now</a>
            </div>
        `;
        return;
    }

    targetGrid.innerHTML = items.map(product => `
        <div class="market-card">
            <div class="badge-row">
                <span class="product-badge ${product.badgeClass || 'badge-fresh'}">${product.badge || 'Fresh'}</span>
                <button class="wishlist-toggle-btn" onclick="removeFromWishlistPage('${product.id}')">❤️</button>
            </div>
            <!-- FIX URL STRING PRINTS: Wraps the link correctly inside a secure, styled img component -->
            <div class="img-container" style="background:#fff; overflow:hidden; display:flex; justify-content:center; align-items:center; height:160px;">
                <img src="${product.emoji}" alt="${product.name}" style="width:100%; height:100%; object-fit:contain; padding:10px;">
            </div>
            <div>
                <h3 class="item-title" style="height:44px; overflow:hidden; margin-top:10px;">${product.name}</h3>
                <div class="item-meta">${product.unit}</div>
            </div>
            <div class="card-action-footer">
                <span class="card-price">₹${product.price}</span>
                <button class="add-cart-circle-btn" style="border-radius:8px; width:auto; height:auto; padding:8px 14px; font-size:0.85rem; font-weight:600;" onclick="wishlistMoveToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function removeFromWishlistPage(id) {
    let wishlist = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];
    wishlist = wishlist.filter(w => w.id !== id);
    localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
    renderWishlistPage();
}

function wishlistMoveToCart(id) {
    let wishlist = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];
    const product = wishlist.find(w => w.id === id);
    if (!product) return;

    let cart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    const existingIndex = cart.findIndex(c => c.id === id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));

    wishlist = wishlist.filter(w => w.id !== id);
    localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
    
    renderWishlistPage();
    alert(`Moved "${product.name}" to your shopping cart!`);
}
