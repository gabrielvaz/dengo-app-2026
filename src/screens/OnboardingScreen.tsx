import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RELATIONSHIP_STAGES = [
  { id: 'se-conhecendo', label: 'Se conhecendo' },
  { id: 'namorando', label: 'Namorando' },
  { id: 'noivados', label: 'Noivos' },
  { id: 'casados', label: 'Casados' },
];

const RELATIONSHIP_TIMES = [
  { id: 'menos-de-6-meses', label: 'Menos de 6 meses' },
  { id: '6-meses-a-2-anos', label: '6 meses a 2 anos' },
  { id: '2-a-5-anos', label: '2 a 5 anos' },
  { id: '5-a-10-anos', label: '5 a 10 anos' },
  { id: 'mais-de-10-anos', label: 'Mais de 10 anos' },
];

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const handleNext = async () => {
    if (step === 0 && stage) {
      setStep(1);
    } else if (step === 1 && time) {
      // Save partial profile and move to interests
      try {
        await AsyncStorage.setItem('user_profile_temp', JSON.stringify({ relationshipStage: stage, relationshipTime: time }));
        navigation.navigate('Interests');
      } catch (e) {
        console.error('Failed to save profile', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Dengo</Text>
          <Text style={styles.subtitle}>
            {step === 0 ? 'Qual o momento do seu relacionamento?' : 'Há quanto tempo vocês estão juntos?'}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {step === 0 ? (
            RELATIONSHIP_STAGES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionButton, stage === item.id && styles.optionButtonSelected]}
                onPress={() => setStage(item.id)}
              >
                <Text style={[styles.optionText, stage === item.id && styles.optionTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            RELATIONSHIP_TIMES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionButton, time === item.id && styles.optionButtonSelected]}
                onPress={() => setTime(item.id)}
              >
                <Text style={[styles.optionText, time === item.id && styles.optionTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, ((step === 0 && !stage) || (step === 1 && !time)) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={(step === 0 && !stage) || (step === 1 && !time)}
        >
          <Text style={styles.nextButtonText}>Continuar</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
    fontFamily: 'serif', // Simple way to get elegant font on iOS/Android
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionButton: {
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF0F5', // Light burgundy tint
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
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
