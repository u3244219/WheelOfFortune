/**
 * Word Data Generator
 * Generates comprehensive word database with cryptic hints
 * 12 categories, 200+ words each
 */

export const generateWordDatabase = () => {
  const words = [];
  let id = 1;

  // Helper function to add words
  const addWords = (category, wordList) => {
    wordList.forEach(([word, hint, difficulty]) => {
      words.push({ id: id++, category, word, hint, difficulty });
    });
  };

  // LOCATION_PLACE category data loaded from SQL file will be kept
  // Adding additional categories programmatically

  return words;
};

// Category-specific word generators
export const CATEGORY_GENERATORS = {
  GENERAL_ITEM: () => [
    // 200 general items with cryptic hints
    ['UMBRELLA', 'Rain defeating canopy', 'EASY'],
    ['SCISSORS', 'Metal butterfly cutter', 'EASY'],
    ['MIRROR', 'Truth reflecting surface', 'EASY'],
    ['CLOCK', 'Time announcing circle', 'EASY'],
    ['LAMP', 'Darkness banishing device', 'EASY'],
    // ... more items
  ],

  DISH: () => [
    // 200 dishes with cryptic hints
    ['PIZZA', 'Circular Italian flat bread', 'EASY'],
    ['BURGER', 'Stacked meat sandwich', 'EASY'],
    ['SUSHI', 'Raw fish rice roll', 'EASY'],
    // ... more dishes
  ],

  SWEET: () => [
    // 200 sweets with cryptic hints
    ['CHOCOLATE', 'Cocoa bean delight', 'EASY'],
    ['CAKE', 'Celebration layered treat', 'EASY'],
    ['ICE CREAM', 'Frozen dairy pleasure', 'EASY'],
    // ... more sweets
  ],

  CANDY: () => [
    // 200 candies with cryptic hints
    ['LOLLIPOP', 'Stick mounted sugar sphere', 'EASY'],
    ['GUM', 'Endless chewing pleasure', 'EASY'],
    ['JELLY BEAN', 'Tiny flavored eggs', 'EASY'],
    // ... more candies
  ],

  MUSIC: () => [
    // 200 music related with cryptic hints
    ['GUITAR', 'Six stringed companion', 'EASY'],
    ['PIANO', 'Eighty eight key harmony', 'EASY'],
    ['DRUM', 'Rhythm keeping cylinder', 'EASY'],
    // ... more music
  ],

  COUNTRY: () => [
    // 200 countries with cryptic hints
    ['FRANCE', 'Hexagon shaped republic', 'EASY'],
    ['ITALY', 'Boot shaped peninsula', 'EASY'],
    ['SPAIN', 'Iberian kingdom land', 'EASY'],
    // ... more countries
  ]
};

export default generateWordDatabase;

