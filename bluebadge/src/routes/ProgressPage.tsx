import { useState } from 'react'
import ProgressStats from '../components/ProgressStats'
import { useProgressStore } from '../store/progress'

export default function ProgressPage() {
  const modules = useProgressStore((s) => s.modules)
  const streak = useProgressStore((s) => s.streakDays)
  const last = useProgressStore((s) => s.lastPracticedISO)
  const answers = useProgressStore((s) => s.scenarioAnswers)
  const exportData = useProgressStore((s) => s.exportData)
  const importData = useProgressStore((s) => s.importData)
  const resetAll = useProgressStore((s) => s.resetAll)

  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'bluebadge-progress.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const handleImport = () => {
    importData(importText)
    setShowImport(false)
    setImportText('')
  }

  return (
    <div className="grid">
      <div className="grid cols-3">
        <ProgressStats title="Woordenschat" attempted={modules.woorden.attempted} correct={modules.woorden.correct} />
        <ProgressStats title="Quiz" attempted={modules.quiz.attempted} correct={modules.quiz.correct} />
        <ProgressStats title="Scenario's" attempted={modules.scenarios.attempted} correct={modules.scenarios.correct} />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Streak</h3>
        <p>Opeenvolgende dagen geoefend: {streak}</p>
        <p>Laatst geoefend: {last ?? '—'}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button className="button" onClick={handleExport}>Exporteer</button>
          <button className="button secondary" onClick={() => setShowImport((v) => !v)}>Importeer</button>
          <button className="button ghost" onClick={resetAll}>Reset</button>
        </div>
        {showImport && (
          <div style={{ marginTop: 10 }}>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={8} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} placeholder="Plak JSON hier en klik op Importeer" />
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="button" onClick={handleImport} disabled={!importText.trim()}>Importeer nu</button>
              <button className="button ghost" onClick={() => setShowImport(false)}>Annuleren</button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Scenario-antwoorden (laatste 5)</h3>
        {answers.slice(0, 5).length === 0 ? (
          <p>Nog geen antwoorden opgeslagen.</p>
        ) : (
          <ul>
            {answers.slice(0, 5).map((a, idx) => (
              <li key={idx}>
                <strong>{a.scenarioId}</strong> — {new Date(a.timestamp).toLocaleString()}<br />
                <span>{a.text.slice(0, 160)}{a.text.length > 160 ? '…' : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}