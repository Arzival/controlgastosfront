import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useMemo } from 'react';

export const BalanceCards = () => {
  const { t } = useLanguage();
  const { transactions } = useTransactions();

  const balance = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const total = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

    const difference = income - expenses;

    return {
      total: total.toFixed(2),
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
      difference: difference.toFixed(2),
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">{t.dashboard.balance}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${parseFloat(balance.total) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${balance.total}
        </p>
      </div>

      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">{t.dashboard.monthlyIncome}</p>
        <p className="text-2xl sm:text-3xl font-bold text-green-400">
          ${balance.income}
        </p>
      </div>

      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">{t.dashboard.monthlyExpenses}</p>
        <p className="text-2xl sm:text-3xl font-bold text-red-400">
          ${balance.expenses}
        </p>
      </div>

      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">{t.dashboard.difference}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${parseFloat(balance.difference) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${balance.difference}
        </p>
      </div>
    </div>
  );
};

