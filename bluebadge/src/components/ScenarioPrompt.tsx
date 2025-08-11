import { useState } from 'react'
import type { ScenarioItem } from '../data/scenarios'

type Props = {
  item: ScenarioItem
  onSubmit: (answer: string) => void
}

export default function ScenarioPrompt({ item, onSubmit }: Props) {
  const [text, setText] = useState('')

  const canSubmit = text.trim().length >= 20

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (canSubmit) onSubmit(text)
      e.preventDefault()
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{item.title}</h3>
      <p>{item.prompt}</p>
      <ul>
        {item.guidelines.map((g, idx) => (
          <li key={idx}>{g}</li>
        ))}
      </ul>
      <textarea
        aria-label="Jouw antwoord"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={8}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }}
        placeholder="Schrijf je antwoord hier..."
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <small style={{ opacity: 0.8 }}>Sneltoets: Ctrl+Enter om in te dienen</small>
        <button className="button" onClick={() => onSubmit(text)} disabled={!canSubmit}>
          Indienen
        </button>
      </div>
    </div>
  )
}