/**
 * WordDisplay Component
 * Displays the masked word with boxes for each letter
 * Now with flip animation for revealed letters
 */

import React from 'react';
import { motion } from 'framer-motion';
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
        {characters.map((char, index) => {
          const isRevealed = char !== '_' && char !== ' ';
          const isSpace = char === ' ';

          return (
            <motion.div
              key={`${index}-${char}`}
              className={`letter-box ${isSpace ? 'space' : ''} ${isRevealed ? 'revealed' : ''}`}
              initial={false}
              animate={isRevealed ? {
                opacity: [0, 1],
                scale: [0.3, 1.15, 1],
                rotateY: [90, -5, 0]
              } : {
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1], // Custom easing for bounce effect
                times: [0, 0.6, 1]
              }}
            >
              {char === '_' ? '' : char}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WordDisplay;

