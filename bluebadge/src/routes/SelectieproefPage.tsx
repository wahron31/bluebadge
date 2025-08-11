import { useEffect, useMemo, useRef, useState } from 'react'
import { getCognitive, getReading, getListening, getGrammar } from '../data/overrides'
import { useProgressStore } from '../store/progress'

type CategoryKey = 'numeriek' | 'verbaal' | 'abstract' | 'lezen' | 'luisteren' | 'grammatica'

type SimQuestion = {
  id: string
  module: CategoryKey
  stem: string
  context?: string
  choices: string[]
  correctIndex: number
  explanation?: string
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function SelectieproefPage() {
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const [selectedCats, setSelectedCats] = useState<Record<CategoryKey, boolean>>({ numeriek: true, verbaal: true, abstract: true, lezen: false, luisteren: false, grammatica: false })
  const [count, setCount] = useState(30)
  const [minutes, setMinutes] = useState(30)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const pool = useMemo<SimQuestion[]>(() => {
    const out: SimQuestion[] = []
    if (selectedCats.numeriek) {
      for (const it of getCognitive('numeric')) out.push({ id: `n_${it.id}`, module: 'numeriek', stem: it.prompt, choices: it.choices, correctIndex: it.correctIndex, explanation: it.explanation })
    }
    if (selectedCats.verbaal) {
      for (const it of getCognitive('verbal')) out.push({ id: `v_${it.id}`, module: 'verbaal', stem: it.prompt, choices: it.choices, correctIndex: it.correctIndex, explanation: it.explanation })
    }
    if (selectedCats.abstract) {
      for (const it of getCognitive('abstract')) out.push({ id: `a_${it.id}`, module: 'abstract', stem: it.prompt, choices: it.choices, correctIndex: it.correctIndex, explanation: it.explanation })
    }
    if (selectedCats.grammatica) {
      for (const it of getGrammar()) out.push({ id: `g_${it.id}`, module: 'grammatica', stem: `${it.prompt}`, context: it.sentence, choices: it.choices, correctIndex: it.correctIndex, explanation: it.explanation })
    }
    if (selectedCats.lezen) {
      for (const it of getReading()) if (it.questions && it.questions[0]) { const q = it.questions[0]; out.push({ id: `r_${it.id}`, module: 'lezen', stem: q.prompt, context: `${it.title}\n\n${it.body}`, choices: q.choices, correctIndex: q.correctIndex }) }
    }
    if (selectedCats.luisteren) {
      for (const it of getListening()) if (it.questions && it.questions[0]) { const q = it.questions[0]; out.push({ id: `l_${it.id}`, module: 'luisteren', stem: q.prompt, context: `Transcript:\n${it.transcript}`, choices: q.choices, correctIndex: q.correctIndex }) }
    }
    return out
  }, [selectedCats])

  const [questions, setQuestions] = useState<SimQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0) // seconds
  const timerRef = useRef<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [mistakes, setMistakes] = useState<{ q: SimQuestion; chosen: number }[]>([])

  const canStart = useMemo(() => Object.values(selectedCats).some(Boolean) && pool.length > 0, [selectedCats, pool.length])

  const start = () => {
    const take = Math.min(count, pool.length)
    const qs = shuffle(pool).slice(0, take)
    setQuestions(qs)
    setIndex(0)
    setAnswer(null)
    setLocked(false)
    setCorrectCount(0)
    setMistakes([])
    setTimeLeft(minutes * 60)
    setStarted(true)
    setFinished(false)
  }

  useEffect(() => {
    if (!started || finished) return
    timerRef.current = window.setInterval(() => setTimeLeft((s) => s - 1), 1000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [started, finished])

  useEffect(() => {
    if (started && timeLeft <= 0) {
      setFinished(true)
      setStarted(false)
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [started, timeLeft])

  const current = questions[index]
  const hasNext = index < questions.length - 1

  const submit = () => {
    if (answer === null || !current) return
    const correct = answer === current.correctIndex
    recordAttempt(current.module, correct)
    if (correct) setCorrectCount((c) => c + 1)
    else setMistakes((m) => [...m, { q: current, chosen: answer }])
    setLocked(true)
  }

  const next = () => {
    if (!hasNext) { setFinished(true); setStarted(false); return }
    setIndex((i) => i + 1)
    setAnswer(null)
    setLocked(false)
  }

  if (!started && !finished) {
    return (
      <div className="grid">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Selectieproef simulatie</h2>
          <p>Kies categorieën, aantal vragen en tijdslimiet. Klik daarna Start.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {(Object.keys(selectedCats) as CategoryKey[]).map((k) => (
              <label key={k} className="button ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={selectedCats[k]} onChange={(e) => setSelectedCats((s) => ({ ...s, [k]: e.target.checked }))} /> {k}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <label>Aantal vragen <input type="number" min={10} max={100} value={count} onChange={(e) => setCount(Math.max(10, Math.min(100, Number(e.target.value)||0)))} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ccc', width: 100 }} /></label>
            <label>Tijd (min) <input type="number" min={10} max={180} value={minutes} onChange={(e) => setMinutes(Math.max(10, Math.min(180, Number(e.target.value)||0)))} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ccc', width: 100 }} /></label>
          </div>
          <p style={{ marginTop: 8 }}>Beschikbare vragen in selectie: {pool.length}</p>
          <button className="button" disabled={!canStart} onClick={start}>Start</button>
        </div>
      </div>
    )
  }

  if (finished) {
    const taken = questions.length
    const wrong = mistakes.length
    return (
      <div className="grid">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Resultaat</h2>
          <p>Score: {correctCount} / {taken}</p>
          <p>Fouten: {wrong}</p>
          <button className="button" onClick={() => { setFinished(false); setStarted(false) }}>Opnieuw instellen</button>
        </div>
        {mistakes.length > 0 && (
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Foutenoverzicht</h3>
            <ul>
              {mistakes.map((m, idx) => (
                <li key={idx}>
                  <strong>[{m.q.module}]</strong> {m.q.stem}<br />
                  {m.q.context && (<em style={{ whiteSpace: 'pre-wrap' }}>{m.q.context}</em>)}<br />
                  Jouw antwoord: {m.q.choices[m.chosen]} — Correct: {m.q.choices[m.q.correctIndex]}
                  {m.q.explanation && (<><br />Uitleg: {m.q.explanation}</>)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // running
  const mins = Math.max(0, Math.floor(timeLeft / 60))
  const secs = Math.max(0, timeLeft % 60)
  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Vraag {index + 1} / {questions.length}</h2>
        <p>Tijd resterend: {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</p>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{current?.stem}</h3>
        {current?.context && <p style={{ whiteSpace: 'pre-wrap' }}>{current.context}</p>}
        <div role="radiogroup" aria-label="Keuzevragen" className="grid" style={{ marginTop: 8 }}>
          {current?.choices.map((c, idx) => (
            <label key={idx} className="button ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="radio" name="ans" disabled={locked} onChange={() => setAnswer(idx)} /> {c}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="button" disabled={answer === null || locked} onClick={submit}>Bevestig</button>
          <button className="button secondary" disabled={!locked} onClick={next}>{hasNext ? 'Volgende' : 'Afronden'}</button>
        </div>
      </div>
    </div>
  )
}