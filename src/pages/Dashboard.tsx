import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTransactions } from '../contexts/TransactionContext';
import { TransactionFormModal } from '../components/dashboard/TransactionForm';
import { BalanceCards } from '../components/dashboard/BalanceCards';
import { TransactionList } from '../components/dashboard/TransactionList';
import { ChartsSection } from '../components/dashboard/ChartsSection';

export const Dashboard = () => {
  const { t } = useLanguage();
  const { transactions } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-darker via-blue-dark to-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-left text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
            {t.dashboard.title}
          </h1>
        </div>

        {/* Tarjetas de Balance */}
        <div className="mb-6 sm:mb-8">
          <BalanceCards />
        </div>

        {/* Gráficos */}
        <div className="mb-6 sm:mb-8">
          <ChartsSection />
        </div>

        {/* Lista de Transacciones */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
                {t.dashboard.recentTransactions}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-deep/30 text-gray-300 hover:bg-blue-deep/50'
                    }`}
                  >
                    {t.dashboard.all}
                  </button>
                  <button
                    onClick={() => setFilter('expense')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-deep/30 text-gray-300 hover:bg-blue-deep/50'
                    }`}
                  >
                    {t.dashboard.expenses}
                  </button>
                  <button
                    onClick={() => setFilter('income')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'income'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-deep/30 text-gray-300 hover:bg-blue-deep/50'
                    }`}
                  >
                    {t.dashboard.income}
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder={t.dashboard.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <TransactionList transactions={filteredTransactions} />
          </div>
        </div>
      </div>

      {/* Botón flotante para abrir modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label={t.dashboard.addTransaction}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal de transacción */}
      <TransactionFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

