import { translateIngredient } from './skToEn';
import { toGrams } from './unitConvert';
import type { Ingredient, Macros } from './types';

const USDA_KEY = import.meta.env.VITE_USDA_API_KEY as string;

const NUTRIENT_IDS = {
  calories: 1008,
  protein:  1003,
  fat:      1004,
  carbs:    1005,
  fiber:    1079,
};

/* ── USDA search ── */
async function fetchUSDA(query: string): Promise<Macros | null> {
  try {
    const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
    url.searchParams.set('query', query);
    url.searchParams.set('api_key', USDA_KEY ?? 'DEMO_KEY');
    url.searchParams.set('dataType', 'SR Legacy,Foundation');
    url.searchParams.set('pageSize', '1');

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const food = data.foods?.[0];
    if (!food) return null;

    const get = (id: number) =>
      food.foodNutrients?.find((n: { nutrientId: number; value: number }) => n.nutrientId === id)?.value ?? 0;

    return {
      calories: get(NUTRIENT_IDS.calories),
      protein:  get(NUTRIENT_IDS.protein),
      fat:      get(NUTRIENT_IDS.fat),
      carbs:    get(NUTRIENT_IDS.carbs),
      fiber:    get(NUTRIENT_IDS.fiber),
    };
  } catch {
    return null;
  }
}

/* ── Open Food Facts fallback ── */
async function fetchOFF(query: string): Promise<Macros | null> {
  try {
    const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
    url.searchParams.set('search_terms', query);
    url.searchParams.set('search_simple', '1');
    url.searchParams.set('action', 'process');
    url.searchParams.set('json', '1');
    url.searchParams.set('page_size', '3');
    url.searchParams.set('fields', 'product_name,nutriments');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'Receptiky/1.0 (receptiky@example.com)' },
    });
    if (!res.ok) return null;
    const data = await res.json();

    // find first product with at least calories
    const product = data.products?.find(
      (p: { nutriments?: { 'energy-kcal_100g'?: number } }) =>
        p.nutriments?.['energy-kcal_100g'] != null
    );
    if (!product) return null;
    const n = product.nutriments;

    return {
      calories: n['energy-kcal_100g']   ?? 0,
      protein:  n['proteins_100g']       ?? 0,
      fat:      n['fat_100g']            ?? 0,
      carbs:    n['carbohydrates_100g']  ?? 0,
      fiber:    n['fiber_100g']          ?? 0,
    };
  } catch {
    return null;
  }
}

/* ── Per-ingredient macro fetch (per 100g) ── */
async function getMacrosPer100g(name: string): Promise<Macros | null> {
  const en = translateIngredient(name);
  const usda = await fetchUSDA(en);
  if (usda && usda.calories > 0) return usda;
  const off = await fetchOFF(en);
  return off;
}

/* ── Main pipeline: calculate total macros for a recipe ── */
export async function calculateRecipeMacros(ingredients: Ingredient[]): Promise<Macros> {
  const totals: Macros = { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 };

  await Promise.all(
    ingredients.map(async (ing) => {
      if (!ing.name.trim()) return;
      const en = translateIngredient(ing.name);
      const grams = toGrams(ing.amount, ing.unit, en);
      if (grams <= 0) return;

      const per100 = await getMacrosPer100g(ing.name);
      if (!per100) return;

      const factor = grams / 100;
      totals.calories += (per100.calories ?? 0) * factor;
      totals.protein  += (per100.protein  ?? 0) * factor;
      totals.fat      += (per100.fat      ?? 0) * factor;
      totals.carbs    += (per100.carbs    ?? 0) * factor;
      totals.fiber    += (per100.fiber    ?? 0) * factor;
    })
  );

  // round to 1 decimal
  return {
    calories: Math.round(totals.calories),
    protein:  Math.round(totals.protein  * 10) / 10,
    fat:      Math.round(totals.fat      * 10) / 10,
    carbs:    Math.round(totals.carbs    * 10) / 10,
    fiber:    Math.round(totals.fiber    * 10) / 10,
  };
}
