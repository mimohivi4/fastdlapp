'use strict';
const fs = require('fs');
const path = require('path');

// Fix 2 hardcoded-Arabic issues in quick-math.html and its 5 variants:
// 1. card-subtitle has no id and is never updated by updateText()
// 2. renderLevelUI() hardcodes "المستوى" instead of using tr('levelLbl')

const FILES = [
  'quick-math.html',
  'ar/quick-math/index.html',
  'de/quick-math/index.html',
  'es/quick-math/index.html',
  'fr/quick-math/index.html',
  'ru/quick-math/index.html',
];

// --- Patch 1: Add id to subtitle div (root only gets English text; variants keep existing)
const SUBTITLE_OLD = `    <div class="card-subtitle">100 مستوى — من مبتدئ إلى غير قابل للتصديق 🔥</div>`;
const SUBTITLE_NEW_ROOT = `    <div class="card-subtitle" id="qmSubtitle">100 levels — Beginner to Unbelievable 🔥</div>`;
const SUBTITLE_NEW_VAR  = `    <div class="card-subtitle" id="qmSubtitle">100 مستوى — من مبتدئ إلى غير قابل للتصديق 🔥</div>`;

// --- Patch 2: Add levelLbl + subtitleLbl to each QT language ---
const LANG_PATCHES = [
  // ar
  {
    old: `    right:'✅ صحيح!',wrong:'❌ الجواب: {a}',timeUp:'⏰ الوقت! الجواب: {a}'},`,
    new: `    right:'✅ صحيح!',wrong:'❌ الجواب: {a}',timeUp:'⏰ الوقت! الجواب: {a}',levelLbl:'المستوى',subtitleLbl:'100 مستوى — من مبتدئ إلى غير قابل للتصديق 🔥'},`,
  },
  // en
  {
    old: `    right:'✅ Correct!',wrong:'❌ Answer: {a}',timeUp:'⏰ Time\\'s up! Answer: {a}'},`,
    new: `    right:'✅ Correct!',wrong:'❌ Answer: {a}',timeUp:'⏰ Time\\'s up! Answer: {a}',levelLbl:'Level',subtitleLbl:'100 levels — Beginner to Unbelievable 🔥'},`,
  },
  // fr
  {
    old: `    right:'✅ Correct!',wrong:'❌ Réponse: {a}',timeUp:'⏰ Temps! Réponse: {a}'},`,
    new: `    right:'✅ Correct!',wrong:'❌ Réponse: {a}',timeUp:'⏰ Temps! Réponse: {a}',levelLbl:'Niveau',subtitleLbl:'100 niveaux — Débutant à Incroyable 🔥'},`,
  },
  // es
  {
    old: `    right:'✅ ¡Correcto!',wrong:'❌ Respuesta: {a}',timeUp:'⏰ ¡Tiempo! Respuesta: {a}'},`,
    new: `    right:'✅ ¡Correcto!',wrong:'❌ Respuesta: {a}',timeUp:'⏰ ¡Tiempo! Respuesta: {a}',levelLbl:'Nivel',subtitleLbl:'100 niveles — Principiante a Increíble 🔥'},`,
  },
  // de
  {
    old: `    right:'✅ Richtig!',wrong:'❌ Antwort: {a}',timeUp:'⏰ Zeit! Antwort: {a}'},`,
    new: `    right:'✅ Richtig!',wrong:'❌ Antwort: {a}',timeUp:'⏰ Zeit! Antwort: {a}',levelLbl:'Level',subtitleLbl:'100 Level — Anfänger bis Unglaublich 🔥'},`,
  },
  // ru
  {
    old: `    right:'✅ Правильно!',wrong:'❌ Ответ: {a}',timeUp:'⏰ Время! Ответ: {a}'},`,
    new: `    right:'✅ Правильно!',wrong:'❌ Ответ: {a}',timeUp:'⏰ Время! Ответ: {a}',levelLbl:'Уровень',subtitleLbl:'100 уровней — Новичок до Невероятного 🔥'},`,
  },
];

