/**
 * MobileDrawer Component
 * Slide-in panel for mobile devices with swipe gestures
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import './MobileDrawer.css';

const MobileDrawer = ({
  isOpen,
  onClose,
  children,
  position = 'bottom' // 'bottom', 'left', 'right'
}) => {
  const handlers = useSwipeable({
    onSwipedDown: position === 'bottom' ? onClose : null,
    onSwipedLeft: position === 'right' ? onClose : null,
    onSwipedRight: position === 'left' ? onClose : null,
    preventScrollOnSwipe: true,
    trackMouse: false
  });

  const getInitialPosition = () => {
    switch(position) {
      case 'bottom': return { y: '100%' };
      case 'left': return { x: '-100%' };
      case 'right': return { x: '100%' };
      default: return { y: '100%' };
    }
  };

  const getAnimatePosition = () => {
    switch(position) {
      case 'bottom': return { y: isOpen ? 0 : '100%' };
      case 'left': return { x: isOpen ? 0 : '-100%' };
      case 'right': return { x: isOpen ? 0 : '100%' };
      default: return { y: isOpen ? 0 : '100%' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="drawer-backdrop"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            {...handlers}
            initial={getInitialPosition()}
            animate={getAnimatePosition()}
            exit={getInitialPosition()}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`mobile-drawer mobile-drawer-${position}`}
          >
            {position === 'bottom' && (
              <div className="drawer-handle">
                <div className="handle-bar" />
              </div>
            )}
            <div className="drawer-content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;

