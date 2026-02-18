package com.adeel.wheeloffotune.dto;

/**
 * Response after processing a letter guess
 */
public class GuessResponse {
    private boolean correct;
    private String updatedMask;
    private int occurrences;
    private boolean puzzleSolved;
    private String message;
    private int pointsEarned;
    private int letterValue;

    public GuessResponse() {
    }

    public GuessResponse(boolean correct, String updatedMask, int occurrences, boolean puzzleSolved, String message) {
        this.correct = correct;
        this.updatedMask = updatedMask;
        this.occurrences = occurrences;
        this.puzzleSolved = puzzleSolved;
        this.message = message;
        this.pointsEarned = 0;
        this.letterValue = 0;
    }

    public GuessResponse(boolean correct, String updatedMask, int occurrences, boolean puzzleSolved, String message, int pointsEarned, int letterValue) {
        this.correct = correct;
        this.updatedMask = updatedMask;
        this.occurrences = occurrences;
        this.puzzleSolved = puzzleSolved;
        this.message = message;
        this.pointsEarned = pointsEarned;
        this.letterValue = letterValue;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public String getUpdatedMask() {
        return updatedMask;
    }

    public void setUpdatedMask(String updatedMask) {
        this.updatedMask = updatedMask;
    }

    public int getOccurrences() {
        return occurrences;
    }

    public void setOccurrences(int occurrences) {
        this.occurrences = occurrences;
    }

    public boolean isPuzzleSolved() {
        return puzzleSolved;
    }

    public void setPuzzleSolved(boolean puzzleSolved) {
        this.puzzleSolved = puzzleSolved;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(int pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public int getLetterValue() {
        return letterValue;
    }

    public void setLetterValue(int letterValue) {
        this.letterValue = letterValue;
    }
}
