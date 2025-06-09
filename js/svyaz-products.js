// Массив товаров для категории "Связь"
const svyazProducts = [
    { 
        id: 'svyaz-1', 
        name: 'Связь', 
        price: '4000 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 1.' 
    },
    { 
        id: 'svyaz-2', 
        name: 'Связь', 
        price: '4100 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 2.' 
    },
    { 
        id: 'svyaz-3', 
        name: 'Связь', 
        price: '4200 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 3.' 
    },
    { 
        id: 'svyaz-4', 
        name: 'Связь', price: '4300 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 4.' 
    },
    { 
        id: 'svyaz-5', 
        name: 'Связь', 
        price: '4400 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 5.' 
    },
    { 
        id: 'svyaz-6', 
        name: 'Связь', 
        price: '4500 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 6.' 
    },
    { 
        id: 'svyaz-7', 
        name: 'Связь', 
        price: '4600 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 7.' 
    },
    { 
        id: 'svyaz-8', 
        name: 'Связь', 
        price: '4700 ₽', 
        image: '../images/связь.jpg', 
        description: 'Устройство для связи 8.' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(svyazProducts, '../products-details/svyaz');
}); 