/**
 * useGame Hook
 * Main game state management and logic with multiplayer support
 */

import { useState, useCallback } from 'react';
import ApiService from '../services/api.service';
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
      setError(err.message || 'Failed to start game');
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  }, [letterPoints, fetchLetterPoints, playedWordIds]);

  /**
   * Submit a letter guess
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

    try {
      setLoading(true);
      setError(null);

      const guessRequest = {
        wordId: gameState.wordId,
        letter: letter.toUpperCase(),
        currentMask: gameState.maskedWord,
      };

      console.log('Making API call for letter:', letter);
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

        // Calculate score - use pointsEarned from backend (letterValue × occurrences)
        const newPlayers = [...prev.players];
        if (response.correct && newPlayers.length > 0) {
          // Use pointsEarned from backend which is letterValue × occurrences
          const pointsToAdd = response.pointsEarned || (response.letterValue || letterPoints[letter.toUpperCase()] || 1);

          // Debug logging
          console.log('=== SCORE CALCULATION DEBUG ===');
          console.log('Letter guessed:', letter.toUpperCase());
          console.log('Backend response.letterValue:', response.letterValue);
          console.log('Backend response.pointsEarned:', response.pointsEarned);
          console.log('Backend response.occurrences:', response.occurrences);
          console.log('letterPoints lookup:', letterPoints[letter.toUpperCase()]);
          console.log('Points being added:', pointsToAdd);
          console.log('Player before:', prev.players[prev.currentPlayerIndex].name, prev.players[prev.currentPlayerIndex].score);
          console.log('Player after will be:', prev.players[prev.currentPlayerIndex].score + pointsToAdd);
          console.log('===============================');

          newPlayers[prev.currentPlayerIndex].score += pointsToAdd;
        }

        // Move to next player if incorrect guess (turn-based)
        let nextPlayerIndex = prev.currentPlayerIndex;
        if (!response.correct && newPlayers.length > 1) {
          nextPlayerIndex = (prev.currentPlayerIndex + 1) % newPlayers.length;
        }

        let newStatus = prev.status;
        if (response.puzzleSolved) {
          newStatus = GAME_STATUS.WON;
        } else if (!isMultiplayer && newRemainingAttempts <= 0) {
          // Only single player can lose due to max attempts
          newStatus = GAME_STATUS.LOST;
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
    }
  }, [gameState.status, gameState.guessedLetters, gameState.wordId, gameState.maskedWord, letterPoints]);

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
    setError(null);
    // Clear played words for new game session
    setPlayedWordIds([]);
  }, []);

  return {
    gameState,
    loading,
    error,
    letterPoints,
    playedWordIds,
    initializePlayers,
    startGame,
    guessLetter,
    resetGame,
    resetPlayers,
  };
};

export default useGame;
