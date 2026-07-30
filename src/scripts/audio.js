import { GameConfig, state } from './state.js';

/*
 * Sistema de áudio do jogo.
 * 
 * NOTA: Atualmente todos os sons usam o mesmo arquivo (hit.m4a) como fallback.
 * Para adicionar sons distintos, substitua os caminhos abaixo por arquivos de áudio reais:
 * 
 *   hit: './src/audios/hit-seu-arquivo.mp3'
 *   combo: './src/audios/combo-seu-arquivo.mp3'
 *   etc.
 * 
 * Formatos suportados: mp3, m4a, wav, ogg
 */

const AUDIO_FILES = {
    hit: './src/audios/hit.m4a',
    combo: './src/audios/hit.m4a',
    gameOver: './src/audios/hit.m4a',
    timeout: './src/audios/hit.m4a',
    buttonClick: './src/audios/hit.m4a',
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
