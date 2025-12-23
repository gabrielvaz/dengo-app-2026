import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { FavoriteService } from '../services/FavoriteService';
import { Flashcard as FlashcardModel } from '../models/Flashcard';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export const BauScreen = () => {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<FlashcardModel[]>([]);

  const loadFavorites = useCallback(async () => {
    const favs = await FavoriteService.getFavorites();
    setFavorites(favs);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const removeFavorite = async (card: FlashcardModel) => {
    Alert.alert(
      "Remover do Baú",
      "Tem certeza que deseja remover este momento dos seus favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive", 
          onPress: async () => {
             await FavoriteService.toggleFavorite(card);
             loadFavorites();
          }
        }
      ]
    );
  };

  const handleShare = async (item: FlashcardModel) => {
    try {
      await Share.share({
        message: `Oi amor! Lembrei de nós com essa pergunta do Dengo:\n\n"${item.question}"\n\n❤️`,
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: FlashcardModel }) => (
    <View style={styles.cardItem}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{item.category}</Text>
        <View style={{flexDirection: 'row', gap: 15}}>
             <TouchableOpacity onPress={() => handleShare(item)}>
               <Ionicons name="share-social-outline" size={22} color={theme.colors.textLight} />
             </TouchableOpacity>
             <TouchableOpacity onPress={() => removeFavorite(item)}>
               <Ionicons name="heart" size={24} color={theme.colors.primary} />
             </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.question}>{item.question}</Text>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
            <View style={{marginBottom: 20}}>
               <Image 
                 source={require('../../assets/images/bau.png')} 
                 style={{width: 200, height: 200, resizeMode: 'contain'}} 
               />
            </View>
          <Text style={styles.emptyTitle}>Seu Baú está vazio</Text>
          <Text style={styles.emptySubtitle}>
            Ainda não há favoritos aqui. Explore as perguntas e salve as que tocarem seu coração!
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Perguntas')}
          >
              <Text style={styles.exploreButtonText}>Explorar Perguntas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Baú do Amor</Text>
        <Text style={styles.subtitle}>{favorites.length} momentos guardados</Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    ...theme.typography.header,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  list: {
    padding: theme.spacing.m,
  },
  cardItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  question: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.l,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.s,
    lineHeight: 24,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  exploreButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: theme.spacing.xl,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
