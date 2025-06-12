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

const mainContentGrid = document.querySelector('.products-grid'); // Renamed from productsGrid
const filterButtons = document.querySelectorAll('.filter-btn');
const reviewsContainer = document.querySelector('.reviews-container');

document.addEventListener('DOMContentLoaded', () => {
    renderCategories(); // Call new function to render categories
    renderReviews(reviews);
    setupNavigation();
    setupAdminButton();
    setupFilterButtons();
});

// Added: Function to check user role and display/setup admin button
function setupAdminButton() {
    const adminButton = document.getElementById('admin-add-product-btn');
    if (!adminButton) return;

    const userString = localStorage.getItem('user');

    if (userString) {
        try {
            const user = JSON.parse(userString);
            // Modified: Show button only if user is admin (removed setTimeout)
            if (user && user.role === 'admin') {
                // Removed setTimeout
                adminButton.style.display = 'inline-block'; // Show the button

                adminButton.addEventListener('click', () => {
                    window.location.href = 'admin-add-product.html'; // Redirect on click
                });
            } else {
                 // Hide the button if the user is not an admin
                 if (adminButton) adminButton.style.display = 'none';
            }
        } catch (error) {
            console.error('setupAdminButton: Error parsing user from localStorage:', error);
        }
    } else {
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

            // For now, just re-render all categories when a filter button is clicked
            // If category specific filtering is needed, this logic will be extended
            renderCategories();
        });
    });
}

// New function: Fetch categories from the backend and render them
async function renderCategories() {
    if (!mainContentGrid) return; // Use the renamed grid

    // Load product card template (reusing for category cards)
    let cardTemplate = '';
    try {
        const response = await fetch('html/main-product-card.html'); // Reusing existing product card template
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cardTemplate = await response.text();
    } catch (error) {
        console.error('Error loading card HTML template for categories:', error);
        mainContentGrid.innerHTML = '<p>Не удалось загрузить шаблон карточки категории.</p>';
        return;
    }

    // Fetch categories from the backend
    let categories = [];
    try {
        const response = await fetch(`https://lending-juaw.onrender.com/api/categories`); // Fetch categories
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        categories = await response.json();
    } catch (error) {
        console.error('Error fetching categories from backend:', error);
        mainContentGrid.innerHTML = '<p>Не удалось загрузить категории с сервера.</p>';
        return;
    }

    mainContentGrid.innerHTML = '';

    if (categories.length === 0) {
        mainContentGrid.innerHTML = '<p>Категорий пока нет.</p>';
        return;
    }

    categories.forEach(category => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardTemplate.trim();
        const cardElement = tempDiv.firstChild;

        if (cardElement) {
            // Update the link href to point to category page (e.g., category.html?id=...)
            const linkElement = cardElement.querySelector('.product-link');
            if (linkElement) {
                linkElement.href = `category.html?id=${category._id}`; // Link to category details page
            }

            const imgElement = cardElement.querySelector('img');
            if (imgElement) {
                let imageUrl = category.image;

                if (!imageUrl) {
                    imageUrl = 'images/placeholder.png';
                }

                // Добавляем полный URL, если путь относительный
                // Теперь просто используем относительный путь, так как изображения находятся на фронтенде
                imgElement.src = imageUrl;
                imgElement.alt = category.name;
            }

            const h3Element = cardElement.querySelector('h3');
            if (h3Element) {
                h3Element.textContent = category.name;
            }
            
            // Remove product-specific elements if they exist in the template
            const priceElement = cardElement.querySelector('.product-price');
            if (priceElement) {
                priceElement.remove(); // Remove price element
            }
            const productActionsElement = cardElement.querySelector('.product-actions');
            if (productActionsElement) {
                productActionsElement.remove(); // Remove product actions (buttons) element
            }

            mainContentGrid.appendChild(cardElement);
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