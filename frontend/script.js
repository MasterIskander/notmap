function applyTheme() {
    const theme = Telegram.WebApp.themeParams;

    if (theme.bg_color) {
        document.documentElement.style.setProperty('--bg-color', `#${theme.bg_color}`);
    }
    if (theme.text_color) {
        document.documentElement.style.setProperty('--text-color', `#${theme.text_color}`);
    }
    if (theme.button_color) {
        document.documentElement.style.setProperty('--button-color', `#${theme.button_color}`);
    }
    if (theme.button_hover_color) {
        document.documentElement.style.setProperty('--button-hover-color', `#${theme.button_hover_color}`);
    }
    if (theme.button_active_color) {
        document.documentElement.style.setProperty('--button-active-color', `#${theme.button_active_color}`);
    }
    if (theme.footer_bg_color) {
        document.documentElement.style.setProperty('--footer-bg-color', `#${theme.footer_bg_color}`);
    }
    if (theme.footer_text_color) {
        document.documentElement.style.setProperty('--footer-text-color', `#${theme.footer_text_color}`);
    }
    if (theme.footer_active_bg_color) {
        document.documentElement.style.setProperty('--footer-active-bg-color', `#${theme.footer_active_bg_color}`);
    }
    if (theme.footer_active_text_color) {
        document.documentElement.style.setProperty('--footer-active-text-color', `#${theme.footer_active_text_color}`);
    }
}

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
