export default function Home() {
  const dailyWords = [
    { word: "aankondiging", meaning: "aankondiging betekent 'announcement'." },
    { word: "bedevaart", meaning: "bedevaart betekent 'pilgrimage'." },
  ];

  const quizQuestions = [
    {
      question: "Wat betekent 'aankondiging'?",
      options: ["Announcement", "Celebration", "Complaint", "Request"],
      answer: "Announcement",
    },
    {
      question: "Wat is de juiste vervoeging van 'lopen' in verleden tijd?",
      options: ["liep", "loopt", "gelopen", "loopte"],
      answer: "liep",
    },
  ];

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>BlueBadge Demo</h1>
      <p>Welkom bij de BlueBadge oefenwebsite voor de politievoorbereiding.</p>

      <section>
        <h2>Gisteren's Woorden</h2>
        <ul>
          {dailyWords.map(({ word, meaning }) => (
            <li key={word}>
              <strong>{word}</strong>: {meaning}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Quiz Voorbeeld</h2>
        {quizQuestions.map(({ question, options }, idx) => (
          <div key={idx} style={{ marginBottom: 15 }}>
            <p><strong>Vraag {idx + 1}:</strong> {question}</p>
            <ul>
              {options.map((opt) => (
                <li key={opt}>{opt}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
