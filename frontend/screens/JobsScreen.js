import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    status: 'Applied'
  });

  // For demo purposes, using sample data
  useEffect(() => {
    // In a real app, you would fetch from your API
    // axios.get('http://localhost:5000/api/jobs')
    //   .then(response => setJobs(response.data))
    //   .catch(error => console.error('Error fetching jobs:', error))
    //   .finally(() => setLoading(false));
    
    // Sample data for demonstration
    setJobs([
      { id: '1', title: 'Frontend Developer', company: 'Tech Co', status: 'Applied' },
      { id: '2', title: 'Backend Engineer', company: 'Software Inc', status: 'Interview' },
      { id: '3', title: 'Full Stack Developer', company: 'Startup Ltd', status: 'Rejected' },
    ]);
    setLoading(false);
  }, []);

  const addJob = () => {
    if (!newJob.title || !newJob.company) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // In a real app, you would post to your API
    // axios.post('http://localhost:5000/api/jobs', newJob)
    //   .then(response => {
    //     setJobs([...jobs, response.data]);
    //     setNewJob({ title: '', company: '', status: 'Applied' });
    //   })
    //   .catch(error => console.error('Error adding job:', error));

    // For demo purposes
    const newJobWithId = {
      ...newJob,
      id: Date.now().toString()
    };
    setJobs([...jobs, newJobWithId]);
    setNewJob({ title: '', company: '', status: 'Applied' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.jobItem}>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobCompany}>{item.company}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Applied':
        return { backgroundColor: '#3498db' };
      case 'Interview':
        return { backgroundColor: '#f39c12' };
      case 'Offer':
        return { backgroundColor: '#2ecc71' };
      case 'Rejected':
        return { backgroundColor: '#e74c3c' };
      default:
        return { backgroundColor: '#95a5a6' };
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Job Title"
          value={newJob.title}
          onChangeText={(text) => setNewJob({...newJob, title: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Company"
          value={newJob.company}
          onChangeText={(text) => setNewJob({...newJob, company: text})}
        />
        <TouchableOpacity style={styles.addButton} onPress={addJob}>
          <Text style={styles.addButtonText}>Add Job</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No job applications yet. Add one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  jobItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d',
  },
});