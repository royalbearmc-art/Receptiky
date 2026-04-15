export const config = { runtime: 'edge' };

const NUTRIENT_IDS = {
  calories: 1008,
  protein:  1003,
  fat:      1004,
  carbs:    1005,
  fiber:    1079,
};

interface Macros {
  calories: number;
  protein:  number;
  fat:      number;
  carbs:    number;
  fiber:    number;
}

type FoodNutrient = { nutrientId: number; value: number };
type OFFProduct   = { nutriments?: Record<string, number> };

async function fromUSDA(query: string): Promise<Macros | null> {
  try {
    const key = (process.env.VITE_USDA_API_KEY ?? 'DEMO_KEY') as string;
    const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
    url.searchParams.set('query', query);
    url.searchParams.set('api_key', key);
    url.searchParams.set('pageSize', '1');
    // pass dataType as separate params (more reliable than comma-separated)
    url.searchParams.append('dataType', 'SR Legacy');
    url.searchParams.append('dataType', 'Foundation');

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json() as { foods?: { foodNutrients?: FoodNutrient[] }[] };
    const food = data.foods?.[0];
    if (!food) return null;

    const get = (id: number) =>
      food.foodNutrients?.find((n) => n.nutrientId === id)?.value ?? 0;

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

async function fromOFF(query: string): Promise<Macros | null> {
  try {
    const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
    url.searchParams.set('search_terms', query);
    url.searchParams.set('search_simple', '1');
    url.searchParams.set('action', 'process');
    url.searchParams.set('json', '1');
    url.searchParams.set('page_size', '3');
    url.searchParams.set('fields', 'product_name,nutriments');

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json() as { products?: OFFProduct[] };

    const product = data.products?.find(
      (p) => p.nutriments?.['energy-kcal_100g'] != null
    );
    if (!product) return null;
    const n = product.nutriments!;

    return {
      calories: n['energy-kcal_100g']  ?? 0,
      protein:  n['proteins_100g']      ?? 0,
      fat:      n['fat_100g']           ?? 0,
      carbs:    n['carbohydrates_100g'] ?? 0,
      fiber:    n['fiber_100g']         ?? 0,
    };
  } catch {
    return null;
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET' } });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return new Response(JSON.stringify({ error: 'missing q' }), { status: 400, headers: CORS });
  }

  const macros = (await fromUSDA(q)) ?? (await fromOFF(q));
  return new Response(JSON.stringify(macros), { headers: CORS });
}
