/**
 * WordDisplay Component
 * Displays the masked word with boxes for each letter
 */

import React from 'react';
import './WordDisplay.css';

const WordDisplay = ({ maskedWord, category, hint, difficulty }) => {
  // Split masked word into individual characters for display
  const characters = maskedWord.split('');

  return (
    <div className="word-display">
      <div className="word-info">
        <div className="category-badge">
          {category.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')}
        </div>
        {difficulty && (
          <div className={`difficulty-badge ${difficulty.toLowerCase()}`}>
            {difficulty}
          </div>
        )}
      </div>

      {hint && (
        <div className="hint">
          <strong>Hint:</strong> {hint}
        </div>
      )}

      <div className="word-boxes">
        {characters.map((char, index) => (
          <div
            key={index}
            className={`letter-box ${char === ' ' ? 'space' : ''} ${char !== '_' && char !== ' ' ? 'revealed' : ''}`}
          >
            {char === '_' ? '' : char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;

