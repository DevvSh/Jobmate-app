import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ResumeUploadScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const pickDocument = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, use HTML file input
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      } else {
        // For mobile, use DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          copyToCacheDirectory: true,
        });

        if (result.type === 'success') {
          setResumeFile(result);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleWebFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: 'success',
        uri: URL.createObjectURL(file),
        mimeType: file.type,
        file: file // Store the actual file object for web
      };
      setResumeFile(fileInfo);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      Alert.alert('No File Selected', 'Please select a resume file first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      if (Platform.OS === 'web' && resumeFile.file) {
        // Web environment - use the actual file object
        formData.append('resume', resumeFile.file, resumeFile.name);
      } else if (resumeFile.uri.startsWith('blob:') || resumeFile.uri.startsWith('data:')) {
        // Web environment - fetch the blob
        const response = await fetch(resumeFile.uri);
        const fileContent = await response.blob();
        formData.append('resume', fileContent, resumeFile.name);
      } else {
        // Mobile environment - read file and convert to blob
        const fileInfo = await FileSystem.readAsStringAsync(resumeFile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const binaryString = atob(fileInfo);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: resumeFile.mimeType || 'application/octet-stream' });
        formData.append('resume', blob, resumeFile.name);
      }

      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.loaded / progressEvent.total;
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      
      if (response.data) {
        // Get detailed analysis from the new analyze endpoint
        try {
          const analysisResponse = await axios.post('http://localhost:5000/api/resume/analyze', {
            resumeData: response.data.structuredData || response.data.extractedText,
            targetRole: 'general'
          });
          
          Alert.alert('Success', 'Resume uploaded and analyzed successfully!');
          // Navigate to chat with both parsed data and analysis
          navigation.navigate('Chat', { 
            resumeUploaded: true,
            resumeData: response.data.structuredData,
            extractedText: response.data.extractedText,
            analysis: analysisResponse.data
          });
        } catch (analysisError) {
          console.error('Analysis error:', analysisError);
          // Still navigate even if analysis fails
          Alert.alert('Success', 'Resume uploaded successfully!');
          navigation.navigate('Chat', { 
            resumeUploaded: true, 
            resumeData: response.data.structuredData,
            extractedText: response.data.extractedText
          });
        }
      }
      
      // Reset state
      setResumeFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading resume:', error);
      setIsUploading(false);
      setUploadProgress(0);
      
      let errorMessage = 'Failed to upload resume. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Upload Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleWebFileSelect}
          style={{ display: 'none' }}
        />
      )}
      <View style={[styles.headerBar, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Upload Resume</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Upload Your Resume</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Upload your existing resume in PDF or DOCX format</Text>
        </View>

      <View style={[styles.uploadSection, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="document-outline" size={20} color="white" style={{marginRight: 8}} />
          <Text style={styles.uploadButtonText}>Select File</Text>
        </TouchableOpacity>

        {resumeFile && (
          <View style={[styles.fileInfoContainer, { backgroundColor: theme.colors.inputBackground }]}>
            <Text style={[styles.fileInfoLabel, { color: theme.colors.text }]}>Selected File:</Text>
            <Text style={[styles.fileInfoName, { color: theme.colors.text }]}>{resumeFile.name}</Text>
            <Text style={[styles.fileInfoSize, { color: theme.colors.textSecondary }]}>
              {(resumeFile.size / 1024).toFixed(2)} KB
            </Text>
          </View>
        )}

        {isUploading && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgress * 100}%` }]} />
            <Text style={styles.progressText}>
              {Math.round(uploadProgress * 100)}%
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, (!resumeFile || isUploading) && styles.disabledButton]}
          onPress={uploadResume}
          disabled={!resumeFile || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="white" style={{marginRight: 8}} />
              <Text style={styles.submitButtonText}>Upload Resume</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.infoSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.infoTitle, { color: theme.colors.text }]}>What happens next?</Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          1. Our AI will analyze your resume and extract key information
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          2. You can review and edit the extracted information
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          3. Use our chatbot to enhance your resume or create tailored versions for specific job applications
        </Text>
      </View>
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
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    padding: 20,
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
  uploadSection: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileInfoContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
  },
  fileInfoLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fileInfoName: {
    fontSize: 16,
    marginBottom: 5,
  },
  fileInfoSize: {
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7B68EE',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 20,
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  infoSection: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 22,
  },
});

export default ResumeUploadScreen;