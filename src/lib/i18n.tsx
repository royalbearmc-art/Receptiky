import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'sk' | 'en';

type Dict = Record<string, string>;

const sk: Dict = {
  // Cover
  'cover.title': 'Moje receptíky',
  'cover.recipes': 'Recepty',
  'cover.calendar': 'Kalendár',
  'cover.settings': 'Nastavenia',

  // SignIn
  'signin.title': 'Moje receptíky',
  'signin.email': 'email@example.com',
  'signin.password': 'heslo',
  'signin.submit.signin': 'Prihlásiť sa',
  'signin.submit.signup': 'Vytvoriť účet',
  'signin.toggle.to-signup': 'Nemáš účet? Vytvoriť',
  'signin.toggle.to-signin': 'Už máš účet? Prihlásiť',
  'signin.info.confirm': 'Skontroluj si email a klikni na potvrdzovací link.',
  'signin.err.missing': 'Vyplň email aj heslo.',
  'signin.err.short-password': 'Heslo musí mať aspoň 6 znakov.',
  'signin.err.generic': 'Niečo sa pokazilo.',

  // Library
  'library.title': 'Receptíky',
  'library.sort.alpha': 'A–Z',
  'library.sort.last-edited': 'Naposledy upravené',
  'library.sort.first-edited': 'Najskôr pridané',
  'library.sort.duration': 'Čas prípravy',
  'library.view.all': 'Všetky recepty',
  'library.view.tags': 'Podľa tagov',
  'library.empty.line1': 'Zatiaľ nemáš',
  'library.empty.line2': 'žiadne receptíky',
  'library.count.recipes': 'receptov',

  // Detail
  'detail.not-found': 'Recept sa nenašiel.',
  'detail.title-placeholder': 'Názov receptu...',
  'detail.edit': 'Upraviť recept',
  'detail.delete': 'Zmazať recept',
  'detail.delete.confirm': 'Naozaj zmazať tento recept?',
  'detail.delete.yes': 'Áno, zmazať',
  'detail.delete.no': 'Zrušiť',
  'detail.new-tag': 'Nový tag:',
  'detail.add-tag': '+ tag',
  'detail.ing.amount': 'Mn.',
  'detail.ing.unit': 'jedn.',
  'detail.ing.name': 'Ingrediencia',
  'detail.ing.add': 'ingrediencia',
  'detail.step.placeholder': 'Krok...',
  'detail.step.add': 'krok',
  'detail.photo.change': 'Zmeniť fotku',
  'detail.photo.crop': 'Orezať',
  'detail.macros.title': 'Výživové hodnoty',
  'detail.macros.calories': 'Kalórie',
  'detail.macros.protein': 'Bielkoviny',
  'detail.macros.carbs': 'Sacharidy',
  'detail.macros.fat': 'Tuky',
  'detail.macros.fiber': 'Vláknina',
  'detail.macros.placeholder': 'Hodnoty budú dostupné čoskoro',
  'detail.macros.loading': 'Počítam výživové hodnoty…',
  'detail.macros.empty-hint': 'Pridaj ingrediencie pre výpočet hodnôt',
  'detail.macros.source': 'Dáta: Open Food Facts & USDA',
  'detail.save': 'Uložiť',
  'detail.crop.confirm': 'Potvrdiť',
  'detail.crop.cancel': 'Zrušiť',
  'detail.crop.uploading': 'Nahrávam…',
  'detail.crop.error': 'Nahrávanie zlyhalo.',
  'detail.time.hours': 'hod',
  'detail.time.minutes': 'min',

  // Settings
  'settings.title': 'Nastavenia',
  'settings.account': 'Účet',
  'settings.account.email': 'Email',
  'settings.account.password': 'Zmeniť heslo',
  'settings.account.password.sending': 'Odosielam…',
  'settings.account.password.sent': 'Email s odkazom bol odoslaný.',
  'settings.account.password.error': 'Nepodarilo sa odoslať email.',
  'settings.account.signout': 'Odhlásiť sa',
  'settings.appearance': 'Vzhľad',
  'settings.appearance.theme': 'Téma',
  'settings.appearance.theme.light': 'Svetlá',
  'settings.appearance.language': 'Jazyk',
  'settings.about': 'O aplikácii',
  'settings.about.version': 'Verzia',
  'settings.appearance.cover': 'Titulná strana',
  'settings.appearance.cover.classic': 'Narcisky',
  'settings.appearance.cover.new': 'Kuchtíčky',
  'settings.more-coming': 'Viac nastavení čoskoro',

  // Reset password page
  'reset.title': 'Nové heslo',
  'reset.password': 'Nové heslo',
  'reset.password-again': 'Zopakuj heslo',
  'reset.submit': 'Uložiť heslo',
  'reset.err.mismatch': 'Heslá sa nezhodujú.',
  'reset.err.short': 'Heslo musí mať aspoň 6 znakov.',
  'reset.err.generic': 'Heslo sa nepodarilo zmeniť.',
  'reset.success': 'Heslo bolo zmenené.',
  'reset.back-to-app': 'Späť do aplikácie',
};

