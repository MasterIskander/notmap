function applyTheme() {
    if (window.Telegram.WebApp.themeParams) {
        const theme = window.Telegram.WebApp.themeParams;
        document.documentElement.style.setProperty('--background', theme.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--text', theme.text_color || '#000000');
        document.documentElement.style.setProperty('--button', theme.button_color || '#007BFF');
        document.documentElement.style.setProperty('--button_text', theme.button_text_color || '#ffffff');
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

async function connectTonWallet() {
    const manifestUrl = 'https://notmap.ru/tonconnect-manifest.json';
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl,
        buttonRootId: 'connect-ton-wallet-button'
    });
    
    tonConnectUI.uiOptions = {
        twaReturnUrl: 'https://t.me/notmaps_bot'
    };

    tonConnectUI.connectWallet()
        .then(session => {
            const address = session.account.address;
            
            const telegramUser = Telegram.WebApp.initDataUnsafe.user.username;
            fetch(`/api/connect_ton_wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ telegram_user: telegramUser, ton_address: address })
            })
            .then(response => {
                if (response.status === 409) {
                    alert('TON address already in use by another user');
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('ton-address').textContent = maskTonAddress(address);
                } else {
                    alert('Failed to connect wallet');
                }
            })
            .catch(error => {
                console.error('Failed to connect wallet:', error);
            });
        })
        .catch(error => {
            console.error('Failed to connect wallet:', error);
        });
}

function maskTonAddress(address) {
    return address.substring(0, 3) + '...' + address.substring(address.length - 3);
}

window.onload = function() {
    Telegram.WebApp.ready(); // Ensure the WebApp is ready
    applyTheme();
    loadUserData();
    document.getElementById('connect-ton-wallet-button').addEventListener('click', connectTonWallet);
};

