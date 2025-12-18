/**
 * Onboarding Screen
 * 
 * First launch experience:
 * 1. Ask for user's name
 * 2. Request notification permissions
 * 3. Navigate to home
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { setUserProfile, setAppState, getAppState } from '@/services/storage';
import { getISOTimestamp, getLocalDateString } from '@/services/date-utils';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  const handleContinue = async () => {
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }

    setIsLoading(true);

    try {
      // Save user profile
      await setUserProfile({
        name: trimmedName,
        createdAt: getISOTimestamp(),
      });

      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        // User declined - that's okay, we can continue
        console.log('[Onboarding] Notification permission not granted');
      }

      // Mark onboarding as complete
      const currentState = await getAppState();
      await setAppState({
        ...currentState,
        isOnboardingComplete: true,
        lastOpenedDate: getLocalDateString(),
      });

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[Onboarding] Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = colorScheme === 'dark';

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>
            Welcome to DailyForge
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            One goal. One day. Real progress.
          </Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            What should we call you?
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Enter your name"
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            maxLength={30}
          />
        </View>

        {/* Continue Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Setting up...' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  textDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
  },
  subtitleDark: {
    color: '#8E8E93',
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3C3C43',
    marginBottom: 8,
  },
  labelDark: {
    color: '#EBEBF5',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 17,
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#007AFF80',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

