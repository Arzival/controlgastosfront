import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageSwitch } from './components/LanguageSwitch'
import { Home } from './pages/Home'

function App() {
  return (
    <LanguageProvider>
      <LanguageSwitch />
      <Home />
    </LanguageProvider>
  )
}

export default App
