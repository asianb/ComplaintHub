// //EmployeeDashboard.js
// import React, { useState, useEffect } from 'react';
// import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';


// import { Activity, Calendar, Clock, UserCheck } from 'lucide-react';

// const { width } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.1.4:3000/api';


// const MenuCard = ({ title, icon, color, onPress }) => (
//   <Card style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
//     <Card.Content style={styles.menuCardContent}>
//       <Avatar.Icon
//         size={48}
//         icon={icon}
//         style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
//         color={color}
//       />
//       <View style={styles.menuTextContainer}>
//         <Text style={styles.menuTitle}>{title}</Text>
//       </View>
//     </Card.Content>
//   </Card>
// );

// const EmployeeDashboard = ({ navigation }) => {
//   const theme = useTheme();
//   const [employeeName, setEmployeeName] = useState('');
//   const [userData, setUserData] = useState('');
//   const managerUserId = '213245100'; // ודא שזה ID תקני

//   useEffect(() => {
//     fetchProfile();
//     fetchManagerData('213245100');
//   }, []);
//   const fetchManagerData = async (managerUserId) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/users/${managerUserId}`);
//       console.log('Manager Data:', response.data);
//     } catch (error) {
//       if (error.response) {
//         console.log('Response Error:', error.response.data);
//         console.log('Response Status:', error.response.status);
//       } else if (error.request) {
//         console.log('Request Error:', error.request);
//       } else {
//         console.log('Error Message:', error.message);
//       }
//       console.error('Error fetching manager data:', error);
//     }
//   };
  
//   const fetchProfile = async () => {
//     try {
//       const userString = await AsyncStorage.getItem('user');
//       if (!userString) return;
//       const user = JSON.parse(userString);
  
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (response.data) {
//         setUserData(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     }
//   };
  
//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('userRole');
//     navigation.replace('loginScreen');
//   };
//   const navigateToChat = async (managerUserId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/users/${managerUserId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       const managerData = response.data;
//       console.log('Manager Data:', managerData);
  
//       // Pass managerData as selectedUser when navigating to ChatInterface
//       navigation.navigate('Chat', { currentUser: userData, selectedUser: managerData });
//     } catch (error) {
//       console.error('Error fetching manager data:', error);
//     }
//   };
  
  
  
  
//   const menuItems = [
  
//     {
//       title: 'תלונות במערכת',
//       icon: 'alert-box',
//       color: '#F44336',
//       onPress: () => navigation.navigate('EmployeeComplaints', { 
//         category: userData.category // שליחת הקטגוריה של העובד כמפרמטר
//       })
//     },
    
//     {
//       title: 'לוח פגישות',
//       icon: 'calendar',
//       color: '#4CAF50',
//       onPress: () => navigation.navigate('CalendarWithTasks')
//     },
   
//       {
//         title: 'צ\'אט עם המנהל',
//         icon: 'chat',
//         color: '#2196F3',
//         onPress: () => {
//           console.log('Chat Button Pressed');
//           navigateToChat('213245100'); // שליחה של מזהה המנהל
//         }
//       },
     
//     {
//       title: 'הפרופיל שלי',
//       icon: 'account',
//       color: '#9C27B0',
//       onPress: () => navigation.navigate('ProfilePage')
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <Surface style={styles.header}>
//         <View style={styles.headerTop}>
//           <View>
//           <Title style={styles.welcomeText}>שלום, {userData ? userData.firstName : '.'}</Title>
//           <Text style={styles.dateText}>{new Date().toLocaleDateString('he-IL', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}</Text>
//           </View>
//           <IconButton icon="logout" size={24} color="#FFF" onPress={handleLogout} />
//         </View>
//       </Surface>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.menuGrid}>
//           {menuItems.map((item, index) => (
//             <MenuCard key={index} {...item} />
//           ))}
//         </View>
//       </ScrollView>
      
    
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     padding: 24,
//     paddingTop: 60,
//     backgroundColor: '#4f46e5',
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     elevation: 8,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   welcomeText: {
//     color: '#ffffff',
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   dateText: {
//     color: '#e0e7ff',
//     fontSize: 16,
//     marginTop: 8,
//   },
//   content: {
//     padding: 20,
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   menuCard: {
//     width: width / 2 - 24,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     elevation: 3,
//     borderRadius: 20,
//     backgroundColor: '#ffffff',
//   },
//   menuCardContent: {
//     padding: 20,
//   },
//   menuIcon: {
//     marginBottom: 16,
//   },
//   menuTextContainer: {
//     alignItems: 'flex-start',
//   },
//   menuTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'right',
//     color: '#1f2937',
//   },
// });

// export default EmployeeDashboard;
//EmployeeDashboard.js - משופר עם תכונות המשך טיפול
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Activity, Calendar, Clock, UserCheck } from 'lucide-react';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.4:3000/api';
// 🆕 URL לשרת התלונות
const COMPLAINT_API_URL = 'http://192.168.1.4:5000';

// 🆕 רכיב קארד תפריט משופר עם badge
const MenuCard = ({ title, icon, color, onPress, badgeCount = 0 }) => (
  <Card style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
    <Card.Content style={styles.menuCardContent}>
      <View style={styles.iconContainer}>
        <Avatar.Icon
          size={48}
          icon={icon}
          style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
          color={color}
        />
        {/* 🆕 Badge למספר התראות */}
        {badgeCount > 0 && (
          <Badge 
            style={[styles.cardBadge, { backgroundColor: color }]}
            size={20}
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        )}
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
    </Card.Content>
  </Card>
);

// 🆕 רכיב סטטיסטיקות מהירות
const QuickStatsCard = ({ stats }) => (
  <Card style={styles.statsCard}>
    <Card.Content>
      <Title style={styles.statsTitle}>סטטיסטיקות מהירות</Title>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.pendingFollowUps || 0}</Text>
          <Text style={styles.statLabel}>בקשות המשך טיפול</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.assignedComplaints || 0}</Text>
          <Text style={styles.statLabel}>תלונות בטיפולי</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.newMessages || 0}</Text>
          <Text style={styles.statLabel}>הודעות חדשות</Text>
        </View>
      </View>
    </Card.Content>
  </Card>
);

