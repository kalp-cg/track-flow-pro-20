import { useQuery } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { Company } from '@/types';

export const fetchCompany = async (companyId: string) => {
  const { data } = await api.get<Company>(`/api/companies/${companyId}`);
  return data;
};

export const useCompany = (companyId: string | null) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => fetchCompany(companyId as string),
    enabled: !!companyId,
    staleTime: 1000 * 60,
  });
};
