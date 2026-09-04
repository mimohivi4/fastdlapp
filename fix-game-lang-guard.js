'use strict';
const fs = require('fs');
const path = require('path');

// Apply ALL matching patches to each file (not break-on-first).
// Each patch: { match: string to find, repl: replacement }

// The bug: _bypassLang=true inside window.setLang makes the onLangChange guard
// think it's a user action, but i18n.js DOMContentLoaded calls window.setLang too,
// so _bypassLang=true gets set there as well — bypassing the guard incorrectly.
//
// Fix: use _initDone flag. Block wrong-lang changes during init (!_initDone),
// allow everything after setTimeout(0) sets _initDone=true and re-asserts page lang.

const MG_ROOT_OLD = `const _PAGE_LANG=document.documentElement.lang||'en';let _bypassLang=false;
document.addEventListener('DOMContentLoaded',()=>{
  currentLang=_PAGE_LANG;if(!MT[currentLang])currentLang='en';
  const origSet=window.setLang;
  window.setLang=function(lang){_bypassLang=true;origSet&&origSet(lang);_bypassLang=false;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  window.onLangChange=function(lang){if(!_bypassLang&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  startLevel(0);
});`;
const MG_ROOT_NEW = `const _PAGE_LANG=document.documentElement.lang||'en';let _initDone=false;
document.addEventListener('DOMContentLoaded',()=>{
  currentLang=_PAGE_LANG;if(!MT[currentLang])currentLang='en';
  const origSet=window.setLang;
  window.setLang=function(lang){origSet&&origSet(lang);if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  window.onLangChange=function(lang){if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  startLevel(0);
  setTimeout(function(){_initDone=true;window.setLang(_PAGE_LANG);},0);
});`;

const MG_VAR_OLD = `const _PAGE_LANG=document.documentElement.lang||'en';let _bypassLang=false;
document.addEventListener('DOMContentLoaded',()=>{
  const origSet=window.setLang;
  window.setLang=function(lang){_bypassLang=true;origSet&&origSet(lang);_bypassLang=false;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  window.onLangChange=function(lang){if(!_bypassLang&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  startLevel(0);
});`;
const MG_VAR_NEW = `const _PAGE_LANG=document.documentElement.lang||'en';let _initDone=false;
document.addEventListener('DOMContentLoaded',()=>{
  const origSet=window.setLang;
  window.setLang=function(lang){origSet&&origSet(lang);if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  window.onLangChange=function(lang){if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();updateStats();renderLb();};
  startLevel(0);
  setTimeout(function(){_initDone=true;window.setLang(_PAGE_LANG);},0);
});`;

// quick-math: top section (root has currentLang= line, variants don't)
const QM_ROOT_TOP_OLD = `const _PAGE_LANG=document.documentElement.lang||'en';let _bypassLang=false;
document.addEventListener('DOMContentLoaded',()=>{
  currentLang=_PAGE_LANG;if(!QT[currentLang])currentLang='en';
  const origSet=window.setLang;
  window.setLang=function(lang){_bypassLang=true;origSet&&origSet(lang);_bypassLang=false;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  window.onLangChange=function(lang){if(!_bypassLang&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  // Pause timer when tab is hidden, resume when visible`;
const QM_ROOT_TOP_NEW = `const _PAGE_LANG=document.documentElement.lang||'en';let _initDone=false;
document.addEventListener('DOMContentLoaded',()=>{
  currentLang=_PAGE_LANG;if(!QT[currentLang])currentLang='en';
  const origSet=window.setLang;
  window.setLang=function(lang){origSet&&origSet(lang);if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  window.onLangChange=function(lang){if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  // Pause timer when tab is hidden, resume when visible`;

const QM_VAR_TOP_OLD = `const _PAGE_LANG=document.documentElement.lang||'en';let _bypassLang=false;
document.addEventListener('DOMContentLoaded',()=>{
  const origSet=window.setLang;
  window.setLang=function(lang){_bypassLang=true;origSet&&origSet(lang);_bypassLang=false;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  window.onLangChange=function(lang){if(!_bypassLang&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  // Pause timer when tab is hidden, resume when visible`;
