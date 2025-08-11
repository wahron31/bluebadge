import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import QuizQuestionView from '../QuizQuestion'
import type { QuizQuestion } from '../../data/quizzes'
import { describe, expect, test, vi } from 'vitest'

const sample: QuizQuestion = {
  id: 't1',
  category: 'taal',
  prompt: 'Testvraag',
  choices: ['A', 'B', 'C'],
  correctIndex: 1,
}

describe('QuizQuestion', () => {
  test('select and submit shows feedback', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<QuizQuestionView question={sample} onAnswer={onAnswer} />)

    const options = screen.getAllByRole('radio')
    await user.click(options[1])
    await user.click(screen.getByRole('button', { name: /bevestig/i }))

    expect(onAnswer).toHaveBeenCalledWith(true)
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument()
  })
})