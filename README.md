# Lending Project

Веб-приложение для управления товарами и категориями с возможностью авторизации и корзиной покупок.

## Описание

Проект представляет собой полноценное веб-приложение, состоящее из:
- Frontend части (HTML, CSS, JavaScript)
- Backend части (Node.js, Express)
- Базы данных (JSON файлы для хранения данных)

### Основные функции
- Просмотр товаров по категориям
- Детальная информация о товарах
- Система авторизации пользователей
- Корзина покупок
- Административная панель для управления товарами и категориями

## Структура проекта

```
lending/
├── frontend/           # Frontend часть приложения
│   ├── css/           # Стили
│   ├── html/          # HTML шаблоны
│   ├── images/        # Изображения
│   ├── js/            # JavaScript файлы
│   └── data/          # JSON файлы для хранения данных
└── backend/           # Backend часть приложения
    ├── src/           # Исходный код
    └── data/          # Данные для бэкенда
```

## Установка и запуск

### Frontend
1. Откройте `frontend/html/index.html` в браузере
2. Или используйте локальный сервер для разработки

### Backend
1. Установите Node.js
2. Перейдите в директорию backend:
   ```bash
   cd backend
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Запустите сервер:
   ```bash
   npm start
   ```

## Технологии

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API для работы с бэкендом

### Backend
- Node.js
- Express.js
- JSON для хранения данных

## API Endpoints

### Аутентификация
- POST `/api/auth/login` - Вход в систему
- POST `/api/auth/register` - Регистрация

### Товары
- GET `/api/products` - Получить все товары
- GET `/api/products/:id` - Получить товар по ID
- POST `/api/products` - Создать новый товар
- PUT `/api/products/:id` - Обновить товар
- DELETE `/api/products/:id` - Удалить товар

### Категории
- GET `/api/categories` - Получить все категории
- GET `/api/categories/:id` - Получить категорию по ID
- POST `/api/categories` - Создать новую категорию
- PUT `/api/categories/:id` - Обновить категорию
- DELETE `/api/categories/:id` - Удалить категорию

## Лицензия

MIT License