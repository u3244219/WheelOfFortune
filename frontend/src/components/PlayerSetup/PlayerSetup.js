/**
 * PlayerSetup
 *
 * Pick tonight's players from cards rather than typing names into boxes.
 * The family is there by default; anyone else can be added and is remembered
 * on this device. Everything is reachable with the arrow keys and Enter, so a
 * remote or a keyboard works as well as a mouse.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import {
  loadRoster,
  saveRoster,
  loadSelection,
  saveSelection,
  makePlayer,
} from '../../data/players';
import './PlayerSetup.css';

const ADD_CARD = '__add__';

const PlayerSetup = ({ onStartGame }) => {
  const [roster, setRoster] = useState(() => loadRoster());
  const [selectedIds, setSelectedIds] = useState(() => {
    const saved = loadSelection();
    const available = loadRoster().map((p) => p.id);
    const valid = saved.filter((id) => available.includes(id));
    return valid.length ? valid : [];
  });
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const gridRef = useRef(null);

  const cards = useMemo(() => [...roster.map((p) => p.id), ADD_CARD], [roster]);
  const selectedPlayers = roster.filter((p) => selectedIds.includes(p.id));

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  useEffect(() => {
    saveSelection(selectedIds);
  }, [selectedIds]);

  /** How many cards fit on a row right now - keeps arrow keys honest. */
  const columns = () => {
    const grid = gridRef.current;
    if (!grid) return 4;
    const style = window.getComputedStyle(grid);
    const count = style.gridTemplateColumns.split(' ').filter(Boolean).length;
    return Math.max(1, count);
  };

  const toggle = (id) => {
    setError('');
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const activate = (index) => {
    const id = cards[index];
    if (id === ADD_CARD) setAdding(true);
    else toggle(id);
  };

  const addPlayer = () => {
    const name = newName.trim();
    if (!name) {
      setAdding(false);
      return;
    }
    const clash = roster.some((p) => p.name.toLowerCase() === name.toLowerCase());
    if (clash) {
      setError(`${name} is already on the list`);
      return;
    }
    const player = makePlayer(name, roster.length);
    const next = [...roster, player];
    setRoster(next);
    saveRoster(next);
    setSelectedIds((prev) => [...prev, player.id]);
    setNewName('');
    setAdding(false);
    setError('');
  };

  const removePlayer = (id, event) => {
    event.stopPropagation();
    const next = roster.filter((p) => p.id !== id);
    setRoster(next);
    saveRoster(next);
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const start = () => {
    if (!selectedPlayers.length) {
      setError('Pick at least one player');
      return;
    }
    onStartGame(selectedPlayers.map((p) => p.name));
  };

  useKeyboardNavigation(
    {
      onLeft: () => setFocusIndex((i) => Math.max(0, i - 1)),
      onRight: () => setFocusIndex((i) => Math.min(cards.length - 1, i + 1)),
      onUp: () => setFocusIndex((i) => Math.max(0, i - columns())),
      onDown: () => setFocusIndex((i) => Math.min(cards.length - 1, i + columns())),
      onEnter: () => activate(focusIndex),
    },
    !adding
  );

  return (
    <div className="player-setup roster">
      <h2>Who is playing?</h2>

      <div className="roster-grid" ref={gridRef}>
        {roster.map((player, index) => {
          const isSelected = selectedIds.includes(player.id);
          const isFocused = focusIndex === index;
          const isCustom = player.id.startsWith('custom-');
          return (
            <button
              type="button"
              key={player.id}
              className={`roster-card${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}`}
              style={{ '--player-color': player.color }}
              onClick={() => {
                setFocusIndex(index);
                toggle(player.id);
              }}
              aria-pressed={isSelected}
            >
              <span className="roster-avatar" aria-hidden="true">{player.avatar}</span>
              <span className="roster-name">{player.name}</span>
              <span className="roster-check" aria-hidden="true">{isSelected ? '✓' : ''}</span>
              {isCustom && (
                <span
                  className="roster-remove"
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${player.name}`}
                  onClick={(e) => removePlayer(player.id, e)}
                >
                  ×
                </span>
              )}
            </button>
          );
        })}

        {adding ? (
          <div className="roster-card adding">
            <input
              ref={inputRef}
              className="roster-input"
              value={newName}
              maxLength={16}
              placeholder="Name"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addPlayer();
                if (e.key === 'Escape') {
                  setAdding(false);
                  setNewName('');
                }
              }}
            />
            <button type="button" className="roster-add-confirm" onClick={addPlayer}>
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`roster-card add-card${focusIndex === cards.length - 1 ? ' focused' : ''}`}
            onClick={() => {
              setFocusIndex(cards.length - 1);
              setAdding(true);
            }}
          >
            <span className="roster-avatar" aria-hidden="true">＋</span>
            <span className="roster-name">Add player</span>
          </button>
        )}
      </div>

      {error && <p className="roster-error">{error}</p>}

      <button
        type="button"
        onClick={start}
        className="start-game-button"
        disabled={!selectedPlayers.length}
      >
        {selectedPlayers.length
          ? `Play with ${selectedPlayers.map((p) => p.name).join(', ')} →`
          : 'Pick who is playing'}
      </button>
    </div>
  );
};

export default PlayerSetup;
