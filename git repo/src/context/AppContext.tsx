import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Education',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Gift',
  'Other',
] as const;

export const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet'];

export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#f97316',
  'Transport': '#3b82f6',
  'Shopping': '#ec4899',
  'Entertainment': '#a855f7',
  'Bills & Utilities': '#ef4444',
  'Health & Fitness': '#22c55e',
  'Travel': '#06b6d4',
  'Education': '#6366f1',
  'Other': '#94a3b8',
};

export const CURRENCIES = [
  { code: 'USD', sbolym: '$', name: 'USDT' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const TIMEZONES = [
  'America/New_York','Asia/Kolkata',
];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  timezone: string;
  phone?: string;
  jobTitle?: string;
  notifications: {
    budgetAlerts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    expenseReminders: boolean;
  };
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  paymentMethod: string;
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  isRecurring: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly' | 'yearly';
  alertAt: number;
}

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

const generateMockExpenses = (): Expense[] => [
  { id: 'e1', title: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2026-02-01', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e2', title: 'Weed', amount: 145.50, category: 'Food & Dining', date: '2026-02-03', isRecurring: false, paymentMethod: 'Debit Card' },
  { id: 'e5', title: 'Electric Bill', amount: 142.00, category: 'Bills & Utilities', date: '2026-02-08', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e11', title: 'Phone recharge', amount: 79.99, category: 'Bills & Utilities', date: '2026-02-16', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e13', title: 'Spotify Premium', amount: 9.99, category: 'Entertainment', date: '2026-02-20', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e15', title: 'Internet - Comcast', amount: 59.99, category: 'Bills & Utilities', date: '2026-02-22', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e18', title: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2026-01-01', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e26', title: 'Phone Bill', amount: 79.99, category: 'Bills & Utilities', date: '2026-01-16', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e28', title: 'Spotify Premium', amount: 9.99, category: 'Entertainment', date: '2026-01-20', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e30', title: 'Internet Bill', amount: 59.99, category: 'Bills & Utilities', date: '2026-01-22', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e34', title: 'Electric Bill', amount: 156.00, category: 'Bills & Utilities', date: '2025-12-10', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e35', title: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2025-12-01', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e39', title: 'Phone Bill', amount: 79.99, category: 'Bills & Utilities', date: '2025-12-16', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e40', title: 'Gym Membership', amount: 25.00, category: 'Health & Fitness', date: '2025-12-10', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Debit Card' },
  { id: 'e41', title: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2025-11-01', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e42', title: 'Grocery', amount: 167.20, category: 'Food & Dining', date: '2025-11-03', isRecurring: false, paymentMethod: 'Debit Card' },
  { id: 'e43', title: 'Electric Bill', amount: 131.00, category: 'Bills & Utilities', date: '2025-11-10', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e45', title: 'Phone Bill', amount: 79.99, category: 'Bills & Utilities', date: '2025-11-16', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e47', title: 'Online Course', amount: 149.00, category: 'Education', date: '2025-11-22', isRecurring: false, paymentMethod: 'Credit Card' },
  { id: 'e48', title: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2025-10-01', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Credit Card' },
  { id: 'e49', title: 'Grocery', amount: 189.40, category: 'Food & Dining', date: '2025-10-04', isRecurring: false, paymentMethod: 'Debit Card' },
  { id: 'e50', title: 'Electric Bill', amount: 127.00, category: 'Bills & Utilities', date: '2025-10-10', isRecurring: true, recurringFrequency: 'monthly', paymentMethod: 'Bank Transfer' },
  { id: 'e51', title: 'clothes', amount: 65.00, category: 'Shopping', date: '2025-10-28', isRecurring: false, paymentMethod: 'Credit Card' },
  { id: 'e52', title: 'Restaurant', amount: 92.00, category: 'Food & Dining', date: '2025-10-20', isRecurring: false, paymentMethod: 'Credit Card' },
];

const generateMockIncome = (): Income[] => [
  { id: 'i1', title: 'Monthly Salary', amount: 5000.00, category: 'Salary', date: '2026-02-01', isRecurring: true, description: 'Regular monthly salary' },
  { id: 'i3', title: 'Dividend Income', amount: 145.50, category: 'Investment', date: '2026-02-20', isRecurring: false },
  { id: 'i4', title: 'Monthly Salary', amount: 5000.00, category: 'Salary', date: '2026-01-01', isRecurring: true },
  { id: 'i5', title: 'Freelance  web Design-', amount: 450.00, category: 'Freelance', date: '2026-01-18', isRecurring: false },
  { id: 'i6', title: 'Stock', amount: 132.00, category: 'Investment', date: '2026-01-22', isRecurring: false },
  { id: 'i7', title: 'Monthly Salary', amount: 5000.00, category: 'Salary', date: '2025-12-01', isRecurring: true },
  { id: 'i8', title: 'Year-End Bonus', amount: 2500.00, category: 'Salary', date: '2025-12-28', isRecurring: false },
  { id: 'i9', title: 'Monthly Salary', amount: 5000.00, category: 'Salary', date: '2025-11-01', isRecurring: true },
  { id: 'i11', title: 'Monthly Salary', amount: 5000.00, category: 'Salary', date: '2025-10-01', isRecurring: true },
  { id: 'i12', title: 'Dividend Income', amount: 98.75, category: 'Investment', date: '2025-10-25', isRecurring: false },
];

const generateMockBudgets = (): Budget[] => [
  { id: 'b1', category: 'Food & Dining', limit: 600, period: 'monthly', alertAt: 75 },
  { id: 'b2', category: 'Transport', limit: 200, period: 'monthly', alertAt: 80 },
  { id: 'b3', category: 'Entertainment', limit: 150, period: 'monthly', alertAt: 80 },
  { id: 'b4', category: 'Shopping', limit: 350, period: 'monthly', alertAt: 75 },
  { id: 'b5', category: 'Bills & Utilities', limit: 450, period: 'monthly', alertAt: 90 },
  { id: 'b6', category: 'Health & Fitness', limit: 200, period: 'monthly', alertAt: 80 },
];

interface AppContextType {
  user: User | null;
  isDark: boolean;
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  login: (userData: { name: string; email: string }) => void;
  logout: () => void;
  toggleTheme: () => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  updateExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;
  addIncome: (i: Omit<Income, 'id'>) => void;
  updateIncome: (i: Income) => void;
  deleteIncome: (id: string) => void;
  saveBudget: (b: Omit<Budget, 'id'> & { id?: string }) => void;
  deleteBudget: (id: string) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('spendly_user');
    const savedExpenses = localStorage.getItem('spendly_expenses');
    const savedIncome = localStorage.getItem('spendly_income');
    const savedBudgets = localStorage.getItem('spendly_budgets');
    const savedTheme = localStorage.getItem('spendly_theme');

    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    if (savedExpenses) {
      try { setExpenses(JSON.parse(savedExpenses)); } catch {}
    } else {
      const mock = generateMockExpenses();
      setExpenses(mock);
      localStorage.setItem('spendly_expenses', JSON.stringify(mock));
    }
    if (savedIncome) {
      try { setIncome(JSON.parse(savedIncome)); } catch {}
    } else {
      const mock = generateMockIncome();
      setIncome(mock);
      localStorage.setItem('spendly_income', JSON.stringify(mock));
    }
    if (savedBudgets) {
      try { setBudgets(JSON.parse(savedBudgets)); } catch {}
    } else {
      const mock = generateMockBudgets();
      setBudgets(mock);
      localStorage.setItem('spendly_budgets', JSON.stringify(mock));
    }
    if (savedTheme !== null) {
      setIsDark(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('spendly_theme', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    if (user) localStorage.setItem('spendly_user', JSON.stringify(user));
    else localStorage.removeItem('spendly_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('spendly_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('spendly_income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('spendly_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const login = useCallback(({ name, email }: { name: string; email: string }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name:
      email,
      currency: 'USD',
      timezone: 'America/New_York',
      jobTitle: 'Software Engineer',
      notifications: {
        budgetAlerts: true,
        weeklyReports: true,
        monthlyReports: true,
        expenseReminders: false,
      },
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('spendly_user');
  }, []);

  const toggleTheme = useCallback(() => setIsDark(d => !d), []);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...e, id: `e${Date.now()}` }, ...prev]);
  }, []);

  const updateExpense = useCallback((e: Expense) => {
    setExpenses(prev => prev.map(x => x.id === e.id ? e : x));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(x => x.id !== id));
  }, []);

  const addIncome = useCallback((i: Omit<Income, 'id'>) => {
    setIncome(prev => [{ ...i, id: `i${Date.now()}` }, ...prev]);
  }, []);

  const updateIncome = useCallback((i: Income) => {
    setIncome(prev => prev.map(x => x.id === i.id ? i : x));
  }, []);

  const deleteIncome = useCallback((id: string) => {
    setIncome(prev => prev.filter(x => x.id !== id));
  }, []);

  const saveBudget = useCallback((b: Omit<Budget, 'id'> & { id?: string }) => {
    if (b.id) {
      setBudgets(prev => prev.map(x => x.id === b.id ? (b as Budget) : x));
    } else {
      setBudgets(prev => [...prev, { ...b, id: `b${Date.now()}` }]);
    }
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(x => x.id !== id));
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AppContext.Provider value={{
      user, isDark, expenses, income, budgets,
      login, logout, toggleTheme,
      addExpense, updateExpense, deleteExpense,
      addIncome, updateIncome, deleteIncome,
      saveBudget, deleteBudget, updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
