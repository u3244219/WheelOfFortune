package com.adeel.wheeloffotune.service;

import com.adeel.wheeloffotune.dto.GuessRequest;
import com.adeel.wheeloffotune.dto.GuessResponse;
import com.adeel.wheeloffotune.dto.WordResponse;
import com.adeel.wheeloffotune.model.Category;
import com.adeel.wheeloffotune.model.WordEntity;
import com.adeel.wheeloffotune.repository.WordRepository;
import com.adeel.wheeloffotune.util.ScrabbleScoring;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service for word puzzle operations
 */
@Service
public class WordService {
    private final WordRepository wordRepository;

    public WordService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    /**
     * Get a random word from a specific category
     */
    public Optional<WordResponse> getRandomWordByCategory(Category category) {
        Optional<WordEntity> wordEntity = wordRepository.findRandomByCategory(category);
        return wordEntity.map(this::createWordResponse);
    }

    /**
     * Process a letter guess and return updated state
     */
    public Optional<GuessResponse> processGuess(GuessRequest request) {
        Optional<WordEntity> wordEntity = wordRepository.findById(request.getWordId());

        if (wordEntity.isEmpty()) {
            return Optional.empty();
        }

        WordEntity word = wordEntity.get();
        char guessedLetter = Character.toUpperCase(request.getLetter());
        String actualWord = word.getWord().toUpperCase();
        String currentMask = request.getCurrentMask();

        // Process the guess
        StringBuilder updatedMask = new StringBuilder(currentMask);
        int occurrences = 0;
        boolean letterFound = false;

        for (int i = 0; i < actualWord.length(); i++) {
            char currentChar = actualWord.charAt(i);
            if (currentChar == guessedLetter) {
                updatedMask.setCharAt(i, currentChar);
                occurrences++;
                letterFound = true;
            }
        }

        // Calculate points using Scrabble scoring
        int letterValue = ScrabbleScoring.getLetterPoints(guessedLetter);
        int pointsEarned = letterFound ? ScrabbleScoring.calculatePoints(guessedLetter, occurrences) : 0;

        // Check if puzzle is solved
        boolean puzzleSolved = updatedMask.toString().equals(actualWord);

        // Build response message
        String message;
        if (puzzleSolved) {
            message = "Congratulations! You solved the puzzle!";
        } else if (letterFound) {
            message = String.format("Correct! Found %d occurrence(s) of '%c' (+%d points)", occurrences, guessedLetter, pointsEarned);
        } else {
            message = String.format("Sorry, '%c' is not in the word", guessedLetter);
        }

        return Optional.of(new GuessResponse(
                letterFound,
                updatedMask.toString(),
                occurrences,
                puzzleSolved,
                message,
                pointsEarned,
                letterValue
        ));
    }

    /**
     * Create initial masked word (underscores for letters, preserve spaces/punctuation)
     */
    public String createMask(String word) {
        StringBuilder mask = new StringBuilder();
        for (char c : word.toUpperCase().toCharArray()) {
            if (Character.isLetter(c)) {
                mask.append('_');
            } else {
                mask.append(c); // Preserve spaces, hyphens, etc.
            }
        }
        return mask.toString();
    }

    /**
     * Convert WordEntity to WordResponse with masked word
     */
    private WordResponse createWordResponse(WordEntity word) {
        String maskedWord = createMask(word.getWord());
        return new WordResponse(
                word.getId(),
                word.getCategory(),
                maskedWord,
                word.getHint(),
                word.getDifficulty(),
                word.getWord().length()
        );
    }

    /**
     * Get word by ID (for validation purposes)
     */
    public Optional<WordEntity> getWordById(Long id) {
        return wordRepository.findById(id);
    }
}
