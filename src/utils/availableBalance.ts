import type { Transaction } from '../types/transaction';
import type { SavingsTransaction } from '../types/savings';

export const calculateAvailableBalance = (
  transactions: Transaction[],
  savingsTransactions: SavingsTransaction[]
): number => {
  // Calcular ingresos totales
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular depósitos a fondos (dinero que se fue a ahorros)
  const totalDeposits = savingsTransactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular retiros de fondos (dinero que regresó de ahorros)
  const totalWithdrawals = savingsTransactions
    .filter((t) => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  // Dinero disponible = Ingresos - Depósitos + Retiros
  const available = totalIncome - totalDeposits + totalWithdrawals;

  return Math.max(0, available);
};

