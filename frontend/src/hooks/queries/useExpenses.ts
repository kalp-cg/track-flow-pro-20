import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { Expense } from '@/types';

export const fetchExpenses = async (companyId: string) => {
  const { data } = await api.get<Expense[]>(`/api/companies/${companyId}/expenses`);
  return data;
};

export const submitExpense = async (payload: FormData) => {
  // API expects multipart/form-data
  const { data } = await api.post('/api/expenses', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data as Expense;
};

export const useExpenses = (companyId: string | null) => {
  const qc = useQueryClient();
  return {
    list: useQuery({
      queryKey: ['expenses', companyId],
      queryFn: () => fetchExpenses(companyId as string),
      enabled: !!companyId,
    }),
    submit: useMutation({
      mutationFn: (payload: FormData) => submitExpense(payload),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
    }),
  };
};
