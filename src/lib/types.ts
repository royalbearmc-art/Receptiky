export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  text: string;
  timer_minutes: number | null;
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface CalendarEntry {
  id: string;
  user_id: string;
  recipe_id: string;
  date: string; // YYYY-MM-DD
  meal_slot: MealSlot;
  recipe?: Recipe;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  cached_macros: Macros | null;
  created_at: string;
  updated_at: string;
}
