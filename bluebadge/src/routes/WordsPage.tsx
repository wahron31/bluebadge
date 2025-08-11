import { useEffect, useMemo, useState } from 'react'
import Flashcard from '../components/Flashcard'
import { getWords } from '../data/overrides'
import type { WordItem } from '../data/words'
import { useProgressStore } from '../store/progress'
import { useSrsStore } from '../store/srs'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Category = 'alle' | 'dagelijks' | 'politie' | 'verkeer'

type Mode = 'browse' | 'train'

export default function WordsPage() {
  const [index, setIndex] = useState(0)
  const [category, setCategory] = useState<Category>('alle')
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<Mode>('browse')
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const all = useMemo(() => getWords(), [])
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const getSrs = useSrsStore((s) => s.getState)
  const recordSrs = useSrsStore((s) => s.recordResult)

  const pool = useMemo<WordItem[]>(() => {
    const base = category === 'alle' ? all : all.filter(w => w.category === category)
    const bySearch = query.trim()
      ? base.filter(w =>
          w.nl.toLowerCase().includes(query.toLowerCase()) ||
          w.tr.toLowerCase().includes(query.toLowerCase()),
        )
      : base
    if (mode === 'train') {
      const due = bySearch.filter(w => getSrs(w.id).dueISO <= todayISO)
      return shuffle(due)
    }
    return shuffle(bySearch)
  }, [all, category, query, mode, getSrs, todayISO])

  useEffect(() => { setIndex(0) }, [category, query, mode])

  const current = pool[index]
  const hasPrev = index > 0
  const hasNext = index < pool.length - 1

  const counts = useMemo(() => ({ total: pool.length, current: Math.min(index + 1, pool.length) }), [pool.length, index])

  const handleMark = (known: boolean) => {
    if (!current) return
    recordAttempt('woorden', known)
    if (mode === 'train') recordSrs(current.id, known)
    if (hasNext) setIndex((i) => i + 1)
  }

  const srsStats = useMemo(() => {
    const boxes: Record<number, number> = {}
    let dueCount = 0
    for (const w of all) {
      const st = getSrs(w.id)
      boxes[st.box] = (boxes[st.box] ?? 0) + 1
      if (st.dueISO <= todayISO) dueCount++
    }
    return { boxes, dueCount }
  }, [all, getSrs, todayISO])

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Woordenschat</h2>
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
          <button className={`button ${mode==='train'?'secondary':'ghost'}`} onClick={() => setMode(mode==='train'?'browse':'train')}>
            {mode==='train' ? 'Train (aan)' : 'Train (uit)'}
          </button>
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
          <p>{mode==='train' ? 'Geen kaarten vandaag verschuldigd. Zet train uit of kies een andere categorie.' : 'Geen resultaten. Pas je filters of zoekterm aan.'}</p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Markeer je kennis</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button secondary" onClick={() => handleMark(true)} disabled={!current}>Ik wist het</button>
          <button className="button" onClick={() => handleMark(false)} disabled={!current}>Nog oefenen</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>SRS Status</h3>
        <p>Vandaag verschuldigd: {srsStats.dueCount}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(srsStats.boxes).sort((a,b)=>Number(a[0])-Number(b[0])).map(([box, cnt]) => (
            <span key={box} className="button ghost">Vak {box}: {cnt}</span>
          ))}
        </div>
      </div>
    </div>
  )
}