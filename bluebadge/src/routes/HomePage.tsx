import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getWords } from '../data/overrides'
import { useUiStore } from '../store/ui'
import { t } from '../i18n'
import { useProgressStore } from '../store/progress'
import { useOnboardingStore } from '../store/onboarding'

export default function HomePage() {
  const language = useUiStore((s) => s.language)
  const dailyWord = useMemo(() => {
    const all = getWords()
    return all[Math.floor(Math.random() * all.length)]
  }, [])

  const todayAttempts = useProgressStore((s) => s.todayAttempts)
  const dailyGoal = useProgressStore((s) => s.dailyGoal)
  const setDailyGoal = useProgressStore((s) => s.setDailyGoal)
  const progress = Math.min(100, Math.round((todayAttempts / dailyGoal) * 100))

  const showHomeTips = useOnboardingStore((s) => s.showHomeTips)
  const dismissHomeTips = useOnboardingStore((s) => s.dismissHomeTips)

  return (
    <div className="grid cols-2">
      {showHomeTips && (
        <section className="card" style={{ gridColumn: '1 / -1', background: '#fffceb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div>
              <strong>Tip:</strong> Stel je dagelijks doel in en probeer vandaag alle modules even aan te tikken.
            </div>
            <button className="button ghost" onClick={dismissHomeTips}>Begrepen</button>
          </div>
        </section>
      )}

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
        <h2>Luisteren</h2>
        <p>Luister naar korte fragmenten en beantwoord vragen.</p>
        <Link to="/luisteren" className="button">Start Luisteren</Link>
      </section>

      <section className="card">
        <h2>Logica</h2>
        <p>Oefen met reeksen en patronen.</p>
        <Link to="/logica" className="button">Start Logica</Link>
      </section>

      <section className="card">
        <h2>Voortgang</h2>
        <p>Bekijk je oefentijd, score en vooruitgang per onderdeel.</p>
        <Link to="/voortgang" className="button">{t('view_progress', language)}</Link>
      </section>
    </div>
  )
}