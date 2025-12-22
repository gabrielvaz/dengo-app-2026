import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserProfile } from '../models/UserProfile';
import { Ionicons } from '@expo/vector-icons';
import { ProfileService } from '../services/ProfileService';
import { NotificationService } from '../services/NotificationService';

const INTERESTS = [
  { id: 'aprofundar-intimidade', label: 'Aprofundar intimidade', icon: 'heart' },
  { id: 'conhecer-melhor', label: 'Conhecer melhor', icon: 'search' },
  { id: 'conexao-emocional', label: 'Conexão emocional', icon: 'infinite' },
  { id: 'comunicacao', label: 'Melhorar comunicação', icon: 'chatbubbles' },
  { id: 'criar-rituais', label: 'Criar rituais', icon: 'calendar' },
  { id: 'sair-da-rotina', label: 'Sair da rotina', icon: 'airplane' },
  { id: 'momentos-divertidos', label: 'Momentos divertidos', icon: 'happy' },
  { id: 'esquentar-relacionamento', label: 'Esquentar a relação', icon: 'flame' },
  { id: 'resolver-distancias', label: 'Resolver distâncias', icon: 'map' },
  { id: 'fortalecer-confianca', label: 'Fortalecer confiança', icon: 'shield-checkmark' },
  { id: 'falar-do-passado', label: 'Falar do passado', icon: 'time' },
  { id: 'planejar-futuro', label: 'Planejar o futuro', icon: 'rocket' },
];

export const InterestScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleFinish = async () => {
    try {
      const tempProfileJson = await AsyncStorage.getItem('user_profile_temp');
      if (tempProfileJson) {
        const tempProfile = JSON.parse(tempProfileJson);
        let finalProfile: UserProfile = {
          ...tempProfile,
          needs: selectedInterests,
        };

        await ProfileService.saveProfile(finalProfile);
        await AsyncStorage.removeItem('user_profile_temp');

        const enabled = finalProfile.notificationsEnabled ?? true;
        const time = finalProfile.notificationTime || '20:00';
        const applied = await NotificationService.applySettings({
          enabled,
          time,
          requestPermission: enabled,
        });

        if (enabled && !applied) {
          finalProfile = { ...finalProfile, notificationsEnabled: false };
          await ProfileService.saveProfile(finalProfile);
          Alert.alert(
            'Notificacoes desativadas',
            'Sem permissao para notificacoes. Voce pode ativar depois no Perfil.'
          );
        }
        
        // Navigate to Main Feed (Assuming 'Feed' route exists)
        navigation.replace('Main'); 
      }
    } catch (e) {
      console.error('Failed to save final profile', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={[styles.content, {paddingBottom: 100}]}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>O que vocês buscam?</Text>
            <Text style={styles.subtitle}>
              Selecione o que é mais importante para vocês agora.
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {INTERESTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.interestCard, selectedInterests.includes(item.id) && styles.interestCardSelected]}
                onPress={() => toggleInterest(item.id)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={34} 
                  color={selectedInterests.includes(item.id) ? 'white' : theme.colors.primary} 
                  style={{marginBottom: 10}}
                />
                <Text style={[styles.interestLabel, selectedInterests.includes(item.id) && styles.interestLabelSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, selectedInterests.length === 0 && styles.nextButtonDisabled]}
            onPress={handleFinish}
            disabled={selectedInterests.length === 0}
          >
            <Text style={styles.nextButtonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
  },
  content: {
    padding: theme.spacing.l,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  interestCard: {
    width: '47%',
    aspectRatio: 1,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interestCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  interestLabel: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  interestLabelSelected: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginTop: 'auto',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
