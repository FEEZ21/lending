document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addProductItemBtn = document.getElementById('add-product-item-btn');
    const addCategorySection = document.getElementById('add-category-section');
    const addProductItemSection = document.getElementById('add-product-item-section');

    // Функция для переключения вкладок
    function switchTab(activeBtn, inactiveBtn, activeSection, inactiveSection) {
        activeBtn.classList.add('active');
        inactiveBtn.classList.remove('active');
        activeSection.style.display = 'block';
        inactiveSection.style.display = 'none';
    }

    // Обработчики событий для кнопок
    addCategoryBtn.addEventListener('click', () => {
        switchTab(addCategoryBtn, addProductItemBtn, addCategorySection, addProductItemSection);
    });

    addProductItemBtn.addEventListener('click', () => {
        switchTab(addProductItemBtn, addCategoryBtn, addProductItemSection, addCategorySection);
    });
}); 