function initAdminProductForm() {
    console.log('initAdminProductForm called'); // Log 1
    const addProductForm = document.getElementById('add-product-form');
    const messageElement = document.getElementById('add-product-message');

    if (!addProductForm || !messageElement) {
        console.error('Admin product form or message element not found after dynamic load!');
        return;
    }
    console.log('Form and message element found'); // Log 2

    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submit event triggered'); // Log 3

        messageElement.textContent = ''; // Clear previous messages
        messageElement.className = ''; // Clear previous message classes

        console.log('Creating FormData'); // Log 4
        const formData = new FormData(addProductForm);
        console.log('FormData created', formData); // Log 5

        // Get admin JWT token
        const token = localStorage.getItem('token'); 

        if (!token) {
            messageElement.textContent = 'Ошибка: Администратор не авторизован.';
            messageElement.className = 'message-error';
            console.log('Admin token not found'); // Log 6
            return;
        }
        console.log('Admin token found'); // Log 7

        try {
            console.log('Attempting to fetch POST to /api/admin/categories'); // Updated URL
            const response = await fetch('http://localhost:5000/api/admin/categories', { // Updated URL
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            console.log('Fetch response received', response); // Log 9

            const result = await response.json();
            console.log('Response JSON parsed', result); // Log 10

            if (response.ok) {
                console.log('Category added successfully (response.ok is true)'); // Updated message
                messageElement.textContent = '✅ Категория успешно добавлена!'; // Updated message
                messageElement.className = 'message-success';
                addProductForm.reset();
                
                // Added: Redirect to the main page after successful submission
                setTimeout(() => {
                    console.log('Redirecting to index.html'); // Log 12
                    window.location.href = 'index.html';
                }, 1000);

            } else {
                console.log('Backend error response (response.ok is false)'); // Log 13
                console.error('Ошибка backend при добавлении категории:', result); // Updated message
                const errorMessage = result.message || 'Неизвестная ошибка при добавлении категории'; // Updated message
                messageElement.textContent = `❌ Ошибка: ${errorMessage}`;
                messageElement.className = 'message-error';

                if (result.errors && Array.isArray(result.errors)) {
                    result.errors.forEach(err => {
                        console.error(`- ${err.path}: ${err.msg}`);
                    });
                }
            }
        } catch (error) {
            console.error('Error during fetch or processing response:', error); // Log 14
            messageElement.textContent = 'Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.';
            messageElement.className = 'message-error';
        }
    });
}

// Экспортируем функцию init, чтобы ее можно было вызвать после загрузки HTML
// document.addEventListener('DOMContentLoaded', initAdminProductForm); // Убрали автоматическую инициализацию

// Теперь эту функцию нужно вызвать в admin-add-product.html после fetch 