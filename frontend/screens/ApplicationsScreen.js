import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ApplicationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [applications, setApplications] = useState([
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      appliedDate: '2024-01-15',
      status: 'Interview Scheduled',
      salary: '$150,000 - $180,000',
      notes: 'Technical interview scheduled for next week'
    },
    {
      id: '2',
      jobTitle: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      appliedDate: '2024-01-12',
      status: 'Under Review',
      salary: '$120,000 - $140,000',
      notes: 'Application submitted through company website'
    },
    {
      id: '3',
      jobTitle: 'React Native Developer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      appliedDate: '2024-01-08',
      status: 'Offer Received',
      salary: '$140,000 - $160,000',
      notes: 'Offer expires in 5 days - need to respond'
    },
    {
      id: '4',
      jobTitle: 'iOS Developer',
      company: 'Apple',
      location: 'Cupertino, CA',
      appliedDate: '2024-01-05',
      status: 'Rejected',
      salary: '$130,000 - $150,000',
      notes: 'Position filled by internal candidate'
    },
    {
      id: '5',
      jobTitle: 'Full Stack Developer',
      company: 'Amazon',
      location: 'Austin, TX',
      appliedDate: '2024-01-18',
      status: 'Applied',
      salary: '$125,000 - $145,000',
      notes: 'Portfolio submitted with application'
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'offer received':
        return '#10B981';
      case 'interview scheduled':
        return '#3B82F6';
      case 'under review':
        return '#F59E0B';
      case 'applied':
        return '#6B7280';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'offer received':
        return 'checkmark-circle';
      case 'interview scheduled':
        return 'calendar';
      case 'under review':
        return 'time';
      case 'applied':
        return 'paper-plane';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderApplicationItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.applicationCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => {
          // Navigate to application details
        }}
      >
        <View style={styles.applicationHeader}>
          <View style={styles.jobInfo}>
            <Text style={[styles.jobTitle, { color: theme.colors.text }]}>{item.jobTitle}</Text>
            <View style={styles.companyRow}>
              <Ionicons name="business-outline" size={14} color={theme.colors.textTertiary} />
              <Text style={[styles.companyName, { color: theme.colors.textSecondary }]}>{item.company}</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textTertiary} />
              <Text style={[styles.location, { color: theme.colors.textSecondary }]}>{item.location}</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={16} color="white" />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.applicationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textTertiary} />
            <Text style={[styles.detailText, { color: theme.colors.textTertiary }]}>Applied: {item.appliedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color={theme.colors.textTertiary} />
            <Text style={[styles.detailText, { color: theme.colors.textTertiary }]}>{item.salary}</Text>
          </View>
          
          {item.notes && (
            <View style={styles.notesRow}>
              <Ionicons name="document-text-outline" size={16} color={theme.colors.textTertiary} />
              <Text style={[styles.notesText, { color: theme.colors.textTertiary }]} numberOfLines={2}>
                {item.notes}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => 
      ['applied', 'under review', 'interview scheduled'].includes(app.status.toLowerCase())
    ).length;
    const offers = applications.filter(app => app.status.toLowerCase() === 'offer received').length;
    const rejected = applications.filter(app => app.status.toLowerCase() === 'rejected').length;
    
    return { total, pending, offers, rejected };
  };

  const stats = getApplicationStats();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textTertiary }]}>Loading your applications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Applications</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Stats Section */}
      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.offers}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Offers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#EF4444' }]}>{stats.rejected}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Rejected</Text>
        </View>
      </View>
      
      {applications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={64} color={theme.colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Applications Yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
            Start applying to jobs to track your applications here
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderApplicationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.applicationsList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  applicationsList: {
    padding: 16,
  },
  applicationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobInfo: {
    flex: 1,
    marginRight: 16,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  applicationDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  notesText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default ApplicationsScreen;