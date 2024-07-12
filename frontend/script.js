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
    window.location.href = 'tetris.html';
}

window.onload = function() {
    Telegram.WebApp.ready(); // Ensure the WebApp is ready
    applyTheme();
    loadUserData();
};



// Tetris game START
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('tetris-canvas');
    const context = canvas.getContext('2d');
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;
    let score = 0;
    let level = 1;

    function drawGrid() {
        context.lineWidth = 0.5;
        context.strokeStyle = '#ddd';
        for (let r = 0; r < rows; r++) {
            context.beginPath();
            context.moveTo(0, r * scale);
            context.lineTo(canvas.width, r * scale);
            context.stroke();
        }
        for (let c = 0; c < columns; c++) {
            context.beginPath();
            context.moveTo(c * scale, 0);
            context.lineTo(c * scale, canvas.height);
            context.stroke();
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        // Draw the current piece here
    }

    function update() {
        draw();
        requestAnimationFrame(update);
    }

    document.getElementById('left-btn').addEventListener('click', () => {
        // Move piece left
    });

    document.getElementById('right-btn').addEventListener('click', () => {
        // Move piece right
    });

    document.getElementById('rotate-btn').addEventListener('click', () => {
        // Rotate piece
    });

    document.getElementById('down-btn').addEventListener('click', () => {
        // Move piece down
    });

    update();

    // Fetch and display username
    const usernameElement = document.getElementById('username');
    fetch('/api/username?telegram_user=' + Telegram.WebApp.initDataUnsafe.user.username)
        .then(response => response.json())
        .then(data => {
            usernameElement.textContent = data.username;
        });
});
// Tetris game END