import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { StreakService } from '../services/StreakService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

import { DailyLimitService } from '../services/DailyLimitService';

// ... (existing imports)

export const FeedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryId, categoryTitle } = route.params || { categoryId: 'daily' };

  const [cards, setCards] = useState<FlashcardModel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ritualCompleted, setRitualCompleted] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const manualSwipe = (direction: 'left' | 'right') => {
      const dest = direction === 'left' ? -width * 1.5 : width * 1.5;
      translateX.value = withSpring(dest, {}, () => {
          runOnJS(onSwipeComplete)(direction);
      });
  };

  const handleManualNext = () => {
     if (currentIndex < cards.length) {
         manualSwipe('left');
     }
  };

  const handleManualPrev = () => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
    }
  };

  useEffect(() => {
    if (ritualCompleted || limitReached) {
       StreakService.recordInteraction();
    }
  }, [ritualCompleted, limitReached]);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await ProfileService.getProfile();
      if (!profile) {
          setLoading(false);
          return;
      }

      // Check Daily Limit
      // Check Daily Limit - We no longer block, just track state
      if (categoryId !== 'daily') {
          const isReached = await DailyLimitService.isLimitReached(categoryId);
          if (isReached) {
              setLimitReached(true);
              // But we CONTINUE to load data so user can see questions!
          }
      }

      let loadedCards: FlashcardModel[] = [];
      if (categoryId === 'daily') {
        const hasDoneToday = await RitualService.hasCompletedToday();
        if (hasDoneToday) {
          setRitualCompleted(true);
          setLoading(false);
          return;
        }
        loadedCards = await DataLoader.loadFilteredFlashcards(profile);
        setCards(loadedCards.sort(() => Math.random() - 0.5).slice(0, RitualService.DAILY_LIMIT));
      } else {
        loadedCards = await DataLoader.loadByCategory(categoryId, profile);
        // Slice remaining allowed for today
        // If limit reached (remaining <= 0), we still show 5 cards for "Overtime"
        const remaining = await DailyLimitService.remaining(categoryId);
        const countToLoad = remaining > 0 ? remaining : 5;
        setCards(loadedCards.sort(() => Math.random() - 0.5).slice(0, countToLoad));
      }
      
      setRitualCompleted(false);
      setLimitReached(false);
      setCurrentIndex(0);
    } catch (error) {
       console.error("Error loading feed data:", error);
    } finally {
       setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [categoryId]);

  const onSwipeComplete = async (direction: 'left' | 'right') => {
    StreakService.recordInteraction();
    
    // Increment limit
    if (categoryId !== 'daily') {
         await DailyLimitService.incrementConsumed(categoryId);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= cards.length) {
       if (categoryId === 'daily') {
          RitualService.markAsCompletedToday();
          setRitualCompleted(true);
       } else {
          // Increment set counter
          StreakService.incrementCategorySetsCompleted();
          setLimitReached(true);
       }
    }
    setCurrentIndex(nextIndex);
    translateX.value = 0;
    translateY.value = 0;
  };


  // ... (gestures using withSpring with config)
  // Need to update gesture config for smoother feel.
  
  // ... (render)
  // Add buttons overlay

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle || (categoryId === 'daily' ? 'Diário' : categoryId)}</Text>
        <View style={{ width: 40 }} />
      </View>

      {ritualCompleted || limitReached || (currentIndex >= cards.length && cards.length > 0) ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={ritualCompleted ? "sparkles" : "time-outline"} 
            size={60} 
            color={theme.colors.primary} 
            style={{ marginBottom: 20 }} 
          />
          <Text style={[styles.title, { fontFamily: 'serif' }]}>
             {ritualCompleted ? "Sessão Finalizada." : "Tudo por hoje!"}
          </Text>
          <Text style={styles.subtitle}>
            {ritualCompleted 
              ? "Que estas palavras ecoem entre vocês até o próximo encontro."
              : "Vocês completaram os 5 cards diários desta categoria. Voltem amanhã para mais!"}
          </Text>
          
          <View style={{flexDirection: 'row', gap: 16, marginTop: 32}}>
              <TouchableOpacity 
                 style={[styles.finishButton, {backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.primary}]} 
                 onPress={() => {
                     setRitualCompleted(false);
                     setLimitReached(false);
                     setCurrentIndex(0);
                     translateX.value = 0;
                     translateY.value = 0;
                 }}
              >
                <Text style={[styles.finishButtonText, {color: theme.colors.primary}]}>Rever cartas</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                 style={styles.finishButton} 
                 onPress={() => navigation.navigate('Main', { screen: 'Perguntas' })}
              >
                <Text style={styles.finishButtonText}>
                    {ritualCompleted ? "Voltar ao menu" : "Explorar outras"}
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
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
            {currentIndex + 1 < cards.length && (
              <Animated.View style={[styles.cardWrapper, nextCardStyle, { zIndex: -1 }]}>
                <Flashcard card={cards[currentIndex + 1]} />
              </Animated.View>
            )}

            {cards.length > 0 && (
              <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.cardWrapper, cardStyle]}>
                  <Flashcard card={cards[currentIndex]} />
                </Animated.View>
              </GestureDetector>
            )}
            
            {cards.length === 0 && !loading && (
               <View style={styles.emptyContainer}>
                  <Text style={styles.subtitle}>Nenhum card disponível para esta categoria.</Text>
               </View>
            )}
          </View>

          {cards.length > 0 && (
              <View style={styles.navButtonsContainer}>
                 <TouchableOpacity 
                   style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]} 
                   onPress={handleManualPrev}
                   disabled={currentIndex === 0}
                 >
                    <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? "#CCC" : theme.colors.primary} />
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={styles.navButton} 
                   onPress={handleManualNext}
                 >
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.primary} />
                 </TouchableOpacity>
              </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textLight,
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
  finishButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButtonsContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonDisabled: {
      opacity: 0.5,
  }
});