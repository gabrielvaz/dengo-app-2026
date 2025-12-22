import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

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
  const [timeSliderValue, setTimeSliderValue] = useState(0);
  const [notifTime, setNotifTime] = useState<string | null>(null);

  const NOTIF_TIMES = [
    { id: '08:00', label: 'Começar o dia (08h)' },
    { id: '12:00', label: 'Almoço (12h)' },
    { id: '18:00', label: 'Final da tarde (18h)' },
    { id: '20:00', label: 'Noite (20h)' },
    { id: '22:00', label: 'Tarde da noite (22h)' },
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
    } else if (step === 2 && notifTime) {
      try {
        await AsyncStorage.setItem('user_profile_temp', JSON.stringify({ 
            relationshipStage: stage, 
            relationshipTime: time || getTimeLabel(timeSliderValue),
            notificationTime: notifTime,
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
      return 'Qual o melhor horário para recadinhos?';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Dengo</Text>
          
          {step === 0 && (
              <Image 
                source={require('../../assets/images/casal-apaixonado.png')} 
                style={styles.headerImage}
              />
          )}

          {step === 1 && (
              <Image 
                source={require('../../assets/images/casal-junto-2.png')} 
                style={styles.headerImage}
              />
          )}

          {step === 2 && (
              <Image 
                source={require('../../assets/images/maquina-de-sonhos-2.png')} 
                style={styles.headerImage}
              />
          )}

          <Text style={styles.subtitle}>
            {getHeaderTitle()}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {step === 0 && (
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
             NOTIF_TIMES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.optionButton, notifTime === item.id && styles.optionButtonSelected]}
                onPress={() => setNotifTime(item.id)}
              >
                <Text style={[styles.optionText, notifTime === item.id && styles.optionTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, ((step === 0 && !stage) || (step === 2 && !notifTime)) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={(step === 0 && !stage) || (step === 2 && !notifTime)}
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
  headerImage: {
      width: 250,
      height: 180,
      resizeMode: 'contain',
      marginBottom: theme.spacing.m,
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
