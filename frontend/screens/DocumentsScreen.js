import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DocumentsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'Software Engineer Resume',
      type: 'resume',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      status: 'completed',
      template: 'Modern',
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'Cover Letter - Tech Corp',
      type: 'cover_letter',
      createdAt: '2024-01-18',
      lastModified: '2024-01-18',
      status: 'completed',
      template: 'Professional',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Data Analyst Resume',
      type: 'resume',
      createdAt: '2024-01-22',
      lastModified: '2024-01-22',
      status: 'draft',
      template: 'Clean',
      color: '#8B5CF6',
    },
  ]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  const filters = [
    { key: 'all', label: 'All Documents', icon: 'documents-outline' },
    { key: 'resume', label: 'Resumes', icon: 'person-outline' },
    { key: 'cover_letter', label: 'Cover Letters', icon: 'mail-outline' },
  ];

  const filteredDocuments = documents.filter(doc => 
    selectedFilter === 'all' || doc.type === selectedFilter
  );

  useEffect(() => {
    // Animate content in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'draft': return 'Draft';
      case 'in_progress': return 'In Progress';
      default: return 'Unknown';
    }
  };

  const handleDocumentPress = (document) => {
    if (document.type === 'resume') {
      navigation.navigate('ResumeStack', { 
        screen: 'Resume',
        params: { documentId: document.id }
      });
    } else {
      // Navigate to cover letter editor (could be same screen with different mode)
      navigation.navigate('ResumeStack', { 
        screen: 'Resume',
        params: { documentId: document.id, mode: 'cover_letter' }
      });
    }
  };

  const handleDocumentOptions = (document) => {
    setSelectedDocument(document);
    setShowOptionsModal(true);
  };

  const handleDeleteDocument = () => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${selectedDocument?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDocuments(docs => docs.filter(doc => doc.id !== selectedDocument.id));
            setShowOptionsModal(false);
            setSelectedDocument(null);
          },
        },
      ]
    );
  };

  const handleDuplicateDocument = () => {
    const newDocument = {
      ...selectedDocument,
      id: Date.now().toString(),
      title: `${selectedDocument.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setDocuments(docs => [newDocument, ...docs]);
    setShowOptionsModal(false);
    setSelectedDocument(null);
  };

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: selectedFilter === item.key ? theme.colors.primary : theme.colors.surface,
          borderColor: selectedFilter === item.key ? theme.colors.primary : theme.colors.border,
        },
      ]}
      onPress={() => setSelectedFilter(item.key)}
    >
      <Ionicons
        name={item.icon}
        size={16}
        color={selectedFilter === item.key ? '#FFFFFF' : theme.colors.text}
      />
      <Text
        style={[
          styles.filterButtonText,
          {
            color: selectedFilter === item.key ? '#FFFFFF' : theme.colors.text,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderDocument = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.documentCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
          onPress={() => handleDocumentPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.documentHeader}>
            <View style={[styles.documentIcon, { backgroundColor: item.color }]}>
              <Ionicons
                name={item.type === 'resume' ? 'person-outline' : 'mail-outline'}
                size={24}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.documentInfo}>
              <Text style={[styles.documentTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.documentSubtitle, { color: theme.colors.textSecondary }]}>
                {item.type === 'resume' ? 'Resume' : 'Cover Letter'} • {item.template}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => handleDocumentOptions(item)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.documentFooter}>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: theme.colors.textTertiary }]}>
              Modified {item.lastModified}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="documents" size={20} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Documents</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ResumeStack', { screen: 'Resume' })}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Filter Buttons */}
        <Animated.View 
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <FlatList
            data={filters}
            renderItem={renderFilterButton}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          />
        </Animated.View>

        {/* Documents List */}
        {filteredDocuments.length > 0 ? (
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <FlatList
              data={filteredDocuments}
              renderItem={renderDocument}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.documentsContainer}
            />
          </Animated.View>
        ) : (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Ionicons name="documents-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
              No Documents Yet
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
              Create your first resume or cover letter to get started
            </Text>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary + '80']}
              style={styles.createButton}
            >
              <TouchableOpacity
                style={styles.createButtonInner}
                onPress={() => navigation.navigate('ResumeStack', { screen: 'Resume' })}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Create Document</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}
      </View>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.optionsModal, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {selectedDocument?.title}
            </Text>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsModal(false);
                handleDocumentPress(selectedDocument);
              }}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDuplicateDocument}
            >
              <Ionicons name="copy-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Duplicate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                // Handle share functionality
                setShowOptionsModal(false);
              }}
            >
              <Ionicons name="share-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionItem, styles.deleteOption]}
              onPress={handleDeleteDocument}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.optionText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterContainer: {
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  documentsContainer: {
    paddingBottom: 20,
  },
  documentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 14,
  },
  optionsButton: {
    padding: 8,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  optionsModal: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteOption: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DocumentsScreen;