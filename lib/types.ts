/**
 * Financial entities and types for Smart Finance Manager
 */

export type Frequency = 'once' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
export type ExpenseFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';
export type TransactionType = 'income' | 'expense' | 'debt';
export type DebtStatus = 'active' | 'paid' | 'overdue';
export type PaymentStrategy = 'avalanche' | 'snowball' | 'hybrid';

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
  frequency: ExpenseFrequency;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Monthly projection for a debt
export interface DebtProjection {
  month: number;
  monthDate: Date;
  balance: number;
  payment: number;
  interest: number;
  principal: number;
}

// Payment plan for a single debt
export interface DebtPaymentPlan {
  debtId: string;
  debtName: string;
  currentBalance: number;
  monthlyPayment: number;
  priority: number; // 1 = highest priority
  estimatedPayoffMonths: number;
  strategy: string; // Description of the strategy
  interestRate: number;
  totalInterestPaid: number; // Total interest over the life of the debt
  projections: DebtProjection[]; // Month-by-month breakdown
}

// Comparison between different strategies
export interface StrategyComparison {
  strategy: PaymentStrategy;
  name: string;
  description: string;
  totalMonthsToPayoff: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  interestSavings: number; // Compared to minimum payments
  debtPaymentPlans: DebtPaymentPlan[];
  recommendations: string[];
}

// Advanced strategic plan with multiple strategies
export interface AdvancedStrategicPlan {
  id: string;
  createdAt: Date;
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  availableForDebtPayment: number;
  
  // Multiple strategy comparisons
  strategies: StrategyComparison[];
  recommendedStrategy: PaymentStrategy;
  
  // Overall metrics
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedDebtFreeDate: Date | null;
  totalDebtAmount: number;
  totalMonthlyDebtPayment: number;
  
  // Advanced insights
  recommendations: string[];
  alerts: string[];
  opportunities: string[];
  
  // Financial health metrics
  debtToIncomeRatio: number;
  expenseToIncomeRatio: number;
  savingsRate: number; // Percentage of income available after expenses
}

export interface FinancialSummary {
  totalIncome: number;
  totalDebt: number;
  totalExpenses: number;
  netBalance: number;
  debtToIncomeRatio: number;
  healthScore: number; // 0-100
  strategicPlan: AdvancedStrategicPlan | null;
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
