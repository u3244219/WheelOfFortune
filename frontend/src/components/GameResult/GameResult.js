/**
 * GameResult Component
 * Displays win/loss screen with options to play again and final scores
 * Now with confetti celebration!
 */

import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import AnswerReveal from '../AnswerReveal/AnswerReveal';
import './GameResult.css';
import { GAME_STATUS } from '../../constants/gameConstants';

const GameResult = ({ status, maskedWord, answer, category, hint, onPlayAgain, onNewCategory, players }) => {
  const isWon = status === GAME_STATUS.WON;
  const isLost = status === GAME_STATUS.LOST;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isWon && !isLost) return null;

  return (
    <div className={`game-result ${isWon ? 'won' : 'lost'}`}>
      {/* Confetti for winners! */}
      {isWon && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <div className="result-modal">
        <div className="result-header">
          <span className="result-icon">{isWon ? '🎉' : '😢'}</span>
          <h2 className="result-title">
            {isWon ? 'Congratulations!' : 'Game Over!'}
          </h2>
        </div>


        <AnswerReveal
          word={answer || maskedWord}
          category={category}
          hint={hint}
        />

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
