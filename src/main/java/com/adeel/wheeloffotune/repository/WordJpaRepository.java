package com.adeel.wheeloffotune.repository;

import com.adeel.wheeloffotune.model.Category;
import com.adeel.wheeloffotune.model.WordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for WordEntity
 */
@Repository
public interface WordJpaRepository extends JpaRepository<WordEntity, Long> {

    /**
     * Find all words by category
     */
    List<WordEntity> findByCategory(Category category);

    /**
     * Get a random word by category (MySQL)
     */
    @Query(value = "SELECT * FROM words WHERE category = :category ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<WordEntity> findRandomByCategory(@Param("category") String category);
}

