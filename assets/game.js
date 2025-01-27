
const startButton = document.querySelector('.start');
const resetButton = document.querySelector('.reset');
const restartButton = document.getElementById('restart');
const gameArea = document.getElementById('game-area');
const targetCircle = document.getElementById('target-circle');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const feedback = document.getElementById('feedback');
const loseMessage = document.getElementById('lose-message');

const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
const shapes = ['circle', 'square', 'triangle'];
let targetColor = '';
let objects = [];
let gameInterval;
let targetColorInterval;
let score = 0;
let highScore = 0;
let wrongClicks = 0;
let consecutiveCorrect = 0;

//const clickSound = new Audio('./assets/sounds/click.mp3');
const wrongSound = new Audio('./sounds/wrong.mp3');
const rightSound = new Audio('./sounds/right.wav');

function generateRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateRandomShape() {
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function updateTargetColor() {
    targetColor = generateRandomColor();
    targetCircle.style.backgroundColor = targetColor;
}

function createObjects() {
    for (let i = 0; i < 4; i++) {
        const object = document.createElement('div');
        object.classList.add('object', generateRandomShape());
        const color = generateRandomColor();
        object.style.backgroundColor = color;
        object.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
        object.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
        object.dataset.color = color;
        object.addEventListener('click', () => handleObjectClick(object));
        gameArea.appendChild(object);
        objects.push(object);
        setTimeout(() => removeObject(object), 2000);
    }
}

function removeObject(object) {
    if (gameArea.contains(object)) {
        gameArea.removeChild(object);
        objects.splice(objects.indexOf(object), 1);
    }
}

function handleObjectClick(object) {
    if (object.dataset.color === targetColor) {
        score += 10 + (consecutiveCorrect * 5);
        consecutiveCorrect++;
        rightSound.play();
        showFeedback("Right Click!", "green");
    } else {
        score = Math.max(0, score - 5);
        consecutiveCorrect = 0;
        wrongClicks++;
        wrongSound.play();
        showFeedback("Wrong Click!", "red");
        if (wrongClicks >= 5) {
            endGame();
        }
    }
    scoreDisplay.textContent = score;
    removeObject(object);
}

function showFeedback(message, color) {
    feedback.textContent = message;
    feedback.style.color = color;
    feedback.classList.add('visible');
    setTimeout(() => feedback.classList.remove('visible'), 1000);
}

function startGame() {
    resetGame();
    updateTargetColor();
    targetColorInterval = setInterval(updateTargetColor, 2000);
    gameInterval = setInterval(createObjects, 1000);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(targetColorInterval);
    objects.forEach(object => removeObject(object));
    objects = [];
    score = 0;
    wrongClicks = 0;
    consecutiveCorrect = 0;
    scoreDisplay.textContent = score;
    feedback.textContent = "";
    loseMessage.style.display = 'none';
    restartButton.style.display = 'none';
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(targetColorInterval);
    objects.forEach(object => removeObject(object));
    objects = [];
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
    loseMessage.style.display = 'block';
    restartButton.style.display = 'block';
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', () => {
    loseMessage.style.display = 'none';
    restartButton.style.display = 'none';
    startGame();
});
