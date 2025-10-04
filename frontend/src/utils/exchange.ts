import { ExchangeRates } from '@/types';

const EXCHANGE_API = import.meta.env.VITE_EXCHANGE_API || 'https://api.exchangerate-api.com/v4/latest';

export const fetchExchangeRates = async (base: string): Promise<ExchangeRates> => {
  const res = await fetch(`${EXCHANGE_API}/${base}`);
  if (!res.ok) throw new Error('Failed to fetch exchange rates');
  const data = await res.json();
  return {
    base: data.base,
    rates: data.rates,
    timestamp: (data.time_last_updated || Date.now() / 1000) * 1000,
  };
};

export const convert = (amount: number, from: string, to: string, rates: ExchangeRates) => {
  if (from === to) return amount;
  const fromRate = rates.rates[from];
  const toRate = rates.rates[to];
  if (!fromRate || !toRate) return amount;
  const inBase = amount / fromRate;
  const converted = inBase * toRate;
  return Math.round(converted * 100) / 100;
};
