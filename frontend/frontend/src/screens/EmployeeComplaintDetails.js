// EmployeeComplaintDetails.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const STATUS_COLORS = {
  open: '#92400e',
  in_progress: '#1e40af',
  resolved: '#166534',
  closed: '#374151'
};

const STATUS_ICONS = {
  open: 'time',
  in_progress: 'reload',
  resolved: 'checkmark-circle',
  closed: 'checkmark-done-circle'
};

const STATUS_LABELS = {
  open: 'ממתין לטיפול',
  in_progress: 'בטיפול',
  resolved: 'טופל',
  closed: 'סגור'
};

const EmployeeComplaintDetails = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  
  // BASE URL should match your server
  const BASE_URL = 'http://192.168.1.4:5000';

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');
        
        if (token && userString) {
          const user = JSON.parse(userString);
          setUserToken(token);
          setUserId(user._id);
          fetchComplaintDetails(token);
        } else {
          navigation.replace('loginScreen');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('שגיאה בטעינת נתוני משתמש');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [complaintId, navigation]);

  const fetchComplaintDetails = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/complaints/${complaintId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success') {
        setComplaint(response.data.data);
      } else {
        setError('שגיאה בטעינת פרטי התלונה');
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      
      if (error.response?.status === 401) {
        await AsyncStorage.multiRemove(['token', 'user']);
        navigation.replace('loginScreen');
      } else if (error.response?.status === 403) {
        setError('אין לך הרשאה לצפות בתלונה זו');
      } else if (error.response?.status === 404) {
        setError('התלונה לא נמצאה');
      } else {
        setError('שגיאה בטעינת פרטי התלונה');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setStatusModalVisible(false);
      setLoading(true);
      
      const response = await axios.patch(
        `${BASE_URL}/api/complaints/${complaintId}/process`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success') {
        setComplaint(response.data.data); // עדכון הנתונים מהתגובה
        Alert.alert('הצלחה', `סטטוס התלונה עודכן ל${STATUS_LABELS[newStatus]}`);
      } else {
        Alert.alert('שגיאה', 'אירעה שגיאה בעדכון הסטטוס');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('שגיאה', error.response?.data?.message || 'אירעה שגיאה בעדכון הסטטוס');
    } finally {
      setLoading(false);
    }
  };

  const addResponse = async () => {
    if (!responseText.trim()) {
      Alert.alert('שגיאה', 'אנא הזן תגובה');
      return;
    }

    try {
      setSubmittingResponse(true);
      
      const response = await axios.post(
        `${BASE_URL}/api/complaints/${complaintId}/respond`,
        {
          message: responseText,
          fromEmployee: true
        },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success') {
        setResponseText('');
        setComplaint(response.data.data); // עדכון הנתונים מהתגובה
        Alert.alert('הצלחה', 'התגובה נשלחה בהצלחה');
      } else {
        Alert.alert('שגיאה', 'אירעה שגיאה בשליחת התגובה');
      }
    } catch (error) {
      console.error('Error adding response:', error);
      Alert.alert('שגיאה', error.response?.data?.message || 'אירעה שגיאה בשליחת התגובה');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyComplaint = () => {
    if (!complaint || !userId) return false;
    
    // יש להתאים לפי מבנה הנתונים שלך - האם assignedTo משתמש במזהה או במספר תעודת זהות
    return complaint.assignedTo === userId || 
           complaint.assignedTo === String(userId) || 
           complaint.assignedTo === Number(userId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>טוען פרטי תלונה...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
        <Text style={styles.errorText}>התלונה לא נמצאה</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = complaint.status || 'open';
  const statusColor = STATUS_COLORS[status] || '#6b7280';
  const statusIcon = STATUS_ICONS[status] || 'alert-circle';
  const statusLabel = STATUS_LABELS[status] || 'ממתין לטיפול';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>פרטי התלונה</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.complaintTitle}>{complaint.title}</Text>
            <Text style={styles.complaintDate}>{formatDate(complaint.createdAt)}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <Ionicons name={statusIcon} size={18} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>
          
          {/* כפתורי פעולה לעובד */}
          {isMyComplaint() && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                onPress={() => setStatusModalVisible(true)}
              >
                <Ionicons name="reload-circle" size={18} color="#ffffff" />
                <Text style={styles.actionButtonText}>עדכן סטטוס</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>פרטי התלונה</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>קטגוריה:</Text>
            <Text style={styles.infoValue}>{complaint.category}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>כתובת:</Text>
            <Text style={styles.infoValue}>{complaint.address}</Text>
          </View>
          
          {complaint.assignedTo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>משויך ל:</Text>
              <Text style={styles.infoValue}>
                {isMyComplaint() ? 'משויך אליך' : 'משויך לעובד אחר'}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>תושב:</Text>
            <Text style={styles.infoValue}>{complaint.citizenName || 'לא צוין'}</Text>
          </View>
          
          {complaint.citizenPhone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>טלפון:</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${complaint.citizenPhone}`)}>
                <Text style={[styles.infoValue, styles.phoneLink]}>{complaint.citizenPhone}</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.sectionSubtitle}>תיאור התלונה</Text>
          <Text style={styles.descriptionText}>{complaint.description}</Text>
          
          {complaint.location && complaint.location.latitude && complaint.location.longitude && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => {
                const url = Platform.select({
                  ios: `maps:${complaint.location.latitude},${complaint.location.longitude}`,
                  android: `geo:${complaint.location.latitude},${complaint.location.longitude}?q=${complaint.location.latitude},${complaint.location.longitude}`
                });
                Linking.canOpenURL(url).then(supported => {
                  if (supported) {
                    return Linking.openURL(url);
                  } else {
                    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${complaint.location.latitude},${complaint.location.longitude}`;
                    return Linking.openURL(googleMapsUrl);
                  }
                });
              }}
            >
              <Ionicons name="location" size={16} color="#ffffff" />
              <Text style={styles.mapButtonText}>הצג במפה</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {complaint.images && complaint.images.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>תמונות מצורפות</Text>
            
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: complaint.images[currentImageIndex].data }} 
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            
            {complaint.images.length > 1 && (
              <View style={styles.imageNavigation}>
                <TouchableOpacity 
                  onPress={() => setCurrentImageIndex(prev => (prev === 0 ? complaint.images.length - 1 : prev - 1))}
                  style={styles.imageNavButton}
                >
                  <Ionicons name="chevron-forward" size={24} color="#2196F3" />
                </TouchableOpacity>
                
                <Text style={styles.imageCounter}>
                  {currentImageIndex + 1} מתוך {complaint.images.length}
                </Text>
                
                <TouchableOpacity 
                  onPress={() => setCurrentImageIndex(prev => (prev === complaint.images.length - 1 ? 0 : prev + 1))}
                  style={styles.imageNavButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#2196F3" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.card}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>התכתבות ועדכונים</Text>
            {complaint.responses && complaint.responses.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{complaint.responses.length}</Text>
              </View>
            )}
          </View>
          
          {complaint.responses && complaint.responses.length > 0 ? (
            <View style={styles.timelineContainer}>
              {complaint.responses.map((response, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View 
                    style={[
                      styles.timelineDot,
                      { 
                        backgroundColor: response.systemGenerated ? '#9ca3af' : 
                                         response.fromEmployee ? '#2196F3' : 
                                         '#10b981' 
                      }
                    ]}
                  />
                  {index < complaint.responses.length - 1 && <View style={styles.timelineLine} />}
                  
                  <View 
                    style={[
                      styles.responseItem,
                      { 
                        backgroundColor: response.systemGenerated ? '#f3f4f6' :
                                         response.fromEmployee ? '#e3f2fd' : 
                                         '#ecfdf5'
                      }
                    ]}
                  >
                    <Text style={styles.responseText}>{response.message}</Text>
                    <View style={styles.responseFooter}>
                      <Text style={styles.responseDate}>
                        {formatDate(response.createdAt)}
                      </Text>
                      <Text 
                        style={[
                          styles.responseSender,
                          {
                            color: response.systemGenerated ? '#6b7280' :
                                   response.fromEmployee ? '#2196F3' : 
                                   '#10b981'
                          }
                        ]}
                      >
                        {response.systemGenerated ? 'מערכת' : 
                         response.fromEmployee ? 'צוות העירייה' : 
                         'תושב'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noResponsesContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color="#d1d5db" />
              <Text style={styles.noResponsesText}>
                אין עדיין תגובות או עדכונים
              </Text>
            </View>
          )}
          
          {/* הוספת תגובה - רק אם התלונה משויכת לעובד זה */}
          {isMyComplaint() && (
            <View style={styles.addResponseContainer}>
              <Text style={styles.responseInputLabel}>הוסף תגובה לתושב</Text>
              <TextInput
                style={styles.responseInput}
                multiline
                numberOfLines={4}
                placeholder="הקלד את תגובתך כאן..."
                value={responseText}
                onChangeText={setResponseText}
                textAlign="right"
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={addResponse}
                disabled={submittingResponse || !responseText.trim()}
              >
                {submittingResponse ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color="#ffffff" />
                    <Text style={styles.sendButtonText}>שלח תגובה</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {complaint.feedback && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>חוות דעת התושב</Text>
            <View style={styles.feedbackContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= complaint.feedback.rating ? 'star' : 'star-outline'}
                    size={24}
                    color={star <= complaint.feedback.rating ? '#f59e0b' : '#d1d5db'}
                    style={{ marginHorizontal: 2 }}
                  />
                ))}
              </View>
              
              {complaint.feedback.comment && (
                <Text style={styles.feedbackComment}>{complaint.feedback.comment}</Text>
              )}
              
              <Text style={styles.feedbackDate}>
                התקבל בתאריך: {formatDate(complaint.feedback.submittedAt)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* מודאל עדכון סטטוס */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>עדכון סטטוס תלונה</Text>
            <Text style={styles.modalSubtitle}>בחר את הסטטוס החדש:</Text>

            <View style={styles.statusOptions}>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.statusOption,
                    { 
                      backgroundColor: STATUS_COLORS[key] + '20',
                      borderColor: STATUS_COLORS[key],
                      borderWidth: 1,
                      opacity: key === status ? 0.5 : 1
                    }
                  ]}
                  onPress={() => key !== status && updateStatus(key)}
                  disabled={key === status}
                >
                  <Ionicons name={STATUS_ICONS[key]} size={18} color={STATUS_COLORS[key]} />
                  <Text style={[styles.statusOptionText, { color: STATUS_COLORS[key] }]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>ביטול</Text>
            </TouchableOpacity>
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
    backgroundColor: '#2196F3',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  complaintDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    fontWeight: '500',
  },
  phoneLink: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  mapButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  imageContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavButton: {
    padding: 8,
  },
  imageCounter: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineContainer: {
    marginLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 12,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    left: 5.5,
    top: 18,
    bottom: -8,
    width: 1,
    backgroundColor: '#e5e7eb',
    zIndex: 1,
  },
  responseItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  responseText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  responseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  responseDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  responseSender: {
    fontSize: 12,
    fontWeight: '500',
  },
  noResponsesContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResponsesText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  addResponseContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  responseInputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  responseInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  feedbackContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  feedbackComment: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2196F3',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '90%',
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
  statusOptions: {
    marginBottom: 24,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EmployeeComplaintDetails;