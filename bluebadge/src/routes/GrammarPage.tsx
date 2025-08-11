import { useMemo, useState } from 'react'
import { GRAMMAR_ITEMS } from '../data/grammar'
import { useProgressStore } from '../store/progress'

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

type Lang = 'nl' | 'tr' | 'alle'

export default function GrammarPage() {
  const [lang, setLang] = useState<Lang>('alle')
  const items = useMemo(() => shuffle(GRAMMAR_ITEMS), [])
  const filtered = useMemo(() => items.filter(i => lang === 'alle' ? true : i.lang === lang), [items, lang])

  const [index, setIndex] = useState(0)
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const current = filtered[index]
  const hasNext = index < filtered.length - 1
  const [answer, setAnswer] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const submit = () => {
    if (answer === null) return
    const correct = answer === current.correctIndex
    recordAttempt('grammatica', correct)
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
        <h2 style={{ marginTop: 0 }}>Grammatica</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button ghost" onClick={() => setLang('alle')}>Alle</button>
          <button className="button ghost" onClick={() => setLang('nl')}>NL</button>
          <button className="button ghost" onClick={() => setLang('tr')}>TR</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{current.prompt}</h3>
        <p style={{ opacity: 0.9 }}>{current.sentence}</p>
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