async function renderProductsGrid(products, detailsBasePath) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    // Загружаем шаблон карточки товара
    let productCardTemplate = '';
    try {
        const response = await fetch('../html/product-card.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productCardTemplate = await response.text();
    } catch (error) {
        console.error('Error loading product card HTML template:', error);
        grid.innerHTML = '<p>Не удалось загрузить товары.</p>';
        return;
    }

    grid.innerHTML = ''; // Очищаем сетку перед добавлением новых товаров

    products.forEach(product => {
        // Создаем временный элемент для парсинга HTML шаблона
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = productCardTemplate.trim();
        const productCardElement = tempDiv.firstChild;

        if (productCardElement) {
            // Заполняем шаблон данными товара
            const imgElement = productCardElement.querySelector('img');
            if (imgElement) {
                imgElement.src = product.image;
                imgElement.alt = product.name;
            }

            const h3Element = productCardElement.querySelector('h3');
            if (h3Element) {
                h3Element.textContent = product.name;
            }

            const priceElement = productCardElement.querySelector('.price');
            if (priceElement) {
                priceElement.textContent = product.price;
            }

            const descriptionElement = productCardElement.querySelector('.description');
            if (descriptionElement) {
                descriptionElement.textContent = product.description;
            }

            const detailsLink = productCardElement.querySelector('.details-button');
            if (detailsLink) {
                detailsLink.href = `${detailsBasePath}/${product.id}.html`;
            }

            // Находим кнопку "В корзину" и добавляем обработчик
            const addToCartButton = productCardElement.querySelector('.button');
            if (addToCartButton) {
                 addToCartButton.addEventListener('click', () => {
                    // Используем глобальную функцию addToCart из cart-utils.js
                    if (typeof addToCart !== 'undefined') {
                        addToCart(product);
                    } else {
                        console.error('addToCart function not found!');
                    }
                });
            }

            grid.appendChild(productCardElement);
        }
    });
}

function getImageUrl(imagePath) {
    if (!imagePath) return '../images/placeholder.png';
    imagePath = imagePath.replace(/^([.]{2}\/)+/, '');
    imagePath = imagePath.replace(/^(images\/)+/, 'images/');
    return `https://lending-juaw.onrender.com/${imagePath}`;
} 