# Detona Ralph | Wreck-It Ralph

## Sobre o Projeto | About the Project

### PT-BR
Este é um jogo inspirado no personagem Detona Ralph, desenvolvido com HTML, CSS e JavaScript puro. O objetivo é acumular pontos clicando nos inimigos que aparecem no painel, enquanto administra o tempo e as vidas disponíveis.

### EN
This is a game inspired by the character Wreck-It Ralph, built with vanilla HTML, CSS, and JavaScript. The goal is to score points by clicking on enemies that appear on the panel, while managing time and available lives.

---

## Funcionalidades | Features

### PT-BR
- Sistema de pontuação com ranking salvo localmente
- 3 vidas com tempo de 60 segundos cada
- Tela inicial com instruções
- Animações e efeitos visuais
- Design responsivo para dispositivos móveis
- Acessibilidade (ARIA labels, navegação por teclado)
- Suporte a `prefers-reduced-motion`

### EN
- Scoring system with locally saved ranking
- 3 lives with 60 seconds each
- Start screen with instructions
- Animations and visual effects
- Responsive design for mobile devices
- Accessibility (ARIA labels, keyboard navigation)
- `prefers-reduced-motion` support

---

## Tecnologias Usadas | Technologies Used

- HTML5 (Semantic HTML)
- CSS3 (Grid, Custom Properties, Animations)
- JavaScript (ES6+, localStorage API)

---

## Como Jogar | How to Play

### PT-BR
1. Clique no botão "JOGAR" para iniciar
2. Clique nos inimigos (quares vermelhos) o mais rápido possível
3. Cada acerto gera 1 ponto
4. Você tem 60 segundos por vida e 3 vidas no total
5. Tente conseguir a maior pontuação!

### EN
1. Click the "JOGAR" (PLAY) button to start
2. Click on enemies (red squares) as fast as possible
3. Each hit generates 1 point
4. You have 60 seconds per life and 3 lives total
5. Try to get the highest score!

---

## Estrutura do Projeto | Project Structure

```
.
├── index.html           # Arquivo principal | Main file
├── .gitignore           # Arquivos ignorados | Ignored files
├── src/
│   ├── styles/
│   │   ├── reset.css    # CSS Reset moderno | Modern CSS Reset
│   │   └── main.css     # Estilos do jogo | Game styles
│   ├── scripts/
│   │   └── engine.js    # Lógica do jogo | Game logic
│   ├── images/
│   │   ├── player.png   # Ícone do jogador | Player icon
│   │   ├── ralph.png    # Inimigo | Enemy
│   │   ├── wall.png     # Fundo | Background
│   │   └── favicon.jpg  # Favicon
│   └── audios/
│       └── hit.m4a      # Som de acerto | Hit sound
```

---

## Como Executar | How to Run

### PT-BR
1. Clone este repositório:
   ```bash
   git clone https://github.com/marcuslaf/dio_desafio_jogo_detona_ralph.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd dio_desafio_jogo_detona_ralph
   ```
3. Abra o arquivo `index.html` em seu navegador.

### EN
1. Clone this repository:
   ```bash
   git clone https://github.com/marcuslaf/dio_desafio_jogo_detona_ralph.git
   ```
2. Navigate to the project directory:
   ```bash
   cd dio_desafio_jogo_detona_ralph
   ```
3. Open the `index.html` file in your browser.

---

## Melhorias Implementadas | Implemented Improvements

### Performance
- Cache de áudio para evitar múltiplas instâncias
- `requestAnimationFrame` para animações suaves
- Limpeza adequada de intervals para evitar memory leaks

### Acessibilidade
- Roles ARIA em todos os elementos interativos
- Navegação completa por teclado (Tab + Enter/Space)
- Labels descritivos para leitores de tela
- Contraste de cores WCAG compliant

### UX
- Tela inicial com instruções claras
- Animação de feedback ao clicar
- Efeito visual nos inimigos
- Mensagens de erro tratadas graciosamente

### Código
- Constantes para valores mágicos
- Funções puras e responsáveis
- Tratamento de erros em operações I/O
- `Object.freeze` para configurações imutáveis

---

## Contribuição | Contribution

### PT-BR
Contribuições são bem-vindas! Se você encontrar um problema ou tiver uma sugestão, sinta-se à vontade para abrir uma issue ou enviar um pull request.

### EN
Contributions are welcome! If you find an issue or have a suggestion, feel free to open an issue or submit a pull request.

---

## Licença | License

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
