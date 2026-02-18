/**
 * API Service Layer
 * Now uses local SQLite database instead of backend HTTP calls
 */

import gameService from './game.service';

const ApiService = {
  /**
   * Initialize the database
   * @returns {Promise<void>}
   */
  initialize: async () => {
    await gameService.initialize();
  },

  /**
   * Get all available categories
   * @returns {Promise<string[]>} Array of category names
   */
  getCategories: async () => {
    console.log('API Request: GET /api/words/categories');
    const data = await gameService.getCategories();
    console.log('API Response: 200 /api/words/categories');
    return data;
  },

  /**
   * Get a random word by category
   * @param {string} category - Category name
   * @param {Array<number>} excludeWordIds - Array of word IDs to exclude (already played words)
   * @returns {Promise<Object>} WordResponse object
   */
  getRandomWord: async (category, excludeWordIds = []) => {
    console.log('API Request: GET /api/words/random');
    const data = await gameService.getRandomWord(category, excludeWordIds);
    console.log('API Response: 200 /api/words/random');
    return data;
  },

  /**
   * Submit a letter guess
   * @param {Object} guessRequest - GuessRequest object {wordId, letter, currentMask}
   * @returns {Promise<Object>} GuessResponse object
   */
  submitGuess: async (guessRequest) => {
    console.log('API Request: POST /api/words/guess');
    const data = await gameService.submitGuess(guessRequest);
    console.log('API Response: 200 /api/words/guess');
    return data;
  },

  /**
   * Get Scrabble letter point values
   * @returns {Promise<Object>} Map of letters to point values
   */
  getLetterPoints: async () => {
    console.log('API Request: GET /api/words/letter-points');
    const data = gameService.getLetterPoints();
    console.log('API Response: 200 /api/words/letter-points');
    return data;
  },
};

export default ApiService;
