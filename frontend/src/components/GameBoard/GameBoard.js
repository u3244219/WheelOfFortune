/**
 * GameBoard Component
 * Main game container with side-panel scoreboard layout (like horse race TV screen)
 */

import React from 'react';
import './GameBoard.css';
import WordDisplay from '../WordDisplay/WordDisplay';
import Keyboard from '../Keyboard/Keyboard';
import GameStats from '../GameStats/GameStats';
import GameResult from '../GameResult/GameResult';
import Scoreboard from '../Scoreboard/Scoreboard';
import { GAME_STATUS, GAME_CONSTANTS } from '../../constants/gameConstants';

const GameBoard = ({ gameState, onLetterClick, onPlayAgain, onNewCategory, loading, letterPoints }) => {
  const { status, maskedWord, category, hint, difficulty, guessedLetters, incorrectLetters, remainingAttempts, message, players, currentPlayerIndex } = gameState;

  const isGameActive = status === GAME_STATUS.PLAYING;
  const isGameOver = status === GAME_STATUS.WON || status === GAME_STATUS.LOST;
  const isMultiplayer = players.length > 1;

  if (!maskedWord) {
    return (
      <div className="game-board">
        <div className="game-loading">Starting game...</div>
      </div>
    );
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>🎡 Wheel of Fortune</h1>
        <button className="new-game-btn" onClick={onNewCategory}>
          New Category
        </button>
      </div>

      <div className="game-container">
        {/* Side Panel - Scoreboard (like horse race TV) */}
        {players.length > 0 && (
          <div className="side-panel">
            <Scoreboard
              players={players}
              currentPlayerIndex={currentPlayerIndex}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="main-content">
          <WordDisplay
            maskedWord={maskedWord}
            category={category}
            hint={hint}
            difficulty={difficulty}
          />

          {!isMultiplayer && (
            <GameStats
              remainingAttempts={remainingAttempts}
              maxAttempts={GAME_CONSTANTS.MAX_ATTEMPTS}
              incorrectLetters={incorrectLetters}
              message={message}
            />
          )}

          {isMultiplayer && message && (
            <div className="multiplayer-message">
              {message}
            </div>
          )}

          <Keyboard
            onLetterClick={onLetterClick}
            guessedLetters={guessedLetters}
            incorrectLetters={incorrectLetters}
            disabled={!isGameActive || loading}
            letterPoints={letterPoints}
          />
        </div>
      </div>

      {isGameOver && (
        <GameResult
          status={status}
          maskedWord={maskedWord}
          onPlayAgain={onPlayAgain}
          onNewCategory={onNewCategory}
          players={players}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
