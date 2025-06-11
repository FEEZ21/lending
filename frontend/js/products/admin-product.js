function initAdminProductForm() {
    const addProductForm = document.getElementById('add-product-form');
    const messageElement = document.getElementById('add-product-message');

    if (!addProductForm || !messageElement) {
        return;
    }

    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        messageElement.textContent = '';
        messageElement.className = '';

        const formData = new FormData(addProductForm);

        const token = localStorage.getItem('token'); 

        if (!token) {
            messageElement.textContent = 'Ошибка: Администратор не авторизован.';
            messageElement.className = 'message-error';
            return;
        }

        try {
            const response = await fetch('https://lending-juaw.onrender.com/api/admin/categories', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = '✅ Категория успешно добавлена!';
                messageElement.className = 'message-success';
                addProductForm.reset();
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } else {
                const errorMessage = result.message || 'Неизвестная ошибка при добавлении категории';
                messageElement.textContent = `❌ Ошибка: ${errorMessage}`;
                messageElement.className = 'message-error';
            }
        } catch (error) {
            messageElement.textContent = 'Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.';
            messageElement.className = 'message-error';
        }
    });
}

// Ensure this function is called when the DOM is fully loaded,
// especially if the form is part of dynamically loaded content.
// This depends on how admin-add-product.html is loaded/rendered.
// If it's a full page, DOMContentLoaded is sufficient.
// If it's part of a modal or partial load, you might need to call initAdminProductForm()
// after the relevant HTML is inserted into the DOM.
document.addEventListener('DOMContentLoaded', initAdminProductForm); 