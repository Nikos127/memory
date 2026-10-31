import './styles/main.scss';
import codeThemeImage from './assets/images/code-theme.png';
import foodThemeImage from './assets/images/foods-theme.png';
import blueLabel from './assets/images/code-vibes-cards/label-blue.png';
import orangeLabel from './assets/images/code-vibes-cards/label-orange.png';

const playButton = document.querySelector<HTMLButtonElement>('#play-button');
const startScreen = document.querySelector<HTMLElement>('#start-screen');
const settingsScreen = document.querySelector<HTMLElement>('#settings-screen');

if (playButton && startScreen && settingsScreen) {
  playButton.addEventListener('click', () => {
    startScreen.hidden = true;
    settingsScreen.hidden = false;
  });
}

const themePreview = document.querySelector<HTMLImageElement>('#theme-preview');
const themeInputs = document.querySelectorAll<HTMLInputElement>(
  'input[name = "theme"]',
);

if (themePreview) {
  themeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.value === 'food') {
        themePreview.src = foodThemeImage;
        themePreview.alt = 'Vorschau des Food-Themes';
      } else {
        themePreview.src = codeThemeImage;
        themePreview.alt = 'Vorschau des Code-vibes-Themes';
      }
    });
  });
}

const settingsForm = document.querySelector<HTMLFormElement>('#settings-form');
const summaryTheme = document.querySelector<HTMLElement>('#summary-theme');
const summaryPlayer = document.querySelector<HTMLElement>('#summary-player');
const summarySize = document.querySelector<HTMLElement>('#summary-size');

if (settingsForm && summaryTheme && summaryPlayer && summarySize) {
  settingsForm.addEventListener('change', () => {
    const settings = new FormData(settingsForm);

    if (settings.get('theme') === 'food') {
      summaryTheme.textContent = 'Foods';
    } else {
      summaryTheme.textContent = 'Code vibes';
    }

    if (settings.get('player') === 'orange') {
      summaryPlayer.textContent = 'Orange';
    } else {
      summaryPlayer.textContent = 'Blue';
    }

    summarySize.textContent = `${settings.get('board-size')} cards`;
  });
}

const gameScreen = document.querySelector<HTMLElement>('#game-screen');
const currentPlayer =
  document.querySelector<HTMLImageElement>('#current-player');
let activePlayer: 'blue' | 'orange' = 'blue';
const scores = {
  blue: 0,
  orange: 0,
};
if (settingsForm && settingsScreen && gameScreen && currentPlayer) {
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    ((scores.blue = 0), (scores.orange = 0), updateScores());

    const settings = new FormData(settingsForm);
    activePlayer = settings.get('player') === 'orange' ? 'orange' : 'blue';
    const cardCount = Number(settings.get('board-size'));
    const theme = settings.get('theme') === 'food' ? 'food' : 'code';
    renderBoard(cardCount, theme);

    if (settings.get('player') === 'orange') {
      currentPlayer.src = orangeLabel;
      currentPlayer.alt = 'Orange';
    } else {
      currentPlayer.src = blueLabel;
      currentPlayer.alt = 'Blue';
    }

    settingsScreen.hidden = true;
    gameScreen.hidden = false;
  });
}

function renderBoard(cardCount: number, theme: 'code' | 'food') {
  const gameBoard = document.querySelector<HTMLElement>('#game-board');

  if (!gameBoard) {
    return;
  }

  gameBoard.replaceChildren();
  gameBoard.dataset.size = String(cardCount);
  gameBoard.dataset.theme = theme;

  const motifs: number[] = [];

  for (let motif = 1; motif <= cardCount / 2; motif++) {
    motifs.push(motif, motif);
  }

  shuffleCards(motifs);

  let firstCard: HTMLButtonElement | null = null;
  let isChecking = false;

  for (let index = 0; index < cardCount; index++) {
    const card = document.createElement('button');
    const motifId = motifs[index];

    const motifUrl =
      theme === 'food'
        ? new URL(
            `./assets/images/foods-cards/foods-card (${motifId}).png`,
            import.meta.url,
          ).href
        : new URL(
            `./assets/images/code-vibes-cards/code-vibes-card (${motifId}).png`,
            import.meta.url,
          ).href;

    card.dataset.motif = String(motifId);
    card.type = 'button';
    card.className = 'game-screen__card';
    card.setAttribute('aria-label', `Karte ${index + 1} aufdecken`);

    card.innerHTML = `
    <span class="game-screen__card-inner" aria-hidden="true">
      <span class="game-screen__card-face game-screen__card-face--covered"></span>
      <span class="game-screen__card-face game-screen__card-face--revealed"></span>
    </span> 
    `;

    const revealedFace = card.querySelector<HTMLElement>(
      '.game-screen__card-face--revealed',
    );

    if (revealedFace) {
      revealedFace.style.backgroundImage = `url("${motifUrl}")`;
    }

    card.addEventListener('click', () => {
      if (isChecking || card.classList.contains('is-flipped')) {
        return;
      }

      card.classList.add('is-flipped');
      card.setAttribute('aria-label', `Karte ${index + 1}, Motiv ${motifId}`);

      if (!firstCard) {
        firstCard = card;
        return;
      }

      const previousCard = firstCard;
      firstCard = null;

      if (previousCard.dataset.motif === card.dataset.motif) {
        previousCard.disabled = true;
        card.disabled = true;

        scores[activePlayer]++;
        updateScores();

        previousCard.classList.add('is-matched');
        card.classList.add('is-matched');
        isChecking = true;

        window.setTimeout(() => {
          previousCard.classList.remove('is-matched');
          card.classList.remove('is-matched');
          isChecking = false;
          if (card.isConnected && gameScreen && !gameScreen.hidden) {
            checkGameEnd(cardCount);
          }
        }, 1000);
        return;
      }

      isChecking = true;

      window.setTimeout(() => {
        previousCard.classList.remove('is-flipped');
        card.classList.remove('is-flipped');

        previousCard.setAttribute('aria-label', 'verdeckte Karte aufdecken');
        card.setAttribute('aria-label', 'Verdeckte Karte aufdecken');

        switchPlayer();
        isChecking = false;
      }, 1000);
    });
    gameBoard.append(card);
  }
}

