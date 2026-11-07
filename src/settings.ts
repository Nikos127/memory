import { renderBoard } from './board';
import { resetGame, updateCurrentPlayer } from './game-state';

/** Verbindet die Einstellungen mit Vorschau, Zusammenfassung und Spielstart. */
export function initializeSettings() {
  const form = document.querySelector<HTMLFormElement>('#settings-form');
  const inputs = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  for (const input of inputs) input.addEventListener('change', updateThemePreview);
  form?.addEventListener('change', updateSummary);
  form?.addEventListener('submit', startGame);
}

/** Aktualisiert das Vorschaubild nach einer Themenauswahl.
 * @param event Änderungsereignis des Themenfelds.
 */
function updateThemePreview(event: Event) {
  const input = event.currentTarget;
  const preview = document.querySelector<HTMLImageElement>('#theme-preview');
  if (!(input instanceof HTMLInputElement) || !preview) return;
  const food = input.value === 'food';
  const file = food ? 'foods-theme.png' : 'code-theme.png';
  preview.src = `${import.meta.env.BASE_URL}assets/images/${file}`;
  preview.alt = food ? 'Vorschau des Food-Themes' : 'Vorschau des Code-vibes-Themes';
}

/** Zeigt Thema, Startspieler und Kartenzahl in der Zusammenfassung an. */
function updateSummary() {
  const form = document.querySelector<HTMLFormElement>('#settings-form');
  const theme = document.querySelector<HTMLElement>('#summary-theme');
  const player = document.querySelector<HTMLElement>('#summary-player');
  const size = document.querySelector<HTMLElement>('#summary-size');
  if (!form || !theme || !player || !size) return;
  const settings = new FormData(form);
  theme.textContent = settings.get('theme') === 'food' ? 'Foods' : 'Code vibes';
  player.textContent = settings.get('player') === 'orange' ? 'Orange' : 'Blue';
  size.textContent = `${settings.get('board-size')} cards`;
}

/** Startet ein Spiel mit den gewählten Einstellungen.
 * @param event Absenden des Einstellungsformulars.
 */
function startGame(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget;
  const settings = document.querySelector<HTMLElement>('#settings-screen');
  const game = document.querySelector<HTMLElement>('#game-screen');
  const player = document.querySelector<HTMLImageElement>('#current-player');
  if (!(form instanceof HTMLFormElement) || !settings || !game || !player) return;
  prepareGame(new FormData(form), game);
  settings.hidden = true;
  game.hidden = false;
}

/** Übernimmt die Auswahl und bereitet Karten und Spieleranzeige vor.
 * @param settings Gewählte Formularwerte.
 * @param screen Spielelement, das das aktuelle Thema speichert.
 */
function prepareGame(settings: FormData, screen: HTMLElement) {
  resetGame(settings.get('player') === 'orange' ? 'orange' : 'blue');
  const theme = settings.get('theme') === 'food' ? 'food' : 'code';
  screen.dataset.theme = theme;
  renderBoard(Number(settings.get('board-size')), theme);
  updateCurrentPlayer();
}
