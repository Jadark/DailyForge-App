/**
 * Root Layout
 * 
 * Handles:
 * - Theme provider setup
 * - Onboarding flow gate
 * - Navigation stack configuration
 */

import { useEffect, useState, useCallback } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAppState } from '@/services/storage';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const checkOnboarding = useCallback(async () => {
    try {
      const appState = await getAppState();
      setNeedsOnboarding(!appState.isOnboardingComplete);
    } catch (error) {
      console.error('[RootLayout] Error checking onboarding:', error);
      setNeedsOnboarding(true); // Default to onboarding on error
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    checkOnboarding();
  }, [checkOnboarding]);

  useEffect(() => {
    if (isReady && needsOnboarding) {
      // Navigate to onboarding after layout is ready
      router.replace('/onboarding');
    }
  }, [isReady, needsOnboarding]);

  if (!isReady) {
    return (
      <View style={[styles.loading, colorScheme === 'dark' && styles.loadingDark]}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="focus-modal"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingDark: {
    backgroundColor: '#000000',
  },
});
