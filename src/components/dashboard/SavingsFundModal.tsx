import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { createSavingsFundRequest } from '../../request/savings/savings.request';

interface SavingsFundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

export const SavingsFundModal = ({ isOpen, onClose }: SavingsFundModalProps) => {
  const { t } = useLanguage();
  const { reloadSavingsFunds } = useTransactions();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colors[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createSavingsFundRequest({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
      });

      // Recargar los fondos desde el backend para asegurar sincronización
      await reloadSavingsFunds();

      setFormData({
        name: '',
        description: '',
        color: colors[0],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la caja de ahorro. Por favor, intenta de nuevo.');
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

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-blue-deep/95 backdrop-blur-sm border border-dark-accent rounded-2xl p-4 sm:p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 text-left">
              {t.dashboard.addSavingsFund}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-blue-deep/50 rounded-lg transition-colors"
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                {t.dashboard.fundName}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t.dashboard.fundName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                {t.dashboard.fundDescription}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder={t.dashboard.fundDescription}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-blue-deep scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {loading ? 'Creando...' : t.dashboard.createFund}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

