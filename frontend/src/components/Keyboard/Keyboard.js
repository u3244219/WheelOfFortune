/**
 * Keyboard Component
 * Virtual keyboard for letter selection with Scrabble point values
 * Now with TV arrow key navigation
 */

import React, { useState, useEffect } from 'react';
import { useDevice } from '../../contexts/DeviceContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import FocusableButton from '../FocusableButton/FocusableButton';
import SoundEffects from '../../utils/soundManager';
import './Keyboard.css';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

const Keyboard = ({ onLetterClick, guessedLetters, incorrectLetters, disabled }) => {
  const { isTV, isMobile } = useDevice();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [activeKey, setActiveKey] = useState(null); // Track currently pressed key

  const alphabet = GAME_CONSTANTS.ALPHABET;
  const columns = 13; // First row has 13 letters

  const isLetterGuessed = (letter) => guessedLetters.includes(letter);
  const isLetterIncorrect = (letter) => incorrectLetters.includes(letter);

  // TV keyboard navigation
  useKeyboardNavigation({
    onUp: () => {
      if (isTV) {
        setFocusedIndex(prev => {
          if (prev >= columns) return prev - columns;
          return prev;
        });
      }
    },
    onDown: () => {
      if (isTV) {
        setFocusedIndex(prev => {
          if (prev < columns) return Math.min(alphabet.length - 1, prev + columns);
          return prev;
        });
      }
    },
    onLeft: () => {
      if (isTV) {
        setFocusedIndex(prev => Math.max(0, prev - 1));
      }
    },
    onRight: () => {
      if (isTV) {
        setFocusedIndex(prev => Math.min(alphabet.length - 1, prev + 1));
      }
    },
    onEnter: () => {
      if (isTV) {
        const letter = alphabet[focusedIndex];
        if (!isLetterGuessed(letter) && !disabled) {
          onLetterClick(letter);
        }
      }
    }
  }, isTV && !disabled);

  // Physical keyboard detection for all devices
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();

      // Check if it's a letter A-Z
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        event.preventDefault(); // Prevent default browser behavior

        // Check if letter is already guessed
        if (!isLetterGuessed(key)) {
          console.log('Physical keyboard pressed:', key);

          // Visual feedback - highlight the key
          setActiveKey(key);

          // 🔊 Play button click sound
          SoundEffects.buttonClick();

          // Trigger the letter click
          onLetterClick(key);

          // Remove highlight after 300ms
          setTimeout(() => {
            setActiveKey(null);
          }, 300);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, guessedLetters, onLetterClick]); // isLetterGuessed uses guessedLetters, so that's covered

  const renderKey = (letter, index) => {
    const guessed = isLetterGuessed(letter);
    const incorrect = isLetterIncorrect(letter);
    const isDisabled = disabled || guessed;
    const isActive = activeKey === letter; // Highlight if physically pressed

    // Letters are all worth the same now - the wheel decides the value - so
    // the old Scrabble score badge would only mislead.
    const keyContent = <span className="key-letter">{letter}</span>;

    if (isTV) {
      return (
        <FocusableButton
          key={letter}
          className={`key ${guessed ? 'guessed' : ''} ${incorrect ? 'incorrect' : ''} ${isActive ? 'active-press' : ''}`}
          isFocused={focusedIndex === index}
          onSelect={() => onLetterClick(letter)}
          disabled={isDisabled}
        >
          {keyContent}
        </FocusableButton>
      );
    }

    return (
      <button
        key={letter}
        className={`key ${guessed ? 'guessed' : ''} ${incorrect ? 'incorrect' : ''} ${isActive ? 'active-press' : ''}`}
        onClick={() => onLetterClick(letter)}
        disabled={isDisabled}
      >
        {keyContent}
      </button>
    );
  };

  return (
    <div className={`keyboard ${isTV ? 'tv-keyboard' : ''} ${isMobile ? 'mobile-keyboard' : ''}`}>
      {isMobile ? (
        // Mobile: Flat grid of all letters
        alphabet.map((letter, index) => renderKey(letter, index))
      ) : (
        // Desktop/TV: 2-row layout
        <>
          <div className="keyboard-row">
            {alphabet.slice(0, 13).map((letter, index) => renderKey(letter, index))}
          </div>
          <div className="keyboard-row">
            {alphabet.slice(13).map((letter, index) => renderKey(letter, index + 13))}
          </div>
        </>
      )}
    </div>
  );
};

export default Keyboard;
