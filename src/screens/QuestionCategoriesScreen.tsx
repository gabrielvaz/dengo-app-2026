import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StreakService } from '../services/StreakService';
import { DailyLimitService } from '../services/DailyLimitService';
import { RitualService } from '../services/RitualService';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'daily', label: 'Diário', icon: 'star', color: '#FFD700' },
  { id: 'almas-gemeas', label: 'Almas Gêmeas', icon: 'heart-half', color: '#E91E63' },
  { id: 'casais', label: 'Casais', icon: 'heart', color: '#FF5722' },
  { id: 'conexao-diaria', label: 'Conexão', icon: 'infinite', color: '#4CAF50' },
  { id: 'confianca', label: 'Confiança', icon: 'shield-checkmark', color: '#2196F3' },
  { id: 'crescimento', label: 'Crescimento', icon: 'trending-up', color: '#9C27B0' },
  { id: 'desafios', label: 'Desafios', icon: 'trophy', color: '#FFC107' },
  { id: 'leve-e-divertido', label: 'Divertido', icon: 'balloon', color: '#00BCD4' },
  { id: 'memorias', label: 'Memórias', icon: 'images', color: '#795548' },
  { id: 'modo-familia', label: 'Família', icon: 'people', color: '#8BC34A' },
  { id: 'perguntas-profundas', label: 'Profundo', icon: 'water', color: '#3F51B5' },
  { id: 'quentes', label: 'Quentes', icon: 'flame', color: '#F44336' },
  { id: 'romance', label: 'Romance', icon: 'rose', color: '#E91E63' },
  { id: 'voce-prefere', label: 'Você Prefere', icon: 'git-compare', color: '#607D8B' },
];

export const QuestionCategoriesScreen = () => {
  const navigation = useNavigation<any>();
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [streak, setStreak] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
        const data = await StreakService.getStreakData();
        setUnlocked(data.unlockedCategories);
        setStreak(data);

        // Check each category for completion
        const completed: string[] = [];
        
        // Check daily explicitly
        const isDailyDone = await RitualService.hasCompletedToday();
        if (isDailyDone) completed.push('daily');

        for (const cat of CATEGORIES) {
            if (cat.id === 'daily') continue; // Handled above
            const isReached = await DailyLimitService.isLimitReached(cat.id);
            if (isReached) completed.push(cat.id);
        }
        setCompletedCategories(completed);
    };
    load();
  }, []);

  const dailyCategory = CATEGORIES.find(c => c.id === 'daily')!;
  const otherCategories = CATEGORIES.filter(c => c.id !== 'daily');

  const renderDailyHero = () => {
      const isDailyCompleted = completedCategories.includes('daily');
      const progress = isDailyCompleted ? 5 : 0; // Simplified for now
      return (
        <TouchableOpacity 
            style={styles.heroCard}
            onPress={() => navigation.navigate('Feed', { categoryId: 'daily', categoryTitle: 'Perguntas Diárias' })}
        >
            <LinearGradient
                colors={['#FF7F50', '#FF4500']}
                style={styles.heroGradient}
            >
                <View style={styles.heroContent}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.heroTitle}>Perguntas Diárias</Text>
                        <Text style={styles.heroSubtitle}>Conecte-se com seu amor hoje</Text>
                    </View>
                    <Ionicons name="planet" size={60} color="rgba(255,255,255,0.3)" style={styles.heroIcon} />
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>Expansão do dia</Text>
                        <Text style={styles.progressValue}>{progress}/5</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${(progress/5)*100}%` }]} />
                    </View>
                </View>

                <View style={styles.heroCTA}>
                    <Text style={styles.heroCTAText}>Iniciar agora</Text>
                    <Ionicons name="arrow-forward" size={16} color="black" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
      );
  }

  const renderCategory = (cat: typeof CATEGORIES[0]) => {
    const isLocked = !unlocked.includes(cat.id);
    const isCompleted = completedCategories.includes(cat.id);
    
    return (
      <TouchableOpacity 
        key={cat.id} 
        style={styles.card}
        onPress={() => !isLocked && navigation.navigate('Feed', { categoryId: cat.id, categoryTitle: cat.label })}
      >
        <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
              <Ionicons name={isLocked ? 'lock-closed' : cat.icon as any} size={24} color={cat.color} />
            </View>
            {isCompleted && (
                <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                </View>
            )}
        </View>
        <Text style={styles.label}>{cat.label}</Text>
        <View style={styles.statsRow}>
            <Text style={styles.statsText}>{isLocked ? 'Bloqueado' : 'Descobrir'}</Text>
            {!isLocked && <Ionicons name="chevron-forward" size={12} color={theme.colors.textLight} />}
        </View>
      </TouchableOpacity>
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

        <View style={styles.grid}>
          {otherCategories.map(renderCategory)}
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
    padding: theme.spacing.m,
    paddingBottom: 40,
  },
  header: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h1,
    color: '#FFFFFF',
  },
  subtitle: {
    ...theme.typography.body,
    marginTop: 4,
  },
  heroCard: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#FF7F50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressContainer: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  heroCTA: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    gap: 4,
  },
  heroCTAText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  heroIcon: {
      position: 'absolute',
      right: -10,
      top: -10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  checkBadge: {
    marginTop: -4,
    marginRight: -4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - theme.spacing.m * 3) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
