import { useState, useEffect } from 'react';
import { getPendingExpenses, clearPendingExpenses } from '@/utils/offline';
import { useExpenses } from '@/hooks/queries/useExpenses';

export const useSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const expenses = useExpenses(''); // would need companyId from context

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const checkPendingCount = async () => {
      const pending = await getPendingExpenses();
      setPendingCount(pending.length);
    };
    checkPendingCount();
  }, []);

  const syncPendingExpenses = async () => {
    if (!isOnline) return;
    setSyncStatus('syncing');
    try {
      const pending = await getPendingExpenses();
      for (const expense of pending) {
        // Convert Expense to FormData and submit
        const fd = new FormData();
        fd.append('amount', expense.amount.toString());
        fd.append('currency', expense.currency);
        fd.append('category', expense.category);
        fd.append('date', expense.date);
        fd.append('description', expense.description || '');
        
        await expenses.submit.mutateAsync(fd);
      }
      await clearPendingExpenses();
      setPendingCount(0);
      setSyncStatus('idle');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  return {
    isOnline,
    syncStatus,
    pendingCount,
    syncPendingExpenses,
  } as const;
};