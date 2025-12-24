import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { StreakService, StreakData } from '../services/StreakService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    Easing, 
    withSequence 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { EloProgressService } from '../services/EloProgressService';
import { ELOS } from './ElosScreen'; // Import ELOS definition if exported, otherwise redefine
// Redefining ELOS simpler list for badges
const ELOS_LIST = [
    { key: 'elo-comunicacao', label: 'Comunicação Clara', icon: 'chatbubbles' },
    { key: 'elo-confianca', label: 'Confiança Inabalável', icon: 'shield-checkmark' },
    { key: 'elo-conflitos', label: 'Resolução de Conflitos', icon: 'construct' },
    { key: 'elo-intimidade', label: 'Intimidade Profunda', icon: 'heart-circle' },
    { key: 'elo-sonhos', label: 'Sonhos Compartilhados', icon: 'star' },
];

const { width } = Dimensions.get('window');

export const StreaksScreen = () => {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [eloProgress, setEloProgress] = useState<Record<string, any>>({});

  useFocusEffect(
    useCallback(() => {
      StreakService.getStreakData().then(setStreak);
      EloProgressService.getAllProgress().then(setEloProgress);
    }, [])
  );
  
  // Animation Logic (Keep existing scale logic)
  const scale = useSharedValue(1);
  useEffect(() => {
      scale.value = withRepeat(
          withSequence(
              withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
      );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
      return {
          transform: [{ scale: scale.value }]
      };
  });
  // End Animation Logic

  const getFlameColor = (count: number) => {
    if (count >= 31) return ['#9C27B0', '#E040FB']; // Cosmic
    if (count >= 11) return ['#FFD700', '#FFA000']; // Gold
    if (count >= 4) return ['#2196F3', '#64B5F6']; // Blue
    return ['#FF5722', '#FF9800']; // Orange
  };
  
  const currentColors = getFlameColor(streak?.currentStreak || 0);
  const setsCompleted = streak?.totalCategorySetsCompleted || 0;

  const CATEGORY_MILESTONES = [
      { count: 1, label: 'Primeiros Passos', icon: 'footsteps' },
      { count: 5, label: 'Explorador', icon: 'compass' },
      { count: 10, label: 'Aventureiro', icon: 'map' },
      { count: 20, label: 'Especialista', icon: 'ribbon' },
      { count: 50, label: 'Mestre do Amor', icon: 'trophy' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sua Jornada</Text>
        
        <View style={styles.flameContainer}>
          <Animated.View style={[animatedStyle]}>
              <LinearGradient
                colors={currentColors}
                style={styles.flameBackground}
              >
                  <Ionicons 
                    name="flame" 
                    size={80} 
                    color="white" 
                  />
              </LinearGradient>
          </Animated.View>
          
          <Text style={styles.streakCount}>{streak?.currentStreak || 0}</Text>
          <Text style={styles.streakLabel}>Dias de Conexão</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak?.bestStreak || 0}</Text>
            <Text style={styles.statLabel}>Melhor Sequência</Text>
          </View>
           <View style={[styles.statBox, {borderLeftWidth: 1, borderLeftColor: '#EEE', paddingLeft: 20}]}>
            <Text style={styles.statValue}>{setsCompleted}</Text>
            <Text style={styles.statLabel}>Sessões Completas</Text>
          </View>
        </View>

        {/* Milestone Badges */}
        <View style={styles.section}>
             <Text style={styles.sectionTitle}>Expertise do Cosmo</Text>
             <View style={styles.badgesGrid}>
                 {CATEGORY_MILESTONES.map((m, i) => {
                     const isUnlocked = setsCompleted >= m.count;
                     return (
                         <View key={i} style={[styles.badgeContainer, !isUnlocked && styles.badgeLocked]}>
                             <View style={[styles.badgeIcon, isUnlocked && styles.badgeIconUnlocked]}>
                                 <Ionicons name={m.icon as any} size={24} color={isUnlocked ? 'white' : '#BBB'} />
                             </View>
                             <Text style={styles.badgeText}>{m.count}</Text>
                             <Text style={styles.badgeLabel} numberOfLines={1}>{m.label}</Text>
                         </View>
                     );
                 })}
             </View>
        </View>

        <View style={styles.section}>
             <Text style={styles.sectionTitle}>Mestre dos Elos</Text>
             <View style={{ gap: 10 }}>
                 {ELOS_LIST.map((elo, i) => {
                     const progress = eloProgress[elo.key]?.currentLevel || 0;
                     // Assuming max level 20 based on elo data instructions; check specific max if needed
                     const isCompleted = progress >= 20; 
                     return (
                        <View key={i} style={[styles.unlockItem, isCompleted && styles.unlockItemActive]}>
                            <View style={[styles.unlockIconBox, isCompleted && styles.unlockedIconBox]}>
                                <Ionicons name={elo.icon as any} size={24} color={isCompleted ? theme.colors.primary : theme.colors.textLight} />
                            </View>
                            <View style={styles.unlockInfo}>
                                <Text style={[styles.unlockLabel, isCompleted && { color: theme.colors.primary }]}>{elo.label}</Text>
                                <Text style={styles.unlockSub}>{isCompleted ? "Completado" : `${progress}/20 lições`}</Text>
                            </View>
                            {isCompleted ? (
                                <Ionicons name="checkmark-seal" size={24} color={theme.colors.primary} />
                            ) : (
                                <View style={styles.lockedBadge}>
                                    <View style={{width: `${(progress/20)*100}%`, height: '100%', backgroundColor: theme.colors.primary, opacity: 0.3, position:'absolute', left:0}} />
                                    <Text style={{fontSize: 10, color: '#999'}}>{Math.round((progress/20)*100)}%</Text>
                                </View>
                            )}
                        </View>
                     );
                 })}
             </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.l,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    ...theme.typography.header,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  flameContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  flameBackground: {
     width: 160,
     height: 160,
     borderRadius: 80,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: theme.spacing.m,
     shadowColor: '#FF5722',
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.3,
     shadowRadius: 20,
     elevation: 10,
  },
  streakCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  streakLabel: {
    fontSize: 16,
    color: theme.colors.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    backgroundColor: 'white',
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  section: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  badgesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
  },
  badgeContainer: {
      alignItems: 'center',
      width: '18%', 
  },
  badgeLocked: {
      opacity: 0.5,
  },
  badgeIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
  },
  badgeIconUnlocked: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
  },
  badgeText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 2
  },
  badgeLabel: {
      fontSize: 9,
      color: theme.colors.textLight,
      textAlign: 'center',
  },
  unlockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unlockItemActive: {
    borderColor: '#FFE0E6',
    backgroundColor: '#FFF5F7',
  },
  unlockIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  unlockedIconBox: {
    backgroundColor: 'white',
  },
  unlockInfo: {
    flex: 1,
  },
  unlockLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textLight,
  },
  unlockSub: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  lockedBadge: {
    width: 40,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
