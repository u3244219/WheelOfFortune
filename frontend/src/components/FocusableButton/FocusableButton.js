/**
 * FocusableButton Component
 * TV-friendly button with keyboard focus management
 */

import { useRef, useEffect } from 'react';
import './FocusableButton.css';

const FocusableButton = ({
  children,
  onSelect,
  isFocused,
  className = '',
  disabled = false,
  ...props
}) => {
  const ref = useRef();

  useEffect(() => {
    if (isFocused && ref.current && !disabled) {
      ref.current.focus();
    }
  }, [isFocused, disabled]);

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect();
    }
  };

  return (
    <button
      ref={ref}
      className={`focusable-button ${isFocused ? 'tv-focused' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      disabled={disabled}
      tabIndex={isFocused ? 0 : -1}
      {...props}
    >
      {children}
    </button>
  );
};

export default FocusableButton;

