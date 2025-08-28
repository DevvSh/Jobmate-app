import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const ChatScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { resumeUploaded, resumeData: uploadedResumeData, extractedText, analysis } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [jobType, setJobType] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(uploadedResumeData || null);
  const [progressPercentage, setProgressPercentage] = useState(uploadedResumeData ? 60 : 10);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const flatListRef = useRef(null);

  // Update progress when job type changes
  useEffect(() => {
    updateResumeProgress(messages);
  }, [jobType, messages]);

  // Add initial welcome message
  useEffect(() => {
    let welcomeText = 'Hi there! I\'m your Jobmate assistant. I can help you create a resume, write a cover letter, or prepare for interviews. What would you like to do today?';
    
    if (resumeUploaded && analysis) {
      // Display detailed AI analysis
      const { overallScore, strengths, weaknesses, suggestions, missingKeywords, atsCompatibility, sectionFeedback } = analysis;
      
      welcomeText = `🎯 **Resume Analysis Complete!**\n\n📊 **Overall Score: ${overallScore}/100**\n\n✅ **Strengths:**\n${strengths.map(s => `• ${s}`).join('\n')}\n\n⚠️ **Areas for Improvement:**\n${weaknesses.map(w => `• ${w}`).join('\n')}\n\n💡 **Key Recommendations:**\n${suggestions.map(s => `• ${s}`).join('\n')}\n\n🔍 **Missing Keywords:**\n${missingKeywords.map(k => `• ${k}`).join('\n')}\n\n🤖 **ATS Compatibility:** ${atsCompatibility}\n\nWould you like me to help you implement these improvements or generate an enhanced version of your resume?`;
    } else if (resumeUploaded && uploadedResumeData) {
      welcomeText = `Great! I\'ve processed your uploaded resume. Here\'s what I found:\n\n✅ **Strengths:**\n• Professional experience in ${uploadedResumeData.jobTitle || 'your field'}\n• Well-structured format\n\n🔧 **Suggestions for improvement:**\n• Add more quantified achievements\n• Include relevant keywords for ATS optimization\n• Consider updating the summary section\n\nHow would you like to improve your resume today?`;
    }
    
    setMessages([
      {
        id: '1',
        text: welcomeText,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, [resumeUploaded, uploadedResumeData, analysis]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const updateResumeProgress = (messageHistory) => {
    // Calculate progress based on conversation content
    const userMessages = messageHistory.filter(msg => msg.sender === 'user');
    const totalMessages = userMessages.length;
    
    // Basic progress calculation - can be enhanced with more sophisticated logic
    let progress = Math.min(10 + (totalMessages * 15), 100);
    
    // Check for specific information types to boost progress
    const conversationText = userMessages.map(msg => msg.text.toLowerCase()).join(' ');
    
    if (conversationText.includes('experience') || conversationText.includes('work')) {
      progress += 20;
    }
    if (conversationText.includes('education') || conversationText.includes('degree')) {
      progress += 15;
    }
    if (conversationText.includes('skill') || conversationText.includes('technology')) {
      progress += 15;
    }
    if (jobType.trim()) {
      progress += 10;
    }
    
    setProgressPercentage(Math.min(progress, 100));
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          userId: 'user123', // In a real app, this would be the actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Update resume data and progress based on conversation
      updateResumeProgress([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error connecting to the server. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  // Function to generate resume based on collected information
  const generateResume = async (userData) => {
    try {
      const requestBody = {
        userData: {
          ...userData,
          jobType: jobType,
        },
        jobDescription: jobType,
        template: 'professional'
      };
      
      // If we have uploaded resume data, include it for enhancement
      if (resumeData) {
        requestBody.existingResume = resumeData;
        requestBody.enhanceExisting = true;
      }
      
      const response = await fetch('http://localhost:5000/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      return data.resume;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  };

  // Function to get improvement suggestions for uploaded resume
  const getImprovementSuggestions = async () => {
    if (!resumeData && !extractedText) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/resume/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData || extractedText,
          targetRole: jobType || 'general'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get improvement suggestions');
      }

      const data = await response.json();
      
      const improvementMessage = {
        id: Date.now().toString(),
        text: `🚀 **Resume Improvement Suggestions**\n\n${data.improvements.map(imp => `📝 **${imp.section}:**\n${imp.suggestion}\n`).join('\n')}\n\n🎯 **Recommended Actions:**\n${data.actionableSteps.map(step => `• ${step}`).join('\n')}\n\nWould you like me to help you implement any of these improvements?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, improvementMessage]);
      
    } catch (error) {
      console.error('Error getting improvement suggestions:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error while getting improvement suggestions. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to analyze uploaded resume and provide suggestions
  const analyzeResume = async () => {
    if (!resumeData) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          jobType: jobType || 'general'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      
      const analysisMessage = {
        id: Date.now().toString(),
        text: `📊 **Resume Analysis Complete!**\n\n${data.analysis}\n\n💡 **Key Recommendations:**\n${data.suggestions.map(s => `• ${s}`).join('\n')}\n\nWould you like me to help implement any of these improvements?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, analysisMessage]);
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error while analyzing your resume. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      setIsLoading(true);
      
      // Extract user information from chat messages
      const userInfo = {
        name: 'User', // This would be extracted from chat or user profile
        jobType: jobType || 'Software Developer',
        experience: messages.filter(msg => msg.sender === 'user').map(msg => msg.text).join(' '),
      };
      
      const resume = await generateResume(userInfo);
      
      // Add a message showing resume generation success
      const successMessage = {
        id: Date.now().toString(),
        text: 'Great! I\'ve generated your resume based on our conversation. You can view and download it from the template selection screen.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, successMessage]);
      
      // Navigate to template selection with generated resume data
      navigation.navigate('TemplateSelection', { resumeData: resume });
      
    } catch (error) {
      console.error('Error creating resume:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error while generating your resume. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsLoading(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Here you would send the audio file to your backend
      // which would then use OpenAI's Whisper API to transcribe it
      // For the prototype, we'll simulate this process
      
      // Simulate transcription delay
      setTimeout(() => {
        const transcribedText = 'This is a simulated transcription of voice input.';
        setInputText(transcribedText);
        setIsLoading(false);
      }, 1500);
      
      // In a real implementation, you would do something like:
      // const formData = new FormData();
      // formData.append('audio', {
      //   uri,
      //   type: 'audio/m4a',
      //   name: 'recording.m4a',
      // });
      // const response = await axios.post('https://your-backend-api.com/transcribe', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // setInputText(response.data.transcription);
      // setIsLoading(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsLoading(false);
    }

    setRecording(null);
  };

  // Document picker function
  const pickDocument = async () => {
    console.log('pickDocument called');
    try {
      console.log('Starting document picker...');
      
      // For web, use different approach
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.docx,.doc';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            console.log('Web file selected:', file);
            
            // Add user message about upload
            const uploadMessage = {
              id: Date.now().toString(),
              text: `📎 Uploading document: ${file.name}`,
              sender: 'user',
              timestamp: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, uploadMessage]);
            
            uploadDocument(file);
          }
        };
        input.click();
        return;
      }
      
      // For mobile, use DocumentPicker
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('Document picker result:', result);

      if (!result.canceled) {
        let file = null;
        
        // Handle different result formats
        if (result.assets && result.assets.length > 0) {
          file = result.assets[0];
        } else if (result.uri) {
          // Fallback for older versions
          file = result;
        }

        if (file) {
          console.log('Selected file:', file);
          setUploadedFile(file);
          
          // Add user message about upload
          const uploadMessage = {
            id: Date.now().toString(),
            text: `📎 Uploading document: ${file.name}`,
            sender: 'user',
            timestamp: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, uploadMessage]);
          
          uploadDocument(file);
        } else {
          console.log('No file selected');
        }
      } else {
        console.log('Document picker was canceled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', `Failed to select document: ${error.message}. Please try again.`);
    }
  };

  // Upload document function
  const uploadDocument = async (file) => {
    if (!file) {
      console.log('No file provided to uploadDocument');
      return;
    }

    console.log('Starting upload for file:', file);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      
      // Handle different platforms
      if (Platform.OS === 'web') {
        // For web, file is a File object from input element
        console.log('Web file upload - File object:', file);
        formData.append('resume', file, file.name);
      } else {
        // For mobile
        console.log('Mobile file upload - DocumentPicker result:', file);
        formData.append('resume', {
          uri: file.uri,
          type: file.mimeType || file.type,
          name: file.name,
        });
      }

      console.log('Sending upload request to backend...');
      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Upload response:', response.data);

      if (response.data) {
        // Get detailed analysis from the analyze endpoint
        try {
          const analysisResponse = await axios.post('http://localhost:5000/api/resume/analyze', {
            resumeData: response.data.structuredData || response.data.extractedText,
            targetRole: 'general'
          });
          
          // Update state with uploaded resume data
          setResumeData(response.data.structuredData);
          setProgressPercentage(60);
          
          // Add success message with analysis
          const { overallScore, strengths, weaknesses, suggestions, missingKeywords, atsCompatibility } = analysisResponse.data;
          
          const analysisMessage = {
            id: Date.now().toString(),
            text: `📄 **Resume uploaded and analyzed successfully!**\n\n📊 **Overall Score: ${overallScore}/100**\n\n✅ **Strengths:**\n${strengths.map(s => `• ${s}`).join('\n')}\n\n⚠️ **Areas for Improvement:**\n${weaknesses.map(w => `• ${w}`).join('\n')}\n\n💡 **Key Recommendations:**\n${suggestions.map(s => `• ${s}`).join('\n')}\n\n🔍 **Missing Keywords:**\n${missingKeywords.map(k => `• ${k}`).join('\n')}\n\n🤖 **ATS Compatibility:** ${atsCompatibility}\n\nHow would you like me to help improve your resume?`,
            sender: 'bot',
            timestamp: new Date(),
          };
          
          setMessages((prevMessages) => [...prevMessages, analysisMessage]);
          
        } catch (analysisError) {
          console.error('Analysis error:', analysisError);
          // Still show success message even if analysis fails
          const successMessage = {
            id: Date.now().toString(),
            text: `📄 **Resume uploaded successfully!**\n\nI've processed your resume and extracted the key information. How would you like me to help you improve it?`,
            sender: 'bot',
            timestamp: new Date(),
          };
          
          setMessages((prevMessages) => [...prevMessages, successMessage]);
          setResumeData(response.data.structuredData);
          setProgressPercentage(60);
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let errorMessage = 'Failed to upload resume. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Add error message to chat
      const errorChatMessage = {
        id: Date.now().toString(),
        text: `❌ Upload failed: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorChatMessage]);
      
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setIsUploading(false);
      setUploadedFile(null);
    }
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    
    return (
      <View style={[styles.messageBubble, isBot ? [styles.botBubble, { backgroundColor: theme.colors.surface }] : [styles.userBubble, { backgroundColor: theme.colors.primary }]]}>
        <Text style={[styles.messageText, isBot ? [styles.botText, { color: theme.colors.text }] : styles.userText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Ionicons name="star" size={20} color="#7B68EE" />
          <Text style={styles.logoText}>Starplan</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <TouchableOpacity style={styles.templateLink} onPress={() => navigation.navigate('TemplateSelection')}>
            <Text style={styles.templateLinkText}>Choose ATS friendly template</Text>
            <Ionicons name="chevron-forward" size={16} color="#7B68EE" />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Resume Progress: {progressPercentage}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        </View>

        {/* AI Assistant Section */}
        <View style={styles.aiSection}>
          <Text style={styles.aiGreeting}>
            Hello! I'm your AI resume assistant. I'll help you create a professional resume by making real-time updates as we chat. You can type or use voice input to tell me what to add.
          </Text>
          
          <Text style={styles.promptText}>You can start with tell me:</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Job types</Text>
            <TextInput
              style={styles.jobTypeInput}
              value={jobType}
              onChangeText={setJobType}
              placeholder="e.g. Software Engineer, Marketing Manager"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <View style={styles.chatSection}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCreateResume}>
            <Ionicons name="document-text" size={24} color="#7B68EE" />
            <Text style={styles.actionButtonText}>Create resume</Text>
          </TouchableOpacity>
          
          {resumeData ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={analyzeResume}>
                <Ionicons name="analytics" size={24} color="#FF6B35" />
                <Text style={styles.actionButtonText}>Analyze resume</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={getImprovementSuggestions}>
                <Ionicons name="bulb" size={24} color="#10B981" />
                <Text style={styles.actionButtonText}>Get Improvements</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={pickDocument}>
              <Ionicons name="cloud-upload" size={24} color="#7B68EE" />
              <Text style={styles.actionButtonText}>Upload resume</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Jobs')}>
            <Ionicons name="briefcase" size={24} color="#7B68EE" />
            <Text style={styles.actionButtonText}>Job Matches</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Input Container */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7B68EE" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={pickDocument}
            disabled={isUploading}
          >
            <Ionicons name={isUploading ? "hourglass" : "attach"} size={20} color={isUploading ? "#999" : "#666"} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          
          <TouchableOpacity
            style={[styles.micButton, { backgroundColor: isRecording ? '#EF4444' : '#E5E7EB' }]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons name={isRecording ? "stop" : "mic"} size={20} color={isRecording ? "#fff" : "#666"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressSection: {
    padding: 24,
    backgroundColor: '#F0F9FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
  },
  templateLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  templateLinkText: {
    fontSize: 16,
    color: '#7B68EE',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 15,
    color: '#1E40AF',
    marginBottom: 10,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '50%',
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
  },
  aiSection: {
    padding: 20,
  },
  aiGreeting: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 20,
  },
  promptText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  jobTypeInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#fff',
  },
  chatSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  botText: {
    color: '#1F2937',
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    color: '#1E40AF',
    marginTop: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  attachButton: {
    marginRight: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  micButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginLeft: 10,
    color: '#6B7280',
  },
});

export default ChatScreen;