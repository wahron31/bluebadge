import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { useMemo, useState } from 'react'
import { useProgressStore } from '../store/progress'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, TimeScale)

type Range = '7d' | '30d' | '90d'

function startOfDay(ts: number) { const d = new Date(ts); d.setHours(0,0,0,0); return d.getTime() }

export default function DashboardPage() {
  const logs = useProgressStore((s) => s.attemptLog)
  const [range, setRange] = useState<Range>('30d')

  const now = Date.now()
  const from = useMemo(() => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const d = new Date()
    d.setDate(d.getDate() - days + 1)
    d.setHours(0,0,0,0)
    return d.getTime()
  }, [range])

  const daily = useMemo(() => {
    const map = new Map<number, { attempts: number; correct: number }>()
    for (const l of logs) {
      if (l.ts < from) continue
      const day = startOfDay(l.ts)
      const v = map.get(day) || { attempts: 0, correct: 0 }
      v.attempts += 1
      v.correct += l.correct ? 1 : 0
      map.set(day, v)
    }
    const days: number[] = []
    for (let t = from; t <= now; t += 86400000) days.push(t)
    const labels = days.map((t) => new Date(t).toISOString().slice(0, 10))
    const attempts = days.map((t) => map.get(t)?.attempts ?? 0)
    const correct = days.map((t) => map.get(t)?.correct ?? 0)
    return { labels, attempts, correct }
  }, [logs, from, now])

  const byModule = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const l of logs) {
      if (l.ts < from) continue
      counts[l.module] = (counts[l.module] ?? 0) + 1
    }
    const labels = Object.keys(counts)
    const data = labels.map((k) => counts[k])
    return { labels, data }
  }, [logs, from])

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Dashboard</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button ghost" onClick={() => setRange('7d')}>7 dagen</button>
          <button className="button ghost" onClick={() => setRange('30d')}>30 dagen</button>
          <button className="button ghost" onClick={() => setRange('90d')}>90 dagen</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pogingen per dag</h3>
        <Line data={{
          labels: daily.labels,
          datasets: [
            { label: 'Pogingen', data: daily.attempts, borderColor: '#1254c0', backgroundColor: 'rgba(18,84,192,0.2)' },
            { label: 'Correct', data: daily.correct, borderColor: '#0a3d91', backgroundColor: 'rgba(10,61,145,0.2)' },
          ],
        }} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pogingen per module</h3>
        <Bar data={{
          labels: byModule.labels,
          datasets: [{ label: 'Aantal', data: byModule.data, backgroundColor: '#ffc107' }],
        }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  )
}