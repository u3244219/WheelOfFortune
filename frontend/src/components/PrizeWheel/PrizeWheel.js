/**
 * PrizeWheel Component
 * Displays a spinning wheel to determine the multiplier before guessing a letter
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '../../contexts/DeviceContext';
import SoundEffects from '../../utils/soundManager';
import './PrizeWheel.css';

const PrizeWheel = ({ onSpinComplete, playerName }) => {
  const { isMobile, isTV } = useDevice();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeWon, setPrizeWon] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);

  // Wheel values, as on the show: what each letter is worth this spin.
  // Arranged so that high and low values sit next to each other.
  const prizes = useMemo(() => [
    { value: 300, color: '#FF6B6B', dark: false },
    { value: 600, color: '#4ECDC4', dark: true },
    { value: 200, color: '#45B7D1', dark: false },
    { value: 900, color: '#FFA07A', dark: true },
    { value: 400, color: '#98D8C8', dark: true },
    { value: 150, color: '#F7DC6F', dark: true },
    { value: 700, color: '#BB8FCE', dark: false },
    { value: 250, color: '#52D726', dark: true },
    { value: 500, color: '#85C1E2', dark: true },
    { value: 1000, color: '#F8B739', dark: true },
    { value: 350, color: '#FFD700', dark: true },
    { value: 800, color: '#FF8C94', dark: false }
  ].map(p => ({ ...p, label: String(p.value) })), []);

  const segmentAngle = 360 / prizes.length; // 30 degrees per segment

  const handleSpin = () => {
    if (isSpinning) {
      return;
    }

    setIsSpinning(true);

    // 🔊 Play wheel spinning sounds
    SoundEffects.wheelStartSpin();

    // Random spins: 5-8 full rotations + align to CENTER of segment
    const fullRotations = 5 + Math.floor(Math.random() * 4);
    const randomSegment = Math.floor(Math.random() * prizes.length);

    // Add half segment angle to point to CENTER of segment, not edge
    const segmentCenter = randomSegment * segmentAngle + (segmentAngle / 2);
    const finalRotation = fullRotations * 360 + segmentCenter;

    setRotation(finalRotation);

    // Calculate winning prize - pointer at top (0 degrees)
    const normalizedRotation = finalRotation % 360;
    // Convert rotation to winning index (clockwise)
    const winningIndex = Math.floor(((360 - normalizedRotation) / segmentAngle)) % prizes.length;
    const wonPrize = prizes[winningIndex];


    // 🔊 Realistic variable tempo wheel ticking (like a real game show wheel!)
    const spinDuration = 4000; // 4 seconds total
    const startTime = Date.now();
    let lastTickTime = startTime;
    let tickCount = 0;

    const scheduleNextTick = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / spinDuration;

      // Stop if spin is complete
      if (elapsed >= spinDuration) {
        return;
      }

      // Deceleration curve: exponential ease-out
      // Starts fast (30ms), ends slow (250ms)
      const minInterval = 30;  // Fast at start
      const maxInterval = 250; // Slow at end
      const currentInterval = minInterval + (maxInterval - minInterval) * Math.pow(progress, 2.5);

      // Check if enough time has passed for next tick
      const timeSinceLastTick = Date.now() - lastTickTime;

      if (timeSinceLastTick >= currentInterval) {
        // Play tick sound
        SoundEffects.wheelTick();
        lastTickTime = Date.now();
        tickCount++;
      }

      // Schedule next frame
      requestAnimationFrame(scheduleNextTick);
    };

    // Start the ticking animation
    requestAnimationFrame(scheduleNextTick);

    // Show result after spin completes
    setTimeout(() => {
      setIsSpinning(false);
      setPrizeWon(wonPrize.value);
      setShowResult(true);

      // 🔊 Play win sound based on multiplier
      SoundEffects.bigWin(wonPrize.value);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowResult(false);
        setTimeout(() => {
          onSpinComplete(wonPrize.value);
        }, 300);
      }, 2000);
    }, spinDuration);
  };

  // Auto-spin on component mount
  useEffect(() => {
    // Small delay to allow dialog animation to complete first
    const timer = setTimeout(() => {
      handleSpin();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array means only run on mount

  const wheelSize = isMobile ? 280 : isTV ? 600 : 400;

  return (
    <div className={`prize-wheel-overlay ${isTV ? 'tv-mode' : ''}`}>
      <motion.div
        className="prize-wheel-container"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <div className="wheel-header">
          <h2>🎡 Spin the Wheel!</h2>
          {playerName && <p className="player-turn">{playerName}'s Turn</p>}
        </div>

        <div className="wheel-wrapper">
          {/* Pointer at top */}
          <div className="wheel-pointer">▼</div>

          {/* The Wheel */}
          <motion.div
            ref={wheelRef}
            className="wheel"
            style={{ width: wheelSize, height: wheelSize }}
            animate={{ rotate: rotation }}
            transition={{
              duration: 4,
              ease: [0.17, 0.67, 0.35, 0.96]
            }}
          >
            <svg width={wheelSize} height={wheelSize} viewBox="0 0 400 400">
              {prizes.map((prize, index) => {
                const startAngle = index * segmentAngle - 90; // -90 to start at top
                const endAngle = startAngle + segmentAngle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 200 + 190 * Math.cos(startRad);
                const y1 = 200 + 190 * Math.sin(startRad);
                const x2 = 200 + 190 * Math.cos(endRad);
                const y2 = 200 + 190 * Math.sin(endRad);

                // Text position (middle of segment)
                const textAngle = startAngle + segmentAngle / 2;
                const textRad = (textAngle * Math.PI) / 180;
                const textX = 200 + 130 * Math.cos(textRad);
                const textY = 200 + 130 * Math.sin(textRad);

                return (
                  <g key={index}>
                    <path
                      d={`M 200,200 L ${x1},${y1} A 190,190 0 0,1 ${x2},${y2} Z`}
                      fill={prize.color}
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={prize.dark ? '#000' : '#fff'}
                      fontSize={isMobile ? '20' : isTV ? '40' : '28'}
                      fontWeight="900"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
              {/* Center circle */}
              <circle cx="200" cy="200" r="40" fill="#333" stroke="#FFD700" strokeWidth="4" />
              <text x="200" y="205" textAnchor="middle" fill="#FFD700" fontSize="20" fontWeight="bold">
                SPIN
              </text>
            </svg>
          </motion.div>
        </div>

        <AnimatePresence>
          {showResult && prizeWon && (
            <motion.div
              className="prize-result"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <div className="prize-value">{prizeWon}</div>
              <div className="prize-label">per letter!</div>
            </motion.div>
          )}
        </AnimatePresence>


        <div className="wheel-instructions">
          <p>Spin to see what your letter is worth!</p>
          <p className="multiplier-hint">Every time the letter appears, you win that much again</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrizeWheel;

