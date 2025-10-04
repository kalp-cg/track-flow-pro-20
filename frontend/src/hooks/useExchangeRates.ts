import { useQuery } from '@tanstack/react-query';
import { fetchExchangeRates } from '@/utils/exchange';
import { ExchangeRates } from '@/types';

export const useExchangeRates = (base: string) => {
  return useQuery<ExchangeRates>({
    queryKey: ['exchange', base],
    queryFn: () => fetchExchangeRates(base),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};
