import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const TermsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Termos de Uso</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Última atualização: 24 de Dezembro de 2024</Text>
        
        <Text style={styles.paragraph}>
          Bem-vindo ao Cosmo! Estes Termos de Uso regem o acesso e a utilização do nosso aplicativo. Ao acessar ou usar o Cosmo, você concorda em cumprir estes termos.
        </Text>

        <Text style={styles.heading}>1. Uso do Aplicativo</Text>
        <Text style={styles.paragraph}>
          O Cosmo é uma ferramenta projetada para ajudar casais a fortalecerem sua conexão através de perguntas diárias e trilhas de conhecimento. O uso é estritamente pessoal e não comercial.
        </Text>

        <Text style={styles.heading}>2. Privacidade e Dados</Text>
        <Text style={styles.paragraph}>
          Respeitamos sua privacidade. Todos os dados inseridos no aplicativo (nomes, datas, respostas) são armazenados localmente no seu dispositivo. Não coletamos, vendemos ou compartilhamos suas informações pessoais com terceiros.
        </Text>

        <Text style={styles.heading}>3. Propriedade Intelectual</Text>
        <Text style={styles.paragraph}>
          Todo o conteúdo do Cosmo, incluindo textos, gráficos, logotipos e perguntas, é de propriedade exclusiva do Cosmo ou de seus licenciadores e é protegido pelas leis de direitos autorais.
        </Text>

        <Text style={styles.heading}>4. Isenção de Responsabilidade</Text>
        <Text style={styles.paragraph}>
          O Cosmo oferece sugestões para melhorar o relacionamento, mas não substitui aconselhamento profissional, terapia de casal ou assistência médica. O uso das sugestões é de sua inteira responsabilidade.
        </Text>

        <Text style={styles.heading}>5. Alterações nos Termos</Text>
        <Text style={styles.paragraph}>
          Podemos atualizar estes Termos de Uso periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer alterações.
        </Text>

        <Text style={styles.heading}>6. Contato</Text>
        <Text style={styles.paragraph}>
          Se você tiver dúvidas sobre estes Termos, entre em contato conosco através do suporte no aplicativo.
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
