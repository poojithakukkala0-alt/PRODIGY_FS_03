const StorageManager = {
    // Save data directly into local memory registers
    save(key, data) {
        localStorage.setItem(`freshmart_${key}`, JSON.stringify(data));
    },

    // Safely pull and parse information out from memory structures
    get(key) {
        const data = localStorage.getItem(`freshmart_${key}`);
        return data ? JSON.parse(data) : [];
    },

    // Cart memory operations wrappers
    getCart() { return this.get('cart'); },
    saveCart(cartData) { this.save('cart', cartData); },

    // Wishlist storage arrays helper methods
    getWishlist() { return this.get('wishlist'); },
    saveWishlist(wishlistData) { this.save('wishlist', wishlistData); }
};
