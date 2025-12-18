/**
 * Settings Screen
 * 
 * Allows users to edit their name.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const { profile, updateName } = useUserProfile();
  
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile?.name]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    setIsSaving(true);
    const success = await updateName(trimmed);
    setIsSaving(false);

    if (success) {
      router.back();
    } else {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  };

  const hasChanges = name.trim() !== (profile?.name ?? '');

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={[styles.title, isDark && styles.titleDark]}>Settings</Text>
        <Pressable
          onPress={handleSave}
          style={styles.headerButton}
          disabled={!hasChanges || isSaving}
        >
          <Text
            style={[
              styles.saveText,
              (!hasChanges || isSaving) && styles.saveTextDisabled,
            ]}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            PROFILE
          </Text>
          <View style={[styles.inputRow, isDark && styles.inputRowDark]}>
            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
              Name
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#8E8E93"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  headerDark: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#38383A',
  },
  headerButton: {
    minWidth: 60,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  cancelText: {
    fontSize: 17,
    color: '#007AFF',
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'right',
  },
  saveTextDisabled: {
    color: '#007AFF80',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
  },
  sectionDark: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  sectionTitleDark: {
    color: '#8E8E93',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  inputRowDark: {
    backgroundColor: '#1C1C1E',
  },
  inputLabel: {
    fontSize: 17,
    color: '#000000',
    width: 60,
  },
  inputLabelDark: {
    color: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    textAlign: 'right',
  },
  inputDark: {
    color: '#FFFFFF',
  },
});

