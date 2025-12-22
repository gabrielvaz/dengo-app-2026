import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Share, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Flashcard as FlashcardModel } from '../models/Flashcard';
import { FavoriteService } from '../services/FavoriteService';

const { width, height } = Dimensions.get('window');

interface FlashcardProps {
  card: FlashcardModel;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    FavoriteService.isFavorite(card.id).then(setIsFavorite);
  }, [card.id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Oi amor! Vi esse card no Dengo e lembrei de você:\n\n"${card.question}"\n\nO que você acha? ❤️`,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const toggleFavorite = async () => {
    const newVal = await FavoriteService.toggleFavorite(card);
    setIsFavorite(newVal);
    if (newVal) {
        Alert.alert("Dengo", "Pergunta salva no Baú do Amor");
    }
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF0F5', '#FFE4E1']}
        style={styles.gradient}
      >
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={32} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{card.category.toUpperCase()}</Text>
          </View>
          
          <Text style={styles.title}>{card.title}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.question}>{card.question}</Text>
          

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(128, 0, 32, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: theme.spacing.m,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.l,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.accent,
    marginBottom: theme.spacing.xl,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: 'serif',
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.s,
  },
  infoTag: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: theme.spacing.xl,
    gap: 8,
  },
  shareText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
