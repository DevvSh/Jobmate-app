import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: 'Welcome',
      subtitle: '',
      showStars: true,
      showButtons: true,
      isFirstStep: true
    },
    {
      title: 'Welcome',
      subtitle: '',
      showStars: true,
      showButtons: true,
      isSecondStep: true
    }
  ];

  const handleJobSeeker = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.replace('Main');
    }
  };

  const handleEmployer = () => {
    navigation.replace('Main');
  };

  const handleSocialLogin = () => {
    navigation.replace('Main');
  };

  const renderStars = () => {
    const stars = [];
    const starPositions = [
      { top: 80, left: 60, size: 20, color: '#9F7AEA' },
      { top: 120, right: 80, size: 16, color: '#7B68EE' },
      { top: 200, left: 40, size: 14, color: '#A78BFA' },
      { top: 250, right: 60, size: 18, color: '#8B5CF6' },
      { top: 320, left: 80, size: 12, color: '#9F7AEA' },
      { top: 380, right: 40, size: 16, color: '#7B68EE' },
      { top: 450, left: 50, size: 14, color: '#A78BFA' },
      { top: 500, right: 70, size: 20, color: '#8B5CF6' },
    ];

    starPositions.forEach((star, index) => {
      stars.push(
        <View
          key={index}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              right: star.right,
            }
          ]}
        >
          <Ionicons name="star" size={star.size} color={star.color} />
        </View>
      );
    });

    return stars;
  };

  const renderGreenShapes = () => {
    if (currentStep !== 0) return null;
    
    return (
      <>
        <View style={styles.greenShape1} />
        <View style={styles.greenShape2} />
        <View style={styles.greenShape3} />
      </>
    );
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {currentStepData.showStars && renderStars()}
      {renderGreenShapes()}
      
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentStepData.title}</Text>
          {currentStepData.subtitle && (
            <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {currentStepData.isFirstStep && (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleJobSeeker}>
                <Text style={styles.primaryButtonText}>I'm a Job seeker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleEmployer}>
                <Text style={styles.secondaryButtonText}>I'm an Employer</Text>
              </TouchableOpacity>
            </>
          )}
          
          {currentStepData.isSecondStep && (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSocialLogin}>
                <Text style={styles.primaryButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSocialLogin}>
                <Text style={styles.secondaryButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSocialLogin}>
                <Text style={styles.secondaryButtonText}>Continue with Email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2D3748',
    lineHeight: 56,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7B68EE',
    lineHeight: 24,
    marginTop: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#7B68EE',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '500',
  },
  star: {
    position: 'absolute',
    zIndex: 1,
  },
  greenShape1: {
    position: 'absolute',
    top: 100,
    left: -20,
    width: 120,
    height: 60,
    backgroundColor: '#C6F6D5',
    borderRadius: 30,
    transform: [{ rotate: '-15deg' }],
  },
  greenShape2: {
    position: 'absolute',
    top: 180,
    left: 20,
    width: 100,
    height: 50,
    backgroundColor: '#9AE6B4',
    borderRadius: 25,
    transform: [{ rotate: '10deg' }],
  },
  greenShape3: {
    position: 'absolute',
    top: 260,
    left: -10,
    width: 80,
    height: 40,
    backgroundColor: '#68D391',
    borderRadius: 20,
    transform: [{ rotate: '-20deg' }],
  },
});

export default OnboardingScreen;