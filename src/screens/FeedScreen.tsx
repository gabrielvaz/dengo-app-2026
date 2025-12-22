import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { DataLoader } from '../data/DataLoader';
import { Flashcard as FlashcardModel } from '../models/Flashcard';
import { Flashcard } from '../components/Flashcard';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { RitualService } from '../services/RitualService';
import { ProfileService } from '../services/ProfileService';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

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

      const profile = await ProfileService.getProfile();
      if (!profile) {
        setLoading(false);
        return;
      }

      const filteredCards = await DataLoader.loadFilteredFlashcards(profile);
      // Shuffle and take daily limit
      setCards(filteredCards.sort(() => Math.random() - 0.5).slice(0, RitualService.DAILY_LIMIT));
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

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        translateX.value = withSpring(direction === 'right' ? width * 1.5 : -width * 1.5);
        runOnJS(onSwipeComplete)(direction);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
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

  if (ritualCompleted || (currentIndex >= cards.length && cards.length > 0)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.ritualIcon}>✨</Text>
          <Text style={[styles.title, { fontFamily: 'serif' }]}>O ritual de hoje floresceu.</Text>
          <Text style={styles.subtitle}>
            Que estas palavras ecoem entre vocês até o próximo encontro.
          </Text>
          
          <TouchableOpacity style={styles.resetButton} onPress={async () => {
            await RitualService.resetRitual();
            // Force reload
            setRitualCompleted(false);
            setCurrentIndex(0);
          }}>
            <Text style={styles.resetButtonText}>Refazer (Debug)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        {cards.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressBar, 
              index <= currentIndex && styles.progressBarActive
            ]} 
          />
        ))}
      </View>
      
      <View style={styles.cardStack}>
        {/* Next Card (Background) */}
        {currentIndex + 1 < cards.length && (
          <Animated.View style={[styles.cardWrapper, nextCardStyle, { zIndex: -1 }]}>
            <Flashcard card={cards[currentIndex + 1]} />
          </Animated.View>
        )}

        {/* Current Card (Interactive) */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.cardWrapper, cardStyle]}>
            <Flashcard card={cards[currentIndex]} />
          </Animated.View>
        </GestureDetector>
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
  ritualIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.l,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.m,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: theme.colors.primary,
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
    lineHeight: 24,
  },
  resetButton: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.m,
  },
  resetButtonText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontSize: 14,
    opacity: 0.5,
  },
});