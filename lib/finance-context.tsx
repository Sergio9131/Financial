import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinanceState, Income, Debt, Expense, ExpenseCategory, FinancialAlert } from './types';

const STORAGE_KEY = 'finance_data';

const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Comida', color: '#FF6B6B', icon: 'restaurant', createdAt: new Date() },
  { id: '2', name: 'Transporte', color: '#4ECDC4', icon: 'directions-car', createdAt: new Date() },
  { id: '3', name: 'Entretenimiento', color: '#FFE66D', icon: 'movie', createdAt: new Date() },
  { id: '4', name: 'Servicios', color: '#95E1D3', icon: 'home', createdAt: new Date() },
  { id: '5', name: 'Salud', color: '#F38181', icon: 'local-hospital', createdAt: new Date() },
  { id: '6', name: 'Educación', color: '#AA96DA', icon: 'school', createdAt: new Date() },
  { id: '7', name: 'Otros', color: '#CCCCCC', icon: 'more-horiz', createdAt: new Date() },
];

const initialState: FinanceState = {
  incomes: [],
  debts: [],
  expenses: [],
  categories: defaultCategories,
  summary: {
    totalIncome: 0,
    totalDebt: 0,
    totalExpenses: 0,
    netBalance: 0,
    debtToIncomeRatio: 0,
    healthScore: 100,
  },
  alerts: [],
};

type Action =
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'UPDATE_INCOME'; payload: Income }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'ADD_DEBT'; payload: Debt }
  | { type: 'UPDATE_DEBT'; payload: Debt }
  | { type: 'DELETE_DEBT'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: ExpenseCategory }
  | { type: 'SET_STATE'; payload: FinanceState }
  | { type: 'RECALCULATE_SUMMARY' };

const calculateSummary = (state: FinanceState): FinanceState => {
  const totalIncome = state.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalDebt = state.debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netBalance = totalIncome - totalDebt - totalExpenses;
  const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;

  // Health score: 100 if balanced, decreases with debt
  let healthScore = 100;
  if (debtToIncomeRatio > 50) healthScore = 40;
  else if (debtToIncomeRatio > 30) healthScore = 60;
  else if (debtToIncomeRatio > 10) healthScore = 80;

  // Generate alerts
  const alerts: FinancialAlert[] = [];
  if (debtToIncomeRatio > 50) {
    alerts.push({
      id: 'debt-warning',
      type: 'error',
      title: 'Deuda Alta',
      message: `Tu deuda es ${debtToIncomeRatio.toFixed(0)}% de tus ingresos. Considera reducir gastos.`,
    });
  }
  if (netBalance < 0) {
    alerts.push({
      id: 'negative-balance',
      type: 'error',
      title: 'Balance Negativo',
      message: `Tu balance es negativo: ${netBalance.toFixed(2)}. Necesitas aumentar ingresos o reducir gastos.`,
    });
  }

  return {
    ...state,
    summary: {
      totalIncome,
      totalDebt,
      totalExpenses,
      netBalance,
      debtToIncomeRatio,
      healthScore,
    },
    alerts,
  };
};

const financeReducer = (state: FinanceState, action: Action): FinanceState => {
  let newState = state;

  switch (action.type) {
    case 'ADD_INCOME':
      newState = { ...state, incomes: [...state.incomes, action.payload] };
      break;
    case 'UPDATE_INCOME':
      newState = {
        ...state,
        incomes: state.incomes.map((i) => (i.id === action.payload.id ? action.payload : i)),
      };
      break;
    case 'DELETE_INCOME':
      newState = { ...state, incomes: state.incomes.filter((i) => i.id !== action.payload) };
      break;
    case 'ADD_DEBT':
      newState = { ...state, debts: [...state.debts, action.payload] };
      break;
    case 'UPDATE_DEBT':
      newState = {
        ...state,
        debts: state.debts.map((d) => (d.id === action.payload.id ? action.payload : d)),
      };
      break;
    case 'DELETE_DEBT':
      newState = { ...state, debts: state.debts.filter((d) => d.id !== action.payload) };
      break;
    case 'ADD_EXPENSE':
      newState = { ...state, expenses: [...state.expenses, action.payload] };
      break;
    case 'UPDATE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.map((e) => (e.id === action.payload.id ? action.payload : e)),
      };
      break;
    case 'DELETE_EXPENSE':
      newState = { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
      break;
    case 'ADD_CATEGORY':
      newState = { ...state, categories: [...state.categories, action.payload] };
      break;
    case 'SET_STATE':
      return action.payload;
    case 'RECALCULATE_SUMMARY':
      return calculateSummary(state);
    default:
      return state;
  }

  return calculateSummary(newState);
};

interface FinanceContextType {
  state: FinanceState;
  addIncome: (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<ExpenseCategory, 'id' | 'createdAt'>) => void;
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    loadState();
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    saveState();
  }, [state]);

  const loadState = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Convert date strings back to Date objects
        const restoredState = {
          ...parsed,
          incomes: parsed.incomes.map((i: any) => ({
            ...i,
            nextPaymentDate: new Date(i.nextPaymentDate),
            createdAt: new Date(i.createdAt),
            updatedAt: new Date(i.updatedAt),
          })),
          debts: parsed.debts.map((d: any) => ({
            ...d,
            dueDate: new Date(d.dueDate),
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
          })),
          expenses: parsed.expenses.map((e: any) => ({
            ...e,
            date: new Date(e.date),
            createdAt: new Date(e.createdAt),
            updatedAt: new Date(e.updatedAt),
          })),
          categories: parsed.categories.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
          })),
        };
        dispatch({ type: 'SET_STATE', payload: restoredState });
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving finance data:', error);
    }
  };

  const addIncome = (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({
      type: 'ADD_INCOME',
      payload: {
        ...income,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    const income = state.incomes.find((i) => i.id === id);
    if (income) {
      dispatch({
        type: 'UPDATE_INCOME',
        payload: { ...income, ...updates, updatedAt: new Date() },
      });
    }
  };

  const deleteIncome = (id: string) => {
    dispatch({ type: 'DELETE_INCOME', payload: id });
  };

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({
      type: 'ADD_DEBT',
      payload: {
        ...debt,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    const debt = state.debts.find((d) => d.id === id);
    if (debt) {
      dispatch({
        type: 'UPDATE_DEBT',
        payload: { ...debt, ...updates, updatedAt: new Date() },
      });
    }
  };

  const deleteDebt = (id: string) => {
    dispatch({ type: 'DELETE_DEBT', payload: id });
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        ...expense,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const expense = state.expenses.find((e) => e.id === id);
    if (expense) {
      dispatch({
        type: 'UPDATE_EXPENSE',
        payload: { ...expense, ...updates, updatedAt: new Date() },
      });
    }
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const addCategory = (category: Omit<ExpenseCategory, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_CATEGORY',
      payload: {
        ...category,
        id: Date.now().toString(),
        createdAt: new Date(),
      },
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        addIncome,
        updateIncome,
        deleteIncome,
        addDebt,
        updateDebt,
        deleteDebt,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        loadState,
        saveState,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
