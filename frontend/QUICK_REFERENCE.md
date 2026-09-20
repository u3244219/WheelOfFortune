# 📋 Quick Reference Card - Responsive Design
## Wheel of Fortune Multi-Device Support

---

## 🎯 DEVICE BREAKPOINTS

| Device | Screen Width | Strategy |
|--------|-------------|----------|
| 📱 Mobile | 320px - 767px | Slide-in panels, stacked layout |
| 💻 Laptop | 768px - 1919px | Full UI visible, grid layout |
| 📺 TV | 1920px+ | No dropdowns, D-pad navigation |

---

## 📦 ESSENTIAL LIBRARIES (Install First)

```bash
npm install react-responsive        # Device detection ⭐
npm install framer-motion          # Animations ⭐
npm install @headlessui/react      # Accessible components
npm install react-swipeable        # Mobile swipe gestures
npm install react-confetti         # Celebration effects
```

**Estimated Bundle Size**: ~300KB gzipped (acceptable)

---

## 🔑 KEY PROBLEMS & SOLUTIONS

### Problem 1: Select Dropdowns Don't Work on TV
❌ **Current**: `<select>` dropdown for player count  
✅ **Solution**: Button grid navigable with arrow keys

**Code**:
```javascript
// TV-Friendly Button Grid
<div className="player-count-grid">
  {[1,2,3,4,5,6].map(num => (
    <FocusableButton onSelect={() => setNumPlayers(num)}>
      {num}
    </FocusableButton>
  ))}
</div>
```

### Problem 2: Mobile Screen Too Small
❌ **Current**: All UI visible, cramped  
✅ **Solution**: Slide-in bottom sheet for scoreboard

**Code**:
```javascript
<MobileDrawer isOpen={showScoreboard} onClose={closeScoreboard}>
  <Scoreboard />
</MobileDrawer>
```

### Problem 3: TV Text Too Small
❌ **Current**: 16px base font  
✅ **Solution**: 3x larger fonts for TV (32px+ base)

**CSS**:
```css
@media (min-width: 1920px) {
  :root {
    --font-base: 32px;
    --font-xl: 48px;
  }
}
```

---

## 🏗️ COMPONENT ADAPTATION PATTERN

### Pattern 1: Device-Specific Components
```javascript
import { useDevice } from './contexts/DeviceContext'

const Scoreboard = () => {
  const { isMobile, isTV } = useDevice()
  
  if (isMobile) return <ScoreboardMobile />
  if (isTV) return <ScoreboardTV />
  return <ScoreboardDesktop />
}
```

### Pattern 2: Conditional Rendering
```javascript
const PlayerSetup = () => {
  const { isTV } = useDevice()
  
  return (
    <div>
      {isTV ? (
        <PlayerCountGrid />  // Button grid
      ) : (
        <select />           // Dropdown
      )}
    </div>
  )
}
```

---

## 🎨 CSS APPROACH

### Mobile First + CSS Variables
```css
:root {
  --spacing: 8px;    /* Mobile */
  --font-base: 16px;
}

@media (min-width: 1920px) {
  :root {
    --spacing: 24px;   /* TV */
    --font-base: 32px;
  }
}

.button {
  padding: var(--spacing);
  font-size: var(--font-base);
}
```

---

## 🎮 TV NAVIGATION SYSTEM

### Keyboard Arrow Key Handler
```javascript
useKeyboardNavigation({
  onUp: () => moveFocus('up'),
  onDown: () => moveFocus('down'),
  onLeft: () => moveFocus('left'),
  onRight: () => moveFocus('right'),
  onEnter: () => selectCurrentItem(),
  onBack: () => goBack()
})
```

### Focus Styling
```css
.tv-button:focus {
  outline: 8px solid #FFD700;
  outline-offset: 6px;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}
```

---

## 📱 MOBILE GESTURES

### Swipe to Open/Close
```javascript
import { useSwipeable } from 'react-swipeable'

const handlers = useSwipeable({
  onSwipedUp: () => openScoreboard(),
  onSwipedDown: () => closeScoreboard()
})

<div {...handlers}>Swipe me!</div>
```

---

## 🎬 ANIMATIONS

### Slide-In Panel
```javascript
import { motion } from 'framer-motion'

<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring' }}
>
  <Panel />
</motion.div>
```

### Letter Flip Animation
```javascript
<motion.div
  animate={{ rotateY: revealed ? 0 : 180 }}
  transition={{ duration: 0.6 }}
>
  {letter}
</motion.div>
```

---

## ✅ TESTING CHECKLIST

### Mobile (iPhone 12: 390x844)
- [ ] Buttons ≥ 44x44px
- [ ] No horizontal scroll
- [ ] Swipe gestures work
- [ ] Bottom sheet appears

### Desktop (1920x1080)
- [ ] All UI visible
- [ ] Hover states work
- [ ] Select dropdowns functional

### TV (1920x1080 keyboard only)
- [ ] Arrow keys navigate
- [ ] Enter selects
- [ ] Focus always visible
- [ ] No dropdowns

---

## 🚀 4-WEEK TIMELINE

**Week 1**: Install libraries, create DeviceContext  
**Week 2**: Mobile slide-in panels  
**Week 3**: TV keyboard navigation  
**Week 4**: Animations & polish

---

## 📚 DOCUMENTATION

**Full Analysis**: `RESPONSIVE_DESIGN_ANALYSIS.md` (40+ pages)  
**Implementation**: `IMPLEMENTATION_GUIDE.md` (Step-by-step)  
**This Card**: Quick reference for daily use

---

## 🎯 CRITICAL CHANGES

| Component | Mobile | Laptop | TV |
|-----------|--------|--------|-----|
| PlayerSetup | Full screen | Modal | No `<select>` |
| Scoreboard | Bottom sheet | Sidebar | Always visible |
| CategorySelector | Vertical cards | Dropdown | Button grid |
| Keyboard | Large buttons | Normal | Extra large |

---

## 💡 QUICK WINS

**Easy Fixes (1-2 hours each)**:
1. Add DeviceContext wrapper
2. Create FocusableButton component
3. Add CSS variables for responsive sizing
4. Replace one `<select>` with button grid

**High Impact**:
1. Mobile bottom sheet for scoreboard
2. TV focus styling
3. Larger fonts for TV

---

## 🆘 COMMON ISSUES

**Issue**: `useDevice` undefined  
**Fix**: Wrap App in `<DeviceProvider>`

**Issue**: Animations don't work  
**Fix**: Check framer-motion installed

**Issue**: TV focus not visible  
**Fix**: Add `.tv-focused` class with gold outline

---

**Status**: ✅ Ready to implement  
**Estimated Time**: 4 weeks (full implementation)  
**Quick Start**: Follow IMPLEMENTATION_GUIDE.md Step 1

---

**Print this card and keep it handy!** 📌

