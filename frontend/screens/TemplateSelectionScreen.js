import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TemplateSelectionScreen = ({ navigation, route }) => {
  const { resumeData } = route.params || {};
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [selectedColor, setSelectedColor] = useState(1); // Blue selected by default
  const [selectedFont, setSelectedFont] = useState('Poppins');

  const templates = [
    { id: 0, name: 'Classic' },
    { id: 1, name: 'Modern' },
    { id: 2, name: 'Creative' },
  ];

  const colors = [
    { id: 0, color: '#9CA3AF', name: 'Gray' },
    { id: 1, color: '#3B82F6', name: 'Blue' },
    { id: 2, color: '#92400E', name: 'Brown' },
    { id: 3, color: '#EC4899', name: 'Pink' },
    { id: 4, color: '#7C3AED', name: 'Purple' },
  ];

  const fonts = ['Poppins', 'Arial', 'Times New Roman', 'Helvetica'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{resumeData?.name || 'Your'} Resume</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resume Preview */}
        <View style={styles.previewSection}>
          <View style={styles.resumePreview}>
            {/* Resume Header */}
            <View style={styles.resumeHeader}>
              <View style={styles.nameSection}>
                <Text style={styles.resumeName}>{resumeData?.name?.toUpperCase() || 'YOUR NAME'}</Text>
                <Text style={styles.resumeTitle}>{resumeData?.jobTitle || 'Professional Title'}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactText}>{resumeData?.email || 'your.email@example.com'}</Text>
                <Text style={styles.contactText}>{resumeData?.phone || '+1 (555) 123-4567'}</Text>
                <Text style={styles.contactText}>{resumeData?.linkedin || 'linkedin.com/in/yourprofile'}</Text>
                <Text style={styles.contactText}>{resumeData?.location || 'Your City, State'}</Text>
              </View>
            </View>

            {/* Professional Summary */}
            <View style={styles.resumeSection}>
              <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
              <Text style={styles.sectionContent}>
                {resumeData?.summary || 'Professional summary will be generated based on your conversation with the AI assistant.'}
              </Text>
            </View>

            {/* Work Experience */}
            <View style={styles.resumeSection}>
              <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
              {resumeData?.experience?.length > 0 ? (
                resumeData.experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.companyName}>{exp.company} | {exp.duration}</Text>
                    <Text style={styles.jobDescription}>{exp.description}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>Your Job Title</Text>
                  <Text style={styles.companyName}>Company Name | Duration</Text>
                  <Text style={styles.jobDescription}>
                    • Your achievements and responsibilities will appear here
                    • Based on your conversation with the AI assistant
                    • Professional formatting will be applied automatically
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Template Selection */}
        <View style={styles.templateSection}>
          <Text style={styles.sectionLabel}>Template</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateThumbnail,
                  selectedTemplate === template.id && styles.selectedTemplate
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <View style={styles.templatePreview}>
                  <View style={styles.templateHeader}>
                    <View style={styles.templateLine} />
                    <View style={[styles.templateLine, { width: '60%' }]} />
                  </View>
                  <View style={styles.templateBody}>
                    <View style={[styles.templateLine, { width: '80%' }]} />
                    <View style={[styles.templateLine, { width: '70%' }]} />
                    <View style={[styles.templateLine, { width: '90%' }]} />
                  </View>
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Color Selection */}
        <View style={styles.colorSection}>
          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.color },
                  selectedColor === color.id && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color.id)}
              >
                {selectedColor === color.id && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Selection */}
        <View style={styles.fontSection}>
          <Text style={styles.sectionLabel}>Font</Text>
          <TouchableOpacity style={styles.fontSelector}>
            <Text style={styles.fontText}>{selectedFont}</Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewSection: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  resumePreview: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  nameSection: {
    flex: 1,
  },
  resumeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  resumeTitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  contactInfo: {
    alignItems: 'flex-end',
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  resumeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionContent: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  companyName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 14,
  },
  templateSection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  templateScroll: {
    flexDirection: 'row',
  },
  templateThumbnail: {
    width: 80,
    height: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginRight: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedTemplate: {
    borderColor: '#3B82F6',
  },
  templatePreview: {
    flex: 1,
    width: '100%',
  },
  templateHeader: {
    marginBottom: 6,
  },
  templateBody: {
    flex: 1,
  },
  templateLine: {
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
    marginBottom: 2,
    width: '100%',
  },
  colorSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  selectedColor: {
    borderColor: '#1F2937',
  },
  fontSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fontSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fontText: {
    fontSize: 16,
    color: '#374151',
  },
  templateName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default TemplateSelectionScreen;