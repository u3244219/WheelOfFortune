/**
 * Game Utility Functions
 * Helper functions for game logic
 */

/**
 * Format category name for display
 * @param {string} category - Category enum value
 * @returns {string} Formatted category name
 */
export const formatCategoryName = (category) => {
  if (!category) return '';
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Check if letter is already guessed
 * @param {string} letter - Letter to check
 * @param {string[]} guessedLetters - Array of guessed letters
 * @returns {boolean}
 */
export const isLetterGuessed = (letter, guessedLetters) => {
  return guessedLetters.includes(letter);
};

/**
 * Calculate remaining attempts
 * @param {string[]} incorrectLetters - Incorrect guesses
 * @param {number} maxAttempts - Maximum attempts allowed
 * @returns {number}
 */
export const calculateRemainingAttempts = (incorrectLetters, maxAttempts) => {
  return maxAttempts - incorrectLetters.length;
};

