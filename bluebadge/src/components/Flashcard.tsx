import { useState } from 'react'
import type { WordItem } from '../data/words'
import { speak } from '../utils/tts'

type Props = {
  item: WordItem
}

export default function Flashcard({ item }: Props) {
  const [showTr, setShowTr] = useState(false)

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>{item.category.toUpperCase()}</h3>
      <div style={{ fontSize: 28, fontWeight: 700, margin: '12px 0' }}>{showTr ? item.tr : item.nl}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="button ghost" onClick={() => setShowTr((v) => !v)}>
          {showTr ? 'Toon NL' : 'Toon TR'}
        </button>
        <button className="button" onClick={() => speak(item.nl, 'nl-NL')}>Uitspraak NL</button>
        <button className="button secondary" onClick={() => speak(item.tr, 'tr-TR')}>Telaffuz TR</button>
      </div>
    </div>
  )
}