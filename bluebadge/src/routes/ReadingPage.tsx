import { useMemo, useState } from 'react'
import { READING_ITEMS } from '../data/reading'
import { useProgressStore } from '../store/progress'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function ReadingPage() {
  const items = useMemo(() => shuffle(READING_ITEMS), [])
  const [index, setIndex] = useState(0)
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const current = items[index]
  const hasNext = index < items.length - 1
  const [answer, setAnswer] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const submit = () => {
    if (answer === null) return
    const correct = answer === current.questions[0].correctIndex
    recordAttempt('lezen', correct)
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
        <h2 style={{ marginTop: 0 }}>{current.title}</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{current.body}</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{current.questions[0].prompt}</h3>
        <div className="grid">
          {current.questions[0].choices.map((c, idx) => {
            const isCorrect = locked && idx === current.questions[0].correctIndex
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
      </div>
    </div>
  )
}