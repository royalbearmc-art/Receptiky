export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  text: string;
  timer_minutes: number | null;
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
