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

    if (data.ton_address) {
        document.getElementById('ton-address').textContent = maskTonAddress(data.ton_address);
    }
}

function startGame() {
    window.location.href = 'tetris.html';
}

async function connectTonWallet() {
    // Пример подключения через Tonkeeper
    const tonkeeper = new Tonkeeper();
    const address = await tonkeeper.connect();

    const telegramUser = Telegram.WebApp.initDataUnsafe.user.username;
    const response = await fetch(`/api/connect_ton_wallet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telegram_user: telegramUser, ton_address: address })
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById('ton-address').textContent = maskTonAddress(address);
    } else {
        alert('Failed to connect wallet');
    }
}

function maskTonAddress(address) {
    return address.substring(0, 3) + '...' + address.substring(address.length - 3);
}

window.onload = function() {
    Telegram.WebApp.ready(); // Ensure the WebApp is ready
    applyTheme();
    loadUserData();
};
