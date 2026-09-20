/**
 * Answer overrides
 *
 * The reveal card looks answers up on Wikipedia at play time. Wikipedia is
 * right most of the time, but not always: some words are ambiguous (MOLE,
 * MOUSE, TURKEY), some have no article, and film posters are copyrighted so
 * we never show them.
 *
 * Add a fix here whenever you see a wrong or missing picture. Keys are
 * "CATEGORY:WORD", or just "WORD" to apply everywhere.
 *
 *   wiki   - the Wikipedia article title to use instead of the word
 *   image  - a direct image URL to use instead of whatever Wikipedia returns
 *   blurb  - a sentence to show instead of the Wikipedia one
 *   noImage- true to show the text only
 */

export const ANSWER_OVERRIDES = {
  // Ambiguous words - point them at the right article
  'ANIMAL:MOLE': { wiki: 'Mole (animal)' },
  'ANIMAL:CRANE': { wiki: 'Crane (bird)' },
  'ANIMAL:SEAL': { wiki: 'Pinniped' },
  'ANIMAL:BASS': { wiki: 'Bass (fish)' },
  'ANIMAL:TURKEY': { wiki: 'Domestic turkey' },
  'ANIMAL:KIWI': { wiki: 'Kiwi (bird)' },
  'ANIMAL:CARDINAL': { wiki: 'Northern cardinal' },
  'ANIMAL:CHICK': { wiki: 'Chicken' },
  'ANIMAL:GREAT WHITE': { wiki: 'Great white shark' },
  'ANIMAL:POISON DART': { wiki: 'Poison dart frog' },
  'ANIMAL:STICK BUG': { wiki: 'Phasmatodea' },
  'ANIMAL:MONITOR': { wiki: 'Monitor lizard' },
  'ANIMAL:BOA': { wiki: 'Boa constrictor' },
  'ANIMAL:CORAL': { wiki: 'Coral' },
  'ANIMAL:MANTIS': { wiki: 'Mantis' },
  'ANIMAL:SPONGE': { wiki: 'Sea sponge' },
  'ANIMAL:GRIZZLY': { wiki: 'Grizzly bear' },
  'ANIMAL:PUMA': { wiki: 'Cougar' },
  'ANIMAL:BUDGIE': { wiki: 'Budgerigar' },
  'ANIMAL:SNAIL SHELL': { wiki: 'Snail' },
  'FRUIT_VEGETABLE:KIWI': { wiki: 'Kiwifruit' },
  'FRUIT_VEGETABLE:DATE': { wiki: 'Date palm' },
  'FRUIT_VEGETABLE:CHIKOO': { wiki: 'Sapodilla' },
  'FRUIT_VEGETABLE:SHARIFA': { wiki: 'Sugar-apple' },
  'FRUIT_VEGETABLE:JAMUN': { wiki: 'Syzygium cumini' },
  'FRUIT_VEGETABLE:FALSA': { wiki: 'Grewia asiatica' },
  'FRUIT_VEGETABLE:AMLA': { wiki: 'Phyllanthus emblica' },
  'FRUIT_VEGETABLE:KINNOW': { wiki: 'Kinnow' },
  'FRUIT_VEGETABLE:MOSAMBI': { wiki: 'Citrus limetta' },
  'FRUIT_VEGETABLE:CORN': { wiki: 'Maize' },
  'FRUIT_VEGETABLE:BEANS': { wiki: 'Bean' },
  'FRUIT_VEGETABLE:PEAS': { wiki: 'Pea' },
  'FRUIT_VEGETABLE:PEPPER': { wiki: 'Bell pepper' },
  'FRUIT_VEGETABLE:SQUASH': { wiki: 'Cucurbita' },
  'FRUIT_VEGETABLE:TRUFFLE': { wiki: 'Truffle' },
  'FRUIT_VEGETABLE:BITTER GOURD': { wiki: 'Momordica charantia' },
  'FRUIT_VEGETABLE:BOTTLE GOURD': { wiki: 'Calabash' },
  'FRUIT_VEGETABLE:DRUMSTICK': { wiki: 'Moringa oleifera' },
  'FRUIT_VEGETABLE:GREEN MANGO': { wiki: 'Mango' },
  'SWEET:TRUFFLE': { wiki: 'Chocolate truffle' },
  'SWEET:SWEET POTATO': { wiki: 'Sweet potato pie' },
  'SWEET:JELLY': { wiki: 'Gelatin dessert' },
  'SWEET:CANDY FLOSS': { wiki: 'Cotton candy' },
  'SWEET:ICE LOLLY': { wiki: 'Ice pop' },
  'SWEET:SEVIYAN': { wiki: 'Sheer khurma' },
  'SWEET:PATISA': { wiki: 'Soan papdi' },
  'SWEET:RUSK': { wiki: 'Rusk' },
  'COUNTRY:UNITED ARAB EMIRATES': { wiki: 'United Arab Emirates' },
  'COUNTRY:CENTRAL AFRICAN': { wiki: 'Central African Republic' },
  'COUNTRY:SAINT VINCENT': { wiki: 'Saint Vincent and the Grenadines' },
  'COUNTRY:IVORY COAST': { wiki: 'Ivory Coast' },
  'COUNTRY:CONGO REPUBLIC': { wiki: 'Republic of the Congo' },
  'COUNTRY:TIMOR LESTE': { wiki: 'East Timor' },
};

export const lookupOverride = (category, word) =>
  ANSWER_OVERRIDES[`${category}:${word}`] || ANSWER_OVERRIDES[word] || null;

export default ANSWER_OVERRIDES;
