/**
 * GameResult Component
 * Displays win/loss screen with options to play again and final scores
 */

import React from 'react';
import './GameResult.css';
import { GAME_STATUS } from '../../constants/gameConstants';

const GameResult = ({ status, maskedWord, onPlayAgain, onNewCategory, players }) => {
  const isWon = status === GAME_STATUS.WON;
  const isLost = status === GAME_STATUS.LOST;

  if (!isWon && !isLost) return null;

  return (
    <div className={`game-result ${isWon ? 'won' : 'lost'}`}>
      <div className="result-modal">
        <div className="result-icon">
          {isWon ? '🎉' : '😢'}
        </div>

        <h2 className="result-title">
          {isWon ? 'Congratulations!' : 'Game Over!'}
        </h2>

        <p className="result-message">
          {isWon
            ? `You solved the puzzle!`
            : `The word was:`
          }
        </p>

        <div className="result-word">
          {maskedWord}
        </div>

        {players.length > 0 && (
          <div className="final-scores">
            <h3>Final Scores</h3>
            {[...players].sort((a, b) => b.score - a.score).map((player, index) => (
              <div key={player.name} className={`final-score-item ${index === 0 ? 'winner' : ''}`}>
                <span className="final-rank">{index + 1}.</span>
                <span className="final-name">{player.name}</span>
                <span className="final-score">{player.score} pts</span>
                {index === 0 && <span className="winner-badge">👑 Winner!</span>}
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button
            className="btn btn-primary"
            onClick={onPlayAgain}
          >
            Play Again (Same Category)
          </button>
          <button
            className="btn btn-secondary"
            onClick={onNewCategory}
          >
            Choose New Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
