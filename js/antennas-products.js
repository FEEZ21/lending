// Массив товаров для категории "Антенны"
const antennasProducts = [
    {
        id: 'antennas-1',
        name: 'Антенна Yagi',
        price: '1500 ₽',
        image: '../images/antenna.jpg',
        description: 'Антенна круговой поляризации 5.8 ГГц.'
    },
    {
        id: 'antennas-2',
        name: 'Кабельная сборка SMA - PL-259 10 метров',
        price: '2000 ₽',
        image: '../images/Кабель.jpeg',
        description: 'Антенна линейной поляризации 2.4 ГГц.'
    },
    {
        id: 'antennas-3',
        name: 'Антенна Кубик 400-700 МГц',
        price: '2500 ₽',
        image: '../images/antennaKubik-400-700.png',
        description: 'Антенна направленного действия 900 МГц.'
    },
    {
        id: 'antennas-4',
        name: 'Антенна А34Д',
        price: '3000 ₽',
        image: '../images/antenna-a34d.png',
        description: 'Антенна всенаправленная 433 МГц.'
    },
    {
        id: 'antennas-5',
        name: 'Антенна угловая',
        price: '3500 ₽',
        image: '../images/antenna.jpg',
        description: 'Антенна Yagi 1.2 ГГц.'
    },
    {
        id: 'antennas-6',
        name: 'Антенна линзовая',
        price: '4000 ₽',
        image: '../images/antenna.jpg',
        description: 'Антенна спиральная 2.4 ГГц.'
    },
    {
        id: 'antennas-7',
        name: 'Антенна всенаправленная',
        price: '4500 ₽',
        image: '../images/antenna.jpg',
        description: 'Антенна панельная 5.8 ГГц.'
    },
    {
        id: 'antennas-8',
        name: 'Антенна адаптивная',
        price: '5000 ₽',
        image: '../images/antenna.jpg',
        description: 'Антенна MIMO 2.4/5.8 ГГц.'
    }
    // Добавьте другие товары категории "Антенны" по необходимости
];

document.addEventListener('DOMContentLoaded', () => {
    // Call the general renderProductsGrid function
    renderProductsGrid(antennasProducts, '../products-details/antennas');
});