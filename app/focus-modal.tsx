/**
 * Focus Modal (Focus View)
 * 
 * Slide-up modal for viewing/adding goal details.
 * - In Progress: Can view details and add new ones
 * - Completed: Read-only with option to mark not complete
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyGoal } from '@/hooks/use-daily-goal';
import { useStats } from '@/hooks/use-stats';
import { GoalDetail } from '@/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FocusModal() {
  const [newDetail, setNewDetail] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  
  const { goal, isCompleted, addDetail, markNotComplete, isLoading } = useDailyGoal();
  const { revertCompletion } = useStats();

  console.log('[FocusModal] Rendering, isLoading:', isLoading, 'goal:', goal ? 'exists' : 'null');

  useEffect(() => {
    console.log('[FocusModal] useEffect - isLoading:', isLoading, 'goal:', goal ? 'exists' : 'null');
    // Only close if we've finished loading and there's still no goal
    if (!isLoading && !goal) {
      console.log('[FocusModal] No goal found after loading, closing modal');
      router.back();
    }
  }, [goal, isLoading]);

  // Show loading state or wait for goal to load
  if (isLoading) {
    console.log('[FocusModal] Showing loading state');
    return (
      <KeyboardAvoidingView
        style={[styles.container, isDark && styles.containerDark]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Loading...
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (!goal) {
    console.log('[FocusModal] No goal, returning null');
    return null;
  }

  console.log('[FocusModal] Rendering modal content');

  const handleAddDetail = async () => {
    const trimmed = newDetail.trim();
    if (trimmed.length > 0 && !isCompleted) {
      await addDetail(trimmed);
      setNewDetail('');
    }
  };

  const handleMarkNotComplete = async () => {
    const success = await markNotComplete();
    if (success) {
      await revertCompletion();
      // Small delay to ensure state updates before closing
      setTimeout(() => {
        router.back();
      }, 100);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        {/* Header */}
        <View style={[styles.header, isDark && styles.headerDark]}>
          <View style={styles.headerHandle} />
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>

        {/* Goal Display */}
        <View style={styles.goalSection}>
          <Text style={[styles.goalLabel, isDark && styles.goalLabelDark]}>
            TODAYS GOAL
          </Text>
          <Text style={[styles.goalText, isDark && styles.goalTextDark]}>
            {goal.text}
          </Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Notes & Details
          </Text>

          <ScrollView 
            style={styles.detailsList}
            contentContainerStyle={styles.detailsListContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {goal.details.length === 0 ? (
              <Text style={styles.emptyDetails}>
                {isCompleted
                  ? 'No notes were added.'
                  : 'Add notes or details about your progress.'}
              </Text>
            ) : (
              goal.details.map((detail: GoalDetail) => (
                <View
                  key={detail.id}
                  style={[styles.detailItem, isDark && styles.detailItemDark]}
                >
                  <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
                    {detail.text}
                  </Text>
                  <Text style={styles.detailTime}>
                    {formatTime(detail.createdAt)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Add Detail Input (only when not completed) */}
        {!isCompleted && (
          <View style={[styles.inputSection, isDark && styles.inputSectionDark]}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Add a note..."
              placeholderTextColor="#8E8E93"
              value={newDetail}
              onChangeText={setNewDetail}
              multiline
              maxLength={500}
              returnKeyType="done"
              blurOnSubmit={false}
            />
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                newDetail.trim().length === 0 && styles.addButtonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleAddDetail}
              disabled={newDetail.trim().length === 0}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        )}

        {/* Mark Not Complete (only when completed) */}
        {isCompleted && (
          <View style={styles.revertSection}>
            <Pressable
              style={({ pressed }) => [
                styles.revertButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleMarkNotComplete}
            >
              <Text style={styles.revertButtonText}>Mark Not Complete</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  headerDark: {
    borderBottomColor: '#38383A',
  },
  headerHandle: {
    width: 36,
    height: 5,
    backgroundColor: '#C6C6C8',
    borderRadius: 3,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  closeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  goalSection: {
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  goalLabelDark: {
    color: '#8E8E93',
  },
  goalText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 30,
  },
  goalTextDark: {
    color: '#FFFFFF',
  },
  completedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  completedText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    flex: 1,
    padding: 20,
    minHeight: 0, // Allow flex to work properly
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#8E8E93',
  },
  detailsList: {
    flex: 1,
  },
  detailsListContent: {
    paddingBottom: 20,
  },
  emptyDetails: {
    fontSize: 15,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  detailItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  detailItemDark: {
    backgroundColor: '#1C1C1E',
  },
  detailText: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 20,
  },
  detailTextDark: {
    color: '#FFFFFF',
  },
  detailTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  inputSectionDark: {
    borderTopColor: '#38383A',
    backgroundColor: '#000000',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000000',
    maxHeight: 100,
  },
  inputDark: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#007AFF80',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  revertSection: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
  },
  revertButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  revertButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 17,
    color: '#8E8E93',
  },
  loadingTextDark: {
    color: '#8E8E93',
  },
});

