import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@types/transaction';
import { TransactionAPI } from '@services/api/transactionApi';
import { useToast } from '@context/ToastContext';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showError } = useToast();

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const response = await TransactionAPI.getTransactions();
      setTransactions(response.transactions);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch transactions';
      setError(errorMessage);
      showError(errorMessage, 'Error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError]);

  const refresh = useCallback(() => {
    fetchTransactions(true);
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    refreshing,
    error,
    refresh,
    refetch: fetchTransactions,
  };
};
