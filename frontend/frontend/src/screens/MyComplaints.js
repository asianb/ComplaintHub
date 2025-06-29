import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

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

const FilterChips = ({ activeFilter, categories, onFilterChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      <TouchableOpacity
        style={[
          styles.filterChip,
          activeFilter === 'all' && styles.activeFilterChip
        ]}
        onPress={() => onFilterChange('all')}
      >
        <Text style={[
          styles.filterChipText,
          activeFilter === 'all' && styles.activeFilterChipText
        ]}>הכל</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterChip,
          activeFilter === 'open' && styles.activeFilterChip
        ]}
        onPress={() => onFilterChange('open')}
      >
        <Ionicons name={STATUS_ICONS.open} size={16} color={activeFilter === 'open' ? "#ffffff" : STATUS_COLORS.open} />
        <Text style={[
          styles.filterChipText,
          activeFilter === 'open' && styles.activeFilterChipText
        ]}>{STATUS_LABELS.open}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterChip,
          activeFilter === 'in_progress' && styles.activeFilterChip
        ]}
        onPress={() => onFilterChange('in_progress')}
      >
        <Ionicons name={STATUS_ICONS.in_progress} size={16} color={activeFilter === 'in_progress' ? "#ffffff" : STATUS_COLORS.in_progress} />
        <Text style={[
          styles.filterChipText,
          activeFilter === 'in_progress' && styles.activeFilterChipText
        ]}>{STATUS_LABELS.in_progress}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterChip,
          activeFilter === 'resolved' && styles.activeFilterChip
        ]}
        onPress={() => onFilterChange('resolved')}
      >
        <Ionicons name={STATUS_ICONS.resolved} size={16} color={activeFilter === 'resolved' ? "#ffffff" : STATUS_COLORS.resolved} />
        <Text style={[
          styles.filterChipText,
          activeFilter === 'resolved' && styles.activeFilterChipText
        ]}>{STATUS_LABELS.resolved}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterChip,
          activeFilter === 'closed' && styles.activeFilterChip
        ]}
        onPress={() => onFilterChange('closed')}
      >
        <Ionicons name={STATUS_ICONS.closed} size={16} color={activeFilter === 'closed' ? "#ffffff" : STATUS_COLORS.closed} />
        <Text style={[
          styles.filterChipText,
          activeFilter === 'closed' && styles.activeFilterChipText
        ]}>{STATUS_LABELS.closed}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ComplaintCard = ({ complaint, onPress }) => {
  const status = complaint.status || 'open';
  const statusColor = STATUS_COLORS[status] || '#6b7280';
  const statusIcon = STATUS_ICONS[status] || 'alert-circle';
  const statusLabel = STATUS_LABELS[status] || 'ממתין לטיפול';
  
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
  
  return (
    <TouchableOpacity style={styles.complaintCard} onPress={onPress}>
      <View style={styles.complaintHeader}>
        <View style={styles.statusContainer}>
          <Ionicons name={statusIcon} size={18} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        
        <View style={styles.categoryLabel}>
          <Text style={styles.categoryText}>{complaint.category || 'כללי'}</Text>
        </View>
      </View>
      
      <Text style={styles.complaintTitle}>{complaint.title}</Text>
      
      <Text numberOfLines={2} style={styles.complaintDescription}>
        {complaint.description}
      </Text>
      
      <View style={styles.complaintFooter}>
        <Text style={styles.dateText}>
          {complaint.createdAt ? formatDate(complaint.createdAt) : 'ללא תאריך'}
        </Text>
        
        {complaint.responses && complaint.responses.length > 0 && (
          <View style={styles.responseIndicator}>
            <Ionicons name="chatbubble-outline" size={16} color="#4f46e5" />
            <Text style={styles.responseCount}>{complaint.responses.length}</Text>
          </View>
        )}
      </View>
      
      {complaint.assignedTo && (
        <View style={styles.assignmentBadge}>
          <Ionicons name="person" size={14} color="#4f46e5" />
          <Text style={styles.assignmentText}>מטופל ע"י צוות</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const MyComplaints = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const fetchComplaints = async (pageNum = 1, filter = activeFilter, refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    }
    
    try {
      const [[, userId], [, userToken]] = await AsyncStorage.multiGet(['userId', 'userToken']);
      
      if (!userToken || !userId) {
        navigation.replace('Login');
        return;
      }
      
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const response = await axios.get(
        `http://192.168.1.4:5000/my-complaints?page=${pageNum}&limit=10${statusParam}`, 
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const complaintsData = response.data;
      
      const newStats = {
        total: complaintsData.length,
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0
      };
      
      complaintsData.forEach(complaint => {
        if (complaint.status && newStats[complaint.status] !== undefined) {
          newStats[complaint.status]++;
        }
      });
      
      setStats(newStats);
      setCategories([...new Set(complaintsData.map(c => c.category))]);
      
      if (pageNum === 1 || refresh) {
        setComplaints(complaintsData);
      } else {
        setComplaints(prev => [...prev, ...complaintsData]);
      }
      
      setHasMorePages(complaintsData.length >= parseInt(limit));
      setPage(pageNum);
      setError(null);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      
      if (error.response?.status === 401) {
        await AsyncStorage.multiRemove(['userToken', 'userId']);
        navigation.replace('Login');
      } else {
        setError('שגיאה בטעינת הנתונות, נסה שוב');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchComplaints(1, activeFilter, true);
    }, [activeFilter])
  );
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchComplaints(1, filter, true);
  };
  
  const onRefresh = () => {
    fetchComplaints(1, activeFilter, true);
  };
  
  const loadMoreComplaints = () => {
    if (!loading && hasMorePages) {
      fetchComplaints(page + 1, activeFilter);
    }
  };
  
  const renderFooter = () => {
    if (!loading || page === 1) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4f46e5" />
        <Text style={styles.footerText}>טוען תלונות נוספות...</Text>
      </View>
    );
  };
  
  const handleViewComplaint = (complaint) => {
    const complaintId = complaint._id || complaint.id;
    if (complaintId) {
      navigation.navigate('CitizenComplaintDetails', { complaintId });
    } else {
      Alert.alert(
        'שגיאה',
        'לא ניתן לצפות בפרטי התלונה',
        [{ text: 'אישור', style: 'cancel' }]
      );
    }
  };
  
  const getUniqueKey = (item, index) => {
    // First try to use _id if it exists
    if (item._id) {
      return item._id.toString();
    }
    // Fallback to index if no _id (shouldn't happen with proper backend)
    return `complaint-${index}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>התלונות שלי</Text>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={() => navigation.navigate('ComplaintForm')}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total || 0}</Text>
          <Text style={styles.statLabel}>סה"כ</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: STATUS_COLORS.open }]}>{stats.open || 0}</Text>
          <Text style={styles.statLabel}>פתוח</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: STATUS_COLORS.in_progress }]}>{stats.in_progress || 0}</Text>
          <Text style={styles.statLabel}>בטיפול</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: STATUS_COLORS.resolved }]}>{stats.resolved || 0}</Text>
          <Text style={styles.statLabel}>טופל</Text>
        </View>
      </View>
      
      <FilterChips 
        activeFilter={activeFilter} 
        categories={categories}
        onFilterChange={handleFilterChange} 
      />
      
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>טוען תלונות...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>נסה שוב</Text>
          </TouchableOpacity>
        </View>
      ) : complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>לא נמצאו תלונות{activeFilter !== 'all' ? ` במצב ${STATUS_LABELS[activeFilter]}` : ''}</Text>
          <TouchableOpacity 
            style={styles.newComplaintButton}
            onPress={() => navigation.navigate('ComplaintForm')}
          >
            <Text style={styles.newComplaintButtonText}>הגש תלונה חדשה</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item, index) => getUniqueKey(item, index)}
          renderItem={({ item }) => (
            <ComplaintCard 
              complaint={item} 
              onPress={() => handleViewComplaint(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={["#4f46e5"]}
            />
          }
          onEndReached={loadMoreComplaints}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
        />
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginTop: -10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
  },
  filtersContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  filtersContent: {
    paddingHorizontal: 15,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeFilterChip: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterChipText: {
    color: '#4b5563',
    fontSize: 14,
    marginLeft: 4,
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  complaintCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryLabel: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  complaintDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  responseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4f46e5',
  },
  assignmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  assignmentText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4f46e5',
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
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
  emptyText: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  newComplaintButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  newComplaintButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MyComplaints;