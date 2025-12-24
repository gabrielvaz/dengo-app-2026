import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { TipsLoader } from '../data/TipsLoader';
import { EloProgressService } from '../services/EloProgressService';

export const EloDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { elo } = route.params;
  
  const tipsData = TipsLoader.getTipsForElo(elo.key);
  const description = tipsData?.elo?.descricao || "Conteúdo para fortalecer este elo.";
  const articles = tipsData?.artigos || [];

  const [started, setStarted] = React.useState(false);
  const [currentLevel, setCurrentLevel] = React.useState(0);
  const [isDailyLocked, setIsDailyLocked] = React.useState(false);

  const getBenefits = (key: string) => {
      switch(key) {
          case 'elo-comunicacao': return ['Entender um ao outro', 'Evitar conflitos', 'Aprofundar conexão'];
          case 'elo-admiracao-afeto': return ['Reacender a paixão', 'Explorar desejos', 'Confiança total'];
          case 'elo-reparo': return ['Paz no lar', 'Respeito mútuo', 'Crescimento'];
          case 'elo-sonhos': return ['Sonhos compartilhados', 'Segurança', 'Legado'];
          case 'elo-confianca': return ['Apoio emocional', 'Segurança', 'Parceria'];
          case 'elo-presenca': return ['Momentos leves', 'Risadas', 'Lembranças'];
          default: return ['Fortalecer o elo', 'Mais amor', 'Cumplicidade'];
      }
  };

  const benefits = getBenefits(elo.key);

  useFocusEffect(
    useCallback(() => {
     checkProgress();
    }, [elo.key])
  );

  const checkProgress = async () => {
     const progress = await EloProgressService.getProgress(elo.key);
     setCurrentLevel(progress.currentLevel);
     
     const today = new Date().toISOString().split('T')[0];
     if (progress.lastCompletionDate === today) {
         setIsDailyLocked(true);
     }
  };
  
  const handleStart = () => {
      setStarted(true);
  };

  const openLesson = (artigo: any, index: number) => {
      navigation.navigate('EloLesson', { 
          eloId: elo.key, 
          lesson: artigo, 
          order: index,
          color: elo.color
      });
  };

  const getReadingTime = (artigo: any) => {
      // Estimate 1 min per 150 words/sections
      return artigo.tempoLeitura || "2 min";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{elo.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroSection, { backgroundColor: `${elo.color}10` }]}>
            <View style={[styles.mainIconBox, { backgroundColor: elo.color }]}>
              <Ionicons name={elo.icon} size={40} color="white" />
            </View>
            <Text style={styles.heroTitle}>Fortaleça sua {elo.title}</Text>
            <Text style={styles.heroDescription}>{description}</Text>
            
            <View style={styles.benefitsContainer}>
                {benefits.map((b, i) => (
                    <View key={i} style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={16} color={elo.color} />
                        <Text style={styles.benefitText}>{b}</Text>
                    </View>
                ))}
            </View>
        </View>

        {!started ? (
             <View style={styles.startContainer}>
                 <Text style={styles.startTitle}>Pronto para começar?</Text>
                 <Text style={styles.startSubtitle}>Siga a trilha de aprendizado para transformar seu relacionamento.</Text>
                 <TouchableOpacity style={[styles.startButton, { backgroundColor: elo.color }]} onPress={handleStart}>
                     <Text style={styles.startButtonText}>Iniciar Jornada</Text>
                     <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 8}} />
                 </TouchableOpacity>
                 <Text style={styles.lessonCount}>{articles.length} lições disponíveis</Text>
             </View>
        ) : (
            <View style={styles.trackContainer}>
              <Text style={styles.sectionTitle}>Sua Trilha</Text>
              
              {articles.length > 0 ? (
                articles.map((artigo: any, index: number) => {
                  const isLocked = index > currentLevel;
                  const isCompleted = index < currentLevel;
                  const isCurrent = index === currentLevel;
                  
                  // Logic regarding lock:
                  // Locked if index > currentLevel.
                  // Current is clickable. BUT if daily locked, shows message inside? Or locked entirely?
                  // User rule: Daily limit applies.
                  // If isDailyLocked and isCurrent => It is effectively "Locked for today".
                  
                  const isTodayLocked = isCurrent && isDailyLocked;
                  const showLock = isLocked || isTodayLocked;
                  
                  return (
                    <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.tipCard, 
                            showLock && styles.tipCardLocked,
                            isCompleted && styles.tipCardCompleted
                        ]}
                        onPress={() => !showLock ? openLesson(artigo, index) : null}
                        disabled={showLock && !isCompleted}
                    >
                        <View style={styles.cardLeft}>
                            <View style={[
                                styles.statusIcon, 
                                isCompleted ? {backgroundColor: 'rgba(76, 175, 80, 0.1)'} : (showLock ? {backgroundColor: 'rgba(255,255,255,0.05)'} : {backgroundColor: `${elo.color}20`})
                            ]}>
                                <Ionicons 
                                    name={isCompleted ? "checkmark" : (showLock ? "lock-closed" : "play")} 
                                    size={18} 
                                    color={isCompleted ? "#4CAF50" : (showLock ? "#555" : elo.color)} 
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={[styles.tipTitle, showLock && {color: theme.colors.textLight}]}>
                                    {artigo.titulo}
                                </Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                                    <Text style={styles.tipSubtitle}>
                                        {isCompleted ? "Concluído" : (showLock ? (isTodayLocked ? "Disponível amanhã" : (index > currentLevel ? "Bloqueado: Complete o item anterior" : "Bloqueado")) : "Toque para ler")}
                                    </Text>
                                    <Text style={styles.timeLabel}>• {getReadingTime(artigo)}</Text>
                                </View>
                            </View>
                        </View>
                        
                        {!showLock && (
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
                        )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                  <Text style={styles.emptyText}>Em breve mais lições.</Text>
              )}
            </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: theme.spacing.l,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  mainIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.l,
    opacity: 0.8,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  benefitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  startTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  startSubtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    fontSize: 18,
  },
  lessonCount: {
    marginTop: 16,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  trackContainer: {
    padding: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    marginLeft: 4,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipCardLocked: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'transparent',
    opacity: 0.6,
  },
  tipCardCompleted: {
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  tipSubtitle: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  timeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: theme.colors.textLight,
  },
});
