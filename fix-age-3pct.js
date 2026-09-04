'use strict';
const fs = require('fs');

const files = [
  __dirname + '/age-calculator.html',
  __dirname + '/ar/age-calculator/index.html',
  __dirname + '/de/age-calculator/index.html',
  __dirname + '/es/age-calculator/index.html',
  __dirname + '/fr/age-calculator/index.html',
  __dirname + '/ru/age-calculator/index.html',
];

// Each entry: [exactOldString, exactNewString]
const replacements = [
  // ── Arabic JS object (short form — no example) ──
  [
    'لهذا يكون العمر بالهجري أكبر من الميلادي دائماً بحوالي 3%.',
    'السنة الهجرية أقصر بحوالي 11 يوماً، لذا يكون عمرك الهجري أكبر دائماً — مثلاً: 30 سنة ميلادية ≈ 30.9 سنة هجرية.',
  ],
  // ── Arabic JSON-LD (longer form — has the 30→30.9 example already) ──
  [
    'لهذا يكون العمر بالهجري أكبر من الميلادي دائماً بحوالي 3% — شخص عمره 30 ميلادياً يكون عمره حوالي 30.9 هجرياً.',
    'السنة الهجرية أقصر بحوالي 11 يوماً، لذا يكون العمر الهجري أكبر دائماً — مثلاً: شخص عمره 30 ميلادياً يكون عمره حوالي 30.9 هجرياً.',
  ],
  // ── French ──
  [
    "Votre âge hégirien est donc toujours environ 3% plus élevé.",
    "L'année hégirienne est plus courte d'environ 11 jours, donc votre âge hégirien sera toujours supérieur — par exemple, 30 ans grégoriens ≈ 30,9 ans hégiriens.",
  ],
  // ── Spanish ──
  [
    "Por eso tu edad hijri siempre es aproximadamente un 3% mayor.",
    "El año hijri es más corto unos 11 días, por lo que tu edad hijri siempre será mayor — por ejemplo, 30 años gregorianos ≈ 30,9 años hijri.",
  ],
  // ── German ──
  [
    "Ihr Hijri-Alter ist daher immer etwa 3% höher.",
    "Das Hijri-Jahr ist etwa 11 Tage kürzer, daher ist Ihr Hijri-Alter immer größer — zum Beispiel: 30 gregorianische Jahre ≈ 30,9 Hijri-Jahre.",
  ],
  // ── Russian ──
  [
    "Поэтому возраст по хиджре всегда примерно на 3% больше.",
    "Год хиджры примерно на 11 дней короче, поэтому ваш возраст по хиджре всегда больше — например, 30 григорианских лет ≈ 30,9 лет хиджры.",
  ],
];

let totalFixed = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = 0;
  for (const [oldStr, newStr] of replacements) {
    if (content.includes(oldStr)) {
      content = content.split(oldStr).join(newStr);
      changed++;
    }
  }
  if (changed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${changed} occurrence(s) in ${filePath.replace(__dirname, '.')}`);
    totalFixed += changed;
  } else {
    console.log(`No changes needed: ${filePath.replace(__dirname, '.')}`);
  }
}

console.log(`\nTotal replacements made: ${totalFixed}`);
