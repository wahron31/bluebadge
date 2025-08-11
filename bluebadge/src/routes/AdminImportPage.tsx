import { useState } from 'react'
import { setWords, setQuizzes, setScenarios, clearOverrides, setReading, setListening, setGrammar, setCognitive, type CognitiveItem } from '../data/overrides'

export default function AdminImportPage() {
  const [tab, setTab] = useState<'words' | 'quizzes' | 'scenarios' | 'reading' | 'listening' | 'grammar' | 'cognitive'>('words')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')

  const handleImport = () => {
    try {
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed)) throw new Error('JSON is geen array')
      if (tab === 'words') setWords(parsed)
      if (tab === 'quizzes') setQuizzes(parsed)
      if (tab === 'scenarios') setScenarios(parsed)
      if (tab === 'reading') setReading(parsed)
      if (tab === 'listening') setListening(parsed)
      if (tab === 'grammar') setGrammar(parsed)
      if (tab === 'cognitive') setCognitive(parsed as CognitiveItem[])
      setMessage('Geïmporteerd ✔️')
    } catch (e: any) {
      setMessage('Fout: ' + (e?.message || 'onbekend'))
    }
  }

  const handleImportFromUrl = async () => {
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('JSON is geen array')
      if (tab === 'words') setWords(data)
      if (tab === 'quizzes') setQuizzes(data)
      if (tab === 'scenarios') setScenarios(data)
      if (tab === 'reading') setReading(data)
      if (tab === 'listening') setListening(data)
      if (tab === 'grammar') setGrammar(data)
      if (tab === 'cognitive') setCognitive(data as CognitiveItem[])
      setMessage('Geïmporteerd vanuit bestand ✔️')
    } catch (e: any) {
      setMessage('Fout bij laden: ' + (e?.message || 'onbekend'))
    }
  }

  const handleClear = () => {
    clearOverrides(tab)
    setMessage('Overrides gewist')
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Admin Import</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <button className={`button ghost`} onClick={() => setTab('words')}>Woorden</button>
          <button className={`button ghost`} onClick={() => setTab('quizzes')}>Quizzen</button>
          <button className={`button ghost`} onClick={() => setTab('scenarios')}>Scenario's</button>
          <button className={`button ghost`} onClick={() => setTab('reading')}>Lezen</button>
          <button className={`button ghost`} onClick={() => setTab('listening')}>Luisteren</button>
          <button className={`button ghost`} onClick={() => setTab('grammar')}>Grammatica</button>
          <button className={`button ghost`} onClick={() => setTab('cognitive')}>Cognitief (numeric/verbal/abstract)</button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} placeholder={`Plak JSON array voor ${tab}...`} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button className="button" onClick={handleImport}>Importeer</button>
          <button className="button ghost" onClick={handleClear}>Wis overrides</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/data/bestand.json" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', width: '60%' }} />
          <button className="button" onClick={handleImportFromUrl} style={{ marginLeft: 8 }}>Laad uit bestand</button>
          <small style={{ display: 'block', opacity: 0.8 }}>Plaats JSON in public/data/ en verwijs met /data/naam.json</small>
        </div>
        {message && <p style={{ marginTop: 8 }}>{message}</p>}
      </div>
    </div>
  )
}