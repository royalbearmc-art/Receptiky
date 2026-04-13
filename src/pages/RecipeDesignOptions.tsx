import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRecipes } from '../lib/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const recipe = mockRecipes[2];
const OLIVE = '#D9D95D';
const OLIVE_DARK = '#686803';
const OVERLAY = '#E8EAA0';
const BG = '#F9FDEA';
const FONT_TITLE = "'Srisakdi', cursive";
const FONT_BODY = "'Alike', serif";

// ─── DESIGN 1: Clean Book ────────────────────────────────────────────────────
function Design1({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-svh max-w-sm mx-auto w-full flex flex-col" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ backgroundColor: OLIVE }}>
        <button onClick={onBack} className="mb-3 text-sm flex items-center gap-1" style={{ color: OLIVE_DARK, fontFamily: FONT_BODY }}>
          ← späť
        </button>
        <h1 style={{ fontFamily: FONT_TITLE, fontSize: 24, color: OLIVE_DARK, lineHeight: 1.2 }}>
          {recipe.title}
        </h1>
        <div className="flex gap-2 mt-3 flex-wrap">
          {recipe.tags.map(tag => (
            <Badge key={tag} style={{ backgroundColor: 'rgba(255,255,255,0.4)', color: OLIVE_DARK, fontFamily: FONT_BODY, border: 'none' }}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Photo */}
      <div className="mx-5 -mt-1 rounded-b-2xl overflow-hidden" style={{ height: 200, backgroundColor: OVERLAY }}>
        {recipe.photo_url
          ? <img src={recipe.photo_url} className="w-full h-full object-cover" alt="" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>}
      </div>

      {/* Ingredients */}
      <Card className="mx-5 mt-4 border-0 shadow-sm" style={{ backgroundColor: OVERLAY }}>
        <CardHeader className="pb-2 pt-4 px-4">
          <p style={{ fontFamily: FONT_TITLE, fontSize: 18, color: OLIVE_DARK }}>Ingrediencie</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {recipe.ingredients.map((ing, i) => (
            <div key={i}>
              <div className="flex justify-between py-2">
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: '#333' }}>{ing.name}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: OLIVE_DARK, fontWeight: 500 }}>{ing.amount} {ing.unit}</span>
              </div>
              {i < recipe.ingredients.length - 1 && <Separator style={{ backgroundColor: '#d4d87a' }} />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="mx-5 mt-4 mb-10">
        <p style={{ fontFamily: FONT_TITLE, fontSize: 18, color: OLIVE_DARK }} className="mb-4">Postup</p>
        {recipe.steps.map((step, i) => (
          <div key={i} className="flex gap-3 mb-4">
            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: OLIVE, color: OLIVE_DARK, fontFamily: FONT_BODY }}>
              {i + 1}
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: '#333', lineHeight: 1.6, paddingTop: 2 }}>{step.text}
              {step.timer_minutes && <span style={{ color: OLIVE_DARK }}> · {step.timer_minutes} min</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DESIGN 2: Magazine ──────────────────────────────────────────────────────
function Design2({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-svh max-w-sm mx-auto w-full flex flex-col bg-white">
      {/* Hero */}
      <div className="relative w-full flex items-center justify-center" style={{ height: 280, backgroundColor: OLIVE }}>
        {recipe.photo_url
          ? <img src={recipe.photo_url} className="w-full h-full object-cover" alt="" />
          : <span className="text-8xl">🌿</span>}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)' }} />
        <button onClick={onBack} className="absolute top-12 left-5 w-9 h-9 rounded-full flex items-center justify-center shadow"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: OLIVE_DARK, fontFamily: FONT_BODY }}>
          ←
        </button>
        <h1 className="absolute bottom-5 left-5 right-5 text-white"
          style={{ fontFamily: FONT_TITLE, fontSize: 22, lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
          {recipe.title}
        </h1>
      </div>

      {/* Tags */}
      <div className="flex gap-2 px-5 pt-4 flex-wrap">
        {recipe.tags.map(tag => (
          <Badge key={tag} style={{ backgroundColor: OLIVE, color: OLIVE_DARK, fontFamily: FONT_BODY, border: 'none' }}>{tag}</Badge>
        ))}
      </div>

      {/* 2-col ingredients */}
      <div className="px-5 mt-5">
        <p style={{ fontFamily: FONT_TITLE, fontSize: 18, color: OLIVE_DARK }} className="mb-3">Ingrediencie</p>
        <div className="grid grid-cols-2 gap-2">
          {recipe.ingredients.map((ing, i) => (
            <Card key={i} className="border-0 shadow-none" style={{ backgroundColor: OVERLAY }}>
              <CardContent className="px-3 py-2.5">
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: OLIVE_DARK }}>{ing.amount} {ing.unit}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#333', fontWeight: 500 }}>{ing.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline steps */}
      <div className="px-5 mt-5 mb-10">
        <p style={{ fontFamily: FONT_TITLE, fontSize: 18, color: OLIVE_DARK }} className="mb-4">Postup</p>
        <div className="relative pl-6 border-l-2" style={{ borderColor: OLIVE }}>
          {recipe.steps.map((step, i) => (
            <div key={i} className="mb-5 relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: OLIVE, top: 3 }} />
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: '#333', lineHeight: 1.6 }}>{step.text}</p>
              {step.timer_minutes && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: OVERLAY, color: OLIVE_DARK, fontFamily: FONT_BODY }}>
                  ⏱ {step.timer_minutes} min
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN 3: Card Style ────────────────────────────────────────────────────
function Design3({ onBack }: { onBack: () => void }) {
  const gradient = 'linear-gradient(to bottom, #D9D95D 0%, #E3E488 30%, #FAFEEB 70%)';
  return (
    <div className="min-h-svh max-w-sm mx-auto w-full flex flex-col" style={{ background: gradient }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <button onClick={onBack} className="mb-4 text-sm flex items-center gap-1" style={{ color: OLIVE_DARK, fontFamily: FONT_BODY }}>
          ← späť
        </button>
        <h1 style={{ fontFamily: FONT_TITLE, fontSize: 26, color: OLIVE_DARK, lineHeight: 1.2 }}>{recipe.title}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: OLIVE_DARK, color: OLIVE_DARK, fontFamily: FONT_BODY }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Oval photo */}
      <div className="flex justify-center my-4">
        <div className="rounded-[50%] overflow-hidden flex items-center justify-center shadow-md" style={{ width: 150, height: 180, backgroundColor: OVERLAY }}>
          {recipe.photo_url
            ? <img src={recipe.photo_url} className="w-full h-full object-cover" alt="" />
            : <span className="text-5xl">🌿</span>}
        </div>
      </div>

      {/* Ingredients card */}
      <Card className="mx-5 border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}>
        <CardHeader className="pb-2 pt-4 px-4">
          <p style={{ fontFamily: FONT_TITLE, fontSize: 17, color: OLIVE_DARK }}>Ingrediencie</p>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
          {recipe.ingredients.map((ing, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: OLIVE, color: OLIVE_DARK, fontFamily: FONT_BODY }}>
              {ing.amount} {ing.unit} {ing.name}
            </span>
          ))}
        </CardContent>
      </Card>

      {/* Steps card */}
      <Card className="mx-5 mt-3 mb-10 border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}>
        <CardHeader className="pb-2 pt-4 px-4">
          <p style={{ fontFamily: FONT_TITLE, fontSize: 17, color: OLIVE_DARK }}>Postup</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: OLIVE, color: OLIVE_DARK, fontFamily: FONT_BODY }}>{i + 1}</span>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: '#333', lineHeight: 1.6 }}>{step.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SELECTOR ────────────────────────────────────────────────────────────────
export default function RecipeDesignOptions() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<1 | 2 | 3 | null>(null);

  if (selected === 1) return <Design1 onBack={() => setSelected(null)} />;
  if (selected === 2) return <Design2 onBack={() => setSelected(null)} />;
  if (selected === 3) return <Design3 onBack={() => setSelected(null)} />;

  return (
    <div className="min-h-svh max-w-sm mx-auto w-full flex flex-col px-5 py-12" style={{ backgroundColor: BG }}>
      <h1 style={{ fontFamily: FONT_TITLE, fontSize: 28, color: OLIVE_DARK }} className="mb-1">Vyber dizajn</h1>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#888' }} className="mb-8">Tap to preview each design</p>

      <div className="flex flex-col gap-4">
        {([
          { n: 1 as const, label: 'Clean Book', desc: 'Olive header · ingredient list · numbered steps' },
          { n: 2 as const, label: 'Magazine', desc: 'Full hero photo · 2-col grid · timeline steps' },
          { n: 3 as const, label: 'Recipe Card', desc: 'Gradient · oval photo · frosted glass cards' },
        ]).map(({ n, label, desc }) => (
          <Card key={n} className="border-0 shadow-sm cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: n === 1 ? OLIVE : n === 2 ? OVERLAY : '#fff', border: `1px solid ${OLIVE_DARK}20` }}
            onClick={() => setSelected(n)}>
            <CardContent className="px-5 py-4">
              <p style={{ fontFamily: FONT_TITLE, fontSize: 20, color: OLIVE_DARK }}>{n}. {label}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: '#666', marginTop: 3 }}>{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="mt-8 text-sm self-center" style={{ color: OLIVE_DARK, fontFamily: FONT_BODY }}>
        ← Back to home
      </button>
    </div>
  );
}
