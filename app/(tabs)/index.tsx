/**
 * Home Screen
 * 
 * Main screen displaying:
 * - Time-based greeting with username
 * - Message of the Day (MOTD)
 * - Goal card (empty/in-progress/completed)
 * - Current streak
 */

import { CelebrationEffect, CelebrationType } from '@/components/celebration-effect';
import { GoalCard } from '@/components/goal-card';
import { GoalInputModal } from '@/components/goal-input-modal';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyGoal } from '@/hooks/use-daily-goal';
import { useGreeting } from '@/hooks/use-greeting';
import { useMOTD } from '@/hooks/use-motd';
import { useStats } from '@/hooks/use-stats';
import { useUserProfile } from '@/hooks/use-user-profile';
import {
  initializeNotifications,
  updateNotificationsOnGoalComplete,
  updateNotificationsOnGoalSet,
} from '@/services/notifications';
import { GoalTag } from '@/types';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const { profile, isLoading: profileLoading, refresh: refreshProfile } = useUserProfile();
  const { greeting } = useGreeting(profile?.name ?? '');
  const { motd } = useMOTD();
  const {
    goal,
    isLoading: goalLoading,
    setGoal,
    markComplete,
    checkRollover,
    refresh: refreshGoal,
  } = useDailyGoal();
  const { stats, recordCompletion, refresh: refreshStats } = useStats();

  const [showGoalInput, setShowGoalInput] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Celebration effect type - defaults to 'confetti' (original behavior)
  // Users will see confetti when completing goals
  const [celebrationType, setCelebrationType] = useState<CelebrationType>('confetti');
  const [showCelebration, setShowCelebration] = useState(false);

  // Check for day rollover on mount and focus
  useFocusEffect(
    useCallback(() => {
      checkRollover();
      // Refresh profile when screen comes into focus (e.g., returning from settings)
      refreshProfile();
      // Refresh goal when returning from focus modal
      refreshGoal();
    }, [checkRollover, refreshProfile, refreshGoal])
  );

  // Initialize notifications on mount (only once)
  useEffect(() => {
    initializeNotifications(false, false, 0);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkRollover();
    await refreshGoal();
    await refreshStats();
    setIsRefreshing(false);
  };

  const handleCardPress = () => {
    console.log('[HomeScreen] Card pressed, goal:', goal ? 'exists' : 'null');
    if (!goal) {
      // No goal set, show input modal
      setShowGoalInput(true);
    } else {
      // Goal exists, open focus modal
      console.log('[HomeScreen] Navigating to focus-modal, goal:', goal);
      try {
        router.push('/focus-modal' as any);
      } catch (error) {
        console.error('[HomeScreen] Navigation error:', error);
      }
    }
  };

  const handleAddDetails = () => {
    if (goal) {
      router.push('/focus-modal');
    }
  };

  const handleComplete = async () => {
    const success = await markComplete();
    if (success) {
      await recordCompletion();
      // Update notifications for completion
      await updateNotificationsOnGoalComplete(stats.currentStreak + 1);
      // Trigger celebration effect
      setShowCelebration(true);
    }
  };

  const handleSetGoal = async (text: string, tag: GoalTag) => {
    const success = await setGoal(text, tag);
    if (success) {
      // Cancel morning reminder since goal is now set
      await updateNotificationsOnGoalSet();
    }
  };

  const isLoading = profileLoading || goalLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#FFFFFF' : '#000000'}
          />
        }
      >
        {/* Header with Settings */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* Greeting */}
        <Text style={[styles.greeting, isDark && styles.greetingDark]}>
          {greeting}
        </Text>

        {/* MOTD */}
        <Text style={[styles.motd, isDark && styles.motdDark]}>
          {motd}
        </Text>

        {/* Goal Card */}
        <View style={styles.cardContainer}>
          <GoalCard
            goal={goal}
            onPress={handleCardPress}
            onComplete={handleComplete}
            onAddDetails={handleAddDetails}
          />
        </View>

        {/* Stats */}
        {(stats.currentStreak > 0 || stats.longestStreak > 0 || stats.totalCompleted > 0) && (
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, isDark && styles.statsTextDark]}>
              Current Streak: {stats.currentStreak} | Highest Streak: {stats.longestStreak}
            </Text>
            <Text style={[styles.statsText, isDark && styles.statsTextDark]}>
              Total Goals Completed: {stats.totalCompleted}
            </Text>
          </View>
        )}

        {/* EOL Message (when completed) */}
        {goal?.status === 'completed' && (
          <View style={styles.eolContainer}>
            <Text style={[styles.eolText, isDark && styles.eolTextDark]}>
              Done for today! 🎉
            </Text>
            <Text style={[styles.eolSubtext, isDark && styles.eolSubtextDark]}>
              Rest up and come back tomorrow
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Goal Input Modal */}
      <GoalInputModal
        visible={showGoalInput}
        onClose={() => setShowGoalInput(false)}
        onSubmit={handleSetGoal}
      />

      {/* Celebration Effect */}
      <CelebrationEffect
        type={celebrationType}
        visible={showCelebration}
        onComplete={() => setShowCelebration(false)}
        duration={4000}
      />
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 8,
  },
  headerLeft: {
    width: 44,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  greetingDark: {
    color: '#FFFFFF',
  },
  motd: {
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 24,
  },
  motdDark: {
    color: '#8E8E93',
  },
  cardContainer: {
    marginBottom: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  statsTextDark: {
    color: '#8E8E93',
  },
  eolContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  eolText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 4,
  },
  eolTextDark: {
    color: '#30D158',
  },
  eolSubtext: {
    fontSize: 15,
    color: '#8E8E93',
  },
  eolSubtextDark: {
    color: '#8E8E93',
  },
});
