import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '@/types';

interface ExpensesState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  uploadProgress: { [key: string]: number };
  pendingSync: string[];
}

const initialState: ExpensesState = {
  expenses: [],
  selectedExpense: null,
  uploadProgress: {},
  pendingSync: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      state.uploadProgress[action.payload.id] = action.payload.progress;
    },
    addPendingSync: (state, action: PayloadAction<string>) => {
      if (!state.pendingSync.includes(action.payload)) {
        state.pendingSync.push(action.payload);
      }
    },
    removePendingSync: (state, action: PayloadAction<string>) => {
      state.pendingSync = state.pendingSync.filter(id => id !== action.payload);
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  setSelectedExpense,
  setUploadProgress,
  addPendingSync,
  removePendingSync,
} = expensesSlice.actions;
export default expensesSlice.reducer;
