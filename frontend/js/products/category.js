document.addEventListener('DOMContentLoaded', async () => {
    const backendUrl = "https://lending-juaw.onrender.com";
    // Get category ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    
    if (!categoryId) {
        window.location.href = 'index.html';
        return;
    }

    let categoryName = 'Категория'; // Default title
    try {
        // Fetch category details to get the name
        const categoryResponse = await fetch(`https://lending-juaw.onrender.com/api/categories/${categoryId}`);
        if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            categoryName = categoryData.name;
        } else {
            console.warn('Could not fetch category name for ID:', categoryId);
        }
    } catch (error) {
        console.error('Error fetching category details:', error);
    }

    // Update page title
    document.title = categoryName;
    document.getElementById('category-title').textContent = categoryName;

    // Load product card template
    let cardTemplate = '';
    try {
        const response = await fetch('../html/main-product-card.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cardTemplate = await response.text();
    } catch (error) {
        console.error('Error loading card HTML template:', error);
        document.querySelector('.products-grid').innerHTML = '<p>Не удалось загрузить шаблон карточки.</p>';
        return;
    }

    function getImageUrl(imagePath) {
        if (!imagePath) return '../images/placeholder.png';
        imagePath = imagePath.replace(/^([.]{2}\/)+/, '');
        imagePath = imagePath.replace(/^(images\/)+/, '');
        return `https://lending-juaw.onrender.com/images/${imagePath}`;
    }

    // Function to load and render products
    async function loadProducts(featured = null, sortBy = null, newArrival = null) {
        try {
            let url = `https://lending-juaw.onrender.com/api/products?category=${encodeURIComponent(categoryName)}`;
            
            if (featured !== null) {
                url += `&featured=${featured}`;
            }
            
            if (newArrival !== null) {
                url += `&newArrival=${newArrival}`;
            }

            if (sortBy) {
                url += `&sortBy=${sortBy}&order=desc`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const products = await response.json();
            const productsGrid = document.querySelector('.products-grid');
            productsGrid.innerHTML = ''; // Clear the grid
            
            if (products.length === 0) {
                productsGrid.innerHTML = '<p>В этой категории пока нет товаров.</p>';
                return;
            }

            // Render products
            products.forEach(product => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cardTemplate.trim();
                const cardElement = tempDiv.firstChild;

                if (cardElement) {
                    // Update the link href to point to product details
                    const linkElement = cardElement.querySelector('.product-link');
                    if (linkElement) {
                        linkElement.href = `product.html?id=${product._id}`;
                    }

                    const imgElement = cardElement.querySelector('img');
                    if (imgElement) {
                        let imageFileName = product.images && product.images.length > 0 ? product.images[0] : null;
                        let imageUrl = imageFileName ? `${backendUrl}/${imageFileName}` : null;
                        if (!imageUrl) {
                            imageUrl = '../images/placeholder.png';
                        }
                        imgElement.src = imageUrl;
                        imgElement.alt = product.name;
                    }

                    const h3Element = cardElement.querySelector('h3');
                    if (h3Element) {
                        h3Element.textContent = product.name;
                    }

                    const priceElement = cardElement.querySelector('.product-price');
                    if (priceElement) {
                        priceElement.textContent = `${product.price} ₽`;
                    }

                    const detailsButton = cardElement.querySelector('.details-btn');
                    if (detailsButton) {
                        detailsButton.href = `product.html?id=${product._id}`;
                    }

                    const addToCartButton = cardElement.querySelector('.add-to-cart-btn');
                    if (addToCartButton) {
                        addToCartButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            addToCart(product);
                        });
                    }

                    productsGrid.appendChild(cardElement);
                }
            });
        } catch (error) {
            console.error('Error loading products:', error);
            document.querySelector('.products-grid').innerHTML = '<p>Ошибка при загрузке товаров</p>';
        }
    }

    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Handle different filter cases
            if (button.textContent === 'Все') {
                loadProducts();
            } else if (button.textContent === 'Популярное') {
                loadProducts(true); // Show featured products
            } else if (button.textContent === 'Новинки') {
                loadProducts(null, null, true); // Filter by newArrival
            }
        });
    });

    // Load all products initially
    loadProducts();
}); 