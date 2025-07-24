import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../context/ToastContext';
import { PaymentAPI } from '../../../services/api/paymentApi';
import { COLORS, CURRENCIES } from '../../../utils/constants';
import { globalStyles } from '../../../styles/globalStyles';

interface Props {
  navigation: {
    navigate: (screen: 'Dashboard' | 'SendPayment') => void;
    goBack: () => void;
  };
}

export const SendPaymentScreen: React.FC<Props> = ({ navigation }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    recipient?: string;
    amount?: string;
  }>({});

  const { showSuccess, showError } = useToast();

  const validateForm = () => {
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient is required';
    } else if (recipient.trim().length < 2) {
      newErrors.recipient = 'Recipient name must be at least 2 characters';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else if (numAmount > 10000) {
        newErrors.amount = 'Amount cannot exceed $10,000';
      } else if (numAmount < 0.01) {
        newErrors.amount = 'Minimum amount is $0.01';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendPayment = async () => {
    if (!validateForm()) return;

    // For web, use confirm instead of Alert.alert
    const confirmed = Platform.OS === 'web' 
      ? confirm(`Send ${currency} ${parseFloat(amount).toFixed(2)} to ${recipient}?`)
      : await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Confirm Payment',
            `Send ${currency} ${parseFloat(amount).toFixed(2)} to ${recipient}?`,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Send', style: 'default', onPress: () => resolve(true) },
            ]
          );
        });

    if (confirmed) {
      processPayment();
    }
  };

  const processPayment = async () => {
    try {
      setLoading(true);

      const paymentData = {
        recipient: recipient.trim(),
        amount: parseFloat(amount),
        currency,
      };

      console.log('🧪 Sending payment:', paymentData);

      const response = await PaymentAPI.sendPayment(paymentData);

      console.log('✅ Payment successful:', response);

      showSuccess(
        `Payment of ${currency} ${response.transaction.amount.toFixed(2)} sent to ${response.transaction.recipient}`,
        'Payment Successful'
      );

      // Reset form
      setRecipient('');
      setAmount('');
      setCurrency('USD');
      setErrors({});

      // Trigger dashboard refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('payment-success'));
      }

      // Navigate back to dashboard
      navigation.goBack();
    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      showError(errorMessage, 'Payment Failed');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, '');
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    return cleanText;
  };

  const handleAmountChange = (text: string) => {
    const formattedAmount = formatAmount(text);
    setAmount(formattedAmount);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title="← Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="small"
            style={styles.backButton}
          />
          <Text style={globalStyles.title}>Send Payment</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[globalStyles.card, styles.formCard]}>
            <Text style={styles.formTitle}>Payment Details</Text>

            <Input
              label="Recipient"
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter recipient name"
              autoCapitalize="words"
              error={errors.recipient}
              required
            />

            <Input
              label="Amount"
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.amount}
              required
            />

            <View style={styles.currencyContainer}>
              <Text style={styles.currencyLabel}>Currency *</Text>
              <View style={styles.currencyWrapper}>
                <Picker
                  selectedValue={currency}
                  onValueChange={setCurrency}
                  style={styles.currencyPicker}
                >
                  {CURRENCIES.map((curr) => (
                    <Picker.Item key={curr} label={curr} value={curr} />
                  ))}
                </Picker>
              </View>
            </View>

            {amount && !errors.amount && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Recipient:</Text>
                  <Text style={styles.summaryValue}>{recipient || 'N/A'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>
                    {currency} {parseFloat(amount || '0').toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            <Button
              title="Send Payment"
              onPress={handleSendPayment}
              loading={loading}
              disabled={!recipient.trim() || !amount.trim() || !!errors.recipient || !!errors.amount}
              style={styles.sendButton}
            />
          </View>

          <View style={[globalStyles.card, styles.infoCard]}>
            <Text style={styles.infoTitle}>💡 Payment Information</Text>
            <Text style={styles.infoText}>
              • Payments are processed instantly{'\n'}
              • Maximum amount: $10,000 per transaction{'\n'}
              • All transactions are secure and encrypted{'\n'}
              • You'll receive a confirmation once sent
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
    minWidth: 80,
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  currencyContainer: {
    marginBottom: 16,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  currencyWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  currencyPicker: {
    height: 44,
  },
  summaryContainer: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  sendButton: {
    backgroundColor: COLORS.success,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});