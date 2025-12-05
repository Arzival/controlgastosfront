import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { SavingsFundCard } from './SavingsFundCard';
import { SavingsFundModal } from './SavingsFundModal';
import { ManageFundModal } from './ManageFundModal';

export const SavingsSection = () => {
  const { t } = useLanguage();
  const { savingsFunds } = useTransactions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);

  const totalSavings = savingsFunds.reduce((sum, fund) => sum + fund.balance, 0);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2">
              {t.dashboard.savingsTitle}
            </h2>
            <p className="text-sm text-gray-400">
              {t.dashboard.totalSavings}: <span className="text-green-400 font-semibold">${totalSavings.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            {t.dashboard.addSavingsFund}
          </button>
        </div>

        {savingsFunds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">{t.dashboard.noSavingsFunds}</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {t.dashboard.addSavingsFund}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsFunds.map((fund) => (
              <SavingsFundCard
                key={fund.id}
                fund={fund}
                onManage={() => setSelectedFundId(fund.id)}
              />
            ))}
          </div>
        )}
      </div>

      <SavingsFundModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedFundId && (
        <ManageFundModal
          fundId={selectedFundId}
          isOpen={!!selectedFundId}
          onClose={() => setSelectedFundId(null)}
        />
      )}
    </div>
  );
};

