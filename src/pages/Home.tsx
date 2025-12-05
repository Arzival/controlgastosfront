import { useLanguage } from '../contexts/LanguageContext';

export const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-darker via-blue-dark to-dark-primary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
            {t.hero.title}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-4 sm:mb-6 font-medium">
            {t.hero.subtitle}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
              {t.hero.cta}
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-deep hover:bg-dark-accent text-gray-200 font-semibold rounded-lg border border-dark-accent transition-all duration-200">
              {t.hero.secondaryCta}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-gray-100">
          {t.features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-6 sm:p-8 hover:bg-blue-deep/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">
              {t.features.track.title}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.features.track.description}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-6 sm:p-8 hover:bg-blue-deep/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">
              {t.features.analyze.title}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.features.analyze.description}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-6 sm:p-8 hover:bg-blue-deep/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">
              {t.features.save.title}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.features.save.description}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center bg-blue-deep/30 backdrop-blur-sm border border-dark-accent rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-4 sm:mb-6">
            {t.hero.subtitle}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10">
            {t.hero.description}
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
            {t.hero.cta}
          </button>
        </div>
      </section>
    </div>
  );
};

