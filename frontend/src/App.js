/**
 * Main App Component
 * Root component that manages game flow with player setup and multiplayer support
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import PlayerSetup from './components/PlayerSetup/PlayerSetup';
import CategorySelector from './components/CategorySelector/CategorySelector';
import GameBoard from './components/GameBoard/GameBoard';
import SoundToggle from './components/SoundToggle/SoundToggle';
import useCategories from './hooks/useCategories';
import useGame from './hooks/useGame';
import { GAME_STATUS } from './constants/gameConstants';
import ApiService from './services/api.service';
import { preloadSounds } from './utils/soundManager';

function App() {
  const [showPlayerSetup, setShowPlayerSetup] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const {
    gameState,
    answer,
    loading: gameLoading,
    error: gameError,
    initializePlayers,
    startGame,
    guessLetter,
    resetGame,
    resetPlayers,
    showPrizeWheel,
    handleWheelSpinComplete
  } = useGame();

  // Initialize database on app load
  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log('Initializing database...');
        await ApiService.initialize();
        setDbInitialized(true);
        console.log('Database ready!');

        // 🔊 Preload sound effects
        preloadSounds();
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError('Failed to load game database. Please refresh the page.');
      }
    };

    initDatabase();
  }, []);

  const handlePlayerSetupComplete = (playerNames) => {
    initializePlayers(playerNames);
    setShowPlayerSetup(false);
  };

  const handleSelectCategory = async (category) => {
    await startGame(category);
  };

  const handleLetterClick = async (letter) => {
    await guessLetter(letter);
  };

  const handlePlayAgain = async () => {
    if (gameState.category) {
      await startGame(gameState.category);
    }
  };

  const handleNewCategory = () => {
    resetGame();
  };

  const handleNewGame = () => {
    resetPlayers();
    setShowPlayerSetup(true);
  };

  // Show loading state while database initializes
  if (!dbInitialized) {
    return (
      <div className="app">
        <div className="app-header">
          <h1>🎡 Wheel of Fortune</h1>
          <p className="app-subtitle">Test your word-guessing skills!</p>
        </div>
        <div className="loading-container">
          {dbError ? (
            <div className="error-message">
              <h2>⚠️ {dbError}</h2>
            </div>
          ) : (
            <div>
              <h2>Loading game database...</h2>
              <p>Please wait while we prepare the game...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show player setup screen first
  if (showPlayerSetup) {
    return (
      <div className="app">
        <SoundToggle />
        <div className="app-header">
          <h1>🎡 Wheel of Fortune</h1>
          <p className="app-subtitle">Test your word-guessing skills!</p>
        </div>

        <PlayerSetup onStartGame={handlePlayerSetupComplete} />
      </div>
    );
  }

  // Show category selector when game is idle
  if (gameState.status === GAME_STATUS.IDLE) {
    return (
      <div className="app">
        <SoundToggle />
        <div className="app-header">
          <h1>🎡 Wheel of Fortune</h1>
          <p className="app-subtitle">Test your word-guessing skills!</p>
          <button className="new-players-btn" onClick={handleNewGame}>
            New Game (Change Players)
          </button>
        </div>

        <CategorySelector
          categories={categories}
          onSelectCategory={handleSelectCategory}
          loading={categoriesLoading}
          error={categoriesError}
        />

        {gameError && (
          <div className="error-message">
            Error: {gameError}
          </div>
        )}
      </div>
    );
  }

  // Show game board when playing
  return (
    <div className="app">
      <SoundToggle />
      <GameBoard
        gameState={gameState}
        answer={answer}
        onLetterClick={handleLetterClick}
        onPlayAgain={handlePlayAgain}
        onNewCategory={handleNewCategory}
        loading={gameLoading}
        showPrizeWheel={showPrizeWheel}
        onWheelSpinComplete={handleWheelSpinComplete}
      />

      {gameError && (
        <div className="error-banner">
          {gameError}
        </div>
      )}
    </div>
  );
}

export default App;