const en: Dict = {
  // Cover
  'cover.title': 'My recipes',
  'cover.recipes': 'Recipes',
  'cover.calendar': 'Calendar',
  'cover.settings': 'Settings',

  // SignIn
  'signin.title': 'My recipes',
  'signin.email': 'email@example.com',
  'signin.password': 'password',
  'signin.submit.signin': 'Sign in',
  'signin.submit.signup': 'Create account',
  'signin.toggle.to-signup': "No account? Sign up",
  'signin.toggle.to-signin': 'Have an account? Sign in',
  'signin.info.confirm': 'Check your inbox and click the confirmation link.',
  'signin.err.missing': 'Enter email and password.',
  'signin.err.short-password': 'Password must be at least 6 characters.',
  'signin.err.generic': 'Something went wrong.',

  // Library
  'library.title': 'Recipes',
  'library.sort.alpha': 'A–Z',
  'library.sort.last-edited': 'Recently edited',
  'library.sort.first-edited': 'Oldest first',
  'library.sort.duration': 'Cooking time',
  'library.view.all': 'All recipes',
  'library.view.tags': 'By tags',
  'library.empty.line1': "You don't have",
  'library.empty.line2': 'any recipes yet',
  'library.count.recipes': 'recipes',

  // Detail
  'detail.not-found': 'Recipe not found.',
  'detail.title-placeholder': 'Recipe name...',
  'detail.edit': 'Edit recipe',
  'detail.delete': 'Delete recipe',
  'detail.delete.confirm': 'Really delete this recipe?',
  'detail.delete.yes': 'Yes, delete',
  'detail.delete.no': 'Cancel',
  'detail.new-tag': 'New tag:',
  'detail.add-tag': '+ tag',
  'detail.ing.amount': 'Qty',
  'detail.ing.unit': 'unit',
  'detail.ing.name': 'Ingredient',
  'detail.ing.add': 'ingredient',
  'detail.step.placeholder': 'Step...',
  'detail.step.add': 'step',
  'detail.photo.change': 'Change photo',
  'detail.photo.crop': 'Crop',
  'detail.macros.title': 'Nutrition',
  'detail.macros.calories': 'Calories',
  'detail.macros.protein': 'Protein',
  'detail.macros.carbs': 'Carbs',
  'detail.macros.fat': 'Fat',
  'detail.macros.fiber': 'Fiber',
  'detail.macros.placeholder': 'Values coming soon',
  'detail.macros.loading': 'Calculating nutrition…',
  'detail.macros.empty-hint': 'Add ingredients to calculate values',
  'detail.macros.source': 'Data: Open Food Facts & USDA',
  'detail.save': 'Save',
  'detail.crop.confirm': 'Confirm',
  'detail.crop.cancel': 'Cancel',
  'detail.crop.uploading': 'Uploading…',
  'detail.crop.error': 'Upload failed.',
  'detail.time.hours': 'h',
  'detail.time.minutes': 'min',

  // Settings
  'settings.title': 'Settings',
  'settings.account': 'Account',
  'settings.account.email': 'Email',
  'settings.account.password': 'Change password',
  'settings.account.password.sending': 'Sending…',
  'settings.account.password.sent': 'Email with the link has been sent.',
  'settings.account.password.error': 'Failed to send email.',
  'settings.account.signout': 'Sign out',
  'settings.appearance': 'Appearance',
  'settings.appearance.theme': 'Theme',
  'settings.appearance.theme.light': 'Light',
  'settings.appearance.language': 'Language',
  'settings.about': 'About',
  'settings.about.version': 'Version',
  'settings.appearance.cover': 'Cover design',
  'settings.appearance.cover.classic': 'Narcisky',
  'settings.appearance.cover.new': 'Kuchtíčky',
  'settings.more-coming': 'More settings coming soon',

  // Reset password page
  'reset.title': 'New password',
  'reset.password': 'New password',
  'reset.password-again': 'Repeat password',
  'reset.submit': 'Save password',
  'reset.err.mismatch': 'Passwords do not match.',
  'reset.err.short': 'Password must be at least 6 characters.',
  'reset.err.generic': 'Could not change password.',
  'reset.success': 'Password changed.',
  'reset.back-to-app': 'Back to app',
};

const dictionaries: Record<Lang, Dict> = { sk, en };

export type CoverTheme = 'classic' | 'new';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  coverTheme: CoverTheme;
  setCoverTheme: (t: CoverTheme) => void;
}

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'sk';
    const saved = localStorage.getItem('lang');
    return saved === 'en' || saved === 'sk' ? saved : 'sk';
  });

  const [coverTheme, setCoverThemeState] = useState<CoverTheme>(() => {
    if (typeof window === 'undefined') return 'new';
    const saved = localStorage.getItem('coverTheme');
    return saved === 'classic' ? 'classic' : 'new'; // 'new' (Kuchtíčky) is default
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => dictionaries[lang][key] ?? key;

  const setCoverTheme = (theme: CoverTheme) => {
    setCoverThemeState(theme);
    localStorage.setItem('coverTheme', theme);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, coverTheme, setCoverTheme }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useT must be used inside LanguageProvider');
  return ctx;
}
