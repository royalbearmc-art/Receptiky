import type { Recipe, Ingredient, Step } from './types';

/* ── limits ── */
const LIMITS = {
  title: 120,
  description: 800,
  tag: 40,
  tags: 20,
  ingredientName: 100,
  ingredientAmount: 20,
  ingredientUnit: 30,
  ingredients: 60,
  stepText: 1200,
  steps: 40,
  timerMinutes: 1440, // 24 h max
  photoUrlBytes: 3 * 1024 * 1024, // 3 MB base64
};

/* strip every HTML/script tag and null bytes */
function stripHtml(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\0/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function clampStr(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return stripHtml(value).slice(0, max);
}

function sanitizeIngredient(raw: unknown): Ingredient {
  const ing = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    name:   clampStr(ing.name,   LIMITS.ingredientName),
    amount: clampStr(ing.amount, LIMITS.ingredientAmount),
    unit:   clampStr(ing.unit,   LIMITS.ingredientUnit),
  };
}

function sanitizeStep(raw: unknown): Step {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const timer = Number(s.timer_minutes);
  return {
    text: clampStr(s.text, LIMITS.stepText),
    timer_minutes:
      s.timer_minutes === null || s.timer_minutes === undefined
        ? null
        : Number.isFinite(timer) && timer >= 0
        ? Math.min(Math.floor(timer), LIMITS.timerMinutes)
        : null,
  };
}

function sanitizePhotoUrl(url: unknown): string | null {
  if (url === null || url === undefined) return null;
  if (typeof url !== 'string') return null;

  // base64 data URL — check size
  if (url.startsWith('data:')) {
    if (url.length > LIMITS.photoUrlBytes) {
      console.warn('photo_url exceeds size limit, dropping');
      return null;
    }
    // only allow image mime types
    if (!/^data:image\/(jpeg|png|webp|gif);base64,/.test(url)) return null;
    return url;
  }

  // regular URL — basic validation
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.href.slice(0, 500);
  } catch {
    return null;
  }
}

export function sanitizeRecipe(raw: Partial<Recipe>): Omit<Recipe, 'id' | 'created_at' | 'updated_at'> {
  const title = clampStr(raw.title, LIMITS.title);
  if (!title) throw new Error('Recept musí mať názov.');

  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .slice(0, LIMITS.tags)
        .map((t) => clampStr(t, LIMITS.tag))
        .filter(Boolean)
    : [];

  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients.slice(0, LIMITS.ingredients).map(sanitizeIngredient)
    : [];

  const steps = Array.isArray(raw.steps)
    ? raw.steps.slice(0, LIMITS.steps).map(sanitizeStep)
    : [];

  return {
    title,
    description: raw.description ? clampStr(raw.description, LIMITS.description) || null : null,
    photo_url: sanitizePhotoUrl(raw.photo_url),
    tags,
    ingredients,
    steps,
  };
}
