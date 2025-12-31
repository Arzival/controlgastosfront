import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { createTransactionRequest, updateTransactionRequest } from '../../request/transactions/transactions.request';
import type { TransactionType } from '../../types/transaction';
import type { Transaction } from '../../types/transaction';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

export const TransactionFormModal = ({ isOpen, onClose, transactionToEdit }: TransactionFormModalProps) => {
  const { t } = useLanguage();
  const { categories, addCategory, deleteCategory, updateCategory, reloadTransactions, reloadCategories } = useTransactions();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const isEditMode = !!transactionToEdit;

  // Cargar datos de la transacción cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && transactionToEdit) {
      setFormData({
        type: transactionToEdit.type,
        amount: transactionToEdit.amount.toString(),
        category: transactionToEdit.category,
        description: transactionToEdit.description || '',
        date: transactionToEdit.date,
      });
    } else if (isOpen && !transactionToEdit) {
      // Reset form cuando se abre en modo creación
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, transactionToEdit]);

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
      if (isEditMode && transactionToEdit) {
        // Modo edición
        await updateTransactionRequest({
          id: transactionToEdit.id,
          type: formData.type,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description || undefined,
          date: formData.date,
        });
      } else {
        // Modo creación
        await createTransactionRequest({
          type: formData.type,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description || undefined,
          date: formData.date,
        });
      }

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
      setError(err.message || (isEditMode ? 'Error al actualizar la transacción. Por favor, intenta de nuevo.' : 'Error al crear la transacción. Por favor, intenta de nuevo.'));
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
      await reloadCategories();
    } catch (error: any) {
      // El error ya se maneja en el contexto, pero podemos mostrar un mensaje aquí si es necesario
      console.error('Error al crear categoría:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría? No se puede eliminar si está en uso.')) {
      setDeletingCategoryId(categoryId);
      try {
        await deleteCategory(categoryId);
        await reloadCategories();
      } catch (error: any) {
        alert(error.message || 'Error al eliminar la categoría. Por favor, intenta de nuevo.');
      } finally {
        setDeletingCategoryId(null);
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      await updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
        color: editingCategory.color,
      });
      setEditingCategory(null);
      await reloadCategories();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar la categoría. Por favor, intenta de nuevo.');
    }
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

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
              {isEditMode ? 'Editar Transacción' : t.dashboard.addTransaction}
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
                title="Agregar categoría"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className="px-4 py-3 bg-blue-deep/50 hover:bg-blue-deep/70 border border-dark-accent rounded-lg text-gray-200 transition-colors"
                title="Gestionar categorías"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
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
            {showCategoryManager && (
              <div className="mt-4 p-4 bg-blue-deep/20 border border-dark-accent rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Gestionar Categorías</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2 p-2 bg-blue-deep/30 rounded-lg"
                    >
                      {editingCategory?.id === cat.id ? (
                        <>
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="flex-1 px-2 py-1 bg-blue-deep/50 border border-dark-accent rounded text-gray-100 text-sm"
                          />
                          <div className="flex gap-1">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditingCategory({ ...editingCategory, color })}
                                className={`w-6 h-6 rounded ${
                                  editingCategory.color === color ? 'ring-2 ring-blue-400' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleUpdateCategory}
                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="flex-1 text-sm text-gray-200">{cat.name}</span>
                          <button
                            type="button"
                            onClick={() => setEditingCategory({ id: cat.id, name: cat.name, color: cat.color })}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            disabled={deletingCategoryId === cat.id}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryManager(false)}
                  className="mt-3 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  Cerrar
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
          {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : t.dashboard.submit)}
        </button>
      </form>
        </div>
      </div>
    </>
  );
};

