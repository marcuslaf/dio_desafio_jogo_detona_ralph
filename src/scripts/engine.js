const GameConfig = Object.freeze({
    INITIAL_TIME: 60,
    INITIAL_LIVES: 3,
    INITIAL_VELOCITY: 1000,
    MIN_VELOCITY: 400,
    VELOCITY_DECREASE: 50,
    VELOCITY_DECREASE_INTERVAL: 5,
    COUNTDOWN_INTERVAL: 1000,
    AUDIO_VOLUME: 0.2,
    MAX_TOP_SCORES: 5,
    STORAGE_KEY: 'gameScores',
    COMBO_TIMEOUT: 2000,
    COMBO_MULTIPLIER_THRESHOLD: 3,
    ENEMY_COUNT_EASY: 1,
    ENEMY_COUNT_MEDIUM: 2,
    ENEMY_COUNT_HARD: 3,
    SCORE_THRESHOLD_MEDIUM: 15,
    SCORE_THRESHOLD_HARD: 30,
    PAUSE_KEY: 'Escape',
});

const state = {
    view: {
        squares: null,
        timeLeft: null,
        score: null,
        lives: null,
        comboDisplay: null,
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
        pauseScreen: null,
        resumeButton: null,
        menuButtonPause: null,
        pauseButton: null,
    },
    values: {
        gameVelocity: GameConfig.INITIAL_VELOCITY,
        hitPositions: [],
        result: 0,
        currentTime: GameConfig.INITIAL_TIME,
        lives: GameConfig.INITIAL_LIVES,
        bestScore: 0,
        canClick: true,
        isGameRunning: false,
        isPaused: false,
        combo: 0,
        lastHitTime: 0,
        enemiesKilled: 0,
        roundScore: 0,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
        comboTimerId: null,
    },
    audio: {
        hit: null,
        gameOver: null,
        timeout: null,
        combo: null,
    },
    originalLabels: [],
};

