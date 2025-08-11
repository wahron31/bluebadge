import { useState } from 'react'
import { setWords, setQuizzes, setScenarios, clearOverrides } from '../data/overrides'

export default function AdminImportPage() {
  const [tab, setTab] = useState<'words' | 'quizzes' | 'scenarios'>('words')
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')

  const handleImport = () => {
    try {
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed)) throw new Error('JSON is geen array')
      if (tab === 'words') setWords(parsed)
      if (tab === 'quizzes') setQuizzes(parsed)
      if (tab === 'scenarios') setScenarios(parsed)
      setMessage('Geïmporteerd ✔️')
    } catch (e: any) {
      setMessage('Fout: ' + (e?.message || 'onbekend'))
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
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} placeholder={`Plak JSON array voor ${tab}...`} />
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <button className="button" onClick={handleImport}>Importeer</button>
          <button className="button ghost" onClick={handleClear}>Wis overrides</button>
        </div>
        {message && <p style={{ marginTop: 8 }}>{message}</p>}
      </div>
    </div>
  )
}