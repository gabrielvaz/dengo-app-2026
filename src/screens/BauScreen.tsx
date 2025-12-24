import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { FavoriteService } from '../services/FavoriteService';
import { Flashcard as FlashcardModel } from '../models/Flashcard';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Modal, TouchableWithoutFeedback } from 'react-native';

export const BauScreen = () => {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<FlashcardModel[]>([]);
  const [selectedCard, setSelectedCard] = useState<FlashcardModel | null>(null);

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
        message: `Oi amor! Lembrei de nós com essa pergunta do Cosmo:\n\n"${item.question}"`,
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleCopy = async () => {
      if (selectedCard) {
          await Clipboard.setStringAsync(selectedCard.question);
          setSelectedCard(null);
          Alert.alert("Sucesso", "Copiado para a área de transferência!");
      }
  };

  const handleRemove = async () => {
      if (selectedCard) {
          Alert.alert(
            "Remover",
            "Remover esta pergunta do Baú?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", style: "destructive", onPress: async () => {
                    await FavoriteService.toggleFavorite(selectedCard);
                    loadFavorites();
                    setSelectedCard(null);
                }}
            ]
          );
      }
  };

  const handleShareSelected = async () => {
      if (selectedCard) {
          handleShare(selectedCard);
          setSelectedCard(null);
      }
  };

  const renderItem = ({ item }: { item: FlashcardModel }) => (
    <TouchableOpacity 
      style={styles.cardItem}
      onLongPress={() => setSelectedCard(item)}
      activeOpacity={0.8}
    >
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
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
            <View style={{marginBottom: 20}}>
               <Image 
                 source={require('../../assets/images/bau-transp.png')} 
                 style={{width: 200, height: 200, resizeMode: 'contain'}} 
               />
            </View>
          <Text style={styles.emptyTitle}>Seu Baú está vazio</Text>
          <Text style={styles.emptySubtitle}>
            Ainda não há lembranças aqui. Explore o Cosmo e salve as perguntas que criarem maior conexão entre vocês!
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
        <Text style={styles.title}>Baú do Cosmo</Text>
        <Text style={styles.subtitle}>{favorites.length} momentos estelares guardados</Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={!!selectedCard}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedCard(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedCard(null)}>
            <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Opções</Text>
            
            <TouchableOpacity style={styles.sheetOption} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={24} color={theme.colors.text} />
                <Text style={styles.sheetOptionText}>Copiar para a área de transferência</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handleShareSelected}>
                <Ionicons name="share-social-outline" size={24} color={theme.colors.text} />
                <Text style={styles.sheetOptionText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sheetOption, { borderBottomWidth: 0 }]} onPress={handleRemove}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                <Text style={[styles.sheetOptionText, { color: '#FF3B30' }]}>Remover do baú</Text>
            </TouchableOpacity>
            
            <View style={{height: 20}} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    ...theme.typography.h2,
    color: '#FFFFFF',
  },
  subtitle: {
    ...theme.typography.body,
    marginTop: 4,
  },
  list: {
    padding: theme.spacing.m,
  },
  cardItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  category: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  question: {
    ...theme.typography.body,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: '#FFFFFF',
    marginTop: theme.spacing.l,
  },
  emptySubtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    marginTop: theme.spacing.s,
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: theme.spacing.xl * 1.5,
  },
  exploreButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: theme.spacing.l,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
  },
  sheetHandle: {
      width: 40,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
  },
  sheetTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
  },
  sheetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      gap: 16,
  },
  sheetOptionText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
  }
});
