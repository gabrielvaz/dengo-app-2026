import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

import { StreaksScreen } from '../screens/StreaksScreen';
import { StreakService } from '../services/StreakService';
import { ElosScreen } from '../screens/ElosScreen';
import { QuestionCategoriesScreen } from '../screens/QuestionCategoriesScreen';
import { BauScreen } from '../screens/BauScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const [initialRoute, setInitialRoute] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkStatus = async () => {
        const streak = await StreakService.getStreakData();
        if (streak.currentStreak === 0) {
            setInitialRoute('Streaks');
        } else {
            setInitialRoute('Perguntas');
        }
    };
    checkStatus();
  }, []);

  if (!initialRoute) return null;

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Streaks') {
            iconName = focused ? 'planet' : 'planet-outline';
          } else if (route.name === 'Elos') {
            iconName = focused ? 'infinite' : 'infinite-outline';
          } else if (route.name === 'Perguntas') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Bau') {
            iconName = focused ? 'archive' : 'archive-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#A09FA6',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.secondary,
          height: 85,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Streaks" component={StreaksScreen} options={{ tabBarLabel: 'Cosmo' }} />
      <Tab.Screen name="Elos" component={ElosScreen} options={{ tabBarLabel: 'Elos' }} />
      <Tab.Screen name="Perguntas" component={QuestionCategoriesScreen} options={{ tabBarLabel: 'Perguntas' }} />
      <Tab.Screen name="Bau" component={BauScreen} options={{ tabBarLabel: 'Baú' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
};
