/**
 * Who plays
 *
 * The family roster is shown as cards you pick from, rather than typing names
 * in every time. Players added on the night are kept in the browser, so the
 * television remembers them without anything being committed here.
 */

export const DEFAULT_PLAYERS = [
  { id: 'adeen', name: 'Adeen', avatar: '🦁', color: '#3b82f6' },
  { id: 'bareerah', name: 'Bareerah', avatar: '🦄', color: '#ec4899' },
  { id: 'shahwar', name: 'Shahwar', avatar: '🐯', color: '#f59e0b' },
];

/** Avatars handed out to players added later, in order. */
export const AVATAR_POOL = ['🦊', '🐼', '🐸', '🦉', '🐙', '🦖', '🐧', '🐨', '🦋', '🐢'];

export const AVATAR_COLORS = [
  '#22c55e', '#8b5cf6', '#06b6d4', '#ef4444',
  '#14b8a6', '#f97316', '#a855f7', '#0ea5e9',
];

const ROSTER_KEY = 'wof.roster.v1';
const SELECTION_KEY = 'wof.selection.v1';

const read = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    /* private mode or full storage - the game still works for tonight */
  }
};

/** The three defaults plus anyone added on this device. */
export const loadRoster = () => {
  const extra = read(ROSTER_KEY);
  if (!Array.isArray(extra)) return DEFAULT_PLAYERS;
  const valid = extra.filter(
    (p) => p && typeof p.name === 'string' && p.name.trim() && !DEFAULT_PLAYERS.some((d) => d.id === p.id)
  );
  return [...DEFAULT_PLAYERS, ...valid];
};

export const saveRoster = (roster) =>
  write(ROSTER_KEY, roster.filter((p) => !DEFAULT_PLAYERS.some((d) => d.id === p.id)));

export const loadSelection = () => {
  const saved = read(SELECTION_KEY);
  return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
};

export const saveSelection = (ids) => write(SELECTION_KEY, ids);

/** Build a player for a name typed in tonight. */
export const makePlayer = (name, index) => ({
  id: `custom-${Date.now()}-${index}`,
  name: name.trim().slice(0, 16),
  avatar: AVATAR_POOL[index % AVATAR_POOL.length],
  color: AVATAR_COLORS[index % AVATAR_COLORS.length],
});

export default DEFAULT_PLAYERS;
