/**
 * Device Context
 * Provides device type detection across the application
 */

import { createContext, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  // Define breakpoints - TV requires very large screen (2560px+) to avoid IntelliJ false positives
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 2559 });
  const isLargeScreen = useMediaQuery({ minWidth: 2560 });

  // TV mode: Only activate for VERY large screens (actual TVs, not just wide monitors)
  const isTV = isLargeScreen;
  const isDesktop = isTablet || isLargeScreen;

  const value = {
    isMobile,
    isTablet,
    isTV,
    isDesktop,
    deviceType: isMobile ? 'mobile' : isLargeScreen ? 'tv' : 'desktop'
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
};