const EmployeeDashboard = ({ navigation }) => {
  const theme = useTheme();
  const [employeeName, setEmployeeName] = useState('');
  const [userData, setUserData] = useState('');
  const managerUserId = '213245100';
  
  // 🆕 State לתכונות חדשות
  const [followUpStats, setFollowUpStats] = useState({
    pendingFollowUps: 0,
    assignedComplaints: 0,
    newMessages: 0
  });
  const [complaintToken, setComplaintToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchManagerData('213245100');
    // 🆕 טען נתוני תלונות
    loadComplaintData();
  }, []);

  // 🆕 פונקציה לטעינת נתוני התלונות
  const loadComplaintData = async () => {
    try {
      // קבל טוקן למערכת התלונות (אם שונה מהטוקן הרגיל)
      const token = await AsyncStorage.getItem('userToken') || await AsyncStorage.getItem('token');
      if (token) {
        setComplaintToken(token);
        await fetchFollowUpStats(token);
      }
    } catch (error) {
      console.error('Error loading complaint data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 פונקציה לקבלת סטטיסטיקות בקשות המשך טיפול
  const fetchFollowUpStats = async (token) => {
    try {
      // קבל בקשות המשך טיפול ממתינות
      const followUpResponse = await axios.get(
        `${COMPLAINT_API_URL}/api/employee/pending-follow-ups`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // קבל תלונות שמוקצות לעובד
      const assignedResponse = await axios.get(
        `${COMPLAINT_API_URL}/api/employee-assigned-complaints`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // עדכן State
      setFollowUpStats({
        pendingFollowUps: followUpResponse.data.count || 0,
        assignedComplaints: assignedResponse.data.data?.length || 0,
        newMessages: 0 // יש לחשב לפי הודעות שלא נקראו
      });

    } catch (error) {
      console.error('Error fetching follow-up stats:', error);
      // אל תציג שגיאה למשתמש, פשוט השאר 0
    }
  };

  // 🆕 פונקציה לרענון הנתונים
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      loadComplaintData()
    ]);
    setLoading(false);
  };

  const fetchManagerData = async (managerUserId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${managerUserId}`);
      console.log('Manager Data:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('Response Error:', error.response.data);
        console.log('Response Status:', error.response.status);
      } else if (error.request) {
        console.log('Request Error:', error.request);
      } else {
        console.log('Error Message:', error.message);
      }
      console.error('Error fetching manager data:', error);
    }
  };
  
  const fetchProfile = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
  
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userToken'); // 🆕 נקה גם טוקן התלונות
    navigation.replace('loginScreen');
  };

  const navigateToChat = async (managerUserId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users/${managerUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const managerData = response.data;
      console.log('Manager Data:', managerData);
  
      navigation.navigate('Chat', { currentUser: userData, selectedUser: managerData });
    } catch (error) {
      console.error('Error fetching manager data:', error);
    }
  };
  
  // 🆕 פונקציה לניווט לבקשות המשך טיפול
  const navigateToFollowUps = () => {
    if (!complaintToken) {
      // אם אין טוקן, הנווט למסך התחברות או הראה הודעה
      console.log('No complaint token available');
      return;
    }
    navigation.navigate('EmployeeFollowUpManagement');
  };

  // 🆕 פונקציה לניווט לתלונות עם מעבר טוקן
  const navigateToComplaints = () => {
    navigation.navigate('EmployeeComplaints', { 
      category: userData.category,
      complaintToken: complaintToken // העבר את הטוקן
    });
  };
  
  // 🆕 רשימת תפריט משופרת
  const menuItems = [
    {
      title: 'תלונות במערכת',
      icon: 'alert-box',
      color: '#F44336',
      onPress: navigateToComplaints,
      badgeCount: followUpStats.assignedComplaints
    },
    {
      title: 'בקשות המשך טיפול', // 🆕 פריט חדש
      icon: 'refresh',
      color: '#FF9800',
      onPress: navigateToFollowUps,
      badgeCount: followUpStats.pendingFollowUps
    },
    {
      title: 'לוח פגישות',
      icon: 'calendar',
      color: '#4CAF50',
      onPress: () => navigation.navigate('CalendarWithTasks')
    },
    {
      title: 'צ\'אט עם המנהל',
      icon: 'chat',
      color: '#2196F3',
      onPress: () => {
        console.log('Chat Button Pressed');
        navigateToChat('213245100');
      },
      badgeCount: followUpStats.newMessages
    },
    {
      title: 'הפרופיל שלי',
      icon: 'account',
      color: '#9C27B0',
      onPress: () => navigation.navigate('ProfilePage')
    },
  ];

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Title style={styles.welcomeText}>שלום, {userData ? userData.firstName : '.'}</Title>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('he-IL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</Text>
          </View>
          <View style={styles.headerActions}>
            {/* 🆕 כפתור רענון */}
            <IconButton 
              icon="refresh" 
              size={24} 
              color="#FFF" 
              onPress={refreshData}
              style={loading ? { opacity: 0.5 } : {}}
              disabled={loading}
            />
            <IconButton icon="logout" size={24} color="#FFF" onPress={handleLogout} />
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 🆕 קארד סטטיסטיקות מהירות */}
        <QuickStatsCard stats={followUpStats} />
        
        {/* 🆕 הודעה אם יש בקשות ממתינות */}
        {followUpStats.pendingFollowUps > 0 && (
          <Card style={styles.alertCard}>
            <Card.Content style={styles.alertContent}>
              <Avatar.Icon
                size={32}
                icon="alert"
                style={styles.alertIcon}
                color="#FF9800"
              />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>
                  יש {followUpStats.pendingFollowUps} בקשות המשך טיפול ממתינות
                </Text>
                <Text style={styles.alertSubtitle}>לחץ כאן לטיפול מיידי</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  
  // 🆕 סטיילים חדשים לסטטיסטיקות
  statsCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },

  // 🆕 סטיילים להתראה
  alertCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  alertIcon: {
    backgroundColor: '#FFF3E0',
    marginRight: 12,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: width / 2 - 24,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  menuCardContent: {
    padding: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  menuIcon: {
    // סטיילים קיימים נשארים
  },
  // 🆕 Badge על הקארד
  cardBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
  },
  menuTextContainer: {
    alignItems: 'flex-start',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
    color: '#1f2937',
  },
});

export default EmployeeDashboard;