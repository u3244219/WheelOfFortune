/**
 * PlayerSetup Component
 * Allows setting up players before starting the game
 * Now with responsive TV/Mobile support
 */

import React, { useState } from 'react';
import { useDevice } from '../../contexts/DeviceContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import FocusableButton from '../FocusableButton/FocusableButton';
import './PlayerSetup.css';

const PlayerSetup = ({ onStartGame }) => {
  const { isTV } = useDevice();
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState(['Player 1']);
  const [focusedPlayerCount, setFocusedPlayerCount] = useState(0); // For TV navigation

  // TV keyboard navigation for player count selector
  useKeyboardNavigation({
    onLeft: () => {
      if (isTV && focusedPlayerCount > 0) {
        setFocusedPlayerCount(prev => prev - 1);
      }
    },
    onRight: () => {
      if (isTV && focusedPlayerCount < 5) {
        setFocusedPlayerCount(prev => prev + 1);
      }
    },
    onEnter: () => {
      if (isTV) {
        handleNumPlayersChange(focusedPlayerCount + 1);
      }
    }
  }, isTV); // Only enable when on TV

  const handleNumPlayersChange = (num) => {
    const count = parseInt(num);
    setNumPlayers(count);

    // Initialize player names array
    const names = [];
    for (let i = 0; i < count; i++) {
      names.push(playerNames[i] || `Player ${i + 1}`);
    }
    setPlayerNames(names);
  };

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name; // Allow empty string - don't auto-fill
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    // Validate that all names are filled in
    const validNames = playerNames.map((name, index) =>
      name.trim() ? name.trim() : `Player ${index + 1}`
    );

    // Check for duplicate names
    const uniqueNames = new Set(validNames.map(n => n.toLowerCase()));
    if (uniqueNames.size !== validNames.length) {
      alert('Please use unique names for each player!');
      return;
    }

    onStartGame(validNames);
  };

  return (
    <div className="player-setup">
      <h2>🎮 Game Setup</h2>

      <div className="setup-section">
        <label htmlFor="num-players">Number of Players:</label>

        {isTV ? (
          /* TV: Button Grid (no dropdowns on TV) */
          <div className="player-count-grid">
            {[1, 2, 3, 4, 5, 6].map((num, idx) => (
              <FocusableButton
                key={num}
                isFocused={focusedPlayerCount === idx}
                onSelect={() => handleNumPlayersChange(num)}
                className={numPlayers === num ? 'selected' : ''}
              >
                <div className="player-count-number">{num}</div>
                <div className="player-count-label">
                  Player{num > 1 ? 's' : ''}
                </div>
              </FocusableButton>
            ))}
          </div>
        ) : (
          /* Mobile/Desktop: Native Select */
          <select
            id="num-players"
            value={numPlayers}
            onChange={(e) => handleNumPlayersChange(e.target.value)}
            className="player-count-select"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        )}
      </div>

      <div className="players-list">
        <h3>Enter Player Names:</h3>
        {playerNames.map((name, index) => (
          <div key={index} className="player-input-group">
            <label htmlFor={`player-${index}`}>Player {index + 1}:</label>
            <input
              id={`player-${index}`}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
              maxLength={20}
              className="player-name-input"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        className="start-game-button"
      >
        Continue to Category Selection →
      </button>
    </div>
  );
};

export default PlayerSetup;

