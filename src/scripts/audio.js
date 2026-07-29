import { GameConfig, state } from './state.js';

const AUDIO_FILES = {
    hit: './src/audios/hit-8bit.wav',
    combo: './src/audios/combo.wav',
    gameOver: './src/audios/game-over.wav',
    timeout: './src/audios/time-up.wav',
    buttonClick: './src/audios/ui-click.wav',
};

const VOLUME_MULTIPLIER = {
    hit: 1.0,
    combo: 1.2,
    gameOver: 0.8,
    timeout: 0.6,
    buttonClick: 0.7,
};

export function initAudio() {
    try {
        for (const [key, src] of Object.entries(AUDIO_FILES)) {
            const audio = new Audio(src);
            audio.volume = GameConfig.AUDIO_VOLUME * (VOLUME_MULTIPLIER[key] || 1.0);
            state.audio[key] = audio;
        }
    } catch (error) {
        console.warn('Erro ao carregar áudios:', error);
    }
}

export function playSound(type) {
    const audio = state.audio[type];
    if (!audio) return;

    try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    } catch (error) {
        console.warn('Erro ao reproduzir áudio:', error);
    }
}

export function setVolume(type, level) {
    const audio = state.audio[type];
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, level));
}
