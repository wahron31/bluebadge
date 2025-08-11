import { useState } from 'react'
import ScenarioPrompt from '../components/ScenarioPrompt'
import { SCENARIOS } from '../data/scenarios'
import { useProgressStore } from '../store/progress'

export default function ScenariosPage() {
  const [index, setIndex] = useState(0)
  const recordAttempt = useProgressStore((s) => s.recordAttempt)

  const current = SCENARIOS[index]
  const hasNext = index < SCENARIOS.length - 1

  const handleSubmit = (_answer: string) => {
    // Voor demo markeren we correct als ingevuld
    recordAttempt('scenarios', true)
    if (hasNext) setIndex((i) => i + 1)
  }

  return (
    <div className="grid">
      <ScenarioPrompt item={current} onSubmit={handleSubmit} />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Scenario {index + 1} / {SCENARIOS.length}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>Vorige</button>
          <button className="button ghost" disabled={!hasNext} onClick={() => setIndex((i) => i + 1)}>Volgende</button>
        </div>
      </div>
    </div>
  )
}