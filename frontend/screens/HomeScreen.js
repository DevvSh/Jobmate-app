import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [resumeProgress] = useState(60); // Mock progress
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.starIcon}>
              <Ionicons name="star" size={16} color="#7B68EE" />
            </View>
            <Text style={styles.headerTitle}>Starplan</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileAvatar} 
            onPress={() => navigation.navigate('ProfileStack')}
          >
            <View style={styles.avatarImage}>
              <Text style={styles.avatarText}>👩‍💼</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.headlineText}>Let me help you</Text>
          <Text style={styles.headlineText}>craft your <Text style={styles.boldText}>resume</Text></Text>
        </View>

        {/* AI Resume Builder Card */}
        <TouchableOpacity 
          style={styles.aiCard} 
          onPress={() => navigation.navigate('AI')}
        >
          <View style={styles.aiCardHeader}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>AI</Text>
            </View>
            <View style={styles.aiCardContent}>
              <Text style={styles.aiCardTitle}>Have a conversation with AI</Text>
              <Text style={styles.aiCardSubtitle}>to build your resume</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Resume Progress: {resumeProgress}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${resumeProgress}%` }]} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Find your dream job section */}
        <Text style={styles.dreamJobTitle}>Find your dream job</Text>
        
        {/* Current Job Offers Button */}
        <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <View style={styles.buttonIcon}>
              <Ionicons name="briefcase" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.buttonText}>Current job offers</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* My Applications Button */}
        <TouchableOpacity onPress={() => navigation.navigate('ApplicationsStack')}>
          <LinearGradient
            colors={['#7C3AED', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradientButton, styles.lastButton]}
          >
            <View style={styles.buttonIcon}>
              <Ionicons name="document" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.buttonText}>My Applications</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 20,
  },
  headlineSection: {
    marginBottom: 30,
  },
  headlineText: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 34,
    color: '#1F2937',
  },
  boldText: {
    fontWeight: '700',
  },
  aiCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  aiCardContent: {
    flex: 1,
  },
  aiCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  aiCardSubtitle: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '500',
  },
  progressSection: {
    marginTop: 20,
  },
  progressLabel: {
    fontSize: 15,
    color: '#1E40AF',
    marginBottom: 10,
    fontWeight: '600',
  },
  progressBarContainer: {
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    height: 10,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#E0F2FE',
    height: '100%',
    borderRadius: 10,
  },
  progressFill: {
    backgroundColor: '#0EA5E9',
    height: '100%',
    borderRadius: 10,
  },
  dreamJobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  gradientButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  lastButton: {
    marginBottom: 30,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 12,
  },
});

export default HomeScreen;