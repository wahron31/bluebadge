import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AppLayout from './App'
import HomePage from './routes/HomePage'
import WordsPage from './routes/WordsPage'
import QuizPage from './routes/QuizPage'
import ScenariosPage from './routes/ScenariosPage'
import ProgressPage from './routes/ProgressPage'
import NotFoundPage from './routes/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'woorden', element: <WordsPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'scenarios', element: <ScenariosPage /> },
      { path: 'voortgang', element: <ProgressPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
