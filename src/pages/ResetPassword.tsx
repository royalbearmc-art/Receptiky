import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useT } from '../lib/i18n';

const BG_GRADIENT =
  'linear-gradient(to top, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) bottom / 100% 76px no-repeat, #FAFEEB';

const OLIVE = '#686803';
const YELLOW = '#D9D95D';

export default function ResetPassword() {
  const { t } = useT();
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Supabase places a recovery token in the URL hash and establishes a
  // short-lived session when the user clicks the email link. We don't need to
  // parse it ourselves — onAuthStateChange will fire with event "PASSWORD_RECOVERY".
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // no-op; just keeping the listener alive while this page is mounted
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t('reset.err.short'));
      return;
    }
    if (password !== again) {
      setError(t('reset.err.mismatch'));
      return;
    }

    setLoading(true);
    try {
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) throw updErr;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('reset.err.generic'));
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
        {t('reset.title')}
      </h1>

      {done ? (
        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <p
            style={{
              fontFamily: "'Alike', serif",
              fontSize: 14,
              color: OLIVE,
              marginBottom: 24,
            }}
          >
            {t('reset.success')}
          </p>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: 27,
              background: YELLOW,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Alike', serif",
              fontSize: 14,
              color: OLIVE,
              boxShadow: '0px 2px 5px 0px rgba(152,152,12,0.22)',
            }}
          >
            {t('reset.back-to-app')}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('reset.password')}
            autoComplete="new-password"
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
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            placeholder={t('reset.password-again')}
            autoComplete="new-password"
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
            {loading ? '…' : t('reset.submit')}
          </button>
        </form>
      )}
    </div>
  );
}
