(function(){
  let dict = {};
  let current = localStorage.getItem('lang') || 'nl';

  function t(key){
    const map = dict[current] || {};
    return map[key] || map[key?.trim?.()] || key;
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
    const hiddenSelect = document.getElementById('language-select');
    if (hiddenSelect) hiddenSelect.value = lang;
    updateSwitcher(lang);
  }

  function buildLanguages(){
    return [
      { code: 'nl', name: (dict.nl && dict.nl.language_name) || 'Vlaams', flag: '🇧🇪' },
      { code: 'en', name: (dict.en && dict.en.language_name) || 'English', flag: '🇬🇧' },
      { code: 'de', name: (dict.de && dict.de.language_name) || 'Deutsch', flag: '🇩🇪' },
      { code: 'fr', name: (dict.fr && dict.fr.language_name) || 'Français', flag: '🇫🇷' },
      { code: 'tr', name: (dict.tr && dict.tr.language_name) || 'Türkçe', flag: '🇹🇷' }
    ];
  }

  function renderSwitcher(){
    const mount = document.getElementById('language-switcher');
    if (!mount) return;
    const langs = buildLanguages();
    mount.innerHTML = `
      <div class="lang-switcher">
        <button class="lang-current" id="lang-btn">
          <span class="flag">${langs.find(l=>l.code===current)?.flag || '🌐'}</span>
          <span class="code">${current.toUpperCase()}</span>
          <span class="arrow">▾</span>
        </button>
        <div class="lang-menu" id="lang-menu">
          ${langs.map(l => `
            <div class="lang-item" data-lang="${l.code}">
              <span class="flag">${l.flag}</span>
              <span class="name">${l.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    const btn = document.getElementById('lang-btn');
    const menu = document.getElementById('lang-menu');
    btn.onclick = (e)=>{ e.stopPropagation(); menu.classList.toggle('open'); };
    menu.querySelectorAll('.lang-item').forEach(item => {
      item.addEventListener('click', ()=>{
        const code = item.getAttribute('data-lang');
        localStorage.setItem('lang', code);
        applyLang(code);
        menu.classList.remove('open');
      });
    });
    document.addEventListener('click', ()=> menu.classList.remove('open'));
  }

  function updateSwitcher(lang){
    const btn = document.getElementById('lang-btn');
    if (!btn) return;
    const langs = buildLanguages();
    const active = langs.find(l=>l.code===lang);
    if (active){
      btn.querySelector('.flag').textContent = active.flag;
      btn.querySelector('.code').textContent = lang.toUpperCase();
    }
  }

  async function init(){
    try {
      const res = await fetch('data/languages.json');
      dict = await res.json();
    } catch(e) { dict = {}; }
    renderSwitcher();
    applyLang(current);
  }

  window.i18n = { t, apply: applyLang, get lang(){ return current; }, get dict(){ return dict; } };

  document.addEventListener('DOMContentLoaded', init);
})();