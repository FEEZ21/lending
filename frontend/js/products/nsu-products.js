// Массив товаров для категории "НСУ"
const nsuProducts = [
    { 
        id: 'nsu-1', 
        name: 'НСУ-40', 
        price: '5000 ₽', 
        image: '../images/nsy1.jpg', 
        description: 'НСУ модель 40, 40 каналов, 25/3000 мВт.' 
    },
    { 
        id: 'nsu-2', 
        name: 'НСУ-41', 
        price: '5100 ₽', 
        image: '../images/nsy2.jpg', 
        description: 'НСУ модель 41, 41 канал, 30/3200 мВт.' 
    },
    { 
        id: 'nsu-3', 
        name: 'НСУ-42', 
        price: '5200 ₽', 
        image: '../images/nsy3.jpg', 
        description: 'НСУ модель 42, 42 канала, 35/3400 мВт.' 
    },
    { 
        id: 'nsu-4', 
        name: 'НСУ-43', 
        price: '5300 ₽', 
        image: '../images/nsy1.jpg', 
        description: 'НСУ модель 43, 43 канала, 40/3600 мВт.' 
    },
    { 
        id: 'nsu-5', 
        name: 'НСУ-44', 
        price: '5400 ₽', 
        image: '../images/nsy2.jpg', 
        description: 'НСУ модель 44, 44 канала, 45/3800 мВт.' 
    },
    { 
        id: 'nsu-6', 
        name: 'НСУ-45', 
        price: '5500 ₽', 
        image: '../images/nsy3.jpg', 
        description: 'НСУ модель 45, 45 каналов, 50/4000 мВт.' 
    },
    { 
        id: 'nsu-7', 
        name: 'НСУ-46', 
        price: '5600 ₽', 
        image: '../images/nsy1.jpg', 
        description: 'НСУ модель 46, 46 каналов, 55/4200 мВт.' 
    },
    { 
        id: 'nsu-8', 
        name: 'НСУ-47', 
        price: '5700 ₽', 
        image: '../images/nsy2.jpg', 
        description: 'НСУ модель 47, 47 каналов, 60/4400 мВт.' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(nsuProducts, '../products-details/nsu');
}); 