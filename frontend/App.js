import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Import screens
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ResumeScreen from './screens/ResumeScreen';
import JobMatchScreen from './screens/JobMatchScreen';
import ProfileScreen from './screens/ProfileScreen';
import TemplateSelectionScreen from './screens/TemplateSelectionScreen';
import ApplicationsScreen from './screens/ApplicationsScreen';
import DocumentsScreen from './screens/DocumentsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation theme will be created dynamically based on current theme

// Home stack for nested navigation
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
      />
    </Stack.Navigator>
  );
}

// Resume stack
function ResumeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="Resume" 
        component={ResumeScreen} 
      />
    </Stack.Navigator>
  );
}

// Documents stack
function DocumentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="Documents" 
        component={DocumentsScreen} 
      />
    </Stack.Navigator>
  );
}

// Chat stack
function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
      />
    </Stack.Navigator>
  );
}

// Jobs stack
function JobsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="JobMatchScreen" 
        component={JobMatchScreen} 
      />
    </Stack.Navigator>
  );
}

// Profile stack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
      />
    </Stack.Navigator>
  );
}

// Applications stack
function ApplicationsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="ApplicationsScreen" 
        component={ApplicationsScreen} 
      />
    </Stack.Navigator>
  );
}

// Enable screens for better navigation performance
enableScreens();

function AppContent() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { theme } = useTheme();

  // Create navigation theme based on current theme
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null; // This is the 'splash' screen
  } else if (isFirstLaunch === true) {
    return (
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style={theme.statusBar} />
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <MainTabNavigator />
        </NavigationContainer>
        <StatusBar style={theme.statusBar} />
      </SafeAreaProvider>
    );
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function MainTabNavigator() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="ApplicationsStack" component={ApplicationsStack} />
      <Stack.Screen name="ResumeStack" component={ResumeStack} />
      <Stack.Screen name="TemplateSelection" component={TemplateSelectionScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Docs') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.tabBarBorder,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="AI" component={ChatStack} />
      <Tab.Screen name="Docs" component={DocumentsStack} />
    </Tab.Navigator>
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