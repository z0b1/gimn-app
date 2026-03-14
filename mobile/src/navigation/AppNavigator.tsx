import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import VestiScreen from '../screens/VestiScreen';
import GlasanjeScreen from '../screens/GlasanjeScreen';
import FeedScreen from '../screens/FeedScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gimn App' }} />
        <Stack.Screen name="Vesti" component={VestiScreen} options={{ title: 'Vesti' }} />
        <Stack.Screen name="Glasanje" component={GlasanjeScreen} options={{ title: 'Glasanje' }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Gimnazija Feed' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
