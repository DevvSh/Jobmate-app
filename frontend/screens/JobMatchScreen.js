import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const JobMatchScreen = () => {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from your backend API
    // For prototype, we'll use mock data
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  const fetchJobs = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        const mockJobs = [
          {
            id: '1',
            title: 'Frontend Developer',
            company: 'Tech Innovations Inc.',
            location: 'San Francisco, CA',
            matchScore: 92,
            description: 'We are looking for a skilled Frontend Developer with experience in React Native and modern JavaScript frameworks.',
            skills: ['React Native', 'JavaScript', 'CSS', 'UI/UX'],
            salary: '$90,000 - $120,000',
            postedDate: '2023-06-15',
          },
          {
            id: '2',
            title: 'Full Stack Engineer',
            company: 'Digital Solutions',
            location: 'Remote',
            matchScore: 87,
            description: 'Join our team as a Full Stack Engineer working on cutting-edge web applications using Node.js and React.',
            skills: ['Node.js', 'React', 'MongoDB', 'Express'],
            salary: '$100,000 - $130,000',
            postedDate: '2023-06-18',
          },
          {
            id: '3',
            title: 'Mobile Developer',
            company: 'AppWorks',
            location: 'Austin, TX',
            matchScore: 85,
            description: 'Seeking a talented Mobile Developer to build innovative applications for iOS and Android platforms.',
            skills: ['React Native', 'iOS', 'Android', 'API Integration'],
            salary: '$85,000 - $115,000',
            postedDate: '2023-06-20',
          },
          {
            id: '4',
            title: 'UI/UX Designer',
            company: 'Creative Minds',
            location: 'New York, NY',
            matchScore: 78,
            description: 'Looking for a UI/UX Designer with a strong portfolio and experience in mobile app design.',
            skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD'],
            salary: '$80,000 - $110,000',
            postedDate: '2023-06-22',
          },
          {
            id: '5',
            title: 'Backend Developer',
            company: 'Data Systems Inc.',
            location: 'Chicago, IL',
            matchScore: 75,
            description: 'Backend Developer needed to build robust APIs and services using Node.js and PostgreSQL.',
            skills: ['Node.js', 'PostgreSQL', 'API Design', 'Docker'],
            salary: '$95,000 - $125,000',
            postedDate: '2023-06-25',
          },
        ];
        
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setIsLoading(false);
      }, 1500);
      
      // In a real implementation:
      // const response = await axios.get('https://your-backend-api.com/job-matches');
      // setJobs(response.data);
      // setFilteredJobs(response.data);
      // setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  };

  const renderJobItem = ({ item }) => {
    return (
      <TouchableOpacity style={[styles.jobCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.jobHeader}>
          <Text style={[styles.jobTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <View style={[styles.matchScoreBadge, 
            item.matchScore >= 90 ? styles.highMatch : 
            item.matchScore >= 80 ? styles.goodMatch : styles.averageMatch
          ]}>
            <Text style={styles.matchScoreText}>{item.matchScore}%</Text>
          </View>
        </View>
        
        <View style={styles.companyRow}>
          <Ionicons name="business-outline" size={16} color={theme.colors.textTertiary} />
          <Text style={[styles.companyName, { color: theme.colors.textSecondary }]}>{item.company}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textTertiary} />
          <Text style={[styles.jobLocation, { color: theme.colors.textSecondary }]}>{item.location}</Text>
        </View>
        
        <Text style={[styles.jobDescription, { color: theme.colors.textTertiary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.skillsContainer}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <View style={styles.moreSkillsBadge}>
              <Text style={styles.moreSkillsText}>+{item.skills.length - 3}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.jobFooter}>
          <Text style={[styles.salary, { color: theme.colors.primary }]}>{item.salary}</Text>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Job Matches</Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Search jobs..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textTertiary }]}>Finding your best matches...</Text>
        </View>
      ) : (
        <>
          <Text style={[styles.resultsText, { color: theme.colors.textSecondary }]}>
            {filteredJobs.length} job matches found
          </Text>
          
          <FlatList
            data={filteredJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.jobsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2C',
  },
  header: {
    backgroundColor: '#0F1623',
    padding: 15,
    paddingTop: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7B68EE',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    margin: 15,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    shadowRadius: 2,
    elevation: 2,
  },
  resultsText: {
    fontSize: 16,
    color: '#CBD5E0',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  jobsList: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  jobCard: {
    backgroundColor: '#2D3748',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  matchScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  highMatch: {
    backgroundColor: '#4CAF50',
  },
  goodMatch: {
    backgroundColor: '#FFA000',
  },
  averageMatch: {
    backgroundColor: '#FF7043',
  },
  matchScoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 15,
    color: '#A0AEC0',
    marginLeft: 6,
  },
  jobLocation: {
    fontSize: 14,
    color: '#A0AEC0',
    marginLeft: 6,
  },
  jobDescription: {
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 15,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillBadge: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#CBD5E0',
    fontSize: 12,
  },
  moreSkillsBadge: {
    backgroundColor: '#3A4556',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  moreSkillsText: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
  },
  salary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B68EE',
  },
  applyButton: {
    backgroundColor: '#7B68EE',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#CBD5E0',
    marginTop: 10,
  },
});

export default JobMatchScreen;