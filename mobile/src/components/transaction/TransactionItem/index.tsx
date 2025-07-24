import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../../../types';
import { COLORS } from '../../../utils/constants';
import { globalStyles } from '../../../styles/globalStyles';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'failed':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <View style={[globalStyles.card, styles.container]}>
      <View style={globalStyles.spaceBetween}>
        <View style={styles.leftContent}>
          <Text style={styles.recipient}>{transaction.recipient}</Text>
          <Text style={styles.timestamp}>{formatDate(transaction.timestamp)}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.amount}>
            {formatAmount(transaction.amount, transaction.currency)}
          </Text>
          <Text style={[styles.status, { color: getStatusColor(transaction.status) }]}>
            {transaction.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  recipient: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
});