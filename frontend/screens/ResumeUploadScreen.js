import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const ResumeUploadScreen = ({ navigation }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setResumeFile(result);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
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
      // In a real app, this would upload to your backend
      // For prototype, we'll simulate the upload and parsing process
      
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 0.1;
        setUploadProgress(Math.min(progress, 0.9));
        if (progress >= 0.9) clearInterval(progressInterval);
      }, 300);

      // Simulate API call delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(1);
        setIsUploading(false);
        
        // Navigate to chat screen with parsed resume data
        navigation.navigate('Chat', { resumeUploaded: true });
        
        // Reset state
        setResumeFile(null);
        setUploadProgress(0);
      }, 3000);

      // In a real implementation:
      // const formData = new FormData();
      // formData.append('resume', {
      //   uri: resumeFile.uri,
      //   name: resumeFile.name,
      //   type: resumeFile.mimeType
      // });
      // 
      // const response = await axios.post('https://your-backend-api.com/upload-resume', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = progressEvent.loaded / progressEvent.total;
      //     setUploadProgress(percentCompleted);
      //   },
      // });
      // 
      // setIsUploading(false);
      // navigation.navigate('Chat', { resumeData: response.data });
    } catch (error) {
      console.error('Error uploading resume:', error);
      setIsUploading(false);
      Alert.alert('Upload Failed', 'Failed to upload resume. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Your Resume</Text>
        <Text style={styles.subtitle}>Upload your existing resume in PDF or DOCX format</Text>
      </View>

      <View style={styles.uploadSection}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Text style={styles.uploadButtonText}>Select File</Text>
        </TouchableOpacity>

        {resumeFile && (
          <View style={styles.fileInfoContainer}>
            <Text style={styles.fileInfoLabel}>Selected File:</Text>
            <Text style={styles.fileInfoName}>{resumeFile.name}</Text>
            <Text style={styles.fileInfoSize}>
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
            <Text style={styles.submitButtonText}>Upload Resume</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        <Text style={styles.infoText}>
          1. Our AI will analyze your resume and extract key information
        </Text>
        <Text style={styles.infoText}>
          2. You can review and edit the extracted information
        </Text>
        <Text style={styles.infoText}>
          3. Use our chatbot to enhance your resume or create tailored versions for specific job applications
        </Text>
      </View>
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
  },
  header: {
    marginBottom: 30,
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
  uploadSection: {
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
  uploadButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    padding: 15,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  fileInfoLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  fileInfoName: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  fileInfoSize: {
    color: '#666',
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
});

export default ResumeUploadScreen;