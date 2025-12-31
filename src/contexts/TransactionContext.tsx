import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Category } from '../types/transaction';
import type { SavingsFund, SavingsTransaction } from '../types/savings';
import { getSavingsFundsRequest, deleteSavingsFundRequest, updateSavingsFundRequest } from '../request/savings/savings.request';
import { getTransactionsRequest, getSavingsTransactionsRequest, deleteTransactionRequest, deleteSavingsTransactionRequest, updateTransactionRequest } from '../request/transactions/transactions.request';
import { getCategoriesRequest, createCategoryRequest, deleteCategoryRequest, updateCategoryRequest } from '../request/categories/categories.request';

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addCategory: (name: string, color?: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  // Savings
  savingsFunds: SavingsFund[];
  savingsTransactions: SavingsTransaction[];
  addSavingsFund: (fund: Omit<SavingsFund, 'id' | 'balance' | 'createdAt'>) => void;
  addSavingsTransaction: (transaction: Omit<SavingsTransaction, 'id'>) => void;
  deleteSavingsFund: (id: string) => Promise<void>;
  updateSavingsFund: (id: string, data: Partial<Omit<SavingsFund, 'id' | 'balance' | 'createdAt'>>) => Promise<void>;
  deleteSavingsTransaction: (id: string) => Promise<void>;
  // Categories
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  // Reload functions
  reloadSavingsFunds: () => Promise<void>;
  reloadTransactions: () => Promise<void>;
  reloadSavingsTransactions: () => Promise<void>;
  reloadCategories: () => Promise<void>;
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
  // Inicializar con categorías por defecto
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [savingsFunds, setSavingsFunds] = useState<SavingsFund[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);

  // Función para cargar cajas de ahorro desde el backend
  const loadSavingsFunds = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return; // No cargar si no hay token
    try {
      const response = await getSavingsFundsRequest();
      // Convertir los datos del backend al formato del frontend
      const funds: SavingsFund[] = response.data.map((fund) => ({
        id: fund.id.toString(), // Convertir number a string para mantener compatibilidad
        name: fund.name,
        description: fund.description || '',
        color: fund.color,
        balance: Number(fund.balance),
        createdAt: fund.created_at,
      }));
      setSavingsFunds(funds);
    } catch (error) {
      console.error('Error al cargar cajas de ahorro:', error);
      // No mostrar error al usuario, solo dejar el array vacío
    }
  };

  // Función para cargar transacciones normales desde el backend
  const loadTransactions = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return; // No cargar si no hay token
    try {
      const response = await getTransactionsRequest();
      // Convertir los datos del backend al formato del frontend
      const transactionsData: Transaction[] = response.data.map((transaction) => ({
        id: transaction.id.toString(),
        type: transaction.type as 'expense' | 'income',
        amount: Number(transaction.amount),
        category: transaction.category,
        description: transaction.description || '',
        date: transaction.date,
      }));
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      // No mostrar error al usuario, solo dejar el array vacío
    }
  };

  // Función para cargar transacciones de ahorro desde el backend
  const loadSavingsTransactions = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return; // No cargar si no hay token
    try {
      const response = await getSavingsTransactionsRequest();
      // Convertir los datos del backend al formato del frontend
      const savingsTransactionsData: SavingsTransaction[] = response.data.map((transaction) => ({
        id: transaction.id.toString(),
        fundId: transaction.savings_fund_id.toString(),
        type: transaction.type as 'deposit' | 'withdrawal',
        amount: Number(transaction.amount),
        description: transaction.description || '',
        date: transaction.date,
      }));
      setSavingsTransactions(savingsTransactionsData);
    } catch (error) {
      console.error('Error al cargar transacciones de ahorro:', error);
      // No mostrar error al usuario, solo dejar el array vacío
    }
  };

  // Función para cargar categorías desde el backend
  const loadCategories = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // Si no hay token, usar solo categorías por defecto
      setCategories(defaultCategories);
      return;
    }
    try {
      const response = await getCategoriesRequest();
      // Convertir los datos del backend al formato del frontend
      const backendCategories: Category[] = response.data.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        color: category.color,
      }));

      // Obtener nombres de categorías del backend para evitar duplicados
      const backendCategoryNames = new Set(backendCategories.map(cat => cat.name.toLowerCase()));

      // Combinar categorías por defecto con las del backend
      // Si una categoría por defecto ya existe en el backend, usar la del backend
      const defaultCategoriesFiltered = defaultCategories.filter(
        defaultCat => !backendCategoryNames.has(defaultCat.name.toLowerCase())
      );

      // Combinar: primero las del backend, luego las por defecto que no están duplicadas
      const allCategories = [...backendCategories, ...defaultCategoriesFiltered];
      setCategories(allCategories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      // Si hay error, usar solo categorías por defecto
      setCategories(defaultCategories);
    }
  };

  // Cargar todos los datos desde el backend cuando el componente se monta
  useEffect(() => {
    loadSavingsFunds();
    loadTransactions();
    loadSavingsTransactions();
    loadCategories();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addCategory = async (name: string, color?: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const categoryColor = color || colors[Math.floor(Math.random() * colors.length)];
    
    try {
      // Guardar la categoría en el backend
      const response = await createCategoryRequest({
        name: name.trim(),
        color: categoryColor,
      });

      // Convertir la respuesta del backend al formato del frontend
      const newCategory: Category = {
        id: response.data.id.toString(),
        name: response.data.name,
        color: response.data.color,
      };

      // Agregar al estado local
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionRequest(id);
      // Recargar las transacciones desde el backend
      await loadTransactions();
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      await updateTransactionRequest({
        id,
        ...data,
      });
      // Recargar las transacciones desde el backend
      await loadTransactions();
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      throw error;
    }
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

  const deleteSavingsFund = async (id: string) => {
    try {
      await deleteSavingsFundRequest(id);
      // Recargar los fondos y transacciones desde el backend
      await Promise.all([
        loadSavingsFunds(),
        loadSavingsTransactions()
      ]);
    } catch (error) {
      console.error('Error al eliminar fondo de ahorro:', error);
      throw error;
    }
  };

  const updateSavingsFund = async (id: string, data: Partial<Omit<SavingsFund, 'id' | 'balance' | 'createdAt'>>) => {
    try {
      await updateSavingsFundRequest({
        id,
        ...data,
      });
      // Recargar los fondos desde el backend
      await loadSavingsFunds();
    } catch (error) {
      console.error('Error al actualizar fondo de ahorro:', error);
      throw error;
    }
  };

  const deleteSavingsTransaction = async (id: string) => {
    try {
      await deleteSavingsTransactionRequest(id);
      // Recargar los fondos y transacciones desde el backend
      await Promise.all([
        loadSavingsFunds(),
        loadSavingsTransactions()
      ]);
    } catch (error) {
      console.error('Error al eliminar transacción de ahorro:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryRequest(id);
      // Recargar las categorías desde el backend
      await loadCategories();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      await updateCategoryRequest({
        id,
        ...data,
      });
      // Recargar las categorías desde el backend
      await loadCategories();
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        addCategory,
        deleteTransaction,
        updateTransaction,
        savingsFunds,
        savingsTransactions,
        addSavingsFund,
        addSavingsTransaction,
        deleteSavingsFund,
        updateSavingsFund,
        deleteSavingsTransaction,
        deleteCategory,
        updateCategory,
        reloadSavingsFunds: loadSavingsFunds,
        reloadTransactions: loadTransactions,
        reloadSavingsTransactions: loadSavingsTransactions,
        reloadCategories: loadCategories,
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

