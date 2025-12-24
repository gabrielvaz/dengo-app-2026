import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

const RELATIONSHIP_STAGES = [
  { id: 'se-conhecendo', label: 'Se conhecendo melhor' },
  { id: 'namorando', label: 'Namoro' },
  { id: 'noivados', label: 'União estável' },
  { id: 'casados', label: 'Casamento' },
  { id: 'outro', label: 'Outro' },
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
  const [timeSliderValue, setTimeSliderValue] = useState(0);
  const [notifTimes, setNotifTimes] = useState<string[]>([]);

  const NOTIF_TIMES = [
    { id: 'smart', label: 'Ritmo do Casal', sub: 'Baseado no seu comportamento', smart: true },
    { id: '05:00-07:00', label: 'Bem cedinho', sub: 'Entre 5h e 7h da manhã' },
    { id: '07:00-09:00', label: 'De manhã', sub: 'Entre 7h e 9h' },
    { id: '12:00-14:00', label: 'Almoço', sub: 'Entre 12h e 14h' },
    { id: '16:00-19:00', label: 'Final da tarde', sub: 'Entre 16h e 19h' },
    { id: '19:00-21:00', label: 'Noite', sub: 'Entre 19h e 21h' },
    { id: '21:00-00:00', label: 'Tarde da noite', sub: 'Entre 21h e meia noite' },
  ];

  const getTimeLabel = (val: number) => {
      const v = Math.floor(val);
      if (v === 0) return "Menos de 1 ano";
      if (v === 1) return "1 ano";
      if (v >= 15) return "Mais de 15 anos";
      return `${v} anos`;
  };

  const handleNext = async () => {
    if (step === 0 && stage) {
      setStep(1);
    } else if (step === 1) {
      // Create time string from slider logic
      const timeStr = getTimeLabel(timeSliderValue);
      setTime(timeStr);
      setStep(2);
    } else if (step === 2 && notifTimes.length > 0) {
      try {
        await AsyncStorage.setItem('user_profile_temp', JSON.stringify({ 
          relationshipStage: stage,
          relationshipTime: time,
          notificationTime: notifTimes,
          notificationsEnabled: true
        }));
        navigation.navigate('Interests');
      } catch (e) {
        console.error('Failed to save profile', e);
      }
    }
  };

  const getHeaderTitle = () => {
      if (step === 0) return 'Qual o momento do seu relacionamento?';
      if (step === 1) return 'Há quanto tempo vocês estão juntos?';
      return 'Qual o melhor momento do dia para o casal interagir com o Cosmo?';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          {step !== 0 && <Text style={styles.title}>Cosmo</Text>}
          
          <Text style={styles.subtitle}>
            {getHeaderTitle()}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {step === 0 && (
            RELATIONSHIP_STAGES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionButton, stage === item.id && styles.optionButtonActive]}
                onPress={() => setStage(item.id)}
              >
                <Text style={[styles.optionText, stage === item.id && styles.optionTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))
          )}
          
          {step === 1 && (
             <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 10}}>
                 <Text style={{fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 20}}>
                     {getTimeLabel(timeSliderValue)}
                 </Text>
                 <Slider
                    style={{width: '100%', height: 40}}
                    minimumValue={0}
                    maximumValue={15}
                    step={1}
                    value={timeSliderValue}
                    onValueChange={setTimeSliderValue}
                    minimumTrackTintColor={theme.colors.primary}
                    maximumTrackTintColor="#000000"
                    thumbTintColor={theme.colors.primary}
                 />
                 <Text style={{textAlign:'center', marginTop: 10, color: theme.colors.textLight}}>
                    Arraste para ajustar o tempo
                 </Text>
             </View>
          )}
          
          {step === 2 && (
            <>
              {NOTIF_TIMES.map((t) => {
                const isSelected = notifTimes.includes(t.id);
                return (
                  <TouchableOpacity 
                    key={t.id} 
                    style={[
                      styles.optionButton, 
                      isSelected && styles.optionButtonActive,
                      t.smart && styles.smartOption
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setNotifTimes(notifTimes.filter(id => id !== t.id));
                      } else {
                        setNotifTimes([...notifTimes, t.id]);
                      }
                    }}
                  >
                    <View style={styles.optionContent}>
                        <View>
                            <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{t.label}</Text>
                            <Text style={[styles.optionSub, isSelected && styles.optionSubActive]}>{t.sub}</Text>
                        </View>
                        {isSelected && <Ionicons name="checkmark-circle" size={20} color="white" />}
                        {t.smart && !isSelected && <Ionicons name="sparkles" size={18} color={theme.colors.primary} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            <Text style={styles.infoText}>Você pode selecionar mais de uma opção.</Text>
            </>
          )}
        </View>

        {((step === 0 && stage) || step === 1 || (step === 2 && notifTimes.length > 0)) && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Continuar</Text>
          </TouchableOpacity>
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
  content: {
    padding: theme.spacing.l,
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  headerImage: {
      width: 250,
      height: 180,
      resizeMode: 'contain',
      marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '700',
  },
  optionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionButton: {
    padding: theme.spacing.m,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
    width: '100%',
    height: 60, // Fixed height for consistency and centering
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#0F0E17',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 30, // Pill shape
    alignItems: 'center',
    marginTop: 'auto',
    height: 56,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
  },
  nextButtonText: {
    // Checking theme, primary is #FF7F50 (Coral). White text is probably better for modern feel?
    // Let's stick to theme.colors.text if it's white? No, button text should be explicit.
    // Screenshot shows 'Continuar ->' in black or dark brown usually on orange. Let's try White first as per general theme, or User screenshot check.
    // Screenshot 1: Orange button, Black/Dark Text "Continuar ->".
    color: '#0F0E17',
    fontSize: 18,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
  },
  optionSub: {
      fontSize: 12,
      color: theme.colors.textLight,
      marginTop: 2,
  },
  optionSubActive: {
      color: 'rgba(255,255,255,0.7)',
  },
  smartOption: {
      borderColor: theme.colors.primary + '50',
      borderWidth: 1.5,
  }
});
