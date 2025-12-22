import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserProfile } from '../models/UserProfile';

const INTERESTS = [
  { id: 'aprofundar-intimidade', label: 'Aprofundar intimidade' },
  { id: 'conhecer-melhor', label: 'Conhecer melhor' },
  { id: 'conexao-emocional', label: 'Conexão emocional' },
  { id: 'comunicacao', label: 'Melhorar comunicação' },
  { id: 'criar-rituais', label: 'Criar rituais' },
  { id: 'sair-da-rotina', label: 'Sair da rotina' },
  { id: 'momentos-divertidos', label: 'Momentos divertidos' },
  { id: 'esquentar-relacionamento', label: 'Esquentar a relação' },
  { id: 'resolver-distancias', label: 'Resolver distâncias' },
  { id: 'fortalecer-confianca', label: 'Fortalecer confiança' },
  { id: 'falar-do-passado', label: 'Falar do passado' },
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
        const finalProfile: UserProfile = {
          ...tempProfile,
          needs: selectedInterests,
        };
        await AsyncStorage.setItem('user_profile', JSON.stringify(finalProfile));
        // Clear temp
        await AsyncStorage.removeItem('user_profile_temp');
        
        // Navigate to Main Feed (Assuming 'Feed' route exists)
        navigation.navigate('Feed'); 
      }
    } catch (e) {
      console.error('Failed to save final profile', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
              style={[styles.chip, selectedInterests.includes(item.id) && styles.chipSelected]}
              onPress={() => toggleInterest(item.id)}
            >
              <Text style={[styles.chipText, selectedInterests.includes(item.id) && styles.chipTextSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, selectedInterests.length === 0 && styles.nextButtonDisabled]}
          onPress={handleFinish}
          disabled={selectedInterests.length === 0}
        >
          <Text style={styles.nextButtonText}>Começar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.l,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
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
    justifyContent: 'center',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.xl,
  },
  chip: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  chipTextSelected: {
    color: theme.colors.white,
    fontWeight: '600',
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
