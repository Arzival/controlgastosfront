export type PeriodType = 'month' | 'week' | 'biweekly';

export const getPeriodDates = (period: PeriodType): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (period) {
    case 'week':
      // Últimos 7 días
      start.setDate(now.getDate() - 7);
      end.setTime(now.getTime());
      break;
    
    case 'biweekly':
      // Últimos 15 días
      start.setDate(now.getDate() - 15);
      end.setTime(now.getTime());
      break;
    
    case 'month':
    default:
      // Mes actual
      start.setMonth(now.getMonth());
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
};

export const isDateInPeriod = (date: Date, period: PeriodType): boolean => {
  const { start, end } = getPeriodDates(period);
  return date >= start && date <= end;
};

