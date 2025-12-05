import { useLanguage } from '../../contexts/LanguageContext';
import type { SavingsFund } from '../../types/savings';

interface SavingsFundCardProps {
  fund: SavingsFund;
  onManage: () => void;
}

export const SavingsFundCard = ({ fund, onManage }: SavingsFundCardProps) => {
  const { t } = useLanguage();

  return (
    <div
      className="bg-blue-deep/30 border border-dark-accent rounded-xl p-4 sm:p-6 hover:bg-blue-deep/50 transition-all cursor-pointer"
      onClick={onManage}
      style={{ borderLeftColor: fund.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-100 mb-1">{fund.name}</h3>
          {fund.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{fund.description}</p>
          )}
        </div>
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
          style={{ backgroundColor: fund.color }}
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-dark-accent">
        <p className="text-xs text-gray-400 mb-1">{t.dashboard.currentBalance}</p>
        <p className="text-2xl font-bold text-green-400">${fund.balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

