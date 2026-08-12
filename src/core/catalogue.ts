import { pence } from './money';
import type { Category, ModifierGroup, Product } from './types';

/** Demo estate: a gastropub. Enough breadth to exercise every VAT path. */

/**
 * A curated palette rather than rotated hues: these are picked to stay
 * distinguishable from one another on a cheap POS panel, and to hold up against
 * both a white and a near-black background.
 */
export const categories: Category[] = [
  { id: 'draught', name: 'Draught', colour: '#c08328' },
  { id: 'wine', name: 'Wine', colour: '#a03a55' },
  { id: 'spirits', name: 'Spirits', colour: '#6f52a8' },
  { id: 'soft', name: 'Soft & Hot', colour: '#1f7f96' },
  { id: 'small', name: 'Small Plates', colour: '#5f8438' },
  { id: 'mains', name: 'Mains', colour: '#c05a2e' },
  { id: 'sides', name: 'Sides', colour: '#3d8460' },
  { id: 'puds', name: 'Puddings', colour: '#b04a86' },
  { id: 'deli', name: 'Deli Counter', colour: '#96762a' },
];

export const modifierGroups: ModifierGroup[] = [
  {
    id: 'steak_temp',
    name: 'Cooked how?',
    min: 1,
    max: 1,
    options: [
      { id: 'blue', name: 'Blue', priceDelta: 0 },
      { id: 'rare', name: 'Rare', priceDelta: 0 },
      { id: 'medium_rare', name: 'Medium rare', priceDelta: 0, default: true },
      { id: 'medium', name: 'Medium', priceDelta: 0 },
      { id: 'well', name: 'Well done', priceDelta: 0 },
    ],
  },
  {
    id: 'steak_sauce',
    name: 'Sauce',
    min: 0,
    max: 2,
    options: [
      { id: 'peppercorn', name: 'Peppercorn', priceDelta: pence(2.5) },
      { id: 'bearnaise', name: 'Béarnaise', priceDelta: pence(2.5) },
      { id: 'blue_cheese', name: 'Blue cheese', priceDelta: pence(3.0) },
      { id: 'no_sauce', name: 'No sauce', priceDelta: 0 },
    ],
  },
  {
    id: 'burger_extras',
    name: 'Extras',
    min: 0,
    max: 4,
    options: [
      { id: 'bacon', name: 'Smoked bacon', priceDelta: pence(2.0) },
      { id: 'cheese', name: 'Extra cheese', priceDelta: pence(1.5) },
      { id: 'jalapenos', name: 'Jalapeños', priceDelta: pence(1.0) },
      { id: 'no_pickle', name: 'No pickle', priceDelta: 0 },
      { id: 'gf_bun', name: 'Gluten-free bun', priceDelta: pence(1.0) },
    ],
  },
  {
    id: 'milk',
    name: 'Milk',
    min: 1,
    max: 1,
    options: [
      { id: 'whole', name: 'Whole', priceDelta: 0, default: true },
      { id: 'semi', name: 'Semi-skimmed', priceDelta: 0 },
      { id: 'oat', name: 'Oat', priceDelta: pence(0.4) },
      { id: 'almond', name: 'Almond', priceDelta: pence(0.4) },
      { id: 'none_milk', name: 'No milk', priceDelta: 0 },
    ],
  },
  {
    id: 'coffee_size',
    name: 'Size',
    min: 1,
    max: 1,
    options: [
      { id: 'reg', name: 'Regular', priceDelta: 0, default: true },
      { id: 'large', name: 'Large', priceDelta: pence(0.6) },
    ],
  },
  {
    id: 'wine_measure',
    name: 'Measure',
    min: 1,
    max: 1,
    options: [
      // Weights & Measures: wine must be served in prescribed quantities.
      { id: 'w125', name: '125ml', priceDelta: pence(-1.8) },
      { id: 'w175', name: '175ml', priceDelta: 0, default: true },
      { id: 'w250', name: '250ml', priceDelta: pence(2.4) },
      { id: 'bottle', name: 'Bottle', priceDelta: pence(14.0) },
    ],
  },
  {
    id: 'spirit_measure',
    name: 'Measure',
    min: 1,
    max: 1,
    options: [
      { id: 's25', name: '25ml', priceDelta: 0, default: true },
      { id: 's50', name: '50ml (double)', priceDelta: pence(2.2) },
    ],
  },
  {
    id: 'mixer',
    name: 'Mixer',
    min: 0,
    max: 1,
    options: [
      { id: 'tonic', name: 'Tonic', priceDelta: pence(1.6) },
      { id: 'slim_tonic', name: 'Slimline tonic', priceDelta: pence(1.6) },
      { id: 'coke', name: 'Coke', priceDelta: pence(1.6) },
      { id: 'soda', name: 'Soda', priceDelta: pence(1.2) },
      { id: 'neat', name: 'Neat', priceDelta: 0 },
    ],
  },
  {
    id: 'pint_half',
    name: 'Serve',
    min: 1,
    max: 1,
    options: [
      { id: 'pint', name: 'Pint', priceDelta: 0, default: true },
      { id: 'half', name: 'Half', priceDelta: pence(-3.0) },
    ],
  },
];

