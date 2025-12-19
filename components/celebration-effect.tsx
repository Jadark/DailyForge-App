/**
 * Celebration Effect Component
 * 
 * Displays celebratory animations when goals are completed.
 * Uses react-native-reanimated for smooth animations.
 * 
 * Supported effects:
 * - confetti: Classic confetti explosion
 * - balloons: Colorful balloons floating up
 * - fireworks: Fireworks display
 */

import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

export type CelebrationType = 'confetti' | 'balloons' | 'fireworks';

interface CelebrationEffectProps {
  type: CelebrationType;
  visible: boolean;
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds before auto-hiding
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti particle component (Reanimated fallback)
interface ConfettiParticleProps {
  index: number;
  color: string;
  startX: number;
  startY: number;
  delay: number;
  onComplete: () => void;
}

function ConfettiParticle({ index, color, startX, startY, delay, onComplete }: ConfettiParticleProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // More realistic confetti physics
    const angle = (Math.PI * 2 * index) / 50 + (Math.random() - 0.5) * 0.8;
    const distance = 250 + Math.random() * 350;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance * 0.6 + 500; // More downward fall
    
    // Add some horizontal drift for realism
    const drift = (Math.random() - 0.5) * 100;

    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(endX + drift, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(endX + drift * 1.5, { duration: 2400, easing: Easing.in(Easing.quad) })
      )
    );
    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(endY * 0.3, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(endY, { duration: 2400, easing: Easing.in(Easing.quad) })
      )
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (4 + Math.random() * 3), { duration: 3000, easing: Easing.linear })
    );
    opacity.value = withDelay(
      delay + 2500,
      withTiming(0, { duration: 500 }, () => {
        if (index === 0) {
          runOnJS(onComplete)();
        }
      })
    );
  }, [delay, index, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  // Vary confetti shapes for more realism
  const isCircle = index % 3 === 0;
  const size = 10 + (index % 3) * 2;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: startY,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 2,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

// Balloon component (Reanimated fallback)
interface BalloonProps {
  index: number;
  color: string;
  delay: number;
  onComplete: () => void;
}

function Balloon({ index, color, delay, onComplete }: BalloonProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT + 100);
  const translateX = useSharedValue(SCREEN_WIDTH / 2);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const startX = (SCREEN_WIDTH / 6) * (index % 6) + SCREEN_WIDTH / 12;
    const drift = (Math.random() - 0.5) * 150;
    const balloonSize = 0.8 + Math.random() * 0.4; // Vary sizes
    
    translateX.value = startX;
    
    // Pop in animation
    scale.value = withDelay(
      delay, 
      withSequence(
        withTiming(balloonSize * 1.2, { duration: 200, easing: Easing.out(Easing.back(2)) }),
        withTiming(balloonSize, { duration: 150, easing: Easing.in(Easing.back(1)) })
      )
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    
    // Float up with gentle sway
    translateY.value = withDelay(
      delay,
      withTiming(-SCREEN_HEIGHT - 150, { duration: 5000, easing: Easing.out(Easing.quad) }, () => {
        if (index === 0) {
          runOnJS(onComplete)();
        }
      })
    );
    
    // Gentle horizontal drift/sway
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(startX + drift * 0.5, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(startX + drift, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      )
    );
    
    // Subtle rotation
    rotate.value = withDelay(
      delay,
      withTiming((Math.random() - 0.5) * 20, { duration: 5000, easing: Easing.inOut(Easing.sin) })
    );
    
    opacity.value = withDelay(
      delay + 4500,
      withTiming(0, { duration: 500 })
    );
  }, [delay, index, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ position: 'absolute' }, animatedStyle]}>
      {/* Balloon body with highlight */}
      <View
        style={{
          width: 55,
          height: 70,
          backgroundColor: color,
          borderRadius: 27.5,
          borderBottomLeftRadius: 27.5,
          borderBottomRightRadius: 27.5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        {/* Highlight for 3D effect */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 12,
            width: 20,
            height: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: 10,
          }}
        />
      </View>
      {/* String */}
      <View
        style={{
          position: 'absolute',
          bottom: -25,
          left: '50%',
          marginLeft: -1,
          width: 2,
          height: 50,
          backgroundColor: color,
          opacity: 0.5,
        }}
      />
    </Animated.View>
  );
}

