// Sample product data (replace with your actual data)
// const products = [
//     {
//         id: 1,
//         name: 'Видео',
//         price: '1000 ₽',
//         image: 'images/first.png',
//         category: 'popular'
//     },
//     // ... removed static product data ...
// ];

// Sample reviews data
const reviews = [
    {
        id: 1,
        author: 'Иван',
        text: 'Отличный товар, всем рекомендую!',
        rating: 5
    },
    {
        id: 2,
        author: 'Мария',
        text: 'Хорошее качество, быстрая доставка.',
        rating: 4
    }
];

const productsGrid = document.querySelector('.products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const reviewsContainer = document.querySelector('.reviews-container');

document.addEventListener('DOMContentLoaded', () => {
    // Call renderProducts to fetch and display products based on current filter
    renderProducts();
    renderReviews(reviews); // Reviews still use static data
    setupNavigation();
    setupAdminButton();
    setupFilterButtons(); // Added new function for filter buttons
});

// Added: Function to check user role and display/setup admin button
function setupAdminButton() {
    const adminButton = document.getElementById('admin-add-product-btn');
    if (!adminButton) return;

    const userString = localStorage.getItem('user');
    console.log('setupAdminButton: userString from localStorage:', userString);

    if (userString) {
        try {
            const user = JSON.parse(userString);
            console.log('setupAdminButton: Parsed user object:', user);
            // Modified: Show button only if user is admin (removed setTimeout)
            if (user && user.role === 'admin') {
                console.log('setupAdminButton: User role is admin. Showing button.');
                // Removed setTimeout
                adminButton.style.display = 'inline-block'; // Show the button
                console.log('setupAdminButton: Admin button display set to inline-block.');

                adminButton.addEventListener('click', () => {
                    window.location.href = 'admin-add-product.html'; // Redirect on click
                });
            } else {
                 console.log('setupAdminButton: User role is not admin or user object is invalid.', user);
                 // Hide the button if the user is not an admin
                 if (adminButton) adminButton.style.display = 'none';
            }
        } catch (error) {
            console.error('setupAdminButton: Error parsing user from localStorage:', error);
        }
    } else {
         console.log('setupAdminButton: userString is empty or null. Hiding button.');
         // Hide the button if no user is logged in
         if (adminButton) adminButton.style.display = 'none';
    }
}

// Added: Function to set up filter buttons
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            e.target.classList.add('active');

            const filterType = e.target.textContent; // Get filter type (e.g., "Все", "Популярное", "Новинки")
            let queryParams = {};

            if (filterType === 'Популярное') {
                queryParams = { featured: true };
            } else if (filterType === 'Новинки') {
                queryParams = { sortBy: 'createdAt', order: 'desc' };
            } else { // "Все"
                queryParams = {};
            }
            renderProducts(queryParams); // Render products with new filter
        });
    });
}

// Modified: Fetch products from the backend and render them
async function renderProducts(filters = {}) { // Added filters parameter
    if (!productsGrid) return;

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
        productsGrid.innerHTML = '<p>Не удалось загрузить шаблон карточки.</p>';
        return;
    }

    // Construct query string from filters object
    const queryString = Object.keys(filters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
        .join('&');

    // Fetch products from the backend
    let products = [];
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/products?${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
    } catch (error) {
        console.error('Error fetching products from backend:', error);
        productsGrid.innerHTML = '<p>Не удалось загрузить товары с сервера.</p>';
        return;
    }

    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p>Товаров пока нет.</p>';
        return;
    }

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
                let imageUrl = product.image; 

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
            
            // Добавляем отображение цены (если есть)
            const priceElement = cardElement.querySelector('.product-price');
            if (priceElement && product.price) {
                priceElement.textContent = `${product.price} ₽`;
            }
            // Добавляем отображение описания (если есть)
            const descriptionElement = cardElement.querySelector('.product-description');
            if (descriptionElement && product.description) {
                descriptionElement.textContent = product.description;
            }

            productsGrid.appendChild(cardElement);
        }
    });
}

async function renderReviews(reviews) {
    if (!reviewsContainer) return;

    // Загружаем шаблон карточки отзыва
    let reviewCardTemplate = '';
    try {
        const response = await fetch('html/review-card.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        reviewCardTemplate = await response.text();
    } catch (error) {
        console.error('Error loading review card HTML template:', error);
        reviewsContainer.innerHTML = '<p>Не удалось загрузить отзывы.</p>';
        return;
    }

    reviewsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых отзывов

    reviews.forEach(review => {
        // Создаем временный элемент для парсинга HTML шаблона
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = reviewCardTemplate.trim();
        const reviewCardElement = tempDiv.firstChild;

        if (reviewCardElement) {
            // Заполняем шаблон данными отзыва
            const authorElement = reviewCardElement.querySelector('h4');
            if (authorElement) {
                authorElement.textContent = review.author;
            }

            const ratingElement = reviewCardElement.querySelector('.rating');
            if (ratingElement) {
                ratingElement.title = `${review.rating} из 5`;
                // Добавляем звезды
                ratingElement.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            }

            const textElement = reviewCardElement.querySelector('p');
            if (textElement) {
                textElement.textContent = review.text;
            }

            reviewsContainer.appendChild(reviewCardElement);
        }
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            navLinks.forEach(l => l.classList.remove('active'));

            link.classList.add('active');
            
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 