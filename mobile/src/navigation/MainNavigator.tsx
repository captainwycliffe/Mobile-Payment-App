import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '@screens/dashboard/DashboardScreen';
import { SendPaymentScreen } from '@screens/payment/SendPaymentScreen';
import type { MainStackParamList } from '@types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Dashboard"
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="SendPayment" component={SendPaymentScreen} />
    </Stack.Navigator>
  );
};