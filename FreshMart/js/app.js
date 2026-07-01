let globalCart = [];
let globalWishlist = [];
let masterLiveDatabase = [];

window.addEventListener('DOMContentLoaded', () => {
    initializeDatabaseState();

    masterLiveDatabase = JSON.parse(localStorage.getItem('freshmart_db_products')) || [];
    globalCart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    globalWishlist = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];

    syncInterfaceMetrics();
    renderFeaturedProduceGrid(masterLiveDatabase);
    setupHomeSearch();
});

function initializeDatabaseState() {
    const rawData = localStorage.getItem('freshmart_db_products');
    
    // Auto-reset if data is missing, corrupted, or missing our dairy additions
    if (!rawData || rawData.includes('unsplash.com"') || !rawData.includes('"dairy"')) {
        const structuralInventory = [
            // ================= VEGETABLES (2 Products) =================
            { id: "v1", name: "Organic Green Bell Pepper (Capsicum)", category: "vegetables", price: 120, unit: "1 kg", badge: "Best Seller", badgeClass: "badge-sale", emoji: "https://up.yimg.com/ib/th/id/OIP.Md3FKNEROupP77qsoNWBLwHaEJ?pid=Api&rs=1&c=1&qlt=95&w=176&h=98", description: "Freshly harvested crisp organic green capsicums packed with vitamins." },
            { id: "v2", name: "Crunchy Red Carrots", category: "vegetables", price: 50, unit: "500g", badge: "Fresh", badgeClass: "badge-fresh", emoji: "https://tse3.mm.bing.net/th/id/OIP.Fpzj7wTYfmc8LFCUzTuniwHaHa?pid=Api&P=0&h=180", description: "Crisp, vitamin-rich carrots sourced from regional organic farms." },

            // ================= FRUITS (2 Products) =================
            { id: "f1", name: "Fresh Cavendish Bananas", category: "fruits", price: 60, unit: "1 Dozen", badge: "Fresh", badgeClass: "badge-fresh", emoji: "https://tse3.mm.bing.net/th/id/OIP.D_5z4YJqmcfakwGcDT024wHaHa?pid=Api&P=0&h=180", description: "Naturally ripened, sweet and creamy local Cavendish bananas." },
            { id: "f2", name: "Organic Natural Hass Avocado", category: "fruits", price: 299, unit: "500g", badge: "20% OFF", badgeClass: "badge-discount", emoji: "https://tse2.mm.bing.net/th/id/OIP._rTjUvZ_5fjGj_OddOeG8wHaHa?pid=Api&P=0&h=180", description: "Rich, buttery premium imported avocados perfect for salads and spreads." },

            // ================= DAIRY & EGGS (2 Products) =================
            { id: "d1", name: "Premium Toned Fresh Milk", category: "dairy", price: 65, unit: "1 Litre", badge: "Fresh", badgeClass: "badge-fresh", emoji: "https://tse4.mm.bing.net/th/id/OIP.0-0iV_lQUcOmJtmqC_qZSQHaHa?pid=Api&P=0&h=180", description: "Pasteurized and chilled farm-fresh creamy toned milk." },
            { id: "d2", name: "Farm Fresh Organic Eggs", category: "dairy", price: 80, unit: "Pack of 6", badge: "Organic", badgeClass: "badge-sale", emoji: "https://tse3.mm.bing.net/th/id/OIP.JmgCW4Scs6LXByJ6s7qH3wHaE5?pid=Api&P=0&h=180", description: "High-protein, free-range organic brown eggs delivered fresh daily." },

            // ================= STAPLES & OILS (2 Products) =================
            { id: "s1", name: "Premium Extra Long Grain Basmati Rice", category: "staples", price: 145, unit: "1 kg", badge: "Top Rated", badgeClass: "badge-fresh", emoji: "https://tse3.mm.bing.net/th/id/OIP.Rw3DxHnaaOW9j5li6NeiJgHaE6?pid=Api&P=0&h=180", description: "Aromatic, aged long-grain basmati rice ideal for special biryanis." },
            { id: "s2", name: "Pure Premium Sunflower Oil", category: "staples", price: 165, unit: "1 Litre", badge: "Essential", badgeClass: "badge-fresh", emoji: "https://tse1.mm.bing.net/th/id/OIP.dCLRcus6ccaHcQL5ztmffwAAAA?pid=Api&P=0&h=180", description: "Light, healthy, and multi-refined cooking oil for everyday household use." }
        ];
        localStorage.setItem('freshmart_db_products', JSON.stringify(structuralInventory));
    }
}

