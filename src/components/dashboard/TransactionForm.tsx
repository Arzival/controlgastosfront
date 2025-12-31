import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { createTransactionRequest } from '../../request/transactions/transactions.request';
import type { TransactionType } from '../../types/transaction';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionFormModal = ({ isOpen, onClose }: TransactionFormModalProps) => {
  const { t } = useLanguage();
  const { categories, addCategory, reloadTransactions } = useTransactions();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    setLoading(true);
    setError(null);

    try {
      await createTransactionRequest({
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || undefined,
        date: formData.date,
      });

      // Recargar las transacciones desde el backend para obtener los datos actualizados
      await reloadTransactions();

      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      
      // Close modal
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la transacción. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowCategoryForm(false);
    } catch (error: any) {
      // El error ya se maneja en el contexto, pero podemos mostrar un mensaje aquí si es necesario
      console.error('Error al crear categoría:', error);
    }
  };

  return (
    <>
      {/* Backdrop y Modal Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-blue-deep/95 backdrop-blur-sm border border-dark-accent rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 text-left">
              {t.dashboard.addTransaction}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-blue-deep/50 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
              {t.dashboard.transactionType}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="expense">{t.dashboard.expense}</option>
              <option value="income">{t.dashboard.income}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
              {t.dashboard.amount}
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
              {t.dashboard.category}
            </label>
            <div className="flex gap-2">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">{t.dashboard.category}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="px-4 py-3 bg-blue-deep/50 hover:bg-blue-deep/70 border border-dark-accent rounded-lg text-gray-200 transition-colors"
              >
                +
              </button>
            </div>
            {showCategoryForm && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder={t.dashboard.categoryName}
                  className="flex-1 px-4 py-2 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                >
                  {t.dashboard.save}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  {t.dashboard.cancel}
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
              {t.dashboard.date}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
            {t.dashboard.description}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder={t.dashboard.description}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
        >
          {loading ? 'Guardando...' : t.dashboard.submit}
        </button>
      </form>
        </div>
      </div>
    </>
  );
};

