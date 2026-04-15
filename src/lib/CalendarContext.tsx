import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { CalendarEntry, MealSlot } from './types';

interface CalendarCtx {
  entries: CalendarEntry[];
  loading: boolean;
  addEntry: (recipeId: string, date: string, slot: MealSlot) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  entriesForDate: (date: string) => CalendarEntry[];
}

const CalendarContext = createContext<CalendarCtx | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('calendar_entries')
      .select('*, recipe:recipes(id, title, photo_url, cached_macros)')
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (data) setEntries(data as CalendarEntry[]);
        setLoading(false);
      });
  }, []);

  const addEntry = async (recipeId: string, date: string, slot: MealSlot) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error('Nie si prihlásený.');

    const { data, error } = await supabase
      .from('calendar_entries')
      .insert({ user_id: userId, recipe_id: recipeId, date, meal_slot: slot })
      .select('*, recipe:recipes(id, title, photo_url, cached_macros)')
      .single();

    if (error) throw error;
    setEntries((prev) => [...prev, data as CalendarEntry]);
  };

  const removeEntry = async (id: string) => {
    const { error } = await supabase.from('calendar_entries').delete().eq('id', id);
    if (error) throw error;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const entriesForDate = (date: string) =>
    entries.filter((e) => e.date === date);

  return (
    <CalendarContext.Provider value={{ entries, loading, addEntry, removeEntry, entriesForDate }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used inside CalendarProvider');
  return ctx;
}
