import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { StreakService, StreakData } from '../services/StreakService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation<any>();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [eloProgress, setEloProgress] = useState<Record<string, any>>({});
  const [selectedInfo, setSelectedInfo] = useState<{title: string, content: string} | null>(null);

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

  const getCosmoLevelInfo = (count: number) => {
    if (count >= 50) return {
        colors: ['#9C27B0', '#E040FB', '#4A148C'] as const,
        title: 'Universo em Expansão',
        desc: 'O amor de vocês não tem limites. Vocês criaram uma realidade própria, vasta e cheia de vida, onde cada troca expande ainda mais o horizonte.'
    };
    if (count >= 20) return {
        colors: ['#FF1493', '#C71585'] as const,
        title: 'Fusão Estelar',
        desc: 'Duas almas brilhando como uma. A energia de vocês é intensa, vibrante e capaz de iluminar qualquer escuridão.'
    };
    if (count >= 10) return {
        colors: ['#FF7F50', '#FF4500'] as const,
        title: 'Gravidade Compartilhada',
        desc: 'Vocês giram em sintonia perfeita. Existe um equilíbrio natural e uma força invisível que sempre os puxa para perto.'
    };
    if (count >= 3) return {
        colors: ['#00BFFF', '#1E90FF'] as const,
        title: 'Órbita Sincronizada',
        desc: 'Vocês encontraram o ritmo certo. A convivência flui, e cada dia traz uma nova descoberta sobre o mundo do outro.'
    };
    return {
        colors: ['#7C3AED', '#A78BFA'] as const,
        title: 'Centelha Inicial',
        desc: 'Tudo começa com uma faísca. Vocês estão acendendo a chama de algo que tem potencial para se tornar grandioso.'
    };
  };
  
  const levelInfo = getCosmoLevelInfo(streak?.currentStreak || 0);
  const currentColors = levelInfo.colors;
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
       <Text style={styles.title}>Cosmo do Casal</Text>
        
        <View style={styles.flameContainer}>
          <Animated.View style={[animatedStyle]}>
              <LinearGradient
                colors={currentColors}
                style={styles.flameBackground}
              >
                  <Ionicons 
                    name="planet" 
                    size={80} 
                    color="white" 
                  />
              </LinearGradient>
          </Animated.View>
          
          <Text style={styles.levelTitle}>{levelInfo.title}</Text>
          <Text style={styles.daysText}>{streak?.currentStreak || 0} dias de conexão</Text>
          <Text style={styles.levelDesc}>{levelInfo.desc}</Text>
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

        {/* Expertise do Cosmo */}
        <View style={styles.section}>
             <Text style={styles.sectionTitle}>Expertise do Cosmo</Text>
             <View style={{ gap: 10 }}>
                 {CATEGORY_MILESTONES.map((m, i) => {
                     const isUnlocked = setsCompleted >= m.count;
                     return (
                         <TouchableOpacity 
                            key={i} 
                            style={[styles.unlockItem, isUnlocked && styles.unlockItemActive]}
                            onPress={() => setSelectedInfo({
                                title: m.label,
                                content: `Esta insígnia é conquistada ao completar ${m.count} sessões de conversa no Cosmo. Continue explorando novos temas para evoluir sua expertise!`
                            })}
                         >
                             <View style={[styles.unlockIconBox, isUnlocked && styles.unlockedIconBox]}>
                                 <Ionicons name={m.icon as any} size={24} color={isUnlocked ? theme.colors.primary : theme.colors.textLight} />
                             </View>
                             <View style={styles.unlockInfo}>
                                 <Text style={[styles.unlockLabel, isUnlocked && { color: theme.colors.primary }]}>{m.label}</Text>
                                 <Text style={styles.unlockSub}>{isUnlocked ? "Desbloqueada" : `Complete ${m.count} sessões`}</Text>
                             </View>
                             {isUnlocked ? (
                                 <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                             ) : (
                                 <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.2)" />
                             )}
                         </TouchableOpacity>
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
                <TouchableOpacity 
                    key={i} 
                    style={[styles.unlockItem, isCompleted && styles.unlockItemActive]}
                    onPress={() => {
                        // Special action: if completed OR progress exists, link to category
                        // But user specifically said: "no caso das insignias de Mestre dos elos, leve o usuário para a tela da categoria do elo especifico"
                        // I'll assume they can click anytime to see progress or navigate if unlocked/started.
                        navigation.navigate('EloDetail', { elo: { key: elo.key, title: elo.label, icon: elo.icon, color: theme.colors.primary } });
                    }}
                >
                            <View style={[styles.unlockIconBox, isCompleted && styles.unlockedIconBox]}>
                                <Ionicons name={elo.icon as any} size={24} color={isCompleted ? theme.colors.primary : theme.colors.textLight} />
                            </View>
                            <View style={styles.unlockInfo}>
                                <Text style={[styles.unlockLabel, isCompleted && { color: theme.colors.primary }]}>{elo.label}</Text>
                                <Text style={styles.unlockSub}>{isCompleted ? "Completado" : `${progress}/20 lições`}</Text>
                            </View>
                            {isCompleted ? (
                                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                            ) : (
                                <View style={styles.lockedBadge}>
                                    <View style={{width: `${(progress/20)*100}%`, height: '100%', backgroundColor: theme.colors.primary, opacity: 0.3, position:'absolute', left:0}} />
                                    <Text style={{fontSize: 10, color: '#999'}}>{Math.round((progress/20)*100)}%</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                     );
                 })}
             </View>
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Modal
        visible={!!selectedInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedInfo(null)}
      >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setSelectedInfo(null)}
          >
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedInfo?.title}</Text>
                  <Text style={styles.modalText}>{selectedInfo?.content}</Text>
                  <TouchableOpacity 
                    style={styles.modalButton} 
                    onPress={() => setSelectedInfo(null)}
                  >
                      <Text style={styles.modalButtonText}>Entendido</Text>
                  </TouchableOpacity>
              </View>
          </TouchableOpacity>
      </Modal>
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
    ...theme.typography.h1,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xl,
    color: '#FFFFFF',
  },
  levelTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelDesc: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: '85%',
  },
  statsContainer: {
    alignItems: 'center',
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
     shadowColor: theme.colors.primary,
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.5,
     shadowRadius: 20,
     elevation: 10,
  },
  streakCount: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakLabel: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    width: '100%',
    justifyContent: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#A09FA6',
    marginTop: 4,
  },
  section: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: '#FFFFFF',
    marginBottom: theme.spacing.m,
  },
  badgeLabel: {
    fontSize: 9,
    color: '#A09FA6',
    textAlign: 'center',
  },
  unlockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unlockItemActive: {
    borderColor: 'rgba(255, 127, 80, 0.2)',
  },
  unlockIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  unlockedIconBox: {
    backgroundColor: 'rgba(255, 127, 80, 0.1)',
  },
  unlockInfo: {
    flex: 1,
  },
  unlockLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  unlockSub: {
    fontSize: 12,
    color: '#A09FA6',
  },
  lockedBadge: {
    width: 40,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#0F0E17',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
