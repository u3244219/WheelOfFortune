/**
 * Responsive Breakpoints
 * Centralized breakpoint definitions for consistent responsive design
 */

export const BREAKPOINTS = {
  mobile: {
    min: 320,
    max: 767
  },
  tablet: {
    min: 768,
    max: 1919
  },
  desktop: {
    min: 768,
    max: 2559
  },
  tv: {
    min: 2560, // Changed from 1920 to avoid IntelliJ/wide monitor false positives
    max: 4096
  }
};

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile.max}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet.min}px) and (max-width: ${BREAKPOINTS.tablet.max}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop.min}px)`,
  tv: `(min-width: ${BREAKPOINTS.tv.min}px)`
};

// Touch target sizes
export const TOUCH_TARGET = {
  mobile: 44, // iOS minimum
  tablet: 48,
  desktop: 36,
  tv: 80
};

