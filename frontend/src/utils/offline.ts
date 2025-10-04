import localforage from 'localforage';
import { Expense } from '@/types';

const STORE_KEY = 'pending_expenses_v1';

const store = localforage.createInstance({ name: 'trackflow_offline' });

export const queuePendingExpense = async (expense: Expense) => {
  const list = (await store.getItem<Expense[]>(STORE_KEY)) || [];
  list.push(expense);
  await store.setItem(STORE_KEY, list);
};

export const getPendingExpenses = async (): Promise<Expense[]> => {
  return (await store.getItem<Expense[]>(STORE_KEY)) || [];
};

export const clearPendingExpenses = async () => {
  await store.removeItem(STORE_KEY);
};
