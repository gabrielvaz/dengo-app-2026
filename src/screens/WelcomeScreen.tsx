import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(0.8);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    flameOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.6, { duration: 800 })
      ),
      -1,
      true
    );
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF5722', '#FF8A65', '#FF7043']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <View style={styles.animationContainer}>
            {/* Flame Layer */}
            <Animated.View style={[styles.flameContainer, flameStyle]}>
               <Ionicons name="flame" size={180} color="#FFEB3B" />
            </Animated.View>
            
            {/* Heart Layer */}
            <Animated.View style={[styles.heartContainer, heartStyle]}>
               <Ionicons name="heart" size={140} color="#D84315" />
            </Animated.View>
        </View>

        <Animated.Text entering={FadeInUp.delay(500).duration(1000)} style={styles.title}>
          Dengo
        </Animated.Text>
        
        <Animated.Text entering={FadeInUp.delay(700).duration(1000)} style={styles.subtitle}>
          Acenda a chama da sua conexão diária.
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(1000).duration(1000)} style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Onboarding')}
          >
            <Text style={styles.buttonText}>Começar Jornada</Text>
            <Ionicons name="arrow-forward" size={24} color="#FF5722" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  animationContainer: {
    width: 200,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  flameContainer: {
    position: 'absolute',
    top: -30,
    zIndex: 1,
  },
  heartContainer: {
    zIndex: 2,
    marginTop: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: theme.spacing.s,
    fontFamily: 'serif',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: theme.spacing.xl * 2,
    lineHeight: 28,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 35,
    width: '85%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#FF5722',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