// Firework particle component (Reanimated fallback)
interface FireworkParticleProps {
  index: number;
  color: string;
  startX: number;
  startY: number;
  delay: number;
  onComplete: () => void;
}

function FireworkParticle({ index, color, startX, startY, delay, onComplete }: FireworkParticleProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    const angle = (Math.PI * 2 * index) / 30;
    const distance = 150 + Math.random() * 100;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    translateX.value = withDelay(
      delay,
      withTiming(endX, { duration: 1000, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(endY, { duration: 1000, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(
      delay + 800,
      withTiming(0, { duration: 200 }, () => {
        if (index === 0) {
          runOnJS(onComplete)();
        }
      })
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.5, { duration: 200 }),
        withTiming(0.5, { duration: 800 })
      )
    );
  }, [delay, index, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: startY,
          width: 8,
          height: 8,
          backgroundColor: color,
          borderRadius: 4,
        },
        animatedStyle,
      ]}
    />
  );
}

export function CelebrationEffect({
  type,
  visible,
  onComplete,
  duration = 4000,
}: CelebrationEffectProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [particles, setParticles] = useState<Array<{ key: number; delay: number }>>([]);
  const completionCount = useSharedValue(0);

  const colors = {
    confetti: ['#FFD700', '#FF69B4', '#1E90FF', '#32CD32', '#FF6347', '#9370DB', '#FFA500', '#FF1493'],
    balloons: ['#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF69B4', '#1E90FF', '#FF6347', '#9370DB'],
    fireworks: ['#FFD700', '#FF69B4', '#1E90FF', '#32CD32', '#FF6347', '#FF1493', '#00FFFF', '#FF00FF'],
  };

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      
      let particleCount: number;
      if (type === 'confetti') {
        particleCount = 50;
      } else if (type === 'balloons') {
        particleCount = 15;
      } else {
        particleCount = 90; // 3 bursts of 30 particles each
      }
      
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        key: i,
        delay: type === 'fireworks' 
          ? Math.floor(i / 30) * 400 + (i % 30) * 10
          : (i / particleCount) * 500,
      }));
      setParticles(newParticles);
      completionCount.value = 0;

      const timeout = setTimeout(() => {
        setShouldRender(false);
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      setShouldRender(false);
      setParticles([]);
    }
  }, [visible, type, duration, onComplete]);

  const handleParticleComplete = () => {
    completionCount.value += 1;
  };

  if (!shouldRender) {
    return null;
  }

  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT / 3;

  return (
    <View style={styles.container} pointerEvents="none">
      {type === 'confetti' &&
        particles.map((particle, index) => (
          <ConfettiParticle
            key={particle.key}
            index={index}
            color={colors.confetti[index % colors.confetti.length]}
            startX={centerX}
            startY={centerY}
            delay={particle.delay}
            onComplete={handleParticleComplete}
          />
        ))}
      
      {type === 'balloons' &&
        particles.map((particle, index) => (
          <Balloon
            key={particle.key}
            index={index}
            color={colors.balloons[index % colors.balloons.length]}
            delay={particle.delay}
            onComplete={handleParticleComplete}
          />
        ))}
      
      {type === 'fireworks' &&
        particles.map((particle, index) => {
          const burstIndex = Math.floor(index / 30);
          const xOffset = (burstIndex % 3 - 1) * (SCREEN_WIDTH / 4);
          const position = {
            x: centerX + xOffset,
            y: centerY + (burstIndex % 2) * 100,
          };
          return (
            <FireworkParticle
              key={particle.key}
              index={index % 30}
              color={colors.fireworks[index % colors.fireworks.length]}
              startX={position.x}
              startY={position.y}
              delay={particle.delay}
              onComplete={handleParticleComplete}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 9999,
  },
});