function renderFeaturedProduceGrid(dataset) {
    const targetAnchor = document.getElementById('featured-grid');
    if (!targetAnchor) return; 

    if (!dataset || dataset.length === 0) {
        targetAnchor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No product items found inside system database registers.</p>`;
        return;
    }

    targetAnchor.innerHTML = dataset.map(item => {
        const inWishlist = globalWishlist.some(w => w.id === item.id);
        return `
            <div class="market-card" id="card-${item.id}">
                <div class="badge-row">
                    <span class="product-badge ${item.badgeClass || 'badge-fresh'}">${item.badge || 'Fresh'}</span>
                    <button class="wishlist-toggle-btn" onclick="homeToggleWishlist('${item.id}')">
                        ${inWishlist ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="img-container" style="cursor:pointer; background:#fff; overflow:hidden; display:flex; justify-content:center; align-items:center;" onclick="location.href='product-details.html?id=${item.id}'">
                    <img src="${item.emoji}" alt="${item.name}" style="width:100%; height:100%; object-fit:contain; padding:10px;">
                </div>
                <div>
                    <h3 class="item-title" style="cursor:pointer" onclick="location.href='product-details.html?id=${item.id}'">${item.name}</h3>
                    <div class="item-meta">${item.unit}</div>
                </div>
                <div class="card-action-footer">
                    <span class="card-price">₹${item.price}</span>
                    <button class="add-cart-circle-btn" onclick="homeAddToCart('${item.id}')">+</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterCategory(categoryName) {
    const targetControlButtons = document.querySelectorAll('.filter-btn');
    targetControlButtons.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Convert selection input strictly to lowercase for perfect matching parameters
    const cleanCategory = categoryName.toLowerCase().trim();

    if (cleanCategory === 'all' || cleanCategory === 'all products') {
        renderFeaturedProduceGrid(masterLiveDatabase);
    } else if (cleanCategory === 'dairy & eggs' || cleanCategory === 'dairy') {
        const filtered = masterLiveDatabase.filter(item => item.category === 'dairy');
        renderFeaturedProduceGrid(filtered);
    } else if (cleanCategory === 'staples & oils' || cleanCategory === 'staples') {
        const filtered = masterLiveDatabase.filter(item => item.category === 'staples');
        renderFeaturedProduceGrid(filtered);
    } else {
        const filtered = masterLiveDatabase.filter(item => item.category === cleanCategory);
        renderFeaturedProduceGrid(filtered);
    }
}

function homeAddToCart(id) {
    const product = masterLiveDatabase.find(p => p.id === id);
    let cart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    const index = cart.findIndex(item => item.id === id);

    if (index > -1) {
        cart[index].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
    globalCart = cart;
    syncInterfaceMetrics();
    alert(`Added "${product.name}" to cart!`);
}

function homeToggleWishlist(id) {
    let wishlist = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];
    const index = wishlist.findIndex(item => item.id === id);

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        const product = masterLiveDatabase.find(p => p.id === id);
        wishlist.push(product);
    }

    localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
    globalWishlist = wishlist;
    syncInterfaceMetrics();
    renderFeaturedProduceGrid(masterLiveDatabase); 
}

function setupHomeSearch() {
    const searchBox = document.getElementById('global-search');
    if (!searchBox) return;
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const token = searchBox.value.trim().toLowerCase();
            if (token.length > 0) {
                window.location.href = `products.html?search=${encodeURIComponent(token)}`;
            }
        }
    });
}

function syncInterfaceMetrics() {
    const countCartNode = document.getElementById('cart-count');
    const countWishNode = document.getElementById('wishlist-count');
    if (countCartNode) countCartNode.innerText = globalCart.reduce((total, item) => total + item.quantity, 0);
    if (countWishNode) countWishNode.innerText = globalWishlist.length;
}
