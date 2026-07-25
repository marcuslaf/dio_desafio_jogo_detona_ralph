# Detona Ralph | Wreck-It Ralph Reaction Game

<p align="center">
  <img src="src/images/player.png" alt="Player Icon" width="100">
</p>

## 🇧🇷 Português

Jogo de reação e velocidade inspirado em **Wreck-It Ralph**, desenvolvido com **HTML, CSS e JavaScript puro**. Acumule pontos clicando nos inimigos que aparecem no painel, administrando tempo e vidas.

## 🇺🇸 English

Reaction and speed game inspired by **Wreck-It Ralph**, built with **vanilla HTML, CSS, and JavaScript**. Score points by clicking enemies that appear on the panel while managing time and lives.

---

**🔗 Jogar Online / Play Online** → [marcuslaf.github.io/dio_desafio_jogo_detona_ralph](https://marcuslaf.github.io/dio_desafio_jogo_detona_ralph/)

---

## ✨ Features | Funcionalidades

| Feature | Descrição | Description |
|---------|-----------|-------------|
| ⏱️ **Timer** | 60 segundos por rodada | 60 seconds per round |
| ❤️ **3 Vidas** | Perde vida quando o tempo acaba | Lose a life when time runs out |
| 🏆 **Ranking TOP 5** | Salvos no localStorage | Top 5 saved in localStorage |
| 🖥️ **3 Telas** | Inicial, Tempo Esgotado, Game Over | Start, Time Out, Game Over screens |
| 🎬 **Animações** | Efeitos visuais e feedback ao clicar | Visual effects and click feedback |
| ♿ **Acessível** | Navegação por teclado e ARIA labels | Keyboard navigation and ARIA labels |
| 📱 **Responsivo** | Mobile e desktop | Mobile and desktop |

---

## 🎮 How to Play | Como Jogar

`
┌───────────────────────────────────────┐
│  1. Clique em "JOGAR" para iniciar    │
│  2. Clique nos inimigos (quadrados)    │
│  3. Cada acerto = 1 ponto             │
│  4. Tempo esgota = perde 1 vida       │
│  5. 3 vidas = Game Over               │
└───────────────────────────────────────┘
`

---

## 🛠️ Tech Stack | Pilha Tecnológica

| Tecnologia / Technology | Uso / Purpose |
|-------------------------|---------------|
| **HTML5** | Estrutura semântica / Semantic structure |
| **CSS3** | Grid, Custom Properties, Animations |
| **JavaScript** | ES6+, localStorage API |

---

## 📁 Structure | Estrutura

`
dio_desafio_jogo_detona_ralph/
├── index.html              # Main page
├── package.json            # Project metadata
├── README.md               # Documentation
├── .gitignore
└── src/
    ├── scripts/
    │   └── engine.js       # Game logic (400+ lines)
    ├── styles/
    │   ├── reset.css       # Modern CSS reset
    │   └── main.css        # Game styles
    ├── images/
    │   ├── player.png      # Player icon
    │   ├── ralph.png       # Enemy sprite
    │   └── wall.png        # Background
    └── audios/
        └── hit.m4a         # Sound effect
`

---

## 🚀 Quick Start

### Online (Recomendado / Recommended)
**[Jogar Agora / Play Now](https://marcuslaf.github.io/dio_desafio_jogo_detona_ralph/)**

### Local
`ash
git clone https://github.com/marcuslaf/dio_desafio_jogo_detona_ralph.git
cd dio_desafio_jogo_detona_ralph
# Abra index.html no navegador ou / Open index.html or:
npx serve .
`

---

## 🧠 Improvements | Melhorias Implementadas

### Performance
- Áudio cache (evita múltiplas instâncias) / Audio cache (avoids multiple instances)
- Limpeza adequada de intervals / Proper interval cleanup
- DOM caching para performance / DOM caching

### Acessibilidade / Accessibility
- ARIA roles em elementos interativos / ARIA roles on interactive elements
- Navegação completa por teclado (Tab + Enter/Space)
- Labels descritivos para leitores de tela / Descriptive screen reader labels
- Suporte prefers-reduced-motion

### UX
- Tela inicial com instruções / Start screen with instructions
- Tela de tempo esgotado / Time out screen
- Tela de game over com ranking / Game over screen with ranking
- Animações de feedback / Feedback animations

### Código / Code
- GameConfig com constantes (sem valores mágicos)
- Object.freeze para configurações imutáveis
- Tratamento de erros em operações I/O
- Funções puras e responsabilidades únicas / Pure functions, single responsibilities

---

## 📋 Changelog

### v2.0.0 (2026)
- Tela de tempo esgotado / Time out screen
- Tela de game over com ranking / Game over with ranking
- Sistema de vidas com continuar / Life system with continue
- Correção bestScore entre jogos / Fixed bestScore across games
- Novas animações / New animations

### v1.0.0
- Versão inicial / Initial release

---

## 📬 Contact | Contato

**Marcus Lafaiete** — [GitHub](https://github.com/marcuslaf)

## License

MIT
