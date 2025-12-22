import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { InterestScreen } from './src/screens/InterestScreen';
import { MainTabs } from './src/navigation/MainTabs';
import { FeedScreen } from './src/screens/FeedScreen';
import { EloDetailScreen } from './src/screens/EloDetailScreen';
import { EloLessonScreen } from './src/screens/EloLessonScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ProfileService } from './src/services/ProfileService';
import { NotificationService } from './src/services/NotificationService';
import { theme } from './src/constants/theme';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string>('Welcome');

  useEffect(() => {
    async function checkState() {
      try {
        await NotificationService.configure();
        const profile = await ProfileService.getProfile();
        // If profile exists, user completed onboarding => Main
        // If profile doesn't exist, check if we started onboarding? No, just Welcome.
        if (profile) {
          await NotificationService.syncFromProfile(profile);
          setInitialRoute('Main');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    checkState();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Interests" component={InterestScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="EloDetail" component={EloDetailScreen} />
          <Stack.Screen name="EloLesson" component={EloLessonScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
