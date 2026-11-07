import { createCard, createMotifs } from './cards';
import { state, switchPlayer, updateScores, type Theme } from './game-state';
import { checkGameEnd } from './results';

const CARD_REVEAL_DELAY_MS = 1000;

interface BoardState {
  firstCard: HTMLButtonElement | null;
  isChecking: boolean;
  cardCount: number;
}

/** Ersetzt das Spielfeld durch neue Karten.
 * @param cardCount Anzahl der Karten.
 * @param theme Gewähltes Kartenthema.
 */
export function renderBoard(cardCount: number, theme: Theme) {
  const board = document.querySelector<HTMLElement>('#game-board');
  if (!board) return;
  board.replaceChildren();
  board.dataset.size = String(cardCount);
  board.dataset.theme = theme;
  const round: BoardState = { firstCard: null, isChecking: false, cardCount };
  const motifs = createMotifs(cardCount);
  for (let index = 0; index < motifs.length; index++) {
    const card = createCard(motifs[index], index, theme);
    bindCard(card, index, round);
    board.append(card);
  }
}

/** Verbindet eine Karte mit der Klickbehandlung.
 * @param card Anklickbare Karte.
 * @param index Position für den Kartennamen.
 * @param round Zustand des Spielfelds.
 */
function bindCard(card: HTMLButtonElement, index: number, round: BoardState) {
  /** Deckt die angeklickte Karte auf, sofern der Zug erlaubt ist. */
  function onCardClick() {
    if (round.isChecking || card.classList.contains('is-flipped')) return;
    card.classList.add('is-flipped');
    card.setAttribute('aria-label', `Karte ${index + 1}, Motiv ${card.dataset.motif}`);
    selectCard(card, round);
  }
  card.addEventListener('click', onCardClick);
}

/** Merkt sich die erste Karte oder vergleicht das Paar.
 * @param card Gerade aufgedeckte Karte.
 * @param round Zustand des Spielfelds.
 */
function selectCard(card: HTMLButtonElement, round: BoardState) {
  if (!round.firstCard) {
    round.firstCard = card;
    return;
  }
  const previous = round.firstCard;
  round.firstCard = null;
  round.isChecking = true;
  const matched = previous.dataset.motif === card.dataset.motif;
  if (matched) markMatch(previous, card);
  schedulePair(previous, card, round, matched);
}

/** Markiert ein gefundenes Paar und erhöht die Punkte.
 * @param first Erste Karte des Paars.
 * @param second Zweite Karte des Paars.
 */
function markMatch(first: HTMLButtonElement, second: HTMLButtonElement) {
  first.disabled = true;
  second.disabled = true;
  first.classList.add('is-matched');
  second.classList.add('is-matched');
  state.scores[state.activePlayer]++;
  updateScores();
}

/** Lässt beide Karten eine Sekunde sichtbar.
 * @param first Erste Karte des Paars.
 * @param second Zweite Karte des Paars.
 * @param round Zustand des Spielfelds.
 * @param matched Ob beide Karten dasselbe Motiv zeigen.
 */
function schedulePair(first: HTMLButtonElement, second: HTMLButtonElement, round: BoardState, matched: boolean) {
  /** Schließt den Kartenvergleich nach der Wartezeit ab. */
  function finishPair() {
    state.cardTimer = null;
    if (matched) finishMatch(first, second, round.cardCount);
    else hidePair(first, second);
    round.isChecking = false;
  }
  state.cardTimer = window.setTimeout(finishPair, CARD_REVEAL_DELAY_MS);
}

/** Beendet die Trefferanimation und prüft das Spielende.
 * @param first Erste Karte des gefundenen Paars.
 * @param second Zweite Karte des gefundenen Paars.
 * @param count Anzahl aller Karten.
 */
function finishMatch(first: HTMLButtonElement, second: HTMLButtonElement, count: number) {
  first.classList.remove('is-matched');
  second.classList.remove('is-matched');
  const screen = document.querySelector<HTMLElement>('#game-screen');
  if (second.isConnected && screen && !screen.hidden) checkGameEnd(count);
}

/** Verdeckt ein ungleiches Paar und wechselt den Spieler.
 * @param first Erste Karte des ungleichen Paars.
 * @param second Zweite Karte des ungleichen Paars.
 */
function hidePair(first: HTMLButtonElement, second: HTMLButtonElement) {
  first.classList.remove('is-flipped');
  second.classList.remove('is-flipped');
  first.setAttribute('aria-label', 'Verdeckte Karte aufdecken');
  second.setAttribute('aria-label', 'Verdeckte Karte aufdecken');
  switchPlayer();
}
