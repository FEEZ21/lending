document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('add-product-item-form')) {
        initAdminProductItemForm();
    }
});

async function initAdminProductItemForm() {
    const form = document.getElementById('add-product-item-form');
    const messageDiv = document.getElementById('add-product-message');
    const categorySelect = document.getElementById('product-category');

    // Fetch categories and populate the dropdown
    async function fetchCategories() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            categorySelect.innerHTML = '<option value="">Выберите категорию</option>'; // Clear existing options
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name; // Используем название категории как значение
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            messageDiv.textContent = 'Не удалось загрузить категории.';
            messageDiv.className = 'message-error';
        }
    }

    await fetchCategories();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.textContent = ''; // Clear previous messages

        const formData = new FormData(form);
        const token = localStorage.getItem('token'); // Get auth token

        if (!token) {
            messageDiv.textContent = 'Необходимо авторизоваться.';
            messageDiv.className = 'message-error';
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/admin/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data' // FormData sets this automatically
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = data.message || 'Товар успешно добавлен!';
                messageDiv.className = 'message-success';
                form.reset(); // Clear form
            } else {
                messageDiv.textContent = data.message || 'Ошибка добавления товара.';
                messageDiv.className = 'message-error';
            }
        } catch (error) {
            console.error('Error adding product:', error);
            messageDiv.textContent = 'Произошла ошибка при отправке данных.';
            messageDiv.className = 'message-error';
        }
    });
} 