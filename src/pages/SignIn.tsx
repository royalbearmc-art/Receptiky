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
  const [showPassword, setShowPassword] = useState(false);

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
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('signin.password')}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            style={{
              fontFamily: "'Alike', serif",
              fontSize: 14,
              color: OLIVE,
              padding: '12px 44px 12px 16px',
              borderRadius: 27,
              border: `1px solid ${YELLOW}`,
              background: 'rgba(255,255,255,0.7)',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: OLIVE,
              opacity: showPassword ? 0.8 : 0.35,
              lineHeight: 1,
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              /* eye-off */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              /* eye */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

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
