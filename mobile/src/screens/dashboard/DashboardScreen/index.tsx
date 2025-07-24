import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionList } from '../../../components/transaction/TransactionList';
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { TransactionAPI } from '../../../services/api/transactionApi';
import { Transaction } from '../../../types';
import { COLORS } from '../../../utils/constants';
import { globalStyles } from '../../../styles/globalStyles';

interface Props {
  navigation: {
    navigate: (screen: 'Dashboard' | 'SendPayment') => void;
  };
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasShownRoleToast, setHasShownRoleToast] = useState(false);

  const { user, logout } = useAuth();
  const { showError, showRoleBasedToast } = useToast();

  const fetchTransactions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log('📊 Fetching transactions...');
      const response = await TransactionAPI.getTransactions();
      console.log('✅ Transactions loaded:', response.transactions.length);
      setTransactions(response.transactions);
    } catch (error: any) {
      console.error('❌ Failed to fetch transactions:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch transactions';
      showError(errorMessage, 'Error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing transactions...');
    fetchTransactions(true);
  };

  const navigateToSendPayment = () => {
    console.log('🚀 Navigating to Send Payment');
    navigation.navigate('SendPayment');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showError('Logout failed', 'Error');
    }
  };

  // Show role-based toast on first load
  useEffect(() => {
    if (user && !hasShownRoleToast) {
      setTimeout(() => {
        showRoleBasedToast(user.role);
        setHasShownRoleToast(true);
      }, 1000);
    }
  }, [user, hasShownRoleToast, showRoleBasedToast]);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Listen for payment success events to refresh
  useEffect(() => {
    const handlePaymentSuccess = () => {
      console.log('💳 Payment successful, refreshing transactions...');
      fetchTransactions(true);
    };

    // For web environment
    if (typeof window !== 'undefined') {
      window.addEventListener('payment-success', handlePaymentSuccess);
      return () => {
        window.removeEventListener('payment-success', handlePaymentSuccess);
      };
    }
  }, []);

  const getRoleDisplayName = (role: string) => {
    return role === 'psp' ? 'Payment Service Provider' : 'Developer';
  };

  const getTotalAmount = () => {
    return transactions.reduce((sum, transaction) => {
      return transaction.status === 'completed' ? sum + transaction.amount : sum;
    }, 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.loading}>
          <Text>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userRole}>{getRoleDisplayName(user?.role || '')}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <View style={[globalStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>${getTotalAmount().toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Sent</Text>
          </View>
          <View style={[globalStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={[globalStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>
              {transactions.filter(t => t.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Send Payment"
            onPress={navigateToSendPayment}
            style={styles.sendButton}
          />
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <TransactionList
            transactions={transactions}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    minWidth: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: COLORS.success,
  },
  transactionsContainer: {
    flex: 1,
  },
});