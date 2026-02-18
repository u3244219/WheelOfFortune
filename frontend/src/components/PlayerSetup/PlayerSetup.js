/**
 * PlayerSetup Component
 * Allows setting up players before starting the game
 */

import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState(['Player 1']);

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
    newNames[index] = name || `Player ${index + 1}`;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    if (playerNames.every(name => name.trim())) {
      onStartGame(playerNames);
    }
  };

  return (
    <div className="player-setup">
      <h2>🎮 Game Setup</h2>

      <div className="setup-section">
        <label htmlFor="num-players">Number of Players:</label>
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
        disabled={!playerNames.every(name => name.trim())}
      >
        Continue to Category Selection →
      </button>
    </div>
  );
};

export default PlayerSetup;

