// Массив товаров для категории "РЭР"
const rerProducts = [
    { 
        id: 'rer-1', 
        name: 'РЭР-1', 
        price: '7000 ₽', 
        image: '../images/rer-1.png', 
        description: 'РЭР устройство 1, обнаружение сигналов.' 
    },
    { 
        id: 'rer-2', 
        name: 'РЭР-2', 
        price: '7100 ₽', 
        image: '../images/rer-2.png', 
        description: 'РЭР устройство 2, расширенный диапазон.' 
    },
    { 
        id: 'rer-3', 
        name: 'РЭР-3', 
        price: '7200 ₽', 
        image: '../images/rer-3.png', 
        description: 'РЭР устройство 3, мобильная версия.' 
    },
    { 
        id: 'rer-4', 
        name: 'РЭР-4', 
        price: '7300 ₽', 
        image: '../images/rer-4.png', 
        description: 'РЭР устройство 4, стационарный вариант.' 
    },
    { 
        id: 'rer-5', 
        name: 'РЭР-5', 
        price: '7400 ₽', 
        image: '../images/rer-5.png', 
        description: 'РЭР устройство 5, повышенная мощность.' 
    },
    { 
        id: 'rer-6', 
        name: 'РЭР-6', 
        price: '7500 ₽', 
        image: '../images/rer-6.png', 
        description: 'РЭР устройство 6, компактный.' 
    },
    { 
        id: 'rer-7', 
        name: 'РЭР-7', 
        price: '7600 ₽', 
        image: '../images/rer-7.png', 
        description: 'РЭР устройство 7, автономный.' 
    },
    { 
        id: 'rer-8', 
        name: 'РЭР-8', 
        price: '7700 ₽', 
        image: '../images/rer-8.png', 
        description: 'РЭР устройство 8, новейшая разработка.' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(rerProducts, '../products-details/rer');
}); 