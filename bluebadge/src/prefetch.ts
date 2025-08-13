// Prefetch dynamic route chunks to improve perceived performance
export function prefetchRoute(path: string) {
  switch (path) {
    case '/':
      import('./routes/HomePage'); break
    case '/woorden':
      import('./routes/WordsPage'); break
    case '/quiz':
      import('./routes/QuizPage'); break
    case '/scenarios':
      import('./routes/ScenariosPage'); break
    case '/luisteren':
      import('./routes/ListeningPage'); break
    case '/lezen':
      import('./routes/ReadingPage'); break
    case '/grammatica':
      import('./routes/GrammarPage'); break
    case '/logica':
      import('./routes/LogicPage'); break
    case '/dashboard':
      import('./routes/DashboardPage'); break
    case '/voortgang':
      import('./routes/ProgressPage'); break
    case '/profiel':
      import('./routes/ProfilePage'); break
    case '/sessie':
      import('./routes/SessionPage'); break
    case '/export':
      import('./routes/ExportPage'); break
    case '/scenario-print':
      import('./routes/ScenarioPrintPage'); break
    case '/admin-import':
      import('./routes/AdminImportPage'); break
  }
}