function applyTheme() {
    if (window.Telegram.WebApp.themeParams) {
        const theme = window.Telegram.WebApp.themeParams;
        document.documentElement.style.setProperty('--background', theme.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--text', theme.text_color || '#000000');
        document.documentElement.style.setProperty('--button', theme.button_color || '#007BFF');
        document.documentElement.style.setProperty('--button_text', theme.button_text_color || '#ffffff');
    }
}

window.onload = applyTheme;


async function loadUserData() {
    const telegramUser = Telegram.WebApp.initDataUnsafe.user.username;
    const response = await fetch(`/api/username?telegram_user=${telegramUser}`);
    const data = await response.json();

    document.getElementById('username').textContent = data.telegram_user;
    document.getElementById('user-image').src = data.image || 'default_image_path';
    document.getElementById('score').textContent = data.score || 0;
}


function startGame() {
    window.location.href = 'game.html';
}

window.onload = function() {
    Telegram.WebApp.ready(); // Ensure the WebApp is ready
    applyTheme();
    loadUserData();
};