const QM_VAR_TOP_NEW = `const _PAGE_LANG=document.documentElement.lang||'en';let _initDone=false;
document.addEventListener('DOMContentLoaded',()=>{
  const origSet=window.setLang;
  window.setLang=function(lang){origSet&&origSet(lang);if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  window.onLangChange=function(lang){if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateText();};
  // Pause timer when tab is hidden, resume when visible`;

// quick-math: end of DOMContentLoaded (same for root and variants)
const QM_END_OLD = `  checkContinueBanner();
  startLevel(0);
});
</script>
<script src="i18n.js?v=33"></script>
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('/my-tools-site/sw.js');</script>
</body></html>`;
const QM_END_NEW = `  checkContinueBanner();
  startLevel(0);
  setTimeout(function(){_initDone=true;window.setLang(_PAGE_LANG);},0);
});
</script>
<script src="i18n.js?v=33"></script>
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('/my-tools-site/sw.js');</script>
</body></html>`;

// reaction-test: top section
const RT_ROOT_TOP_OLD = `const _PAGE_LANG=document.documentElement.lang||'en';let _bypassLang=false;
document.addEventListener('DOMContentLoaded',()=>{
  currentLang=_PAGE_LANG;if(!RT[currentLang])currentLang='en';
  const origSet=window.setLang;
  window.setLang=function(lang){_bypassLang=true;origSet&&origSet(lang);_bypassLang=false;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  window.onLangChange=function(lang){if(!_bypassLang&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  // Clear pending timers when tab hides to avoid ghost clicks/misses`;
const RT_ROOT_TOP_NEW = `const _PAGE_LANG=document.documentElement.lang||'en';let _initDone=false;
document.addEventListener('DOMContentLoaded',()=>{
  currentLang=_PAGE_LANG;if(!RT[currentLang])currentLang='en';
  const origSet=window.setLang;
  window.setLang=function(lang){origSet&&origSet(lang);if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  window.onLangChange=function(lang){if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  // Clear pending timers when tab hides to avoid ghost clicks/misses`;

const RT_VAR_TOP_OLD = `const _PAGE_LANG=document.documentElement.lang||'en';let _bypassLang=false;
document.addEventListener('DOMContentLoaded',()=>{
  const origSet=window.setLang;
  window.setLang=function(lang){_bypassLang=true;origSet&&origSet(lang);_bypassLang=false;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  window.onLangChange=function(lang){if(!_bypassLang&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  // Clear pending timers when tab hides to avoid ghost clicks/misses`;
const RT_VAR_TOP_NEW = `const _PAGE_LANG=document.documentElement.lang||'en';let _initDone=false;
document.addEventListener('DOMContentLoaded',()=>{
  const origSet=window.setLang;
  window.setLang=function(lang){origSet&&origSet(lang);if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  window.onLangChange=function(lang){if(!_initDone&&lang!==_PAGE_LANG)return;currentLang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';renderLevelUI();renderLb();};
  // Clear pending timers when tab hides to avoid ghost clicks/misses`;

// reaction-test: end of DOMContentLoaded — ends with startLevel(0); immediately
// (no checkContinueBanner before it, unlike quick-math)
const RT_END_OLD = `  startLevel(0);
});
</script>
<script src="i18n.js?v=33"></script>
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('/my-tools-site/sw.js');</script>
</body></html>`;
const RT_END_NEW = `  startLevel(0);
  setTimeout(function(){_initDone=true;window.setLang(_PAGE_LANG);},0);
});
</script>
<script src="i18n.js?v=33"></script>
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('/my-tools-site/sw.js');</script>
</body></html>`;

