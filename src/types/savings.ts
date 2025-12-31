export interface SavingsFund {
  id: string | number;
  name: string;
  description: string;
  color: string;
  balance: number;
  createdAt: string;
}

export interface SavingsTransaction {
  id: string;
  fundId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
}

