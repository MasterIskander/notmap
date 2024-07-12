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
