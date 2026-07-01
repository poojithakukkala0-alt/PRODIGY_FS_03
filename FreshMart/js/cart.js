window.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

function renderCartPage() {
    const container = document.getElementById('cart-items-wrapper');
    if (!container) return;

    const cartItems = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-view" style="text-align:center; padding:40px; background:#fff; border-radius:16px; border:1px solid var(--border-color); width:100%;">
                <p style="color:var(--text-muted); font-size:1.1rem; margin-bottom:20px;">Your shopping cart is currently empty.</p>
                <a href="products.html" class="checkout-proceed-btn" style="text-decoration:none; display:inline-block; width:auto; padding:10px 25px;">Browse Products</a>
            </div>
        `;
        updateOrderSummary(0);
        return;
    }

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item-row" id="cart-row-${item.id}">
            <div class="cart-item-info">
                <div class="cart-item-image-box">
                    <img src="${item.emoji}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Pack Size: ${item.unit} | Base: ₹${item.price}</p>
                </div>
            </div>
            
            <div class="quantity-controller-box">
                <button onclick="updateCartItemQty('${item.id}', -1)">-</button>
                <span class="qty-count-val">${item.quantity}</span>
                <button onclick="updateCartItemQty('${item.id}', 1)">+</button>
            </div>
            
            <div class="cart-item-price-calc">₹${item.price * item.quantity}</div>
            <button class="remove-item-cross-btn" onclick="removeCartItem('${item.id}')">✕</button>
        </div>
    `).join('');

    const runningSubtotal = cartItems.reduce((acc, current) => acc + (current.price * current.quantity), 0);
    updateOrderSummary(runningSubtotal);
}

function updateCartItemQty(id, change) {
    let cart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
    renderCartPage();
}

function removeCartItem(id) {
    let cart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
    renderCartPage();
}

function updateOrderSummary(subtotal) {
    const subtotalEl = document.getElementById('subtotal-val');
    const deliveryEl = document.getElementById('delivery-val');
    const totalEl = document.getElementById('total-val');

    if (!subtotalEl) return;

    subtotalEl.innerText = subtotal.toFixed(2);
    const shippingCost = (subtotal >= 1500 || subtotal === 0) ? 0 : 50;
    deliveryEl.innerText = shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`;
    
    const absoluteTotal = subtotal + shippingCost;
    totalEl.innerText = absoluteTotal.toFixed(2);
}
