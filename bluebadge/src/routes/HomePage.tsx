import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="grid cols-2">
      <section className="card">
        <h2>Woordenschat (NL/TR)</h2>
        <p>Oefen dagelijkse woorden met flashcards met vertaling en uitspraak.</p>
        <Link to="/woorden" className="button">Start Woordenschat</Link>
      </section>

      <section className="card">
        <h2>Quiz</h2>
        <p>Toets jezelf op taal, logica, algemene kennis en situatievragen.</p>
        <Link to="/quiz" className="button">Start Quiz</Link>
      </section>

      <section className="card">
        <h2>Scenario's</h2>
        <p>Beantwoord open vragen over politiegerelateerde situaties.</p>
        <Link to="/scenarios" className="button">Start Scenario's</Link>
      </section>

      <section className="card">
        <h2>Voortgang</h2>
        <p>Bekijk je oefentijd, score en vooruitgang per onderdeel.</p>
        <Link to="/voortgang" className="button">Bekijk Voortgang</Link>
      </section>
    </div>
  )
}