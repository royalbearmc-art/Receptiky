import { useNavigate } from 'react-router-dom';

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
        alt="Moje receptíky"
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
        Moje receptíky
      </h1>

      {/* Buttons — kept together with original spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 53.76, alignItems: 'center' }}>
        <button onClick={() => navigate('/recipes')} className="btn-pulse" style={BTN}>
          Recepty
        </button>
        <button onClick={() => navigate('/calendar')} className="btn-pulse" style={BTN}>
          Kalendár
        </button>
      </div>

    </div>
  );
}
