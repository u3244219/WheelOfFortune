package com.adeel.wheeloffortune.repository;

import com.adeel.wheeloffortune.model.Category;
import com.adeel.wheeloffortune.model.WordEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository wrapper for WordEntity using JPA
 * Provides consistent interface for database operations
 */
@Repository
public class WordRepository {
    private final WordJpaRepository jpaRepository;

    public WordRepository(WordJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    public Optional<WordEntity> findById(Long id) {
        return jpaRepository.findById(id);
    }

    public Optional<WordEntity> findRandomByCategory(Category category) {
        return jpaRepository.findRandomByCategory(category.name());
    }

    public List<WordEntity> findAll() {
        return jpaRepository.findAll();
    }

    public List<WordEntity> findByCategory(Category category) {
        return jpaRepository.findByCategory(category);
    }

    public WordEntity save(WordEntity word) {
        return jpaRepository.save(word);
    }
}
