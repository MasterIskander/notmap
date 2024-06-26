document.addEventListener('DOMContentLoaded', () => {
    const cellCountElement = document.getElementById('cell-count');
    const notpointElement = document.getElementById('notpoint');
    const totalNotpointElement = document.getElementById('total-notpoint');
    const availableNotpointElement = document.getElementById('available-notpoint');
    const claimBtn = document.getElementById('claim-btn');
    const eventsElement = document.getElementById('events');
    const cellStats = document.getElementById('cell-stats');
    const eventCountElement = document.getElementById('event-count');
    const progressElement = document.getElementById('progress');
    const grid = document.querySelector('.grid');
    let cellCount = 1;
    let notpoint = 0;
    let totalNotpoint = 100000;
    let availableNotpoint = 0;
    const totalCells = 3000;
    let remainingCells = totalCells;
    let eventCount = 0;
    let claimCooldown = false;

    // Создание экземпляров шума Перлина
    const simplex = new SimplexNoise();

    // Функция генерации шума Перлина
    function generatePerlinNoise(x, y, scale) {
        return (simplex.noise2D(x / scale, y / scale) + 1) / 2;
    }

    // Функция генерации карты
    function generateMap() {
        const noiseScale = 10;
        const goldClusters = [];

        for (let y = 0; y < 60; y++) {
            for (let x = 0; x < 50; x++) {
                const noiseValue = generatePerlinNoise(x, y, noiseScale);
                const cell = document.createElement('div');

                if (noiseValue < 0.05) {
                    cell.dataset.type = 'gold';
                    cell.dataset.color = 'orange';
                } else if (noiseValue < 0.25) {
                    cell.dataset.type = 'mountain';
                    cell.dataset.color = 'brown';
                } else if (noiseValue < 0.65) {
                    cell.dataset.type = 'water';
                    cell.dataset.color = 'blue';
                } else if (noiseValue < 0.85) {
                    cell.dataset.type = 'forest';
                    cell.dataset.color = 'green';
                } else {
                    cell.dataset.type = 'land';
                    cell.dataset.color = 'yellow';
                }

                                cell.classList.add('cell', 'closed');
                grid.appendChild(cell);

                // Сохранение координат для золотых кластеров
                if (cell.dataset.type === 'gold') {
                    goldClusters.push({ x, y });
                }
            }
        }

        // Генерация золотых кластеров
        goldClusters.forEach((cluster) => {
            let goldClusterSize = 6; // Размер кластера
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = cluster.x + dx;
                    const ny = cluster.y + dy;
                    if (nx >= 0 && nx < 50 && ny >= 0 && ny < 60 && (dx !== 0 || dy !== 0)) {
                        const cell = grid.children[ny * 50 + nx];
                        if (cell && cell.dataset.type !== 'gold' && goldClusterSize > 0) {
                            cell.dataset.type = 'gold';
                            cell.dataset.color = 'orange';
                            goldClusterSize--;
                        }
                    }
                }
            }
        });
    }

    // Генерация карты
    generateMap();

    document.getElementById('increase').addEventListener('click', () => {
        cellCount++;
        cellCountElement.textContent = cellCount;
    });

    document.getElementById('decrease').addEventListener('click', () => {
        if (cellCount > 1) {
            cellCount--;
            cellCountElement.textContent = cellCount;
        }
    });

    document.getElementById('buy-btn').addEventListener('click', () => {
        if (remainingCells >= cellCount) {
            remainingCells -= cellCount;
            cellStats.textContent = `${remainingCells} / ${totalCells}`;
            progressElement.style.width = `${(remainingCells / totalCells) * 100}%`;

            for (let i = 0; i < cellCount; i++) {
                const closedCells = document.querySelectorAll('.cell.closed');
                if (closedCells.length > 0) {
                    const randomIndex = Math.floor(Math.random() * closedCells.length);
                    const cell = closedCells[randomIndex];
                    cell.classList.remove('closed');
                    cell.style.backgroundColor = cell.dataset.color;

                    switch (cell.dataset.type) {
                        case 'land':
                            availableNotpoint += 100;
                            break;
                        case 'water':
                            availableNotpoint += 30;
                            break;
                        case 'mountain':
                            availableNotpoint += 200;
                            break;
                        case 'forest':
                            availableNotpoint += 150;
                            break;
                        case 'gold':
                            availableNotpoint += 200; // Золото добавляет 200 к доступным для клейма
                            totalNotpoint += 100000;  // Увеличиваем Total NOTPOINT на 100000
                            eventsElement.classList.remove('hidden');
                            eventCount++;
                            totalNotpointElement.textContent = totalNotpoint;
                            eventCountElement.textContent = `Events: ${eventCount}`;
                            break;
                    }
                    availableNotpointElement.textContent = availableNotpoint;
                }
            }
        } else {
            alert('Not enough cells remaining!');
        }
    });

    claimBtn.addEventListener('click', () => {
        if (!claimCooldown) {
            const claimAmount = Math.min(availableNotpoint, totalNotpoint);
            notpoint += claimAmount;
            notpointElement.textContent = notpoint;
            totalNotpoint -= claimAmount;
            totalNotpointElement.textContent = totalNotpoint;
            availableNotpointElement.textContent = availableNotpoint - claimAmount;
            availableNotpoint -= claimAmount;

            claimBtn.disabled = true;
            claimBtn.classList.add('disabled');
            startClaimCooldown();
        }
    });

    function startClaimCooldown() {
        claimCooldown = true;
        let countdown = 10;
        claimBtn.textContent = `00:${countdown < 10 ? '0' : ''}${countdown}`;

        const interval = setInterval(() => {
            countdown--;
            claimBtn.textContent = `00:${countdown < 10 ? '0' : ''}${countdown}`;
            if (countdown <= 0) {
                clearInterval(interval);
                claimBtn.classList.remove('disabled');
                claimBtn.disabled = false;
                claimBtn.textContent = 'CLAIM';
                claimCooldown = false;
            }
        }, 1000);
    }
});
