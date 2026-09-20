/**
 * Game Service
 * Handles game logic including letter guessing, scoring, and word management
 */

import databaseService from './database.service';

// Scrabble letter point values
const LETTER_POINTS = {
  'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4,
  'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3,
  'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8,
  'Y': 4, 'Z': 10
};

class GameService {
  constructor() {
    this.currentWordId = null;
    this.currentWord = '';
  }

  /**
   * Initialize the game service
   */
  async initialize() {
    await databaseService.initialize();
  }

  /**
   * Get all available categories
   * @returns {Promise<string[]>} Array of category names
   */
  async getCategories() {
    return await databaseService.getCategories();
  }

  /**
   * Get a random word by category
   * @param {string} category - Category name
   * @param {Array<number>} excludeWordIds - Array of word IDs to exclude
   * @returns {Promise<Object>} WordResponse object with masked word
   */
  async getRandomWord(category, excludeWordIds = []) {
    const wordData = await databaseService.getRandomWord(category, excludeWordIds);

    this.currentWordId = wordData.id;
    this.currentWord = wordData.word.toUpperCase();

    // Create masked word (show only spaces and special characters)
    const maskedWord = this.createMask(this.currentWord);

    return {
      wordId: wordData.id,
      category: wordData.category,
      maskedWord: maskedWord,
      hint: wordData.hint,
      difficulty: wordData.difficulty,
      wordLength: this.currentWord.replace(/\s/g, '').length, // Length without spaces
    };
  }

  /**
   * The word currently in play, in full. Used by the reveal card so the
   * players can see what the answer was, especially after a loss.
   * @returns {string}
   */
  getAnswer() {
    return this.currentWord || '';
  }

  /**
   * Create a masked version of the word
   * @param {string} word - The word to mask
   * @param {Array<string>} revealedLetters - Letters to reveal
   * @returns {string} Masked word
   */
  createMask(word, revealedLetters = []) {
    return word
      .split('')
      .map(char => {
        if (char === ' ') return ' '; // Keep spaces
        if (!/[A-Z]/.test(char)) return char; // Keep special characters
        if (revealedLetters.includes(char)) return char; // Reveal guessed letters
        return '_'; // Hide unguessed letters
      })
      .join('');
  }

  /**
   * Process a letter guess
   * @param {Object} guessRequest - {wordId, letter, currentMask}
   * @returns {Promise<Object>} GuessResponse object
   */
  async submitGuess(guessRequest) {
    const { wordId, letter, currentMask } = guessRequest;
    const upperLetter = letter.toUpperCase();

    // Verify word ID matches current word
    if (wordId !== this.currentWordId) {
      const wordData = await databaseService.getWordById(wordId);
      this.currentWordId = wordData.id;
      this.currentWord = wordData.word.toUpperCase();
    }

    // Check if letter exists in the word
    const correct = this.currentWord.includes(upperLetter);

    // Count occurrences
    const occurrences = correct
      ? this.currentWord.split('').filter(char => char === upperLetter).length
      : 0;

    // Get letter point value
    const letterValue = LETTER_POINTS[upperLetter] || 1;

    // Calculate points: just the letter value (no multipliers, no occurrence multipliers)
    const pointsEarned = correct ? letterValue : 0;

    // Get all revealed letters from current mask
    const revealedLetters = currentMask
      .split('')
      .filter(char => char !== '_' && char !== ' ' && /[A-Z]/.test(char));

    // Add the new letter if correct
    if (correct && !revealedLetters.includes(upperLetter)) {
      revealedLetters.push(upperLetter);
    }

    // Create updated mask
    const updatedMask = this.createMask(this.currentWord, revealedLetters);

    // Check if puzzle is solved
    const puzzleSolved = !updatedMask.includes('_');

    // Create message
    const message = correct
      ? `Correct! Found ${occurrences} occurrence(s) of '${upperLetter}' (+${pointsEarned} points)`
      : `Sorry, '${upperLetter}' is not in the word`;

    return {
      correct,
      updatedMask,
      occurrences,
      puzzleSolved,
      message,
      pointsEarned,
      letterValue,
    };
  }

  /**
   * Get letter point values
   * @returns {Object} Map of letters to point values
   */
  getLetterPoints() {
    return { ...LETTER_POINTS };
  }
}

// Export singleton instance
const gameService = new GameService();
export default gameService;

