/**
 * Scoreboard Component
 * Displays player scores and current turn
 */

import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ players, currentPlayerIndex }) => {
  // Sort players by score for ranking display
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="scoreboard">
      <h3>🏆 Scoreboard</h3>
      <div className="players-scores">
        {players.map((player, index) => (
          <div 
            key={index} 
            className={`player-score ${index === currentPlayerIndex ? 'current-turn' : ''}`}
          >
            <div className="player-info">
              <span className="player-name">
                {index === currentPlayerIndex && '▶ '}
                {player.name}
                {index === currentPlayerIndex && "'s Turn"}
              </span>
              <span className="player-score-value">{player.score} pts</span>
            </div>
            {index === currentPlayerIndex && (
              <div className="turn-indicator">Current Turn</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="leaderboard">
        <h4>Rankings</h4>
        {sortedPlayers.map((player, index) => (
          <div key={player.name} className="rank-item">
            <span className="rank-position">{index + 1}.</span>
            <span className="rank-name">{player.name}</span>
            <span className="rank-score">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;

