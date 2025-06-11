// Массив товаров для категории "РЭБ"
const rebProducts = [
    { 
        id: 'reb-1', 
        name: 'РЭБ-1', 
        price: '6000 ₽', 
        image: '../images/reb-1.png', 
        description: 'РЭБ комплекс 1, подавление сигналов.' 
    },
    { 
        id: 'reb-2', 
        name: 'РЭБ-2', 
        price: '6100 ₽', 
        image: '../images/reb-2.png', 
        description: 'РЭБ комплекс 2, расширенный диапазон.' 
    },
    { 
        id: 'reb-3', 
        name: 'РЭБ-3', 
        price: '6200 ₽', 
        image: '../images/reb-3.png', 
        description: 'РЭБ комплекс 3, мобильная версия.' 
    },
    { 
        id: 'reb-4', 
        name: 'РЭБ-4', 
        price: '6300 ₽', 
        image: '../images/reb-4.png', 
        description: 'РЭБ комплекс 4, стационарный вариант.' 
    },
    { 
        id: 'reb-5', 
        name: 'РЭБ-5', 
        price: '6400 ₽', 
        image: '../images/reb-5.png', 
        description: 'РЭБ комплекс 5, повышенная мощность.' 
    },
    { 
        id: 'reb-6', 
        name: 'РЭБ-6', 
        price: '6500 ₽', 
        image: '../images/reb-6.png', 
        description: 'РЭБ комплекс 6, компактный.' 
    },
    { 
        id: 'reb-7', 
        name: 'РЭБ-7', 
        price: '6600 ₽', 
        image: '../images/reb-7.png', 
        description: 'РЭБ комплекс 7, автономный.' 
    },
    { 
        id: 'reb-8', 
        name: 'РЭБ-8', 
        price: '6700 ₽', 
        image: '../images/reb-8.png', 
        description: 'РЭБ комплекс 8, новейшая разработка.' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(rebProducts, '/reb');
}); 