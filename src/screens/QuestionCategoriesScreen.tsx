import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StreakService } from '../services/StreakService';
import { DailyLimitService } from '../services/DailyLimitService';
import { RitualService } from '../services/RitualService';
import { ProfileService } from '../services/ProfileService';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES_DATA = [
  { id: 'daily', label: 'Diário', icon: 'star', color: '#FFD700', level: 1 },
  { id: 'almas-gemeas', label: 'Almas Gêmeas', icon: 'heart-half', color: '#E91E63', level: 1 },
  { id: 'casais', label: 'Leveza', icon: 'heart', color: '#FF5722', level: 1 },
  { id: 'conexao-diaria', label: 'Conexão', icon: 'infinite', color: '#4CAF50', level: 1 },
  { id: 'confianca', label: 'Confiança', icon: 'shield-checkmark', color: '#2196F3', level: 1 },
  
  { id: 'crescimento', label: 'Crescimento', icon: 'trending-up', color: '#9C27B0', level: 2 },
  { id: 'desafios', label: 'Desafios', icon: 'trophy', color: '#FFC107', level: 2 },
  { id: 'leve-e-divertido', label: 'Divertido', icon: 'balloon', color: '#00BCD4', level: 2 },
  { id: 'memorias', label: 'Memórias', icon: 'images', color: '#795548', level: 2 },
  
  { id: 'modo-familia', label: 'Família', icon: 'people', color: '#8BC34A', level: 3 },
  { id: 'perguntas-profundas', label: 'Profundo', icon: 'water', color: '#3F51B5', level: 3 },
  { id: 'quentes', label: 'Quentes', icon: 'flame', color: '#F44336', level: 3 },
  { id: 'romance', label: 'Romance', icon: 'rose', color: '#E91E63', level: 3 },
  { id: 'voce-prefere', label: 'Você Prefere', icon: 'git-compare', color: '#607D8B', level: 3 },
];

const LEVEL_INFO = {
    1: { title: 'Nível 1', desc: 'Desbloqueado por padrão', req: 0 },
    2: { title: 'Nível 2', desc: 'Complete 2 categorias para desbloquear', req: 2 },
    3: { title: 'Nível 3', desc: 'Complete 4 categorias para desbloquear', req: 4 },
};

