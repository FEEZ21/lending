class AuthModal {
    constructor() {
        this.modal = null;
        this.isLogin = true; // true для входа, false для регистрации
        this.init();
    }

    async init() {
        // Создаем модальное окно
        this.modal = document.createElement('div');
        this.modal.className = 'auth-modal';
        document.body.appendChild(this.modal);

        // Загружаем HTML содержимое из отдельного файла
        try {
            const response = await fetch('html/auth-modal.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            this.modal.innerHTML = htmlContent;
        } catch (error) {
            console.error('Error loading auth modal HTML:', error);
            // Возможно, показать сообщение об ошибке пользователю
            return; // Прекратить инициализацию, если HTML не загружен
        }

        // Добавляем стили из отдельного файла CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'css/auth-modal.css';
        document.head.appendChild(linkElement);

        // Добавляем обработчики событий только после загрузки HTML
        this.addEventListeners();
    }

    addEventListeners() {
        // Закрытие модального окна
        this.modal.querySelector('.close-modal').addEventListener('click', () => {
            this.hide();
        });

        // Переключение между вкладками
        this.modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Обработка формы входа
        this.modal.querySelector('#loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Обработка формы регистрации
        this.modal.querySelector('#registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Устанавливаем значение по умолчанию и добавляем форматирование для номера телефона
        const registerPhoneInput = this.modal.querySelector('#registerPhone');
        if (registerPhoneInput) {
            if (registerPhoneInput.value === '') {
                registerPhoneInput.value = '+7'; // Устанавливаем +7 по умолчанию
            }
            registerPhoneInput.addEventListener('input', (e) => {
                const cursorPosition = e.target.selectionStart;
                const oldValue = e.target.value;
                const formattedValue = this.formatPhoneNumber(oldValue); // Передаем старое значение для обработки

                e.target.value = formattedValue;

                // Попытка сохранить позицию курсора
                let newCursorPosition = cursorPosition + (formattedValue.length - oldValue.length);
                if (newCursorPosition < 0) newCursorPosition = 0;
                if (newCursorPosition > formattedValue.length) newCursorPosition = formattedValue.length;
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            });
        }

        // Обработка "Забыли пароль"
        this.modal.querySelector('#forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    switchTab(tabName) {
        this.isLogin = tabName === 'login';
        
        // Обновляем активные классы
        this.modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        this.modal.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}Form`);
        });
    }

    async handleLogin() {
        this.clearErrors(); // Очищаем предыдущие ошибки перед новой проверкой

        const email = this.modal.querySelector('#loginEmail').value;
        const password = this.modal.querySelector('#loginPassword').value;

        const errors = [];
        if (!email) {
            errors.push({ path: 'email', msg: 'Пожалуйста, введите Email' });
        }
        if (!password) {
            errors.push({ path: 'password', msg: 'Пожалуйста, введите пароль' });
        }

        if (errors.length > 0) {
            this.displayErrors(errors);
            return; // Останавливаем выполнение, если есть ошибки
        }

        try {
            const response = await fetch('https://lending-juaw.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем токен
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Обновляем UI
                this.updateAuthUI(data.user);
                this.hide();
                
                // Показываем уведомление об успешном входе
                this.showNotification('Успешный вход!', 'success');

                // Added: Hard reload the page after successful login
                window.location.reload(true);
            } else if (response.status === 400 && data.errors) {
                // Обрабатываем ошибки валидации
                this.displayErrors(data.errors);
                this.showNotification(data.message || 'Ошибка валидации', 'error');
            } else {
                this.showNotification(data.message || 'Ошибка входа', 'error');
            }
        } catch (err) {
            this.showNotification('Ошибка сервера', 'error');
        }
    }

    async handleRegister() {
        this.clearErrors(); // Очищаем предыдущие ошибки перед новой проверкой

        const name = this.modal.querySelector('#registerName').value;
        const email = this.modal.querySelector('#registerEmail').value;
        const password = this.modal.querySelector('#registerPassword').value;
        const phone = this.modal.querySelector('#registerPhone').value;

        const errors = [];
        if (!name) {
            errors.push({ path: 'name', msg: 'Пожалуйста, введите имя' });
        }
        if (!email) {
            errors.push({ path: 'email', msg: 'Пожалуйста, введите Email' });
        }
        if (!password) {
            errors.push({ path: 'password', msg: 'Пожалуйста, введите пароль' });
        }

        // Валидация номера телефона после форматирования
        const cleanedPhoneForValidation = phone.replace(/\D/g, ''); // Удаляем все нецифровые символы
        if (cleanedPhoneForValidation.length !== 11 || !cleanedPhoneForValidation.startsWith('7')) {
            errors.push({ path: 'phone', msg: 'Пожалуйста, введите корректный российский номер телефона (+7XXXXXXXXXX)' });
        }

        if (errors.length > 0) {
            this.displayErrors(errors);
            return; // Останавливаем выполнение, если есть ошибки
        }

        // Номер телефона уже отформатирован и очищен до +7XXXXXXXXXX
        const finalPhone = `+${cleanedPhoneForValidation}`;

        try {
            const response = await fetch('https://lending-juaw.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, phone: finalPhone }) // Отправляем очищенный номер
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем токен
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Обновляем UI
                this.updateAuthUI(data.user);
                this.hide();
                
                // Показываем уведомление об успешной регистрации
                this.showNotification('Регистрация успешна!', 'success');
            } else if (response.status === 400 && data.errors) {
                // Обрабатываем ошибки валидации
                this.displayErrors(data.errors);
                this.showNotification(data.message || 'Ошибка валидации', 'error');
            } else {
                this.showNotification(data.message || 'Ошибка регистрации', 'error');
            }
        } catch (err) {
            this.showNotification('Ошибка сервера', 'error');
        }
    }

    handleForgotPassword() {
        const email = this.modal.querySelector('#loginEmail').value;
        if (!email) {
            this.showNotification('Введите email для восстановления пароля', 'error');
            return;
        }

        fetch('https://lending-juaw.onrender.com/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            this.showNotification(data.message, 'success');
        })
        .catch(() => {
            this.showNotification('Ошибка сервера', 'error');
        });
    }

    // Функция для очистки предыдущих сообщений об ошибках
    clearErrors() {
        this.modal.querySelectorAll('.error-message').forEach(span => {
            span.textContent = '';
        });
    }

    // Функция для отображения ошибок валидации
    displayErrors(errors) {
        // Очищаем предыдущие ошибки
        this.clearErrors();

        // Находим активную форму
        const activeFormId = this.isLogin ? 'loginForm' : 'registerForm';
        const activeForm = this.modal.querySelector(`#${activeFormId}`);

        if (!activeForm) {
            return;
        }

        // Отображаем новые ошибки
        errors.forEach(error => {
            const fieldName = error.path; // Имя поля ошибки из бэкенда или моя клиентская валидация
            const errorMessage = error.msg; // Сообщение об ошибке

            let inputElement = null;

            // Поиск поля ввода по ID
            if (activeFormId === 'registerForm') {
                switch (fieldName) {
                    case 'name':
                        inputElement = activeForm.querySelector('#registerName');
                        break;
                    case 'email':
                        inputElement = activeForm.querySelector('#registerEmail');
                        break;
                    case 'password':
                        inputElement = activeForm.querySelector('#registerPassword');
                        break;
                    case 'phone':
                        inputElement = activeForm.querySelector('#registerPhone');
                        break;
                }
            } else if (activeFormId === 'loginForm') {
                 switch (fieldName) {
                    case 'email':
                        inputElement = activeForm.querySelector('#loginEmail');
                        break;
                    case 'password':
                        inputElement = activeForm.querySelector('#loginPassword');
                        break;
                 }
            }

            // Находим соответствующее поле ввода по его ID, который заканчивается на fieldName
            // Используем querySelector, чтобы найти input с id, оканчивающимся на fieldName (без учета регистра)
            // Добавим более точный селектор, чтобы избежать совпадений с другими элементами
            // const inputElement = activeForm.querySelector(`input[id$="${fieldName.toLowerCase()}"]`);

            if (inputElement) {
                // Находим элемент для отображения ошибки внутри той же группы форм
                const formGroup = inputElement.closest('.form-group');

                if (formGroup) {
                    const errorSpan = formGroup.querySelector('.error-message');

                    if (errorSpan) {
                        errorSpan.textContent = errorMessage;
                    }
                }
            }
        });
    }

    updateAuthUI(user) {
        const authButtonsContainer = document.querySelector('.auth-buttons');
        const loginButton = authButtonsContainer ? authButtonsContainer.querySelector('.login-btn') : null;
        const registerButton = authButtonsContainer ? authButtonsContainer.querySelector('.register-btn') : null;
        // Added: Get the logout button and admin button
        const logoutButton = authButtonsContainer ? authButtonsContainer.querySelector('.logout-button') : null;
        const adminButton = authButtonsContainer ? authButtonsContainer.querySelector('#admin-add-product-btn') : null;

        if (authButtonsContainer) {
            if (user) {
                // Пользователь авторизован
                // Modified: Hide login/register, show logout and user name
                if (loginButton) loginButton.style.display = 'none';
                if (registerButton) registerButton.style.display = 'none';
                
                // Add user name span if it doesn't exist
                let userNameSpan = authButtonsContainer.querySelector('.user-name-span');
                if (!userNameSpan) {
                    userNameSpan = document.createElement('span');
                    userNameSpan.className = 'user-name-span';
                    // Insert the span before the logout button if logout button exists
                    if (logoutButton) {
                        authButtonsContainer.insertBefore(userNameSpan, logoutButton);
                    } else { // Otherwise, just append it
                         authButtonsContainer.appendChild(userNameSpan);
                    }
                   
                }
                 userNameSpan.textContent = `Привет, ${user.name}`;
                 userNameSpan.style.display = ''; // Show the span

                if (logoutButton) {
                    logoutButton.style.display = 'inline-block'; // Show the logout button
                     // Re-add event listener as it might be lost if button was recreated
                    logoutButton.removeEventListener('click', this.handleLogoutBound); // Remove previous if exists
                    this.handleLogoutBound = this.handleLogout.bind(this); // Bind 'this' for event listener
                    logoutButton.addEventListener('click', this.handleLogoutBound);
                } else {
                     console.warn('Logout button not found in DOM after login UI update.');
                }

                // NOTE: Admin button visibility is still handled by main.js based on role

            } else {
                // Пользователь не авторизован
                 // Modified: Show login/register, hide logout and user name
                if (loginButton) loginButton.style.display = 'inline-block';
                if (registerButton) registerButton.style.display = 'inline-block';

                const userNameSpan = authButtonsContainer.querySelector('.user-name-span');
                 if (userNameSpan) userNameSpan.style.display = 'none'; // Hide the user name span
                
                if (logoutButton) logoutButton.style.display = 'none'; // Hide the logout button

                // Re-add event listeners for login/register as they might be lost
                 if (loginButton) {
                    loginButton.removeEventListener('click', this.switchTab.bind(this, 'login'));
                    loginButton.addEventListener('click', () => { this.switchTab('login'); this.show(); });
                 }
                 if (registerButton) {
                     registerButton.removeEventListener('click', this.switchTab.bind(this, 'register'));
                     registerButton.addEventListener('click', () => { this.switchTab('register'); this.show(); });
                 }

                 // NOTE: Admin button visibility is still handled by main.js based on role
            }
             // Ensure admin button is not accidentally hidden by auth modal logic (it's handled by main.js)
             if (adminButton && adminButton.style.display === 'none' && user && user.role === 'admin') {
                 // This case should be handled by main.js, but just in case, ensure it's not hidden by auth logic
                 // adminButton.style.display = 'inline-block'; // This logic should be in main.js
             }

        }
    }

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Added: Hard reload the page after successful logout
        window.location.reload(true);

        // The updateAuthUI and showNotification calls below won't be reached because of reload, but keeping them for logic clarity
        // this.updateAuthUI(null);
        // this.showNotification('Вы успешно вышли', 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    show() {
        this.modal.style.display = 'block';
    }

    hide() {
        this.modal.style.display = 'none';
    }

    // Новая функция для форматирования номера телефона (строгая российская маска)
    formatPhoneNumber(phoneNumber) {
        let cleaned = phoneNumber.replace(/\D/g, ''); // Оставляем только цифры

        // Убедимся, что всегда начинается с '7' для российского номера
        if (cleaned.length === 0) {
            return '+7'; // Дефолтное значение
        }

        if (cleaned[0] === '8') {
            cleaned = '7' + cleaned.substring(1); // Заменяем 8 на 7
        } else if (cleaned[0] !== '7') {
            cleaned = '7' + cleaned; // Добавляем 7, если начинается не с 7
        }

        // Ограничиваем до 11 цифр (7 + 10 цифр)
        if (cleaned.length > 11) {
            cleaned = cleaned.substring(0, 11);
        }

        let formatted = '+7';

        // Применяем маску: (XXX) XXX-XX-XX
        if (cleaned.length > 1) {
            formatted += ' (' + cleaned.substring(1, Math.min(4, cleaned.length));
        }
        if (cleaned.length >= 4) {
            formatted += ') ' + cleaned.substring(4, Math.min(7, cleaned.length));
        }
        if (cleaned.length >= 7) {
            formatted += '-' + cleaned.substring(7, Math.min(9, cleaned.length));
        }
        if (cleaned.length >= 9) {
            formatted += '-' + cleaned.substring(9, Math.min(11, cleaned.length));
        }

        return formatted;
    }
}

// Создаем экземпляр модального окна
const authModal = new AuthModal();

// Находим кнопки авторизации в header и добавляем обработчики
document.addEventListener('DOMContentLoaded', () => {
    // These buttons should ideally be in the initial HTML
    const authButtonsContainer = document.querySelector('.auth-buttons');
    const loginButton = authButtonsContainer ? authButtonsContainer.querySelector('.login-btn') : null;
    const registerButton = authButtonsContainer ? authButtonsContainer.querySelector('.register-btn') : null;

    if (loginButton && registerButton) {
        // Добавляем обработчик для кнопки входа
        loginButton.addEventListener('click', () => {
            authModal.switchTab('login');
            authModal.show();
        });

        // Добавляем обработчик для кнопки регистрации
        registerButton.addEventListener('click', () => {
            authModal.switchTab('register');
            authModal.show();
        });

        // Обновляем UI при загрузке страницы на основе локального хранилища
        authModal.updateAuthUI(JSON.parse(localStorage.getItem('user')));
    } else {
        console.error('Login or Register button not found in DOM. Auth UI cannot be initialized.');
    }
}); 