import { useState } from 'react'
import type { ScenarioItem } from '../data/scenarios'

type Props = {
  item: ScenarioItem
  onSubmit: (answer: string) => void
}

export default function ScenarioPrompt({ item, onSubmit }: Props) {
  const [text, setText] = useState('')

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
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }}
        placeholder="Schrijf je antwoord hier..."
      />
      <div style={{ marginTop: 8 }}>
        <button className="button" onClick={() => onSubmit(text)} disabled={text.trim().length < 20}>
          Indienen
        </button>
      </div>
    </div>
  )
}