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
    const active = langs.find(l=>l.code===current);
    
    mount.innerHTML = `
      <div class="language-selector">
        <button class="lang-btn ${active ? 'active' : ''}" id="lang-btn">
          <span class="lang-flag">${active?.flag || '🌐'}</span>
          <span class="lang-code">${current.toUpperCase()}</span>
        </button>
        <div class="lang-menu" id="lang-menu">
          ${langs.map(l => `
            <div class="lang-option ${l.code === current ? 'active' : ''}" data-lang="${l.code}">
              <span class="lang-flag">${l.flag}</span>
              <span class="lang-name">${l.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    const btn = document.getElementById('lang-btn');
    const menu = document.getElementById('lang-menu');
    
    btn.onclick = (e) => { 
      e.stopPropagation(); 
      menu.classList.toggle('active'); 
    };
    
    menu.querySelectorAll('.lang-option').forEach(item => {
      item.addEventListener('click', () => {
        const code = item.getAttribute('data-lang');
        localStorage.setItem('lang', code);
        applyLang(code);
        menu.classList.remove('active');
      });
    });
    
    document.addEventListener('click', () => menu.classList.remove('active'));
  }

  function updateSwitcher(lang){
    const btn = document.getElementById('lang-btn');
    if (!btn) return;
    const langs = buildLanguages();
    const active = langs.find(l=>l.code===lang);
    
    if (active){
      btn.querySelector('.lang-flag').textContent = active.flag;
      btn.querySelector('.lang-code').textContent = lang.toUpperCase();
      
      // Update active states
      btn.classList.toggle('active', true);
      document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-lang') === lang);
      });
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