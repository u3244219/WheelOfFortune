/**
 * CategorySelector Component
 * Allows user to select a word category to start the game
 * Now with TV navigation support
 */

import React, { useState } from 'react';
import { useDevice } from '../../contexts/DeviceContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import FocusableButton from '../FocusableButton/FocusableButton';
import './CategorySelector.css';
import { formatCategoryName } from '../../utils/gameUtils';

const CategorySelector = ({ categories, onSelectCategory, loading, error }) => {
    const { isTV, isMobile } = useDevice();
    const [focusedIndex, setFocusedIndex] = useState(0);

    // TV keyboard navigation
    const columns = isTV ? 2 : 3; // 2 columns on TV for larger cards

    useKeyboardNavigation({
        onUp: () => {
            if (isTV) {
                setFocusedIndex(prev => Math.max(0, prev - columns));
            }
        },
        onDown: () => {
            if (isTV) {
                setFocusedIndex(prev => Math.min(categories.length - 1, prev + columns));
            }
        },
        onLeft: () => {
            if (isTV) {
                setFocusedIndex(prev => Math.max(0, prev - 1));
            }
        },
        onRight: () => {
            if (isTV) {
                setFocusedIndex(prev => Math.min(categories.length - 1, prev + 1));
            }
        },
        onEnter: () => {
            if (isTV && categories[focusedIndex]) {
                onSelectCategory(categories[focusedIndex]);
            }
        }
    }, isTV);
    if (loading) {
        return <div className="category-selector loading">Loading categories...</div>;
    }

    if (error) {
        return <div className="category-selector error">Error: {error}</div>;
    }

    return (
        <div className={`category-selector ${isTV ? 'tv-mode' : ''} ${isMobile ? 'mobile-mode' : ''}`}>
            <h2>Select a Category</h2>
            <div className={`category-grid ${isTV ? 'tv-grid' : ''}`}>
                {categories.map((category, index) => (
                    isTV ? (
                        <FocusableButton
                            key={category}
                            className="category-button"
                            isFocused={focusedIndex === index}
                            onSelect={() => onSelectCategory(category)}
                        >
                            {formatCategoryName(category)}
                        </FocusableButton>
                    ) : (
                        <button
                            key={category}
                            className="category-button"
                            onClick={() => onSelectCategory(category)}
                        >
                            {formatCategoryName(category)}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};

export default CategorySelector;

