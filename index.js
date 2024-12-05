const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameOverDiv = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let player;
let obstacles = [];
let obstacleFrequency = 60; // Скорость появления препятствий
let frame = 0;
let animationId;
let gameOver = false;

// Класс игрока
class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = (canvasWidth - this.width) / 2;
        this.y = canvasHeight - this.height - 10;
        this.speed = 5;
        this.dx = 0;
    }

    draw() {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;

        // Ограничение движения по горизонтали
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

        this.draw();
    }
}

// Класс препятствия
class Obstacle {
    constructor() {
        this.width = Math.random() * (100 - 30) + 30;
        this.height = 20;
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 3 + 2;
    }

    draw() {
        ctx.fillStyle = '#f44336';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}

// Обработка нажатий клавиш
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// Инициализация игры
function init() {
    player = new Player();
    obstacles = [];
    frame = 0;
    gameOver = false;
    gameOverDiv.classList.add('hidden');
    animate();
}

// Анимация игры
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    player.update();

    // Генерация препятствий
    if (frame % obstacleFrequency === 0) {
        obstacles.push(new Obstacle());
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.update();

        // Проверка столкновений
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            endGame();
        }

        // Удаление препятствий, вышедших за пределы экрана
        if (obstacle.y > canvasHeight) {
            obstacles.splice(index, 1);
        }
    });

    // Управление игроком
    if (keys.ArrowLeft) {
        player.dx = -player.speed;
    } else if (keys.ArrowRight) {
        player.dx = player.speed;
    } else {
        player.dx = 0;
    }

    frame++;
}

// Завершение игры
function endGame() {
    cancelAnimationFrame(animationId);
    gameOver = true;
    gameOverDiv.classList.remove('hidden');
}

// Обработчик кнопки рестарта
restartBtn.addEventListener('click', () => {
    init();
});

// Запуск игры при загрузке
window.onload = init;
