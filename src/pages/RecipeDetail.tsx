import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useRecipes } from '../lib/RecipesContext';
import type { Recipe, Ingredient } from '../lib/types';

async function getCroppedImg(imageSrc: string, cropPixels: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropPixels.width;
      canvas.height = cropPixels.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject('No canvas context'); return; }
      ctx.drawImage(
        img,
        cropPixels.x, cropPixels.y,
        cropPixels.width, cropPixels.height,
        0, 0,
        cropPixels.width, cropPixels.height
      );
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

const OLIVE = '#686803';
const YELLOW = '#D9D95D';

const emptyRecipe: Recipe = {
  id: 'new',
  title: '',
  description: null,
  photo_url: null,
  tags: [],
  ingredients: [{ name: '', amount: '', unit: '' }],
  steps: [{ text: '', timer_minutes: null }],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, updateRecipe, addRecipe } = useRecipes();
  const isNew = id === 'new';

  const found = recipes.find((r) => r.id === id);
  const initial = isNew ? emptyRecipe : found;

  const [recipe, setRecipe] = useState<Recipe>(initial ?? emptyRecipe);
  const [isEditing, setIsEditing] = useState(isNew);
  const [showMenu, setShowMenu] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial?.photo_url ?? null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    if (pixels.width > 0 && pixels.height > 0) {
      setCroppedAreaPixels(pixels);
    }
  }, []);

  const confirmCrop = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(cropSrc, croppedAreaPixels);
      setPreviewUrl(cropped);
      setRecipe((r) => ({ ...r, photo_url: cropped }));
      setCropSrc(null);
    } catch (e) {
      console.error('Crop failed:', e);
    }
  };

  if (!isNew && !found) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 800 }}>
        <p style={{ color: '#aaa' }}>Recipe not found.</p>
      </div>
    );
  }

  /* ── helpers ── */
  const updIng = (i: number, field: keyof Ingredient, val: string) =>
    setRecipe((r) => { const ings = [...r.ingredients]; ings[i] = { ...ings[i], [field]: val }; return { ...r, ingredients: ings }; });

  const addIng = () =>
    setRecipe((r) => ({ ...r, ingredients: [...r.ingredients, { name: '', amount: '', unit: '' }] }));

  const removeIng = (i: number) =>
    setRecipe((r) => ({ ...r, ingredients: r.ingredients.filter((_, idx) => idx !== i) }));

  const updStep = (i: number, val: string) =>
    setRecipe((r) => { const steps = [...r.steps]; steps[i] = { ...steps[i], text: val }; return { ...r, steps }; });

  const addStep = () =>
    setRecipe((r) => ({ ...r, steps: [...r.steps, { text: '', timer_minutes: null }] }));

  const removeStep = (i: number) =>
    setRecipe((r) => ({ ...r, steps: r.steps.filter((_, idx) => idx !== i) }));

  const addTag = () => {
    const tag = prompt('Nový tag:');
    if (tag) setRecipe((r) => ({ ...r, tags: [...r.tags, tag.trim()] }));
  };

  const removeTag = (i: number) =>
    setRecipe((r) => ({ ...r, tags: r.tags.filter((_, idx) => idx !== i) }));

  /* ── shared styles ── */
  const inputStyle: React.CSSProperties = {
    fontFamily: "'Alike', serif",
    fontSize: 12,
    color: OLIVE,
    border: 'none',
    borderBottom: `1px solid ${YELLOW}`,
    background: 'transparent',
    outline: 'none',
    width: '100%',
    padding: '2px 0',
  };

  return (
    <div style={{ width: '100%', minHeight: 800, fontFamily: "'Alike', serif", position: 'relative',
      background: `linear-gradient(to bottom, #D9D95D 0%, #E3E488 40%, #EBEDA9 70%, #FAFEEB 100%) top / 100% 112px no-repeat, #FAFEEB`,
    }}>

      {/* Title */}
      {isEditing ? (
        <input
          value={recipe.title}
          onChange={(e) => setRecipe((r) => ({ ...r, title: e.target.value }))}
          placeholder="Názov receptu..."
          style={{
            fontFamily: "'Srisakdi', cursive", fontSize: 26,
            color: OLIVE, textAlign: 'center',
            paddingTop: 20, display: 'block', width: '100%',
            border: 'none', borderBottom: `1px solid ${YELLOW}`,
            background: 'transparent', outline: 'none',
          }}
        />
      ) : (
        <p style={{ fontFamily: "'Srisakdi', cursive", fontSize: 29.4, color: OLIVE,
          textAlign: 'center', paddingTop: 20, letterSpacing: '0.01em', lineHeight: '121.2%' }}>
          {recipe.title}
        </p>
      )}

      {/* Nav bar */}
      <div style={{
        margin: '10px 9px 0', height: 43, borderRadius: 35,
        background: 'rgba(243,246,204,0.5)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(104,104,3,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6,
        overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none' as const,
      }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          width: 30, height: 30, borderRadius: '50%', background: YELLOW,
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 14, color: OLIVE, flexShrink: 0,
          boxShadow: '0 1px 4px rgba(104,104,3,0.15)', fontFamily: "'Alike', serif",
        }}>←</button>

        {/* Tags */}
        {recipe.tags.map((tag, i) => (
          <span key={i} style={{
            fontFamily: "'Alike', serif", fontSize: 11, color: OLIVE,
            background: '#DFE280', borderRadius: 20, padding: '4px 11px',
            whiteSpace: 'nowrap', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {tag}
            {isEditing && (
              <button onClick={() => removeTag(i)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10, color: OLIVE, padding: 0, lineHeight: 1,
              }}>×</button>
            )}
          </span>
        ))}

        {/* Add tag in edit mode */}
        {isEditing && (
          <button onClick={addTag} style={{
            fontFamily: "'Alike', serif", fontSize: 11, color: OLIVE,
            background: 'rgba(217,217,93,0.4)', borderRadius: 20, padding: '4px 10px',
            border: `1px dashed ${OLIVE}`, cursor: 'pointer', flexShrink: 0,
          }}>+ tag</button>
        )}

        <div style={{ flex: 1 }} />

        {/* Settings */}
        <button onClick={() => setShowMenu((v) => !v)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          width: 34.86, height: 34.86, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <img src="/settings.png" alt="Settings" style={{ width: 34.86, height: 34.86, objectFit: 'contain' }} />
        </button>
      </div>

      {/* Settings dropdown — outside nav bar so it's not clipped */}
      {showMenu && (
        <div style={{
          position: 'absolute', right: 9, top: 70, zIndex: 99,
          background: '#F5F8D6', borderRadius: 12, padding: '6px 0',
          boxShadow: '0 4px 16px rgba(104,104,3,0.15)', minWidth: 150,
          border: '1px solid rgba(104,104,3,0.1)',
        }}>
          <button onClick={() => { setIsEditing(true); setShowMenu(false); }} style={{
            display: 'block', width: '100%', padding: '10px 16px',
            fontFamily: "'Alike', serif", fontSize: 13, color: OLIVE,
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          }}>✏️ Upraviť recept</button>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '16px 22px 40px' }}>

        {/* Total time */}
        {(() => {
          const total = recipe.steps.reduce((s, st) => s + (st.timer_minutes ?? 0), 0);
          if (total === 0) return null;
          const h = Math.floor(total / 60);
          const m = total % 60;
          const label = h > 0 ? `${h} hod ${m > 0 ? m + ' min' : ''}`.trim() : `${m} min`;
          return (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontFamily: "'Alike', serif", fontSize: 12, color: OLIVE, opacity: 0.7, marginBottom: 10, letterSpacing: '0.02em' }}>
                ⏱ {label}
              </p>
              <div style={{ borderTop: `1.5px solid ${OLIVE}`, opacity: 0.18 }} />
            </div>
          );
        })()}

        {/* Ingredients + circle */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ flex: 1 }}>

            {recipe.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                {isEditing ? (
                  <>
                    <input value={ing.amount} onChange={(e) => updIng(i, 'amount', e.target.value)}
                      placeholder="Mn." style={{ ...inputStyle, width: 36 }} />
                    <input value={ing.unit} onChange={(e) => updIng(i, 'unit', e.target.value)}
                      placeholder="jedn." style={{ ...inputStyle, width: 52 }} />
                    <input value={ing.name} onChange={(e) => updIng(i, 'name', e.target.value)}
                      placeholder="Ingrediencia" style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={() => removeIng(i)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14, color: '#bbb', padding: 0, flexShrink: 0,
                    }}>×</button>
                  </>
                ) : (
                  <p style={{ fontFamily: "'Alike', serif", fontSize: 12, color: OLIVE, lineHeight: '155%' }}>
                    {ing.amount} {ing.unit} {ing.name}
                  </p>
                )}
              </div>
            ))}

            {/* Add ingredient */}
            {isEditing && (
              <button onClick={addIng} style={{
                marginTop: 6, display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Alike', serif", fontSize: 11, color: OLIVE, padding: 0,
              }}>
                <img src="/plus.png" alt="+" style={{ width: 18, height: 18 }} /> ingrediencia
              </button>
            )}
          </div>

          {/* Circle */}
          <div style={{
            width: 140, height: 140, borderRadius: '50%', background: YELLOW,
            flexShrink: 0, marginLeft: -20,
            boxShadow: '0 4px 16px rgba(104,104,3,0.18)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {previewUrl
              ? <img src={previewUrl} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 48 }}>🌿</span>
            }

            {/* Edit overlay with two icons */}
            {isEditing && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(104,104,3,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
              }}>
                {/* Camera — change image */}
                <label style={{ cursor: 'pointer', fontSize: 26, lineHeight: 1 }} title="Zmeniť fotku">
                  📷
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>

                {/* Crop — crop current image */}
                <button
                  onClick={() => previewUrl && setCropSrc(previewUrl)}
                  disabled={!previewUrl}
                  style={{
                    background: 'none', border: 'none', cursor: previewUrl ? 'pointer' : 'not-allowed',
                    fontSize: 22, lineHeight: 1, padding: 0,
                    opacity: previewUrl ? 1 : 0.4,
                  }}
                  title="Orezať"
                >✂️</button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1.5px solid ${OLIVE}`, opacity: 0.25, marginBottom: 16 }} />

        {/* Steps */}
        {recipe.steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
            <span style={{ fontFamily: "'Alike', serif", fontSize: 12, color: OLIVE, flexShrink: 0, width: 18, paddingTop: 1 }}>
              {i + 1}.
            </span>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: 4 }}>
                  <textarea value={step.text} onChange={(e) => updStep(i, e.target.value)}
                    placeholder="Krok..."
                    style={{ ...inputStyle, resize: 'none', minHeight: 48, lineHeight: '155%' }}
                  />
                  <button onClick={() => removeStep(i)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14, color: '#bbb', padding: 0, flexShrink: 0, alignSelf: 'flex-start',
                  }}>×</button>
                </div>
              ) : (
                <>
                  <p style={{ fontFamily: "'Alike', serif", fontSize: 12, color: OLIVE, lineHeight: '165%' }}>
                    {step.text}
                  </p>
                  {step.timer_minutes && (
                    <span style={{ display: 'inline-block', marginTop: 4, fontSize: 11, color: OLIVE,
                      background: '#E8EAA0', padding: '2px 9px', borderRadius: 10 }}>
                      ⏱ {step.timer_minutes} min
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add step */}
        {isEditing && (
          <button onClick={addStep} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Alike', serif", fontSize: 11, color: OLIVE, padding: 0, marginBottom: 20,
          }}>
            <img src="/plus.png" alt="+" style={{ width: 18, height: 18 }} /> krok
          </button>
        )}

        {/* Save button in edit mode */}
        {isEditing && (
          <button onClick={() => {
            const saved = { ...recipe, updated_at: new Date().toISOString() };
            if (isNew) {
              const newId = Date.now().toString();
              addRecipe({ ...saved, id: newId, created_at: new Date().toISOString() });
            } else {
              updateRecipe(saved);
            }
            setIsEditing(false);
            setShowMenu(false);
          }} style={{
            width: '100%', padding: '12px 0', borderRadius: 27,
            background: YELLOW, border: 'none', cursor: 'pointer',
            fontFamily: "'Alike', serif", fontSize: 14, color: OLIVE,
            boxShadow: '0px 2px 5px 0px rgba(152,152,12,0.22)', marginTop: 8,
          }}>
            Uložiť
          </button>
        )}

      </div>

      {/* Close menu on outside click */}
      {showMenu && (
        <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
      )}

      {/* Crop modal */}
      {cropSrc && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Cropper area */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom slider */}
          <div style={{ padding: '16px 24px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'Alike', serif" }}>−</span>
            <input type="range" min={1} max={3} step={0.05} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ flex: 1, accentColor: YELLOW }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'Alike', serif" }}>+</span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, padding: '8px 24px 32px' }}>
            <button onClick={() => setCropSrc(null)} style={{
              flex: 1, padding: '12px 0', borderRadius: 27,
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              fontFamily: "'Alike', serif", fontSize: 14, color: 'white',
            }}>Zrušiť</button>
            <button onClick={confirmCrop} style={{
              flex: 1, padding: '12px 0', borderRadius: 27,
              background: YELLOW, border: 'none', cursor: 'pointer',
              fontFamily: "'Alike', serif", fontSize: 14, color: OLIVE,
              boxShadow: '0 2px 8px rgba(104,104,3,0.3)',
            }}>Potvrdiť</button>
          </div>
        </div>
      )}
    </div>
  );
}
