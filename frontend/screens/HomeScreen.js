import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Sidebar with features */}
        <View style={styles.sidebar}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Jobmate</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.sidebarItem} 
            onPress={() => navigation.navigate('ResumeUpload')}
          >
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>Upload Resume</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sidebarItem} 
            onPress={() => navigation.navigate('Chat')}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>Create with AI</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sidebarItem} 
            onPress={() => navigation.navigate('JobMatch')}
          >
            <Ionicons name="briefcase-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>Job Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sidebarItem} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>My Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main content area - ChatGPT-like interface */}
        <View style={styles.contentArea}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>How may I help you today?</Text>
            <Text style={styles.welcomeSubtitle}>Ask me anything about job applications, resume building, or career advice</Text>
          </View>
          
          {/* Chat input area - centered like ChatGPT */}
          <View style={styles.chatInputWrapper}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Type your message here..."
                placeholderTextColor="#8A8A8A"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2C', // Dark blue background
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#0F1623', // Darker blue for sidebar
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B68EE', // Exotic purple-blue color
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sidebarText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  contentArea: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  chatInputWrapper: {
    width: '100%',
    maxWidth: 768,
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#B0B0B0',
    textAlign: 'center',
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 25,
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4A5568',
    width: '100%',
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#7B68EE', // Matching exotic color
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;