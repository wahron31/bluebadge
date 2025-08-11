import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useProgressStore } from '../store/progress'

export default function ExportPage() {
  const dataJson = useProgressStore((s) => ({
    modules: s.modules,
    lastPracticedISO: s.lastPracticedISO,
    streakDays: s.streakDays,
    scenarioAnswers: s.scenarioAnswers,
    todayISO: s.todayISO,
    todayAttempts: s.todayAttempts,
    dailyGoal: s.dailyGoal,
  }))

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

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Exporteren</h2>
      <p>Exporteer je voortgang en scenario-antwoorden als ZIP.</p>
      <button className="button" onClick={handleZip}>Maak ZIP-download</button>
    </div>
  )
}