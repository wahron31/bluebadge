import ProgressStats from '../components/ProgressStats'
import { useProgressStore } from '../store/progress'

export default function ProgressPage() {
  const modules = useProgressStore((s) => s.modules)
  const streak = useProgressStore((s) => s.streakDays)
  const last = useProgressStore((s) => s.lastPracticedISO)

  return (
    <div className="grid cols-3">
      <ProgressStats title="Woordenschat" attempted={modules.woorden.attempted} correct={modules.woorden.correct} />
      <ProgressStats title="Quiz" attempted={modules.quiz.attempted} correct={modules.quiz.correct} />
      <ProgressStats title="Scenario's" attempted={modules.scenarios.attempted} correct={modules.scenarios.correct} />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Streak</h3>
        <p>Opeenvolgende dagen geoefend: {streak}</p>
        <p>Laatst geoefend: {last ?? '—'}</p>
      </div>
    </div>
  )
}