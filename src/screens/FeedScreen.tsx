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
import { CONGRATULATIONS_COPIES, CONGRATULATIONS_TITLES } from '../data/congratulations_copies';

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
  const [completionMessage, setCompletionMessage] = useState('');
  const [completionTitle, setCompletionTitle] = useState('');
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const saveScale = useSharedValue(1);
  const toastY = useSharedValue(100);
  const [showToast, setShowToast] = useState(false);
  const lastDirection = useSharedValue<'left' | 'right' | null>(null);

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
        // To go back, we actually want to bring the previous card from the left
        // But since our stack is [current, current+1], we need to set index first then animate
        setCurrentIndex(prev => prev - 1);
        translateX.value = -width * 1.5;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
    }
  };

  const onSave = () => {
      saveScale.value = withSpring(0.9, { damping: 10 }, () => {
          saveScale.value = withSpring(1);
          runOnJS(triggerToast)();
      });
  };

  const triggerToast = () => {
      setShowToast(true);
      toastY.value = withSpring(0, { damping: 15 });
      setTimeout(() => {
          toastY.value = withSpring(100, {}, () => {
              runOnJS(setShowToast)(false);
          });
      }, 2000);
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
          const randTitle = CONGRATULATIONS_TITLES[Math.floor(Math.random() * CONGRATULATIONS_TITLES.length)];
          setCompletionTitle(randTitle);
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
       // Select random message and title
       const randMsg = CONGRATULATIONS_COPIES[Math.floor(Math.random() * CONGRATULATIONS_COPIES.length)];
       const randTitle = CONGRATULATIONS_TITLES[Math.floor(Math.random() * CONGRATULATIONS_TITLES.length)];
       setCompletionMessage(randMsg);
       setCompletionTitle(randTitle);

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
        
        if (direction === 'right' && currentIndex > 0) {
            // Swipe right to go back
            translateX.value = withSpring(width * 1.5, {}, () => {
                runOnJS(handlePrev)();
            });
        } else {
            // Swipe left to go next (or right on first card which usually means skip/like)
            translateX.value = withSpring(direction === 'right' ? width * 1.5 : -width * 1.5);
            runOnJS(onSwipeComplete)(direction);
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const handlePrev = () => {
      setCurrentIndex(prev => prev - 1);
      translateX.value = -width * 1.5;
      translateX.value = withSpring(0);
      translateY.value = 0;
  };

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
        { scale: saveScale.value },
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
           <Ionicons name="close" size={24} color="#FFFFFF" />
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
             {completionTitle || (ritualCompleted ? "Sessão Finalizada" : "Tudo por hoje")}
          </Text>
          <Text style={styles.subtitle}>
            {completionMessage || (ritualCompleted 
              ? "Que estas palavras ecoem entre vocês até o próximo encontro."
              : "Vocês completaram os 5 cards diários desta categoria. Voltem amanhã para mais!")}
          </Text>
          
          <View style={{marginTop: 32, width: '100%', alignItems: 'center', gap: 16}}>
              <TouchableOpacity
                 style={[styles.finishButton, { width: '80%' }]}
                 onPress={() => navigation.navigate('Main', { screen: 'Perguntas' })}
              >
                <Text style={styles.finishButtonText}>
                    Ver outros temas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                 style={{ padding: 10 }}
                 onPress={() => {
                     setRitualCompleted(false);
                     setLimitReached(false);
                     setCurrentIndex(0);
                     translateX.value = 0;
                     translateY.value = 0;
                 }}
              >
                <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>Rever perguntas</Text>
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
                  <Flashcard card={cards[currentIndex]} onSave={onSave} />
                </Animated.View>
              </GestureDetector>
            )}

            {showToast && (
                <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
                    <Ionicons name="heart" size={20} color="white" />
                    <Text style={styles.toastText}>Pergunta salva no Baú</Text>
                </Animated.View>
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
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={styles.navButton} 
                   onPress={handleManualNext}
                 >
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  headerTitle: {
    ...theme.typography.h3,
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'capitalize',
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
    borderRadius: 32, // Match card radius
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.m,
    gap: 6,
    justifyContent: 'center',
  },
  progressBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
    marginTop: 20,
  },
  subtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  finishButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  navButtonsContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    pointerEvents: 'box-none', // Let clicks pass through if needed
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  navButtonDisabled: {
      opacity: 0.3,
  },
  toast: {
      position: 'absolute',
      bottom: 100,
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      gap: 10,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 5,
  },
  toastText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 14,
  }
});