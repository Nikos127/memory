import { clearCardTimer } from './game-state';

/** Verbindet die Schaltflächen für Bildschirmwechsel und Abbruchdialog. */
export function initializeNavigation() {
  document.querySelector('#play-button')?.addEventListener('click', showSettings);
  document.querySelector('#exit-game-button')?.addEventListener('click', openExitDialog);
  document.querySelector('#back-to-game-button')?.addEventListener('click', closeExitDialog);
  document.querySelector('#confirm-exit-button')?.addEventListener('click', exitGame);
  document.querySelector('#back-to-start-button')?.addEventListener('click', backToStart);
}

/** Wechselt vom Startbildschirm zu den Einstellungen. */
function showSettings() {
  switchScreen('#start-screen', '#settings-screen');
}

/** Öffnet den Dialog zum Verlassen des Spiels. */
function openExitDialog() {
  document.querySelector<HTMLDialogElement>('#exit-dialog')?.showModal();
}

/** Schließt den Dialog zum Verlassen des Spiels. */
function closeExitDialog() {
  document.querySelector<HTMLDialogElement>('#exit-dialog')?.close();
}

/** Beendet die Kartenwartezeit und kehrt zu den Einstellungen zurück. */
function exitGame() {
  clearCardTimer();
  closeExitDialog();
  switchScreen('#game-screen', '#settings-screen');
}

/** Kehrt von der Ergebnisanzeige zum Startbildschirm zurück. */
function backToStart() {
  switchScreen('#result-screen', '#start-screen');
}

/** Blendet den bisherigen Bildschirm aus und den nächsten ein.
 * @param from CSS-Auswahl des bisherigen Bildschirms.
 * @param to CSS-Auswahl des nächsten Bildschirms.
 */
function switchScreen(from: string, to: string) {
  const previous = document.querySelector<HTMLElement>(from);
  const next = document.querySelector<HTMLElement>(to);
  if (!previous || !next) return;
  previous.hidden = true;
  next.hidden = false;
}
