const GameConfig = Object.freeze({
    INITIAL_TIME: 60,
    INITIAL_LIVES: 3,
    GAME_VELOCITY: 1000,
    COUNTDOWN_INTERVAL: 1000,
    AUDIO_VOLUME: 0.2,
    MAX_TOP_SCORES: 5,
    STORAGE_KEY: 'gameScores',
});

const state = {
    view: {
        squares: null,
        timeLeft: null,
        score: null,
        lives: null,
        startScreen: null,
        startButton: null,
        timeoutScreen: null,
        timeoutScore: null,
        timeoutLives: null,
        continueButton: null,
        menuButtonTimeout: null,
        gameoverScreen: null,
        finalScore: null,
        bestScore: null,
        rankingList: null,
        playerNameInput: null,
        saveAndRestartButton: null,
        menuButtonGameover: null,
    },
    values: {
        gameVelocity: GameConfig.GAME_VELOCITY,
        hitPosition: null,
        result: 0,
        currentTime: GameConfig.INITIAL_TIME,
        lives: GameConfig.INITIAL_LIVES,
        bestScore: 0,
        canClick: true,
        isGameRunning: false,
        roundScore: 0,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
    audio: {
        hit: null,
    },
};

function initAudio() {
    try {
        state.audio.hit = new Audio('./src/audios/hit.m4a');
        state.audio.hit.volume = GameConfig.AUDIO_VOLUME;
    } catch (error) {
        console.warn('Erro ao carregar áudio:', error);
    }
}

function playHitSound() {
    if (!state.audio.hit) return;

    try {
        state.audio.hit.currentTime = 0;
        state.audio.hit.play().catch((error) => {
            console.warn('Reprodução de áudio bloqueada:', error);
        });
    } catch (error) {
        console.warn('Erro ao reproduzir áudio:', error);
    }
}

function cacheDOMElements() {
    state.view.squares = document.querySelectorAll('.square');
    state.view.timeLeft = document.querySelector('#time-left');
    state.view.score = document.querySelector('#score');
    state.view.lives = document.querySelector('#lives');

    state.view.startScreen = document.querySelector('#start-screen');
    state.view.startButton = document.querySelector('#start-button');

    state.view.timeoutScreen = document.querySelector('#timeout-screen');
    state.view.timeoutScore = document.querySelector('#timeout-score');
    state.view.timeoutLives = document.querySelector('#timeout-lives');
    state.view.continueButton = document.querySelector('#continue-button');
    state.view.menuButtonTimeout = document.querySelector('#menu-button-timeout');

    state.view.gameoverScreen = document.querySelector('#gameover-screen');
    state.view.finalScore = document.querySelector('#final-score');
    state.view.bestScore = document.querySelector('#best-score');
    state.view.rankingList = document.querySelector('#ranking-list');
    state.view.playerNameInput = document.querySelector('#player-name');
    state.view.saveAndRestartButton = document.querySelector('#save-and-restart');
    state.view.menuButtonGameover = document.querySelector('#menu-button-gameover');
}

function updateDisplay() {
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.lives;
}

function clearAllIntervals() {
    if (state.actions.timerId) {
        clearInterval(state.actions.timerId);
        state.actions.timerId = null;
    }
    if (state.actions.countDownTimerId) {
        clearInterval(state.actions.countDownTimerId);
        state.actions.countDownTimerId = null;
    }
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        handleTimeOut();
    }
}

function handleTimeOut() {
    clearAllIntervals();
    state.values.isGameRunning = false;

    state.values.lives--;
    state.view.lives.textContent = state.values.lives;

    if (state.values.result > state.values.bestScore) {
        state.values.bestScore = state.values.result;
    }

    if (state.values.lives <= 0) {
        showGameOverScreen();
    } else {
        showTimeoutScreen();
    }
}

function showTimeoutScreen() {
    state.view.timeoutScore.textContent = state.values.result;
    state.view.timeoutLives.textContent = state.values.lives;
    state.view.timeoutScreen.classList.remove('hidden');
    state.view.continueButton.focus();
}

function hideTimeoutScreen() {
    state.view.timeoutScreen.classList.add('hidden');
}

function continueGame() {
    hideTimeoutScreen();
    resetRound();
}

function resetRound() {
    state.values.currentTime = GameConfig.INITIAL_TIME;
    state.values.result = 0;
    state.values.canClick = true;
    state.values.isGameRunning = true;

    updateDisplay();
    clearAllIntervals();

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, GameConfig.COUNTDOWN_INTERVAL);
}

function resetGame() {
    state.values.lives = GameConfig.INITIAL_LIVES;
    state.values.bestScore = 0;
    state.values.canClick = true;
    state.values.isGameRunning = true;

    updateDisplay();
    resetRound();
}

