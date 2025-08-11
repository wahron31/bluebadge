import { useState } from 'react'
import type { QuizQuestion } from '../data/quizzes'

type Props = {
  question: QuizQuestion
  onAnswer: (correct: boolean) => void
}

export default function QuizQuestionView({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    const isCorrect = selected === question.correctIndex
    setLocked(true)
    onAnswer(isCorrect)
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{question.category.toUpperCase()}</h3>
      <p style={{ fontSize: 18 }}>{question.prompt}</p>
      <div className="grid" style={{ marginTop: 10 }}>
        {question.choices.map((c, idx) => {
          const isCorrect = locked && idx === question.correctIndex
          const isWrong = locked && selected === idx && !isCorrect
          return (
            <button
              key={idx}
              className="button ghost"
              style={{
                justifySelf: 'start',
                borderColor: isCorrect ? 'green' : isWrong ? 'crimson' : undefined,
              }}
              disabled={locked}
              onClick={() => setSelected(idx)}
            >
              {c}
            </button>
          )
        })}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="button" onClick={handleSubmit} disabled={locked || selected === null}>
          Bevestig antwoord
        </button>
      </div>
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