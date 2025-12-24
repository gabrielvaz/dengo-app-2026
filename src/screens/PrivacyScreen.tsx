import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const PrivacyScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Política de Privacidade</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Última atualização: 24 de Dezembro de 2024</Text>
        
        <Text style={styles.paragraph}>
          Sua privacidade é nossa prioridade. Esta Política de Privacidade descreve como o Cosmo lida com suas informações.
        </Text>

        <Text style={styles.heading}>1. Coleta de Dados</Text>
        <Text style={styles.paragraph}>
          O Cosmo opera com um modelo "Privacy First". Não exigimos a criação de conta online. Os dados que você insere (como status de relacionamento, data de início e preferências de notificação) são armazenados localmente no seu dispositivo.
        </Text>

        <Text style={styles.heading}>2. Uso das Informações</Text>
        <Text style={styles.paragraph}>
          Utilizamos os dados armazenados localmente apenas para personalizar sua experiência no aplicativo, como calcular o tempo de relacionamento e enviar notificações nos horários escolhidos.
        </Text>

        <Text style={styles.heading}>3. Compartilhamento de Dados</Text>
        <Text style={styles.paragraph}>
          Nós NÃO compartilhamos, vendemos ou alugamos suas informações pessoais para terceiros. Seus momentos e reflexões permanecem no seu aparelho.
        </Text>

        <Text style={styles.heading}>4. Segurança</Text>
        <Text style={styles.paragraph}>
          Embora operemos offline na maior parte das funções, recomendamos que você mantenha seu dispositivo seguro e protegido por senha/biometria para impedir o acesso não autorizado aos seus dados do Cosmo.
        </Text>

        <Text style={styles.heading}>5. Exclusão de Dados</Text>
        <Text style={styles.paragraph}>
          Você pode excluir todos os seus dados a qualquer momento através da opção "Apagar todos os dados e resetar app" nas configurações do perfil. Isso removerá permanentemente todas as informações do seu dispositivo.
        </Text>

        <Text style={styles.heading}>6. Contato</Text>
        <Text style={styles.paragraph}>
          Para quaisquer dúvidas relacionadas à privacidade, por favor, entre em contato através das configurações do aplicativo.
        </Text>

        <View style={{height: 40}} />
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
    alignItems: 'center',
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.l,
  },
  lastUpdated: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 10,
  }
});
