import { useNavigate, useLocation } from 'react-router-dom';

const OLIVE = '#686803';
const YELLOW = '#D9D95D';

const TABS = [
  { path: '/recipes', label: 'Recepty',  icon: '📖' },
  { path: '/calendar', label: 'Kalendár', icon: '📅' },
  { path: '/settings', label: 'Nastavenia', icon: '⚙️' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = (p: string) => pathname === p || pathname.startsWith(p + '/');

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, zIndex: 1000,
      background: 'rgba(243,246,204,0.96)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(104,104,3,0.1)',
      display: 'flex', justifyContent: 'space-around',
      paddingTop: 8, paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    }}>
      {TABS.map((tab) => (
        <button key={tab.path} onClick={() => navigate(tab.path)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 20px', position: 'relative',
        }}>
          <span style={{ fontSize: 22 }}>{tab.icon}</span>
          <span style={{
            fontFamily: "'Alike', serif", fontSize: 10,
            color: active(tab.path) ? OLIVE : 'rgba(104,104,3,0.35)',
          }}>{tab.label}</span>
          {active(tab.path) && (
            <div style={{
              position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
              width: 4, height: 4, borderRadius: '50%', background: YELLOW,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}
