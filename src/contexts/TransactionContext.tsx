import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Category } from '../types/transaction';
import type { SavingsFund, SavingsTransaction } from '../types/savings';

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addCategory: (name: string) => void;
  deleteTransaction: (id: string) => void;
  // Savings
  savingsFunds: SavingsFund[];
  savingsTransactions: SavingsTransaction[];
  addSavingsFund: (fund: Omit<SavingsFund, 'id' | 'balance' | 'createdAt'>) => void;
  addSavingsTransaction: (transaction: Omit<SavingsTransaction, 'id'>) => void;
  deleteSavingsFund: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultCategories: Category[] = [
  { id: '1', name: 'Comida', color: '#3b82f6' },
  { id: '2', name: 'Transporte', color: '#10b981' },
  { id: '3', name: 'Entretenimiento', color: '#f59e0b' },
  { id: '4', name: 'Salud', color: '#ef4444' },
  { id: '5', name: 'Quincena', color: '#8b5cf6' },
];

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [savingsFunds, setSavingsFunds] = useState<SavingsFund[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addCategory = (name: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newCategory: Category = {
      id: generateId(),
      name,
      color: randomColor,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Savings functions
  const addSavingsFund = (fund: Omit<SavingsFund, 'id' | 'balance' | 'createdAt'>) => {
    const newFund: SavingsFund = {
      ...fund,
      id: generateId(),
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    setSavingsFunds((prev) => [...prev, newFund]);
  };

  const addSavingsTransaction = (transaction: Omit<SavingsTransaction, 'id'>) => {
    const newTransaction: SavingsTransaction = {
      ...transaction,
      id: generateId(),
    };
    setSavingsTransactions((prev) => [newTransaction, ...prev]);

    // Update fund balance
    setSavingsFunds((prev) =>
      prev.map((fund) => {
        if (fund.id === transaction.fundId) {
          const newBalance =
            transaction.type === 'deposit'
              ? fund.balance + transaction.amount
              : fund.balance - transaction.amount;
          return { ...fund, balance: Math.max(0, newBalance) };
        }
        return fund;
      })
    );
  };

  const deleteSavingsFund = (id: string) => {
    setSavingsFunds((prev) => prev.filter((f) => f.id !== id));
    setSavingsTransactions((prev) => prev.filter((t) => t.fundId !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        addCategory,
        deleteTransaction,
        savingsFunds,
        savingsTransactions,
        addSavingsFund,
        addSavingsTransaction,
        deleteSavingsFund,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

