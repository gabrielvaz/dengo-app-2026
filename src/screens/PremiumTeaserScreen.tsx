import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const PremiumTeaserScreen = () => {
  const navigation = useNavigation();

  const handleInterest = () => {
    Alert.alert(
      "Agradecemos o interesse!",
      "Estamos preparando algo muito especial para vocês. Avisaremos assim que o Cosmo Ultra estiver disponível!",
      [{ text: "OK" }]
    );
  };

  const BENEFITS = [
    {
      icon: "infinite",
      title: "Perguntas Ilimitadas",
      description: "Acesse todo o acervo do Cosmo sem limites diários. Explore qualquer tema a qualquer momento."
    },
    {
      icon: "stats-chart",
      title: "Insights Profundos",
      description: "Análises detalhadas sobre a evolução da conexão de vocês e áreas de maior sinergia."
    },
    {
      icon: "star",
      title: "Desafios Exclusivos",
      description: "Missões semanais criadas por terapeutas para fortalecer laços específicos do relacionamento."
    },
    {
      icon: "color-palette",
      title: "Personalização Total",
      description: "Temas customizados, ícones de aplicativo e cores exclusivas para o seu Cosmo."
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
        </View>

        <View style={styles.heroContainer}>
            <LinearGradient
                colors={['#FF7F50', '#FF4500']}
                style={styles.iconBackground}
            >
                <Ionicons name="diamond-outline" size={60} color="white" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Cosmo Ultra</Text>
            <Text style={styles.heroSubtitle}>Leve a conexão de vocês para uma nova dimensão.</Text>
        </View>

        <View style={styles.benefitsContainer}>
            {BENEFITS.map((b, index) => (
                <View key={index} style={styles.benefitItem}>
                    <View style={styles.benefitIconBox}>
                        <Ionicons name={b.icon as any} size={24} color={theme.colors.primary} />
                    </View>
                    <View style={styles.benefitText}>
                        <Text style={styles.benefitTitle}>{b.title}</Text>
                        <Text style={styles.benefitDesc}>{b.description}</Text>
                    </View>
                </View>
            ))}
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>

      <View style={styles.footer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleInterest}>
              <Text style={styles.ctaText}>Tenho interesse</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.disclaimer}>Em breve. Seja o primeiro a saber.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#FF7F50',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
  },
  benefitsContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    gap: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 20,
  },
  benefitIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 127, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 127, 80, 0.2)',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  benefitDesc: {
    fontSize: 14,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
  footerSpacing: {
      height: 40,
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(15, 14, 23, 0.95)',
      padding: 30,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
  },
  ctaButton: {
      backgroundColor: theme.colors.primary,
      width: '100%',
      paddingVertical: 18,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
  },
  ctaText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
  disclaimer: {
      color: theme.colors.textLight,
      fontSize: 12,
      marginTop: 15,
  }
});
