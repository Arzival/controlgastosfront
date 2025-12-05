import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import type { Transaction } from '../../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const { t } = useLanguage();
  const { deleteTransaction, categories } = useTransactions();

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || '#3b82f6';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{t.dashboard.noTransactions}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-blue-deep/30 border border-dark-accent rounded-lg p-4 flex items-center justify-between hover:bg-blue-deep/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getCategoryColor(transaction.category) }}
              />
              <h3 className="text-gray-100 font-medium truncate">{transaction.category}</h3>
              <span
                className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate">{transaction.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Eliminar transacción"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

