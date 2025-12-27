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
  onSave?: () => void;
}

const FlashcardComponent: React.FC<FlashcardProps> = ({ card, onSave }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    FavoriteService.isFavorite(card.id).then(setIsFavorite);
  }, [card.id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Oi amor! Vi esse card no Cosmo e lembrei de você:\n\n"${card.question}"\n\nO que você acha?`,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const toggleFavorite = async () => {
    const newVal = await FavoriteService.toggleFavorite(card);
    setIsFavorite(newVal);
    if (newVal) {
        if (onSave) onSave();
        // Removed Alert to use custom animation/toast
    }
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#3B2E47', '#1E1B26']}
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
    width: width * 0.90,
    height: height * 0.70,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3D3847', // Subtle border
  },
  gradient: {
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 127, 80, 0.15)', // Orange tint
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: theme.spacing.l,
    borderWidth: 1,
    borderColor: 'rgba(255, 127, 80, 0.3)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  title: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.5,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: theme.spacing.xl,
  },
  question: {
    ...theme.typography.h2,
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'serif',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.s,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: theme.spacing.xxl,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export const Flashcard = React.memo(FlashcardComponent, (prevProps, nextProps) => {
  return prevProps.card.id === nextProps.card.id;
});