function initAudio() {
    try {
        state.audio.hit = new Audio('./src/audios/hit.m4a');
        state.audio.hit.volume = GameConfig.AUDIO_VOLUME;

        state.audio.gameOver = new Audio('./src/audios/hit.m4a');
        state.audio.gameOver.volume = GameConfig.AUDIO_VOLUME * 0.8;

        state.audio.timeout = new Audio('./src/audios/hit.m4a');
        state.audio.timeout.volume = GameConfig.AUDIO_VOLUME * 0.6;

        state.audio.combo = new Audio('./src/audios/hit.m4a');
        state.audio.combo.volume = GameConfig.AUDIO_VOLUME * 1.2;
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

function playGameOverSound() {
    if (!state.audio.gameOver) return;
    try {
        state.audio.gameOver.currentTime = 0;
        state.audio.gameOver.play().catch(() => {});
    } catch (error) {
        console.warn('Erro ao reproduzir áudio:', error);
    }
}

function playTimeoutSound() {
    if (!state.audio.timeout) return;
    try {
        state.audio.timeout.currentTime = 0;
        state.audio.timeout.play().catch(() => {});
    } catch (error) {
        console.warn('Erro ao reproduzir áudio:', error);
    }
}

function playComboSound() {
    if (!state.audio.combo) return;
    try {
        state.audio.combo.currentTime = 0;
        state.audio.combo.play().catch(() => {});
    } catch (error) {
        console.warn('Erro ao reproduzir áudio:', error);
    }
}

function cacheDOMElements() {
    state.view.squares = document.querySelectorAll('.square');
    state.view.timeLeft = document.querySelector('#time-left');
    state.view.score = document.querySelector('#score');
    state.view.lives = document.querySelector('#lives');
    state.view.comboDisplay = document.querySelector('#combo-display');

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

    state.view.pauseScreen = document.querySelector('#pause-screen');
    state.view.resumeButton = document.querySelector('#resume-button');
    state.view.menuButtonPause = document.querySelector('#menu-button-pause');
    state.view.pauseButton = document.querySelector('#pause-button');

    state.view.squares.forEach((square) => {
        state.originalLabels.push(square.getAttribute('aria-label'));
    });
}

function updateDisplay() {
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.lives;
    updateComboDisplay();
}

function updateComboDisplay() {
    if (state.view.comboDisplay) {
        if (state.values.combo >= GameConfig.COMBO_MULTIPLIER_THRESHOLD) {
            state.view.comboDisplay.textContent = `COMBO x${state.values.combo}`;
            state.view.comboDisplay.classList.add('active');
        } else {
            state.view.comboDisplay.textContent = '';
            state.view.comboDisplay.classList.remove('active');
        }
    }
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
    if (state.actions.comboTimerId) {
        clearTimeout(state.actions.comboTimerId);
        state.actions.comboTimerId = null;
    }
}

function clearEnemyFromSquares() {
    state.view.squares.forEach((square, index) => {
        square.classList.remove('enemy');
        square.setAttribute('aria-label', state.originalLabels[index] || `Quadrado ${index + 1}`);
    });
    state.values.hitPositions = [];
}

function countDown() {
    if (state.values.isPaused) return;

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

    playTimeoutSound();

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
    state.view.timeoutScore.textContent = state.values.roundScore;
    state.view.timeoutLives.textContent = state.values.lives;
    clearEnemyFromSquares();
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

function calculateDifficulty() {
    if (state.values.result >= GameConfig.SCORE_THRESHOLD_HARD) {
        return GameConfig.ENEMY_COUNT_HARD;
    } else if (state.values.result >= GameConfig.SCORE_THRESHOLD_MEDIUM) {
        return GameConfig.ENEMY_COUNT_MEDIUM;
    }
    return GameConfig.ENEMY_COUNT_EASY;
}

function updateDifficulty() {
    const level = Math.floor(state.values.result / GameConfig.VELOCITY_DECREASE_INTERVAL);
    const newVelocity = Math.max(
        GameConfig.MIN_VELOCITY,
        GameConfig.INITIAL_VELOCITY - (level * GameConfig.VELOCITY_DECREASE)
    );

    if (newVelocity !== state.values.gameVelocity) {
        state.values.gameVelocity = newVelocity;

        if (state.actions.timerId) {
            clearInterval(state.actions.timerId);
            state.actions.timerId = setInterval(randomSquares, state.values.gameVelocity);
        }
    }
}

function resetRound() {
    state.values.currentTime = GameConfig.INITIAL_TIME;
    state.values.hitPositions = [];
    state.values.canClick = true;
    state.values.isGameRunning = true;
    state.values.isPaused = false;
    state.values.roundScore = 0;
    state.values.gameVelocity = GameConfig.INITIAL_VELOCITY;
    state.values.combo = 0;

    clearEnemyFromSquares();
    updateDisplay();
    clearAllIntervals();

    state.actions.timerId = setInterval(randomSquares, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, GameConfig.COUNTDOWN_INTERVAL);
}

function resetGame() {
    state.values.lives = GameConfig.INITIAL_LIVES;
    state.values.result = 0;
    state.values.canClick = true;
    state.values.enemiesKilled = 0;
    state.values.roundScore = 0;

    resetRound();
}

function showGameOverScreen() {
    state.view.finalScore.textContent = state.values.result;
    state.view.bestScore.textContent = state.values.bestScore;

    const ranking = getTopScores();
    renderRanking(ranking);

    clearEnemyFromSquares();
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

function randomSquares() {
    if (state.values.isPaused) return;

    clearEnemyFromSquares();

    const enemyCount = calculateDifficulty();
    const availableSquares = Array.from({ length: 9 }, (_, i) => i);

    for (let i = 0; i < enemyCount; i++) {
        if (availableSquares.length === 0) break;

        const randomIndex = Math.floor(Math.random() * availableSquares.length);
        const squareIndex = availableSquares.splice(randomIndex, 1)[0];
        const selectedSquare = state.view.squares[squareIndex];

        selectedSquare.classList.add('enemy');
        selectedSquare.setAttribute('aria-label', 'Quadrado com inimigo - clique agora!');
        state.values.hitPositions.push(selectedSquare.id);
    }

    state.values.canClick = true;
}

function handleCombo() {
    const now = Date.now();

    if (now - state.values.lastHitTime < GameConfig.COMBO_TIMEOUT) {
        state.values.combo++;

        if (state.values.combo >= GameConfig.COMBO_MULTIPLIER_THRESHOLD) {
            playComboSound();
        }
    } else {
        state.values.combo = 1;
    }

    state.values.lastHitTime = now;

    if (state.actions.comboTimerId) {
        clearTimeout(state.actions.comboTimerId);
    }

    state.actions.comboTimerId = setTimeout(() => {
        state.values.combo = 0;
        updateComboDisplay();
    }, GameConfig.COMBO_TIMEOUT);

    updateComboDisplay();
}

function calculatePoints() {
    let points = 1;

    if (state.values.combo >= GameConfig.COMBO_MULTIPLIER_THRESHOLD) {
        points = Math.min(state.values.combo, 10);
    }

    return points;
}

function handleSquareClick(event) {
    if (!state.values.isGameRunning || state.values.isPaused) return;

    const clickedSquare = event.currentTarget;

    if (state.values.hitPositions.includes(clickedSquare.id) && state.values.canClick) {
        state.values.canClick = false;

        handleCombo();

        const points = calculatePoints();
        state.values.result += points;
        state.values.roundScore += points;
        state.values.enemiesKilled++;

        state.view.score.textContent = state.values.result;

        const hitIndex = state.values.hitPositions.indexOf(clickedSquare.id);
        state.values.hitPositions.splice(hitIndex, 1);

        clickedSquare.classList.add('hit');
        setTimeout(() => clickedSquare.classList.remove('hit'), 200);

        playHitSound();
        updateDifficulty();

        if (state.values.hitPositions.length === 0) {
            state.values.canClick = true;
        }
    }
}

function handleSquareKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSquareClick(event);
    }
}

function handleSquareTouch(event) {
    event.preventDefault();
    handleSquareClick(event);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', handleSquareClick);
        square.addEventListener('touchstart', handleSquareTouch, { passive: false });
        square.addEventListener('keydown', handleSquareKeydown);
    });
}

