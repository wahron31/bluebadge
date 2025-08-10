(function(){
  let dict = {};
  let current = localStorage.getItem('lang') || 'nl';

  function t(key){
    const map = dict[current] || {};
    return map[key] || key;
  }

  function applyLang(lang){
    current = lang;
    const map = dict[lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (map[key]) el.textContent = map[key];
    });
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (map[key]) el.textContent = map[key];
    });
    document.documentElement.lang = lang;
    const select = document.getElementById('language-select');
    if (select) select.value = lang;
  }

  async function init(){
    try {
      const res = await fetch('data/languages.json');
      dict = await res.json();
    } catch(e) { dict = {}; }
    applyLang(current);
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