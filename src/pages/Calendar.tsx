import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../lib/CalendarContext';
import { useRecipes } from '../lib/RecipesContext';
import type { MealSlot } from '../lib/types';

/* ── constants ── */
const OLIVE = '#686803';
const YELLOW = '#D9D95D';
const BG = 'linear-gradient(to bottom, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) top / 100% 112px no-repeat, #FAFEEB';

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Raňajky',
  lunch: 'Obed',
  dinner: 'Večera',
  snack: 'Desiata',
};
const SLOT_COLORS: Record<MealSlot, string> = {
  breakfast: '#F5E87A',
  lunch:     '#C8D96E',
  dinner:    '#A8BB4A',
  snack:     '#E8EAA0',
};

const DAY_SHORT = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
const MONTH_NAMES = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
const MONTH_SHORT = ['jan','feb','mar','apr','máj','jún','júl','aug','sep','okt','nov','dec'];

/* ── helpers ── */
function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}
function todayStr(): string {
  return toDateStr(new Date());
}
function getWeekStart(d: Date): Date {
  const r = new Date(d); r.setHours(0,0,0,0);
  const day = r.getDay();
  r.setDate(r.getDate() + (day === 0 ? -6 : 1 - day));
  return r;
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getDate()}. ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

type CalView = 'week' | 'month';

