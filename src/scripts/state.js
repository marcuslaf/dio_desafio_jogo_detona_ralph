export const DIFFICULTY_PRESETS = Object.freeze({
    easy: {
        label: 'Fácil',
        initialTime: 90,
        initialLives: 5,
        initialVelocity: 1200,
        minVelocity: 500,
        velocityDecrease: 30,
        description: 'Mais tempo e vidas, bem devagar',
    },
    medium: {
        label: 'Médio',
        initialTime: 60,
        initialLives: 3,
        initialVelocity: 1000,
        minVelocity: 400,
        velocityDecrease: 50,
        description: 'Equilibrado',
    },
    hard: {
        label: 'Difícil',
        initialTime: 45,
        initialLives: 2,
        initialVelocity: 700,
        minVelocity: 300,
        velocityDecrease: 70,
        description: 'Menos tempo, rápido desde o início',
    },
});

export const GameConfig = Object.freeze({
    DIFFICULTY_PRESETS,
    DEFAULT_DIFFICULTY: 'medium',
    COUNTDOWN_INTERVAL: 1000,
    AUDIO_VOLUME: 0.2,
    MAX_TOP_SCORES: 5,
    STORAGE_KEY: 'gameScores',
    COMBO_TIMEOUT: 2000,
    COMBO_MULTIPLIER_THRESHOLD: 3,
    COMBO_MAX_MULTIPLIER: 10,
    ENEMY_COUNT: 1,
    PAUSE_KEY: 'Escape',
    TOTAL_SQUARES: 9,
    PARTICLE_COUNT: 8,
    PARTICLE_DURATION: 350,
    DAMAGE_FLASH_DURATION: 300,
});

/* Dificuldade ativa — pode ser 'easy', 'medium' ou 'hard' */
let activeDifficulty = GameConfig.DEFAULT_DIFFICULTY;

export function getDifficulty() {
    return activeDifficulty;
}

export function setDifficulty(level) {
    if (DIFFICULTY_PRESETS[level]) {
        activeDifficulty = level;
    }
}

export function getDifficultyPreset() {
    return DIFFICULTY_PRESETS[activeDifficulty];
}

export const state = {
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
        container: null,
        difficultyButtons: null,
    },
    values: {
        gameVelocity: 1000,
        hitPositions: [],
        result: 0,
        currentTime: 60,
        lives: 3,
        bestScore: 0,
        canClick: true,
        isGameRunning: false,
        isPaused: false,
        combo: 0,
        lastHitTime: 0,
        enemiesKilled: 0,
        roundScore: 0,
        clickedThisRound: new Set(),
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
        buttonClick: null,
    },
    originalLabels: [],
};

export function resetValues() {
    const preset = getDifficultyPreset();
    const v = state.values;
    v.gameVelocity = preset.initialVelocity;
    v.hitPositions = [];
    v.currentTime = preset.initialTime;
    v.lives = preset.initialLives;
    v.canClick = true;
    v.combo = 0;
    v.lastHitTime = 0;
    v.clickedThisRound = new Set();
}

export function resetRoundValues() {
    const preset = getDifficultyPreset();
    const v = state.values;
    v.currentTime = preset.initialTime;
    v.hitPositions = [];
    v.canClick = true;
    v.roundScore = 0;
    v.combo = 0;
    v.lastHitTime = 0;
    v.clickedThisRound = new Set();
}

export function isGameActive() {
    return state.values.isGameRunning && !state.values.isPaused;
}
