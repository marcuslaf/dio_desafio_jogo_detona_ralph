import { GameConfig, state, setDifficulty } from './state.js';
import { getTopScores, getBestScore } from './storage.js';

export function cacheDOMElements() {
    state.view.squares = document.querySelectorAll('.square');
    state.view.timeLeft = document.querySelector('#time-left');
    state.view.score = document.querySelector('#score');
    state.view.lives = document.querySelector('#lives');
    state.view.comboDisplay = document.querySelector('#combo-display');
    state.view.container = document.querySelector('.container');

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

    state.view.difficultyButtons = document.querySelectorAll('.difficulty-btn');

    state.originalLabels = [];
    state.view.squares.forEach((square) => {
        state.originalLabels.push(square.getAttribute('aria-label'));
    });
}

export function updateDisplay() {
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.lives;
    updateComboDisplay();
}

export function updateComboDisplay() {
    const display = state.view.comboDisplay;
    if (!display) return;

    if (state.values.combo >= GameConfig.COMBO_MULTIPLIER_THRESHOLD) {
        display.textContent = `COMBO x${state.values.combo}`;
        display.classList.add('active');
        display.classList.toggle('flames', state.values.combo >= 5);
    } else {
        display.textContent = '';
        display.classList.remove('active', 'flames');
    }
}

export function clearEnemyFromSquares() {
    state.view.squares.forEach((square, index) => {
        square.classList.remove('enemy', 'hit');
        removeParticles(square);
        square.setAttribute('aria-label', state.originalLabels[index] || `Quadrado ${index + 1}`);
    });
    state.values.hitPositions = [];
    state.values.clickedThisRound = new Set();
}

export function showScreen(screenId) {
    const el = state.view[screenId];
    if (el) el.classList.remove('hidden');
}

export function hideScreen(screenId) {
    const el = state.view[screenId];
    if (el) el.classList.add('hidden');
}

export function showStartScreen() {
    clearEnemyFromSquares();
    state.view.startScreen.classList.remove('hidden');
    state.view.startButton.focus();
}

export function hideStartScreen() {
    state.view.startScreen.classList.add('hidden');
}

export function showTimeoutScreen() {
    state.view.timeoutScore.textContent = state.values.roundScore;
    state.view.timeoutLives.textContent = state.values.lives;
    clearEnemyFromSquares();
    state.view.timeoutScreen.classList.remove('hidden');
    state.view.continueButton.focus();
}

export function hideTimeoutScreen() {
    state.view.timeoutScreen.classList.add('hidden');
}

export function showGameOverScreen() {
    const ranking = getTopScores();
    state.values.bestScore = getBestScore();

    state.view.finalScore.textContent = state.values.result;
    state.view.bestScore.textContent = state.values.bestScore;
    renderRanking(ranking);

    clearEnemyFromSquares();
    state.view.playerNameInput.value = '';
    state.view.gameoverScreen.classList.remove('hidden');
    state.view.playerNameInput.focus();
}

export function hideGameOverScreen() {
    state.view.gameoverScreen.classList.add('hidden');
}

export function showPauseScreen() {
    if (!state.values.isGameRunning || state.values.isPaused) return;

    state.values.isPaused = true;
    clearAllIntervals();
    clearEnemyFromSquares();
    state.view.pauseScreen.classList.remove('hidden');
    state.view.resumeButton.focus();
}

export function hidePauseScreen() {
    state.view.pauseScreen.classList.add('hidden');
}

function renderRanking(ranking) {
    const list = state.view.rankingList;
    list.innerHTML = '';

    if (ranking.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma pontuação salva ainda.';
        li.style.color = '#666';
        list.appendChild(li);
        return;
    }

    ranking.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.playerName}: ${score.score} pts`;
        list.appendChild(li);
    });
}

export function damageFlash() {
    const container = state.view.container;
    if (!container) return;
    container.classList.remove('damage');
    void container.offsetWidth;
    container.classList.add('damage');
}

export function spawnParticles(square) {
    removeParticles(square);
    const colors = ['#ffd700', '#ff6b00', '#ff4444', '#44ff44', '#1aeaa5', '#ffffff'];

    for (let i = 0; i < GameConfig.PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (Math.PI * 2 * i) / GameConfig.PARTICLE_COUNT;
        const distance = 30 + Math.random() * 20;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.width = `${4 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.background = colors[i % colors.length];
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.marginLeft = '-2px';
        particle.style.marginTop = '-2px';
        square.appendChild(particle);
    }

    setTimeout(() => removeParticles(square), GameConfig.PARTICLE_DURATION);
}

function removeParticles(square) {
    square.querySelectorAll('.particle').forEach(p => p.remove());
}

export function setupDifficultySelection() {
    const buttons = state.view.difficultyButtons;
    if (!buttons) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => selectDifficulty(btn));
        btn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                selectDifficulty(btn);
            }
        });
    });
}

function selectDifficulty(selectedBtn) {
    const buttons = state.view.difficultyButtons;
    const level = selectedBtn.dataset.difficulty;

    buttons.forEach((btn) => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('tabindex', '-1');
    });

    selectedBtn.classList.add('selected');
    selectedBtn.setAttribute('aria-checked', 'true');
    selectedBtn.setAttribute('tabindex', '0');
    selectedBtn.focus();

    setDifficulty(level);
}

export function clearAllIntervals() {
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
