const board = document.getElementById("gameBoard");
const timeDisplay = document.getElementById("time");
const movesDisplay = document.getElementById("moves");

const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const popup = document.getElementById("winPopup");
const finalStats = document.getElementById("finalStats");

let icons = ["🍎","🍌","🍇","🍒","🥝","🍉","🍍","🥥","🍑","🍓","🥕","🌽","🍆","🥔","🥭","🍋","🍈","🥬"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timer;
let gridSize = 16;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startGame() {
    board.innerHTML = "";

    let selectedIcons = icons.slice(0, gridSize / 2);
    cards = shuffle([...selectedIcons, ...selectedIcons]);

    // adjust grid
    let cols = Math.sqrt(gridSize);
    board.style.gridTemplateColumns = `repeat(${cols}, 70px)`;

    cards.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;

        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    flipSound.play();

    this.textContent = this.dataset.icon;
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;

    checkMatch();
}

function checkMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    if (isMatch) {
        matchSound.play();
        checkWin();
        resetTurn();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.textContent = "";
            secondCard.textContent = "";
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }, 800);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function checkWin() {
    let flipped = document.querySelectorAll(".flipped").length;

    if (flipped === cards.length) {
        clearInterval(timer);
        finalStats.textContent = `Time: ${time}s | Moves: ${moves}`;
        popup.style.display = "flex";
    }
}

function restartGame() {
    clearInterval(timer);
    popup.style.display = "none";
    moves = 0;
    time = 0;
    movesDisplay.textContent = 0;
    timeDisplay.textContent = 0;
    startGame();
}

function changeDifficulty() {
    let value = document.getElementById("difficulty").value;

    if (value === "easy") gridSize = 16;
    if (value === "medium") gridSize = 20;
    if (value === "hard") gridSize = 36;

    restartGame();
}

function toggleTheme() {
    document.body.classList.toggle("neon");
}

startGame();
