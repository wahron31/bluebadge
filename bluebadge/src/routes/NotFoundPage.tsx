import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="card">
      <h2>Pagina niet gevonden</h2>
      <p>De opgevraagde pagina bestaat niet.</p>
      <Link className="button" to="/">Terug naar Home</Link>
    </div>
  )
}