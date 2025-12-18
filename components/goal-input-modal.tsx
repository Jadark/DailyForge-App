/**
 * Goal Input Modal
 * 
 * Simple modal for entering a new goal.
 * Appears when tapping the empty goal card.
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GoalTag } from '@/types';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface GoalInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (goal: string, tag: GoalTag) => void;
}

export function GoalInputModal({ visible, onClose, onSubmit }: GoalInputModalProps) {
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState<GoalTag>('general');
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed, selectedTag);
      setText('');
      setSelectedTag('general');
      onClose();
    }
  };

  const handleClose = () => {
    setText('');
    setSelectedTag('general');
    onClose();
  };

  const tagOptions: { value: GoalTag; label: string }[] = [
    { value: 'general', label: 'General' },
    { value: 'personal_health', label: 'Personal/Health' },
    { value: 'work_school', label: 'Work/School' },
  ];

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

        {/* Tag Selection */}
        <View style={styles.tagContainer}>
          {tagOptions.map((option) => {
            const isSelected = selectedTag === option.value;
            const isGeneral = option.value === 'general';
            return (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  styles.tagPill,
                  isSelected && styles.tagPillSelected,
                  isDark && styles.tagPillDark,
                  isSelected && isDark && styles.tagPillSelectedDark,
                  pressed && styles.tagPillPressed,
                ]}
                onPress={() => setSelectedTag(option.value)}
              >
                <Text
                  style={[
                    styles.tagText,
                    isSelected && styles.tagTextSelected,
                    isDark && styles.tagTextDark,
                    isSelected && isDark && styles.tagTextSelectedDark,
                    isGeneral && isSelected && styles.tagTextBold,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
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
  tagContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  tagPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C6C6C8',
    backgroundColor: '#F2F2F7',
  },
  tagPillDark: {
    borderColor: '#38383A',
    backgroundColor: '#1C1C1E',
  },
  tagPillSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  tagPillSelectedDark: {
    borderColor: '#0A84FF',
    backgroundColor: '#1C1C1E',
  },
  tagPillPressed: {
    opacity: 0.7,
  },
  tagText: {
    fontSize: 15,
    color: '#000000',
  },
  tagTextDark: {
    color: '#FFFFFF',
  },
  tagTextSelected: {
    color: '#007AFF',
  },
  tagTextSelectedDark: {
    color: '#0A84FF',
  },
  tagTextBold: {
    fontWeight: '600',
  },
});

