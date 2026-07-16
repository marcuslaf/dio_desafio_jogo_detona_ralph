<p align="center">
  <img src="src/images/player.png" alt="Player Icon" width="100">
</p>

<h1 align="center">🎮 Detona Ralph</h1>

<p align="center">
  <strong>Jogo de reação e velocidade inspirado em Wreck-It Ralph</strong>
</p>

<p align="center">
  <a href="https://marcuslaf.github.io/dio_desafio_jogo_detona_ralph/">🎮 Jogar Online</a> •
  <a href="https://github.com/marcuslaf/dio_desafio_jogo_detona_ralph">📦 GitHub</a> •
  <a href="#funcionalidades">✨ Features</a> •
  <a href="#tecnologias">🛠️ Tech Stack</a>
</p>

---

## 📸 Preview

<p align="center">
  <img src="src/images/ralph.png" alt="Ralph" width="80">
</p>

---

## 🎯 Sobre o Projeto

Jogo desenvolvido com **HTML, CSS e JavaScript puro** como projeto desafio da DIO. O objetivo é acumular pontos clicando nos inimigos que aparecem no painel, enquanto administra o tempo e as vidas disponíveis.

### 🏆 Funcionalidades

| Feature | Descrição |
|---------|-----------|
| ⏱️ **Sistema de Tempo** | 60 segundos por rodada |
| ❤️ **3 Vidas** | Perde vida quando o tempo acaba |
| 🏅 **Ranking Local** | TOP 5 salvo no localStorage |
| 🎨 **Animações** | Efeitos visuais e feedback ao clicar |
| 📱 **Responsivo** | Funciona em mobile e desktop |
| ♿ **Acessível** | Navegação por teclado e ARIA labels |
| 🎭 **3 Telas** | Inicial, Tempo Esgotado e Game Over |

---

## 🎮 Como Jogar

```
┌─────────────────────────────────────────┐
│  1. Clique em "JOGAR" para iniciar      │
│  2. Clique nos inimigos (quares vermelhos) │
│  3. Cada acerto = 1 ponto              │
│  4. Tempo esgota = perde 1 vida        │
│  5. 3 vidas = Game Over                │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Grid, Custom Properties, Animations |
| **JavaScript** | ES6+, localStorage API |

---

## 📁 Estrutura

```
dio_desafio_jogo_detona_ralph/
├── index.html              # Página principal
├── package.json            # Metadados do projeto
├── README.md               # Esta documentação
├── .gitignore              # Arquivos ignorados
└── src/
    ├── scripts/
    │   └── engine.js       # Lógica do jogo (400+ linhas)
    ├── styles/
    │   ├── reset.css       # CSS Reset moderno
    │   └── main.css        # Estilos do jogo
    ├── images/
    │   ├── player.png      # Ícone do jogador
    │   ├── ralph.png       # Sprite do inimigo
    │   └── wall.png        # Background
    └── audios/
        └── hit.m4a         # Efeito sonoro
```

---

## 🚀 Quick Start

### Opção 1: Online (Recomendado)
Acesse diretamente: **[🎮 Jogar Agora](https://marcuslaf.github.io/dio_desafio_jogo_detona_ralph/)**

### Opção 2: Local
```bash
# Clone
git clone https://github.com/marcuslaf/dio_desafio_jogo_detona_ralph.git

# Acesse
cd dio_desafio_jogo_detona_ralph

# Execute (opcional - pode abrir index.html direto)
npx serve .
```

---

## 📊 Badges

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🔧 Melhorias Implementadas

### Performance
- ✅ Cache de áudio para evitar múltiplas instâncias
- ✅ Limpeza adequada de intervals (memory leak prevention)
- ✅ DOM caching para melhor performance

### Acessibilidade
- ✅ Roles ARIA em todos os elementos interativos
- ✅ Navegação completa por teclado (Tab + Enter/Space)
- ✅ Labels descritivos para leitores de tela
- ✅ Suporte a `prefers-reduced-motion`

### UX
- ✅ Tela inicial com instruções
- ✅ Tela de tempo esgotado com opção de continuar
- ✅ Tela de game over com ranking e input de nome
- ✅ Animações de feedback (pulse, shake, bounce)

### Código
- ✅ `GameConfig` com constantes (sem valores mágicos)
- ✅ `Object.freeze` para configurações imutáveis
- ✅ Tratamento de erros em operações I/O
- ✅ Funções puras e responsáveis

---

## 📝 Changelog

### v2.0.0 (2026)
- ✨ Adicionada tela de tempo esotado
- ✨ Adicionada tela de game over com ranking
- ✨ Sistema de vidas com continuar
- 🐛 Corrigido bestScore resetando entre jogos
- 🎨 Novas animações e efeitos visuais

### v1.0.0
- 🎮 Versão inicial do jogo

---

## 👨‍💻 Autor

**Marcus Laf**
- GitHub: [@marcuslaf](https://github.com/marcuslaf)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ durante o Bootcamp DIO
</p>
