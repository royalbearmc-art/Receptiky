import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useT } from '../lib/i18n';

const BG_GRADIENT =
  'linear-gradient(to top, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) bottom / 100% 76px no-repeat, #FAFEEB';

const OLIVE = '#686803';
const YELLOW = '#D9D95D';

type Mode = 'signin' | 'signup';

export default function SignIn() {
  const { t } = useT();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setError(t('signin.err.missing'));
      return;
    }
    if (password.length < 6) {
      setError(t('signin.err.short-password'));
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        // If email confirmation is ON, session is null and user must click link.
        if (!data.session) {
          setInfo(t('signin.info.confirm'));
        }
        // If confirmation is OFF, session exists and App.tsx will re-render into the app.
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('signin.err.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: BG_GRADIENT,
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
      }}
    >
      <h1
        style={{
          fontFamily: "'Srisakdi', cursive",
          fontSize: 40,
          lineHeight: '121.2%',
          letterSpacing: '0.01em',
          color: OLIVE,
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: 36,
        }}
      >
        {t('signin.title')}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('signin.email')}
          autoComplete="email"
          style={{
            fontFamily: "'Alike', serif",
            fontSize: 14,
            color: OLIVE,
            padding: '12px 16px',
            borderRadius: 27,
            border: `1px solid ${YELLOW}`,
            background: 'rgba(255,255,255,0.7)',
            outline: 'none',
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('signin.password')}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          style={{
            fontFamily: "'Alike', serif",
            fontSize: 14,
            color: OLIVE,
            padding: '12px 16px',
            borderRadius: 27,
            border: `1px solid ${YELLOW}`,
            background: 'rgba(255,255,255,0.7)',
            outline: 'none',
          }}
        />

        {error && (
          <p
            style={{
              fontFamily: "'Alike', serif",
              fontSize: 12,
              color: '#a33',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        {info && (
          <p
            style={{
              fontFamily: "'Alike', serif",
              fontSize: 12,
              color: OLIVE,
              textAlign: 'center',
              margin: 0,
            }}
          >
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 27,
            background: YELLOW,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Alike', serif",
            fontSize: 14,
            color: OLIVE,
            boxShadow: '0px 2px 5px 0px rgba(152,152,12,0.22)',
            opacity: loading ? 0.7 : 1,
            marginTop: 4,
          }}
        >
          {loading ? '…' : mode === 'signin' ? t('signin.submit.signin') : t('signin.submit.signup')}
        </button>
      </form>

      <button
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
          setError(null);
          setInfo(null);
        }}
        style={{
          marginTop: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Alike', serif",
          fontSize: 12,
          color: OLIVE,
          opacity: 0.7,
          textDecoration: 'underline',
        }}
      >
        {mode === 'signin' ? t('signin.toggle.to-signup') : t('signin.toggle.to-signin')}
      </button>
    </div>
  );
}
