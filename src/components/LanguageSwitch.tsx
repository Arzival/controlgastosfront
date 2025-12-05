import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-deep hover:bg-dark-accent rounded-lg transition-colors duration-200 border border-dark-accent shadow-lg backdrop-blur-sm"
      aria-label="Cambiar idioma / Change language"
    >
      <span className="text-sm font-medium text-gray-200">
        {language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
      </span>
    </button>
  );
};