export const QuestionCategoriesScreen = () => {
  const navigation = useNavigation<any>();
  const [completedCount, setCompletedCount] = useState(0);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [isDailyDone, setIsDailyDone] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);

  // Use focus effect to reload when coming back from feed
  useFocusEffect(
    React.useCallback(() => {
     loadProgress();
    }, [])
  );

  const loadProgress = async () => {
      // 1. Check persistent completions from Profile
      const profile = await ProfileService.getProfile();
      const persistentCompleted = profile?.completedCategoryIds || [];
      const count = persistentCompleted.length;
      setCompletedCount(count);
      setCompletedCategories(persistentCompleted);

      // 2. Check Daily completion status
      const dailyDone = await RitualService.hasCompletedToday();
      setIsDailyDone(dailyDone);
      
      // 3. Check Daily Progress
      const dProgress = await DailyLimitService.getConsumedCount('daily');
      setDailyProgress(Math.min(dProgress, 5));
  };

  const isLevelUnlocked = (level: number) => {
      if (level === 1) return true;
      const req = LEVEL_INFO[level as 1|2|3].req;
      return completedCount >= req;
  };

  const renderDailyHero = () => {
      const progress = isDailyDone ? 5 : 0; 
      return (
        <TouchableOpacity 
            style={styles.heroCard}
            onPress={() => navigation.navigate('Feed', { categoryId: 'daily', categoryTitle: 'Perguntas Diárias' })}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={['#4C1D95', '#7C3AED']}
                style={styles.heroGradient}
            >
                <View style={styles.heroContent}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.heroTitle}>Perguntas Diárias</Text>
                        <Text style={styles.heroSubtitle}>Conecte-se com seu amor hoje</Text>
                    </View>
                    <Ionicons name="planet" size={60} color="rgba(255,255,255,0.3)" style={styles.heroIcon} />
                </View>

                <View style={{ marginTop: 2, marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                         <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                             {dailyProgress >= 5 ? 'Meta atingida!' : `${5 - dailyProgress} perguntas restantes`}
                         </Text>
                         <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{dailyProgress}/5</Text>
                    </View>
                    <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' }}>
                         <View style={{ height: '100%', width: `${(dailyProgress/5)*100}%`, backgroundColor: 'white' }} />
                    </View>
                </View>

                {isDailyDone ? (
                    <View style={styles.heroCTA}>
                        <Text style={styles.heroCTAText}>Concluído, Rever</Text>
                        <Ionicons name="checkmark-circle" size={16} color="black" />
                    </View>
                ) : (
                    <View style={styles.heroCTA}>
                        <Text style={styles.heroCTAText}>Iniciar agora</Text>
                        <Ionicons name="arrow-forward" size={16} color="black" />
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
      );
  }

  const renderSection = (level: number) => { // Type explicitly as number
      const levelData = LEVEL_INFO[level as 1|2|3];
      const items = CATEGORIES_DATA.filter(c => c.level === level && c.id !== 'daily');
      const unlocked = isLevelUnlocked(level);

      return (
          <View key={level} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{levelData.title}</Text>
                  {!unlocked && (
                      <View style={styles.lockBadge}>
                         <Ionicons name="lock-closed" size={12} color="white" style={{marginRight:4}} />
                         <Text style={styles.lockText}>{completedCount}/{levelData.req} completos</Text>
                      </View>
                  )}
              </View>
              <Text style={styles.sectionDesc}>{levelData.desc}</Text>

              <View style={[styles.grid, !unlocked && { opacity: 0.5 }]}>
                  {items.map(cat => {
                      const isCatCompleted = completedCategories.includes(cat.id);
                      return (
                          <TouchableOpacity 
                            key={cat.id} 
                            style={styles.card}
                            onPress={() => {
                                if (unlocked) {
                                    navigation.navigate('Feed', { categoryId: cat.id, categoryTitle: cat.label });
                                }
                            }}
                            activeOpacity={unlocked ? 0.7 : 1}
                          >
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                                  <Ionicons name={unlocked ? (cat.icon as any) : 'lock-closed'} size={24} color={cat.color} />
                                </View>
                                {isCatCompleted && (
                                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                                )}
                            </View>
                            <Text style={styles.label}>{cat.label}</Text>
                            <View style={styles.statsRow}>
                                <Text style={styles.statsText}>{unlocked ? 'Descobrir' : 'Bloqueado'}</Text>
                                {unlocked && <Ionicons name="chevron-forward" size={12} color={theme.colors.textLight} />}
                            </View>
                          </TouchableOpacity>
                      );
                  })}
              </View>
          </View>
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Temas</Text>
          <Text style={styles.subtitle}>Escolha um tema para conversar</Text>
        </View>

        {renderDailyHero()}

        {renderSection(1)}
        {renderSection(2)}
        {renderSection(3)}

        <View style={{height: 20}} />
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
    padding: theme.spacing.m,
    paddingBottom: 40,
  },
  header: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  title: {
    ...theme.typography.h1,
    color: '#FFFFFF',
  },
  subtitle: {
    ...theme.typography.body,
    marginTop: 4,
    color: theme.colors.textLight
  },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 4,
  },
  heroGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  heroIcon: {
      position: 'absolute',
      right: -10,
      top: -10,
  },
  heroCTA: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    gap: 8,
  },
  heroCTAText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionContainer: {
      marginBottom: 32,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      paddingHorizontal: 8,
      justifyContent: 'space-between'
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
  },
  sectionDesc: {
      fontSize: 14,
      color: theme.colors.textLight,
      paddingHorizontal: 8,
      marginBottom: 16,
  },
  lockBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  lockText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600'
  },
  grid: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
});
