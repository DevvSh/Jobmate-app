import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

const JobMatchScreen = () => {
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
      <TouchableOpacity style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={[styles.matchScoreBadge, 
            item.matchScore >= 90 ? styles.highMatch : 
            item.matchScore >= 80 ? styles.goodMatch : styles.averageMatch
          ]}>
            <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>{item.company}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
        
        <Text style={styles.jobDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.skillsContainer}>
          {item.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.jobFooter}>
          <Text style={styles.salary}>{item.salary}</Text>
          <Text style={styles.postedDate}>Posted: {item.postedDate}</Text>
        </View>
        
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Finding your best matches...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultsText}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  jobsList: {
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
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
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  companyName: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#1976D2',
    fontSize: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  salary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  postedDate: {
    fontSize: 14,
    color: '#888',
  },
  applyButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
  },
  applyButtonText: {
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

export default JobMatchScreen;