// EmployeeFollowUpManagement.js - רכיב לניהול בקשות המשך טיפול עבור עובדים
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FollowUpCard = ({ complaint, pendingRequests, onRespond, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'not_satisfied':
        return 'thumbs-down';
      case 'new_issue':
        return 'alert-circle';
      case 'chat_request':
        return 'chatbubbles';
      default:
        return 'help-circle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'not_satisfied':
        return '#ef4444';
      case 'new_issue':
        return '#f59e0b';
      case 'chat_request':
        return '#4f46e5';
      default:
        return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'not_satisfied':
        return 'אינו מרוצה מהטיפול';
      case 'new_issue':
        return 'בעיה חדשה או קשורה';
      case 'chat_request':
        return 'בקשה לתקשורת';
      default:
        return 'בקשה כללית';
    }
  };

  return (
    <View style={styles.followUpCard}>
      <View style={styles.cardHeader}>
        <View style={styles.complaintInfo}>
          <Text style={styles.complaintTitle}>{complaint.title}</Text>
          <Text style={styles.complaintCategory}>{complaint.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => onViewDetails(complaint._id)}
        >
          <Ionicons name="eye" size={20} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <View style={styles.requestsContainer}>
        {pendingRequests.map((request, index) => (
          <View key={index} style={styles.requestItem}>
            <View style={styles.requestHeader}>
              <View style={styles.requestType}>
                <Ionicons 
                  name={getTypeIcon(request.type)} 
                  size={16} 
                  color={getTypeColor(request.type)} 
                />
                <Text style={[styles.requestTypeText, { color: getTypeColor(request.type) }]}>
                  {getTypeLabel(request.type)}
                </Text>
              </View>
              <Text style={styles.requestDate}>
                {formatDate(request.requestedAt)}
              </Text>
            </View>
            
            <Text style={styles.requestMessage}>{request.message}</Text>
            
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => onRespond(complaint._id, index, 'approved')}
              >
                <Ionicons name="checkmark" size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>אשר</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => onRespond(complaint._id, index, 'rejected')}
              >
                <Ionicons name="close" size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>דחה</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.moreInfoButton]}
                onPress={() => onRespond(complaint._id, index, 'needs_more_info')}
              >
                <Ionicons name="help-circle" size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>מידע נוסף</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const EmployeeFollowUpManagement = ({ navigation }) => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);
  
  // מצב המודאל לתגובה
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [currentResponse, setCurrentResponse] = useState({
    complaintId: null,
    requestIndex: null,
    status: null
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      setUserToken(token);
      fetchPendingFollowUps(token);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('שגיאה בטעינת נתוני משתמש');
      setLoading(false);
    }
  };

  const fetchPendingFollowUps = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://192.168.1.4:5000/api/employee/pending-follow-ups',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setFollowUps(response.data.data);
        setError(null);
      } else {
        setError('שגיאה בטעינת בקשות המשך טיפול');
      }
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
      } else {
        setError('שגיאה בטעינת בקשות המשך טיפול');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingFollowUps(userToken);
  };

  const handleRespond = (complaintId, requestIndex, status) => {
    setCurrentResponse({ complaintId, requestIndex, status });
    setResponseMessage('');
    setResponseModalVisible(true);
  };

  const submitResponse = async () => {
    if (!responseMessage.trim()) {
      Alert.alert('שגיאה', 'אנא כתוב תגובה');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `http://192.168.1.4:5000/api/complaints/${currentResponse.complaintId}/follow-up/${currentResponse.requestIndex}/respond`,
        {
          response: responseMessage,
          status: currentResponse.status
        },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        Alert.alert('הצלחה', 'התגובה נשלחה בהצלחה');
        setResponseModalVisible(false);
        setResponseMessage('');
        fetchPendingFollowUps(userToken); // רענן את הרשימה
      } else {
        Alert.alert('שגיאה', 'אירעה שגיאה בשליחת התגובה');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת התגובה');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'אישור בקשה';
      case 'rejected':
        return 'דחיית בקשה';
      case 'needs_more_info':
        return 'בקשת מידע נוסף';
      default:
        return 'תגובה';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'needs_more_info':
        return '#f59e0b';
      default:
        return '#4f46e5';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>טוען בקשות המשך טיפול...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchPendingFollowUps(userToken)}
        >
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>בקשות המשך טיפול</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color="#ffffff"
            style={refreshing ? { opacity: 0.5 } : {}}
          />
        </TouchableOpacity>
      </View>

      {followUps.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#10b981" />
          <Text style={styles.emptyTitle}>אין בקשות המשך טיפול ממתינות</Text>
          <Text style={styles.emptySubtitle}>
            כל הבקשות טופלו או שאין בקשות חדשות כרגע
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={["#4f46e5"]}
            />
          }
        >
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {followUps.length} תלונות עם בקשות המשך טיפול ממתינות
            </Text>
          </View>

          {followUps.map((item, index) => (
            <FollowUpCard
              key={index}
              complaint={item.complaint}
              pendingRequests={item.pendingRequests}
              onRespond={handleRespond}
              onViewDetails={(complaintId) => 
                navigation.navigate('EmployeeComplaintDetails', { complaintId })
              }
            />
          ))}
        </ScrollView>
      )}

      {/* מודאל תגובה */}
      <Modal
        visible={responseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setResponseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setResponseModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {getStatusText(currentResponse.status)}
            </Text>
            <Text style={styles.modalSubtitle}>
              כתוב את תגובתך לבקשת המשך הטיפול
            </Text>

            <TextInput
              style={styles.responseInput}
              placeholder="כתוב את התגובה שלך..."
              value={responseMessage}
              onChangeText={setResponseMessage}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setResponseModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>ביטול</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: getStatusColor(currentResponse.status) }]}
                onPress={submitResponse}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>שלח תגובה</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4f46e5',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  followUpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  complaintInfo: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  complaintCategory: {
    fontSize: 14,
    color: '#6b7280',
  },
  viewDetailsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  requestsContainer: {
    gap: 12,
  },
  requestItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestTypeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  requestDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  requestMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  moreInfoButton: {
    backgroundColor: '#f59e0b',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4f46e5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    textAlign: 'center',
  },
  responseInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 2,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EmployeeFollowUpManagement;