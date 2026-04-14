import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { sanitizeRecipe } from './sanitize';
import { deleteRecipeImage } from './uploadImage';
import type { Recipe } from './types';

interface RecipesCtx {
  recipes: Recipe[];
  loading: boolean;
  updateRecipe: (updated: Recipe) => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
}

const RecipesContext = createContext<RecipesCtx | null>(null);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!mounted) return;
      setRecipes((data as Recipe[] | null) ?? []);
      setLoading(false);
    };

    load();

    // Refetch whenever the session changes (sign-in / sign-out).
    const { data: sub } = supabase.auth.onAuthStateChange((_event) => {
      if (!mounted) return;
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const updateRecipe = async (updated: Recipe) => {
    const clean = sanitizeRecipe(updated);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('recipes')
      .update({ ...clean, updated_at: now })
      .eq('id', updated.id);
    if (error) throw error;
    setRecipes((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...updated, ...clean, updated_at: now } : r))
    );
  };

  const addRecipe = async (recipe: Recipe): Promise<Recipe> => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) throw new Error('Nie si prihlásený.');

    const clean = sanitizeRecipe(recipe);
    const now = new Date().toISOString();
    const payload = {
      ...clean,
      user_id: user.id,
      created_at: now,
      updated_at: now,
    };
    const { data, error } = await supabase
      .from('recipes')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    const saved = data as Recipe;
    setRecipes((prev) => [saved, ...prev]);
    return saved;
  };

  const deleteRecipe = async (id: string) => {
    // Look up the recipe in local state so we can tidy up its photo in Storage.
    const target = recipes.find((r) => r.id === id);

    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) throw error;

    // Best-effort photo cleanup. Row deletion is the source of truth;
    // a stale photo is tolerable, a failed deletion is not.
    if (target?.photo_url) {
      await deleteRecipeImage(target.photo_url);
    }

    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RecipesContext.Provider value={{ recipes, loading, updateRecipe, addRecipe, deleteRecipe }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used inside RecipesProvider');
  return ctx;
}
