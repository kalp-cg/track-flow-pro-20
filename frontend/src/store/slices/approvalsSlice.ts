import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ApprovalRule } from '@/types';

interface ApprovalsState {
  pendingApprovals: Expense[];
  selectedExpense: Expense | null;
  batchSelected: string[];
  rules: ApprovalRule[];
  isLoading: boolean;
}

const initialState: ApprovalsState = {
  pendingApprovals: [],
  selectedExpense: null,
  batchSelected: [],
  rules: [],
  isLoading: false,
};

const approvalsSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    setPendingApprovals: (state, action: PayloadAction<Expense[]>) => {
      state.pendingApprovals = action.payload;
    },
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
    },
    toggleBatchSelected: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.batchSelected.includes(id)) {
        state.batchSelected = state.batchSelected.filter(i => i !== id);
      } else {
        state.batchSelected.push(id);
      }
    },
    clearBatchSelected: (state) => {
      state.batchSelected = [];
    },
    setRules: (state, action: PayloadAction<ApprovalRule[]>) => {
      state.rules = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setPendingApprovals,
  setSelectedExpense,
  toggleBatchSelected,
  clearBatchSelected,
  setRules,
  setLoading,
} = approvalsSlice.actions;
export default approvalsSlice.reducer;