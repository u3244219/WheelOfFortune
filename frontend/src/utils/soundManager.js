/**
 * Sound Manager
 * Centralized audio management with procedural sound fallback
 * Uses Web Audio API when MP3 files are not available
 */

import { Howl } from 'howler';

// Procedural sound generator using Web Audio API
const ProceduralSound = {
  context: null,

  getContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.context;
  },

  playBeep(frequency, duration, type = 'sine', volume = 0.3) {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  },

  // Specific procedural sounds
  buttonClick() {
    this.playBeep(600, 0.05, 'square', 0.2);
  },

  letterCorrect() {
    this.playBeep(800, 0.1, 'sine', 0.3);
    setTimeout(() => this.playBeep(1000, 0.08, 'sine', 0.25), 50);
  },

  letterWrong() {
    this.playBeep(200, 0.3, 'sawtooth', 0.25);
  },

  letterFlip() {
    this.playBeep(400, 0.08, 'triangle', 0.2);
  },

  wheelTick() {
    this.playBeep(1200, 0.02, 'square', 0.15);
  },

  puzzleSolved() {
    // 🎺 EPIC VICTORY FANFARE! 🎉
    // Triumphant brass-style celebration with ascending melody and chord finale

    // Opening flourish - Quick ascending notes
    this.playBeep(392, 0.08, 'square', 0.35); // G
    setTimeout(() => this.playBeep(440, 0.08, 'square', 0.35), 80); // A
    setTimeout(() => this.playBeep(494, 0.08, 'square', 0.35), 160); // B

    // Main melody - Triumphant ascending C major scale
    setTimeout(() => this.playBeep(523, 0.2, 'sine', 0.45), 300); // C
    setTimeout(() => this.playBeep(659, 0.2, 'sine', 0.45), 500); // E
    setTimeout(() => this.playBeep(784, 0.25, 'sine', 0.5), 700); // G
    setTimeout(() => this.playBeep(1047, 0.3, 'sine', 0.55), 950); // High C

    // Victory chord - Multiple notes together for rich sound
    setTimeout(() => {
      this.playBeep(523, 0.5, 'sine', 0.4);   // C
      this.playBeep(659, 0.5, 'sine', 0.4);   // E
      this.playBeep(784, 0.5, 'sine', 0.45);  // G
      this.playBeep(1047, 0.5, 'sine', 0.5);  // High C
    }, 1250);

    // Final triumphant high notes
    setTimeout(() => this.playBeep(1319, 0.15, 'sine', 0.5), 1800); // High E
    setTimeout(() => this.playBeep(1568, 0.25, 'sine', 0.55), 1950); // High G - finale!

    console.log('🎉🎺🎊 EPIC VICTORY FANFARE! Puzzle solved with style! 🏆✨');
  },

  gameOver() {
    this.playBeep(400, 0.15, 'sawtooth', 0.25);
    setTimeout(() => this.playBeep(350, 0.15, 'sawtooth', 0.25), 150);
    setTimeout(() => this.playBeep(300, 0.2, 'sawtooth', 0.25), 300);
  },

  bigWin() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playBeep(800 + i * 100, 0.15, 'sine', 0.3), i * 100);
    }
  }
};

// Track which sounds have loaded successfully
const soundsLoaded = {};

