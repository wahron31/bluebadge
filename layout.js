(function(){
  if (window.__bbLayoutApplied) return; window.__bbLayoutApplied = true;
  const body = document.body; if (!body) return;
  body.classList.add('with-sidebar'); body.classList.add('with-right');
  const collapsed = localStorage.getItem('bbSidebarCollapsed')==='1';
  if (collapsed) body.classList.add('sidebar-collapsed');

  function buildSidebar(){
    const el = document.createElement('aside');
    el.className = 'sidebar'; el.setAttribute('role','navigation'); el.setAttribute('aria-label','Zijbalk');
    el.innerHTML = `
      <div class="brand" style="display:flex;justify-content:space-between;align-items:center;">
        <h1 style="margin:0;"><a href="index.html" style="text-decoration:none; color:inherit;">🚔 BlueBadge</a></h1>
        <button id="bb-toggle-sidebar" class="module-btn" title="Sidebar inklappen" style="padding:6px 8px;">⇔</button>
      </div>
      <nav>
        <a href="index.html"><span class="icon">🏠</span><span class="label">Dashboard</span></a>
        <div style="margin:8px 0; font-size:.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em;">Training</div>
        <a href="quiz.html"><span class="icon">🗓</span><span class="label">Dagelijkse Quiz</span></a>
        <a href="cognitief.html"><span class="icon">🧠</span><span class="label">Cognitief</span></a>
        <a href="taal.html"><span class="icon">💬</span><span class="label">Taal</span></a>
        <a href="flashcards.html"><span class="icon">🗂</span><span class="label">Flashcards</span></a>
        <a href="listening.html"><span class="icon">🎧</span><span class="label">Luisteren</span></a>
        <div style="margin:8px 0; font-size:.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em;">Scenario</div>
        <a href="simulation.html"><span class="icon">⏱</span><span class="label">Simulatie</span></a>
        <a href="cases.html"><span class="icon">🧩</span><span class="label">Mini-Case</span></a>
        <a href="scenarios.html"><span class="icon">📋</span><span class="label">Scenario's</span></a>
        <a href="gesprek.html"><span class="icon">🗣</span><span class="label">Gesprek</span></a>
        <div style="margin:8px 0; font-size:.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em;">Analyse</div>
        <a href="voortgang.html"><span class="icon">📈</span><span class="label">Voortgang</span></a>
        <a href="analytics.html"><span class="icon">📊</span><span class="label">Analytisch</span></a>
        <a href="wrongs.html"><span class="icon">📚</span><span class="label">Foutenboek</span></a>
        <div style="margin:8px 0; font-size:.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em;">Beheer</div>
        <a href="content-admin.html"><span class="icon">🛠</span><span class="label">Content</span></a>
        <a href="i18n-editor.html"><span class="icon">🌐</span><span class="label">i18n</span></a>
        <a href="settings.html"><span class="icon">⚙️</span><span class="label">Instellingen</span></a>
      </nav>`;
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