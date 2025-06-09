document.addEventListener('DOMContentLoaded', async () => {
    // Get category name from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('name');
    
    if (!categoryName) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = categoryName;
    document.getElementById('category-title').textContent = categoryName;

    // Load product card template
    let cardTemplate = '';
    try {
        const response = await fetch('html/main-product-card.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cardTemplate = await response.text();
    } catch (error) {
        console.error('Error loading card HTML template:', error);
        document.querySelector('.products-grid').innerHTML = '<p>Не удалось загрузить шаблон карточки.</p>';
        return;
    }

    try {
        // Fetch products for this category
        const response = await fetch(`http://127.0.0.1:5000/api/products?category=${encodeURIComponent(categoryName)}`);
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
                    let imageUrl = product.image; // Предполагаем, что новое поле image

                    // Для обратной совместимости со старыми товарами, если они используют images (массив)
                    if (!imageUrl && product.images && product.images.length > 0) {
                        imageUrl = product.images[0];
                    }

                    if (!imageUrl) {
                        imageUrl = 'images/placeholder.png';
                    }

                    // Добавляем полный URL, если путь относительный
                    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                        imgElement.src = `http://127.0.0.1:5000/${imageUrl}`;
                    } else {
                        imgElement.src = imageUrl;
                    }
                    imgElement.alt = product.name;
                }

                const h3Element = cardElement.querySelector('h3');
                if (h3Element) {
                    h3Element.textContent = product.name;
                }

                productsGrid.appendChild(cardElement);
            }
        });

    } catch (error) {
        console.error('Error loading products:', error);
        document.querySelector('.products-grid').innerHTML = '<p>Ошибка при загрузке товаров</p>';
    }
}); 