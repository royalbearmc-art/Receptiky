/** Convert ingredient amount + unit → grams */

// weight per 1 piece for common "ks/pcs" ingredients
const PCS_WEIGHT_G: Record<string, number> = {
  egg: 55, eggs: 55,
  onion: 150, garlic: 5,
  apple: 180, pear: 170, banana: 120,
  lemon: 100, lime: 70, orange: 200,
  potato: 150, carrot: 80, tomato: 120,
  pepper: 160, zucchini: 200, cucumber: 300,
  peach: 150, plum: 60, apricot: 40,
};

const UNIT_TO_G: Record<string, number> = {
  // weight
  g: 1, gr: 1, gram: 1, gramy: 1, gramov: 1,
  kg: 1000, dkg: 10,
  mg: 0.001, oz: 28.35, lb: 453.6,
  // volume (approximate, water density)
  ml: 1, 'ml.': 1, dl: 100, l: 1000, liter: 1000, litre: 1000,
  // spoons
  lyžica: 15, lyžice: 15, lyžíc: 15, tbsp: 15, tbs: 15,
  lyžička: 5, lyžičky: 5, lyžičiek: 5, tsp: 5,
  // cups
  pohár: 240, šálka: 240, cup: 240,
  // pinch
  štipka: 0.5, špetka: 0.5, pinch: 0.5,
  // pieces — resolved per-ingredient below
  ks: null, kus: null, kúsok: null, pcs: null, piece: null, pieces: null,
};

export function toGrams(amount: string, unit: string, ingredientEn: string): number {
  const qty = parseFloat(amount.replace(',', '.'));
  if (isNaN(qty) || qty <= 0) return 0;

  const u = unit.trim().toLowerCase();
  const gPerUnit = UNIT_TO_G[u];

  if (gPerUnit === null) {
    // piece — look up per-ingredient weight
    const word = ingredientEn.split(' ')[0].toLowerCase();
    const pcsG = PCS_WEIGHT_G[word] ?? 50; // default 50g per piece
    return qty * pcsG;
  }

  if (gPerUnit !== undefined) return qty * gPerUnit;

  // unknown unit — assume grams
  return qty;
}
