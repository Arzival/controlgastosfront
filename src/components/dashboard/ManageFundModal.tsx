import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { createSavingsTransactionRequest } from '../../request/transactions/transactions.request';
import { calculateAvailableBalance } from '../../utils/availableBalance';

interface ManageFundModalProps {
  fundId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ManageFundModal = ({ fundId, isOpen, onClose }: ManageFundModalProps) => {
  const { t } = useLanguage();
  const { transactions, savingsFunds, savingsTransactions, addSavingsTransaction, deleteSavingsFund, reloadSavingsFunds, reloadSavingsTransactions } = useTransactions();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fund = savingsFunds.find((f) => f.id === fundId);
  const fundTransactions = savingsTransactions
    .filter((t) => t.fundId === fundId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const availableBalance = useMemo(() => {
    return calculateAvailableBalance(transactions, savingsTransactions);
  }, [transactions, savingsTransactions]);

  if (!isOpen || !fund) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const transactionAmount = parseFloat(amount);
    
    if (activeTab === 'deposit' && transactionAmount > availableBalance) {
      setError(t.dashboard.insufficientFunds || 'Fondos insuficientes');
      return;
    }
    
    if (activeTab === 'withdraw' && transactionAmount > fund.balance) {
      setError('No tienes suficiente saldo en este fondo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir 'withdraw' a 'withdrawal' para el backend
      const transactionType = activeTab === 'deposit' ? 'deposit' : 'withdrawal';
      
      await createSavingsTransactionRequest({
        savings_fund_id: typeof fund.id === 'string' ? parseInt(fund.id) : fund.id,
        type: transactionType,
        amount: transactionAmount,
        description: description.trim() || (activeTab === 'deposit' ? 'Depósito' : 'Retiro'),
        date: new Date().toISOString().split('T')[0],
      });

      // Recargar los fondos y transacciones desde el backend para obtener los datos actualizados
      await Promise.all([
        reloadSavingsFunds(),
        reloadSavingsTransactions()
      ]);

      setAmount('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Error al crear la transacción de ahorro. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este fondo? Esta acción no se puede deshacer.')) {
      try {
        await deleteSavingsFund(fundId);
        onClose();
      } catch (error: any) {
        alert(error.message || 'Error al eliminar el fondo. Por favor, intenta de nuevo.');
      }
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-blue-deep/95 backdrop-blur-sm border border-dark-accent rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 text-left">
                {fund.name}
              </h2>
              {fund.description && (
                <p className="text-sm text-gray-400 mt-1">{fund.description}</p>
              )}
              <p className="text-lg font-semibold text-green-400 mt-2">
                {t.dashboard.currentBalance}: ${fund.balance.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-blue-deep/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-dark-accent">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'deposit'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.dashboard.deposit}
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'withdraw'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.dashboard.withdraw}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.dashboard.transactionHistory}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Content */}
          {activeTab === 'history' ? (
            <div className="space-y-3">
              {fundTransactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t.dashboard.noTransactions}</p>
              ) : (
                fundTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-blue-deep/30 border border-dark-accent rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-gray-100 font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'deposit' && (
                <div className="bg-blue-deep/30 border border-dark-accent rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-400 mb-1">{t.dashboard.availableBalance}</p>
                  <p className="text-xl font-bold text-cyan-300">${availableBalance.toFixed(2)}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                  {t.dashboard.amount}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  step="0.01"
                  min="0.01"
                  max={activeTab === 'withdraw' ? fund.balance : availableBalance}
                  className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
                {activeTab === 'deposit' && (
                  <p className="text-xs text-gray-400 mt-1">
                    {t.dashboard.maxDeposit}: ${availableBalance.toFixed(2)}
                  </p>
                )}
                {activeTab === 'withdraw' && (
                  <p className="text-xs text-gray-400 mt-1">
                    Disponible: ${fund.balance.toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                  {t.dashboard.description}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={t.dashboard.description}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-8 py-4 font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed ${
                    activeTab === 'deposit'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white'
                      : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-gray-500 disabled:to-gray-600 text-white'
                  }`}
                >
                  {loading 
                    ? 'Procesando...' 
                    : activeTab === 'deposit' 
                      ? t.dashboard.deposit 
                      : t.dashboard.withdraw
                  }
                </button>
              </div>
            </form>
          )}

          {/* Delete button */}
          <div className="mt-6 pt-6 border-t border-dark-accent">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-colors"
            >
              {t.dashboard.deleteFund}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

