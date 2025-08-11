import { useMemo, useState } from 'react'
import { LOGIC_ITEMS } from '../data/logic'
import { useProgressStore } from '../store/progress'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function LogicPage() {
  const items = useMemo(() => shuffle(LOGIC_ITEMS), [])
  const [index, setIndex] = useState(0)
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const current = items[index]
  const hasNext = index < items.length - 1
  const [answer, setAnswer] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const submit = () => {
    if (answer === null) return
    const correct = answer === current.correctIndex
    recordAttempt('logica', correct)
    setLocked(true)
  }

  const next = () => {
    if (hasNext) {
      setIndex((i) => i + 1)
      setAnswer(null)
      setLocked(false)
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Logica</h2>
        <p>{current.prompt}</p>
        <div className="grid" style={{ marginTop: 8 }}>
          {current.choices.map((c, idx) => {
            const isCorrect = locked && idx === current.correctIndex
            const isWrong = locked && answer === idx && !isCorrect
            return (
              <button key={idx} className="button ghost" disabled={locked} onClick={() => setAnswer(idx)} style={{ borderColor: isCorrect ? 'green' : isWrong ? 'crimson' : undefined }}>{c}</button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="button" disabled={answer === null || locked} onClick={submit}>Bevestig</button>
          <button className="button secondary" disabled={!locked || !hasNext} onClick={next}>Volgende</button>
        </div>
        {locked && current.explanation && <p style={{ marginTop: 8 }}>{current.explanation}</p>}
      </div>
    </div>
  )
}