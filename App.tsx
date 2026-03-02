import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AddPeptideScreen } from './screens/AddPeptideScreen';
import { LogDoseScreen } from './screens/LogDoseScreen';
import { LogEffectScreen } from './screens/LogEffectScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#000' },
    }}
  >
    <Stack.Screen name="Auth" component={AuthScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#000' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AddPeptide" component={AddPeptideScreen} />
    <Stack.Screen name="LogDose" component={LogDoseScreen} />
    <Stack.Screen name="LogEffect" component={LogEffectScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#00FFFF" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
