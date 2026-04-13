import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../lib/RecipesContext';
import type { Recipe } from '../lib/types';

const BG_GRADIENT = 'linear-gradient(to bottom, #D9D95D 0%, #E3E488 26%, #EBEDA9 49%, #F3F6CC 75%, #FAFEEB 100%) top / 100% 112px no-repeat, #FAFEEB';
const CARD_COLOR = '#D9D95D';
const OVERLAY_COLOR = '#E8EAA0';
const TEXT_COLOR = '#686803';


type SortMode = 'alpha' | 'last-edited' | 'first-edited' | 'duration';
type ViewMode = 'grid' | 'tags';

const totalMinutes = (r: Recipe) =>
  r.steps.reduce((sum, s) => sum + (s.timer_minutes ?? 0), 0);

const SORT_LABELS: Record<SortMode, string> = {
  'alpha': 'A–Z',
  'last-edited': 'Naposledy upravené',
  'first-edited': 'Najskôr pridané',
  'duration': 'Čas prípravy',
};

export default function RecipeLibrary() {
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const [sortMode, setSortMode] = useState<SortMode>('alpha');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  /* ── sorting ── */
  const sorted = [...recipes].sort((a, b) => {
    if (sortMode === 'alpha') return a.title.localeCompare(b.title);
    if (sortMode === 'last-edited') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    if (sortMode === 'first-edited') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortMode === 'duration') return totalMinutes(a) - totalMinutes(b);
    return 0;
  });

  /* ── tag grouping ── */
  const allTags = [...new Set(recipes.flatMap((r) => r.tags))].sort((a, b) => {
    if (sortMode === 'alpha') return a.localeCompare(b);
    if (sortMode === 'last-edited') {
      const latestA = Math.max(...recipes.filter(r => r.tags.includes(a)).map(r => new Date(r.updated_at).getTime()));
      const latestB = Math.max(...recipes.filter(r => r.tags.includes(b)).map(r => new Date(r.updated_at).getTime()));
      return latestB - latestA;
    }
    if (sortMode === 'first-edited') {
      const oldestA = Math.min(...recipes.filter(r => r.tags.includes(a)).map(r => new Date(r.created_at).getTime()));
      const oldestB = Math.min(...recipes.filter(r => r.tags.includes(b)).map(r => new Date(r.created_at).getTime()));
      return oldestA - oldestB;
    }
    if (sortMode === 'duration') {
      const avgA = recipes.filter(r => r.tags.includes(a)).reduce((s, r) => s + totalMinutes(r), 0);
      const avgB = recipes.filter(r => r.tags.includes(b)).reduce((s, r) => s + totalMinutes(r), 0);
      return avgA - avgB;
    }
    return 0;
  });
  const recipesByTag = (tag: string) => sorted.filter((r) => r.tags.includes(tag));

  /* ── recipes to show in grid ── */
  const visibleRecipes = selectedTag ? recipesByTag(selectedTag) : sorted;

  return (
    <div className="relative flex flex-col" style={{ background: BG_GRADIENT, width: '100%', minHeight: 800 }}>

      {/* Back / up button */}
      <img
        src="/späť.png" alt="Späť"
        onClick={() => { if (selectedTag) { setSelectedTag(null); return; } navigate(-1); }}
        style={{ position: 'absolute', left: 22, top: 52, width: 31, height: 31, cursor: 'pointer', objectFit: 'contain' }}
      />

      {/* Plus button → new recipe */}
      <img
        src="/plus.png" alt="Add"
        onClick={() => navigate('/recipes/new')}
        style={{ position: 'absolute', left: 271, top: 75, width: 31, height: 31, cursor: 'pointer', objectFit: 'contain' }}
      />

      {/* Sort button */}
      <img
        src="/triedenie.png" alt="Sorting"
        onClick={() => { setShowSortMenu((v) => !v); setShowViewMenu(false); }}
        style={{ position: 'absolute', right: 22, top: 52, width: 31, height: 31, cursor: 'pointer', objectFit: 'contain' }}
      />

      {/* View/tag toggle button */}
      <img
        src="/zobrazenie.png" alt="View"
        onClick={() => { setShowViewMenu((v) => !v); setShowSortMenu(false); }}
        style={{ position: 'absolute', right: 22, top: 93, width: 31, height: 31, cursor: 'pointer', objectFit: 'contain' }}
      />

      {/* View dropdown */}
      {showViewMenu && (
        <>
          <div onClick={() => setShowViewMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{
            position: 'absolute', right: 22, top: 129, zIndex: 99,
            background: '#F5F8D6', borderRadius: 12, padding: '6px 0',
            boxShadow: '0 4px 16px rgba(104,104,3,0.15)', minWidth: 190,
            border: '1px solid rgba(104,104,3,0.1)',
          }}>
            <button onClick={() => { setViewMode('grid'); setSelectedTag(null); setShowViewMenu(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 16px',
                fontFamily: "'Alike', serif", fontSize: 13, color: TEXT_COLOR,
                background: viewMode === 'grid' ? '#F9FDEA' : 'none',
                border: 'none', borderBottom: '1px solid #F0F2C0', cursor: 'pointer', textAlign: 'left', gap: 8,
              }}>
              Všetky recepty
              {viewMode === 'grid' && <span style={{ fontSize: 10 }}>✓</span>}
            </button>
            <button onClick={() => { setViewMode('tags'); setSelectedTag(null); setShowViewMenu(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 16px',
                fontFamily: "'Alike', serif", fontSize: 13, color: TEXT_COLOR,
                background: viewMode === 'tags' ? '#F9FDEA' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left', gap: 8,
              }}>
              Podľa tagov
              {viewMode === 'tags' && <span style={{ fontSize: 10 }}>✓</span>}
            </button>
          </div>
        </>
      )}

      {/* Sort dropdown */}
      {showSortMenu && (
        <>
          <div onClick={() => setShowSortMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{
            position: 'absolute', right: 22, top: 88, zIndex: 99,
            background: '#F5F8D6', borderRadius: 12, padding: '6px 0',
            boxShadow: '0 4px 16px rgba(104,104,3,0.15)', minWidth: 180,
            border: '1px solid rgba(104,104,3,0.1)',
          }}>
            {(Object.entries(SORT_LABELS) as [SortMode, string][]).map(([mode, label]) => (
              <button key={mode} onClick={() => { setSortMode(mode); setShowSortMenu(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '10px 16px',
                  fontFamily: "'Alike', serif", fontSize: 13, color: TEXT_COLOR,
                  background: sortMode === mode ? '#F9FDEA' : 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left', gap: 8,
                }}>
                {label}
                {sortMode === mode && <span style={{ fontSize: 10 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Title */}
      <h1 className="text-center w-full" style={{
        paddingTop: 24,
        fontFamily: "'Srisakdi', cursive",
        fontSize: 29.4, lineHeight: '121.2%',
        letterSpacing: '0.01em', fontWeight: 400, color: TEXT_COLOR,
      }}>
        {selectedTag ? selectedTag : 'Receptíky'}
      </h1>


      {/* Content */}
      <div className="absolute" style={{ top: 173, left: 22, right: 22 }}>

        {/* TAG VIEW — show tag folders */}
        {viewMode === 'tags' && !selectedTag && (
          <div className="flex flex-wrap gap-[15px] justify-center">
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setSelectedTag(tag)}
                className="relative overflow-hidden shrink-0 transition-all duration-200 hover:brightness-105 active:scale-95"
                style={{
                  width: 92, height: 92, borderRadius: 8,
                  backgroundColor: CARD_COLOR,
                  boxShadow: '0 2px 8px rgba(104,104,3,0.15)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                <span style={{ fontSize: 24 }}>🏷</span>
                <span style={{
                  fontFamily: "'Alike', serif", fontSize: 10,
                  color: TEXT_COLOR, textAlign: 'center', padding: '0 6px',
                  lineHeight: '130%',
                }}>{tag}</span>
                <span style={{
                  fontSize: 9, color: TEXT_COLOR, opacity: 0.6,
                  fontFamily: "'Alike', serif",
                }}>{recipesByTag(tag).length} receptov</span>
              </button>
            ))}
          </div>
        )}

        {/* GRID VIEW — normal or filtered by tag */}
        {(viewMode === 'grid' || selectedTag) && visibleRecipes.length === 0 && (
          <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <p style={{
              fontFamily: "'Srisakdi', cursive",
              fontSize: 22, color: TEXT_COLOR,
              opacity: 0.5, textAlign: 'center',
              lineHeight: '140%', padding: '0 32px',
            }}>
              Zatiaľ nemáš<br />žiadne receptíky
            </p>
          </div>
        )}

        {(viewMode === 'grid' || selectedTag) && (
          <div className="flex flex-wrap gap-[15px] justify-center">
            {visibleRecipes.map((recipe) => (
              <button key={recipe.id} onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="relative overflow-hidden shrink-0 transition-all duration-200 hover:brightness-105 active:scale-95"
                style={{
                  width: 92, height: 92, borderRadius: 8,
                  backgroundColor: CARD_COLOR,
                  boxShadow: '0 2px 8px rgba(104,104,3,0.15)',
                }}>
                {recipe.photo_url && (
                  <img src={recipe.photo_url} alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute bottom-0 left-0 right-0" style={{
                  height: 31, backgroundColor: OVERLAY_COLOR,
                  borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
                }}>
                  <p className="line-clamp-2 overflow-hidden" style={{
                    fontFamily: "'Alike', serif", fontSize: 10,
                    lineHeight: '121.2%', letterSpacing: '0.01em',
                    color: TEXT_COLOR, padding: '3px 8px 0',
                  }}>
                    {recipe.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