function showStartScreen() {
    clearEnemyFromSquares();
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
    hidePauseScreen();
    resetGame();
}

function goToMenu() {
    clearAllIntervals();
    state.values.isGameRunning = false;
    state.values.isPaused = false;
    hideTimeoutScreen();
    hideGameOverScreen();
    hidePauseScreen();
    showStartScreen();
}

function handleSaveAndRestart() {
    const saved = saveScore(state.values.result);
    if (saved) {
        hideGameOverScreen();
        resetGame();
    }
}

function showPauseScreen() {
    if (!state.values.isGameRunning || state.values.isPaused) return;

    state.values.isPaused = true;
    clearEnemyFromSquares();
    state.view.pauseScreen.classList.remove('hidden');
    state.view.resumeButton.focus();
}

function hidePauseScreen() {
    state.view.pauseScreen.classList.add('hidden');
}

function resumeGame() {
    if (!state.values.isPaused) return;

    state.values.isPaused = false;
    hidePauseScreen();

    state.actions.timerId = setInterval(randomSquares, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, GameConfig.COUNTDOWN_INTERVAL);
}

function handlePauseKeydown(event) {
    if (event.key === GameConfig.PAUSE_KEY) {
        event.preventDefault();
        if (state.values.isPaused) {
            resumeGame();
        } else {
            showPauseScreen();
        }
    }
}

function initEventListeners() {
    state.view.startButton.addEventListener('click', startGame);
    state.view.continueButton.addEventListener('click', continueGame);
    state.view.menuButtonTimeout.addEventListener('click', goToMenu);
    state.view.saveAndRestartButton.addEventListener('click', handleSaveAndRestart);
    state.view.menuButtonGameover.addEventListener('click', goToMenu);
    state.view.resumeButton.addEventListener('click', resumeGame);
    state.view.menuButtonPause.addEventListener('click', goToMenu);

    if (state.view.pauseButton) {
        state.view.pauseButton.addEventListener('click', showPauseScreen);
    }

    state.view.playerNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSaveAndRestart();
        }
    });

    state.view.playerNameInput.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    window.addEventListener('keydown', handlePauseKeydown);
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
