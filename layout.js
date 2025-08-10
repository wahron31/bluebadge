(function(){
  if (window.__bbLayoutApplied) return; window.__bbLayoutApplied = true;
  const body = document.body; if (!body) return;
  body.classList.add('with-sidebar'); body.classList.add('with-right');
  if (localStorage.getItem('bbSidebarCollapsed')===null) localStorage.setItem('bbSidebarCollapsed','1');
  if (localStorage.getItem('bbSidebarCollapsed')==='1') body.classList.add('sidebar-collapsed');

  const primaryLinks = [
    { href:'index.html', icon:'🏠', label:'Dashboard' },
    { href:'quiz.html', icon:'🗓', label:'Dagelijkse Quiz' },
    { href:'cognitief.html', icon:'🧠', label:'Cognitief' },
    { href:'taal.html', icon:'💬', label:'Taal' },
    { href:'simulation.html', icon:'⏱', label:'Simulatie' },
    { href:'voortgang.html', icon:'📈', label:'Voortgang' }
  ];
  const moreLinks = [
    { href:'flashcards.html', icon:'🗂', label:'Flashcards' },
    { href:'listening.html', icon:'🎧', label:'Luisteren' },
    { href:'cases.html', icon:'🧩', label:'Mini-Case' },
    { href:'scenarios.html', icon:'📋', label:"Scenario's" },
    { href:'gesprek.html', icon:'🗣', label:'Gesprek' },
    { href:'analytics.html', icon:'📊', label:'Analytisch' },
    { href:'wrongs.html', icon:'📚', label:'Foutenboek' },
    { href:'content-admin.html', icon:'🛠', label:'Content' },
    { href:'i18n-editor.html', icon:'🌐', label:'i18n' },
    { href:'settings.html', icon:'⚙️', label:'Instellingen' }
  ];

  function buildSidebar(){
    const el = document.createElement('aside');
    el.className = 'sidebar'; el.setAttribute('role','navigation'); el.setAttribute('aria-label','Zijbalk');
    const activePath = location.pathname.split('/').pop();
    el.innerHTML = `
      <div class="brand" style="display:flex;justify-content:space-between;align-items:center;">
        <h1 style="margin:0;"><a href="index.html" style="text-decoration:none; color:inherit;">🚔 BlueBadge</a></h1>
        <button id="bb-toggle-sidebar" class="module-btn" title="Sidebar inklappen" style="padding:6px 8px;">⇔</button>
      </div>
      <div style="padding:6px 0;">
        <select class="bb-lang-select" aria-label="Taal" style="width:100%; padding:6px 8px; border:1px solid var(--glass-border); background: rgba(26,26,46,.6); color:var(--text-secondary); border-radius:8px;">
          <option value="nl">NL</option>
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="de">DE</option>
          <option value="tr">TR</option>
        </select>
      </div>
      <nav id="bb-nav"></nav>
    `;
    const nav = el.querySelector('#bb-nav');
    function aTag(l){ const a=document.createElement('a'); a.href=l.href; a.innerHTML=`<span class="icon">${l.icon}</span><span class="label">${l.label}</span>`; if (l.href===activePath) a.classList.add('active'); return a; }
    primaryLinks.forEach(l=> nav.appendChild(aTag(l)));
    const more = document.createElement('div'); more.className = 'more-group';
    more.innerHTML = `<button class="module-btn" id="bb-more-btn" aria-expanded="false" style="width:100%; justify-content:flex-start; gap:10px;"><span class="icon">⋯</span><span class="label">Meer</span></button><div class="submenu" id="bb-more-menu"></div>`;
    const sm = more.querySelector('#bb-more-menu'); moreLinks.forEach(l=> sm.appendChild(aTag(l)));
    nav.appendChild(more);
    // toggle more
    const mb = more.querySelector('#bb-more-btn');
    mb.addEventListener('click', ()=>{ const open = more.classList.toggle('open'); mb.setAttribute('aria-expanded', String(open)); });
    return el;
  }

  function buildRightRail(){
    const el = document.createElement('aside'); el.className = 'right-rail'; el.setAttribute('aria-label','Rechterzijbalk');
    el.innerHTML = `
      <div class="overview-card"><h4>Snelle acties</h4><div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a class="module-btn" href="quiz.html">Quiz</a>
        <a class="module-btn" href="simulation.html">Simulatie</a>
        <a class="module-btn" href="flashcards.html">Flashcards</a>
      </div></div>
      <div class="overview-card"><h4>Doelen</h4><p>Dag: <strong>${(JSON.parse(localStorage.getItem('bbGoals')||'{}').questionsPerDay)||50}</strong> vraag</p></div>
      <div class="overview-card"><h4>Logs</h4><p style="font-size:.85rem;color:#94a3b8;">Fouten: ${(JSON.parse(localStorage.getItem('errorLogs')||'[]').length)}</p></div>
    `;
    return el;
  }

  if (!document.querySelector('.sidebar')){ document.body.prepend(buildSidebar()); }
  if (!document.querySelector('.right-rail')){ document.body.appendChild(buildRightRail()); }

  const toggle = document.getElementById('bb-toggle-sidebar');
  if (toggle){ toggle.addEventListener('click', ()=>{ body.classList.toggle('sidebar-collapsed'); localStorage.setItem('bbSidebarCollapsed', body.classList.contains('sidebar-collapsed')? '1':'0'); }); }
})();