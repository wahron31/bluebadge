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
import ListeningPage from './routes/ListeningPage'
import LogicPage from './routes/LogicPage'
import ProfilePage from './routes/ProfilePage'
import SessionPage from './routes/SessionPage'
import ExportPage from './routes/ExportPage'
import ScenarioPrintPage from './routes/ScenarioPrintPage'
import AdminImportPage from './routes/AdminImportPage'
import ReadingPage from './routes/ReadingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'woorden', element: <WordsPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'scenarios', element: <ScenariosPage /> },
      { path: 'luisteren', element: <ListeningPage /> },
      { path: 'lezen', element: <ReadingPage /> },
      { path: 'logica', element: <LogicPage /> },
      { path: 'voortgang', element: <ProgressPage /> },
      { path: 'profiel', element: <ProfilePage /> },
      { path: 'sessie', element: <SessionPage /> },
      { path: 'export', element: <ExportPage /> },
      { path: 'scenario-print', element: <ScenarioPrintPage /> },
      { path: 'admin-import', element: <AdminImportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
