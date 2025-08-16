import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { apiUrl } from '@/constants/api';

export const userTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: '0',
    income: '0',
    expenses: '0',
  });

  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/transactions/${userId}`);

      const data = await res.json();

      setTransactions(data);
    } catch (error: any) {
      console.log('Error fetching transactions:', error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/transactions/summary/${userId}`);

      const data = await res.json();

      setSummary(data);
    } catch (error: any) {
      console.log('Error fetching summary:', error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error: any) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransction = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete transaction');

      loadData();
      Alert.alert('Success', 'Tranasction deleted');
    } catch (error: any) {
      console.log('Error deleting transaction:', error);
      Alert.alert('Error', error?.message);
    }
  };

  return { transactions, summary, loading, loadData, deleteTransction };
};
