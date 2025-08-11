import { useMemo, useState } from 'react'
import { LISTENING_ITEMS } from '../data/listening'
import { useProgressStore } from '../store/progress'
import { speak } from '../utils/tts'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function ListeningPage() {
  const items = useMemo(() => shuffle(LISTENING_ITEMS), [])
  const [index, setIndex] = useState(0)
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const current = items[index]
  const hasNext = index < items.length - 1
  const [answer, setAnswer] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const submit = () => {
    if (answer === null) return
    const correct = answer === current.questions[0].correctIndex
    recordAttempt('luisteren', correct)
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
        <audio controls src={current.audioUrl} style={{ width: '100%' }}>
          Your browser does not support the audio element.
        </audio>
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button className="button ghost" onClick={() => speak(current.transcript, 'nl-NL')}>Lees transcript (TTS)</button>
        </div>
        <details style={{ marginTop: 8 }}>
          <summary>Transcript</summary>
          <p>{current.transcript}</p>
        </details>
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