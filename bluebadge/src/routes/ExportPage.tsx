import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useProgressStore } from '../store/progress'
import { getWords, getQuizzes, getScenarios, setWords, setQuizzes, setScenarios } from '../data/overrides'
import { downloadJson } from '../utils/download'
import { useState } from 'react'

export default function ExportPage() {
  const dataJson = useProgressStore((s) => ({
    modules: s.modules,
    lastPracticedISO: s.lastPracticedISO,
    streakDays: s.streakDays,
    scenarioAnswers: s.scenarioAnswers,
    todayISO: s.todayISO,
    todayAttempts: s.todayAttempts,
    dailyGoal: s.dailyGoal,
    attemptLog: s.attemptLog,
  }))

  const [importText, setImportText] = useState('')

  const handleZip = async () => {
    const zip = new JSZip()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    zip.file('progress.json', JSON.stringify(dataJson, null, 2))
    // Scenario antwoorden als txt
    const answersTxt = dataJson.scenarioAnswers
      .map((a, i) => `#${i + 1} [${a.scenarioId}] ${new Date(a.timestamp).toLocaleString()}\n${a.text}\n`)
      .join('\n')
    zip.file('scenario-answers.txt', answersTxt || 'Geen antwoorden.')

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, `bluebadge-export-${timestamp}.zip`)
  }

  const exportWords = () => downloadJson('words.json', getWords())
  const exportQuizzes = () => downloadJson('quizzes.json', getQuizzes())
  const exportScenarios = () => downloadJson('scenarios.json', getScenarios())

  const handleImportWords = () => { try { const p = JSON.parse(importText); if (Array.isArray(p)) setWords(p) } catch {} }
  const handleImportQuizzes = () => { try { const p = JSON.parse(importText); if (Array.isArray(p)) setQuizzes(p) } catch {} }
  const handleImportScenarios = () => { try { const p = JSON.parse(importText); if (Array.isArray(p)) setScenarios(p) } catch {} }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Exporteren (ZIP)</h2>
        <p>Exporteer je voortgang en scenario-antwoorden als ZIP.</p>
        <button className="button" onClick={handleZip}>Maak ZIP-download</button>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Per onderdeel export</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button ghost" onClick={exportWords}>Woorden JSON</button>
          <button className="button ghost" onClick={exportQuizzes}>Quizzen JSON</button>
          <button className="button ghost" onClick={exportScenarios}>Scenario's JSON</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Per onderdeel import</h3>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={8} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} placeholder="Plak JSON array hier..." />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button className="button" onClick={handleImportWords}>Importeer Woorden</button>
          <button className="button" onClick={handleImportQuizzes}>Importeer Quizzen</button>
          <button className="button" onClick={handleImportScenarios}>Importeer Scenario's</button>
        </div>
      </div>
    </div>
  )
}