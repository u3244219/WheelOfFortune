package com.adeel.wheeloffotune.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Scrabble scoring utility
 * Assigns point values to each letter based on Scrabble rules
 */
public class ScrabbleScoring {
    private static final Map<Character, Integer> LETTER_POINTS = new HashMap<>();

    static {
        // 1 point: A, E, I, O, U, L, N, S, T, R
        String onePoint = "AEIOULNSTR";
        for (char c : onePoint.toCharArray()) {
            LETTER_POINTS.put(c, 1);
        }

        // 2 points: D, G
        String twoPoints = "DG";
        for (char c : twoPoints.toCharArray()) {
            LETTER_POINTS.put(c, 2);
        }

        // 3 points: B, C, M, P
        String threePoints = "BCMP";
        for (char c : threePoints.toCharArray()) {
            LETTER_POINTS.put(c, 3);
        }

        // 4 points: F, H, V, W, Y
        String fourPoints = "FHVWY";
        for (char c : fourPoints.toCharArray()) {
            LETTER_POINTS.put(c, 4);
        }

        // 5 points: K
        LETTER_POINTS.put('K', 5);

        // 8 points: J, X
        LETTER_POINTS.put('J', 8);
        LETTER_POINTS.put('X', 8);

        // 10 points: Q, Z
        LETTER_POINTS.put('Q', 10);
        LETTER_POINTS.put('Z', 10);
    }

    /**
     * Get point value for a single letter
     * @param letter The letter to score
     * @return Point value (0 if not a letter)
     */
    public static int getLetterPoints(char letter) {
        char upperLetter = Character.toUpperCase(letter);
        return LETTER_POINTS.getOrDefault(upperLetter, 0);
    }

    /**
     * Calculate total points for multiple occurrences of a letter
     * @param letter The letter
     * @param occurrences Number of times it appears
     * @return Total points
     */
    public static int calculatePoints(char letter, int occurrences) {
        return getLetterPoints(letter) * occurrences;
    }

    /**
     * Get all letter points mapping
     * @return Map of letters to their point values
     */
    public static Map<Character, Integer> getAllLetterPoints() {
        return new HashMap<>(LETTER_POINTS);
    }
}

