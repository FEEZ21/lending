// Массив товаров для категории "Видео"
const videoProducts = [
    {
        id: 'video-1',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/first.png',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-2',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video1.jpg',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-3',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video2.webp',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-4',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video3.jpg',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-5',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video4.jpeg',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-6',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video5.webp',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-7',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video6.webp',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    },
    {
        id: 'video-8',
        name: 'Видео',
        price: '1000 ₽',
        image: '../images/video7.webp',
        description: 'Видеопередатчик 1650 МГц 3 Вт.'
    }
    // Добавьте другие товары категории "Видео" по необходимости
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(videoProducts, '/video');
});