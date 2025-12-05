import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { LanguageSwitch } from './components/LanguageSwitch';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <LanguageProvider>
      <TransactionProvider>
        <BrowserRouter>
          <LanguageSwitch />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </LanguageProvider>
  );
}

export default App;