export const products: Product[] = [
  // ---- Draught (alcohol: standard-rated on every channel) ----
  p('d1', 'Camden Hells', 'draught', 'alcohol', 6.2, { mods: ['pint_half'], station: 'bar', age: true }),
  p('d2', 'Guinness', 'draught', 'alcohol', 6.4, { mods: ['pint_half'], station: 'bar', age: true }),
  p('d3', 'Neck Oil IPA', 'draught', 'alcohol', 6.8, { mods: ['pint_half'], station: 'bar', age: true }),
  p('d4', 'Estrella Damm', 'draught', 'alcohol', 6.6, { mods: ['pint_half'], station: 'bar', age: true }),
  p('d5', 'Aspall Cyder', 'draught', 'alcohol', 6.0, { mods: ['pint_half'], station: 'bar', age: true }),
  p('d6', 'Vine Pale Ale', 'draught', 'alcohol', 5.9, { mods: ['pint_half'], station: 'bar', age: true }),

  // ---- Wine ----
  p('w1', 'Picpoul de Pinet', 'wine', 'alcohol', 8.5, { mods: ['wine_measure'], station: 'bar', age: true }),
  p('w2', 'Malbec Reserva', 'wine', 'alcohol', 9.2, { mods: ['wine_measure'], station: 'bar', age: true }),
  p('w3', 'Provence Rosé', 'wine', 'alcohol', 8.8, { mods: ['wine_measure'], station: 'bar', age: true }),
  p('w4', 'Prosecco', 'wine', 'alcohol', 7.5, { station: 'bar', age: true }),
  p('w5', 'House White', 'wine', 'alcohol', 6.9, { mods: ['wine_measure'], station: 'bar', age: true }),
  p('w6', 'House Red', 'wine', 'alcohol', 6.9, { mods: ['wine_measure'], station: 'bar', age: true }),

  // ---- Spirits ----
  p('s1', 'Tanqueray Gin', 'spirits', 'alcohol', 4.2, { mods: ['spirit_measure', 'mixer'], station: 'bar', age: true }),
  p('s2', 'Havana 3', 'spirits', 'alcohol', 4.0, { mods: ['spirit_measure', 'mixer'], station: 'bar', age: true }),
  p('s3', 'Monkey 47', 'spirits', 'alcohol', 6.5, { mods: ['spirit_measure', 'mixer'], station: 'bar', age: true }),
  p('s4', 'Talisker 10', 'spirits', 'alcohol', 6.8, { mods: ['spirit_measure', 'mixer'], station: 'bar', age: true }),
  p('s5', 'Espresso Martini', 'spirits', 'alcohol', 11.5, { station: 'bar', age: true }),
  p('s6', 'Negroni', 'spirits', 'alcohol', 10.5, { station: 'bar', age: true }),

  // ---- Soft & hot drinks ----
  // Soft drinks are standard-rated whatever the channel. Hot drinks are hot food.
  p('n1', 'Coke Zero', 'soft', 'confectionery', 3.2, { station: 'bar' }),
  p('n2', 'Still Water 750ml', 'soft', 'confectionery', 3.5, { station: 'bar' }),
  p('n3', 'Fresh Orange', 'soft', 'confectionery', 3.4, { station: 'bar' }),
  p('n4', 'Flat White', 'soft', 'hot_food', 3.6, { mods: ['coffee_size', 'milk'], station: 'bar', kcal: 120 }),
  p('n5', 'Cappuccino', 'soft', 'hot_food', 3.6, { mods: ['coffee_size', 'milk'], station: 'bar', kcal: 140 }),
  p('n6', 'Pot of Tea', 'soft', 'hot_food', 3.0, { station: 'bar', kcal: 15 }),

  // ---- Small plates (hot food) ----
  p('sm1', 'Padrón Peppers', 'small', 'hot_food', 7.5, { station: 'kitchen', kcal: 180, allergens: ['sulphites'] }),
  p('sm2', 'Salt & Pepper Squid', 'small', 'hot_food', 9.5, { station: 'kitchen', kcal: 340, allergens: ['molluscs', 'cereals', 'eggs'] }),
  p('sm3', 'Whipped Cod Roe', 'small', 'hot_food', 8.5, { station: 'kitchen', kcal: 290, allergens: ['fish', 'milk', 'cereals'] }),
  p('sm4', 'Croquetas (3)', 'small', 'hot_food', 8.0, { station: 'kitchen', kcal: 310, allergens: ['milk', 'cereals', 'eggs'] }),
  p('sm5', 'Burrata & Tomato', 'small', 'cold_food', 10.5, { station: 'kitchen', kcal: 260, allergens: ['milk'] }),
  p('sm6', 'Sourdough & Butter', 'small', 'hot_food', 4.5, { station: 'kitchen', kcal: 220, allergens: ['cereals', 'milk'] }),

  // ---- Mains ----
  p('m1', 'Dry-Aged Ribeye', 'mains', 'hot_food', 32.0, { mods: ['steak_temp', 'steak_sauce'], station: 'kitchen', kcal: 780 }),
  p('m2', 'Vine Burger', 'mains', 'hot_food', 17.5, { mods: ['burger_extras'], station: 'kitchen', kcal: 920, allergens: ['cereals', 'milk', 'eggs', 'mustard'] }),
  p('m3', 'Beer-Battered Haddock', 'mains', 'hot_food', 18.5, { station: 'kitchen', kcal: 860, allergens: ['fish', 'cereals'] }),
  p('m4', 'Roast Chicken & Chips', 'mains', 'hot_food', 19.0, { station: 'kitchen', kcal: 810 }),
  p('m5', 'Wild Mushroom Risotto', 'mains', 'hot_food', 16.5, { station: 'kitchen', kcal: 640, allergens: ['milk', 'sulphites'] }),
  p('m6', 'Pie of the Day', 'mains', 'hot_food', 18.0, { station: 'kitchen', kcal: 890, allergens: ['cereals', 'milk', 'eggs'] }),

  // ---- Sides ----
  p('sd1', 'Triple-Cooked Chips', 'sides', 'hot_food', 5.5, { station: 'kitchen', kcal: 420 }),
  p('sd2', 'Skin-On Fries', 'sides', 'hot_food', 4.5, { station: 'kitchen', kcal: 380 }),
  p('sd3', 'Tenderstem Broccoli', 'sides', 'hot_food', 5.5, { station: 'kitchen', kcal: 120 }),
  p('sd4', 'House Salad', 'sides', 'cold_food', 4.5, { station: 'kitchen', kcal: 110, allergens: ['mustard'] }),
  p('sd5', 'Buttered Greens', 'sides', 'hot_food', 5.0, { station: 'kitchen', kcal: 160, allergens: ['milk'] }),
  p('sd6', 'Peppercorn Sauce', 'sides', 'hot_food', 2.5, { station: 'kitchen', kcal: 130, allergens: ['milk'] }),

  // ---- Puddings ----
  p('pd1', 'Sticky Toffee', 'puds', 'hot_food', 8.5, { station: 'kitchen', kcal: 620, allergens: ['cereals', 'milk', 'eggs'] }),
  p('pd2', 'Basque Cheesecake', 'puds', 'cold_food', 8.0, { station: 'kitchen', kcal: 540, allergens: ['milk', 'eggs', 'cereals'] }),
  p('pd3', 'Affogato', 'puds', 'hot_food', 6.5, { station: 'bar', kcal: 280, allergens: ['milk'] }),
  p('pd4', 'Cheese Board', 'puds', 'cold_food', 12.5, { station: 'kitchen', kcal: 700, allergens: ['milk', 'cereals', 'sulphites'] }),

  // ---- Deli counter: the VAT demonstration ----
  // Cold food, zero-rated to take away, standard-rated eaten in. Delivery is
  // uplifted to absorb marketplace commission.
  p('dl1', 'Ham & Cheese Sandwich', 'deli', 'cold_food', 6.5, {
    station: 'kitchen', kcal: 480, allergens: ['cereals', 'milk', 'mustard'],
    byType: { delivery: pence(7.8) },
  }),
  p('dl2', 'Chicken Caesar Wrap', 'deli', 'cold_food', 7.0, {
    station: 'kitchen', kcal: 520, allergens: ['cereals', 'milk', 'eggs', 'fish'],
    byType: { delivery: pence(8.4) },
  }),
  p('dl3', 'Sausage Roll (hot)', 'deli', 'hot_food', 4.5, {
    station: 'kitchen', kcal: 390, allergens: ['cereals', 'milk', 'eggs'],
    byType: { delivery: pence(5.4) },
  }),
  p('dl4', 'Scotch Egg', 'deli', 'cold_food', 5.5, {
    station: 'kitchen', kcal: 430, allergens: ['eggs', 'cereals', 'mustard'],
  }),
  p('dl5', 'Sourdough Loaf', 'deli', 'zero', 4.0, { station: 'none', kcal: 1200, allergens: ['cereals'] }),
  p('dl6', 'Salted Crisps', 'deli', 'confectionery', 2.2, { station: 'none', kcal: 180 }),

  // Age-restricted non-alcohol example.
  p('dl7', 'Cigarettes 20s', 'deli', 'standard', 16.5, { station: 'none', age: true }),
  p('dl8', 'Brownie', 'deli', 'confectionery', 3.8, { station: 'none', kcal: 410, allergens: ['cereals', 'eggs', 'milk', 'nuts'] }),
];

function p(
  id: string,
  name: string,
  categoryId: string,
  vatClass: Product['vatClass'],
  price: number,
  opts: {
    mods?: string[];
    station?: Product['station'];
    kcal?: number;
    allergens?: Product['allergens'];
    age?: boolean;
    byType?: Product['priceByOrderType'];
  } = {},
): Product {
  return {
    id,
    name,
    categoryId,
    vatClass,
    price: pence(price),
    modifierGroupIds: opts.mods,
    station: opts.station ?? 'none',
    kcal: opts.kcal,
    allergens: opts.allergens,
    ageRestricted: opts.age,
    priceByOrderType: opts.byType,
    available: true,
  };
}

export const productById = new Map(products.map((x) => [x.id, x]));
export const modifierGroupById = new Map(modifierGroups.map((g) => [g.id, g]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));
