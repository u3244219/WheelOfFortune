/**
 * Database Service
 * Manages in-memory word database (SQL-free implementation)
 */

import { dealNextWord } from './wordDeck';

class DatabaseService {
  constructor() {
    this.words = [];
    this.initialized = false;
    this.initPromise = null;
    this.nextId = 1;
  }

  /**
   * Initialize database by loading and parsing SQL files
   */
  async initialize() {
    // Return existing initialization promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return immediately if already initialized
    if (this.initialized && this.words.length > 0) {
      return this.words;
    }

    // Create new initialization promise
    this.initPromise = (async () => {
      try {
        console.log('Loading word database...');

        // Load and parse the SQL data file
        // Use process.env.PUBLIC_URL for GitHub Pages compatibility
        const basePath = process.env.PUBLIC_URL || '';
        const dataResponse = await fetch(`${basePath}/V2__Insert_sample_data_SQLite.sql`);
        const dataSQL = await dataResponse.text();

        // Parse INSERT statements using regex
        const insertPattern = /INSERT INTO words \(category, word, hint, difficulty\) VALUES\s+([\s\S]*?);/gi;
        // Values may contain escaped quotes ('') - match those too, otherwise
        // every word with an apostrophe in its hint is silently dropped.
        const valuePattern = /\('((?:[^']|'')+)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*'([A-Z]+)'\)/g;

        let match;
        while ((match = insertPattern.exec(dataSQL)) !== null) {
          const valuesSection = match[1];
          let valueMatch;

          while ((valueMatch = valuePattern.exec(valuesSection)) !== null) {
            this.words.push({
              id: this.nextId++,
              category: valueMatch[1],
              word: valueMatch[2].replace(/''/g, "'"), // Handle escaped quotes
              hint: valueMatch[3].replace(/''/g, "'"),
              difficulty: valueMatch[4]
            });
          }
        }

        this.initialized = true;
        console.log(`Database loaded with ${this.words.length} words`);

        // Log unique categories found
        const categories = [...new Set(this.words.map(w => w.category))];
        console.log(`Categories found: ${categories.length}`, categories);

        return this.words;
      } catch (error) {
        console.error('Failed to initialize database:', error);
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Get all categories
   * @returns {Array<string>} Array of unique categories
   */
  async getCategories() {
    if (!this.initialized) {
      await this.initialize();
    }

    const categories = [...new Set(this.words.map(word => word.category))];
    return categories.sort();
  }

  /**
   * Get random word by category
   * @param {string} category - Category name
   * @param {Array<number>} excludeIds - Array of word IDs to exclude
   * @returns {Object} Word object with id, word, hint, difficulty, category
   */
  async getRandomWord(category, excludeIds = []) {
    if (!this.initialized) {
      await this.initialize();
    }

    const inCategory = this.words.filter(word => word.category === category);

    if (inCategory.length === 0) {
      throw new Error('No words found for category: ' + category);
    }

    // Prefer words not yet played this session; if the session has seen them
    // all, fall back to the full category so the deck can still deal.
    const unplayed = inCategory.filter(word => !excludeIds.includes(word.id));
    return dealNextWord(category, unplayed.length ? unplayed : inCategory);
  }

  /**
   * Get word by ID
   * @param {number} wordId - Word ID
   * @returns {Object} Word object
   */
  async getWordById(wordId) {
    if (!this.initialized) {
      await this.initialize();
    }

    const word = this.words.find(w => w.id === wordId);

    if (!word) {
      throw new Error('Word not found: ' + wordId);
    }

    return word;
  }
}

// Export singleton instance
const databaseService = new DatabaseService();
export default databaseService;

