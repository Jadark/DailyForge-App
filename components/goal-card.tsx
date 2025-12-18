/**
 * Goal Card Component
 * 
 * iOS medium widget-style card with three states:
 * - Empty (gray): No goal set
 * - In Progress (blue): Goal set, not completed
 * - Completed (green): Goal completed
 */

import {
  CardColors,
  getCardBackgroundColor,
  getCardColor,
} from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Goal } from '@/types';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface GoalCardProps {
  goal: Goal | null;
  onPress: () => void;
  onComplete?: () => void;
  onAddDetails?: () => void;
}

type CardState = 'empty' | 'inProgress' | 'completed';

function getCardState(goal: Goal | null): CardState {
  if (!goal) return 'empty';
  return goal.status === 'completed' ? 'completed' : 'inProgress';
}

export function GoalCard({ goal, onPress, onComplete, onAddDetails }: GoalCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const state = getCardState(goal);
  const hasDetails = goal && goal.details.length > 0;

  const backgroundColor = getCardBackgroundColor(state, colorScheme);
  const accentColor = getCardColor(state, colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      hitSlop={0}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={[styles.label, { color: accentColor }]}>
          TODAYS GOAL
        </Text>
        {hasDetails && (
          <View style={[styles.detailsIndicator, { backgroundColor: accentColor }]}>
            <Text style={styles.detailsIcon}>📝</Text>
          </View>
        )}
      </View>

      {/* Goal Content */}
      {state === 'empty' ? (
        <View style={styles.emptyContent}>
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            Tap to set your goal for today
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.goalTextContainer}>
            <Text
              style={[
                styles.goalText,
                isDark && styles.goalTextDark,
              ]}
              numberOfLines={3}
            >
              {goal?.text}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions} pointerEvents="box-none">
            {state === 'inProgress' && (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.secondaryButton,
                    isDark && styles.secondaryButtonDark,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    onAddDetails?.();
                  }}
                >
                  <Text style={[styles.secondaryButtonText, isDark && styles.secondaryButtonTextDark]}>
                    + Add Details
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.primaryButton,
                    { backgroundColor: CardColors.completed[colorScheme] },
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    onComplete?.();
                  }}
                >
                  <Text style={styles.primaryButtonText}>✓ Complete</Text>
                </Pressable>
              </>
            )}

            {state === 'completed' && (
              <View style={styles.completedBadge} pointerEvents="none">
                <Text style={styles.completedText}>✓ Completed</Text>
              </View>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    minHeight: 155, // iOS medium widget height approximation
    justifyContent: 'space-between',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  detailsIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsIcon: {
    fontSize: 12,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyTextDark: {
    color: '#8E8E93',
  },
  goalTextContainer: {
    flex: 1,
  },
  goalText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 28,
  },
  goalTextDark: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  secondaryButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#3C3C43',
    fontSize: 15,
    fontWeight: '500',
  },
  secondaryButtonTextDark: {
    color: '#EBEBF5',
  },
  completedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  completedText: {
    color: '#34C759',
    fontSize: 15,
    fontWeight: '600',
  },
});

