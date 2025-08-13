import { useEffect, useRef, useState } from 'react'
import type { QuizQuestion } from '../data/quizzes'

type Props = {
  question: QuizQuestion
  onAnswer: (correct: boolean) => void
}

export default function QuizQuestionView({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const liveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelected(null)
    setLocked(false)
  }, [question.id])

  const handleSubmit = () => {
    if (selected === null) return
    const isCorrect = selected === question.correctIndex
    setLocked(true)
    onAnswer(isCorrect)
    if (liveRef.current) liveRef.current.textContent = isCorrect ? 'Correct' : 'Niet correct'
  }

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    if (locked) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setSelected((s) => (s === null ? 0 : Math.min(question.choices.length - 1, s + 1)))
      e.preventDefault()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setSelected((s) => (s === null ? 0 : Math.max(0, s - 1)))
      e.preventDefault()
    } else if (e.key === 'Enter' || e.key === ' ') {
      setSelected(idx)
      e.preventDefault()
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{question.category.toUpperCase()}</h3>
      <p style={{ fontSize: 18 }}>{question.prompt}</p>
      <div role="radiogroup" aria-label="Keuzevragen" className="grid" style={{ marginTop: 10 }}>
        {question.choices.map((c, idx) => {
          const isCorrect = locked && idx === question.correctIndex
          const isWrong = locked && selected === idx && !isCorrect
          const checked = selected === idx
          return (
            <div
              key={idx}
              role="radio"
              aria-checked={checked}
              tabIndex={locked ? -1 : checked ? 0 : -1}
              onKeyDown={(e) => onKey(e, idx)}
              onClick={() => !locked && setSelected(idx)}
              className="button ghost"
              style={{
                justifySelf: 'start',
                borderColor: isCorrect ? 'green' : isWrong ? 'crimson' : undefined,
              }}
            >
              {c}
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="button" onClick={handleSubmit} disabled={locked || selected === null}>
          Bevestig antwoord
        </button>
      </div>
      <div ref={liveRef} aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px,1px,1px,1px)' }} />
      {locked && selected !== null && (
        <div style={{ marginTop: 10 }}>
          {selected === question.correctIndex ? (
            <p style={{ color: 'green', margin: 0 }}>Correct!</p>
          ) : (
            <p style={{ color: 'crimson', margin: 0 }}>Niet correct.</p>
          )}
          {question.explanation && <p style={{ marginTop: 6 }}>{question.explanation}</p>}
        </div>
      )}
    </div>
  )
}