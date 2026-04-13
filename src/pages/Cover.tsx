import { useNavigate } from 'react-router-dom';

const BG_GRADIENT = 'linear-gradient(to top, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) bottom / 100% 76px no-repeat, #FAFEEB';

const BTN: React.CSSProperties = {
  position: 'absolute',
  width: 159.48,
  height: 42.76,
  left: 100,
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
    <div
      className="relative w-full overflow-hidden"
      style={{ background: BG_GRADIENT, width: '100%', height: '100%', minHeight: 800 }}
    >
      {/* Flower: W:362.2 H:447, top:58, centered */}
      <img
        src="/cover-flower.png"
        alt="Moje receptíky"
        style={{
          position: 'absolute',
          top: 58,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 362.2,
          height: 447,
          objectFit: 'contain',
          filter: 'drop-shadow(0px 4px 6px rgba(104, 104, 3, 0.53))',
        }}
      />

      {/* Title: X:24, Y:517, W:311.32, H:55, Srisakdi 45px */}
      <h1
        style={{
          position: 'absolute',
          top: 517,
          left: 24,
          width: 311.32,
          height: 55,
          fontFamily: "'Srisakdi', cursive",
          fontSize: 45,
          lineHeight: '121.2%',
          letterSpacing: '0.01em',
          color: '#333',
          fontWeight: 400,
          textAlign: 'center',
        }}
      >
        Moje receptíky
      </h1>

      {/* Recepty: X:100, Y:619 */}
      <button
        onClick={() => navigate('/recipes')}
        className="btn-pulse"
        style={{ ...BTN, top: 619 }}
      >
        Recepty
      </button>

      {/* Kalendár: X:100, Y:672.76 */}
      <button
        onClick={() => navigate('/calendar')}
        className="btn-pulse"
        style={{ ...BTN, top: 672.76 }}
      >
        Kalendár
      </button>
    </div>
  );
}
