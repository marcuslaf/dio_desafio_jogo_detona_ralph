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
    state.values.lives--;
    state.view.lives.textContent = state.values.lives;

    if (state.values.result > state.values.bestScore) {
        state.values.bestScore = state.values.result;
    }

    if (state.values.lives <= 0) {
        gameOver();
    } else {
        resetRound();
    }
}

function resetRound() {
    state.values.currentTime = GameConfig.INITIAL_TIME;
    state.values.result = 0;
    state.values.canClick = true;

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

function gameOver() {
    state.values.isGameRunning = false;
    clearAllIntervals();

    saveScore(state.values.bestScore);

    const ranking = getTopScores();
    let message = `Game Over!\nSeu melhor score: ${state.values.bestScore}\n\nTop 5 Jogadores:\n`;

    if (ranking.length === 0) {
        message += 'Nenhuma pontuação salva ainda.\n';
    } else {
        ranking.forEach((score, index) => {
            message += `${index + 1}. ${score.playerName}: ${score.score} pontos\n`;
        });
    }

    alert(message);

    if (confirm('Deseja jogar novamente?')) {
        resetGame();
    } else {
        showStartScreen();
    }
}

function showStartScreen() {
    state.view.startScreen.classList.remove('hidden');
    state.view.startButton.focus();
}

function hideStartScreen() {
    state.view.startScreen.classList.add('hidden');
}

function saveScore(score) {
    const playerName = prompt('Digite seu nome para salvar a pontuação:');
    if (!playerName || !playerName.trim()) return;

    const sanitizedName = playerName.trim().substring(0, 20);

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

function startGame() {
    hideStartScreen();
    resetGame();
}

function initEventListeners() {
    state.view.startButton.addEventListener('click', startGame);
    state.view.startButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            startGame();
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
