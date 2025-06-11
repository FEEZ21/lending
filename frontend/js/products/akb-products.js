// Массив товаров для категории "АКБ"
const akbProducts = [
    { 
        id: 'akb-1', 
        name: 'АКБ-1', 
        price: '8000 ₽', 
        image: '../images/akb-1.png', 
        description: 'АКБ модель 1, 3000 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-2', 
        name: 'АКБ-2', 
        price: '8100 ₽', 
        image: '../images/akb-2.png', 
        description: 'АКБ модель 2, 3200 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-3', 
        name: 'АКБ-3', 
        price: '8200 ₽', 
        image: '../images/akb-3.png', 
        description: 'АКБ модель 3, 3400 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-4', 
        name: 'АКБ-4', 
        price: '8300 ₽', 
        image: '../images/akb-4.png', 
        description: 'АКБ модель 4, 3600 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-5', 
        name: 'АКБ-5', 
        price: '8400 ₽', 
        image: '../images/akb-5.png', 
        description: 'АКБ модель 5, 3800 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-6', 
        name: 'АКБ-6', 
        price: '8500 ₽', 
        image: '../images/akb-6.png', 
        description: 'АКБ модель 6, 4000 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-7', 
        name: 'АКБ-7', 
        price: '8600 ₽', 
        image: '../images/akb-7.png', 
        description: 'АКБ модель 7, 4200 мАч, Li-Ion.' 
    },
    { 
        id: 'akb-8', 
        name: 'АКБ-8', 
        price: '8700 ₽', 
        image: '../images/akb-8.png', 
        description: 'АКБ модель 8, 4400 мАч, Li-Ion.' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(akbProducts, '/akb');
}); 