-- V1__Create_words_table.sql
-- Initial schema for Wheel of Fortune game (MySQL)

CREATE TABLE words (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    word VARCHAR(100) NOT NULL,
    hint VARCHAR(255),
    difficulty VARCHAR(20) NOT NULL,
    CONSTRAINT chk_category CHECK (category IN ('LOCATION_PLACE', 'GENERAL_ITEM', 'FRUIT_VEGETABLE', 'DISH', 'SWEET', 'CANDY', 'MOVIE', 'ANIMAL', 'SPORT', 'OCCUPATION', 'TECHNOLOGY', 'MUSIC', 'COUNTRY')),
    CONSTRAINT chk_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for faster category lookups
CREATE INDEX idx_words_category ON words(category);
CREATE INDEX idx_words_difficulty ON words(difficulty);
