/**
 * Financial entities and types for Smart Finance Manager
 */

export type Frequency = 'once' | 'weekly' | 'monthly' | 'yearly';
export type TransactionType = 'income' | 'expense' | 'debt';
export type DebtStatus = 'active' | 'paid' | 'overdue';

export interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  nextPaymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number; // percentage
  dueDate: Date;
  status: DebtStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalDebt: number;
  totalExpenses: number;
  netBalance: number;
  debtToIncomeRatio: number;
  healthScore: number; // 0-100
}

export interface ExpenseTrend {
  month: string;
  total: number;
  byCategory: Record<string, number>;
}

export interface FinancialAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface FinanceState {
  incomes: Income[];
  debts: Debt[];
  expenses: Expense[];
  categories: ExpenseCategory[];
  summary: FinancialSummary;
  alerts: FinancialAlert[];
}
