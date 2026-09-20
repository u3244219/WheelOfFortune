/**
 * GameStats Component
 * Displays game statistics (attempts remaining, guessed letters)
 */

import React from 'react';
import './GameStats.css';

const GameStats = ({ remainingAttempts, maxAttempts, incorrectLetters, message }) => {
    const attemptsPercentage = (remainingAttempts / maxAttempts) * 100;

    return (
        <div className="game-stats">
            <div className="stats-container">
                <div className="attempts-section">
                    <h3>Attempts Remaining</h3>
                    <div className="attempts-display">
            <span className={`attempts-count ${remainingAttempts <= 2 ? 'warning' : ''}`}>
              {remainingAttempts} / {maxAttempts}
            </span>
                    </div>
                    <div className="attempts-bar">
                        <div
                            className={`attempts-fill ${remainingAttempts <= 2 ? 'warning' : ''}`}
                            style={{ width: `${attemptsPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {incorrectLetters.length > 0 && (
                    <div className="incorrect-section">
                        <h3>Incorrect Guesses</h3>
                        <div className="incorrect-letters">
                            {incorrectLetters.map((letter, index) => (
                                <span key={index} className="incorrect-letter">
                  {letter}
                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {message && (
                <div className="game-message">
                    {message}
                </div>
            )}
        </div>
    );
};

export default GameStats;