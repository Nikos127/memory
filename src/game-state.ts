export type Theme = 'code' | 'food';
export type Player = 'blue' | 'orange';
export const state = {
  activePlayer: 'blue' as Player,
  scores: { blue: 0, orange: 0 },
  cardTimer: null as number | null,
};

/** Beendet die noch laufende Wartezeit zwischen zwei Karten. */
export function clearCardTimer() {
  if (state.cardTimer !== null) {
    window.clearTimeout(state.cardTimer);
    state.cardTimer = null;
  }
}

/** Setzt die Punkte zurück.
 * @param player Spieler, der anfangen darf.
 */
export function resetGame(player: Player) {
  clearCardTimer();
  state.activePlayer = player;
  state.scores.blue = 0;
  state.scores.orange = 0;
  updateScores();
}

/** Zeigt die Punkte beider Spieler an. */
export function updateScores() {
  const blue = document.querySelector<HTMLElement>('#score-blue');
  const orange = document.querySelector<HTMLElement>('#score-orange');
  if (blue && orange) {
    blue.textContent = String(state.scores.blue);
    orange.textContent = String(state.scores.orange);
  }
}

/** Gibt den Zug an den anderen Spieler weiter. */
export function switchPlayer() {
  state.activePlayer = state.activePlayer === 'blue' ? 'orange' : 'blue';
  updateCurrentPlayer();
}

/** Aktualisiert das Bild des aktiven Spielers. */
export function updateCurrentPlayer() {
  const image = document.querySelector<HTMLImageElement>('#current-player');
  const screen = document.querySelector<HTMLElement>('#game-screen');
  if (!image || !screen) return;
  const player = state.activePlayer;
  const path = screen.dataset.theme === 'food'
    ? `foods-cards/${player}-pawn.svg`
    : `code-vibes-cards/label-${player}.png`;
  image.src = `${import.meta.env.BASE_URL}assets/images/${path}`;
  image.alt = player === 'orange' ? 'Orange' : 'Blue';
}
