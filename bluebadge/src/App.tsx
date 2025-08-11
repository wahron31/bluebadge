import { NavLink, Outlet } from 'react-router-dom'
import './index.css'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner container">
          <div className="brand">
            <span className="brand-badge">BB</span>
            <span>BlueBadge</span>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/woorden" className={({isActive}) => isActive ? 'active' : ''}>Woordenschat</NavLink>
            <NavLink to="/quiz" className={({isActive}) => isActive ? 'active' : ''}>Quiz</NavLink>
            <NavLink to="/scenarios" className={({isActive}) => isActive ? 'active' : ''}>Scenario's</NavLink>
            <NavLink to="/voortgang" className={({isActive}) => isActive ? 'active' : ''}>Voortgang</NavLink>
          </nav>
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
