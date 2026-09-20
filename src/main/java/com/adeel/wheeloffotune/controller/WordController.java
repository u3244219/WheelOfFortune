package com.adeel.wheeloffotune.controller;

import com.adeel.wheeloffotune.dto.GuessRequest;
import com.adeel.wheeloffotune.dto.GuessResponse;
import com.adeel.wheeloffotune.dto.WordResponse;
import com.adeel.wheeloffotune.model.Category;
import com.adeel.wheeloffotune.service.WordService;
import com.adeel.wheeloffotune.util.ScrabbleScoring;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST API Controller for Wheel of Fortune game
 * CORS configured to allow access from any origin on local network
 */
@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class WordController {
    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    /**
     * Get all available categories
     * GET /api/words/categories
     *
     * Response: ["LOCATION_PLACE", "GENERAL_ITEM", ...]
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = Arrays.stream(Category.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get a random word by category
     * GET /api/words/random?category=LOCATION_PLACE
     *
     * Response:
     * {
     *   "wordId": 1,
     *   "category": "LOCATION_PLACE",
     *   "maskedWord": "_____",
     *   "hint": "Capital of France",
     *   "difficulty": "EASY",
     *   "wordLength": 5
     * }
     */
    @GetMapping("/random")
    public ResponseEntity<WordResponse> getRandomWord(@RequestParam String category) {
        try {
            Category cat = Category.valueOf(category.toUpperCase());
            Optional<WordResponse> word = wordService.getRandomWordByCategory(cat);
            return word.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Process a letter guess
     * POST /api/words/guess
     *
     * Request:
     * {
     *   "wordId": 1,
     *   "letter": "A",
     *   "currentMask": "_____"
     * }
     *
     * Response:
     * {
     *   "correct": true,
     *   "updatedMask": "_A___",
     *   "occurrences": 1,
     *   "puzzleSolved": false,
     *   "message": "Correct! Found 1 occurrence(s) of 'A'"
     * }
     */
    @PostMapping("/guess")
    public ResponseEntity<GuessResponse> processGuess(@RequestBody GuessRequest request) {
        Optional<GuessResponse> response = wordService.processGuess(request);
        return response.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get Scrabble letter point values
     * GET /api/words/letter-points
     *
     * Response: {"A": 1, "B": 3, "C": 3, ...}
     */
    @GetMapping("/letter-points")
    public ResponseEntity<Map<Character, Integer>> getLetterPoints() {
        return ResponseEntity.ok(ScrabbleScoring.getAllLetterPoints());
    }
}
