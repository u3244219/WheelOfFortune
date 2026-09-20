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
  const [letterPoints, setLetterPoints] = useState({});
  const [playedWordIds, setPlayedWordIds] = useState([]);
  const [showPrizeWheel, setShowPrizeWheel] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
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
   * Fetch letter points from backend
   */
  const fetchLetterPoints = useCallback(async () => {
    try {
      const points = await ApiService.getLetterPoints();
      setLetterPoints(points);
    } catch (err) {
      console.error('Error fetching letter points:', err);
    }
  }, []);

  /**
   * Start a new game with selected category
   */
  const startGame = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);

      const wordData = await ApiService.getRandomWord(category, playedWordIds);

      // Fetch letter points if not already loaded
      if (Object.keys(letterPoints).length === 0) {
        await fetchLetterPoints();
      }

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
  }, [letterPoints, fetchLetterPoints, playedWordIds]);

  /**
   * Submit a letter guess (now with prize wheel)
   */
  const guessLetter = useCallback(async (letter) => {
    console.log('guessLetter called with:', letter, 'Status:', gameState.status, 'Already guessed:', gameState.guessedLetters);

    if (gameState.status !== GAME_STATUS.PLAYING) {
      console.log('Rejected: Game not playing');
      return;
    }
    if (gameState.guessedLetters.includes(letter)) {
      console.log('Rejected: Letter already guessed');
      return;
    }

    // Show prize wheel first
    setPendingLetter(letter);
    setShowPrizeWheel(true);
  }, [gameState.status, gameState.guessedLetters]);

  /**
   * Handle prize wheel spin complete
   */
  const handleWheelSpinComplete = useCallback(async (multiplier) => {
    if (isProcessing) {
      console.log('PREVENTED DUPLICATE: Already processing a guess');
      return;
    }

    setShowPrizeWheel(false);
    setCurrentMultiplier(multiplier);
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

      console.log('Making API call for letter:', letter, 'with multiplier:', multiplier);
      const response = await ApiService.submitGuess(guessRequest);
      console.log('API Response received:', response);

      setGameState(prev => {
        // Double-check letter wasn't already guessed (prevent race condition)
        if (prev.guessedLetters.includes(letter)) {
          console.log('PREVENTED DUPLICATE: Letter already in guessedLetters during state update');
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

        // Calculate score - SIMPLE: Letter Points × Occurrences × Multiplier
        const newPlayers = [...prev.players];
        if (response.correct && newPlayers.length > 0) {
          const currentPlayerScore = prev.players[prev.currentPlayerIndex].score;

          // SIMPLE calculation: Letter Points × Occurrences × Multiplier
          const letterValue = response.letterValue || 1;
          const occurrences = response.occurrences || 1;
          const pointsToAdd = letterValue * occurrences * multiplier;

          // Debug logging - CLEAR FORMAT
          console.log('╔════════════════════════════════════════╗');
          console.log('║   SCORE CALCULATION                    ║');
          console.log('╚════════════════════════════════════════╝');
          console.log('Letter:       ', letter.toUpperCase());
          console.log('Letter Value: ', letterValue, 'points');
          console.log('Occurrences:  ', occurrences, 'times');
          console.log('Multiplier:   ', multiplier + 'x');
          console.log('────────────────────────────────────────');
          console.log('Formula:      ', letterValue, '×', occurrences, '×', multiplier);
          console.log('Points to Add:', pointsToAdd);
          console.log('────────────────────────────────────────');
          console.log('Current Score:', currentPlayerScore);
          console.log('New Score:    ', currentPlayerScore + pointsToAdd);
          console.log('════════════════════════════════════════\n');

          newPlayers[prev.currentPlayerIndex].score = currentPlayerScore + pointsToAdd;
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
          message: response.message,
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
  }, [gameState.wordId, gameState.maskedWord, letterPoints, pendingLetter, isProcessing]);

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
    letterPoints,
    playedWordIds,
    showPrizeWheel,
    currentMultiplier,
    initializePlayers,
    startGame,
    guessLetter,
    handleWheelSpinComplete,
    resetGame,
    resetPlayers,
  };
};

export default useGame;
