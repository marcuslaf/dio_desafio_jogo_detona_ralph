import { GameConfig } from './state.js';

export function getTopScores() {
    try {
        const raw = localStorage.getItem(GameConfig.STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter(item => (
                item &&
                typeof item.playerName === 'string' &&
                typeof item.score === 'number'
            ))
            .sort((a, b) => b.score - a.score)
            .slice(0, GameConfig.MAX_TOP_SCORES);
    } catch (error) {
        console.warn('Erro ao ler pontuações:', error);
        return [];
    }
}

export function getBestScore() {
    const scores = getTopScores();
    return scores.length > 0 ? scores[0].score : 0;
}

export function saveScore(playerName, score) {
    const sanitizedName = playerName.trim().substring(0, 20);
    if (!sanitizedName) return false;

    let scores = getTopScores();
    const existing = scores.findIndex(s => s.playerName === sanitizedName);

    if (existing !== -1) {
        if (score > scores[existing].score) {
            scores[existing].score = score;
            scores[existing].date = new Date().toISOString();
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
        return true;
    } catch (error) {
        console.warn('Erro ao salvar pontuação:', error);
        return false;
    }
}