// Sound library - all sounds with error handling
const sounds = {
  wheelSpin: new Howl({
    src: ['/WheelOfFortune/sounds/wheel-spin.mp3'],
    volume: 0.5,
    loop: false,
    onload: () => { soundsLoaded.wheelSpin = true; },
    onloaderror: () => { soundsLoaded.wheelSpin = false; }
  }),

  wheelTick: new Howl({
    src: ['/WheelOfFortune/sounds/wheel-tick.mp3'],
    volume: 0.3,
    loop: true,
    onload: () => { soundsLoaded.wheelTick = true; },
    onloaderror: () => { soundsLoaded.wheelTick = false; }
  }),

  letterCorrect: new Howl({
    src: ['/WheelOfFortune/sounds/letter-correct.mp3'],
    volume: 0.6,
    onload: () => { soundsLoaded.letterCorrect = true; },
    onloaderror: () => { soundsLoaded.letterCorrect = false; }
  }),

  letterWrong: new Howl({
    src: ['/WheelOfFortune/sounds/letter-wrong.mp3'],
    volume: 0.5,
    onload: () => { soundsLoaded.letterWrong = true; },
    onloaderror: () => { soundsLoaded.letterWrong = false; }
  }),

  bankrupt: new Howl({
    src: ['/WheelOfFortune/sounds/bankrupt.mp3'],
    volume: 0.7,
    onload: () => { soundsLoaded.bankrupt = true; },
    onloaderror: () => { soundsLoaded.bankrupt = false; }
  }),

  puzzleSolved: new Howl({
    src: ['/WheelOfFortune/sounds/puzzle-solved.mp3'],
    volume: 0.6,
    onload: () => { soundsLoaded.puzzleSolved = true; },
    onloaderror: () => { soundsLoaded.puzzleSolved = false; }
  }),

  gameOver: new Howl({
    src: ['/WheelOfFortune/sounds/game-over.mp3'],
    volume: 0.5,
    onload: () => { soundsLoaded.gameOver = true; },
    onloaderror: () => { soundsLoaded.gameOver = false; }
  }),

  buttonClick: new Howl({
    src: ['/WheelOfFortune/sounds/button-click.mp3'],
    volume: 0.3,
    onload: () => { soundsLoaded.buttonClick = true; },
    onloaderror: () => { soundsLoaded.buttonClick = false; }
  }),

  letterFlip: new Howl({
    src: ['/WheelOfFortune/sounds/letter-flip.mp3'],
    volume: 0.4,
    onload: () => { soundsLoaded.letterFlip = true; },
    onloaderror: () => { soundsLoaded.letterFlip = false; }
  }),

  bigWin: new Howl({
    src: ['/WheelOfFortune/sounds/big-win.mp3'],
    volume: 0.7,
    onload: () => { soundsLoaded.bigWin = true; },
    onloaderror: () => { soundsLoaded.bigWin = false; }
  }),

  countdownTick: new Howl({
    src: ['/WheelOfFortune/sounds/countdown-tick.mp3'],
    volume: 0.4,
    onload: () => { soundsLoaded.countdownTick = true; },
    onloaderror: () => { soundsLoaded.countdownTick = false; }
  }),

  backgroundMusic: new Howl({
    src: ['/WheelOfFortune/sounds/background-music.mp3'],
    volume: 0.15,
    loop: true,
    onload: () => { soundsLoaded.backgroundMusic = true; },
    onloaderror: () => { soundsLoaded.backgroundMusic = false; }
  }),
};

// Sound manager state
let isMuted = false;
let masterVolume = 1.0;

// Load mute preference from localStorage
if (typeof window !== 'undefined') {
  const savedMute = localStorage.getItem('soundMuted');
  isMuted = savedMute === 'true';

  const savedVolume = localStorage.getItem('masterVolume');
  if (savedVolume) {
    masterVolume = parseFloat(savedVolume);
  }
}

/**
 * Play a sound effect with fallback to procedural sound
 * @param {string} soundName - Name of the sound to play
 * @param {object} options - Optional settings (volume, rate, etc.)
 */
export const playSound = (soundName, options = {}) => {
  if (isMuted) return;

  const sound = sounds[soundName];

  // If sound doesn't exist, use procedural fallback
  if (!sound) {
    console.warn(`Sound "${soundName}" not found, using procedural fallback`);
    if (ProceduralSound[soundName]) {
      ProceduralSound[soundName]();
    }
    return;
  }

  // Check if sound loaded successfully (empty MP3 files won't load)
  if (soundsLoaded[soundName] === false || sound.state() === 'unloaded') {
    console.log(`🔊 Using procedural sound for: ${soundName} (MP3 file empty or not loaded)`);
    // Use procedural sound as fallback
    if (ProceduralSound[soundName]) {
      ProceduralSound[soundName]();
    }
    return;
  }

  // Apply master volume
  const volume = (options.volume || sound._volume) * masterVolume;

  // Set options
  if (options.rate) sound.rate(options.rate);
  sound.volume(volume);

  // Play the sound
  try {
    sound.play();
    console.log(`🔊 Playing sound: ${soundName}`);
  } catch (error) {
    console.error(`Error playing ${soundName}:`, error);
    // Fallback to procedural
    if (ProceduralSound[soundName]) {
      ProceduralSound[soundName]();
    }
  }
};

/**
 * Stop a sound
 * @param {string} soundName - Name of the sound to stop
 */
export const stopSound = (soundName) => {
  const sound = sounds[soundName];
  if (sound) {
    sound.stop();
  }
};

/**
 * Pause a sound
 * @param {string} soundName - Name of the sound to pause
 */
