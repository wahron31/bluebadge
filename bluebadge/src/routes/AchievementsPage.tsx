import { useMemo } from 'react'
import { useProgressStore } from '../store/progress'

type Badge = {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export default function AchievementsPage() {
  const modules = useProgressStore((s) => s.modules)
  const attemptLog = useProgressStore((s) => s.attemptLog)
  const streak = useProgressStore((s) => s.streakDays)

  const badges = useMemo<Badge[]>(() => {
    const list: Omit<Badge, 'unlocked'>[] = [
      { id: 'streak_3', title: 'Streak 3', description: 'Oefen 3 dagen op rij' },
      { id: 'streak_7', title: 'Streak 7', description: 'Oefen 7 dagen op rij' },
      { id: 'attempts_50', title: 'Starter', description: '50 pogingen' },
      { id: 'attempts_200', title: 'Doorzetter', description: '200 pogingen' },
      { id: 'words_30', title: 'Woorden 30', description: '30 woorden beoordeeld' },
      { id: 'quiz_30', title: 'Quiz 30', description: '30 quizvragen beantwoord' },
      { id: 'lezen_10', title: 'Lezen 10', description: '10 leesvragen beantwoord' },
      { id: 'gram_10', title: 'Grammatica 10', description: '10 grammaticavragen' },
      { id: 'logica_10', title: 'Logica 10', description: '10 logica-vragen' },
      { id: 'luisteren_10', title: 'Luisteren 10', description: '10 luistervragen' },
      { id: 'scenarios_5', title: 'Scenario 5', description: '5 scenario-antwoorden' },
    ]
    const totalAttempts = attemptLog.length
    const unlockedIds = new Set<string>()
    if (streak >= 3) unlockedIds.add('streak_3')
    if (streak >= 7) unlockedIds.add('streak_7')
    if (totalAttempts >= 50) unlockedIds.add('attempts_50')
    if (totalAttempts >= 200) unlockedIds.add('attempts_200')
    if (modules.woorden.attempted >= 30) unlockedIds.add('words_30')
    if (modules.quiz.attempted >= 30) unlockedIds.add('quiz_30')
    if (modules.lezen.attempted >= 10) unlockedIds.add('lezen_10')
    if (modules.grammatica.attempted >= 10) unlockedIds.add('gram_10')
    if (modules.logica.attempted >= 10) unlockedIds.add('logica_10')
    if (modules.luisteren.attempted >= 10) unlockedIds.add('luisteren_10')
    if (modules.scenarios.attempted >= 5) unlockedIds.add('scenarios_5')

    return list.map(b => ({ ...b, unlocked: unlockedIds.has(b.id) }))
  }, [modules, attemptLog.length, streak])

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Badges</h2>
        <p>Ontgrendel badges door te oefenen. Ga voor streaks en module-doelen!</p>
      </div>
      <div className="grid cols-3">
        {badges.map(b => (
          <div key={b.id} className="card" style={{ opacity: b.unlocked ? 1 : 0.5 }}>
            <h3 style={{ marginTop: 0 }}>{b.title} {b.unlocked ? '🏅' : '🔒'}</h3>
            <p>{b.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}