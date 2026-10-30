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

if (settingsForm && settingsScreen && gameScreen && currentPlayer) {
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const settings = new FormData(settingsForm);
    const cardCount = Number(settings.get('board-size'));
    renderBoard(cardCount);

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

function renderBoard(cardCount: number) {
  const gameBoard = document.querySelector<HTMLElement>('#game-board');

  if (!gameBoard) {
    return;
  }

  gameBoard.replaceChildren();
  gameBoard.dataset.size = String(cardCount);

  for (let index = 0; index < cardCount; index++) {
    const card = document.createElement('button');

    card.type = 'button';
    card.className = 'game-screen__card';
    card.setAttribute('aria-label', `Karte ${index + 1} aufdecken`);

    card.innerHTML = `
    <span class="game-screen__card-inner" aria-hidden="true">
      <span class="game-screen__card-face game-screen__card-face--covered"></span>
      <span class="game-screen__card-face game-screen__card-face--revealed"></span>
    </span> 
    `;

    card.addEventListener('click', () => {
      const isFlipped = card.classList.toggle('is-flipped');

      card.setAttribute(
        'aria-label',
        isFlipped
          ? `karte ${index + 1}, Git-Motiv, zudecken`
          : `Karte ${index + 1} aufdecken`,
      );
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
