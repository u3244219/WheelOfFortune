/**
 * Word Deck
 *
 * Instead of picking at random every round (which repeats favourites long
 * before it exhausts a category), each category is shuffled once into a deck
 * and dealt from in order. The position is kept in localStorage, so you keep
 * your place across refreshes and across days - every word in a category is
 * played before any of them comes round again.
 */

const STORAGE_PREFIX = 'wof.deck.';

const readStore = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null; // private mode, blocked storage - fall back to a fresh deck
  }
};

const writeStore = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    /* nothing we can do, the deck just will not survive a refresh */
  }
};

/** Fisher-Yates */
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/**
 * Deal the next word for a category.
 *
 * @param {string} category
 * @param {Array<Object>} words   every word in that category
 * @returns {Object} the word to play
 */
export const dealNextWord = (category, words) => {
  if (!words.length) {
    throw new Error('No words found for category: ' + category);
  }

  const key = STORAGE_PREFIX + category;
  // The signature invalidates a saved deck whenever the word bank changes.
  const signature = `${words.length}:${words[0].word}:${words[words.length - 1].word}`;
  let deck = readStore(key);

  if (!deck || deck.signature !== signature || !Array.isArray(deck.order)) {
    deck = { signature, order: shuffle(words.map((w) => w.word)), position: 0, lastWord: null };
  }

  if (deck.position >= deck.order.length) {
    // Deck exhausted - reshuffle, but never let the new deck open with the
    // word that just closed the old one.
    const lastWord = deck.order[deck.order.length - 1];
    let order = shuffle(deck.order);
    if (order.length > 1 && order[0] === lastWord) {
      [order[0], order[1]] = [order[1], order[0]];
    }
    deck = { signature, order, position: 0, lastWord };
  }

  const byWord = new Map(words.map((w) => [w.word, w]));
  let chosen = null;
  while (deck.position < deck.order.length && !chosen) {
    chosen = byWord.get(deck.order[deck.position]) || null;
    deck.position += 1;
  }

  // Deck held only stale entries: rebuild and take the first card.
  if (!chosen) {
    deck = { signature, order: shuffle(words.map((w) => w.word)), position: 1, lastWord: null };
    chosen = byWord.get(deck.order[0]);
  }

  deck.lastWord = chosen.word;
  writeStore(key, deck);
  return chosen;
};

/** How far through a category you are - handy for a progress line in the UI. */
export const deckProgress = (category, total) => {
  const deck = readStore(STORAGE_PREFIX + category);
  if (!deck || !Array.isArray(deck.order)) return { played: 0, total };
  return { played: Math.min(deck.position, deck.order.length), total: deck.order.length || total };
};

/** Start a category over from a fresh shuffle. */
export const resetDeck = (category) => {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + category);
  } catch (err) {
    /* ignore */
  }
};

export default { dealNextWord, deckProgress, resetDeck };
