function filterCategory(categoryName) {
    // 1. Manage tracking class styling modifications cleanly across layout inputs
    const targetControlButtons = document.querySelectorAll('.filter-btn');
    targetControlButtons.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (typeof productsData === 'undefined') return;

    // 2. Perform filtering calculation
    if (categoryName === 'all') {
        renderFeaturedProduceGrid(productsData);
    } else {
        const filteredArrayResult = productsData.filter(item => item.category === categoryName);
        renderFeaturedProduceGrid(filteredArrayResult);
    }
}
