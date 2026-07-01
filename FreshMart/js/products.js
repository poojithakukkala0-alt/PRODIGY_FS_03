let currentCategory = 'all';
let searchFilterQuery = '';
let masterLiveDatabase = [];

window.addEventListener('DOMContentLoaded', () => {
    initializeCatalogDatabaseState();

    masterLiveDatabase = JSON.parse(localStorage.getItem('freshmart_db_products')) || [];

    setupCatalogListeners();
    applyFiltersAndSort();
    syncCatalogInterfaceCounters();
});

function initializeCatalogDatabaseState() {
    const rawData = localStorage.getItem('freshmart_db_products');
    
    // SMART FORCED OVERRIDE: If the database is missing, or contains old broken placeholder links, or is missing the dairy category entirely:
    if (!rawData || rawData.includes('unsplash.com"') || !rawData.includes('"dairy"')) {
        const structuralInventory = [
            // ================= VEGETABLES (2 Products) =================
            { id: "v1", name: "Organic Green Bell Pepper (Capsicum)", category: "vegetables", price: 120, unit: "1 kg", badge: "Best Seller", badgeClass: "badge-sale", emoji: "https://unsplash.com", description: "Freshly harvested crisp organic green capsicums packed with vitamins." },
            { id: "v2", name: "Crunchy Red Carrots", category: "vegetables", price: 50, unit: "500g", badge: "Fresh", badgeClass: "badge-fresh", emoji: "https://unsplash.com", description: "Crisp, vitamin-rich carrots sourced from regional organic farms." },

            // ================= FRUITS (2 Products) =================
            { id: "f1", name: "Fresh Cavendish Bananas", category: "fruits", price: 60, unit: "1 Dozen", badge: "Fresh", badgeClass: "badge-fresh", emoji: "https://unsplash.com", description: "Naturally ripened, sweet and creamy local Cavendish bananas." },
            { id: "f2", name: "Organic Natural Hass Avocado", category: "fruits", price: 299, unit: "500g", badge: "20% OFF", badgeClass: "badge-discount", emoji: "https://unsplash.com", description: "Rich, buttery premium imported avocados perfect for salads and spreads." },

            // ================= DAIRY & EGGS (2 Products) =================
            { id: "d1", name: "Premium Toned Fresh Milk", category: "dairy", price: 65, unit: "1 Litre", badge: "Fresh", badgeClass: "badge-fresh", emoji: "https://unsplash.com", description: "Pasteurized and chilled farm-fresh creamy toned milk." },
            { id: "d2", name: "Farm Fresh Organic Eggs", category: "dairy", price: 80, unit: "Pack of 6", badge: "Organic", badgeClass: "badge-sale", emoji: "https://unsplash.com", description: "High-protein, free-range organic brown eggs delivered fresh daily." },

            // ================= STAPLES & OILS (2 Products) =================
            { id: "s1", name: "Premium Extra Long Grain Basmati Rice", category: "staples", price: 145, unit: "1 kg", badge: "Top Rated", badgeClass: "badge-fresh", emoji: "https://unsplash.com", description: "Aromatic, aged long-grain basmati rice ideal for special biryanis." },
            { id: "s2", name: "Pure Premium Sunflower Oil", category: "staples", price: 165, unit: "1 Litre", badge: "Essential", badgeClass: "badge-fresh", emoji: "https://unsplash.com", description: "Light, healthy, and multi-refined cooking oil for everyday household use." }
        ];
        
        // Overwrite browser storage instantly with the full database array
        localStorage.setItem('freshmart_db_products', JSON.stringify(structuralInventory));
    }
}


