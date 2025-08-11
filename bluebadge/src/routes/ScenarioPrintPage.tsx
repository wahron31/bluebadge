import { useProgressStore } from '../store/progress'

export default function ScenarioPrintPage() {
  const answers = useProgressStore((s) => s.scenarioAnswers)

  const handlePrint = () => window.print()

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Scenario-antwoorden</h2>
      <p>Overzicht van de antwoorden (meest recent bovenaan).</p>
      <button className="button" onClick={handlePrint} style={{ marginTop: 8 }}>Printen</button>
      <hr style={{ margin: '16px 0' }} />
      {answers.length === 0 ? (
        <p>Geen antwoorden beschikbaar.</p>
      ) : (
        <div>
          {answers.map((a, idx) => (
            <div key={idx} style={{ marginBottom: 16 }}>
              <strong>Scenario: {a.scenarioId}</strong> — {new Date(a.timestamp).toLocaleString()}
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: 'transparent' }}>{a.text}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}