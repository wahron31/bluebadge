const quizData = await fetch('data/quiz_questions.json').then(res=>res.json());
const woordenData = await fetch('data/woorden.json').then(res=>res.json());

document.getElementById('reload-btn')?.addEventListener('click', e=>{ e.preventDefault();location.reload(); });

if (location.pathname.endsWith('quiz.html')) {
  const container = document.getElementById('quiz-container');
  // ... quiz logic: rastgele 5 soru seç, puanla, göster
}

if (location.pathname.endsWith('woorden.html')) {
  const today = new Date().getDate();
  const item = woordenData[today % woordenData.length];
  document.getElementById('woord').innerText = item.woord;
  document.getElementById('betekenis').innerText = item.betekenis;
  document.getElementById('voorbeeld').innerText = item.voorbeeld;
}
