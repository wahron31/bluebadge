import { useEffect, useRef, useState } from 'react'
import { useProgressStore } from '../store/progress'

export default function SessionPage() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)

  const modules = useProgressStore((s) => s.modules)
  const todayAttempts = useProgressStore((s) => s.todayAttempts)

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

  const totalAttempts = modules.woorden.attempted + modules.quiz.attempted + modules.scenarios.attempted + modules.luisteren.attempted + modules.logica.attempted

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sessie</h2>
        <p>Tijd: {Math.floor(seconds / 60)}m {seconds % 60}s</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="button" onClick={start} disabled={running}>Start</button>
          <button className="button secondary" onClick={stop} disabled={!running}>Stop</button>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Samenvatting</h3>
        <p>Totaal pogingen (alle modules): {totalAttempts}</p>
        <p>Vandaag geregistreerd: {todayAttempts}</p>
      </div>
    </div>
  )
}