/**
 * Goal Input Modal
 * 
 * Simple modal for entering a new goal.
 * Appears when tapping the empty goal card.
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GoalInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (goal: string) => void;
}

export function GoalInputModal({ visible, onClose, onSubmit }: GoalInputModalProps) {
  const [text, setText] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
      setText('');
      onClose();
    }
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, isDark && styles.containerDark]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Today&apos;s Goal
          </Text>
          <Pressable
            onPress={handleSubmit}
            style={styles.headerButton}
            disabled={text.trim().length === 0}
          >
            <Text
              style={[
                styles.saveText,
                text.trim().length === 0 && styles.saveTextDisabled,
              ]}
            >
              Save
            </Text>
          </Pressable>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="What is your one goal for today?"
            placeholderTextColor="#8E8E93"
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{text.length}/200</Text>
        </View>

        {/* Hint */}
        <Text style={styles.hint}>
          Focus on one meaningful thing you want to accomplish today.
        </Text>
      </KeyboardAvoidingView>
    </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
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
  inputContainer: {
    padding: 16,
  },
  input: {
    fontSize: 20,
    color: '#000000',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  charCount: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 8,
  },
  hint: {
    fontSize: 15,
    color: '#8E8E93',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
});