function showGameOverScreen() {
    state.view.finalScore.textContent = state.values.result;
    state.view.bestScore.textContent = state.values.bestScore;

    const ranking = getTopScores();
    renderRanking(ranking);

    state.view.playerNameInput.value = '';
    state.view.gameoverScreen.classList.remove('hidden');
    state.view.playerNameInput.focus();
}

function hideGameOverScreen() {
    state.view.gameoverScreen.classList.add('hidden');
}

function renderRanking(ranking) {
    state.view.rankingList.innerHTML = '';

    if (ranking.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma pontuação salva ainda.';
        li.style.color = '#666';
        state.view.rankingList.appendChild(li);
        return;
    }

    ranking.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.playerName}: ${score.score} pontos`;
        state.view.rankingList.appendChild(li);
    });
}

function saveScore(score) {
    const playerName = state.view.playerNameInput.value.trim();
    if (!playerName) {
        state.view.playerNameInput.focus();
        return false;
    }

    const sanitizedName = playerName.substring(0, 20);

    let scores = getTopScores();
    const existingScoreIndex = scores.findIndex(
        (item) => item.playerName === sanitizedName
    );

    if (existingScoreIndex !== -1) {
        if (score > scores[existingScoreIndex].score) {
            scores[existingScoreIndex].score = score;
            scores[existingScoreIndex].date = new Date().toISOString();
        }
    } else {
        scores.push({
            playerName: sanitizedName,
            score,
            date: new Date().toISOString(),
        });
    }

    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, GameConfig.MAX_TOP_SCORES);

    try {
        localStorage.setItem(GameConfig.STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
        console.warn('Erro ao salvar pontuação:', error);
    }

    return true;
}

function getTopScores() {
    try {
        return JSON.parse(localStorage.getItem(GameConfig.STORAGE_KEY)) || [];
    } catch (error) {
        console.warn('Erro ao ler pontuações:', error);
        return [];
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
        square.removeAttribute('aria-label');
    });

    const randomNumber = Math.floor(Math.random() * 9);
    const selectedSquare = state.view.squares[randomNumber];

    selectedSquare.classList.add('enemy');
    selectedSquare.setAttribute('aria-label', 'Quadrado com inimigo - clique agora!');
    state.values.hitPosition = selectedSquare.id;
    state.values.canClick = true;
}

function handleSquareClick(event) {
    if (!state.values.isGameRunning) return;

    const clickedSquare = event.currentTarget;

    if (clickedSquare.id === state.values.hitPosition && state.values.canClick) {
        state.values.canClick = false;
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;

        clickedSquare.classList.add('hit');
        setTimeout(() => clickedSquare.classList.remove('hit'), 200);

        playHitSound();
    }
}

function handleSquareKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSquareClick(event);
    }
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', handleSquareClick);
        square.addEventListener('keydown', handleSquareKeydown);
    });
}

function removeListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.removeEventListener('mousedown', handleSquareClick);
        square.removeEventListener('keydown', handleSquareKeydown);
    });
}

function showStartScreen() {
    state.view.startScreen.classList.remove('hidden');
    state.view.startButton.focus();
}

function hideStartScreen() {
    state.view.startScreen.classList.add('hidden');
}

function startGame() {
    hideStartScreen();
    hideGameOverScreen();
    hideTimeoutScreen();
    resetGame();
}

function goToMenu() {
    clearAllIntervals();
    state.values.isGameRunning = false;
    hideTimeoutScreen();
    hideGameOverScreen();
    showStartScreen();
}

function handleSaveAndRestart() {
    const saved = saveScore(state.values.result);
    if (saved) {
        hideGameOverScreen();
        resetGame();
    }
}

function initEventListeners() {
    state.view.startButton.addEventListener('click', startGame);
    state.view.startButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            startGame();
        }
    });

    state.view.continueButton.addEventListener('click', continueGame);
    state.view.continueButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            continueGame();
        }
    });

    state.view.menuButtonTimeout.addEventListener('click', goToMenu);
    state.view.menuButtonTimeout.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            goToMenu();
        }
    });

    state.view.saveAndRestartButton.addEventListener('click', handleSaveAndRestart);
    state.view.saveAndRestartButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSaveAndRestart();
        }
    });

    state.view.menuButtonGameover.addEventListener('click', goToMenu);
    state.view.menuButtonGameover.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            goToMenu();
        }
    });

    state.view.playerNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSaveAndRestart();
        }
    });

    window.addEventListener('beforeunload', clearAllIntervals);
}

function initialize() {
    cacheDOMElements();
    initAudio();
    addListenerHitBox();
    initEventListeners();
    showStartScreen();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
