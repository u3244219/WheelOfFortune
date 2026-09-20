package com.adeel.wheeloffotune.dto;

import com.adeel.wheeloffotune.model.Category;
import com.adeel.wheeloffotune.model.Difficulty;

/**
 * Response containing a word puzzle with masked representation
 */
public class WordResponse {
    private Long wordId;
    private Category category;
    private String maskedWord;
    private String hint;
    private Difficulty difficulty;
    private int wordLength;

    public WordResponse() {
    }

    public WordResponse(Long wordId, Category category, String maskedWord, String hint, Difficulty difficulty, int wordLength) {
        this.wordId = wordId;
        this.category = category;
        this.maskedWord = maskedWord;
        this.hint = hint;
        this.difficulty = difficulty;
        this.wordLength = wordLength;
    }

    public Long getWordId() {
        return wordId;
    }

    public void setWordId(Long wordId) {
        this.wordId = wordId;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getMaskedWord() {
        return maskedWord;
    }

    public void setMaskedWord(String maskedWord) {
        this.maskedWord = maskedWord;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public int getWordLength() {
        return wordLength;
    }

    public void setWordLength(int wordLength) {
        this.wordLength = wordLength;
    }
}

