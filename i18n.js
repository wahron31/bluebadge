(function(){
  let dict = {};
  let current = localStorage.getItem('lang') || 'nl';

  function applyLang(lang){
    const map = dict[lang] || {};
    // data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (map[key]) el.textContent = map[key];
    });
    // data-translate (backward compatibility)
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (map[key]) el.textContent = map[key];
    });
    // set page lang
    document.documentElement.lang = lang;
    // set select value if present
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
        current = select.value;
        localStorage.setItem('lang', current);
        applyLang(current);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();