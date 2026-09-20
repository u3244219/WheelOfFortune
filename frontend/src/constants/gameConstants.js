/**
 * Game Constants
 * Centralized constants for game configuration and rules
 */

export const GAME_CONSTANTS = {
  MAX_ATTEMPTS: 6,
  ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
};

export const GAME_STATUS = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  WON: 'WON',
  LOST: 'LOST',
};

export const CATEGORY_DISPLAY_NAMES = {
  LOCATION_PLACE: 'Location/Place',
  GENERAL_ITEM: 'General Item',
  FRUIT_VEGETABLE: 'Fruit/Vegetable',
  DISH: 'Dish',
  SWEET: 'Sweet',
  CANDY: 'Candy',
};

export default GAME_CONSTANTS;
