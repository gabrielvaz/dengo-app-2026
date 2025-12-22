import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { EloProgressService } from '../services/EloProgressService';
import { TipsLoader } from '../data/TipsLoader';

const ELOS = [
  { id: 1, title: 'Comunicação Afetiva', icon: 'chatbubbles', color: '#FF5722', key: 'elo-comunicacao' },
  { id: 2, title: 'Intimidade & Afeto', icon: 'heart', color: '#E91E63', key: 'elo-admiracao-afeto' },
  { id: 3, title: 'Resolução de Conflitos', icon: 'shield-checkmark', color: '#4CAF50', key: 'elo-reparo' },
  { id: 4, title: 'Futuro & Sonhos', icon: 'cloud', color: '#2196F3', key: 'elo-sonhos' },
  { id: 5, title: 'Confiança & Apoio', icon: 'hand-left', color: '#9C27B0', key: 'elo-confianca' },
  { id: 6, title: 'Presença & Diversão', icon: 'airplane', color: '#FF9800', key: 'elo-presenca' },
];

export const ElosScreen = () => {
  const navigation = useNavigation<any>();
  const [progressMap, setProgressMap] = useState<{[key: string]: number}>({});

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
      const allProgress = await EloProgressService.getAllProgress();
      const map: {[key: string]: number} = {};
      
      ELOS.forEach(elo => {
          const tips = TipsLoader.getTipsForElo(elo.key);
          const total = tips?.artigos?.length || 0;
          if (total === 0) {
              map[elo.key] = 0;
          } else {
              const current = allProgress[elo.key]?.currentLevel || 0;
              map[elo.key] = Math.min(current / total, 1);
          }
      });
      setProgressMap(map);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Elos</Text>
        <Text style={styles.subtitle}>Conhecimento para fortalecer sua união.</Text>

        <View style={styles.grid}>
          {ELOS.map((elo) => {
            const progress = progressMap[elo.key] || 0;
            const tips = TipsLoader.getTipsForElo(elo.key);
            const total = tips?.artigos?.length || 0;
            const current = Math.round(progress * total);

            return (
              <TouchableOpacity 
                key={elo.id} 
                style={styles.eloCard}
                onPress={() => navigation.navigate('EloDetail', { elo })}
              >
                <View style={[styles.iconBox, { backgroundColor: `${elo.color}15` }]}>
                  <Ionicons name={elo.icon as any} size={32} color={elo.color} />
                </View>
                <Text style={styles.eloTitle}>{elo.title}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: elo.color }]} />
                </View>
                <Text style={styles.eloInfo}>
                  {progress === 0 ? 'Iniciar jornada' : `${current}/${total} lições`}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  },
  title: {
    ...theme.typography.header,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eloCard: {
    width: '100%',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  eloTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.text,
    height: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginTop: theme.spacing.m,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  eloInfo: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
});
