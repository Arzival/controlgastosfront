import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Category } from '../types/transaction';

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addCategory: (name: string) => void;
  deleteTransaction: (id: string) => void;
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

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        addCategory,
        deleteTransaction,
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

