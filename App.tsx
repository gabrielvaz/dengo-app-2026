import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { View, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { InterestScreen } from './src/screens/InterestScreen';
import { MainTabs } from './src/navigation/MainTabs';
import { FeedScreen } from './src/screens/FeedScreen';
import { EloDetailScreen } from './src/screens/EloDetailScreen';
import { EloLessonScreen } from './src/screens/EloLessonScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { PremiumTeaserScreen } from './src/screens/PremiumTeaserScreen';
import { ProfileService } from './src/services/ProfileService';
import { NotificationService } from './src/services/NotificationService';
import { theme } from './src/constants/theme';

// Keep the splash screen visible while we fetch resources
// Splash Screen Config
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string>('Welcome');

  const cacheImages = async (images: any[]) => {
    return Promise.all(
      images.map(image => {
        if (typeof image === 'string') {
          return Image.prefetch(image);
        } else {
          return Asset.fromModule(image).downloadAsync();
        }
      })
    );
  };

  useEffect(() => {
    async function prepare() {
      try {
        const imageAssets = cacheImages([
            require('./assets/images/hero_cosmo.jpg'),
            require('./assets/images/bau-transp.png'),
        ]);

        await Promise.all([
             NotificationService.configure(),
             imageAssets,
        ]);

        const profile = await ProfileService.getProfile();
        if (profile) {
          await NotificationService.syncFromProfile(profile);
          setInitialRoute('Main');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we do this, it is invisible.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="PremiumTeaser" component={PremiumTeaserScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
