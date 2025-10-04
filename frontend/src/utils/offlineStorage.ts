import localforage from 'localforage';
import { Expense } from '@/types';

const pendingExpensesStore = localforage.createInstance({
  name: 'expense-manager',
  storeName: 'pending_expenses',
});

export const savePendingExpense = async (expense: Expense): Promise<void> => {
  await pendingExpensesStore.setItem(expense.id, expense);
};

export const getPendingExpenses = async (): Promise<Expense[]> => {
  const keys = await pendingExpensesStore.keys();
  const expenses: Expense[] = [];
  
  for (const key of keys) {
    const expense = await pendingExpensesStore.getItem<Expense>(key);
    if (expense) expenses.push(expense);
  }
  
  return expenses;
};

export const removePendingExpense = async (expenseId: string): Promise<void> => {
  await pendingExpensesStore.removeItem(expenseId);
};

export const clearPendingExpenses = async (): Promise<void> => {
  await pendingExpensesStore.clear();
};
