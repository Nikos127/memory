import './styles/main.scss';
import codeThemeImage from './assets/images/code-theme.png';
import foodThemeImage from './assets/images/foods-theme.png';

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
