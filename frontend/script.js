function startGame() {
    // Перенаправляем пользователя на страницу игры
    window.location.href = 'game.html'; // Предполагается, что это будет страница игры
}

// Функция для загрузки данных пользователя из базы данных
async function loadUserData() {
    const response = await fetch('/api/username?telegram_user=iskandroid');
    const data = await response.json();

    document.getElementById('username').textContent = data.username;
    document.getElementById('user-image').src = data.image || 'default_image_path';
    document.getElementById('score').textContent = data.score || 0;
}

// Загрузка данных пользователя при загрузке страницы
window.onload = loadUserData;
