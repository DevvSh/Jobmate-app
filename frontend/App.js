import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ResumeUploadScreen from './screens/ResumeUploadScreen';
import JobMatchScreen from './screens/JobMatchScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

// Create a custom dark theme
const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7B68EE',
    background: '#1A1F2C',
    card: '#0F1623',
    text: '#FFFFFF',
    border: '#2D3748',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F1623',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: '#1A1F2C' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Jobmate' }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'AI Assistant' }} 
        />
        <Stack.Screen 
          name="ResumeUpload" 
          component={ResumeUploadScreen} 
          options={{ title: 'Upload Resume' }} 
        />
        <Stack.Screen 
          name="JobMatch" 
          component={JobMatchScreen} 
          options={{ title: 'Job Matches' }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'My Profile' }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});