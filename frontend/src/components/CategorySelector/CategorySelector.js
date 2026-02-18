/**
 * CategorySelector Component
 * Allows user to select a word category to start the game
 */

import React from 'react';
import './CategorySelector.css';
import { formatCategoryName } from '../../utils/gameUtils';

const CategorySelector = ({ categories, onSelectCategory, loading, error }) => {
    if (loading) {
        return <div className="category-selector loading">Loading categories...</div>;
    }

    if (error) {
        return <div className="category-selector error">Error: {error}</div>;
    }

    return (
        <div className="category-selector">
            <h2>Select a Category</h2>
            <div className="category-grid">
                {categories.map((category) => (
                    <button
                        key={category}
                        className="category-button"
                        onClick={() => onSelectCategory(category)}
                    >
                        {formatCategoryName(category)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategorySelector;

