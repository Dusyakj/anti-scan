const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameOverDiv = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let player;
let obstacles = [];
let obstacleFrequency = 60;
let frame = 0;
let animationId;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;

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

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

        this.draw();
    }
}

class Obstacle {
    constructor() {
        this.width = 80;
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

let touchLeft = false;
let touchRight = false;

leftBtn.addEventListener('touchstart', (e) => {

    e.preventDefault();
    touchLeft = true;
});

leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchLeft = false;
});

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchRight = true;
});

rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchRight = false;
});

function init() {
    player = new Player();
    obstacles = [];
    frame = 0;
    gameOver = true;
    score = 0;
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.add('hidden');
    animate()
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    player.update();

    if (frame % obstacleFrequency === 0) {
        obstacles.push(new Obstacle());
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.update();

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            endGame();
        }

        if (obstacle.y > canvasHeight) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('highScore', highScore);
            }
        }
    });

    if (keys.ArrowLeft) {
        player.dx = -player.speed;
    } else if (keys.ArrowRight) {
        player.dx = player.speed;
    } else {
        player.dx = 0;
    }

    if (touchLeft) {
        player.dx = -player.speed;
    }
    if (touchRight) {
        player.dx = player.speed;
    }

    frame++;
}

function endGame() {
    cancelAnimationFrame(animationId);
    gameOver = true;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
    init();
});

function firstInit() {
    player = new Player();
    obstacles = [];
    frame = 0;
    gameOver = true;
    score = 0;
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.add('hidden');
    endGame()
}
window.onload = firstInit;
