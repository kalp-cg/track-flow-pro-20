import { useQuery } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { User } from '@/types';

export const fetchUsers = async (companyId: string) => {
  const { data } = await api.get<User[]>(`/api/companies/${companyId}/users`);
  return data;
};

export const useUsers = (companyId: string | null) => {
  return useQuery({
    queryKey: ['users', companyId],
    queryFn: () => fetchUsers(companyId as string),
    enabled: !!companyId,
  });
};