function setupCatalogListeners() {
    const filterItems = document.querySelectorAll('.filter-list li');
    filterItems.forEach(item => {
        item.addEventListener('click', (e) => {
            filterItems.forEach(li => li.classList.remove('active-filter'));
            e.target.classList.add('active-filter');
            
            let rawCat = e.target.getAttribute('data-cat') || e.target.innerText;
            rawCat = rawCat.toLowerCase().trim();
            
            if (rawCat === 'dairy & eggs' || rawCat === 'dairy') {
                currentCategory = 'dairy';
            } else if (rawCat === 'all items' || rawCat === 'all') {
                currentCategory = 'all';
            } else if (rawCat === 'staples & oils' || rawCat === 'staples') {
                currentCategory = 'staples';
            } else {
                currentCategory = rawCat;
            }
            
            applyFiltersAndSort();
        });
    });

    const sortDropdown = document.getElementById('price-sort');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', () => { applyFiltersAndSort(); });
    }

    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchFilterQuery = e.target.value.toLowerCase().trim();
            applyFiltersAndSort();
        });
    }
}

function applyFiltersAndSort() {
    masterLiveDatabase = JSON.parse(localStorage.getItem('freshmart_db_products')) || [];

    let filteredList = masterLiveDatabase.filter(item => {
        const matchesCategory = (currentCategory === 'all' || item.category === currentCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchFilterQuery);
        return matchesCategory && matchesSearch;
    });

    const sortValue = document.getElementById('price-sort')?.value || 'default';
    if (sortValue === 'low-high') {
        filteredList.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-low') {
        filteredList.sort((a, b) => b.price - a.price);
    }

    renderCatalogGrid(filteredList);
}

function renderCatalogGrid(items) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 50px;">No grocery items found in this section yet.</p>`;
        return;
    }

    grid.innerHTML = items.map(product => {
        const wishlistItems = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];
        const isInWish = wishlistItems.some(w => w.id === product.id);

        return `
            <div class="market-card">
                <div class="badge-row">
                    <span class="product-badge ${product.badgeClass || 'badge-fresh'}">${product.badge || 'Fresh'}</span>
                    <button class="wishlist-toggle-btn" onclick="catalogToggleWishlist('${product.id}')">
                        ${isInWish ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="img-container" style="cursor:pointer; background:#fff; overflow:hidden; display:flex; justify-content:center; align-items:center;" onclick="viewProductDetails('${product.id}')">
                    <img src="${product.emoji}" alt="${product.name}" style="width:100%; height:100%; object-fit:contain; padding:10px;">
                </div>
                <div>
                    <h3 class="item-title" style="cursor:pointer" onclick="viewProductDetails('${product.id}')">${product.name}</h3>
                    <div class="item-meta">${product.unit}</div>
                </div>
                <div class="card-action-footer">
                    <span class="card-price">₹${product.price}</span>
                    <button class="add-cart-circle-btn" onclick="catalogAddToCart('${product.id}')">+</button>
                </div>
            </div>
        `;
    }).join('');
}

function viewProductDetails(id) { window.location.href = `product-details.html?id=${id}`; }

function catalogAddToCart(id) {
    let cart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    const item = masterLiveDatabase.find(p => p.id === id);
    const index = cart.findIndex(c => c.id === id);

    if (index > -1) {
        cart[index].quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
    syncCatalogInterfaceCounters();
    alert(`Added ${item.name} to your cart!`);
}

function catalogToggleWishlist(id) {
    let wishlist = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];
    const index = wishlist.findIndex(w => w.id === id);

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        const item = masterLiveDatabase.find(p => p.id === id);
        wishlist.push(item);
    }
    localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
    syncCatalogInterfaceCounters();
    applyFiltersAndSort();
}

function syncCatalogInterfaceCounters() {
    const cart = localStorage.getItem('freshmart_cart') ? JSON.parse(localStorage.getItem('freshmart_cart')) : [];
    const wishlist = localStorage.getItem('freshmart_wishlist') ? JSON.parse(localStorage.getItem('freshmart_wishlist')) : [];
    const countCartNode = document.getElementById('cart-count');
    const countWishNode = document.getElementById('wishlist-count');
    if (countCartNode) countCartNode.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    if (countWishNode) countWishNode.innerText = wishlist.length;
}
