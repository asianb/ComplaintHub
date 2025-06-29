import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.3:5000/api';

const FeedbackDashboard = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [categorySelected, setCategorySelected] = useState('all');
  const [userRole, setUserRole] = useState(null);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [serverUrl, setServerUrl] = useState('http://192.168.1.3:5000'); // עודכן לפורט 5000 שבו השרת רץ

  // בדיקת הרשאות ואימות משתמש
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');
        const storedRole = await AsyncStorage.getItem('userRole');
        
        console.log('Token:', token);
        console.log('User string:', userString);
        console.log('User role from storage:', storedRole);
        
        if (!token || !userString) {
          console.log('No token or user found, redirecting to login');
          navigation.replace('LoginScreen'); // Changed to match component name (capital L)
          return;
        }
        
        const user = JSON.parse(userString);
        console.log('User object:', user);
        console.log('User role from object:', user.role);
        
        // וודא שיש למשתמש גישה לדף זה - מנהל או עובד יכולים לצפות במשוב
        if (user.role !== 'admin' && user.role !== 'employee' && user.role !== 'manager') {
          console.log('User role not authorized:', user.role);
          Alert.alert('שגיאת הרשאות', 'אין לך הרשאות לצפייה בדף זה');
          navigation.goBack();
          return;
        }
        
        setUserRole(user.role);
        fetchData(token);
      } catch (error) {
        console.error('Auth check error:', error);
        setError('שגיאה בבדיקת הרשאות');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // הבאת נתונים מהשרת
  const fetchData = async (token) => {
    try {
      setLoading(true);
      console.log('Fetching data with token:', token);
      
      // בצע כמה בקשות במקביל (יותר יעיל)
      const [statsResponse, recentResponse] = await Promise.all([
        axios.get(`${serverUrl}/api/admin/feedback-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${serverUrl}/api/admin/recent-feedback`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      console.log('Stats response:', statsResponse.data);
      console.log('Recent feedback response:', recentResponse.data);
      
      if (statsResponse.data.status === 'success') {
        setStats(statsResponse.data.data);
        setTotalFeedbacks(statsResponse.data.data.overall?.count || 0);
      } else {
        setError('לא ניתן לטעון נתוני סטטיסטיקות');
        console.error('Invalid stats response:', statsResponse.data);
      }
      
      if (recentResponse.data.status === 'success') {
        setRecentFeedback(recentResponse.data.data);
      } else {
        console.error('Invalid feedback response:', recentResponse.data);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching feedback data:', error.response || error.message);
      setError('שגיאה בטעינת נתוני חוות דעת - אנא ודא שהשרת מחובר וקיימים נתונים');
    } finally {
      setLoading(false);
    }
  };

  // רענון נתונים
  const handleRefresh = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        fetchData(token);
      } else {
        setError('לא נמצא טוקן, אנא התחבר מחדש');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setError('שגיאה ברענון נתונים');
    }
  };

  // בחירת קטגוריה להצגה
  const handleCategorySelect = (category) => {
    setCategorySelected(category);
  };

  // הצג נתוני קטגוריה נבחרת או את הנתונים הכלליים
  const getSelectedStats = () => {
    if (!stats) return null;
    
    if (categorySelected === 'all') {
      return stats.overall;
    } else {
      const categoryData = stats.byCategory?.find(cat => cat._id === categorySelected);
      return categoryData || null;
    }
  };

  const selectedStats = getSelectedStats();

  const renderStars = (rating) => {
    const stars = [];
    const fullStar = "star";
    const emptyStar = "star-outline";
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon 
          key={i}
          name={i <= rating ? fullStar : emptyStar}
          size={16}
          color="#f59e0b"
          style={{ marginLeft: 2 }}
        />
      );
    }
    
    return (
      <View style={{ flexDirection: 'row' }}>{stars}</View>
    );
  };

  // תצוגת טעינה
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Avatar.Icon 
          size={60} 
          icon="star" 
          style={{ backgroundColor: '#4f46e520' }}
          color="#4f46e5"
        />
        <Text style={styles.loadingText}>טוען נתוני חוות דעת...</Text>
      </View>
    );
  }

  // תצוגת שגיאה
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Avatar.Icon 
          size={60} 
          icon="alert-circle" 
          style={{ backgroundColor: '#ef444420' }}
          color="#ef4444"
        />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={handleRefresh}
          style={styles.retryButton}
        >
          נסה שוב
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* כותרת */}
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Title style={styles.headerTitle}>סטטיסטיקות חוות דעת</Title>
            <Text style={styles.headerSubtitle}>ניתוח שביעות רצון תושבים</Text>
          </View>
          <IconButton
            icon="arrow-right"
            size={24}
            color="#FFF"
            onPress={() => navigation.goBack()}
          />
        </View>
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* סטטיסטיקות מהירות */}
        {stats && stats.overall && (
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.overall.count || 0}</Text>
                <Text style={styles.statLabel}>סה"כ חוות דעת</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.overall.averageRating?.toFixed(1) || 0}</Text>
                <Text style={styles.statLabel}>דירוג ממוצע</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.byCategory?.length || 0}</Text>
                <Text style={styles.statLabel}>קטגוריות</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* סינון לפי קטגוריות */}
        <Card style={styles.card}>
          <Card.Title title="סינון לפי קטגוריה" />
          <Card.Content>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.filterScroll}
            >
              <Button
                mode={categorySelected === 'all' ? "contained" : "outlined"}
                onPress={() => handleCategorySelect('all')}
                style={styles.filterButton}
                labelStyle={styles.filterButtonText}
              >
                הכל
              </Button>
              
              {stats && stats.byCategory && stats.byCategory.map((category) => (
                <Button
                  key={category._id}
                  mode={categorySelected === category._id ? "contained" : "outlined"}
                  onPress={() => handleCategorySelect(category._id)}
                  style={styles.filterButton}
                  labelStyle={styles.filterButtonText}
                >
                  {category._id}
                </Button>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>

        {/* התפלגות דירוגים */}
        {selectedStats && selectedStats.ratingDistribution && (
          <Card style={styles.card}>
            <Card.Title title="התפלגות דירוגים" />
            <Card.Content>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = selectedStats.ratingDistribution[rating] || 0;
                const percentage = selectedStats.count > 0 
                  ? (count / selectedStats.count) * 100 
                  : 0;
                  
                return (
                  <View key={rating} style={styles.distributionRow}>
                    <View style={styles.ratingLabelContainer}>
                      <Text style={styles.ratingLabel}>{rating}</Text>
                      <Icon name="star" size={14} color="#f59e0b" />
                    </View>
                    <View style={styles.distributionBarContainer}>
                      <View
                        style={[
                          styles.distributionBar,
                          { 
                            width: `${percentage}%`,
                            backgroundColor: rating === 5 ? '#10b981' : 
                                             rating === 4 ? '#3b82f6' :
                                             rating === 3 ? '#f59e0b' :
                                             rating === 2 ? '#f97316' : '#ef4444'
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.distributionCount}>
                      {count} ({percentage.toFixed(1)}%)
                    </Text>
                  </View>
                );
              })}
            </Card.Content>
          </Card>
        )}

        {/* חוות דעת מילוליות אחרונות */}
        <Card style={styles.card}>
          <Card.Title 
            title="חוות דעת אחרונות"
            right={(props) => (
              <IconButton {...props} icon="refresh" onPress={handleRefresh} />
            )}
          />
          <Card.Content>
            {recentFeedback && recentFeedback.length > 0 ? (
              recentFeedback.map((feedback, index) => (
                <View key={index} style={styles.feedbackItem}>
                  <View style={styles.feedbackHeader}>
                    <Avatar.Icon 
                      size={40} 
                      icon="message-text" 
                      style={[styles.feedbackIcon, { 
                        backgroundColor: 
                          feedback.feedback.rating >= 4 ? '#10b98120' : 
                          feedback.feedback.rating >= 3 ? '#f59e0b20' : '#ef444420'
                      }]}
                      color={
                        feedback.feedback.rating >= 4 ? '#10b981' : 
                        feedback.feedback.rating >= 3 ? '#f59e0b' : '#ef4444'
                      }
                    />
                    <View style={styles.feedbackContent}>
                      <Text style={styles.feedbackTitle} numberOfLines={1}>{feedback.title}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.feedbackCategory}>{feedback.category}</Text>
                        <View style={styles.ratingContainer}>
                          {renderStars(feedback.feedback.rating)}
                        </View>
                      </View>
                    </View>
                  </View>
                  {feedback.feedback.comment ? (
                    <Text style={styles.feedbackComment}>{feedback.feedback.comment}</Text>
                  ) : (
                    <Text style={styles.noComment}>אין הערות נוספות</Text>
                  )}
                  <Text style={styles.feedbackDate}>
                    {new Date(feedback.feedback.submittedAt).toLocaleDateString('he-IL')}
                  </Text>
                  <Divider style={styles.feedbackDivider} />
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Avatar.Icon 
                  size={60} 
                  icon="message-text-outline" 
                  style={{ backgroundColor: '#e5e7eb' }}
                  color="#9ca3af"
                />
                <Text style={styles.emptyText}>אין עדיין חוות דעת מילוליות</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'right',
  },
  content: {
    padding: 20,
  },
  statsCard: {
    elevation: 4,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginTop: -40,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  verticalDivider: {
    height: '100%',
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  filterScroll: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filterButton: {
    marginHorizontal: 4,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 4,
  },
  distributionBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 6,
  },
  distributionCount: {
    fontSize: 12,
    color: '#6b7280',
    width: 70,
    textAlign: 'right',
  },
  feedbackItem: {
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  feedbackIcon: {
    marginLeft: 12,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 4,
  },
  feedbackCategory: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackComment: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    textAlign: 'right',
    paddingRight: 52,
    marginBottom: 8,
  },
  noComment: {
    fontSize: 15,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'right',
    paddingRight: 52,
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    paddingRight: 52,
  },
  feedbackDivider: {
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
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
    marginTop: 16,
    backgroundColor: '#4f46e5',
  },
});

export default FeedbackDashboard;