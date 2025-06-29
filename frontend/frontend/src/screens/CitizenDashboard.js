import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// קומפוננטת סיכום סטטיסטיקות
const StatsCard = ({ title, value, icon, color }) => (
  <View style={[styles.statsCard, { borderLeftWidth: 3, borderLeftColor: color }]}>
    <Ionicons name={icon} size={24} color={color} />
    <View style={styles.statsContent}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={[styles.statsValue, { color }]}>{value}</Text>
    </View>
  </View>
);

// קומפוננטת תלונה
const ComplaintCard = ({ complaint, onPress }) => {
  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return { icon: 'time', color: '#92400e', text: 'ממתין לטיפול' };
      case 'in_progress':
        return { icon: 'reload', color: '#1e40af', text: 'בטיפול' };
      case 'resolved':
        return { icon: 'checkmark-circle', color: '#166534', text: 'טופל' };
      default:
        return { icon: 'alert-circle', color: '#6b7280', text: 'לא ידוע' };
    }
  };

  const statusDetails = getStatusDetails(complaint.status);

  return (
    <TouchableOpacity onPress={onPress} style={styles.complaintCard}>
      <View style={styles.complaintHeader}>
        <View style={styles.complaintHeaderLeft}>
          <Ionicons name={statusDetails.icon} size={20} color={statusDetails.color} />
          <Text style={[styles.statusText, { color: statusDetails.color }]}>
            {statusDetails.text}
          </Text>
        </View>
        <Text style={styles.complaintId}>#{complaint.id}</Text>
      </View>
      <Text style={styles.complaintTitle}>{complaint.title}</Text>
      <Text style={styles.complaintDate}>
        {new Date(complaint.createdAt).toLocaleDateString('he-IL')}
      </Text>
      <Text numberOfLines={2} style={styles.complaintDescription}>
        {complaint.description}
      </Text>
      {complaint.status === 'in_progress' && complaint.lastUpdate && (
        <View style={styles.updateContainer}>
          <Ionicons name="information-circle" size={16} color="#4f46e5" />
          <Text style={styles.updateText}>עדכון אחרון: {complaint.lastUpdate}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// קומפוננטת פרופיל מקוצר
const ProfilePreview = ({ user, onProfilePress }) => (
  <TouchableOpacity onPress={onProfilePress} style={styles.profilePreview}>
    <View style={styles.profileInfo}>
      <View style={styles.profilePhotoPlaceholder}>
        <Ionicons name="person" size={30} color="#ffffff" />
      </View>
      <View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#6b7280" />
  </TouchableOpacity>
);

// קומפוננטת פעולה מהירה
const QuickAction = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={styles.quickActionIcon}>
      <Ionicons name={icon} size={24} color="#4f46e5" />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

const CitizenDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
    fetchComplaints();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const [[, userId], [, userToken]] = await AsyncStorage.multiGet(['userId', 'userToken']);
      
//       if (!userToken || !userId) {
//         navigation.replace('Login');
//         return;
//       }

//       const response = await axios.get(`http://172.19.36.139:5000/my-complaints`, {
//         headers: {
//           'Authorization': `Bearer ${userToken}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       setComplaints(response.data);
      
//       // חישוב סטטיסטיקות
//       const newStats = response.data.reduce((acc, complaint) => {
//         acc.total++;
//         acc[complaint.status]++;
//         return acc;
//       }, { total: 0, pending: 0, in_progress: 0, resolved: 0 });
      
//       setStats(newStats);
//       setError(null);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         await AsyncStorage.multiRemove(['userToken', 'userId']);
//         navigation.replace('Login');
//       } else {
//         setError('שגיאה בטעינת הנתונים');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

const fetchComplaints = async () => {
    setLoading(true);
    try {
      const [[, userId], [, userToken]] = await AsyncStorage.multiGet(['userId', 'userToken']);
      
      if (!userToken || !userId) {
        navigation.replace('Login');
        return;
      }

      const response = await axios.get(`http://192.168.1.4:5000/my-complaints`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      setComplaints(response.data);
      
      // עדכון חישוב הסטטיסטיקות
      const newStats = response.data.reduce((acc, complaint) => {
        // מגדילים את הספירה הכוללת
        acc.total++;
        
        // מעדכנים את הספירה לפי סטטוס
        switch (complaint.status) {
          case 'pending':
            acc.pending++;
            break;
          case 'in_progress':
            acc.in_progress++;
            break;
          case 'resolved':
            acc.resolved++;
            break;
        }
        return acc;
      }, { total: 0, pending: 0, in_progress: 0, resolved: 0 });
      
      setStats(newStats);
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        await AsyncStorage.multiRemove(['userToken', 'userId']);
        navigation.replace('Login');
      } else {
        setError('שגיאה בטעינת הנתונים');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userId', 'userData']);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.navigationBar}>
        <Text style={styles.title}>דשבורד אזרח</Text>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComplaints = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchComplaints} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>נסה שוב</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (complaints.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyStateText}>אין תלונות להצגה</Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('NewComplaint')}
          >
            <Text style={styles.emptyStateButtonText}>הגש תלונה חדשה</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return complaints.slice(0, 3).map((complaint) => (
      <ComplaintCard
        key={`complaint-${complaint.id}`}
        complaint={complaint}
        onPress={() => navigation.navigate('ComplaintDetails', { complaintId: complaint.id })}
      />
    ));
  };
  
  return (
    <View style={styles.container}>
           {renderHeader()}


      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchComplaints} />
        }
      >
        {user && (
          <ProfilePreview 
            user={user}
            onProfilePress={() => navigation.navigate('Profile')}
          />
        )}

        <View style={styles.quickActions}>
          <QuickAction
            icon="add-circle"
            title="תלונה חדשה"
            onPress={() => navigation.navigate('ComplaintForm')}
          />
          <QuickAction
            icon="document-text"
            title="התלונות שלי"
            onPress={() => navigation.navigate('MyComplaints')}
          />
          <QuickAction
            icon="person"
            title="הפרופיל שלי"
            onPress={() => navigation.navigate('ProfileScreen')}
          />
        </View>

        <Text style={styles.sectionTitle}>סיכום תלונות</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <StatsCard
            key="stats-total"
            title="סה״כ תלונות"
            value={stats.total}
            icon="documents"
            color="#4f46e5"
          />
          <StatsCard
            key="stats-pending"
            title="ממתינות לטיפול"
            value={stats.pending}
            icon="time"
            color="#92400e"
          />
          <StatsCard
            key="stats-progress"
            title="בטיפול פעיל"
            value={stats.in_progress}
            icon="reload"
            color="#1e40af"
          />
          <StatsCard
            key="stats-resolved"
            title="הסתיים הטיפול"
            value={stats.resolved}
            icon="checkmark-circle"
            color="#166534"
          />
        </ScrollView>

        <View style={styles.complaintsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>תלונות אחרונות</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyComplaints')}>
              <Text style={styles.seeAllButton}>הצג הכל</Text>
            </TouchableOpacity>
          </View>
          
          {renderComplaints()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    elevation: 2,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginRight: 12,
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  statsContent: {
    marginLeft: 10,
  },
  statsTitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  seeAllButton: {
    color: '#4f46e5',
    fontSize: 16,
  },
  complaintCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  complaintHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  complaintId: {
    fontSize: 14,
    color: '#6b7280',
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  complaintDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  complaintDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  updateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4f46e5',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginVertical: 10,
  },
  emptyStateButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  // סגנונות עבור מצבי טעינה
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4f46e5',
  },
  // סגנונות נוספים לאינטראקציות
  pressableEffect: {
    opacity: 0.7,
  },
  // סגנונות לתפריט תחתון אם נדרש
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bottomNavItem: {
    alignItems: 'center',
    padding: 8,
  },
  bottomNavText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  bottomNavActive: {
    color: '#4f46e5',
  },
  // סגנונות לתגיות ותוויות
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // סגנונות לפופ-אפ הודעות
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  // סגנונות לפעולות מהירות נוספות
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  // סגנונות לתצוגת רשימה מתקדמת
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9fafb',
  },
  listHeaderText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  // סגנונות למסנן תלונות
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#4f46e5',
  },
  filterButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
});

export default CitizenDashboard;