document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addProductItemBtn = document.getElementById('add-product-item-btn');
    const equipmentReviewsBtn = document.getElementById('admin-equipment-reviews-btn');
    const addCategorySection = document.getElementById('add-category-section');
    const addProductItemSection = document.getElementById('add-product-item-section');
    const equipmentReviewsSection = document.getElementById('equipment-reviews-section');
    const reviewForm = document.getElementById('equipment-review-form');
    const cancelReviewBtn = document.getElementById('cancel-equipment-review');

    // Функция для сброса активных классов
    function resetActiveButtons() {
        addCategoryBtn.classList.remove('active');
        addProductItemBtn.classList.remove('active');
        equipmentReviewsBtn.classList.remove('active');
    }

    // Функция для скрытия всех секций
    function hideAllSections() {
        addCategorySection.style.display = 'none';
        addProductItemSection.style.display = 'none';
        equipmentReviewsSection.style.display = 'none';
    }

    // Переключение на "Категории"
    addCategoryBtn.addEventListener('click', () => {
        resetActiveButtons();
        addCategoryBtn.classList.add('active');
        hideAllSections();
        addCategorySection.style.display = '';
    });

    // Переключение на "Товары"
    addProductItemBtn.addEventListener('click', () => {
        resetActiveButtons();
        addProductItemBtn.classList.add('active');
        hideAllSections();
        addProductItemSection.style.display = '';
    });

    // Переключение на "Обзоры оборудования"
    equipmentReviewsBtn.addEventListener('click', () => {
        resetActiveButtons();
        equipmentReviewsBtn.classList.add('active');
        hideAllSections();
        equipmentReviewsSection.style.display = '';
    });

    // Скрыть форму добавления обзора (отмена)
    if (cancelReviewBtn && reviewForm) {
        cancelReviewBtn.addEventListener('click', () => {
            reviewForm.reset();
        });
    }

    // Обработчик отправки формы обзора оборудования
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageElement = document.getElementById('equipment-review-message');
            messageElement.textContent = '';
            messageElement.className = '';

            const formData = new FormData(reviewForm);
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('https://lending-juaw.onrender.com/api/admin/equipment-reviews', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    messageElement.textContent = '✅ Обзор успешно добавлен!';
                    messageElement.className = 'message-success';
                    reviewForm.reset();
                } else {
                    const errorMessage = result.message || 'Неизвестная ошибка при добавлении обзора';
                    messageElement.textContent = `❌ Ошибка: ${errorMessage}`;
                    messageElement.className = 'message-error';
                }
            } catch (error) {
                messageElement.textContent = 'Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.';
                messageElement.className = 'message-error';
            }
        });
    }

    // По умолчанию показываем первую секцию (категории)
    hideAllSections();
    addCategorySection.style.display = '';
    resetActiveButtons();
    addCategoryBtn.classList.add('active');
}); 