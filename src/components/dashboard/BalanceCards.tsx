import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useMemo } from 'react';
import type { PeriodType } from '../../utils/dateUtils';
import { isDateInPeriod } from '../../utils/dateUtils';
import { calculateAvailableBalance } from '../../utils/availableBalance';

interface BalanceCardsProps {
  period: PeriodType;
}

export const BalanceCards = ({ period }: BalanceCardsProps) => {
  const { t } = useLanguage();
  const { transactions, savingsTransactions } = useTransactions();

  const balance = useMemo(() => {
    // Transacciones del período (para ingresos y gastos)
    const periodTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return isDateInPeriod(transactionDate, period);
    });

    // Ingresos y gastos del período
    const income = periodTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = periodTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Balance total y dinero disponible son persistentes (todas las transacciones)
    const total = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

    const availableBalance = calculateAvailableBalance(transactions, savingsTransactions);

    const periodLabels = {
      month: t.dashboard.month,
      week: t.dashboard.week,
      biweekly: t.dashboard.biweekly,
    };

    return {
      total: total.toFixed(2),
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
      availableBalance: availableBalance.toFixed(2),
      periodLabel: periodLabels[period],
    };
  }, [transactions, savingsTransactions, period, t]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">{t.dashboard.balance}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${parseFloat(balance.total) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${balance.total}
        </p>
        <p className="text-xs text-gray-500 mt-1">Total acumulado</p>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">{t.dashboard.availableBalance}</p>
        <p className="text-2xl sm:text-3xl font-bold text-cyan-300">
          ${balance.availableBalance}
        </p>
        <p className="text-xs text-gray-500 mt-1">{t.dashboard.availableToSpend}</p>
      </div>

      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">
          {t.dashboard.income} ({balance.periodLabel})
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-green-400">
          ${balance.income}
        </p>
      </div>

      <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">
          {t.dashboard.expenses} ({balance.periodLabel})
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-red-400">
          ${balance.expenses}
        </p>
      </div>
    </div>
  );
};

