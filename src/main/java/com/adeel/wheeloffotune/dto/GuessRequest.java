package com.adeel.wheeloffotune.dto;

/**
 * Request for guessing a letter
 */
public class GuessRequest {
    private Long wordId;
    private char letter;
    private String currentMask;

    public GuessRequest() {
    }

    public GuessRequest(Long wordId, char letter, String currentMask) {
        this.wordId = wordId;
        this.letter = letter;
        this.currentMask = currentMask;
    }

    public Long getWordId() {
        return wordId;
    }

    public void setWordId(Long wordId) {
        this.wordId = wordId;
    }

    public char getLetter() {
        return letter;
    }

    public void setLetter(char letter) {
        this.letter = letter;
    }

    public String getCurrentMask() {
        return currentMask;
    }

    public void setCurrentMask(String currentMask) {
        this.currentMask = currentMask;
    }
}

