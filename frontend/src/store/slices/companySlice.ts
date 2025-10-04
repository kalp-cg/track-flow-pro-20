import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, ExchangeRates } from '@/types';

interface CompanyState {
  company: Company | null;
  exchangeRates: ExchangeRates | null;
  lastRatesUpdate: number | null;
}

const initialState: CompanyState = {
  company: null,
  exchangeRates: null,
  lastRatesUpdate: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    setExchangeRates: (state, action: PayloadAction<ExchangeRates>) => {
      state.exchangeRates = action.payload;
      state.lastRatesUpdate = Date.now();
    },
  },
});

export const { setCompany, setExchangeRates } = companySlice.actions;
export default companySlice.reducer;
