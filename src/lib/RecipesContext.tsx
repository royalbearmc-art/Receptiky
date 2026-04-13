import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { sanitizeRecipe } from './sanitize';
import type { Recipe } from './types';

interface RecipesCtx {
  recipes: Recipe[];
  loading: boolean;
  updateRecipe: (updated: Recipe) => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<void>;
}

const RecipesContext = createContext<RecipesCtx | null>(null);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setRecipes(data as Recipe[]);
        setLoading(false);
      });
  }, []);

  const updateRecipe = async (updated: Recipe) => {
    const clean = sanitizeRecipe(updated);
    const now = new Date().toISOString();
    await supabase.from('recipes').update({ ...clean, updated_at: now }).eq('id', updated.id);
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? { ...updated, ...clean, updated_at: now } : r)));
  };

  const addRecipe = async (recipe: Recipe) => {
    const clean = sanitizeRecipe(recipe);
    const now = new Date().toISOString();
    const payload = { ...clean, created_at: now, updated_at: now };
    const { data } = await supabase.from('recipes').insert(payload).select().single();
    if (data) setRecipes((prev) => [data as Recipe, ...prev]);
  };

  return (
    <RecipesContext.Provider value={{ recipes, loading, updateRecipe, addRecipe }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used inside RecipesProvider');
  return ctx;
}
