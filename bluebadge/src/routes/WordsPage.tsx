import { useEffect, useMemo, useState } from 'react'
import Flashcard from '../components/Flashcard'
import { getWords } from '../data/overrides'
import type { WordItem } from '../data/words'
import { useProgressStore } from '../store/progress'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Category = 'alle' | 'dagelijks' | 'politie' | 'verkeer'

export default function WordsPage() {
  const [index, setIndex] = useState(0)
  const [category, setCategory] = useState<Category>('alle')
  const [query, setQuery] = useState('')
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const all = useMemo(() => getWords(), [])

  const filtered = useMemo<WordItem[]>(() => {
    const byCat = category === 'alle' ? all : all.filter(w => w.category === category)
    const bySearch = query.trim()
      ? byCat.filter(w =>
          w.nl.toLowerCase().includes(query.toLowerCase()) ||
          w.tr.toLowerCase().includes(query.toLowerCase()),
        )
      : byCat
    return shuffle(bySearch)
  }, [category, query, all])

  useEffect(() => { setIndex(0) }, [category, query])

  const current = filtered[index]
  const hasPrev = index > 0
  const hasNext = index < filtered.length - 1

  const counts = useMemo(() => ({ total: filtered.length, current: Math.min(index + 1, filtered.length) }), [filtered.length, index])

  const handleMark = (known: boolean) => {
    if (!current) return
    recordAttempt('woorden', known)
    if (hasNext) setIndex((i) => i + 1)
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Flashcards</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek NL of TR..."
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
          />
          {(['alle','dagelijks','politie','verkeer'] as Category[]).map((c) => (
            <button key={c} className={`button ghost`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <p style={{ marginTop: 8 }}>Kaart {counts.current} / {counts.total}</p>
        {current ? (
          <>
            <Flashcard item={current} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="button ghost" disabled={!hasPrev} onClick={() => setIndex((i) => i - 1)}>Vorige</button>
              <button className="button ghost" disabled={!hasNext} onClick={() => setIndex((i) => i + 1)}>Volgende</button>
            </div>
          </>
        ) : (
          <p>Geen resultaten. Pas je filters of zoekterm aan.</p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Markeer je kennis</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button secondary" onClick={() => handleMark(true)} disabled={!current}>Ik wist het</button>
          <button className="button" onClick={() => handleMark(false)} disabled={!current}>Nog oefenen</button>
        </div>
      </div>
    </div>
  )
}