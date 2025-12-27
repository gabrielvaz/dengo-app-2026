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
  { id: 'aprofundar-intimidade', label: 'Aprofundar\nintimidade', icon: 'heart' },
  { id: 'conhecer-melhor', label: 'Conhecer\nmelhor', icon: 'search' },
  { id: 'conexao-emocional', label: 'Conexão\nemocional', icon: 'infinite' },
  { id: 'comunicacao', label: 'Melhorar\ncomunicação', icon: 'chatbubbles' },
  { id: 'criar-rituais', label: 'Criar\nrituais', icon: 'calendar' },
  { id: 'sair-da-rotina', label: 'Sair da\nrotina', icon: 'airplane' },
  { id: 'momentos-divertidos', label: 'Momentos\ndivertidos', icon: 'happy' },
  { id: 'esquentar-relacionamento', label: 'Esquentar\na relação', icon: 'flame' },
  { id: 'resolver-distancias', label: 'Resolver\ndistâncias', icon: 'map' },
  { id: 'fortalecer-confianca', label: 'Fortalecer\nconfiança', icon: 'shield-checkmark' },
  { id: 'falar-do-passado', label: 'Falar do\npassado', icon: 'time' },
  { id: 'planejar-futuro', label: 'Planejar\no futuro', icon: 'rocket' },
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
        
        // Navigate to Temas directly
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Perguntas' } }],
        });
      }
    } catch (e) {
      console.error('Failed to save final profile', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={[styles.content]}>
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
                <View style={{alignItems: 'center', justifyContent: 'center', gap: 8}}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={34} 
                    color={selectedInterests.includes(item.id) ? '#0F0E17' : theme.colors.primary} 
                  />
                  <Text style={[styles.interestLabel, selectedInterests.includes(item.id) && styles.interestLabelSelected]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {selectedInterests.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleFinish}
            >
              <Text style={styles.nextButtonText}>Começar</Text>
            </TouchableOpacity>
          </View>
        )}
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
      paddingBottom: 40,
  },
  content: {
    padding: theme.spacing.l,
    flexGrow: 1,
    paddingBottom: 120, // Space for footer
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
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
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestCardSelected: {
    backgroundColor: theme.colors.primary,
  },
  interestLabel: {
    fontSize: 14,
    color: '#A09FA6',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
    // height: 36, // Removed to allow true centering
  },
  interestLabelSelected: {
    color: '#0F0E17',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 30,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#0F0E17',
    fontSize: 18,
    fontWeight: '700',
  },
});
