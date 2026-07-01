function processOrder(event) {
    // Prevent the default browser page reload on submission behavior
    event.preventDefault();

    if (typeof StorageManager === 'undefined') return;

    const currentCart = StorageManager.getCart();

    if (currentCart.length === 0) {
        alert("Your checkout batch calculation routing layer failed because your shopping cart is completely empty!");
        window.location.href = 'products.html';
        return;
    }

    // 1. Calculate historical calculation state snapshots
    const itemsCount = currentCart.reduce((total, item) => total + item.quantity, 0);
    const itemsSubtotal = currentCart.reduce((acc, current) => acc + (current.price * current.quantity), 0);
    const finalValuation = itemsSubtotal >= 1500 ? itemsSubtotal : (itemsSubtotal + 50);

    // 2. Shape consistent data tracking order schema blocks
    const newOrderInvoice = {
        id: "FM-" + Math.floor(100000 + Math.random() * 900000), // Random 6-digit transaction token generator
        itemsCount: itemsCount,
        totalValuation: finalValuation.toFixed(2),
        timestamp: new Date().toLocaleDateString('en-IN')
    };

    // 3. Load historical arrays from browser database registers
    const historicalOrders = localStorage.getItem('freshmart_orders') ? JSON.parse(localStorage.getItem('freshmart_orders')) : [];
    historicalOrders.unshift(newOrderInvoice); // Push onto start of list tracking queue

    // 4. Save and reset active session states cleanly
    localStorage.setItem('freshmart_orders', JSON.stringify(historicalOrders));
    StorageManager.saveCart([]); // Reset active cart data object down to baseline array brackets

    alert(`🎉 Purchase Processed Successfully via Cash On Delivery!\n\nYour Unique Tracking Invoice Number: ${newOrderInvoice.id}\nTotal Charged Amount: ₹${newOrderInvoice.totalValuation}`);
    
    // Redirect cleanly into historical status tracking panels
    window.location.href = 'orders.html';
}
