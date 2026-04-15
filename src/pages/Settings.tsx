import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useT, type Lang, type CoverTheme } from '../lib/i18n';

const BG_GRADIENT =
  'linear-gradient(to bottom, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) top / 100% 112px no-repeat, #FAFEEB';

const OLIVE = '#686803';
const YELLOW = '#D9D95D';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p
        style={{
          fontFamily: "'Srisakdi', cursive",
          fontSize: 18,
          color: OLIVE,
          letterSpacing: '0.01em',
          marginBottom: 10,
          paddingLeft: 4,
        }}
      >
        {title}
      </p>
      <div
        style={{
          background: 'rgba(255,255,255,0.55)',
          borderRadius: 16,
          border: '1px solid rgba(104,104,3,0.08)',
          boxShadow: '0 2px 8px rgba(104,104,3,0.06)',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

function Row({ label, value, onClick, danger, disabled }: RowProps) {
  const content = (
    <>
      <span
        style={{
          fontFamily: "'Alike', serif",
          fontSize: 13,
          color: danger ? '#a33' : OLIVE,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {label}
      </span>
      {value !== undefined && (
        <span
          style={{
            fontFamily: "'Alike', serif",
            fontSize: 12,
            color: OLIVE,
            opacity: 0.6,
            maxWidth: '60%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      )}
      {onClick && !value && (
        <span style={{ fontFamily: "'Alike', serif", fontSize: 14, color: OLIVE, opacity: 0.4 }}>
          ›
        </span>
      )}
    </>
  );

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(104,104,3,0.08)',
    background: 'none',
    textAlign: 'left',
  };

  if (onClick && !disabled) {
    return (
      <button onClick={onClick} style={{ ...baseStyle, border: 'none', cursor: 'pointer' }}>
        {content}
      </button>
    );
  }

  return <div style={baseStyle}>{content}</div>;
}

interface LangRowProps {
  label: string;
  lang: Lang;
  setLang: (l: Lang) => void;
}

function LangRow({ label, lang, setLang }: LangRowProps) {
  const chip = (val: Lang, text: string) => {
    const active = lang === val;
    return (
      <button
        key={val}
        onClick={() => setLang(val)}
        style={{
          fontFamily: "'Alike', serif",
          fontSize: 12,
          color: OLIVE,
          padding: '5px 12px',
          borderRadius: 14,
          background: active ? YELLOW : 'rgba(255,255,255,0.6)',
          border: active ? 'none' : '1px solid rgba(104,104,3,0.15)',
          cursor: 'pointer',
          fontWeight: active ? 600 : 400,
        }}
      >
        {text}
      </button>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(104,104,3,0.08)',
      }}
    >
      <span style={{ fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE }}>{label}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {chip('sk', 'SK')}
        {chip('en', 'EN')}
      </div>
    </div>
  );
}

interface CoverRowProps {
  label: string;
  coverTheme: CoverTheme;
  setCoverTheme: (t: CoverTheme) => void;
  labelClassic: string;
  labelNew: string;
}

function CoverRow({ label, coverTheme, setCoverTheme, labelClassic, labelNew }: CoverRowProps) {
  const chip = (val: CoverTheme, text: string) => {
    const active = coverTheme === val;
    return (
      <button
        key={val}
        onClick={() => setCoverTheme(val)}
        style={{
          fontFamily: "'Alike', serif",
          fontSize: 12,
          color: OLIVE,
          padding: '5px 12px',
          borderRadius: 14,
          background: active ? YELLOW : 'rgba(255,255,255,0.6)',
          border: active ? 'none' : '1px solid rgba(104,104,3,0.15)',
          cursor: 'pointer',
          fontWeight: active ? 600 : 400,
        }}
      >
        {text}
      </button>
    );
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '14px 16px',
      borderBottom: '1px solid rgba(104,104,3,0.08)',
    }}>
      <span style={{ fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE }}>{label}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {chip('classic', labelClassic)}
        {chip('new', labelNew)}
      </div>
    </div>
  );
}

type PwState = 'idle' | 'sending' | 'sent' | 'error';

export default function Settings() {
  const navigate = useNavigate();
  const { t, lang, setLang, coverTheme, setCoverTheme } = useT();
  const [email, setEmail] = useState<string | null>(null);
  const [pwState, setPwState] = useState<PwState>('idle');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Auth gate in App.tsx will redirect to SignIn.
  };

  const handleChangePassword = async () => {
    if (!email || pwState === 'sending') return;
    setPwState('sending');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setPwState('error');
    } else {
      setPwState('sent');
    }
  };

  const passwordLabel =
    pwState === 'sending'
      ? t('settings.account.password.sending')
      : pwState === 'sent'
      ? t('settings.account.password.sent')
      : pwState === 'error'
      ? t('settings.account.password.error')
      : t('settings.account.password');

  return (
    <div
      style={{
        background: BG_GRADIENT,
        width: '100%',
        minHeight: '100dvh',
        position: 'relative',
        paddingBottom: 40,
      }}
    >
      {/* Back button */}
      <img
        src="/späť.png"
        alt="Back"
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          left: 22,
          top: 52,
          width: 31,
          height: 31,
          cursor: 'pointer',
          objectFit: 'contain',
        }}
      />

      {/* Title */}
      <h1
        className="text-center w-full"
        style={{
          paddingTop: 44,
          fontFamily: "'Srisakdi', cursive",
          fontSize: 29.4,
          lineHeight: '121.2%',
          letterSpacing: '0.01em',
          fontWeight: 400,
          color: OLIVE,
        }}
      >
        {t('settings.title')}
      </h1>

      {/* Content */}
      <div style={{ padding: '30px 22px 0' }}>

        {/* Account section */}
        <Section title={t('settings.account')}>
          <Row label={t('settings.account.email')} value={email ?? '…'} />
          <Row
            label={passwordLabel}
            onClick={pwState === 'idle' || pwState === 'error' ? handleChangePassword : undefined}
            disabled={pwState === 'sending' || pwState === 'sent'}
          />
        </Section>

        {/* Appearance */}
        <Section title={t('settings.appearance')}>
          <Row
            label={t('settings.appearance.theme')}
            value={t('settings.appearance.theme.light')}
            disabled
          />
          <LangRow label={t('settings.appearance.language')} lang={lang} setLang={setLang} />
          <CoverRow
            label={t('settings.appearance.cover')}
            coverTheme={coverTheme}
            setCoverTheme={setCoverTheme}
            labelClassic={t('settings.appearance.cover.classic')}
            labelNew={t('settings.appearance.cover.new')}
          />
        </Section>

        {/* About */}
        <Section title={t('settings.about')}>
          <Row label={t('settings.about.version')} value="0.1.0" />
        </Section>

        <p
          style={{
            fontFamily: "'Alike', serif",
            fontSize: 10,
            color: OLIVE,
            opacity: 0.4,
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 40,
          }}
        >
          {t('settings.more-coming')}
        </p>

        {/* Sign out — standalone at the very bottom */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 0',
            borderRadius: 16,
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(163,51,51,0.2)',
            boxShadow: '0 2px 8px rgba(104,104,3,0.06)',
            cursor: 'pointer',
            fontFamily: "'Alike', serif",
            fontSize: 13,
            color: '#a33',
            textAlign: 'center',
          }}
        >
          {t('settings.account.signout')}
        </button>
      </div>
    </div>
  );
}
