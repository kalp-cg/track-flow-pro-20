import { Country, ExchangeRates } from '@/types';

const RESTCOUNTRIES_API = 'https://restcountries.com/v3.1';
const EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest';

export const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${RESTCOUNTRIES_API}/all?fields=name,cca2,currencies,flags`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
};

export const fetchCountryByCurrency = async (currencyCode: string): Promise<Country> => {
  const response = await fetch(`${RESTCOUNTRIES_API}/currency/${currencyCode}?fields=name,cca2,currencies,flags`);
  if (!response.ok) throw new Error('Failed to fetch country');
  const countries = await response.json();
  return countries[0];
};

export const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRates> => {
  const response = await fetch(`${EXCHANGE_API}/${baseCurrency}`);
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  const data = await response.json();
  return {
    base: data.base,
    rates: data.rates,
    timestamp: data.time_last_updated * 1000,
  };
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency first, then to target
  const inBase = amount / rates.rates[fromCurrency];
  const converted = inBase * rates.rates[toCurrency];
  
  return Math.round(converted * 100) / 100;
};
