(function(){
  const dict = {
    nl: {
      'nav.dashboard': 'Dashboard',
      'nav.quiz': 'Dagelijkse Quiz',
      'nav.cognitive': 'Cognitieve Vaardigheden',
      'nav.language': 'Taaltraining',
      'nav.progress': 'Voortgang'
    },
    tr: {
      'nav.dashboard': 'Kontrol Paneli',
      'nav.quiz': 'Günlük Quiz',
      'nav.cognitive': 'Bilişsel Beceriler',
      'nav.language': 'Dil Eğitimi',
      'nav.progress': 'İlerleme'
    },
    en: {
      'nav.dashboard': 'Dashboard',
      'nav.quiz': 'Daily Quiz',
      'nav.cognitive': 'Cognitive Skills',
      'nav.language': 'Language Training',
      'nav.progress': 'Progress'
    },
    fr: {
      'nav.dashboard': 'Tableau de bord',
      'nav.quiz': 'Quiz quotidien',
      'nav.cognitive': 'Compétences cognitives',
      'nav.language': 'Formation linguistique',
      'nav.progress': 'Progrès'
    },
    de: {
      'nav.dashboard': 'Übersicht',
      'nav.quiz': 'Tägliches Quiz',
      'nav.cognitive': 'Kognitive Fähigkeiten',
      'nav.language': 'Sprachtraining',
      'nav.progress': 'Fortschritt'
    }
  };

  function applyLang(lang){
    const map = dict[lang] || dict.nl;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (map[key]) el.textContent = map[key];
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('language-select');
    const saved = localStorage.getItem('lang') || 'nl';
    if (select) select.value = saved;
    applyLang(saved);
    if (select) {
      select.addEventListener('change', () => {
        localStorage.setItem('lang', select.value);
        applyLang(select.value);
      });
    }
  });
})();