document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // Redirect back to index if no product ID is provided
        window.location.href = 'index.html';
        return;
    }

    try {
        // Fetch product details from the backend
        const response = await fetch(`https://lending-juaw.onrender.com/api/products/${productId}`);
        if (!response.ok) {
            if (response.status === 404) {
                document.querySelector('.product-details').innerHTML = '<p>Товар не найден.</p>';
            } else {
                throw new Error('Failed to fetch product details');
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
                // Если путь не абсолютный, добавляем backendUrl
                if (!imageUrl.startsWith('http')) {
                    imageUrl = `https://lending-juaw.onrender.com/${imageUrl}`;
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
                const response = await fetch('https://lending-juaw.onrender.com/api/cart/items', {
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
                    throw new Error(errorData.message || 'Failed to add to cart');
                }

                alert('Товар добавлен в корзину');
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert(`Ошибка при добавлении товара в корзину: ${error.message}`);
            }
        });

    } catch (error) {
        console.error('Error loading product details:', error);
        document.querySelector('.product-details').innerHTML = '<p>Ошибка при загрузке деталей товара.</p>';
    }
}); 