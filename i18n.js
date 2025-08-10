(function(){
  let dict = {};
  let current = localStorage.getItem('lang') || 'nl';

  function t(key){
    const map = dict[current] || {};
    return map[key] || key;
  }

  async function loadDict(){
    try {
      const override = localStorage.getItem('i18n_override');
      if (override) { dict = JSON.parse(override); }
      else { dict = await fetchJSON('data/languages.json', { validate: d=> typeof d==='object' && d!==null }); }
    } catch(e) { dict = {}; }
    applyLang(current);
  }

  function applyLang(lang){
    const l = dict[lang]||{};
    document.querySelectorAll('[data-translate],[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-translate')||el.getAttribute('data-i18n');
      if (l[key]) el.textContent = (typeof sanitizeText==='function'? sanitizeText(String(l[key])): String(l[key]));
    });
    document.documentElement.lang = lang;
    const select = document.getElementById('language-select');
    if (select) select.value = lang;
  }

  async function init(){
    await loadDict();
    const select = document.getElementById('language-select');
    if (select) {
      select.addEventListener('change', () => {
        const lang = select.value;
        localStorage.setItem('lang', lang);
        applyLang(lang);
      });
    }
  }

  window.i18n = { t, apply: applyLang, get lang(){ return current; }, get dict(){ return dict; } };

  document.addEventListener('DOMContentLoaded', init);
})();