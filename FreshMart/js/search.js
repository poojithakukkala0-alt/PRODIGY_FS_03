window.addEventListener('DOMContentLoaded', () => {
    initializeSearchHandler();
});

function initializeSearchHandler() {
    const inputSearchBox = document.getElementById('global-search');
    if (!inputSearchBox) return;

    inputSearchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const rawTokenString = inputSearchBox.value.trim().toLowerCase();
            if (rawTokenString.length > 0) {
                // Route query directly to your catalog engine parameters
                window.location.href = `products.html?search=${encodeURIComponent(rawTokenString)}`;
            }
        }
    });
}
