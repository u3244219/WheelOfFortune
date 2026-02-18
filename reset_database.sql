-- Reset Database Script for Enhanced Game Data
-- Run this script before restarting the Spring Boot application

-- Option 1: Complete database reset (RECOMMENDED)
DROP DATABASE IF EXISTS wheel_of_fortune;
CREATE DATABASE wheel_of_fortune;

-- The Spring Boot application with Flyway will automatically:
-- 1. Create the words table with updated schema (V1 migration)
-- 2. Populate with 130 enhanced word puzzles (V2 migration)

-- Note: After running this script, restart your Spring Boot application
-- The new data includes:
-- - 13 categories (6 original + 7 new)
-- - 10 words per category = 130 total words
-- - More challenging hints
-- - Categories: LOCATION_PLACE, GENERAL_ITEM, FRUIT_VEGETABLE, DISH, SWEET, CANDY,
--              MOVIE, ANIMAL, SPORT, OCCUPATION, TECHNOLOGY, MUSIC, COUNTRY

