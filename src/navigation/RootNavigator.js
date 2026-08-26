import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

import WorldClockScreen from '../screens/WorldClock/WorldClockScreen';
import AllCountriesScreen from '../screens/WorldClock/AllCountriesScreen';
import AllCitiesScreen from '../screens/WorldClock/AllCitiesScreen';
import CityDetailScreen from '../screens/WorldClock/CityDetailScreen';
import WeatherForecastScreen from '../screens/WorldClock/WeatherForecastScreen';

import SettingsScreen from '../screens/Settings/SettingsScreen';
import CustomerSupportScreen from '../screens/Settings/CustomerSupportScreen';
import PremiumPaywallScreen from '../screens/Settings/PremiumPaywallScreen';
import PrivacyPolicyScreen from '../screens/Settings/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/Settings/TermsOfServiceScreen';

const Stack = createNativeStackNavigator();

function BootSplash() {
  return (
    <View style={styles.boot}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function RootNavigator() {
  const { isSignedIn, isBooting } = useAuth();

  if (isBooting) return <BootSplash />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {isSignedIn ? (
        <>
          <Stack.Screen name="WorldClock" component={WorldClockScreen} />
          <Stack.Screen name="AllCountries" component={AllCountriesScreen} />
          <Stack.Screen name="AllCities" component={AllCitiesScreen} />
          <Stack.Screen name="CityDetail" component={CityDetailScreen} />
          <Stack.Screen name="WeatherForecast" component={WeatherForecastScreen} />

          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
          <Stack.Screen
            name="PremiumPaywall"
            component={PremiumPaywallScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
