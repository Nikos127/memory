import type { Theme } from './game-state';

/** Erstellt und mischt die Motivpaare.
 * @param count Anzahl aller Karten.
 * @returns Gemischte Motivnummern.
 */
export function createMotifs(count: number): number[] {
  const motifs: number[] = [];
  for (let motif = 1; motif <= count / 2; motif++) {
    motifs.push(motif, motif);
  }
  shuffleCards(motifs);
  return motifs;
}

/** Mischt die Karten direkt im übergebenen Array.
 * @param cards Motivnummern, deren Reihenfolge verändert wird.
 */
function shuffleCards(cards: number[]) {
  for (let index = cards.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const savedCard = cards[index];
    cards[index] = cards[randomIndex];
    cards[randomIndex] = savedCard;
  }
}

/** Baut eine verdeckte Karte mit ihrem Motiv.
 * @param motif Nummer des Kartenmotivs.
 * @param index Position der Karte, beginnend bei null.
 * @param theme Gewähltes Kartenthema.
 * @returns Fertiger Kartenbutton ohne Klickbehandlung.
 */
export function createCard(motif: number, index: number, theme: Theme) {
  const card = document.createElement('button');
  card.dataset.motif = String(motif);
  card.type = 'button';
  card.className = 'game-screen__card';
  card.setAttribute('aria-label', `Karte ${index + 1} aufdecken`);
  addCardFaces(card, motif, theme);
  return card;
}

/** Fügt Vorderseite, Rückseite und Motivbild ein.
 * @param card Kartenbutton, der die Seiten erhält.
 * @param motif Nummer des Motivbilds.
 * @param theme Gewähltes Kartenthema.
 */
function addCardFaces(card: HTMLButtonElement, motif: number, theme: Theme) {
  card.innerHTML = `<span class="game-screen__card-inner" aria-hidden="true">
    <span class="game-screen__card-face game-screen__card-face--covered"></span>
    <span class="game-screen__card-face game-screen__card-face--revealed"></span>
  </span>`;
  const face = card.querySelector<HTMLElement>('.game-screen__card-face--revealed');
  const path = theme === 'food'
    ? `foods-cards/foods-card (${motif}).png`
    : `code-vibes-cards/code-vibes-card (${motif}).png`;
  if (face) face.style.backgroundImage = `url("${import.meta.env.BASE_URL}assets/images/${path}")`;
}
