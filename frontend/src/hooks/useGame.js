/**
 * useGame Hook
 * Main game state management and logic with multiplayer support
 */

import { useState, useCallback } from 'react';
import ApiService from '../services/api.service';
import SoundEffects from '../utils/soundManager';
import { GAME_STATUS, GAME_CONSTANTS } from '../constants/gameConstants';

export const useGame = () => {
  const [gameState, setGameState] = useState({
    status: GAME_STATUS.IDLE,
    wordId: null,
    category: '',
    maskedWord: '',
    hint: '',
    difficulty: '',
    wordLength: 0,
    guessedLetters: [],
    incorrectLetters: [],
    remainingAttempts: GAME_CONSTANTS.MAX_ATTEMPTS,
    message: '',
    players: [],
    currentPlayerIndex: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playedWordIds, setPlayedWordIds] = useState([]);
  const [showPrizeWheel, setShowPrizeWheel] = useState(false);
  const [currentSpinValue, setCurrentSpinValue] = useState(0);
  const [pendingLetter, setPendingLetter] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Initialize players
   */
  const initializePlayers = useCallback((playerNames) => {
    const players = playerNames.map(name => ({
      name,
      score: 0,
    }));

    setGameState(prev => ({
      ...prev,
      players,
      currentPlayerIndex: 0,
    }));
  }, []);

  /**
   * Start a new game with selected category
   */
  const startGame = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);

      const wordData = await ApiService.getRandomWord(category, playedWordIds);

      // Track this word as played in the current session
      setPlayedWordIds(prev => [...prev, wordData.wordId]);

      // Remember the full answer so the reveal card can show it, win or lose
      setAnswer(ApiService.revealAnswer());

      setGameState(prev => ({
        ...prev,
        status: GAME_STATUS.PLAYING,
        wordId: wordData.wordId,
        category: wordData.category,
        maskedWord: wordData.maskedWord,
        hint: wordData.hint,
        difficulty: wordData.difficulty,
        wordLength: wordData.wordLength,
        guessedLetters: [],
        incorrectLetters: [],
        remainingAttempts: GAME_CONSTANTS.MAX_ATTEMPTS,
        message: 'Good luck!',
      }));
    } catch (err) {
      setAnswer('');
      setError(err.message || 'Failed to start game');
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  }, [playedWordIds]);

  /**
   * Submit a letter guess (now with prize wheel)
   */
  const guessLetter = useCallback(async (letter) => {
    if (gameState.status !== GAME_STATUS.PLAYING) {
      return;
    }
    if (gameState.guessedLetters.includes(letter)) {
      return;
    }

    // Show prize wheel first
    setPendingLetter(letter);
    setShowPrizeWheel(true);
  }, [gameState.status, gameState.guessedLetters]);

  /**
   * Handle prize wheel spin complete
   */
  const handleWheelSpinComplete = useCallback(async (spinValue) => {
    if (isProcessing) {
      return;
    }

    setShowPrizeWheel(false);
    setCurrentSpinValue(spinValue);
    setIsProcessing(true);

    const letter = pendingLetter;
    if (!letter) {
      setIsProcessing(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const guessRequest = {
        wordId: gameState.wordId,
        letter: letter.toUpperCase(),
        currentMask: gameState.maskedWord,
      };

      const response = await ApiService.submitGuess(guessRequest);

      setGameState(prev => {
        // Double-check letter wasn't already guessed (prevent race condition)
        if (prev.guessedLetters.includes(letter)) {
          return prev; // Return unchanged state
        }

        const newGuessedLetters = [...prev.guessedLetters, letter];
        const newIncorrectLetters = response.correct
          ? prev.incorrectLetters
          : [...prev.incorrectLetters, letter];

        // For multiplayer, no max attempts - game continues until solved
        const isMultiplayer = prev.players.length > 1;
        const newRemainingAttempts = isMultiplayer
          ? 999 // Unlimited attempts for multiplayer
          : GAME_CONSTANTS.MAX_ATTEMPTS - newIncorrectLetters.length;

        // Score, exactly as on the show: what you spun, once for every time
        // the letter appears in the puzzle.
        const newPlayers = [...prev.players];
        if (response.correct && newPlayers.length > 0) {
          const occurrences = response.occurrences || 1;
          const pointsToAdd = spinValue * occurrences;
          newPlayers[prev.currentPlayerIndex] = {
            ...prev.players[prev.currentPlayerIndex],
            score: prev.players[prev.currentPlayerIndex].score + pointsToAdd,
          };
        }

        // Move to next player if incorrect guess (turn-based)
        let nextPlayerIndex = prev.currentPlayerIndex;
        if (!response.correct && newPlayers.length > 1) {
          nextPlayerIndex = (prev.currentPlayerIndex + 1) % newPlayers.length;
        }

        let newStatus = prev.status;
        if (response.puzzleSolved) {
          newStatus = GAME_STATUS.WON;
          console.log('🎊 PUZZLE SOLVED! Playing victory sound...');
          // 🔊 Play puzzle solved victory sound (delayed to play after letter flips)
          setTimeout(() => {
            SoundEffects.puzzleSolved();
          }, 500); // Wait for letter flip sounds to finish
        } else if (!isMultiplayer && newRemainingAttempts <= 0) {
          // Only single player can lose due to max attempts
          newStatus = GAME_STATUS.LOST;
          // 🔊 Play game over sound
          SoundEffects.gameOver();
        }

        // 🔊 Play correct or wrong sound for letter guess
        if (response.correct) {
          // Play letter flip sound for each occurrence
          for (let i = 0; i < response.occurrences; i++) {
            SoundEffects.flipLetter(i * 100); // Stagger flips
          }
          SoundEffects.correctLetter();
        } else {
          SoundEffects.wrongLetter();
        }

        return {
          ...prev,
          maskedWord: response.updatedMask,
          guessedLetters: newGuessedLetters,
          incorrectLetters: newIncorrectLetters,
          remainingAttempts: newRemainingAttempts,
          message: response.correct
            ? `${letter.toUpperCase()} appears ${response.occurrences} time${response.occurrences === 1 ? '' : 's'} - ${spinValue} x ${response.occurrences} = ${spinValue * response.occurrences} points`
            : response.message,
          status: newStatus,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
        };
      });
    } catch (err) {
      setError(err.message || 'Failed to process guess');
      console.error('Error processing guess:', err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setPendingLetter(null); // Clear pending letter to prevent reprocessing
    }
  }, [gameState.wordId, gameState.maskedWord, pendingLetter, isProcessing]);

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      status: GAME_STATUS.IDLE,
      wordId: null,
      category: '',
      maskedWord: '',
      hint: '',
      difficulty: '',
      wordLength: 0,
      guessedLetters: [],
      incorrectLetters: [],
      remainingAttempts: GAME_CONSTANTS.MAX_ATTEMPTS,
      message: '',
      players: prev.players,
      currentPlayerIndex: 0,
    }));
    setAnswer('');
    setError(null);
  }, []);

  /**
   * Reset players (new game session)
   */
  const resetPlayers = useCallback(() => {
    setGameState({
      status: GAME_STATUS.IDLE,
      wordId: null,
      category: '',
      maskedWord: '',
      hint: '',
      difficulty: '',
      wordLength: 0,
      guessedLetters: [],
      incorrectLetters: [],
      remainingAttempts: GAME_CONSTANTS.MAX_ATTEMPTS,
      message: '',
      players: [],
      currentPlayerIndex: 0,
    });
    setAnswer('');
    setError(null);
    // Clear played words for new game session
    setPlayedWordIds([]);
  }, []);

  return {
    gameState,
    answer,
    loading,
    error,
    playedWordIds,
    showPrizeWheel,
    currentSpinValue,
    initializePlayers,
    startGame,
    guessLetter,
    handleWheelSpinComplete,
    resetGame,
    resetPlayers,
  };
};

export default useGame;
