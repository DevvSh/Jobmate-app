import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, FlatList, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

const ResumeScreen = () => {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [selectedColor, setSelectedColor] = useState('#7B68EE');
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI resume assistant. I'll help you create a professional resume by making real-time updates as we chat. You can type or use voice input to tell me what to add.\n\nTry saying or typing:\n• \"Add my name as John Smith\"\n• \"Set my email to john@example.com\"\n• \"Add my Bachelor's degree in Computer Science from MIT\"\n• \"Add my experience as a Software Engineer at Google\"\n• \"Add skills like JavaScript, React, and Node.js\"\n\nWhat would you like to add to your resume?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  // Fetch templates from API
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await fetch('http://localhost:5000/api/templates');
      if (response.ok) {
        const templatesData = await response.json();
        setTemplates(templatesData);
        if (templatesData.length > 0) {
          setSelectedTemplate(templatesData[0].id);
        }
      } else {
        // Fallback to mock templates
        const mockTemplates = [
          { id: 'professional', name: 'Professional', description: 'Clean and professional layout', category: 'business' },
          { id: 'modern', name: 'Modern', description: 'Contemporary design', category: 'creative' },
          { id: 'creative', name: 'Creative', description: 'Bold and creative design', category: 'creative' },
        ];
        setTemplates(mockTemplates);
        setSelectedTemplate('professional');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Fallback to mock templates
      const mockTemplates = [
        { id: 'professional', name: 'Professional', description: 'Clean and professional layout', category: 'business' },
        { id: 'modern', name: 'Modern', description: 'Contemporary design', category: 'creative' },
        { id: 'creative', name: 'Creative', description: 'Bold and creative design', category: 'creative' },
      ];
      setTemplates(mockTemplates);
      setSelectedTemplate('professional');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const colors = [
    '#7B68EE', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16',
    '#F97316', '#EC4899', '#6B7280', '#1F2937'
  ];

  const fonts = [
    'Poppins', 'Roboto', 'Open Sans', 'Lato',
    'Montserrat', 'Source Sans Pro', 'Nunito', 'Inter'
  ];

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to use voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Simulate voice transcription and AI processing
      setTimeout(() => {
        const transcribedText = 'Add my experience as a Frontend Developer at Tech Company for 3 years.';
        setChatInput(transcribedText);
        setIsProcessing(false);
      }, 2000);
      
      // In real implementation, send to OpenAI Whisper API
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsProcessing(false);
    }

    setRecording(null);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(chatInput),
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('experience') || lowerInput.includes('work')) {
      return "Great! I've added your work experience. Would you like to add your education, skills, or any specific achievements?";
    } else if (lowerInput.includes('education') || lowerInput.includes('degree')) {
      return "Perfect! I've added your education details. Let's add some key skills that match your target role.";
    } else if (lowerInput.includes('skills')) {
      return "Excellent! I've updated your skills section. Would you like me to help you write a professional summary?";
    } else {
      return "I understand. I'll help you add that to your resume. What other sections would you like to work on?";
    }
  };

  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.templateCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        selectedTemplate === item.id && { borderColor: selectedColor, borderWidth: 2 }
      ]}
      onPress={() => {
        setSelectedTemplate(item.id);
        if (item.colors) {
          setSelectedColor(item.colors.primary);
        }
      }}
    >
      <View style={[styles.templatePreview, { backgroundColor: item.colors?.primary || selectedColor }]}>
        <Text style={styles.templatePreviewText}>{item.name}</Text>
      </View>
      <Text style={[styles.templateName, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={[styles.templateDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderColor = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.colorOption,
        { backgroundColor: item },
        selectedColor === item && styles.selectedColor
      ]}
      onPress={() => {
        setSelectedColor(item);
        setShowColorPicker(false);
      }}
    />
  );

  const renderFont = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.fontOption,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        selectedFont === item && { borderColor: selectedColor, borderWidth: 2 }
      ]}
      onPress={() => {
        setSelectedFont(item);
        setShowFontPicker(false);
      }}
    >
      <Text style={[styles.fontText, { color: theme.colors.text, fontFamily: item }]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => {
    const isAI = item.sender === 'ai';
    return (
      <View style={[
        styles.messageBubble,
        isAI ? [styles.aiBubble, { backgroundColor: theme.colors.surface }] : [styles.userBubble, { backgroundColor: selectedColor }]
      ]}>
        <Text style={[
          styles.messageText,
          { color: isAI ? theme.colors.text : '#FFFFFF' }
        ]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={[styles.header, { borderBottomColor: '#E5E7EB' }]}>
        <Ionicons name="arrow-back" size={24} color="#000000" style={styles.backIcon} />
        <View style={styles.headerContent}>
          <Ionicons name="star" size={20} color="#7B68EE" />
          <Text style={[styles.headerTitle, { color: '#000000' }]}>Starplan</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Template Selection Button */}
        <TouchableOpacity style={styles.templateButton}>
          <Text style={styles.templateButtonText}>Choose ATS friendly template</Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Resume Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Ionicons name="document-text-outline" size={24} color="#000000" />
            <Text style={styles.progressTitle}>Resume Progress</Text>
            <Ionicons name="eye-outline" size={20} color="#6B7280" />
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Main Content Container */}
         <View style={styles.mainContainer}>
           {/* Left Side - AI Chat */}
           <View style={styles.leftPanel}>
             <View style={[styles.chatContainer, { backgroundColor: '#FFFFFF' }]}>
              <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
                <FlatList
                  data={chatMessages}
                  renderItem={renderMessage}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
                {isProcessing && (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="small" color={selectedColor} />
                    <Text style={[styles.processingText, { color: '#6B7280' }]}>AI is thinking...</Text>
                  </View>
                )}
              </ScrollView>
              
              <View style={[styles.inputContainer, { borderTopColor: '#E5E7EB' }]}>
                <TextInput
                  style={[styles.chatInput, { backgroundColor: '#F9FAFB', color: '#000000', borderColor: '#E5E7EB' }]}
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Tell me what to add to your resume..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
                <TouchableOpacity
                  style={[styles.voiceButton, { backgroundColor: isRecording ? '#EF4444' : '#E5E7EB' }]}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <Ionicons name={isRecording ? "stop" : "mic"} size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: selectedColor }]}
                  onPress={sendMessage}
                  disabled={!chatInput.trim()}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Job Match Button */}
            <TouchableOpacity style={[styles.jobMatchButton, { backgroundColor: selectedColor }]}>
              <Text style={styles.jobMatchButtonText}>Job Match</Text>
            </TouchableOpacity>

            {/* Switch to Voice Section */}
            <View style={styles.voiceSection}>
              <Text style={styles.voiceSectionTitle}>Switch to Voice</Text>
              <View style={styles.voiceControls}>
                <TouchableOpacity
                  style={[styles.voiceRecordButton, { backgroundColor: isRecording ? '#EF4444' : '#F3F4F6' }]}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={selectedColor} />
                  ) : (
                    <Ionicons
                      name={isRecording ? 'stop' : 'mic'}
                      size={24}
                      color={isRecording ? '#FFFFFF' : '#6B7280'}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.voiceActionButton}>
                  <Ionicons name="send" size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.voiceActionButton}>
                  <Ionicons name="share" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={[styles.actionButtonText, { color: '#000000' }]}>Add skills</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={[styles.actionButtonText, { color: '#000000' }]}>Add Education</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Right Side - Resume Preview */}
          <View style={styles.rightPanel}>
            <View style={styles.resumePreviewHeader}>
              <TouchableOpacity>
                <Ionicons name="arrow-back" size={20} color="#000000" />
              </TouchableOpacity>
              <Text style={styles.resumeTitle}>XXX's Resume</Text>
            </View>
            
            <View style={styles.resumePreview}>
              <View style={styles.resumeContent}>
                <View style={styles.resumeHeader}>
                  <Text style={styles.resumeName}>JESSICA PEARSON</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactText}>📧 jessica@pearsonlaw.com</Text>
                    <Text style={styles.contactText}>📞 +1 123 456 7890</Text>
                    <Text style={styles.contactText}>🌐 www.jessicapearson.com</Text>
                    <Text style={styles.contactText}>📍 New York, NY</Text>
                  </View>
                </View>
                
                <View style={styles.resumeSection}>
                  <Text style={styles.sectionHeader}>SUMMARY</Text>
                  <Text style={styles.sectionContent}>
                    Experienced Software Engineer with over 5 years of expertise in developing and
                    deploying high-performance web applications. Adept at both front-end and back-
                    end development, with a focus on building scalable, user-friendly solutions.
                    Strong team player with a history of leading successful projects and mentoring
                    junior developers.
                  </Text>
                </View>
                
                <View style={styles.resumeSection}>
                  <Text style={styles.sectionHeader}>WORK EXPERIENCE</Text>
                  <View style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>Senior Software Engineer</Text>
                    <Text style={styles.companyName}>Tech Solutions</Text>
                    <Text style={styles.jobDuration}>Boston, US</Text>
                    <Text style={styles.jobDuration}>Jan 2020</Text>
                    <Text style={styles.jobDescription}>
                      • Architected and implemented a microservices-based
                      architecture, leading to a 40% improvement in system
                      performance and scalability.
                      • Collaborated with product teams to define technical
                      requirements and deliver innovative solutions.
                      • Mentored a team of junior developers, fostering a
                      culture of continuous learning and best practices.
                      • Implemented a robust CI/CD pipeline, reducing the
                      time-to-market for new features by 50%.
                    </Text>
                  </View>
                </View>
                
                <View style={styles.resumeSection}>
                  <Text style={styles.sectionHeader}>EDUCATION</Text>
                  <View style={styles.educationItem}>
                    <Text style={styles.degreeTitle}>Bachelor of Science in Computer Science</Text>
                    <Text style={styles.schoolName}>Massachusetts Institute of Technology</Text>
                    <Text style={styles.graduationDate}>Graduated with honors in Computer Engineering</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Template Selection */}
            <View style={styles.templateSelection}>
              <Text style={styles.templateSectionTitle}>Template</Text>
              {isLoadingTemplates ? (
                <ActivityIndicator size="small" color={selectedColor} />
              ) : (
                <View style={styles.templateOptions}>
                  {templates.slice(0, 3).map((template, index) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.templateOption,
                        selectedTemplate === template.id && styles.selectedTemplate
                      ]}
                      onPress={() => {
                        setSelectedTemplate(template.id);
                        if (template.colors) {
                          setSelectedColor(template.colors.primary);
                        }
                      }}
                    >
                      <Text style={styles.templateOptionText}>{template.name}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.seeAllButton} onPress={() => setShowTemplateModal(true)}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {/* Color Selection */}
            <View style={styles.colorSelection}>
              <Text style={styles.colorSectionTitle}>Color</Text>
              <View style={styles.colorOptions}>
                {colors.slice(0, 6).map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorSwatch, { backgroundColor: color }]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
            
            {/* Font Selection */}
            <View style={styles.fontSelection}>
              <Text style={styles.fontSectionTitle}>Font</Text>
              <TouchableOpacity style={styles.fontDropdown} onPress={() => setShowFontPicker(true)}>
                <Text style={styles.fontDropdownText}>{selectedFont}</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Template Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Template</Text>
            <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.templateGrid}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    selectedTemplate === template.id && styles.selectedTemplateCard
                  ]}
                  onPress={() => {
                    setSelectedTemplate(template.id);
                    if (template.colors) {
                      setSelectedColor(template.colors.primary);
                    }
                    setShowTemplateModal(false);
                  }}
                >
                  <View style={styles.templatePreview}>
                    <Text style={styles.templatePreviewText}>{template.name}</Text>
                  </View>
                  <Text style={styles.templateCardTitle}>{template.name}</Text>
                  <Text style={styles.templateCardDescription}>{template.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Font Picker Modal */}
      <Modal visible={showFontPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Font</Text>
              <TouchableOpacity onPress={() => setShowFontPicker(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={fonts}
              renderItem={renderFont}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.fontList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 20,
    flex: 1,
  },
  leftPanel: {
    flex: width > 768 ? 1 : 1,
    minWidth: width > 768 ? 300 : '100%',
  },
  rightPanel: {
    flex: width > 768 ? 1 : 1,
    minWidth: width > 768 ? 300 : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chatContainer: {
    borderRadius: 8,
    padding: 12,
    height: 200,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  templateList: {
    paddingHorizontal: 4,
  },
  templateCard: {
    width: 100,
    marginHorizontal: 8,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  templatePreview: {
    width: 60,
    height: 80,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  templatePreviewText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  templateName: {
    fontSize: 12,
    fontWeight: '500',
  },
  colorList: {
    paddingHorizontal: 4,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fontSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedFontText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobMatchButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  jobMatchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  fontList: {
    padding: 16,
  },
  fontOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  fontText: {
    fontSize: 16,
  },
  voiceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceRecordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  backIcon: {
    position: 'absolute',
    left: 16,
  },
  headerContent: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   progressSection: {
     backgroundColor: '#FFFFFF',
     padding: 16,
     borderRadius: 8,
     marginBottom: 16,
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   progressHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 8,
   },
   progressTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#000000',
     marginLeft: 8,
     flex: 1,
   },
   progressBar: {
     height: 4,
     backgroundColor: '#E5E7EB',
     borderRadius: 2,
     overflow: 'hidden',
   },
   progressFill: {
     height: '100%',
     width: '65%',
     backgroundColor: '#10B981',
     borderRadius: 2,
   },
   jobMatchButton: {
     backgroundColor: '#3B82F6',
     paddingVertical: 12,
     paddingHorizontal: 24,
     borderRadius: 20,
     alignSelf: 'flex-start',
     marginTop: 16,
   },
   jobMatchButtonText: {
     color: '#FFFFFF',
     fontSize: 14,
     fontWeight: '600',
   },
   actionButtons: {
     flexDirection: 'row',
     gap: 12,
   },
   actionButton: {
     paddingVertical: 8,
     paddingHorizontal: 16,
     borderRadius: 6,
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   actionButtonText: {
     fontSize: 14,
     fontWeight: '500',
   },
   // Resume Preview Styles
   resumePreviewHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 16,
     paddingBottom: 12,
     borderBottomWidth: 1,
     borderBottomColor: '#E5E7EB',
   },
   resumeTitle: {
     fontSize: 18,
     fontWeight: '600',
     color: '#000000',
     marginLeft: 12,
   },
   resumePreview: {
     backgroundColor: '#FFFFFF',
     borderRadius: 8,
     padding: 16,
     marginBottom: 20,
     borderWidth: 1,
     borderColor: '#E5E7EB',
     minHeight: 400,
   },
   resumeContent: {
     flex: 1,
   },
   resumeHeader: {
     marginBottom: 16,
     paddingBottom: 12,
     borderBottomWidth: 1,
     borderBottomColor: '#E5E7EB',
   },
   resumeName: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#000000',
     marginBottom: 8,
   },
   contactInfo: {
     gap: 2,
   },
   contactText: {
     fontSize: 12,
     color: '#6B7280',
   },
   resumeSection: {
     marginBottom: 16,
   },
   sectionHeader: {
     fontSize: 14,
     fontWeight: 'bold',
     color: '#000000',
     marginBottom: 8,
     textTransform: 'uppercase',
   },
   sectionContent: {
     fontSize: 12,
     color: '#374151',
     lineHeight: 16,
   },
   experienceItem: {
     marginBottom: 12,
   },
   jobTitle: {
     fontSize: 13,
     fontWeight: '600',
     color: '#000000',
   },
   companyName: {
     fontSize: 12,
     color: '#6B7280',
   },
   jobDuration: {
     fontSize: 11,
     color: '#9CA3AF',
   },
   jobDescription: {
     fontSize: 11,
     color: '#374151',
     lineHeight: 14,
     marginTop: 4,
   },
   educationItem: {
     marginBottom: 8,
   },
   degreeTitle: {
     fontSize: 13,
     fontWeight: '600',
     color: '#000000',
   },
   schoolName: {
     fontSize: 12,
     color: '#6B7280',
   },
   graduationDate: {
     fontSize: 11,
     color: '#9CA3AF',
   },
   // Template Selection Styles
   templateSelection: {
     marginBottom: 20,
   },
   templateSectionTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#000000',
     marginBottom: 12,
   },
   templateOptions: {
     flexDirection: 'row',
     gap: 8,
     alignItems: 'center',
   },
   templateOption: {
     paddingVertical: 8,
     paddingHorizontal: 12,
     borderRadius: 6,
     backgroundColor: '#F3F4F6',
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   selectedTemplate: {
     backgroundColor: '#D1FAE5',
     borderColor: '#10B981',
   },
   templateOptionText: {
     fontSize: 12,
     color: '#000000',
     fontWeight: '500',
   },
   seeAllButton: {
     flexDirection: 'row',
     alignItems: 'center',
     marginLeft: 'auto',
   },
   seeAllText: {
     fontSize: 12,
     color: '#6B7280',
     marginRight: 4,
   },
   // Color Selection Styles
   colorSelection: {
     marginBottom: 20,
   },
   colorSectionTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#000000',
     marginBottom: 12,
   },
   colorOptions: {
     flexDirection: 'row',
     gap: 8,
   },
   colorSwatch: {
     width: 32,
     height: 32,
     borderRadius: 4,
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   // Font Selection Styles
   fontSelection: {
     marginBottom: 20,
   },
   fontSectionTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#000000',
     marginBottom: 12,
   },
   fontDropdown: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     backgroundColor: '#F9FAFB',
     paddingVertical: 12,
     paddingHorizontal: 16,
     borderRadius: 8,
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   fontDropdownText: {
     fontSize: 14,
     color: '#000000',
   },
   // Voice Section Styles
   voiceSectionTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#000000',
     marginBottom: 12,
   },
   voiceControls: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 16,
   },
   jobMatchButton: {
     backgroundColor: '#3B82F6',
     paddingVertical: 12,
     paddingHorizontal: 24,
     borderRadius: 20,
     alignSelf: 'flex-start',
     marginTop: 16,
     marginBottom: 20,
   },
   jobMatchButtonText: {
     color: '#FFFFFF',
     fontSize: 14,
     fontWeight: '600',
   },
   // Template Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
    },
    modalContent: {
      flex: 1,
    },
    templateCard: {
      width: '45%',
      backgroundColor: '#F9FAFB',
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    templatePreview: {
      height: 80,
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    templatePreviewText: {
      fontSize: 10,
      color: '#6B7280',
    },
   templateGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     padding: 16,
     gap: 16,
   },
   selectedTemplateCard: {
     borderColor: '#3B82F6',
     borderWidth: 2,
   },
   templateCardTitle: {
     fontSize: 14,
     fontWeight: '600',
     color: '#000000',
     marginTop: 8,
   },
   templateCardDescription: {
     fontSize: 12,
     color: '#6B7280',
     marginTop: 4,
   },
 });

export default ResumeScreen;