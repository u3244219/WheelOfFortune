/**
 * GameBoard Component
 * Main game container with side-panel scoreboard layout (like horse race TV screen)
 * Now with mobile drawer for scoreboard
 */

import React, { useState } from 'react';
import { useDevice } from '../../contexts/DeviceContext';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import PrizeWheel from '../PrizeWheel/PrizeWheel';
import './GameBoard.css';
import WordDisplay from '../WordDisplay/WordDisplay';
import Keyboard from '../Keyboard/Keyboard';
import GameStats from '../GameStats/GameStats';
import GameResult from '../GameResult/GameResult';
import Scoreboard from '../Scoreboard/Scoreboard';
import { GAME_STATUS, GAME_CONSTANTS } from '../../constants/gameConstants';

const GameBoard = ({
  gameState,
  onLetterClick,
  onPlayAgain,
  onNewCategory,
  loading,
  letterPoints,
  showPrizeWheel,
  onWheelSpinComplete
}) => {
  const { isMobile } = useDevice();
  const [showMobileScoreboard, setShowMobileScoreboard] = useState(false);

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
        {/* Side Panel - Scoreboard (desktop/TV only) */}
        {players.length > 0 && !isMobile && (
          <div className="side-panel">
            <Scoreboard
              players={players}
              currentPlayerIndex={currentPlayerIndex}
            />
          </div>
        )}

        {/* Mobile Scoreboard Button */}
        {players.length > 0 && isMobile && (
          <button
            className="mobile-scoreboard-btn"
            onClick={() => setShowMobileScoreboard(true)}
          >
            📊 View Scores
          </button>
        )}

        {/* Mobile Scoreboard Drawer */}
        {isMobile && (
          <MobileDrawer
            isOpen={showMobileScoreboard}
            onClose={() => setShowMobileScoreboard(false)}
            position="bottom"
          >
            <Scoreboard
              players={players}
              currentPlayerIndex={currentPlayerIndex}
            />
          </MobileDrawer>
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

      {/* Prize Wheel Modal */}
      {showPrizeWheel && (
        <PrizeWheel
          onSpinComplete={onWheelSpinComplete}
          playerName={players[currentPlayerIndex]?.name}
        />
      )}

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
