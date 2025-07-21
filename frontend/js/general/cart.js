// cart.js

// Remove unused functions related to localStorage
// const { getCart, saveCart, addToCart } = window;

// Removed localStorage functions: removeFromCart, clearCart, getTotal

async function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    const token = localStorage.getItem('token'); // Get JWT token

    if (!token) {
        cartContainer.innerHTML = '<p>Пожалуйста, войдите в систему, чтобы просмотреть корзину.</p>';
        return;
    }

    try {
        // Fetch cart data from the backend API
        const response = await fetch('https://lending-juaw.onrender.com/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}` // Include token for authentication
            }
        });

        if (!response.ok) {
            // If response is not OK, try to parse error message
             const errorData = await response.json();
             throw new Error(errorData.message || 'Не удалось загрузить данные корзины');
        }

        const cart = await response.json(); // Backend should return the cart object

        // Load HTML structure for the cart from a separate file
        let cartHTMLTemplate = '';
        try {
             const templateResponse = await fetch('html/cart-content.html');
             if (!templateResponse.ok) {
                 throw new Error(`HTTP error! status: ${templateResponse.status}`);
             }
             cartHTMLTemplate = await templateResponse.text();
             cartContainer.innerHTML = cartHTMLTemplate;
        } catch (error) {
             console.error('Error loading cart HTML:', error);
             cartContainer.innerHTML = '<p>Не удалось загрузить содержимое корзины.</p>';
             return;
        }


        const cartTableBody = cartContainer.querySelector('.cart-table tbody');
        const cartTotalElement = cartContainer.querySelector('.cart-total');
        const clearCartButton = cartContainer.querySelector('#clear-cart');
        const checkoutButton = cartContainer.querySelector('#checkout-button');

        if (!cart || !cart.items || cart.items.length === 0) {
            cartContainer.innerHTML = '<p>Корзина пуста</p>';
            return;
        }
        
        let total = 0;
        cart.items.forEach(item => {
             // Assuming backend populates 'product' field with product details
            if (item.product) {
                const price = item.product.price; // Get price from populated product object
                const itemTotal = price * item.quantity; // Use item.quantity
                total += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'images/placeholder.png'}" alt="${item.product.name}" style="width: 50px; height: auto;"></td>
                    <td>${item.product.name}</td>
                    <td>${price} ₽</td>
                    <td>${item.quantity}</td> <!-- Display item quantity -->
                    <td>${itemTotal} ₽</td>
                    <td>
                        <button class="remove-from-cart-btn" data-product-id="${item.product._id}">Удалить</button>
                    </td>
                `;
                cartTableBody.appendChild(row);
            }
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `Итого: ${total} ₽`;
        }

        // Добавляем обработчики событий после добавления элементов в DOM
        if (clearCartButton) {
            clearCartButton.addEventListener('click', clearCartBackend);
        }
        if (checkoutButton) {
            checkoutButton.addEventListener('click', showContactModal);
        }

        // Add event listeners for remove buttons (will call backend function)
        cartContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const productId = e.target.dataset.productId;
                await removeFromCartBackend(productId); // Call backend remove function
            });
        });

    } catch (error) {
        console.error('Error fetching or rendering cart:', error);
        cartContainer.innerHTML = `<p>Ошибка загрузки корзины: ${error.message}</p>`;
    }
}

// New functions to interact with backend cart API
async function removeFromCartBackend(productId) {
    const token = localStorage.getItem('token');
    if (!token) return; // Should not happen if renderCart check passes, but good practice

    try {
        const response = await fetch(`https://lending-juaw.onrender.com/api/cart/items/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось удалить товар из корзины');
        }

        alert('Товар удалён из корзины');
        renderCart(); // Re-render cart after successful removal
    } catch (error) {
        console.error('Ошибка при удалении товара из корзины:', error);
        alert(`Ошибка при удалении товара из корзины: ${error.message}`);
    }
}

