import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    skills: '',
  });

  useEffect(() => {
    // In a real app, this would fetch from your backend API
    // For prototype, we'll use mock data
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        const mockProfile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          location: 'San Francisco, CA',
          title: 'Frontend Developer',
          summary: 'Experienced frontend developer with 5+ years of experience in building responsive web and mobile applications using React and React Native.',
          skills: 'React, React Native, JavaScript, TypeScript, HTML, CSS, Redux',
        };
        
        setProfile(mockProfile);
        setIsLoading(false);
      }, 1000);
      
      // In a real implementation:
      // const response = await axios.get('https://your-backend-api.com/profile');
      // setProfile(response.data);
      // setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    }
  };

  const handleChange = (field, value) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }, 1500);
      
      // In a real implementation:
      // await axios.put('https://your-backend-api.com/profile', profile);
      // setIsSaving(false);
      // Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Update your personal information and skills</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              value={profile.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="First Name"
            />
          </View>
          
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={profile.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              placeholder="Last Name"
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Email Address"
          keyboardType="email-address"
        />

        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(text) => handleChange('phone', text)}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.input}
          value={profile.location}
          onChangeText={(text) => handleChange('location', text)}
          placeholder="City, State"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        
        <Text style={styles.inputLabel}>Professional Title</Text>
        <TextInput
          style={styles.input}
          value={profile.title}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="e.g. Frontend Developer"
        />

        <Text style={styles.inputLabel}>Professional Summary</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profile.summary}
          onChangeText={(text) => handleChange('summary', text)}
          placeholder="Brief description of your professional background"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.inputLabel}>Skills (comma separated)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profile.skills}
          onChangeText={(text) => handleChange('skills', text)}
          placeholder="e.g. JavaScript, React, UI Design"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.disabledButton]}
        onPress={saveProfile}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;