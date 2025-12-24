import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { theme } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/hero_cosmo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(15, 14, 23, 0.8)', '#0F0E17']}
          style={styles.gradient}
        />
        
        <View style={styles.content}>
          <View style={{ flex: 1 }} />

          <Animated.View entering={FadeInUp.delay(300).duration(1000)} style={styles.logoContainer}>
            <Image 
                source={require('../../assets/images/cosmo_logo.png')} 
                style={styles.logo}
                resizeMode="contain"
            />
          </Animated.View>
          
          <Animated.Text entering={FadeInUp.delay(500).duration(800)} style={styles.subtitle}>
            Acenda a chama da sua conexão diária.
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text style={styles.buttonText}>Começar Jornada</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingBottom: 60,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: 40,
  },
  logo: {
    width: width * 0.7,
    height: 100,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: theme.spacing.xl * 2,
    lineHeight: 26,
    fontWeight: '500',
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 35,
    width: '90%',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
