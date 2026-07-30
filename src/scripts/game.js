import { GameConfig, state, resetValues, resetRoundValues, isGameActive, getDifficultyPreset } from './state.js';
import { initAudio, playSound } from './audio.js';
import { getTopScores, saveScore } from './storage.js';
import {
    cacheDOMElements, updateDisplay, updateComboDisplay,
    clearEnemyFromSquares, clearAllIntervals,
    showStartScreen, hideStartScreen,
    showTimeoutScreen, hideTimeoutScreen,
    showGameOverScreen, hideGameOverScreen,
    showPauseScreen, hidePauseScreen,
    damageFlash, spawnParticles,
    setupDifficultySelection,
} from './ui.js';

/* ─── Dificuldade ─── */

function calculateEnemyCount() {
    // Sempre apenas 1 Ralph por vez — essência do jogo é encontrar o único inimigo
    return GameConfig.ENEMY_COUNT;
}

function updateDifficulty() {
    const preset = getDifficultyPreset();
    const level = Math.floor(state.values.result / 5);
    const newVelocity = Math.max(
        preset.minVelocity,
        preset.initialVelocity - (level * preset.velocityDecrease)
    );

    if (newVelocity !== state.values.gameVelocity) {
        state.values.gameVelocity = newVelocity;
        restartGameLoop();
    }
}

function restartGameLoop() {
    if (state.actions.timerId) {
        clearInterval(state.actions.timerId);
    }
    state.actions.timerId = setInterval(randomSquares, state.values.gameVelocity);
}

/* ─── Inimigos ─── */

function randomSquares() {
    if (state.values.isPaused) return;

    clearEnemyFromSquares();

    const enemyCount = calculateEnemyCount();
    const available = Array.from({ length: GameConfig.TOTAL_SQUARES }, (_, i) => i);

    for (let i = 0; i < enemyCount; i++) {
        if (available.length === 0) break;

        const randomIndex = Math.floor(Math.random() * available.length);
        const squareIndex = available.splice(randomIndex, 1)[0];
        const square = state.view.squares[squareIndex];

        square.classList.add('enemy');
        square.setAttribute('aria-label', 'Quadrado com inimigo - clique agora!');
        state.values.hitPositions.push(square.id);
    }

    state.values.canClick = true;
}

/* ─── Temporizador ─── */

function countDown() {
    if (state.values.isPaused) return;

    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        handleTimeOut();
    }
}

/* ─── Combo ─── */

function handleCombo() {
    const now = Date.now();

    if (now - state.values.lastHitTime < GameConfig.COMBO_TIMEOUT) {
        state.values.combo++;

        if (state.values.combo >= GameConfig.COMBO_MULTIPLIER_THRESHOLD) {
            playSound('combo');
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
    if (state.values.combo >= GameConfig.COMBO_MULTIPLIER_THRESHOLD) {
        return Math.min(state.values.combo, GameConfig.COMBO_MAX_MULTIPLIER);
    }
    return 1;
}

/* ─── Clique nos quadrados ─── */

function handleSquareClick(event) {
    if (!isGameActive()) return;

    const square = event.currentTarget;

    if (!state.values.hitPositions.includes(square.id)) return;
    if (state.values.clickedThisRound.has(square.id)) return;

    state.values.clickedThisRound.add(square.id);

    handleCombo();

    const points = calculatePoints();
    state.values.result += points;
    state.values.roundScore += points;
    state.values.enemiesKilled++;

    state.view.score.textContent = state.values.result;

    const hitIndex = state.values.hitPositions.indexOf(square.id);
    if (hitIndex !== -1) {
        state.values.hitPositions.splice(hitIndex, 1);
    }

    square.classList.remove('enemy');
    square.classList.add('hit');

    spawnParticles(square);
    playSound('hit');
    triggerVibration(30);

    setTimeout(() => {
        square.classList.remove('hit');
    }, 250);

    updateDifficulty();

    if (state.values.hitPositions.length === 0) {
        state.values.canClick = true;
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

function triggerVibration(duration = 30) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

/* ─── Game Over / Timeout ─── */

function handleTimeOut() {
    clearAllIntervals();
    state.values.isGameRunning = false;
    state.values.lives--;
    state.values.bestScore = Math.max(state.values.bestScore, state.values.result);

    playSound('timeout');

    if (state.values.lives <= 0) {
        playSound('gameOver');
        showGameOverScreen();
    } else {
        damageFlash();
        showTimeoutScreen();
    }
}

/* ─── Controles do jogo ─── */

function resetRound() {
    resetRoundValues();
    state.values.isGameRunning = true;
    state.values.isPaused = false;

    clearEnemyFromSquares();
    updateDisplay();
    clearAllIntervals();

    state.actions.timerId = setInterval(randomSquares, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, GameConfig.COUNTDOWN_INTERVAL);
}

function resetGame() {
    resetValues();
    state.values.result = 0;
    state.values.bestScore = Math.max(state.values.bestScore, 0);

    resetRound();
}

function startGame() {
    hideStartScreen();
    hideGameOverScreen();
    hideTimeoutScreen();
    hidePauseScreen();
    resetGame();
}

function continueGame() {
    hideTimeoutScreen();
    hidePauseScreen();
    resetRound();
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

function resumeGame() {
    if (!state.values.isPaused) return;

    state.values.isPaused = false;
    hidePauseScreen();

    state.actions.timerId = setInterval(randomSquares, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, GameConfig.COUNTDOWN_INTERVAL);
}

function handleSaveAndRestart() {
    if (!state.view.playerNameInput) return;
    const saved = saveScore(state.view.playerNameInput.value, state.values.result);
    if (saved) {
        hideGameOverScreen();
        resetGame();
    }
}

/* ─── Event Listeners ─── */

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

function handleGlobalKeydown(event) {
    if (event.key === GameConfig.PAUSE_KEY) {
        event.preventDefault();
        if (state.values.isPaused) {
            resumeGame();
        } else {
            showPauseScreen();
        }
        return;
    }

    if (event.code === 'KeyM' && !state.values.isGameRunning) {
        event.preventDefault();
        goToMenu();
    }
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', handleSquareClick);
        square.addEventListener('touchstart', handleSquareTouch, { passive: false });
        square.addEventListener('keydown', handleSquareKeydown);
    });
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

    if (state.view.playerNameInput) {
        state.view.playerNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSaveAndRestart();
            }
        });

        state.view.playerNameInput.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    window.addEventListener('keydown', handleGlobalKeydown);
    window.addEventListener('beforeunload', clearAllIntervals);
}

/* ─── Inicialização ─── */

export function initialize() {
    cacheDOMElements();
    initAudio();
    setupDifficultySelection();
    addListenerHitBox();
    initEventListeners();
    showStartScreen();
}


