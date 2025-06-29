//AssignedComplaints.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userid');
      
      if (!token || !userId) {
        navigation.navigate('loginScreen');
        return;
      }

      const response = await fetch(`http://192.168.1.4:5000/api/employee-assigned-complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned complaints');
      }

      const data = await response.json();
      setComplaints(data.data);
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        navigation.navigate('loginScreen');
        return;
      }

      console.log(`Sending status update request: ${complaintId} to ${newStatus}`);
      
      const response = await fetch(`http://192.168.1.4:5000/api/complaints/${complaintId}/process`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.log('Error response:', responseData);
        throw new Error(responseData.message || 'Failed to update status');
      }

      console.log('Status update successful');
      fetchAssignedComplaints();
      Alert.alert('Success', `Complaint status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#FF9800';
      case 'in_progress': return '#2196F3';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return '#000000';
    }
  };

  const renderComplaintItem = ({ item }) => (
    <View style={styles.complaintItem}>
      <View style={styles.statusBar}>
        <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
          {item.status?.toUpperCase() || 'OPEN'}
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('ComplaintDetails', { complaint: item })}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>Category: {item.category}</Text>
        <Text style={styles.address}>Address: {item.address}</Text>
        <Text style={styles.description}>{item.description}</Text>
        
        {item.images && item.images.length > 0 && (
          <Image 
            source={{ uri: item.images[0].data }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        {/* Show relevant action button based on current status */}
        {item.status === 'open' && (
          <TouchableOpacity 
            style={[styles.statusButton, styles.inProgressButton]}
            onPress={() => updateComplaintStatus(item._id, 'in_progress')}
          >
            <Text style={styles.buttonText}>Mark In Progress</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'in_progress' && (
          <TouchableOpacity 
            style={[styles.statusButton, styles.resolvedButton]}
            onPress={() => updateComplaintStatus(item._id, 'resolved')}
          >
            <Text style={styles.buttonText}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'resolved' && (
          <TouchableOpacity 
            style={[styles.statusButton, styles.closedButton]}
            onPress={() => updateComplaintStatus(item._id, 'closed')}
          >
            <Text style={styles.buttonText}>Mark Closed</Text>
          </TouchableOpacity>
        )}
        
        {/* Reply button always available */}
        <TouchableOpacity 
          style={styles.replyButton}
          onPress={() => navigation.navigate('AddResponse', { complaintId: item._id })}
        >
          <Text style={styles.buttonText}>Reply to Citizen</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchAssignedComplaints}>
          <Text style={styles.retry}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Assigned Complaints</Text>
      
      {complaints.length === 0 ? (
        <Text style={styles.noComplaints}>You don't have any assigned complaints</Text>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item._id}
          refreshing={loading}
          onRefresh={fetchAssignedComplaints}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  complaintItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  inProgressButton: {
    backgroundColor: '#2196F3',
  },
  resolvedButton: {
    backgroundColor: '#4CAF50',
  },
  closedButton: {
    backgroundColor: '#9E9E9E',
  },
  replyButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  retry: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  noComplaints: {
    textAlign: 'center',
    color: '#777',
    marginTop: 24,
    fontSize: 16,
  },
});

export default AssignedComplaints;