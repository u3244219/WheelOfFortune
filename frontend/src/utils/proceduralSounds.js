/**
 * Sound File Generator
 * Generates simple procedural sounds using Web Audio API
 * This creates basic placeholder sounds until you add professional ones
 */

// Helper to create audio context
const createAudioContext = () => {
  return new (window.AudioContext || window.webkitAudioContext)();
};

// Helper to generate simple beep tone
const generateBeep = (frequency, duration, type = 'sine') => {
  const audioContext = createAudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Generate procedural sounds
export const ProceduralSounds = {
  // Pleasant ding (correct answer)
  letterCorrect: () => {
    generateBeep(800, 0.15, 'sine');
    setTimeout(() => generateBeep(1000, 0.1, 'sine'), 50);
  },

  // Buzzer (wrong answer)
  letterWrong: () => {
    generateBeep(200, 0.3, 'sawtooth');
  },

  // Click sound
  buttonClick: () => {
    generateBeep(600, 0.05, 'square');
  },

  // Letter flip
  letterFlip: () => {
    generateBeep(400, 0.08, 'triangle');
  },

  // Tick sound
  tick: () => {
    generateBeep(1200, 0.02, 'square');
  },

  // Victory fanfare (simple)
  victory: () => {
    generateBeep(523, 0.2, 'sine'); // C
    setTimeout(() => generateBeep(659, 0.2, 'sine'), 200); // E
    setTimeout(() => generateBeep(784, 0.3, 'sine'), 400); // G
  },

  // Sad trombone (bankrupt)
  sadTrombone: () => {
    generateBeep(400, 0.15, 'sawtooth');
    setTimeout(() => generateBeep(350, 0.15, 'sawtooth'), 150);
    setTimeout(() => generateBeep(300, 0.15, 'sawtooth'), 300);
    setTimeout(() => generateBeep(250, 0.3, 'sawtooth'), 450);
  },
};

export default ProceduralSounds;

