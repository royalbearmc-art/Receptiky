/** Slovak → English ingredient name map */
export const skToEn: Record<string, string> = {
  // eggs & dairy
  vajce: 'egg', vajcia: 'eggs', vajíčko: 'egg', vajíčka: 'eggs',
  mlieko: 'milk', maslo: 'butter', smotana: 'cream',
  'smotana na šľahanie': 'whipping cream', 'kyslá smotana': 'sour cream',
  jogurt: 'yogurt', tvaroh: 'quark', ricotta: 'ricotta',
  syr: 'cheese', parmezán: 'parmesan', mozzarella: 'mozzarella',
  ementál: 'emmental', feta: 'feta',

  // flour, grains, baking
  múka: 'flour', 'pšeničná múka': 'wheat flour', 'ryžová múka': 'rice flour',
  'celozrnná múka': 'whole wheat flour', škrob: 'starch', 'kukuričný škrob': 'cornstarch',
  kvasnice: 'yeast', 'prášok do pečiva': 'baking powder', 'sóda bikarbóna': 'baking soda',
  ryža: 'rice', cestoviny: 'pasta', špagety: 'spaghetti', makaróny: 'macaroni',
  ovsené: 'oats', ovos: 'oats', pohánka: 'buckwheat', quinoa: 'quinoa',
  krupica: 'semolina', chlieb: 'bread', žemľa: 'bread roll',

  // sweeteners
  cukor: 'sugar', 'práškový cukor': 'powdered sugar', 'hnedý cukor': 'brown sugar',
  med: 'honey', javorový: 'maple syrup', agáve: 'agave syrup',
  vanilka: 'vanilla', 'vanilkový cukor': 'vanilla sugar',

  // oils & vinegar
  olej: 'oil', 'olivový olej': 'olive oil', 'slnečnicový olej': 'sunflower oil',
  'kokosový olej': 'coconut oil', ocot: 'vinegar', 'balzamikový ocot': 'balsamic vinegar',

  // salt & spices
  soľ: 'salt', korenie: 'pepper', 'čierne korenie': 'black pepper',
  paprika: 'paprika', 'sladká paprika': 'sweet paprika', 'štipľavá paprika': 'hot paprika',
  kurkuma: 'turmeric', škorica: 'cinnamon', muškát: 'nutmeg', klinčeky: 'cloves',
  rasca: 'caraway', kmín: 'cumin', koriander: 'coriander', bazalka: 'basil',
  oregano: 'oregano', tymián: 'thyme', rozmarín: 'rosemary', petržlen: 'parsley',
  pažítka: 'chives', estragón: 'tarragon', mäta: 'mint', bobkový: 'bay leaf',
  šafran: 'saffron', chilli: 'chili', zázvor: 'ginger', cesnak: 'garlic',

  // vegetables
  cibuľa: 'onion', 'červená cibuľa': 'red onion', šalotka: 'shallot',
  mrkva: 'carrot', zeler: 'celery', petržlenový: 'parsley root',
  zemiaky: 'potato', zemiak: 'potato', batát: 'sweet potato',
  paradajky: 'tomato', paradajka: 'tomato', 'cherry paradajky': 'cherry tomatoes',
  paprika2: 'bell pepper', 'červená paprika': 'red pepper', 'žltá paprika': 'yellow pepper',
  uhorka: 'cucumber', cuketa: 'zucchini', baklažán: 'eggplant',
  kapusta: 'cabbage', 'červená kapusta': 'red cabbage', kel: 'kale',
  špenát: 'spinach', šalát: 'lettuce', rukola: 'arugula',
  brokolica: 'broccoli', karfiol: 'cauliflower', ružičkový: 'brussels sprouts',
  hrášok: 'peas', fazuľa: 'beans', šošovica: 'lentils', cícer: 'chickpeas',
  kukurica: 'corn', repa: 'beet', tekvica: 'pumpkin', 'tekvica hokkaidó': 'hokkaido squash',
  šampiňóny: 'mushrooms', hríby: 'mushrooms', lišky: 'chanterelles',
  pórek: 'leek', artičok: 'artichoke', špargľa: 'asparagus', avokádo: 'avocado',
  chren: 'horseradish',

  // fruit
  jablko: 'apple', hruška: 'pear', banán: 'banana', citrón: 'lemon',
  limetka: 'lime', pomaranč: 'orange', grapefruit: 'grapefruit',
  jahody: 'strawberries', maliny: 'raspberries', čučoriedky: 'blueberries',
  ríbezle: 'currants', egreš: 'gooseberry', broskyňa: 'peach',
  marhule: 'apricot', slivky: 'plum', čerešne: 'cherries',
  hrozno: 'grapes', melón: 'melon', ananás: 'pineapple', mango: 'mango',
  kiwi: 'kiwi', kokos: 'coconut', datle: 'dates', figy: 'figs',
  hrozienka: 'raisins', sušené: 'dried fruit',

  // meat & fish
  kurča: 'chicken', 'kuracie prsia': 'chicken breast', 'kuracie stehno': 'chicken thigh',
  hovädzie: 'beef', 'mleté mäso': 'ground meat', 'mleté hovädzie': 'ground beef',
  bravčové: 'pork', krkovička: 'pork neck', rebrá: 'ribs', šunka: 'ham',
  slanina: 'bacon', pancetta: 'pancetta', klobása: 'sausage', salám: 'salami',
  morka: 'turkey', kačica: 'duck', jahňacie: 'lamb',
  losos: 'salmon', tuniak: 'tuna', treska: 'cod', pstruh: 'trout',
  kapor: 'carp', sardinky: 'sardines', krevety: 'shrimp', krevetky: 'shrimp',

  // nuts & seeds
  mandle: 'almonds', vlašské: 'walnuts', lieskové: 'hazelnuts',
  kešu: 'cashews', pistácie: 'pistachios', arašidy: 'peanuts',
  'arašidové maslo': 'peanut butter', sezam: 'sesame',
  'slnečnicové semienka': 'sunflower seeds', 'tekvicové semienka': 'pumpkin seeds',
  chia: 'chia seeds', ľan: 'flaxseeds',

  // sauces & condiments
  horčica: 'mustard', kečup: 'ketchup', majonéza: 'mayonnaise',
  'sójová omáčka': 'soy sauce', tabasco: 'tabasco', worcester: 'worcestershire sauce',
  'paradajkový pretlak': 'tomato paste', pesto: 'pesto', hummus: 'hummus',

  // chocolate & baking extras
  čokoláda: 'chocolate', 'horká čokoláda': 'dark chocolate',
  'mliečna čokoláda': 'milk chocolate', kakao: 'cocoa powder',
  'čokoládové lupienky': 'chocolate chips', karamel: 'caramel',
  želatína: 'gelatin', agar: 'agar',

  // liquids
  voda: 'water', 'minerálna voda': 'sparkling water',
  'vývar': 'broth', 'kurací vývar': 'chicken broth', 'hovädzí vývar': 'beef broth',
  víno: 'wine', 'biele víno': 'white wine', 'červené víno': 'red wine',
  pivo: 'beer', rum: 'rum', brandy: 'brandy',
  'citrusová šťava': 'citrus juice', 'pomarančová šťava': 'orange juice',
};

/** Normalise a Slovak ingredient name and return English equivalent or original */
export function translateIngredient(name: string): string {
  const lower = name.trim().toLowerCase();
  // exact match
  if (skToEn[lower]) return skToEn[lower];
  // partial match — check if any key is contained in the name
  for (const [sk, en] of Object.entries(skToEn)) {
    if (lower.includes(sk)) return en;
  }
  // return original (might already be English or close enough)
  return lower;
}
