import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { EloProgressService } from '../services/EloProgressService';
import { TipSection } from '../models/Tip';

export const EloLessonScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { lesson, eloId, order } = route.params; // lesson is type TipSection (Article)

  const [scrolledHandlers, setScrolledHandlers] = useState(false);

  const handleComplete = async () => {
    await EloProgressService.markLessonCompleted(eloId, order);
    Alert.alert("Parabéns!", "Lição concluída com sucesso. Amanhã tem mais!", [
        { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.titulo || 'Lição'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
                // Enable button if we want to enforce scrolling
            }
        }}
        scrollEventThrottle={400}
      >
        <Text style={styles.title}>{lesson.title}</Text>
        
        {/* Placeholder for rich content if format is complex, assuming text array or string */}
        <View style={styles.bodyContainer}>
             {/* Render Sections if available */}
             {lesson.secoes && Array.isArray(lesson.secoes) ? (
                 lesson.secoes.map((section: any, index: number) => (
                     <View key={index} style={{ marginBottom: 16 }}>
                         {section.titulo && <Text style={styles.sectionTitle}>{section.titulo}</Text>}
                         <Text style={styles.bodyText}>
                             {section.blocos && Array.isArray(section.blocos) 
                                ? section.blocos.join('\n\n') 
                                : section.conteudo}
                         </Text>
                     </View>
                 ))
             ) : (
                 <Text style={styles.bodyText}>
                    {Array.isArray(lesson.content) ? lesson.content.join('\n\n') : (lesson.content || "Conteúdo indisponível.")}
                 </Text>
             )}
        </View>

        <TouchableOpacity style={[styles.completeButton, { backgroundColor: route.params?.color || theme.colors.primary }]} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Marcar como concluído</Text>
            <Ionicons name="checkmark-circle" size={24} color="white" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.xl * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.l,
    fontFamily: 'serif',
  },
  bodyContainer: {
    marginBottom: theme.spacing.xl,
  },
  bodyText: {
    fontSize: 18,
    color: theme.colors.text,
    lineHeight: 28,
    textAlign: 'justify',
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    gap: 8,
    marginTop: theme.spacing.l,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
  },
});
