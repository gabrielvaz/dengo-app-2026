import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StreakService } from '../services/StreakService';

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

  useEffect(() => {
    StreakService.getStreakData().then(data => setUnlocked(data.unlockedCategories));
  }, []);

  const renderCategory = (cat: typeof CATEGORIES[0]) => {
    const isLocked = !unlocked.includes(cat.id);
    
    return (
      <TouchableOpacity 
        key={cat.id} 
        style={styles.card}
        onPress={() => !isLocked && navigation.navigate('Feed', { categoryId: cat.id, categoryTitle: cat.label })}
      >
        <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
          <Ionicons name={isLocked ? 'lock-closed' : cat.icon as any} size={24} color={cat.color} />
        </View>
        <Text style={styles.label}>{cat.label}</Text>
        <View style={styles.statsRow}>
            <Text style={styles.statsText}>5 disponíveis hoje</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Perguntas</Text>
          <Text style={styles.subtitle}>Escolha um tema para conversar</Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map(renderCategory)}
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
  },
  header: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.header,
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - theme.spacing.m * 3) / 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsText: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#DDD',
  },
});
