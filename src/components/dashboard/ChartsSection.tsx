import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTransactions } from '../../contexts/TransactionContext';
import type { PeriodType } from '../../utils/dateUtils';
import { isDateInPeriod } from '../../utils/dateUtils';

interface ChartsSectionProps {
  period: PeriodType;
}
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartType = 'bar' | 'pie' | 'line';

export const ChartsSection = ({ period }: ChartsSectionProps) => {
  const { t } = useLanguage();
  const { transactions, categories } = useTransactions();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [viewType, setViewType] = useState<'category' | 'monthly'>('category');

  const chartData = useMemo(() => {
    if (viewType === 'category') {
      // Filtrar transacciones por período para vista por categoría
      const periodTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return isDateInPeriod(transactionDate, period);
      });

      const categoryTotals: Record<string, number> = {};
      
      periodTransactions.forEach((t) => {
        const key = t.category;
        if (!categoryTotals[key]) {
          categoryTotals[key] = 0;
        }
        if (t.type === 'expense') {
          categoryTotals[key] += t.amount;
        } else {
          categoryTotals[key] -= t.amount;
        }
      });

      return Object.entries(categoryTotals)
        .map(([name, value]) => ({
          name,
          value: Math.abs(value),
        }))
        .sort((a, b) => b.value - a.value);
    } else {
      // Para vista mensual, usar TODAS las transacciones (no filtrar por período)
      // para tener datos suficientes para el gráfico de líneas
      const monthlyTotals: Record<string, { income: number; expenses: number }> = {};
      
      transactions.forEach((t) => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = { income: 0, expenses: 0 };
        }
        
        if (t.type === 'income') {
          monthlyTotals[monthKey].income += t.amount;
        } else {
          monthlyTotals[monthKey].expenses += t.amount;
        }
      });

      return Object.entries(monthlyTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, totals]) => {
          // Formatear el mes para que sea más legible (ej: "2025-12" -> "Dic 2025")
          const [year, monthNum] = month.split('-');
          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          const monthName = monthNames[parseInt(monthNum) - 1] || monthNum;
          return {
            month: `${monthName} ${year}`,
            monthKey: month, // Mantener la clave original para ordenamiento
            income: totals.income,
            expenses: totals.expenses,
          };
        });
    }
  }, [transactions, viewType, period]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || '#3b82f6';
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="bg-blue-deep/50 backdrop-blur-sm border border-dark-accent rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100">{t.dashboard.charts}</h2>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'category' | 'monthly')}
            className="px-4 py-2 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            <option value="category">{t.dashboard.byCategory}</option>
            <option value="monthly">{t.dashboard.monthlyTrend}</option>
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="px-4 py-2 bg-blue-deep/30 border border-dark-accent rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            <option value="bar">{t.dashboard.barChart}</option>
            <option value="pie">{t.dashboard.pieChart}</option>
            <option value="line">{t.dashboard.lineChart}</option>
          </select>
        </div>
      </div>

      <div className="h-64 sm:h-80">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">{t.dashboard.noTransactions}</p>
          </div>
        ) : chartType === 'line' && viewType === 'category' ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Gráfico de líneas disponible solo para tendencia mensual</p>
          </div>
        ) : chartType === 'pie' && viewType === 'monthly' ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Gráfico de pastel disponible solo para categorías</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && viewType === 'category' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a2332',
                    border: '1px solid #1e4976',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}

            {chartType === 'bar' && viewType === 'monthly' && (
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a2332',
                    border: '1px solid #1e4976',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} name="Ingresos" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} name="Gastos" />
              </BarChart>
            )}

            {chartType === 'pie' && viewType === 'category' && (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getCategoryColor(entry.name) || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a2332',
                    border: '1px solid #1e4976',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                />
              </PieChart>
            )}

            {chartType === 'line' && viewType === 'monthly' && (
              <LineChart 
                data={chartData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="#9ca3af"
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a2332',
                    border: '1px solid #1e4976',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Ingresos"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Gastos"
                  connectNulls={false}
                />
              </LineChart>
            )}

          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

