// TrendsReportScreen.js - מסך דוח מגמות בעזרת AI
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Share,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TrendsReportScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trendsData, setTrendsData] = useState(null);

  useEffect(() => {
    loadTrendsReport();
  }, []);

  const loadTrendsReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('שגיאה', 'לא נמצא טוקן אימות');
        return;
      }

      const response = await fetch('http://192.168.1.3:5000/api/admin/ai-trends-report', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setTrendsData(data.data);
      } else {
        Alert.alert('שגיאה', data.message || 'שגיאה בטעינת דוח מגמות');
      }
    } catch (error) {
      console.error('Error loading trends report:', error);
      Alert.alert('שגיאה', 'שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrendsReport();
  };

  const shareReport = async () => {
    try {
      if (!trendsData?.aiReport) {
        Alert.alert('שגיאה', 'אין דוח לשיתוף');
        return;
      }

      const reportText = `דוח מגמות תלונות - ${new Date().toLocaleDateString('he-IL')}\n\n${trendsData.aiReport}\n\nסה"כ תלונות: ${trendsData.totalComplaints}`;
      
      await Share.share({
        message: reportText,
        title: 'דוח מגמות תלונות'
      });
    } catch (error) {
      console.error('Error sharing report:', error);
      Alert.alert('שגיאה', 'שגיאה בשיתוף הדוח');
    }
  };

  const renderAIReport = () => {
    if (!trendsData?.aiReport) return null;

    return (
      <View style={styles.aiReportContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics" size={24} color="#2196F3" />
          <Text style={styles.sectionTitle}>דוח מגמות - ניתוח AI</Text>
          <TouchableOpacity onPress={shareReport}>
            <Ionicons name="share" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.aiReportContent}>
          <Text style={styles.aiReportText}>{trendsData.aiReport}</Text>
        </View>
        
        <View style={styles.reportMeta}>
          <Text style={styles.reportMetaText}>
            📊 מבוסס על {trendsData.totalComplaints} תלונות
          </Text>
          <Text style={styles.reportMetaText}>
            🤖 נוצר על ידי DeepSeek AI
          </Text>
          <Text style={styles.reportMetaText}>
            📅 {new Date(trendsData.generatedAt).toLocaleDateString('he-IL')}
          </Text>
        </View>
      </View>
    );
  };

  const renderStatisticsCards = () => {
    if (!trendsData?.statistics) return null;

    const { byCategory, byStatus, byMonth } = trendsData.statistics;

    return (
      <View style={styles.statisticsContainer}>
        <Text style={styles.sectionTitle}>סטטיסטיקות מפורטות</Text>
        
        {/* סטטיסטיקות לפי קטגוריה */}
        <View style={styles.statsCard}>
          <View style={styles.statsCardHeader}>
            <Ionicons name="folder" size={20} color="#4CAF50" />
            <Text style={styles.statsCardTitle}>התפלגות לפי קטגוריה</Text>
          </View>
          <View style={styles.statsContent}>
            {Object.entries(byCategory).map(([category, count]) => (
              <View key={category} style={styles.statRow}>
                <Text style={styles.statLabel}>{category}</Text>
                <View style={styles.statValueContainer}>
                  <View 
                    style={[
                      styles.statBar, 
                      { 
                        width: `${(count / Math.max(...Object.values(byCategory))) * 100}%`,
                        backgroundColor: getCategoryColor(category)
                      }
                    ]} 
                  />
                  <Text style={styles.statValue}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* סטטיסטיקות לפי סטטוס */}
        <View style={styles.statsCard}>
          <View style={styles.statsCardHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#FF9800" />
            <Text style={styles.statsCardTitle}>התפלגות לפי סטטוס</Text>
          </View>
          <View style={styles.statsContent}>
            {Object.entries(byStatus).map(([status, count]) => (
              <View key={status} style={styles.statRow}>
                <Text style={styles.statLabel}>{getStatusLabel(status)}</Text>
                <View style={styles.statValueContainer}>
                  <View 
                    style={[
                      styles.statBar, 
                      { 
                        width: `${(count / Math.max(...Object.values(byStatus))) * 100}%`,
                        backgroundColor: getStatusColor(status)
                      }
                    ]} 
                  />
                  <Text style={styles.statValue}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* סטטיסטיקות לפי חודש */}
        <View style={styles.statsCard}>
          <View style={styles.statsCardHeader}>
            <Ionicons name="calendar" size={20} color="#9C27B0" />
            <Text style={styles.statsCardTitle}>מגמות חודשיות</Text>
          </View>
          <View style={styles.statsContent}>
            {Object.entries(byMonth)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([month, count]) => (
              <View key={month} style={styles.statRow}>
                <Text style={styles.statLabel}>{formatMonth(month)}</Text>
                <View style={styles.statValueContainer}>
                  <View 
                    style={[
                      styles.statBar, 
                      { 
                        width: `${(count / Math.max(...Object.values(byMonth))) * 100}%`,
                        backgroundColor: '#9C27B0'
                      }
                    ]} 
                  />
                  <Text style={styles.statValue}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderInsights = () => {
    if (!trendsData?.statistics) return null;

    const { byCategory, byStatus } = trendsData.statistics;
    const totalComplaints = trendsData.totalComplaints;
    
    // חישוב insights
    const mostCommonCategory = Object.entries(byCategory).reduce((a, b) => 
      byCategory[a[0]] > byCategory[b[0]] ? a : b
    );
    
    const openComplaints = byStatus.open || 0;
    const resolvedComplaints = byStatus.resolved || 0;
    const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;

    return (
      <View style={styles.insightsContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb" size={24} color="#FFC107" />
          <Text style={styles.sectionTitle}>תובנות מרכזיות</Text>
        </View>

        <View style={styles.insightsList}>
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>קטגוריה מובילה</Text>
              <Text style={styles.insightText}>
                {mostCommonCategory[0]} עם {mostCommonCategory[1]} תלונות
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>שיעור פתרון</Text>
              <Text style={styles.insightText}>
                {resolutionRate}% מהתלונות נפתרו
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Ionicons name="time" size={20} color="#FF9800" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>תלונות פתוחות</Text>
              <Text style={styles.insightText}>
                {openComplaints} תלונות ממתינות לטיפול
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Ionicons name="bar-chart" size={20} color="#9C27B0" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>סה"כ תלונות</Text>
              <Text style={styles.insightText}>
                {totalComplaints} תלונות נותחו
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderActionRecommendations = () => {
    if (!trendsData?.statistics) return null;

    const { byCategory, byStatus } = trendsData.statistics;
    const openComplaints = byStatus.open || 0;
    const totalComplaints = trendsData.totalComplaints;

    // יצירת המלצות דינמיות
    const recommendations = [];

    if (openComplaints > totalComplaints * 0.3) {
      recommendations.push({
        icon: 'alert-circle',
        color: '#F44336',
        title: 'תשומת לב נדרשת',
        description: 'יותר מ-30% מהתלונות עדיין פתוחות. מומלץ להגדיל את כוח האדם.',
        action: 'הקצה משאבים'
      });
    }

    const topCategory = Object.entries(byCategory).reduce((a, b) => 
      byCategory[a[0]] > byCategory[b[0]] ? a : b
    );

    if (topCategory[1] > totalComplaints * 0.4) {
      recommendations.push({
        icon: 'trending-up',
        color: '#FF9800',
        title: 'מגמה בקטגוריה',
        description: `${topCategory[0]} מהווה ${Math.round((topCategory[1] / totalComplaints) * 100)}% מהתלונות. מומלץ לבחון פתרון יסודי.`,
        action: 'בחן פתרון'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        icon: 'checkmark-circle',
        color: '#4CAF50',
        title: 'מצב טוב',
        description: 'הטיפול בתלונות מתבצע ביעילות. המשיכו כך!',
        action: 'המשך כמו כן'
      });
    }

    return (
      <View style={styles.recommendationsContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="lightbulb" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>המלצות לפעולה</Text>
        </View>

        <View style={styles.recommendationsList}>
          {recommendations.map((rec, index) => (
            <View key={index} style={[styles.recommendationItem, { borderLeftColor: rec.color }]}>
              <View style={styles.recommendationHeader}>
                <Ionicons name={rec.icon} size={20} color={rec.color} />
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
              </View>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
              <TouchableOpacity 
                style={[styles.recommendationAction, { backgroundColor: rec.color }]}
                onPress={() => Alert.alert('פעולה', `יישום: ${rec.action}`)}
              >
                <Text style={styles.recommendationActionText}>{rec.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // פונקציות עזר
  const getCategoryColor = (category) => {
    const colors = [
      '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#8BC34A'
    ];
    const index = Object.keys(trendsData?.statistics?.byCategory || {}).indexOf(category);
    return colors[index % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#FF9800';
      case 'in_progress': return '#2196F3';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'פתוח';
      case 'in_progress': return 'בטיפול';
      case 'resolved': return 'טופל';
      case 'closed': return 'סגור';
      default: return status;
    }
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>יוצר דוח מגמות...</Text>
        <Text style={styles.loadingSubtext}>AI מנתח את הנתונים</Text>
      </View>
    );
  }

  if (!trendsData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#FF5722" />
        <Text style={styles.errorText}>שגיאה בטעינת דוח מגמות</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTrendsReport}>
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
        <Text style={styles.headerTitle}>דוח מגמות AI</Text>
        <TouchableOpacity onPress={shareReport}>
          <Ionicons name="share" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderAIReport()}
        {renderInsights()}
        {renderStatisticsCards()}
        {renderActionRecommendations()}
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
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  aiReportContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  aiReportContent: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  aiReportText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    textAlign: 'right',
  },
  reportMeta: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  reportMetaText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  insightsContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightsList: {
    gap: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 12,
    color: '#666',
  },
  statisticsContainer: {
    margin: 15,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  statsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  statsContent: {
    padding: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  statBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    minWidth: 20,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'right',
  },
  recommendationsContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationsList: {
    gap: 15,
  },
  recommendationItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  recommendationActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TrendsReportScreen;