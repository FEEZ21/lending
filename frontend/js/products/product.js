document.addEventListener('DOMContentLoaded', async () => {
    const backendUrl = 'https://lending-juaw.onrender.com';
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // Redirect back to index if no product ID is provided
        window.location.href = 'index.html';
        return;
    }

    try {
        // Fetch product details from the backend
        const response = await fetch(`${backendUrl}/api/products/${productId}`);
        if (!response.ok) {
            if (response.status === 404) {
                document.querySelector('.product-details').innerHTML = '<p>Товар не найден.</p>';
            } else {
                throw new Error('Не удалось получить детали товара');
            }
            return;
        }
        
        const product = await response.json();

        // Populate the HTML elements with product data
        document.title = product.name; // Set page title
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = `${product.price} ₽`;
        
        const productImageContainer = document.querySelector('.product-image'); // Get the image container
        if (productImageContainer) {
             productImageContainer.style.removeProperty('width'); // Remove potential inline width style
        }

        const productImageElement = document.getElementById('product-image');
        if (productImageElement) {
            let imageUrl = product.images && product.images.length > 0 ? product.images[0] : null; // Use product.images array

            if (imageUrl) {
                // Гарантируем абсолютный путь к backendUrl
                const backendUrl = 'https://lending-juaw.onrender.com';
                imageUrl = imageUrl.replace(/^\/+/, ''); // убираем ведущие слэши
                if (!/^https?:\/\//.test(imageUrl)) {
                    imageUrl = `${backendUrl}/${imageUrl}`;
                }
            } else {
                imageUrl = '../images/placeholder.png';
            }

            productImageElement.src = imageUrl;
            productImageElement.alt = product.name;
        }

        // Add event listener to the "Add to cart" button
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        addToCartBtn.dataset.productId = product._id; // Store product ID on the button

        addToCartBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину');
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/api/cart/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId: product._id, quantity: 1 })
                });

                if (!response.ok) {
                     // Check for specific errors like insufficient stock or not found
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Не удалось добавить товар в корзину');
                }

                alert('Товар добавлен в корзину');
            } catch (error) {
                console.error('Ошибка при добавлении в корзину:', error);
                alert(`Ошибка при добавлении товара в корзину: ${error.message}`);
            }
        });

    } catch (error) {
        console.error('Ошибка при загрузке деталей товара:', error);
        document.querySelector('.product-details').innerHTML = '<p>Ошибка при загрузке деталей товара.</p>';
    }
});