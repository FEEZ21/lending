// Массив товаров для категории "Квады"
const quadsProducts = [
    {
        id: 'quads-1',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер1.jpg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-2',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер2.jpg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-3',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер3.png',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-4',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер4.jpg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-5',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер5.jpg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-6',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер6.jpeg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-7',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер7.jpg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    {
        id: 'quads-8',
        name: 'Квадрокоптер',
        price: '3000 ₽',
        image: '../images/квадрокоптер8.jpg',
        description: 'Видеопередатчик для квадрокоптеров.'
    },
    // Добавьте другие товары категории "Квады" по необходимости
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(quadsProducts, '../products-details/quads');
}); 