import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { InterestScreen } from './src/screens/InterestScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { ProfileService } from './src/services/ProfileService';
import { theme } from './src/constants/theme';

const Stack = createNativeStackNavigator();

import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  // ... rest of the state



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

          <Stack.Screen name="Onboarding" component={OnboardingScreen} />

          <Stack.Screen name="Interests" component={InterestScreen} />

          <Stack.Screen name="Feed" component={FeedScreen} />

        </Stack.Navigator>

        <StatusBar style="auto" />

      </NavigationContainer>

    </GestureHandlerRootView>

  );

}
