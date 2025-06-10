document.addEventListener('DOMContentLoaded', () => {
    const verificationStatus = document.getElementById('verificationStatus');
    const verificationActions = document.getElementById('verificationActions');
    const resendButton = document.getElementById('resendButton');

    // Получаем токен из URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError('Токен подтверждения не найден');
        return;
    }

    // Проверяем токен
    verifyEmail(token);

    // Обработчик для повторной отправки письма
    resendButton.addEventListener('click', async () => {
        const email = localStorage.getItem('pendingVerificationEmail');
        if (!email) {
            showError('Email не найден. Пожалуйста, зарегистрируйтесь снова.');
            return;
        }

        try {
            const response = await fetch('https://lending-juaw.onrender.com/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Письмо с подтверждением отправлено повторно. Пожалуйста, проверьте вашу почту.');
            } else {
                showError(data.message || 'Ошибка при повторной отправке письма');
            }
        } catch (error) {
            showError('Ошибка при отправке запроса');
        }
    });
});

async function verifyEmail(token) {
    try {
        const response = await fetch(`https://lending-juaw.onrender.com/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
            showSuccess('Email успешно подтвержден! Теперь вы можете войти в систему.');
            localStorage.removeItem('pendingVerificationEmail');
        } else {
            showError(data.message || 'Ошибка при подтверждении email');
        }
    } catch (error) {
        showError('Ошибка при отправке запроса');
    }
}

function showSuccess(message) {
    const verificationStatus = document.getElementById('verificationStatus');
    const verificationActions = document.getElementById('verificationActions');
    
    verificationStatus.innerHTML = `
        <p class="success-message">${message}</p>
    `;
    verificationActions.style.display = 'block';
    document.getElementById('resendButton').style.display = 'none';
}

function showError(message) {
    const verificationStatus = document.getElementById('verificationStatus');
    const verificationActions = document.getElementById('verificationActions');
    
    verificationStatus.innerHTML = `
        <p class="error-message">${message}</p>
    `;
    verificationActions.style.display = 'block';
} 