type Props = {
  title: string
  attempted: number
  correct: number
}

export default function ProgressStats({ title, attempted, correct }: Props) {
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p>Beoordeelde vragen: {attempted}</p>
      <p>Correct: {correct}</p>
      <p>Nauwkeurigheid: {accuracy}%</p>
    </div>
  )
}