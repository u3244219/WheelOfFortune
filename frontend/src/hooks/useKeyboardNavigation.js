/**
 * Keyboard Navigation Hook
 * Handles TV remote / keyboard navigation
 */

import { useEffect, useCallback } from 'react';

/**
 * Hook for TV remote navigation
 * @param {Object} handlers - Navigation handlers
 * @param {Function} handlers.onUp - Up arrow handler
 * @param {Function} handlers.onDown - Down arrow handler
 * @param {Function} handlers.onLeft - Left arrow handler
 * @param {Function} handlers.onRight - Right arrow handler
 * @param {Function} handlers.onEnter - Enter/OK handler
 * @param {Function} handlers.onBack - Back/Escape handler
 * @param {boolean} enabled - Whether navigation is enabled (default: true)
 */
export const useKeyboardNavigation = (handlers, enabled = true) => {
  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handlers.onUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handlers.onDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlers.onLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlers.onRight?.();
        break;
      case 'Enter':
        e.preventDefault();
        handlers.onEnter?.();
        break;
      case 'Escape':
      case 'Backspace':
        e.preventDefault();
        handlers.onBack?.();
        break;
      default:
        break;
    }
  }, [handlers, enabled]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
};

