// Product Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all the elements we need
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const priceSelect = document.getElementById('priceSelect');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resultsCounter = document.getElementById('resultsCounter');
    const productCards = document.getElementById('productCards');
    
    // Get all product cards
    const allCards = Array.from(productCards.querySelectorAll('.card'));
    
    // Store original product data for filtering
    const products = allCards.map(card => {
        const category = card.querySelector('span').textContent.trim();
        const title = card.querySelector('h3').textContent.trim();
        const description = card.querySelector('p').textContent.trim();
        const priceText = card.querySelector('.price').textContent.trim();
        // Extract numeric price (remove ₱ and commas)
        const price = parseInt(priceText.replace(/[₱,]/g, ''));
        
        return {
            element: card,
            category: category,
            title: title,
            description: description,
            price: price,
            searchText: (title + ' ' + description + ' ' + category).toLowerCase()
        };
    });
    
    // Function to filter and display products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;
        const selectedPriceRange = priceSelect.value;
        
        let visibleCount = 0;
        
        products.forEach(product => {
            let isVisible = true;
            
            // Check search term
            if (searchTerm && !product.searchText.includes(searchTerm)) {
                isVisible = false;
            }
            
            // Check category filter
            if (selectedCategory !== 'all' && product.category !== selectedCategory) {
                isVisible = false;
            }
            
            // Check price range filter
            if (selectedPriceRange !== 'all') {
                const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
                if (product.price < minPrice || product.price > maxPrice) {
                    isVisible = false;
                }
            }
            
            // Show or hide the product card
            if (isVisible) {
                product.element.classList.remove('hidden');
                visibleCount++;
            } else {
                product.element.classList.add('hidden');
            }
        });
        
        // Update results counter
        updateResultsCounter(visibleCount);
        
        // Show/hide no results message
        showNoResultsMessage(visibleCount === 0);
    }
    
    // Function to update the results counter
    function updateResultsCounter(count) {
        const productText = count === 1 ? 'product' : 'products';
        resultsCounter.textContent = `${count} ${productText} found`;
    }
    
    // Function to show/hide no results message
    function showNoResultsMessage(show) {
        // Remove existing no results message
        const existingMessage = productCards.querySelector('.no-results');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (show) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <h3>No products found</h3>
                <p>Try adjusting your search terms or filters to find what you're looking for.</p>
            `;
            productCards.appendChild(noResultsDiv);
        }
    }
    
    // Function to clear all filters
    function clearAllFilters() {
        searchInput.value = '';
        categorySelect.value = 'all';
        priceSelect.value = 'all';
        filterProducts();
    }
    
    // Add event listeners
    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    priceSelect.addEventListener('change', filterProducts);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Initialize the display (show all products initially)
    filterProducts();


});
