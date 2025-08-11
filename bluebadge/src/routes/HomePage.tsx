import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { WORDS } from '../data/words'
import { useUiStore } from '../store/ui'
import { t } from '../i18n'
import { useProgressStore } from '../store/progress'

export default function HomePage() {
  const language = useUiStore((s) => s.language)
  const dailyWord = useMemo(() => WORDS[Math.floor(Math.random() * WORDS.length)], [])

  const todayAttempts = useProgressStore((s) => s.todayAttempts)
  const dailyGoal = useProgressStore((s) => s.dailyGoal)
  const setDailyGoal = useProgressStore((s) => s.setDailyGoal)
  const progress = Math.min(100, Math.round((todayAttempts / dailyGoal) * 100))

  return (
    <div className="grid cols-2">
      <section className="card">
        <h2>{t('daily_word', language)}</h2>
        <p>
          {language === 'nl' ? dailyWord.nl : dailyWord.tr} —
          <span style={{ opacity: 0.8 }}> {language === 'nl' ? dailyWord.tr : dailyWord.nl}</span>
        </p>
      </section>

      <section className="card">
        <h2>{t('daily_goal', language)}</h2>
        <div className="progress-track" aria-label="daily goal progress" role="progressbar" aria-valuemin={0} aria-valuemax={dailyGoal} aria-valuenow={todayAttempts}>
          <div className="progress-bar" style={{ width: progress + '%' }} />
        </div>
        <p style={{ marginTop: 8 }}>{todayAttempts} / {dailyGoal}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button" onClick={() => setDailyGoal(dailyGoal + 5)}>+5</button>
          <button className="button ghost" onClick={() => setDailyGoal(Math.max(1, dailyGoal - 5))}>-5</button>
        </div>
      </section>

      <section className="card">
        <h2>Woordenschat (NL/TR)</h2>
        <p>Oefen dagelijkse woorden met flashcards met vertaling en uitspraak.</p>
        <Link to="/woorden" className="button">{t('start_words', language)}</Link>
      </section>

      <section className="card">
        <h2>Quiz</h2>
        <p>Toets jezelf op taal, logica, algemene kennis en situatievragen.</p>
        <Link to="/quiz" className="button">{t('start_quiz', language)}</Link>
      </section>

      <section className="card">
        <h2>Scenario's</h2>
        <p>Beantwoord open vragen over politiegerelateerde situaties.</p>
        <Link to="/scenarios" className="button">{t('start_scenarios', language)}</Link>
      </section>

      <section className="card">
        <h2>Voortgang</h2>
        <p>Bekijk je oefentijd, score en vooruitgang per onderdeel.</p>
        <Link to="/voortgang" className="button">{t('view_progress', language)}</Link>
      </section>
    </div>
  )
}