export default function Calendar() {
  const navigate = useNavigate();
  const { addEntry, removeEntry, entriesForDate } = useCalendar();
  const { recipes } = useRecipes();

  const [view, setView] = useState<CalView>('week');
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()));
  const [monthDate, setMonthDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // assignment flow
  const [assignFlow, setAssignFlow] = useState<{ date: string; slot: MealSlot } | null>(null);
  const [search, setSearch] = useState('');

  // remove confirm
  const [removeId, setRemoveId] = useState<string | null>(null);

  // copy day
  const [copyFrom, setCopyFrom] = useState<string | null>(null);

  const today = todayStr();

  /* ── week days ── */
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  /* ── month days ── */
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const pad = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthCells: (Date | null)[] = [
    ...Array(pad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  /* ── assign handler ── */
  const handleAssign = async (recipeId: string) => {
    if (!assignFlow) return;
    try {
      await addEntry(recipeId, assignFlow.date, assignFlow.slot);
    } catch (e) {
      console.error(e);
    }
    setAssignFlow(null);
    setSearch('');
  };

  /* ── copy day handler ── */
  const handleCopyDay = async (toDate: string) => {
    if (!copyFrom) return;
    const srcEntries = entriesForDate(copyFrom);
    const destEntries = entriesForDate(toDate);
    const destSlots = new Set(destEntries.map(e => e.meal_slot));
    for (const e of srcEntries) {
      if (!destSlots.has(e.meal_slot)) {
        try { await addEntry(e.recipe_id, toDate, e.meal_slot); } catch { /* skip occupied */ }
      }
    }
    setCopyFrom(null);
  };

  /* ── filtered recipes for search ── */
  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ── nav header ── */
  const navLabel = view === 'week'
    ? `${weekDays[0].getDate()}. ${MONTH_SHORT[weekDays[0].getMonth()]} – ${weekDays[6].getDate()}. ${MONTH_SHORT[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`
    : `${MONTH_NAMES[month]} ${year}`;

  const goBack = () => {
    if (view === 'week') setWeekStart(w => addDays(w, -7));
    else setMonthDate(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };
  const goForward = () => {
    if (view === 'week') setWeekStart(w => addDays(w, 7));
    else setMonthDate(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  return (
    <div style={{ background: BG, width: '100%', minHeight: '100dvh', paddingBottom: 80, position: 'relative' }}>

      {/* Back to home */}
      <img
        src="/späť.png" alt="Späť"
        onClick={() => navigate('/')}
        style={{ position: 'absolute', left: 22, top: 52, width: 31, height: 31, cursor: 'pointer', objectFit: 'contain' }}
      />

      {/* Header */}
      <p style={{
        fontFamily: "'Srisakdi', cursive", fontSize: 29.4, color: OLIVE,
        textAlign: 'center', paddingTop: 24, letterSpacing: '0.01em', lineHeight: '121.2%',
      }}>Kalendár</p>

      {/* Nav bar */}
      <div style={{
        margin: '44px 9px 0', height: 43, borderRadius: 35,
        background: 'rgba(243,246,204,0.5)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(104,104,3,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', padding: '0 12px',
      }}>
        {/* Prev */}
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: OLIVE, fontSize: 16, padding: '0 4px' }}>‹</button>

        {/* Label */}
        <span style={{ flex: 1, fontFamily: "'Alike', serif", fontSize: 12, color: OLIVE, textAlign: 'center' }}>{navLabel}</span>

        {/* Next */}
        <button onClick={goForward} style={{ background: 'none', border: 'none', cursor: 'pointer', color: OLIVE, fontSize: 16, padding: '0 4px' }}>›</button>

        {/* View toggle */}
        <button onClick={() => setView(v => v === 'week' ? 'month' : 'week')} style={{
          background: 'rgba(217,217,93,0.5)', border: 'none', cursor: 'pointer',
          borderRadius: 12, padding: '3px 8px',
          fontFamily: "'Alike', serif", fontSize: 10, color: OLIVE, marginLeft: 6,
        }}>
          {view === 'week' ? 'Mesiac' : 'Týždeň'}
        </button>
      </div>

      {/* ── WEEK VIEW ── */}
      {view === 'week' && (
        <div style={{ margin: '12px 9px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[weekDays.slice(0, 4), weekDays.slice(4)].map((rowDays, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 6 }}>
              {rowDays.map((day) => {
                const ds = toDateStr(day);
                const dayEntries = entriesForDate(ds);
                const isToday = ds === today;
                const isSelected = selectedDate === ds;

                return (
                  <div key={ds}
                    onClick={() => setSelectedDate(isSelected ? null : ds)}
                    style={{
                      flex: 1, borderRadius: 14, padding: '22px 6px',
                      minHeight: 160,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(217,217,93,0.35)' : 'rgba(255,255,255,0.45)',
                      border: isSelected ? `1.5px solid ${YELLOW}` : '1.5px solid transparent',
                      boxShadow: '0 1px 4px rgba(104,104,3,0.07)',
                      transition: 'all 0.15s',
                    }}>
                    {/* Day abbr */}
                    <span style={{ fontSize: 10, color: OLIVE, opacity: 0.55, fontFamily: "'Alike', serif" }}>
                      {DAY_SHORT[day.getDay()]}
                    </span>
                    {/* Date number */}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: isToday ? YELLOW : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 13, color: OLIVE, fontFamily: "'Alike', serif", fontWeight: isToday ? 600 : 400 }}>
                        {day.getDate()}
                      </span>
                    </div>
                    {/* Meal dots */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', minHeight: 18 }}>
                      {SLOTS.map(slot => {
                        const has = dayEntries.some(e => e.meal_slot === slot);
                        return has ? (
                          <div key={slot} style={{ width: 7, height: 7, borderRadius: '50%', background: SLOT_COLORS[slot] }} />
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ── MONTH VIEW ── */}
      {view === 'month' && (
        <div style={{ margin: '12px 9px 0' }}>
          {/* Day header row */}
          <div style={{ display: 'flex', marginBottom: 4 }}>
            {['Po','Ut','St','Št','Pi','So','Ne'].map(d => (
              <div key={d} style={{ flex: 1, textAlign: 'center', fontFamily: "'Alike', serif", fontSize: 10, color: OLIVE, opacity: 0.5 }}>{d}</div>
            ))}
          </div>
          {/* Month grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {monthCells.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} style={{ width: '14.28%', aspectRatio: '1' }} />;
              const ds = toDateStr(day);
              const dayEntries = entriesForDate(ds);
              const isToday = ds === today;
              const isSelected = selectedDate === ds;

              return (
                <div key={ds}
                  onClick={() => setSelectedDate(isSelected ? null : ds)}
                  style={{
                    width: '14.28%', aspectRatio: '1',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', borderRadius: 8,
                    background: isSelected ? 'rgba(217,217,93,0.3)' : 'transparent',
                    border: isSelected ? `1.5px solid ${YELLOW}` : '1.5px solid transparent',
                    gap: 2,
                  }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: isToday ? YELLOW : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 11, color: OLIVE, fontFamily: "'Alike', serif" }}>{day.getDate()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {SLOTS.map(slot =>
                      dayEntries.some(e => e.meal_slot === slot)
                        ? <div key={slot} style={{ width: 4, height: 4, borderRadius: '50%', background: SLOT_COLORS[slot] }} />
                        : null
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DAY DETAIL BOTTOM SHEET ── */}
      {selectedDate && (
        <>
          <div onClick={() => setSelectedDate(null)} style={{ position: 'fixed', inset: 0, zIndex: 198 }} />
          <div style={{
            position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 199,
            background: '#FAFEEB',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            boxShadow: '0 -4px 24px rgba(104,104,3,0.15)',
            padding: '20px 20px 24px',
            maxHeight: '65vh', overflowY: 'auto',
          }}>
            {/* Sheet header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontFamily: "'Srisakdi', cursive", fontSize: 18, color: OLIVE, letterSpacing: '0.01em' }}>
                {formatDisplayDate(selectedDate)}
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Copy day */}
                {entriesForDate(selectedDate).length > 0 && (
                  <button onClick={() => setCopyFrom(selectedDate)} style={{
                    fontFamily: "'Alike', serif", fontSize: 10, color: OLIVE,
                    background: 'rgba(217,217,93,0.4)', border: 'none', cursor: 'pointer',
                    borderRadius: 10, padding: '3px 8px',
                  }}>kopírovať deň</button>
                )}
                <button onClick={() => setSelectedDate(null)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 18, color: OLIVE, opacity: 0.4, lineHeight: 1,
                }}>✕</button>
              </div>
            </div>

            {/* Meal slots */}
            {SLOTS.map(slot => {
              const entry = entriesForDate(selectedDate).find(e => e.meal_slot === slot);
              return (
                <div key={slot} style={{ marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Alike', serif", fontSize: 10, color: OLIVE, opacity: 0.45, display: 'block', marginBottom: 4 }}>
                    {SLOT_LABELS[slot]}
                  </span>
                  {entry ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: SLOT_COLORS[slot], borderRadius: 10, padding: '9px 12px',
                    }}>
                      <span
                        onClick={() => navigate(`/recipes/${entry.recipe_id}`)}
                        style={{ fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE, cursor: 'pointer', flex: 1 }}>
                        {entry.recipe?.title ?? '…'}
                      </span>
                      <button onClick={() => setRemoveId(entry.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 14, color: OLIVE, opacity: 0.35, padding: 0,
                      }}>✕</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssignFlow({ date: selectedDate, slot })}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 10,
                        border: '1.5px dashed rgba(104,104,3,0.2)',
                        background: 'none', cursor: 'pointer', textAlign: 'left',
                        fontFamily: "'Alike', serif", fontSize: 12, color: 'rgba(104,104,3,0.3)',
                      }}>+ pridať recept</button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── ASSIGN RECIPE MODAL ── */}
      {assignFlow && (
        <>
          <div onClick={() => { setAssignFlow(null); setSearch(''); }} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 301,
            background: '#FAFEEB',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: '20px 20px 32px',
            maxHeight: '70vh', display: 'flex', flexDirection: 'column',
          }}>
            <p style={{ fontFamily: "'Srisakdi', cursive", fontSize: 18, color: OLIVE, marginBottom: 12 }}>
              {SLOT_LABELS[assignFlow.slot]} · {formatDisplayDate(assignFlow.date)}
            </p>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Hľadať recept…"
              autoFocus
              style={{
                fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE,
                border: `1.5px solid ${YELLOW}`, borderRadius: 12,
                padding: '9px 12px', background: 'rgba(255,255,255,0.6)',
                outline: 'none', marginBottom: 12, width: '100%',
              }}
            />
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredRecipes.length === 0 ? (
                <p style={{ fontFamily: "'Alike', serif", fontSize: 12, color: OLIVE, opacity: 0.4, textAlign: 'center', paddingTop: 16 }}>
                  Žiadne recepty
                </p>
              ) : filteredRecipes.map(r => (
                <button key={r.id} onClick={() => handleAssign(r.id)} style={{
                  width: '100%', padding: '11px 12px', marginBottom: 6,
                  borderRadius: 10, background: 'rgba(217,217,93,0.15)',
                  border: '1px solid rgba(104,104,3,0.08)',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  {r.photo_url && (
                    <img src={r.photo_url} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  {r.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── REMOVE CONFIRM ── */}
      {removeId && (
        <>
          <div onClick={() => setRemoveId(null)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 301, background: '#FAFEEB', borderRadius: 18,
            padding: '24px 22px', width: 280,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}>
            <p style={{ fontFamily: "'Srisakdi', cursive", fontSize: 18, color: OLIVE, textAlign: 'center', marginBottom: 18 }}>
              Odstrániť zo dňa?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRemoveId(null)} style={{
                flex: 1, padding: '10px 0', borderRadius: 20,
                background: 'rgba(104,104,3,0.08)', border: 'none', cursor: 'pointer',
                fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE,
              }}>Nie</button>
              <button onClick={async () => {
                await removeEntry(removeId);
                setRemoveId(null);
              }} style={{
                flex: 1, padding: '10px 0', borderRadius: 20,
                background: '#a33', border: 'none', cursor: 'pointer',
                fontFamily: "'Alike', serif", fontSize: 13, color: '#fff',
              }}>Odstrániť</button>
            </div>
          </div>
        </>
      )}

      {/* ── COPY DAY TARGET PICKER ── */}
      {copyFrom && (
        <>
          <div onClick={() => setCopyFrom(null)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 301, background: '#FAFEEB', borderRadius: 18,
            padding: '24px 22px', width: 300,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}>
            <p style={{ fontFamily: "'Srisakdi', cursive", fontSize: 18, color: OLIVE, textAlign: 'center', marginBottom: 6 }}>
              Skopírovať deň
            </p>
            <p style={{ fontFamily: "'Alike', serif", fontSize: 11, color: OLIVE, opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
              Vyber cieľový dátum
            </p>
            <input type="date" defaultValue={today}
              id="copy-target-date"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 12,
                border: `1.5px solid ${YELLOW}`, fontFamily: "'Alike', serif",
                fontSize: 13, color: OLIVE, background: 'rgba(255,255,255,0.6)',
                outline: 'none', marginBottom: 14,
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setCopyFrom(null)} style={{
                flex: 1, padding: '10px 0', borderRadius: 20,
                background: 'rgba(104,104,3,0.08)', border: 'none', cursor: 'pointer',
                fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE,
              }}>Zrušiť</button>
              <button onClick={() => {
                const input = document.getElementById('copy-target-date') as HTMLInputElement;
                if (input?.value) handleCopyDay(input.value);
              }} style={{
                flex: 1, padding: '10px 0', borderRadius: 20,
                background: YELLOW, border: 'none', cursor: 'pointer',
                fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE,
              }}>Kopírovať</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
