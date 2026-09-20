/**
 * Answer Lookup
 *
 * Fetches a picture and a one line explanation for the solved word, straight
 * from Wikipedia in the browser. No API key, no backend, no build step - the
 * MediaWiki API allows anonymous cross origin requests when you pass
 * origin=*, which is what makes this work from GitHub Pages.
 *
 * Results are cached in localStorage, so a word you have seen before appears
 * instantly and works offline the second time.
 */

import { lookupOverride } from '../data/answerOverrides';

const API = 'https://en.wikipedia.org/w/api.php';
const CACHE_PREFIX = 'wof.answer.v1.';
const CACHE_DAYS = 60;
const TIMEOUT_MS = 6000;

// Film posters and brand logos are copyrighted, so those categories get the
// explanation only.
const TEXT_ONLY_CATEGORIES = ['MOVIE', 'CANDY'];

// Extra words fed to Wikipedia search when the direct title lookup misses.
const SEARCH_HINT = {
  ANIMAL: 'animal',
  FRUIT_VEGETABLE: 'fruit vegetable plant',
  SWEET: 'dessert sweet food',
  DISH: 'dish food',
  CANDY: 'confectionery',
  COUNTRY: 'country',
  LOCATION_PLACE: 'place',
  MUSIC: 'musical instrument music',
  SPORT: 'sport',
  OCCUPATION: 'profession occupation',
  TECHNOLOGY: 'technology',
  GENERAL_ITEM: 'object',
  MOVIE: 'film',
};

/** PARROTFISH -> Parrotfish, SNOW LEOPARD -> Snow leopard */
const toTitle = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const readCache = (key) => {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    const ageDays = (Date.now() - entry.at) / 86400000;
    return ageDays > CACHE_DAYS ? null : entry.value;
  } catch (err) {
    return null;
  }
};

const writeCache = (key, value) => {
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ at: Date.now(), value })
    );
  } catch (err) {
    /* storage full or blocked - the lookup still worked for this round */
  }
};

const getJSON = async (params) => {
  const url = `${API}?${new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    ...params,
  })}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null; // offline, blocked, or too slow - the card copes without it
  } finally {
    clearTimeout(timer);
  }
};

const firstPage = (data) => {
  const pages = data && data.query && data.query.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page && !page.missing ? page : null;
};

const fetchByTitle = async (title) => {
  const data = await getJSON({
    titles: title,
    redirects: '1',
    prop: 'pageimages|extracts',
    piprop: 'thumbnail',
    pithumbsize: '600',
    exintro: '1',
    explaintext: '1',
    exsentences: '2',
  });
  return firstPage(data);
};

const searchTitle = async (word, category) => {
  const hint = SEARCH_HINT[category] || '';
  const data = await getJSON({
    list: 'search',
    srsearch: `${word.toLowerCase()} ${hint}`.trim(),
    srlimit: '1',
    srnamespace: '0',
  });
  const hit = data && data.query && data.query.search && data.query.search[0];
  return hit ? hit.title : null;
};

/** Only ever render images served by Wikimedia. */
const safeImage = (url) =>
  typeof url === 'string' && url.startsWith('https://upload.wikimedia.org/')
    ? url
    : null;

const trimBlurb = (extract, word) => {
  if (!extract) return '';
  const clean = extract.replace(/\s+/g, ' ').trim();
  const cut = clean.length > 240 ? `${clean.slice(0, 237).trim()}...` : clean;
  return cut.toUpperCase() === word ? '' : cut;
};

/**
 * Look up the solved word.
 *
 * Always resolves - on any failure you get { word, blurb: '', image: null },
 * and the reveal card simply shows the word on its own.
 */
export const lookupAnswer = async (word, category) => {
  const key = `${category}.${word}`.replace(/\s+/g, '_');
  const cached = readCache(key);
  if (cached) return cached;

  const override = lookupOverride(category, word) || {};
  const allowImage = !TEXT_ONLY_CATEGORIES.includes(category) && !override.noImage;

  let result = {
    word,
    blurb: override.blurb || '',
    image: allowImage ? safeImage(override.image) : null,
    sourceUrl: null,
  };

  // A hand written override with both parts needs no network call at all.
  if (result.blurb && (result.image || !allowImage)) {
    writeCache(key, result);
    return result;
  }

  let page = await fetchByTitle(override.wiki || toTitle(word));

  if (!page || (allowImage && !page.thumbnail && !page.extract)) {
    const found = await searchTitle(word, category);
    if (found) {
      const searched = await fetchByTitle(found);
      if (searched) page = searched;
    }
  }

  if (page) {
    result = {
      word,
      blurb: result.blurb || trimBlurb(page.extract, word),
      image: allowImage
        ? result.image || safeImage(page.thumbnail && page.thumbnail.source)
        : null,
      sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
        page.title.replace(/ /g, '_')
      )}`,
    };
  }

  // Only cache something worth keeping; a total miss is retried next time.
  if (result.blurb || result.image) writeCache(key, result);
  return result;
};

export default { lookupAnswer };
