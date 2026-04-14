import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import Cover from './pages/Cover';
import RecipeLibrary from './pages/RecipeLibrary';
import RecipeDetail from './pages/RecipeDetail';
import RecipeDesignOptions from './pages/RecipeDesignOptions';
import SignIn from './pages/SignIn';
import Settings from './pages/Settings';
import ResetPassword from './pages/ResetPassword';
import { RecipesProvider } from './lib/RecipesContext';
import { LanguageProvider } from './lib/i18n';

const SHELL_STYLE: React.CSSProperties = {
  width: '100%',
  maxWidth: 430,
  minHeight: '100dvh',
  margin: '0 auto',
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <LanguageProvider>
        <div
          style={{
            ...SHELL_STYLE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAFEEB',
          }}
        >
          <p style={{ fontFamily: "'Alike', serif", color: '#686803', opacity: 0.5 }}>…</p>
        </div>
      </LanguageProvider>
    );
  }

  if (!session) {
    return (
      <LanguageProvider>
        <div style={SHELL_STYLE}>
          <SignIn />
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <RecipesProvider>
        <BrowserRouter>
          <div style={SHELL_STYLE}>
            <Routes>
              <Route path="/" element={<Cover />} />
              <Route path="/recipes" element={<RecipeLibrary />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/design-options" element={<RecipeDesignOptions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </RecipesProvider>
    </LanguageProvider>
  );
}
