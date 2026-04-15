import { useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';
import CoverNew from './CoverNew';

const BG_GRADIENT = 'linear-gradient(to top, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) bottom / 100% 76px no-repeat, #FAFEEB';

const BTN: React.CSSProperties = {
  width: 159.48,
  height: 42.76,
  borderRadius: 27.15,
  backgroundColor: '#D9D95D',
  fontFamily: "'Alike', serif",
  fontSize: 14,
  color: '#686803',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0px 2px 5px 0px rgba(152, 152, 12, 0.22)',
};

export default function Cover() {
  const navigate = useNavigate();
  const { t, coverTheme } = useT();

  if (coverTheme === 'new') return <CoverNew />;

  return (
    <div style={{
      background: BG_GRADIENT,
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Flower */}
      <img
        src="/cover-flower.png"
        alt={t('cover.title')}
        style={{
          width: '100%',
          maxWidth: 362,
          height: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0px 4px 6px rgba(104, 104, 3, 0.53))',
          marginBottom: 24,
        }}
      />

      {/* Title */}
      <h1 style={{
        fontFamily: "'Srisakdi', cursive",
        fontSize: 45,
        lineHeight: '121.2%',
        letterSpacing: '0.01em',
        color: '#333',
        fontWeight: 400,
        textAlign: 'center',
        marginBottom: 32,
        padding: '0 24px',
      }}>
        {t('cover.title')}
      </h1>

      {/* Buttons — kept together with original spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10.76, alignItems: 'center' }}>
        <button onClick={() => navigate('/recipes')} className="btn-pulse" style={BTN}>
          {t('cover.recipes')}
        </button>
        <button onClick={() => navigate('/calendar')} className="btn-pulse" style={BTN}>
          {t('cover.calendar')}
        </button>
      </div>

      {/* Settings gear — top right corner, navigates to /settings */}
      <img
        src="/settings.png"
        alt={t('cover.settings')}
        onClick={() => navigate('/settings')}
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          width: 34.86,
          height: 34.86,
          objectFit: 'contain',
          cursor: 'pointer',
          zIndex: 100,
        }}
      />

    </div>
  );
}