// File-to-patch mapping: each file gets an ordered list of patches to apply
const filePatchMap = [
  { file: 'memory-game.html',             patches: [[MG_ROOT_OLD, MG_ROOT_NEW]] },
  { file: 'ar/memory-game/index.html',    patches: [[MG_VAR_OLD,  MG_VAR_NEW]] },
  { file: 'de/memory-game/index.html',    patches: [[MG_VAR_OLD,  MG_VAR_NEW]] },
  { file: 'es/memory-game/index.html',    patches: [[MG_VAR_OLD,  MG_VAR_NEW]] },
  { file: 'fr/memory-game/index.html',    patches: [[MG_VAR_OLD,  MG_VAR_NEW]] },
  { file: 'ru/memory-game/index.html',    patches: [[MG_VAR_OLD,  MG_VAR_NEW]] },
  { file: 'quick-math.html',              patches: [[QM_ROOT_TOP_OLD, QM_ROOT_TOP_NEW], [QM_END_OLD, QM_END_NEW]] },
  { file: 'ar/quick-math/index.html',     patches: [[QM_VAR_TOP_OLD,  QM_VAR_TOP_NEW],  [QM_END_OLD, QM_END_NEW]] },
  { file: 'de/quick-math/index.html',     patches: [[QM_VAR_TOP_OLD,  QM_VAR_TOP_NEW],  [QM_END_OLD, QM_END_NEW]] },
  { file: 'es/quick-math/index.html',     patches: [[QM_VAR_TOP_OLD,  QM_VAR_TOP_NEW],  [QM_END_OLD, QM_END_NEW]] },
  { file: 'fr/quick-math/index.html',     patches: [[QM_VAR_TOP_OLD,  QM_VAR_TOP_NEW],  [QM_END_OLD, QM_END_NEW]] },
  { file: 'ru/quick-math/index.html',     patches: [[QM_VAR_TOP_OLD,  QM_VAR_TOP_NEW],  [QM_END_OLD, QM_END_NEW]] },
  { file: 'reaction-test.html',           patches: [[RT_ROOT_TOP_OLD, RT_ROOT_TOP_NEW], [RT_END_OLD, RT_END_NEW]] },
  { file: 'ar/reaction-test/index.html',  patches: [[RT_VAR_TOP_OLD,  RT_VAR_TOP_NEW],  [RT_END_OLD, RT_END_NEW]] },
  { file: 'de/reaction-test/index.html',  patches: [[RT_VAR_TOP_OLD,  RT_VAR_TOP_NEW],  [RT_END_OLD, RT_END_NEW]] },
  { file: 'es/reaction-test/index.html',  patches: [[RT_VAR_TOP_OLD,  RT_VAR_TOP_NEW],  [RT_END_OLD, RT_END_NEW]] },
  { file: 'fr/reaction-test/index.html',  patches: [[RT_VAR_TOP_OLD,  RT_VAR_TOP_NEW],  [RT_END_OLD, RT_END_NEW]] },
  { file: 'ru/reaction-test/index.html',  patches: [[RT_VAR_TOP_OLD,  RT_VAR_TOP_NEW],  [RT_END_OLD, RT_END_NEW]] },
];

let totalPatched = 0;
let totalMissed  = 0;

for (const { file, patches } of filePatchMap) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) { console.log(`SKIP (not found): ${file}`); continue; }
  let content = fs.readFileSync(fullPath, 'utf8');
  let fileChanged = false;

  for (const [oldStr, newStr] of patches) {
    if (content.includes(oldStr)) {
      content = content.replace(oldStr, newStr);
      fileChanged = true;
      totalPatched++;
      console.log(`  OK  [${oldStr.split('\n')[0].slice(0, 55)}...] in ${file}`);
    } else if (content.includes('_initDone')) {
      console.log(`  SKIP (already _initDone): ${file}`);
    } else {
      console.log(`  MISS pattern in: ${file} [${oldStr.split('\n')[0].slice(0, 55)}]`);
      totalMissed++;
    }
  }

  if (fileChanged) fs.writeFileSync(fullPath, content, 'utf8');
}

console.log(`\nDone. Patches applied: ${totalPatched}  |  Missed: ${totalMissed}`);

// Verify results
console.log('\n── Verification ──');
for (const { file } of filePatchMap) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) continue;
  const c = fs.readFileSync(fullPath, 'utf8');
  const hasInitDone   = c.includes('_initDone');
  const hasSetTimeout = c.includes('setTimeout(function(){_initDone');
  const hasBypassLang = c.includes('_bypassLang');
  const status = hasInitDone && hasSetTimeout && !hasBypassLang ? 'OK' : 'FAIL';
  console.log(`  ${status}  ${file}  [initDone:${hasInitDone} timeout:${hasSetTimeout} bypassGone:${!hasBypassLang}]`);
}
