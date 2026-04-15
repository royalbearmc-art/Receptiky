import { useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';

const OLIVE = '#686803';

export default function CoverNew() {
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <div style={{
      width: '100%',
      minHeight: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #FAFEEB 90%, #F3F6CC 93%, #EBEDA9 95%, #E3E488 97.5%, #D9D95D 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* Floral pattern overlay */}
      <img
        src="/cover-alt-pattern.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '126%',
          height: '99.4%',
          objectFit: 'cover',
          opacity: 0.28,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Oval frame behind illustration */}
      <div style={{
        position: 'absolute',
        top: '9.6%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '77%',
        maxWidth: 277,
        aspectRatio: '277 / 412',
        borderRadius: '50%',
        background: '#F5F0DC',
        boxShadow: '0px 4px 8px 0px rgba(168,179,137,0.53)',
      }} />

      {/* Oval SVG border */}
      <img
        src="/cover-alt-oval.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '9.6%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '79%',
          maxWidth: 285,
          pointerEvents: 'none',
        }}
      />

      {/* Girl illustration */}
      <img
        src="/cover-alt-girl.png"
        alt={t('cover.title')}
        style={{
          position: 'absolute',
          top: '13.25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          maxWidth: 253,
          borderRadius: 20,
          objectFit: 'cover',
          objectPosition: 'top',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <h1 style={{
        position: 'absolute',
        top: '64.6%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '86%',
        fontFamily: "'Srisakdi', cursive",
        fontSize: 45,
        lineHeight: '121.2%',
        letterSpacing: '0.01em',
        color: OLIVE,
        fontWeight: 400,
        textAlign: 'center',
        margin: 0,
        textShadow: '0px 2.25px 4.5px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
      }}>
        {t('cover.title')}
      </h1>

      {/* Buttons */}
      <div style={{
        position: 'absolute',
        top: '77.4%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10.76,
      }}>
        <button
          onClick={() => navigate('/recipes')}
          style={{
            width: 159.48,
            height: 42.76,
            borderRadius: 27.15,
            backgroundColor: '#f9713d',
            fontFamily: "'Alike', serif",
            fontSize: 14,
            color: '#F9FAE8',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0px 2px 5px 0px rgba(200,80,20,0.3)',
          }}
        >
          {t('cover.recipes')}
        </button>
        <button
          onClick={() => navigate('/calendar')}
          style={{
            width: 159.48,
            height: 42.76,
            borderRadius: 27.15,
            backgroundColor: '#8b9b49',
            fontFamily: "'Alike', serif",
            fontSize: 14,
            color: '#F9FAE8',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0px 2px 5px 0px rgba(80,100,20,0.3)',
          }}
        >
          {t('cover.calendar')}
        </button>
      </div>

      {/* Settings gear */}
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