export const pauseSound = (soundName) => {
  const sound = sounds[soundName];
  if (sound) {
    sound.pause();
  }
};

/**
 * Resume a sound
 * @param {string} soundName - Name of the sound to resume
 */
export const resumeSound = (soundName) => {
  const sound = sounds[soundName];
  if (sound) {
    sound.play();
  }
};

/**
 * Toggle mute all sounds
 */
export const toggleMute = () => {
  isMuted = !isMuted;

  if (typeof window !== 'undefined') {
    localStorage.setItem('soundMuted', isMuted.toString());
  }

  // Stop background music if muted
  if (isMuted) {
    stopSound('backgroundMusic');
  }

  console.log(`🔇 Sound ${isMuted ? 'muted' : 'unmuted'}`);
  return isMuted;
};

/**
 * Set master volume
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export const setMasterVolume = (volume) => {
  masterVolume = Math.max(0, Math.min(1, volume));

  if (typeof window !== 'undefined') {
    localStorage.setItem('masterVolume', masterVolume.toString());
  }

  console.log(`🔊 Master volume set to ${Math.round(masterVolume * 100)}%`);
};

/**
 * Get current mute state
 */
export const isSoundMuted = () => isMuted;

/**
 * Get master volume
 */
export const getMasterVolume = () => masterVolume;

/**
 * Preload all sounds (call this on app start)
 */
export const preloadSounds = () => {
  console.log('🔊 Preloading sound effects...');
  console.log('ℹ️ If MP3 files are empty, procedural sounds will be used as fallback');

  let loadedCount = 0;
  let failedCount = 0;

  Object.keys(sounds).forEach(soundName => {
    sounds[soundName].once('load', () => {
      loadedCount++;
      console.log(`✅ Loaded MP3: ${soundName}`);
    });
    sounds[soundName].once('loaderror', (id, error) => {
      failedCount++;
      console.log(`⚠️ MP3 failed (using procedural): ${soundName}`);
    });
  });

  // Check after 2 seconds
  setTimeout(() => {
    console.log(`📊 Sound Status: ${loadedCount} MP3s loaded, ${failedCount} using procedural fallback`);
    if (failedCount > 0) {
      console.log('💡 Tip: Add real MP3 files to public/sounds/ for better audio quality');
    }
  }, 2000);
};

// Game-specific sound helpers
export const SoundEffects = {
  // Wheel sounds
  wheelStartSpin: () => playSound('wheelSpin'),

  // Single tick sound (for variable tempo)
  wheelTick: () => {
    // Check if MP3 loaded, use it; otherwise use procedural
    if (soundsLoaded.wheelTick === false || !sounds.wheelTick) {
      if (!isMuted) ProceduralSound.wheelTick();
    } else {
      playSound('wheelTick');
    }
  },

  // Legacy ticking function (continuous loop - now deprecated for wheel)
  wheelTicking: (start = true) => {
    if (start) {
      // Check if MP3 loaded, otherwise use procedural ticking
      if (soundsLoaded.wheelTick === false) {
        // Use interval for procedural ticking
        if (!window.wheelTickInterval) {
          window.wheelTickInterval = setInterval(() => {
            if (!isMuted) ProceduralSound.wheelTick();
          }, 50); // Tick every 50ms
        }
      } else {
        playSound('wheelTick');
      }
    } else {
      // Stop ticking
      if (window.wheelTickInterval) {
        clearInterval(window.wheelTickInterval);
        window.wheelTickInterval = null;
      }
      stopSound('wheelTick');
    }
  },

  // Letter sounds
  correctLetter: () => playSound('letterCorrect'),
  wrongLetter: () => playSound('letterWrong'),
  flipLetter: (delay = 0) => {
    setTimeout(() => playSound('letterFlip'), delay);
  },

  // Game events
  bankrupt: () => playSound('bankrupt'),
  puzzleSolved: () => playSound('puzzleSolved'),
  gameOver: () => playSound('gameOver'),
  bigWin: (multiplier) => {
    // Play big win sound for 10x or higher
    if (multiplier >= 10) {
      playSound('bigWin');
    }
  },

  // UI sounds
  buttonClick: () => playSound('buttonClick'),
  countdownTick: () => playSound('countdownTick'),

  // Background music
  startBackgroundMusic: () => {
    if (!isMuted) {
      playSound('backgroundMusic');
    }
  },
  stopBackgroundMusic: () => stopSound('backgroundMusic'),
};

export default SoundEffects;

