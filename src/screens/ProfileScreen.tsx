import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, TextInput, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { ProfileService } from '../services/ProfileService';
import { UserProfile } from '../models/UserProfile';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService } from '../services/NotificationService';
import { legalLinks } from '../constants/legal';

import { DataLoader } from '../data/DataLoader';
import packageJson from '../../package.json';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [stats, setStats] = useState<{ [key: string]: number }>({});
  
  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    ProfileService.getProfile().then(p => {
      if (p) {
        setProfile(p);
        setNotifications(p.notificationsEnabled ?? true);
      }
    });
    
    // Load stats
    DataLoader.loadAllFlashcards().then(cards => {
       const counts: {[key: string]: number} = {};
       cards.forEach(c => {
           const cat = c.category.toLowerCase();
           counts[cat] = (counts[cat] || 0) + 1;
           // Secondary?
           c.secondaryCategories?.forEach(sc => {
               const scat = sc.toLowerCase();
               counts[scat] = (counts[scat] || 0) + 1;
           });
       });
       setStats(counts);
    });
  }, []);

  const openEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = async () => {
    if (!profile || !editingField) return;
    
    // Construct updated profile
    // Note: for simpler code, I will map field names to profile keys carefully
    // But since keys are specific, I'll switch
    let updated = { ...profile };
    
    switch(editingField) {
        case 'name': updated.name = tempValue; break;
        case 'birthday': updated.birthday = tempValue; break;
        case 'relationshipStage': updated.relationshipStage = tempValue; break;
        case 'relationshipTime': updated.relationshipTime = tempValue; break;
        case 'notificationTime': updated.notificationTime = tempValue; break;
    }

    await ProfileService.saveProfile(updated);
    setProfile(updated);

    if (editingField === 'notificationTime') {
      const applied = await NotificationService.applySettings({
        enabled: updated.notificationsEnabled ?? true,
        time: updated.notificationTime,
        requestPermission: false,
      });

      if (!applied && (updated.notificationsEnabled ?? true)) {
        const disabled = { ...updated, notificationsEnabled: false };
        await ProfileService.saveProfile(disabled);
        setProfile(disabled);
        setNotifications(false);
        Alert.alert(
          "Permissao necessaria",
          "Ative as notificacoes nas configuracoes do sistema para receber lembretes."
        );
      }
    }

    setEditingField(null);
    Alert.alert("Sucesso", "Atualizado com sucesso!");
  };

  const openExternalLink = async (url?: string) => {
    if (!url) {
      Alert.alert("Indisponivel", "Link nao configurado.");
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Erro", "Nao foi possivel abrir o link.");
      return;
    }

    await Linking.openURL(url);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (!profile) {
      setNotifications(value);
      return;
    }

    const applied = await NotificationService.applySettings({
      enabled: value,
      time: profile.notificationTime || '20:00',
      requestPermission: value,
    });

    const updated = { ...profile, notificationsEnabled: value && applied };
    await ProfileService.saveProfile(updated);
    setProfile(updated);
    setNotifications(updated.notificationsEnabled ?? false);

    if (value && !applied) {
      Alert.alert(
        "Permissao necessaria",
        "Ative as notificacoes nas configuracoes do sistema para receber lembretes."
      );
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Apagar dados",
      "Tem certeza que deseja resetar todo o seu progresso?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, apagar", 
          style: "destructive", 
          onPress: async () => {
            await NotificationService.cancelDailyReminder();
            await AsyncStorage.clear();
            Alert.alert("Sucesso", "Dados apagados. O app será reiniciado.", [
              { text: "OK", onPress: () => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                }) 
              }
            ]);
          } 
        }
      ]
    );
  };

  const getStageLabel = (s?: string) => {
    switch(s) {
      case 'casados': return 'Casados';
      case 'noivados': return 'Noivos';
      case 'namorando': return 'Namorando';
      case 'se-conhecendo': return 'Se conhecendo';
      default: return 'Conectados';
    }
  };

  const getTimeLabel = (t?: string) => {
    switch(t) {
      case 'menos-de-6-meses': return 'Recém-juntos';
      case '6-meses-a-2-anos': return 'Em sintonia';
      case '2-a-5-anos': return 'Caminhando juntos';
      case '5-a-10-anos': return 'Base sólida';
      case 'mais-de-10-anos': return 'Vida toda';
      default: return t || 'Sempre';
    }
  };

  const renderFieldItem = (label: string, value: string, fieldKey: string, isSelector = false) => (
    <View style={styles.fieldItem}>
        <View>
            <Text style={styles.fieldItemLabel}>{label}</Text>
            <Text style={styles.fieldItemValue}>{value || 'Não definido'}</Text>
        </View>
        <TouchableOpacity onPress={() => openEdit(fieldKey, isSelector ? (profile as any)[fieldKey] : value)}>
            <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    </View>
  );

  const renderEditModalContent = () => {
      if (!editingField) return null;

      if (editingField === 'relationshipStage') {
          return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
              {['se-conhecendo', 'namorando', 'noivados', 'casados'].map((s) => (
                <TouchableOpacity 
                   key={s} 
                   style={[styles.chip, tempValue === s && styles.chipActive]}
                   onPress={() => setTempValue(s)}
                >
                   <Text style={[styles.chipText, tempValue === s && styles.chipTextActive]}>{getStageLabel(s)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
      }
      
      if (editingField === 'relationshipTime') {
          return (
             <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
              {['menos-de-6-meses', '6-meses-a-2-anos', '2-a-5-anos', '5-a-10-anos', 'mais-de-10-anos'].map((t) => (
                <TouchableOpacity 
                   key={t} 
                   style={[styles.chip, tempValue === t && styles.chipActive]}
                   onPress={() => setTempValue(t)}
                >
                   <Text style={[styles.chipText, tempValue === t && styles.chipTextActive]}>{getTimeLabel(t)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
      }

      if (editingField === 'notificationTime') {
          return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                 {['08:00', '12:00', '16:00', '18:00', '20:00', '22:00'].map((nt) => (
                    <TouchableOpacity 
                      key={nt} 
                      style={[styles.chip, tempValue === nt && styles.chipActive]}
                      onPress={() => setTempValue(nt)}
                    >
                      <Text style={[styles.chipText, tempValue === nt && styles.chipTextActive]}>{nt}</Text>
                    </TouchableOpacity>
                 ))}
            </View>
          );
      }

      // Default text input
      return (
          <TextInput 
              style={styles.modalInput}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder="Digite aqui..."
          />
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
             <Ionicons name="heart" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.profileName}>{profile?.name || 'Nosso Cosmo'}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados do Casal</Text>
            <View style={styles.sectionContent}>
                {renderFieldItem('Nome / Apelido', profile?.name || '', 'name')}
                {renderFieldItem('Aniversário / Data Especial', profile?.birthday || '', 'birthday')}
                {renderFieldItem('Status', getStageLabel(profile?.relationshipStage), 'relationshipStage', true)}
                {renderFieldItem('Tempo Juntos', getTimeLabel(profile?.relationshipTime), 'relationshipTime', true)}
            </View>
        </View>

        <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferências</Text>
              <View style={styles.sectionContent}>
                <View style={styles.settingItem}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
                    <Text style={styles.settingLabel}>Receber Notificações</Text>
                  </View>
                  <Switch 
                    value={notifications} 
                    onValueChange={handleToggleNotifications}
                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                  />
                </View>
                
                {notifications && renderFieldItem('Horário do Lembrete', profile?.notificationTime || '20:00', 'notificationTime', true)}
              </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal e Suporte</Text>
            <View style={styles.sectionContent}>
                <TouchableOpacity
                  style={styles.linkItem}
                  onPress={() => openExternalLink(legalLinks.privacyPolicyUrl)}
                >
                  <Text style={styles.linkText}>Politica de Privacidade</Text>
                  <Ionicons name="open-outline" size={20} color={theme.colors.textLight} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkItem}
                  onPress={() => openExternalLink(legalLinks.termsOfUseUrl)}
                >
                  <Text style={styles.linkText}>Termos de Uso</Text>
                  <Ionicons name="open-outline" size={20} color={theme.colors.textLight} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.linkItem, { borderBottomWidth: 0 }]}
                  onPress={() =>
                    openExternalLink(
                      legalLinks.supportEmail ? `mailto:${legalLinks.supportEmail}` : undefined
                    )
                  }
                >
                  <View>
                    <Text style={styles.linkText}>Contato do suporte</Text>
                    {!!legalLinks.supportEmail && (
                      <Text style={styles.linkSubtext}>{legalLinks.supportEmail}</Text>
                    )}
                  </View>
                  <Ionicons name="mail-outline" size={20} color={theme.colors.textLight} />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o aplicativo</Text>
            <View style={styles.sectionContent}>
                <View style={[styles.fieldItem, {borderBottomWidth:1, borderColor:'#F5F5F5'}]}>
                    <Text style={styles.fieldItemLabel}>Versão</Text>
                    <Text style={styles.fieldItemValue}>{packageJson.version} (Build 1)</Text>
                </View>
                
                <View style={{padding: 16}}>
                    <Text style={[styles.fieldItemLabel, {marginBottom: 8}]}>Perguntas Disponíveis:</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                        {Object.entries(stats).map(([key, count]) => {
                             if (!key) return null;
                             // Pretty key
                             const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
                             return (
                                 <View key={key} style={styles.statChip}>
                                     <Text style={styles.statChipText}>{label}: {count}</Text>
                                 </View>
                             );
                        })}
                    </View>
                </View>
            </View>
        </View>

        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleClearData}
        >
          <Text style={styles.dangerButtonText}>Apagar todos os dados e resetar app</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Feito com ❤️ para o amor</Text>
      </ScrollView>

      <Modal
        visible={!!editingField}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditingField(null)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Informação</Text>
                
                <View style={styles.modalBody}>
                    {renderEditModalContent()}
                </View>

                <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.modalCancel} onPress={() => setEditingField(null)}>
                        <Text style={styles.modalCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalSave} onPress={saveEdit}>
                        <Text style={styles.modalSaveText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
  scrollContent: {
    padding: theme.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.m,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  profileStatus: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
    marginBottom: theme.spacing.m,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.s,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  infoBox: {
    padding: theme.spacing.m,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  infoValue: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  editSection: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  fieldLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dangerButton: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    opacity: 0.5,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  chipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  linkSubtext: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  fieldItemLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  fieldItemValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: theme.spacing.l,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalCancel: {
    padding: 10,
  },
  modalCancelText: {
    color: theme.colors.textLight,
    fontSize: 16,
  },
  modalSave: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modalSaveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statChip: {
      backgroundColor: '#F5F5F5',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
  },
  statChipText: {
      fontSize: 12,
      color: theme.colors.textLight,
  },
});
