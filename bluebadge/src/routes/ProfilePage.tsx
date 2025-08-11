import { useUserStore } from '../store/user'
import { useState } from 'react'

export default function ProfilePage() {
  const name = useUserStore((s) => s.name)
  const setName = useUserStore((s) => s.setName)
  const [value, setValue] = useState(name)

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Profiel</h2>
        <label htmlFor="name">Naam</label>
        <input id="name" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Jouw naam" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', display: 'block', width: '100%', marginTop: 6 }} />
        <div style={{ marginTop: 10 }}>
          <button className="button" onClick={() => setName(value)}>Opslaan</button>
        </div>
        {name && <p style={{ marginTop: 10 }}>Welkom, {name}!</p>}
      </div>
    </div>
  )
}