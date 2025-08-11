import { NavLink, Outlet } from 'react-router-dom'
import './index.css'
import { useUiStore } from './store/ui'
import { useEffect } from 'react'
import { t } from './i18n'

export default function AppLayout() {
  const language = useUiStore((s) => s.language)
  const theme = useUiStore((s) => s.theme)
  const setLanguage = useUiStore((s) => s.setLanguage)
  const toggleTheme = useUiStore((s) => s.toggleTheme)

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    document.documentElement.lang = language
  }, [theme, language])

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner container">
          <div className="brand">
            <span className="brand-badge">BB</span>
            <span>{t('brand', language)}</span>
          </div>
          <nav className="nav" aria-label="primary">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>{t('nav_home', language)}</NavLink>
            <NavLink to="/woorden" className={({isActive}) => isActive ? 'active' : ''}>{t('nav_words', language)}</NavLink>
            <NavLink to="/quiz" className={({isActive}) => isActive ? 'active' : ''}>{t('nav_quiz', language)}</NavLink>
            <NavLink to="/scenarios" className={({isActive}) => isActive ? 'active' : ''}>{t('nav_scenarios', language)}</NavLink>
            <NavLink to="/luisteren" className={({isActive}) => isActive ? 'active' : ''}>{t('nav_listen', language)}</NavLink>
            <NavLink to="/logica" className={({isActive}) => isActive ? 'active' : ''}>{t('nav_logic', language)}</NavLink>
            <NavLink to="/voortgang" className={({isActive}) => isActive ? 'active' : ''}>{t('nav_progress', language)}</NavLink>
          </nav>
          <div className="nav" aria-label="settings" style={{ alignItems: 'center' }}>
            <button className="button ghost" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
            <button className="button ghost" aria-label="Switch language" onClick={() => setLanguage(language === 'nl' ? 'tr' : 'nl')}>{language.toUpperCase()}</button>
          </div>
        </div>
      </header>
      <main className="main container">
        <Outlet />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} BlueBadge — Oefenplatform (NL/TR)
      </footer>
    </div>
  )
}