const exitGameButton =
  document.querySelector<HTMLButtonElement>('#exit-game-button');

if (exitGameButton && gameScreen && settingsScreen) {
  exitGameButton.addEventListener('click', () => {
    gameScreen.hidden = true;
    settingsScreen.hidden = false;
  });
}

function shuffleCards(cards: number[]) {
  for (let index = cards.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    const savedCard = cards[index];
    cards[index] = cards[randomIndex];
    cards[randomIndex] = savedCard;
  }
}

function switchPlayer() {
  activePlayer = activePlayer === 'blue' ? 'orange' : 'blue';

  if (!currentPlayer) {
    return;
  }

  if (activePlayer === 'orange') {
    currentPlayer.src = orangeLabel;
    currentPlayer.alt = 'Orange';
  } else {
    currentPlayer.src = blueLabel;
    currentPlayer.alt = 'Blue';
  }
}

function updateScores() {
  const blueScore = document.querySelector<HTMLElement>('#score-blue');
  const orangeScore = document.querySelector<HTMLElement>('#score-orange');

  if (blueScore && orangeScore) {
    blueScore.textContent = String(scores.blue);
    orangeScore.textContent = String(scores.orange);
  }
}

function checkGameEnd(cardCount: number) {
  const foundPairs = scores.blue + scores.orange;
  if (foundPairs < cardCount / 2) {
    return;
  }

  const gameOverScreen =
    document.querySelector<HTMLElement>('#game-over-screen');
  const finalScoreBlue =
    document.querySelector<HTMLElement>('#final-score-blue');
  const finalScoreOrange = document.querySelector<HTMLElement>(
    '#final-score-orange',
  );

  if (!gameScreen || !gameOverScreen || !finalScoreBlue || !finalScoreOrange) {
    return;
  }

  finalScoreBlue.textContent = String(scores.blue);
  finalScoreOrange.textContent = String(scores.orange);

  gameScreen.hidden = true;
  gameOverScreen.hidden = false;
  window.setTimeout(showResult, 2000);
}

function showResult() {
  const gameOverScreen =
    document.querySelector<HTMLElement>('#game-over-screen');
  const resultScreen = document.querySelector<HTMLElement>('#result-screen');
  const resultIntro = document.querySelector<HTMLElement>('#result-intro');
  const resultTitle = document.querySelector<HTMLElement>('#result-title');

  if (!gameOverScreen || !resultScreen || !resultIntro || !resultTitle) {
    return;
  }

  if (scores.blue > scores.orange) {
    resultScreen.dataset.result = 'blue';
    resultIntro.textContent = 'The winner is';
    resultTitle.textContent = 'BLUE PLAYER';
  } else if (scores.orange > scores.blue) {
    resultScreen.dataset.result = 'orange';
    resultIntro.textContent = 'The winner is';
    resultTitle.textContent = 'ORANGE PLAYER';
  } else {
    resultScreen.dataset.result = 'draw';
    resultIntro.textContent = "It's a";
    resultTitle.textContent = 'DRAW';
  }
  gameOverScreen.hidden = true;
  resultScreen.hidden = false;
  createConfetti();
}

const backToStartButton = document.querySelector<HTMLElement>(
  '#back-to-start-button',
);

backToStartButton?.addEventListener('click', () => {
  const resultScreen = document.querySelector<HTMLElement>('#result-screen');

  if (!resultScreen || !startScreen) {
    return;
  }

  resultScreen.hidden = true;
  startScreen.hidden = false;
});

function createConfetti() {
  const container = document.querySelector<HTMLElement>('#result-confetti');
  if (!container) {
    return;
  }

  container.replaceChildren();

  const count = Math.ceil(window.innerWidth / 90);

  for (let index = 0; index < count; index++) {
    const piece = document.createElement('span');
    const size = 90 + Math.random() * 60;
    const rotation = Math.random() * 360;
    const position = ((index + Math.random()) / count) * 100;

    piece.style.width = `${size}px`;
    piece.style.left = `${position}%`;
    piece.style.top = `${-25 + Math.random() * 75}px`;
    piece.style.transform = `translateX(-50%) rotate(${rotation}deg)`;

    container.append(piece);
  }
}
