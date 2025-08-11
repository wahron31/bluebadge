import { NavLink, Outlet } from 'react-router-dom'
import './index.css'
import { useUiStore } from './store/ui'
import { useEffect } from 'react'
import { t } from './i18n'
import { prefetchRoute } from './prefetch'

export default function AppLayout() {
  const language = useUiStore((s) => s.language)
  const theme = useUiStore((s) => s.theme)
  const setLanguage = useUiStore((s) => s.setLanguage)
  const toggleTheme = useUiStore((s) => s.toggleTheme)

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    document.documentElement.lang = language
  }, [theme, language])

  const pf = (p: string) => ({ onMouseEnter: () => prefetchRoute(p), onFocus: () => prefetchRoute(p) })

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Direct naar inhoud</a>
      <header className="header">
        <div className="header-inner container">
          <div className="brand">
            <span className="brand-badge">BB</span>
            <span>{t('brand', language)}</span>
          </div>
          <nav className="nav" aria-label="primary">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''} {...pf('/')}>{t('nav_home', language)}</NavLink>
            <NavLink to="/woorden" className={({isActive}) => isActive ? 'active' : ''} {...pf('/woorden')}>{t('nav_words', language)}</NavLink>
            <NavLink to="/quiz" className={({isActive}) => isActive ? 'active' : ''} {...pf('/quiz')}>{t('nav_quiz', language)}</NavLink>
            <NavLink to="/scenarios" className={({isActive}) => isActive ? 'active' : ''} {...pf('/scenarios')}>{t('nav_scenarios', language)}</NavLink>
            <NavLink to="/luisteren" className={({isActive}) => isActive ? 'active' : ''} {...pf('/luisteren')}>{t('nav_listen', language)}</NavLink>
            <NavLink to="/lezen" className={({isActive}) => isActive ? 'active' : ''} {...pf('/lezen')}>Lezen</NavLink>
            <NavLink to="/grammatica" className={({isActive}) => isActive ? 'active' : ''} {...pf('/grammatica')}>Grammatica</NavLink>
            <NavLink to="/logica" className={({isActive}) => isActive ? 'active' : ''} {...pf('/logica')}>{t('nav_logic', language)}</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''} {...pf('/dashboard')}>Dashboard</NavLink>
            <NavLink to="/voortgang" className={({isActive}) => isActive ? 'active' : ''} {...pf('/voortgang')}>{t('nav_progress', language)}</NavLink>
            <NavLink to="/profiel" className={({isActive}) => isActive ? 'active' : ''} {...pf('/profiel')}>Profiel</NavLink>
            <NavLink to="/sessie" className={({isActive}) => isActive ? 'active' : ''} {...pf('/sessie')}>Sessie</NavLink>
            <NavLink to="/export" className={({isActive}) => isActive ? 'active' : ''} {...pf('/export')}>Export</NavLink>
            <NavLink to="/scenario-print" className={({isActive}) => isActive ? 'active' : ''} {...pf('/scenario-print')}>Print Scenario's</NavLink>
            <NavLink to="/admin-import" className={({isActive}) => isActive ? 'active' : ''} {...pf('/admin-import')}>Admin Import</NavLink>
          </nav>
          <div className="nav" aria-label="settings" style={{ alignItems: 'center' }}>
            <button className="button ghost" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
            <button className="button ghost" aria-label="Switch language" onClick={() => setLanguage(language === 'nl' ? 'tr' : 'nl')}>{language.toUpperCase()}</button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="main container">
        <Outlet />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} BlueBadge — Oefenplatform (NL/TR)
      </footer>
    </div>
  )
}
