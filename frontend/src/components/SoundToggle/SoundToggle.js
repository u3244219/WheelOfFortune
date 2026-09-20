/**
 * SoundToggle Component
 * Mute/unmute button for game sounds
 */

import React, { useState } from 'react';
import { toggleMute, isSoundMuted } from '../../utils/soundManager';
import './SoundToggle.css';

const SoundToggle = () => {
  const [muted, setMuted] = useState(isSoundMuted());

  const handleToggle = () => {
    const newMutedState = toggleMute();
    setMuted(newMutedState);
  };

  return (
    <button
      className={`sound-toggle ${muted ? 'muted' : 'unmuted'}`}
      onClick={handleToggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Click to unmute' : 'Click to mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
};

export default SoundToggle;

