import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    experience: '5+ years',
    bio: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Love building scalable applications and mentoring junior developers.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
    education: [
      {
        id: 1,
        degree: 'Master of Science in Computer Science',
        school: 'Stanford University',
        year: '2019',
        gpa: '3.8/4.0'
      },
      {
        id: 2,
        degree: 'Bachelor of Science in Software Engineering',
        school: 'UC Berkeley',
        year: '2017',
        gpa: '3.7/4.0'
      }
    ],
    workExperience: [
      {
        id: 1,
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        duration: '2022 - Present',
        description: 'Lead development of microservices architecture, mentored 3 junior developers'
      },
      {
        id: 2,
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        duration: '2020 - 2022',
        description: 'Built scalable web applications using React and Node.js, improved performance by 40%'
      },
      {
        id: 3,
        company: 'DevSolutions',
        position: 'Junior Developer',
        duration: '2019 - 2020',
        description: 'Developed frontend components and REST APIs, collaborated with cross-functional teams'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional Developer',
      'Certified Kubernetes Administrator'
    ],
    languages: ['English (Native)', 'Spanish (Conversational)', 'French (Basic)']
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChange = (field, value) => {
    setUserProfile(prevProfile => ({
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
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textTertiary }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.headerBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>My Profile</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textTertiary }]}>Update your personal information and skills</Text>
        </View>

        <View style={[styles.formSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Personal Information</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>First Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={userProfile.name.split(' ')[0] || ''}
                onChangeText={(text) => {
                  const lastName = userProfile.name.split(' ').slice(1).join(' ');
                  handleChange('name', `${text} ${lastName}`.trim());
                }}
                placeholder="First Name"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputHalf}>
              <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={userProfile.name.split(' ').slice(1).join(' ') || ''}
                onChangeText={(text) => {
                  const firstName = userProfile.name.split(' ')[0];
                  handleChange('name', `${firstName} ${text}`.trim());
                }}
                placeholder="Last Name"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={userProfile.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="Email Address"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="email-address"
          />

          <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Phone</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={userProfile.phone}
            onChangeText={(text) => handleChange('phone', text)}
            placeholder="Phone Number"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="phone-pad"
          />

          <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Location</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={userProfile.location}
            onChangeText={(text) => handleChange('location', text)}
            placeholder="City, State"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={[styles.formSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Professional Information</Text>
          
          <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Professional Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={userProfile.title}
            onChangeText={(text) => handleChange('title', text)}
            placeholder="e.g. Frontend Developer"
            placeholderTextColor={theme.colors.textTertiary}
          />

          <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Professional Summary</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={userProfile.bio}
            onChangeText={(text) => handleChange('bio', text)}
            placeholder="Brief description of your professional background"
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={[styles.inputLabel, { color: theme.colors.textTertiary }]}>Skills (comma separated)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={userProfile.skills.join(', ')}
            onChangeText={(text) => handleChange('skills', text.split(', ').map(skill => skill.trim()).filter(skill => skill))}
            placeholder="e.g. JavaScript, React, UI Design"
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.formSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textTertiary }]}>Toggle between light and dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + '80']}
          style={styles.saveButton}
        >
          <TouchableOpacity
            style={styles.saveButtonInner}
            onPress={saveProfile}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="white" style={{marginRight: 8}} />
                <Text style={styles.saveButtonText}>Save Profile</Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 12,
    borderRadius: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formSection: {
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;