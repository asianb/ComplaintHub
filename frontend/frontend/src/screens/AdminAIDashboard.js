// AdminAIDashboard.js - דשבורד AI למנהל עם DeepSeek
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AdminAIDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('שגיאה', 'לא נמצא טוקן אימות');
        return;
      }

      const response = await fetch('http://192.168.1.3:5000/api/admin/ai-dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setDashboardData(data.data);
      } else {
        Alert.alert('שגיאה', data.message || 'שגיאה בטעינת נתונים');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('שגיאה', 'שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const navigateToDetail = (screen) => {
    navigation.navigate(screen);
  };

  const renderOverviewCard = (title, value, icon, color, onPress) => (
    <TouchableOpacity style={[styles.overviewCard, { borderColor: color }]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
    </TouchableOpacity>
  );

  const renderSentimentChart = () => {
    if (!dashboardData?.aiInsights?.sentimentDistribution) return null;
    
    const sentiments = dashboardData.aiInsights.sentimentDistribution;
    const total = Object.values(sentiments).reduce((sum, val) => sum + val, 0);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>ניתוח סנטימנט</Text>
        <View style={styles.chartBars}>
          {Object.entries(sentiments).map(([sentiment, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const color = getSentimentColor(sentiment);
            
            return (
              <View key={sentiment} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: `${percentage}%`, 
                        backgroundColor: color 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.barInfo}>
                  <Text style={styles.barLabel}>{getSentimentLabel(sentiment)}</Text>
                  <Text style={styles.barValue}>{count}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderUrgencyChart = () => {
    if (!dashboardData?.aiInsights?.urgencyDistribution) return null;
    
    const urgencies = dashboardData.aiInsights.urgencyDistribution;
    const total = Object.values(urgencies).reduce((sum, val) => sum + val, 0);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>רמות דחיפות</Text>
        <View style={styles.chartBars}>
          {Object.entries(urgencies).map(([urgency, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const color = getUrgencyColor(urgency);
            
            return (
              <View key={urgency} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: `${percentage}%`, 
                        backgroundColor: color 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.barInfo}>
                  <Text style={styles.barLabel}>{getUrgencyLabel(urgency)}</Text>
                  <Text style={styles.barValue}>{count}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderAlerts = () => {
    if (!dashboardData?.alerts || dashboardData.alerts.length === 0) {
      return (
        <View style={styles.alertsContainer}>
          <Text style={styles.alertsTitle}>התראות מערכת</Text>
          <View style={styles.noAlertsContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.noAlertsText}>אין התראות פעילות</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.alertsContainer}>
        <Text style={styles.alertsTitle}>התראות מערכת</Text>
        {dashboardData.alerts.map((alert, index) => (
          <View key={index} style={[styles.alertItem, { backgroundColor: getAlertColor(alert.type) }]}>
            <View style={styles.alertIcon}>
              <Ionicons 
                name={getAlertIcon(alert.type)} 
                size={20} 
                color="#fff" 
              />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <TouchableOpacity 
                style={styles.alertAction}
                onPress={() => handleAlertAction(alert.action)}
              >
                <Text style={styles.alertActionText}>טפל עכשיו</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const handleAlertAction = (action) => {
    switch (action) {
      case 'view-critical-complaints':
        navigateToDetail('HighRiskComplaints');
        break;
      case 'review-urgent-complaints':
        navigateToDetail('AIAnalysis');
        break;
      case 'allocate-resources':
        navigateToDetail('TrendsReport');
        break;
      default:
        Alert.alert('מידע', 'פעולה זו עדיין לא מוכנה');
    }
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>פעולות מהירות</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigateToDetail('AIAnalysis')}
        >
          <Ionicons name="analytics" size={32} color="#2196F3" />
          <Text style={styles.quickActionText}>ניתוח מלא</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigateToDetail('HighRiskComplaints')}
        >
          <Ionicons name="warning" size={32} color="#FF5722" />
          <Text style={styles.quickActionText}>תלונות בסיכון</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigateToDetail('TrendsReport')}
        >
          <Ionicons name="trending-up" size={32} color="#4CAF50" />
          <Text style={styles.quickActionText}>דוח מגמות</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => loadDashboardData()}
        >
          <Ionicons name="refresh" size={32} color="#9C27B0" />
          <Text style={styles.quickActionText}>רענן נתונים</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#FF5722';
      case 'urgent': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getSentimentLabel = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'חיובי';
      case 'negative': return 'שלילי';
      case 'urgent': return 'דחוף';
      default: return 'נייטרלי';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'critical': return 'קריטי';
      case 'high': return 'גבוה';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return 'לא ידוע';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      default: return '#757575';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return 'alert-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>טוען נתוני AI...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#FF5722" />
        <Text style={styles.errorText}>שגיאה בטעינת נתונים</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>דשבורד AI - DeepSeek</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* סקירה כללית */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>סקירה כללית</Text>
          <View style={styles.overviewGrid}>
            {renderOverviewCard(
              'סה״כ תלונות',
              dashboardData.overview?.totalComplaints || 0,
              'document-text',
              '#2196F3',
              () => navigateToDetail('AIAnalysis')
            )}
            {renderOverviewCard(
              'תלונות פתוחות',
              dashboardData.overview?.openComplaints || 0,
              'time',
              '#FF9800',
              () => navigateToDetail('HighRiskComplaints')
            )}
            {renderOverviewCard(
              'דירוג ממוצע',
              dashboardData.overview?.averageRating ? 
                `${dashboardData.overview.averageRating.toFixed(1)}⭐` : 'אין נתונים',
              'star',
              '#4CAF50',
              () => Alert.alert('מידע', 'דירוג ממוצע מחוות דעת תושבים')
            )}
            {renderOverviewCard(
              'ניתוחים AI',
              dashboardData.aiInsights?.analyzedComplaints || 0,
              'brain',
              '#9C27B0',
              () => navigateToDetail('AIAnalysis')
            )}
          </View>
        </View>

        {/* ניתוחי AI */}
        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>ניתוחי בינה מלאכותית</Text>
          {renderSentimentChart()}
          {renderUrgencyChart()}
        </View>

        {/* התראות */}
        {renderAlerts()}

        {/* פעולות מהירות */}
        {renderQuickActions()}

        {/* מידע מערכת */}
        <View style={styles.systemInfo}>
          <Text style={styles.systemInfoTitle}>מידע מערכת</Text>
          <Text style={styles.systemInfoText}>
            עדכון אחרון: {dashboardData.lastUpdated ? 
              new Date(dashboardData.lastUpdated).toLocaleString('he-IL') : 
              'לא ידוע'}
          </Text>
          <Text style={styles.systemInfoText}>
            מודל AI: DeepSeek Chat
          </Text>
          <Text style={styles.systemInfoText}>
            סטטוס: פעיל ✅
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  overviewSection: {
    padding: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aiSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartBars: {
    gap: 10,
  },
  barContainer: {
    marginBottom: 8,
  },
  barWrapper: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  barInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  alertsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  noAlertsContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noAlertsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  alertItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  alertAction: {
    alignSelf: 'flex-start',
  },
  alertActionText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  systemInfo: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  systemInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  systemInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default AdminAIDashboard;