import { state } from './game-state';

/** Zeigt den Endstand an, sobald alle Paare gefunden sind.
 * @param cardCount Anzahl aller Karten im Spiel.
 */
export function checkGameEnd(cardCount: number) {
  if (state.scores.blue + state.scores.orange < cardCount / 2) return;
  const game = document.querySelector<HTMLElement>('#game-screen');
  const over = document.querySelector<HTMLElement>('#game-over-screen');
  const blue = document.querySelector<HTMLElement>('#final-score-blue');
  const orange = document.querySelector<HTMLElement>('#final-score-orange');
  if (!game || !over || !blue || !orange) return;
  blue.textContent = String(state.scores.blue);
  orange.textContent = String(state.scores.orange);
  over.dataset.theme = game.dataset.theme;
  game.hidden = true;
  over.hidden = false;
  window.setTimeout(showResult, 2000);
}

/** Wechselt vom Punktestand zur Ergebnisanzeige mit Konfetti. */
function showResult() {
  const over = document.querySelector<HTMLElement>('#game-over-screen');
  const result = document.querySelector<HTMLElement>('#result-screen');
  const intro = document.querySelector<HTMLElement>('#result-intro');
  const title = document.querySelector<HTMLElement>('#result-title');
  if (!over || !result || !intro || !title) return;
  updateResultText(result, intro, title);
  result.dataset.theme = over.dataset.theme;
  over.hidden = true;
  result.hidden = false;
  createConfetti();
}

/** Trägt den Gewinner oder Gleichstand in die Ergebnisanzeige ein.
 * @param result Bildschirm mit der Ergebnisfarbe.
 * @param intro Einleitung über dem Ergebnis.
 * @param title Überschrift mit dem Gewinner.
 */
function updateResultText(result: HTMLElement, intro: HTMLElement, title: HTMLElement) {
  const winner = getWinner();
  result.dataset.result = winner;
  intro.textContent = winner === 'draw' ? "It's a" : 'The winner is';
  title.textContent = winner === 'draw' ? 'DRAW' : `${winner.toUpperCase()} PLAYER`;
}

/** Ermittelt das Ergebnis anhand der Punkte.
 * @returns Gewinnerfarbe oder draw bei Gleichstand.
 */
function getWinner(): 'blue' | 'orange' | 'draw' {
  if (state.scores.blue > state.scores.orange) return 'blue';
  if (state.scores.orange > state.scores.blue) return 'orange';
  return 'draw';
}

/** Verteilt Konfetti passend zur Fensterbreite. */
function createConfetti() {
  const container = document.querySelector<HTMLElement>('#result-confetti');
  if (!container) return;
  container.replaceChildren();
  const count = Math.ceil(window.innerWidth / 90);
  for (let index = 0; index < count; index++) {
    container.append(createConfettiPiece(index, count));
  }
}

/** Erstellt ein zufällig gedrehtes Konfettistück.
 * @param index Position des Stücks in der Reihe.
 * @param count Gesamtanzahl der Stücke.
 * @returns Gestaltetes Konfettielement.
 */
function createConfettiPiece(index: number, count: number) {
  const piece = document.createElement('span');
  const size = 90 + Math.random() * 60;
  const rotation = Math.random() * 360;
  const position = ((index + Math.random()) / count) * 100;
  piece.style.width = `${size}px`;
  piece.style.left = `${position}%`;
  piece.style.top = `${-25 + Math.random() * 75}px`;
  piece.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
  return piece;
}
