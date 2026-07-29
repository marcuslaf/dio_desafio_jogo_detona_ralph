export const GameConfig = Object.freeze({
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
    COMBO_MAX_MULTIPLIER: 10,
    ENEMY_COUNT_EASY: 1,
    ENEMY_COUNT_MEDIUM: 2,
    ENEMY_COUNT_HARD: 3,
    SCORE_THRESHOLD_MEDIUM: 15,
    SCORE_THRESHOLD_HARD: 30,
    PAUSE_KEY: 'Escape',
    TOTAL_SQUARES: 9,
    PARTICLE_COUNT: 8,
    PARTICLE_DURATION: 350,
    DAMAGE_FLASH_DURATION: 300,
});

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
    const v = state.values;
    v.gameVelocity = GameConfig.INITIAL_VELOCITY;
    v.hitPositions = [];
    v.currentTime = GameConfig.INITIAL_TIME;
    v.canClick = true;
    v.combo = 0;
    v.lastHitTime = 0;
    v.clickedThisRound = new Set();
}

export function resetRoundValues() {
    const v = state.values;
    v.currentTime = GameConfig.INITIAL_TIME;
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
