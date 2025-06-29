// AIAnalysisScreen.js - מסך ניתוח AI מפורט של כל התלונות
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AIAnalysisScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('riskScore');

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('שגיאה', 'לא נמצא טוקן אימות');
        return;
      }

      const response = await fetch('http://192.168.1.3:5000/api/admin/ai-analysis', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setAnalysisData(data.data);
      } else {
        Alert.alert('שגיאה', data.message || 'שגיאה בטעינת ניתוח AI');
      }
    } catch (error) {
      console.error('Error loading AI analysis:', error);
      Alert.alert('שגיאה', 'שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const openComplaintModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const getFilteredComplaints = () => {
    if (!analysisData?.complaints) return [];
    
    let filtered = [...analysisData.complaints];
    
    // סינון לפי סוג
    if (filterType !== 'all') {
      switch (filterType) {
        case 'high-risk':
          filtered = filtered.filter(c => c.aiAnalysis.riskScore >= 0.7);
          break;
        case 'urgent':
          filtered = filtered.filter(c => 
            c.aiAnalysis.urgency === 'critical' || c.aiAnalysis.urgency === 'high'
          );
          break;
        case 'negative':
          filtered = filtered.filter(c => 
            c.aiAnalysis.sentiment === 'negative' || c.aiAnalysis.sentiment === 'urgent'
          );
          break;
        case 'category-mismatch':
          filtered = filtered.filter(c => !c.aiAnalysis.categoryMatch);
          break;
      }
    }
    
    // מיון
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'riskScore':
          return b.aiAnalysis.riskScore - a.aiAnalysis.riskScore;
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'urgency':
          const urgencyOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return (urgencyOrder[b.aiAnalysis.urgency] || 0) - (urgencyOrder[a.aiAnalysis.urgency] || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const renderComplaintCard = ({ item }) => {
    const analysis = item.aiAnalysis;
    const riskColor = getRiskColor(analysis.riskScore);
    const urgencyColor = getUrgencyColor(analysis.urgency);
    
    return (
      <TouchableOpacity 
        style={[styles.complaintCard, { borderLeftColor: riskColor }]}
        onPress={() => openComplaintModal(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.complaintTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
            <Text style={styles.riskText}>
              {Math.round(analysis.riskScore * 100)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.analysisRow}>
            <View style={styles.analysisItem}>
              <Ionicons 
                name={getSentimentIcon(analysis.sentiment)} 
                size={16} 
                color={getSentimentColor(analysis.sentiment)} 
              />
              <Text style={styles.analysisText}>
                {getSentimentLabel(analysis.sentiment)}
              </Text>
            </View>
            
            <View style={styles.analysisItem}>
              <Ionicons 
                name="alert-circle" 
                size={16} 
                color={urgencyColor} 
              />
              <Text style={styles.analysisText}>
                {getUrgencyLabel(analysis.urgency)}
              </Text>
            </View>
          </View>
          
          <View style={styles.analysisRow}>
            <View style={styles.analysisItem}>
              <Ionicons name="folder" size={16} color="#666" />
              <Text style={styles.analysisText}>
                {analysis.aiCategory}
              </Text>
            </View>
            
            {!analysis.categoryMatch && (
              <View style={styles.mismatchBadge}>
                <Ionicons name="warning" size={12} color="#FF9800" />
                <Text style={styles.mismatchText}>אי התאמה</Text>
              </View>
            )}
          </View>
          
          {analysis.keywords && analysis.keywords.length > 0 && (
            <View style={styles.keywordsContainer}>
              <Text style={styles.keywordsTitle}>מילות מפתח:</Text>
              <View style={styles.keywordsList}>
                {analysis.keywords.slice(0, 3).map((keyword, index) => (
                  <View key={index} style={styles.keywordTag}>
                    <Text style={styles.keywordText}>{keyword}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString('he-IL')}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButtons = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
      {[
        { key: 'all', label: 'הכל', icon: 'list' },
        { key: 'high-risk', label: 'סיכון גבוה', icon: 'warning' },
        { key: 'urgent', label: 'דחוף', icon: 'alert-circle' },
        { key: 'negative', label: 'שלילי', icon: 'sad' },
        { key: 'category-mismatch', label: 'אי התאמה', icon: 'swap-horizontal' }
      ].map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            filterType === filter.key && styles.filterButtonActive
          ]}
          onPress={() => setFilterType(filter.key)}
        >
          <Ionicons 
            name={filter.icon} 
            size={16} 
            color={filterType === filter.key ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.filterText,
            filterType === filter.key && styles.filterTextActive
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSortButtons = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortTitle}>מיון לפי:</Text>
      <View style={styles.sortButtons}>
        {[
          { key: 'riskScore', label: 'סיכון' },
          { key: 'urgency', label: 'דחיפות' },
          { key: 'createdAt', label: 'תאריך' }
        ].map((sort) => (
          <TouchableOpacity
            key={sort.key}
            style={[
              styles.sortButton,
              sortBy === sort.key && styles.sortButtonActive
            ]}
            onPress={() => setSortBy(sort.key)}
          >
            <Text style={[
              styles.sortText,
              sortBy === sort.key && styles.sortTextActive
            ]}>
              {sort.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSummaryStats = () => {
    if (!analysisData?.summary) return null;
    
    const { summary } = analysisData;
    
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>סיכום ניתוח AI</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{analysisData.totalAnalyzed}</Text>
            <Text style={styles.statLabel}>תלונות נותחו</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.highRiskCount}</Text>
            <Text style={styles.statLabel}>סיכון גבוה</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.categoryMismatches}</Text>
            <Text style={styles.statLabel}>אי התאמות</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {summary.urgencyStats.critical + summary.urgencyStats.high}
            </Text>
            <Text style={styles.statLabel}>דחופות</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderComplaintModal = () => {
    if (!selectedComplaint) return null;
    
    const analysis = selectedComplaint.aiAnalysis;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ניתוח AI מפורט</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.complaintModalTitle}>
                {selectedComplaint.title}
              </Text>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>ציון סיכון</Text>
                <View style={styles.riskScoreContainer}>
                  <View style={[
                    styles.riskScoreBar,
                    { width: `${analysis.riskScore * 100}%`, backgroundColor: getRiskColor(analysis.riskScore) }
                  ]} />
                  <Text style={styles.riskScoreText}>
                    {Math.round(analysis.riskScore * 100)}% סיכון
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>ניתוח סנטימנט</Text>
                <View style={styles.sentimentContainer}>
                  <Ionicons 
                    name={getSentimentIcon(analysis.sentiment)} 
                    size={24} 
                    color={getSentimentColor(analysis.sentiment)} 
                  />
                  <Text style={styles.sentimentText}>
                    {getSentimentLabel(analysis.sentiment)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>רמת דחיפות</Text>
                <View style={styles.urgencyContainer}>
                  <View style={[
                    styles.urgencyBadge,
                    { backgroundColor: getUrgencyColor(analysis.urgency) }
                  ]}>
                    <Text style={styles.urgencyBadgeText}>
                      {getUrgencyLabel(analysis.urgency)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>קטגוריזציה</Text>
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryText}>
                    קטגוריה מקורית: {selectedComplaint.originalCategory}
                  </Text>
                  <Text style={styles.categoryText}>
                    קטגוריה מוצעת AI: {analysis.aiCategory}
                  </Text>
                  {!analysis.categoryMatch && (
                    <Text style={styles.categoryMismatch}>
                      ⚠️ אי התאמה בקטגוריזציה
                    </Text>
                  )}
                </View>
              </View>
              
              {analysis.keywords && analysis.keywords.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>מילות מפתח</Text>
                  <View style={styles.modalKeywords}>
                    {analysis.keywords.map((keyword, index) => (
                      <View key={index} style={styles.modalKeywordTag}>
                        <Text style={styles.modalKeywordText}>{keyword}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>פרטי התלונה</Text>
                <Text style={styles.modalInfoText}>
                  סטטוס: {getStatusLabel(selectedComplaint.status)}
                </Text>
                <Text style={styles.modalInfoText}>
                  תאריך: {new Date(selectedComplaint.createdAt).toLocaleDateString('he-IL')}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // פונקציות עזר
  const getRiskColor = (score) => {
    if (score >= 0.8) return '#F44336';
    if (score >= 0.6) return '#FF9800';
    if (score >= 0.4) return '#FFC107';
    return '#4CAF50';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'urgent': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'happy';
      case 'negative': return 'sad';
      case 'urgent': return 'warning';
      default: return 'remove';
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
      default: return 'לא ידוע';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>מבצע ניתוח AI...</Text>
        <Text style={styles.loadingSubtext}>זה עלול לקחת כמה רגעים</Text>
      </View>
    );
  }

  if (!analysisData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#FF5722" />
        <Text style={styles.errorText}>שגיאה בטעינת ניתוח AI</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalysisData}>
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredComplaints = getFilteredComplaints();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ניתוח AI מפורט</Text>
        <TouchableOpacity onPress={loadAnalysisData}>
          <Ionicons name="refresh" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {renderSummaryStats()}
      {renderFilterButtons()}
      {renderSortButtons()}

      <FlatList
        data={filteredComplaints}
        renderItem={renderComplaintCard}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.emptyText}>לא נמצאו תלונות המתאימות לסינון</Text>
          </View>
        }
      />

      {renderComplaintModal()}
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
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  sortTitle: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  sortTextActive: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  complaintCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    paddingBottom: 10,
  },
  complaintTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    paddingHorizontal: 15,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  analysisText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  mismatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  mismatchText: {
    marginLeft: 3,
    fontSize: 10,
    color: '#FF9800',
  },
  keywordsContainer: {
    marginTop: 8,
  },
  keywordsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 3,
  },
  keywordText: {
    fontSize: 10,
    color: '#1976D2',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  complaintModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  riskScoreContainer: {
    position: 'relative',
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  riskScoreBar: {
    height: '100%',
    borderRadius: 10,
  },
  riskScoreText: {
    position: 'absolute',
    top: 2,
    left: 8,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  urgencyContainer: {
    flexDirection: 'row',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  urgencyBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryContainer: {
    gap: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryMismatch: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  modalKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  modalKeywordTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalKeywordText: {
    fontSize: 12,
    color: '#1976D2',
  },
  modalInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default AIAnalysisScreen;