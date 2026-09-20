/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  ENDPOINTS: {
    CATEGORIES: '/api/words/categories',
    RANDOM_WORD: '/api/words/random',
    GUESS: '/api/words/guess',
    LETTER_POINTS: '/api/words/letter-points',
  },
  TIMEOUT: 10000,
};

export default API_CONFIG;