// --- Patch 3: Fix renderLevelUI() to use tr('levelLbl') ---
const RENDER_OLD = "  document.getElementById('levelNumLbl').textContent=`المستوى ${level} / ${MAX_LEVEL}`;";
const RENDER_NEW = "  document.getElementById('levelNumLbl').textContent=`${tr('levelLbl')} ${level} / ${MAX_LEVEL}`;";

// --- Patch 4: Add subtitle update to updateText() ---
const UPDATETEXT_OLD = `  renderLevelUI();renderLb();
}`;
const UPDATETEXT_NEW = `  renderLevelUI();renderLb();
  const _sub=document.getElementById('qmSubtitle');if(_sub)_sub.textContent=t.subtitleLbl;
}`;

let totalPatched = 0, totalMissed = 0;

for (const file of FILES) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) { console.log(`SKIP (not found): ${file}`); continue; }
  let c = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  const isRoot = file === 'quick-math.html';

  // Patch 1: subtitle id
  const subtitleNew = isRoot ? SUBTITLE_NEW_ROOT : SUBTITLE_NEW_VAR;
  if (c.includes(SUBTITLE_OLD)) {
    c = c.replace(SUBTITLE_OLD, subtitleNew);
    console.log(`  OK  subtitle id: ${file}`);
    totalPatched++; changed = true;
  } else if (c.includes('id="qmSubtitle"')) {
    console.log(`  SKIP (already has id): ${file}`);
  } else {
    console.log(`  MISS subtitle in: ${file}`);
    totalMissed++;
  }

  // Patch 2: QT language keys
  for (const { old, new: neo } of LANG_PATCHES) {
    if (c.includes(old)) {
      c = c.replace(old, neo);
      totalPatched++; changed = true;
    } else if (c.includes('levelLbl') && c.includes('subtitleLbl')) {
      // already patched, skip silently
    } else {
      console.log(`  MISS QT key in: ${file} [${old.slice(0, 40)}]`);
      totalMissed++;
    }
  }

  // Patch 3: renderLevelUI fix
  if (c.includes(RENDER_OLD)) {
    c = c.replace(RENDER_OLD, RENDER_NEW);
    console.log(`  OK  renderLevelUI: ${file}`);
    totalPatched++; changed = true;
  } else if (!c.includes("المستوى ${level}")) {
    console.log(`  SKIP (already fixed renderLevelUI): ${file}`);
  } else {
    console.log(`  MISS renderLevelUI in: ${file}`);
    totalMissed++;
  }

  // Patch 4: updateText() subtitle update
  if (c.includes(UPDATETEXT_OLD) && !c.includes('qmSubtitle')) {
    c = c.replace(UPDATETEXT_OLD, UPDATETEXT_NEW);
    console.log(`  OK  updateText subtitle: ${file}`);
    totalPatched++; changed = true;
  } else if (c.includes('qmSubtitle') && c.includes('_sub.textContent')) {
    console.log(`  SKIP (already has subtitle update): ${file}`);
  } else if (c.includes(UPDATETEXT_OLD)) {
    c = c.replace(UPDATETEXT_OLD, UPDATETEXT_NEW);
    console.log(`  OK  updateText subtitle (re-apply): ${file}`);
    totalPatched++; changed = true;
  } else {
    console.log(`  MISS updateText in: ${file}`);
    totalMissed++;
  }

  if (changed) fs.writeFileSync(fullPath, c, 'utf8');
}

console.log(`\nDone. Patches applied: ${totalPatched}  |  Missed: ${totalMissed}`);

// Verify
console.log('\n── Verification ──');
for (const file of FILES) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) continue;
  const c = fs.readFileSync(fullPath, 'utf8');
  const hasId       = c.includes('id="qmSubtitle"');
  const hasLevelLbl = c.includes("levelLbl:'Level'");
  const hasSubLbl   = c.includes("subtitleLbl:'100 levels");
  const fixedRender = !c.includes("المستوى ${level}");
  const fixedUpdate = c.includes('_sub.textContent=t.subtitleLbl');
  const ok = hasId && hasLevelLbl && hasSubLbl && fixedRender && fixedUpdate;
  console.log(`  ${ok?'OK':'FAIL'}  ${file}  [id:${hasId} levelLbl:${hasLevelLbl} subtitleLbl:${hasSubLbl} render:${fixedRender} update:${fixedUpdate}]`);
}
