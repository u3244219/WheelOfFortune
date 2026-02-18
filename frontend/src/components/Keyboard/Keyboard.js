/**
 * Keyboard Component
 * Virtual keyboard for letter selection with Scrabble point values
 */

import React from 'react';
import './Keyboard.css';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

const Keyboard = ({ onLetterClick, guessedLetters, incorrectLetters, disabled, letterPoints }) => {
  const isLetterGuessed = (letter) => guessedLetters.includes(letter);
  const isLetterIncorrect = (letter) => incorrectLetters.includes(letter);
  const getLetterPoints = (letter) => letterPoints[letter] || 0;

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {GAME_CONSTANTS.ALPHABET.slice(0, 13).map((letter) => (
          <button
            key={letter}
            className={`key ${isLetterGuessed(letter) ? 'guessed' : ''} ${isLetterIncorrect(letter) ? 'incorrect' : ''}`}
            onClick={() => onLetterClick(letter)}
            disabled={disabled || isLetterGuessed(letter)}
          >
            <span className="key-letter">{letter}</span>
            <span className="key-points">{getLetterPoints(letter)}</span>
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {GAME_CONSTANTS.ALPHABET.slice(13).map((letter) => (
          <button
            key={letter}
            className={`key ${isLetterGuessed(letter) ? 'guessed' : ''} ${isLetterIncorrect(letter) ? 'incorrect' : ''}`}
            onClick={() => onLetterClick(letter)}
            disabled={disabled || isLetterGuessed(letter)}
          >
            <span className="key-letter">{letter}</span>
            <span className="key-points">{getLetterPoints(letter)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
