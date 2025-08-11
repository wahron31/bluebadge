import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AppLayout from './App'

const HomePage = lazy(() => import('./routes/HomePage'))
const WordsPage = lazy(() => import('./routes/WordsPage'))
const QuizPage = lazy(() => import('./routes/QuizPage'))
const ScenariosPage = lazy(() => import('./routes/ScenariosPage'))
const ProgressPage = lazy(() => import('./routes/ProgressPage'))
const NotFoundPage = lazy(() => import('./routes/NotFoundPage'))
const ListeningPage = lazy(() => import('./routes/ListeningPage'))
const LogicPage = lazy(() => import('./routes/LogicPage'))
const ProfilePage = lazy(() => import('./routes/ProfilePage'))
const SessionPage = lazy(() => import('./routes/SessionPage'))
const ExportPage = lazy(() => import('./routes/ExportPage'))
const ScenarioPrintPage = lazy(() => import('./routes/ScenarioPrintPage'))
const AdminImportPage = lazy(() => import('./routes/AdminImportPage'))
const ReadingPage = lazy(() => import('./routes/ReadingPage'))
const GrammarPage = lazy(() => import('./routes/GrammarPage'))
const DashboardPage = lazy(() => import('./routes/DashboardPage'))
const AchievementsPage = lazy(() => import('./routes/AchievementsPage'))
const NumericPage = lazy(() => import('./routes/NumericPage'))
const VerbalPage = lazy(() => import('./routes/VerbalPage'))
const AbstractPage = lazy(() => import('./routes/AbstractPage'))

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
      { path: 'grammatica', element: <GrammarPage /> },
      { path: 'logica', element: <LogicPage /> },
      { path: 'numeriek', element: <NumericPage /> },
      { path: 'verbaal', element: <VerbalPage /> },
      { path: 'abstract', element: <AbstractPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'badges', element: <AchievementsPage /> },
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
    <Suspense fallback={<div className="container" style={{ padding: 20 }}>Laden…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
