import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { theme } from '../constants/theme';
import { DataLoader } from '../data/DataLoader';
import { Flashcard as FlashcardModel } from '../models/Flashcard';
import { Flashcard } from '../components/Flashcard';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

import { RitualService } from '../services/RitualService';

export const FeedScreen = () => {
  const [cards, setCards] = useState<FlashcardModel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ritualCompleted, setRitualCompleted] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    async function load() {
      const hasDoneToday = await RitualService.hasCompletedToday();
      if (hasDoneToday) {
        setRitualCompleted(true);
        setLoading(false);
        return;
      }

      const allCards = await DataLoader.loadAllFlashcards();
      // Shuffle and take daily limit
      setCards(allCards.sort(() => Math.random() - 0.5).slice(0, RitualService.DAILY_LIMIT));
      setLoading(false);
    }
    load();
  }, []);

  const onSwipeComplete = (direction: 'left' | 'right') => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= cards.length) {
      RitualService.markAsCompletedToday();
      setRitualCompleted(true);
    }
    setCurrentIndex(nextIndex);
    translateX.value = 0;
    translateY.value = 0;
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number, startY: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        translateX.value = withSpring(direction === 'right' ? width * 1.5 : -width * 1.5);
        runOnJS(onSwipeComplete)(direction);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const nextCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [1, 0.95, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (ritualCompleted || currentIndex >= cards.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Animated.Text style={styles.title}>O ritual de hoje terminou.</Animated.Text>
          <Animated.Text style={styles.subtitle}>Volte amanhã para mais momentos juntos.</Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardStack}>
        {/* Next Card (Background) */}
        {currentIndex + 1 < cards.length && (
          <Animated.View style={[styles.cardWrapper, nextCardStyle, { zIndex: -1 }]}>
            <Flashcard card={cards[currentIndex + 1]} />
          </Animated.View>
        )}

        {/* Current Card (Interactive) */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.cardWrapper, cardStyle]}>
            <Flashcard card={cards[currentIndex]} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});