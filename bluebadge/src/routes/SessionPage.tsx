import { useEffect, useRef, useState } from 'react'
import { useProgressStore } from '../store/progress'

export default function SessionPage() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [target, setTarget] = useState(15)
  const timerRef = useRef<number | null>(null)

  const modules = useProgressStore((s) => s.modules)
  const todayAttempts = useProgressStore((s) => s.todayAttempts)

  const totalAttempts = modules.woorden.attempted + modules.quiz.attempted + modules.scenarios.attempted + modules.luisteren.attempted + modules.logica.attempted

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [running])

  const start = () => { setSeconds(0); setRunning(true) }
  const stop = () => { setRunning(false) }

  const completed = totalAttempts >= target

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sessie</h2>
        <p>Tijd: {Math.floor(seconds / 60)}m {seconds % 60}s</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <button className="button" onClick={start} disabled={running}>Start</button>
          <button className="button secondary" onClick={stop} disabled={!running}>Stop</button>
          <input type="number" min={1} max={200} value={target} onChange={(e) => setTarget(Math.max(1, Math.min(200, Number(e.target.value)||0)))} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', width: 120 }} />
          <span>Doel (pogingen): {target}</span>
        </div>
      </div>

      {completed ? (
        <div className="card" style={{ background: '#eaffea' }}>
          <h3 style={{ marginTop: 0 }}>Sessie afgerond 🎉</h3>
          <p>Gefeliciteerd! Je haalde je doel van {target} pogingen in {Math.floor(seconds / 60)}m {seconds % 60}s.</p>
          <p>Vandaag geregistreerd: {todayAttempts}</p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Voortgang naar doel</h3>
          <p>{totalAttempts} / {target} pogingen</p>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: Math.min(100, Math.round((totalAttempts / target) * 100)) + '%' }} />
          </div>
        </div>
      )}
    </div>
  )
}