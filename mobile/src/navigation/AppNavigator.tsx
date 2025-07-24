import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { SendPaymentScreen } from '../screens/payment/SendPaymentScreen';
import { COLORS } from '../utils/constants';

type ScreenType = 'Dashboard' | 'SendPayment';

// Simple navigation interface
interface Navigation {
  navigate: (screen: ScreenType) => void;
  goBack: () => void;
}

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = React.useState<ScreenType>('Dashboard');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Navigation object with proper typing
  const navigation: Navigation = {
    navigate: (screen: ScreenType) => setCurrentScreen(screen),
    goBack: () => setCurrentScreen('Dashboard'),
  };

  // Render appropriate screen based on current screen
  switch (currentScreen) {
    case 'SendPayment':
      return <SendPaymentScreen navigation={navigation} />;
    case 'Dashboard':
    default:
      return <DashboardScreen navigation={navigation} />;
  }
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
});