async function clearCartBackend() {
     const token = localStorage.getItem('token');
    if (!token) return; // Should not happen if renderCart check passes, but good practice

    try {
        const response = await fetch('https://lending-juaw.onrender.com/api/cart', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
             const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось очистить корзину');
        }

        alert('Корзина очищена');
        renderCart(); // Re-render cart after successful clearing
    } catch (error) {
        console.error('Ошибка при очистке корзины:', error);
        alert(`Ошибка при очистке корзины: ${error.message}`);
    }
}

// Form handling functions
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address')
        };

        if (!validateContactForm(contactData)) {
            return;
        }

        await processOrderAndPayment(contactData);
    });
}

function validateContactForm(data) {
    if (!data.name || !data.phone || !data.email || !data.address) {
        alert('Пожалуйста, заполните все поля формы');
        return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        alert('Пожалуйста, введите корректный email!');
        return false;
    }

    return true;
}

function setupPhoneInput() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.value = '+7 ';
    
    phoneInput.addEventListener('input', (e) => {
        e.target.value = formatPhoneNumber(e.target.value);
    });

    phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            let numbers = e.target.value.replace(/\D/g, '');
            if (numbers.startsWith('7')) {
                numbers = numbers.substring(1);
            }
            if (numbers.length > 0) {
                numbers = numbers.slice(0, -1);
                e.target.value = formatPhoneNumber(numbers);
            } else {
                e.target.value = '+7 ';
            }
        }
    });

    phoneInput.addEventListener('keypress', (e) => {
        if (!/\d/.test(e.key)) {
            e.preventDefault();
        }
    });
}

function formatPhoneNumber(value) {
    let numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('7')) {
        numbers = numbers.substring(1);
    }
    
    let formatted = '';
    if (numbers.length > 0) {
        formatted = '+7 ';
        if (numbers.length > 0) {
            formatted += '(' + numbers.substring(0, 3);
        }
        if (numbers.length > 3) {
            formatted += ') ' + numbers.substring(3, 6);
        }
        if (numbers.length > 6) {
            formatted += '-' + numbers.substring(6, 8);
        }
        if (numbers.length > 8) {
            formatted += '-' + numbers.substring(8, 10);
        }
    } else {
        formatted = '+7 ';
    }
    
    return formatted;
}

// Modal handling functions
function showContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderCart(); // Initial render of the cart
    setupContactForm();
    setupPhoneInput();

    // Modal event listeners
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeContactModal();
        }
    });

    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', async () => {
            const contactData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value
            };

            // Проверяем заполнение всех полей (оставляем frontend валидацию)
            if (!contactData.name || !contactData.phone || !contactData.email || !contactData.address) {
                alert('Пожалуйста, заполните все поля формы');
                return;
            }

            // Проверка email (оставляем frontend валидацию)
            if (!/^\S+@\S+\.\S+$/.test(contactData.email)) {
                alert('Пожалуйста, введите корректный email!');
                return;
            }

            // Call the new function to process order and payment
            await processOrderAndPayment(contactData);
        });
    }
});

async function processOrderAndPayment(contactData) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Пожалуйста, войдите в систему для оформления заказа.');
        return;
    }

    try {
        // 1. Получаем корзину пользователя с бэкенда
        const cartResponse = await fetch('https://lending-juaw.onrender.com/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!cartResponse.ok) throw new Error('Ошибка получения корзины');
        const cart = await cartResponse.json();
        if (!cart.items || cart.items.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        // 2. Формируем массив товаров для заказа
        const products = cart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        }));

        // 3. Отправляем заказ на бэкенд
        const orderResponse = await fetch('https://lending-juaw.onrender.com/api/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                products,
                ...contactData // если бэкенд поддерживает эти поля, иначе убрать
            })
        });
        const orderResult = await orderResponse.json();
        if (!orderResponse.ok) throw new Error(orderResult.message || 'Ошибка оформления заказа');

        // 4. Очищаем корзину
        await fetch('https://lending-juaw.onrender.com/api/cart', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // 5. Перенаправляем на оплату, если есть ссылка
        if (orderResult.paymentUrl) {
            window.location.href = orderResult.paymentUrl;
        } else {
            alert('Заказ оформлен!');
            closeContactModal();
            renderCart();
        }
    } catch (error) {
        alert('Ошибка оформления заказа: ' + error.message);
    }
} 