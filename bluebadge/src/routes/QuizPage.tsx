import { useMemo, useState } from 'react'
import QuizQuestionView from '../components/QuizQuestion'
import { getQuizzes } from '../data/overrides'
import type { QuizCategory, QuizQuestion } from '../data/quizzes'
import { useProgressStore } from '../store/progress'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

const CATEGORIES: QuizCategory[] = ['taal', 'logica', 'algemeen', 'situatie']

export default function QuizPage() {
  const [category, setCategory] = useState<QuizCategory | 'alle'>('alle')
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const all = useMemo(() => getQuizzes(), [])

  const questions = useMemo<QuizQuestion[]>(() => {
    const filtered = category === 'alle' ? all : all.filter(q => q.category === category)
    return shuffle(filtered).slice(0, 10)
  }, [category, all])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const current = questions[index]

  const handleAnswer = (correct: boolean) => {
    recordAttempt('quiz', correct)
    if (correct) setScore((s) => s + 1)
    setTimeout(() => {
      setIndex((i) => Math.min(i + 1, questions.length))
    }, 600)
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
  }

  if (!current) {
    return (
      <div className="card">
        <h2>Quiz afgerond</h2>
        <p>Score: {score} / {questions.length}</p>
        <button className="button" onClick={restart}>Opnieuw</button>
      </div>
    )
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Quiz</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className={`button ghost`} onClick={() => setCategory('alle')}>Alle</button>
          {CATEGORIES.map((c) => (
            <button key={c} className={`button ghost`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <p style={{ marginTop: 10 }}>Vraag {index + 1} / {questions.length} — Huidige score: {score}</p>
        <QuizQuestionView question={current} onAnswer={handleAnswer} />
      </div>
    </div>
  )
}