import { useMemo, useState } from 'react'
import Flashcard from '../components/Flashcard'
import { WORDS } from '../data/words'
import type { WordItem } from '../data/words'
import { useProgressStore } from '../store/progress'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function WordsPage() {
  const [index, setIndex] = useState(0)
  const [items] = useState<WordItem[]>(() => shuffle(WORDS))
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const current = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  const counts = useMemo(() => ({ total: items.length, current: index + 1 }), [items.length, index])

  const handleMark = (known: boolean) => {
    recordAttempt('woorden', known)
    if (hasNext) setIndex((i) => i + 1)
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Flashcards</h2>
        <p>Kaart {counts.current} / {counts.total}</p>
        <Flashcard item={current} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="button ghost" disabled={!hasPrev} onClick={() => setIndex((i) => i - 1)}>Vorige</button>
          <button className="button ghost" disabled={!hasNext} onClick={() => setIndex((i) => i + 1)}>Volgende</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Markeer je kennis</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button secondary" onClick={() => handleMark(true)}>Ik wist het</button>
          <button className="button" onClick={() => handleMark(false)}>Nog oefenen</button>
        </div>
      </div>
    </div>
  )
}