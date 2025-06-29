// import React, { useState,useEffect } from 'react';
// import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';

// const { width } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.252.45/api';

// const MenuCard = ({ title, icon, count, color, onPress }) => (
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
//         {count !== undefined && (
//           <Text style={[styles.menuCount, { color }]}>{count}</Text>
//         )}
//       </View>
//     </Card.Content>
//   </Card>
// );

// const ManagerDashboard = ({ navigation }) => {
//   const theme = useTheme();
//   const [managerName, setManagerName] = useState('');
//   const [userData, setUserData] = useState('');  // Start with null to show loading state

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   // const fetchProfile = async () => {
//   //   try {
//   //     const user = JSON.parse(await AsyncStorage.getItem('user'));
//   //     if (!user) return;

//   //     const token = await AsyncStorage.getItem('token');
//   //     const response = await axios.get(
//   //       `${API_BASE_URL}/profile/${user._id}`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     setUserData(response.data);
//   //     console.log(response.data.firstName || 'לא נמצא שם פרטי');


//   //   } catch (error) {
//   //     setStatus({ error: 'שגיאה בטעינת הפרופיל', success: '' });
//   //     setTimeout(() => setStatus({ error: '', success: '' }), 3000);
//   //   }
//   // };
//   const fetchProfile = async () => {
//     try {
//       console.log('Fetching profile...');
  
//       // שליפת פרטי המשתמש מ-AsyncStorage
//       const userString = await AsyncStorage.getItem('user');
//       console.log('User String:', userString);
  
//       if (!userString) {
//         console.error('משתמש לא נמצא ב-AsyncStorage');
//         setStatus({ error: 'משתמש לא נמצא', success: '' });
//         return;
//       }
  
//       const user = JSON.parse(userString);
  
//       // שליפת טוקן מ-AsyncStorage
//       const token = await AsyncStorage.getItem('token');
//       console.log('Token:', token);
  
//       if (!token) {
//         console.error('טוקן לא נמצא ב-AsyncStorage');
//         setStatus({ error: 'טוקן לא נמצא', success: '' });
//         return;
//       }
  
//       // קריאה ל-API כדי לשלוף את פרופיל המשתמש
//       const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       console.log('Response:', response);
  
//       if (response.data) {
//         // עדכון הנתונים שהתקבלו
//         console.log('Response Data:', response.data);
//         setUserData(response.data);
  
//         // הדפסת שם פרטי אם זמין
//         console.log('First Name:', response.data.firstName || 'לא נמצא שם פרטי');
//       } else {
//         console.error('No data in response.');
//         setStatus({ error: 'לא התקבלו נתונים מהשרת', success: '' });
//       }
//     } catch (error) {
//       // טיפול בשגיאות
//       console.error('Error occurred:', error);
  
//       const errorMessage = error.response?.data?.message || 'שגיאה בלתי צפויה';
//       setStatus({ error: `שגיאה בטעינת הפרופיל: ${errorMessage}`, success: '' });
  
//       // איפוס הודעות סטטוס לאחר 3 שניות
//       setTimeout(() => setStatus({ error: '', success: '' }), 3000);
//     }
//   };
  
  
//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('userRole');
//     navigation.replace('loginScreen');
//   };

//   const menuItems = [
    
//     {
//       title: 'סטטיסטיקות חוות דעת',
//       icon: 'account-group',
//       count: '12',
//       color: '#4CAF50',
//       onPress: () => navigation.navigate('FeedbackDashboard')
//     }, {
//       title: 'רשימת עובדים',
//       icon: 'account-group',
//       count: '12',
//       color: '#4CAF50',
//       onPress: () => navigation.navigate('EmployeeList')
//     },
//     {
//       title: 'רשימת אזרחים',
//       icon: 'account-multiple',
//       count: '158',
//       color: '#2196F3',
//       onPress: () => navigation.navigate('CitizenList')
//     },
//     {
//       title: 'תלונות פתוחות',
//       icon: 'message-alert',
//       count: '5',
//       color: '#F44336',
//       onPress: () => navigation.navigate('ViewComplaints')
//     },
//     {
//       title: 'הפרופיל שלי',
//       icon: 'account-cog',
//       color: '#9C27B0',
//       onPress: () => navigation.navigate('ProfilePage')
//     }
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Gradient Header */}
//       <Surface style={styles.header}>
//         <View style={styles.headerTop}>
//           <View>
//             <Title style={styles.welcomeText}>שלום, {userData.firstName}</Title>
//             <Text style={styles.dateText}>{new Date().toLocaleDateString('he-IL', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}</Text>
//           </View>
//           <IconButton
//             icon="logout"
//             size={24}
//             color="#FFF"
//             onPress={handleLogout}
//           />
//         </View>
//       </Surface>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Quick Stats */}
//         <View style={styles.statsContainer}>
//           <Card style={styles.statsCard}>
//             <Card.Content style={styles.statsContent}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>158</Text>
//                 <Text style={styles.statLabel}>אזרחים רשומים</Text>
//               </View>
//               <Divider style={styles.verticalDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>5</Text>
//                 <Text style={styles.statLabel}>תלונות חדשות</Text>
//               </View>
//               <Divider style={styles.verticalDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>12</Text>
//                 <Text style={styles.statLabel}>עובדים פעילים</Text>
//               </View>
//             </Card.Content>
//           </Card>
//         </View>

//         {/* Menu Cards */}
//         <View style={styles.menuGrid}>
//           {menuItems.map((item, index) => (
//             <MenuCard key={index} {...item} />
//           ))}
//         </View>

//         {/* Recent Activity */}
//         <Card style={styles.activityCard}>
//           <Card.Title 
//             title="פעילות אחרונה"
//             right={(props) => (
//               <IconButton {...props} icon="clock-outline" onPress={() => {}} />
//             )}
//           />
//           <Card.Content>
//             <View style={styles.activityItem}>
//               <Avatar.Icon 
//                 size={40} 
//                 icon="account-plus" 
//                 style={[styles.activityIcon, { backgroundColor: '#4CAF5020' }]}
//                 color="#4CAF50"
//               />
//               <View style={styles.activityText}>
//                 <Text style={styles.activityTitle}>עובד חדש נוסף למערכת</Text>
//                 <Text style={styles.timeText}>לפני 2 שעות</Text>
//               </View>
//             </View>
//             <View style={styles.activityItem}>
//               <Avatar.Icon 
//                 size={40} 
//                 icon="alert-circle" 
//                 style={[styles.activityIcon, { backgroundColor: '#F4433620' }]}
//                 color="#F44336"
//               />
//               <View style={styles.activityText}>
//                 <Text style={styles.activityTitle}>התקבלה תלונה חדשה</Text>
//                 <Text style={styles.timeText}>לפני 4 שעות</Text>
//               </View>
//             </View>
//           </Card.Content>
//         </Card>
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
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
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
//     textAlign: 'right',
//   },
//   dateText: {
//     color: '#e0e7ff',
//     fontSize: 16,
//     marginTop: 8,
//     textAlign: 'right',
//   },
//   content: {
//     padding: 20,
//   },
//   statsContainer: {
//     marginTop: -40,
//     marginBottom: 24,
//     paddingHorizontal: 4,
//   },
//   statsCard: {
//     elevation: 4,
//     borderRadius: 20,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
//   statsContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#4f46e5',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//     textAlign: 'center',
//   },
//   verticalDivider: {
//     height: '100%',
//     width: 1,
//     backgroundColor: '#e5e7eb',
//     marginHorizontal: 16,
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   menuCard: {
//     width: width / 2 - 24,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     elevation: 3,
//     borderRadius: 20,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
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
//     marginBottom: 8,
//     textAlign: 'right',
//     color: '#1f2937',
//   },
//   menuCount: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   activityCard: {
//     marginBottom: 24,
//     borderRadius: 20,
//     elevation: 3,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 4,
//   },
//   activityIcon: {
//     marginLeft: 16,  // Changed from marginRight for RTL
//   },
//   activityText: {
//     flex: 1,
//     alignItems: 'flex-end',  // Added for RTL
//   },
//   activityTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1f2937',
//     textAlign: 'right',
//   },
//   timeText: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginTop: 4,
//     textAlign: 'right',
//   }
// });

// export default ManagerDashboard;


import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.3:5000/api'; // עודכן לפורט 5000

const MenuCard = ({ title, icon, count, color, onPress, badge }) => (
  <Card style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
    <Card.Content style={styles.menuCardContent}>
      <View style={styles.menuIconContainer}>
        <Avatar.Icon 
          size={48} 
          icon={icon} 
          style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
          color={color}
        />
        {badge && (
          <Badge
            visible={true}
            size={22}
            style={[styles.badge, { backgroundColor: '#F44336' }]}
          >
            {badge}
          </Badge>
        )}
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {count !== undefined && (
          <Text style={[styles.menuCount, { color }]}>{count}</Text>
        )}
      </View>
    </Card.Content>
  </Card>
);

const StatCard = ({ icon, title, value, color, subtitle }) => (
  <Card style={styles.statCard}>
    <Card.Content style={styles.statCardContent}>
      <Avatar.Icon 
        size={36} 
        icon={icon} 
        style={{ backgroundColor: `${color}20` }}
        color={color}
      />
      <View style={styles.statTextContainer}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </Card.Content>
  </Card>
);

const ManagerDashboard = ({ navigation }) => {
  const theme = useTheme();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState({ error: '', success: '' });
  const [stats, setStats] = useState({
    citizens: 0,
    employees: 0,
    openComplaints: 0,
    resolvedComplaints: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchStats(),
      fetchRecentActivity()
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      
      // שליפת פרטי המשתמש מ-AsyncStorage
      const userString = await AsyncStorage.getItem('user');
      console.log('User String:', userString);
  
      if (!userString) {
        console.error('משתמש לא נמצא ב-AsyncStorage');
        setStatus({ error: 'משתמש לא נמצא', success: '' });
        return;
      }
  
      const user = JSON.parse(userString);
      
      // אם אין אפשרות להביא מהשרת, לפחות להציג את הנתונים מהזיכרון המקומי
      setUserData(user);
      
      // שליפת טוקן מ-AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
  
      if (!token) {
        console.error('טוקן לא נמצא ב-AsyncStorage');
        setStatus({ error: 'טוקן לא נמצא', success: '' });
        return;
      }
  
      try {
        // קריאה ל-API כדי לשלוף את פרופיל המשתמש
        const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log('Response:', response);
    
        if (response.data) {
          // עדכון הנתונים שהתקבלו
          console.log('Response Data:', response.data);
          setUserData(response.data);
    
          // הדפסת שם פרטי אם זמין
          console.log('First Name:', response.data.firstName || 'לא נמצא שם פרטי');
        }
      } catch (error) {
        console.log('לא ניתן לטעון פרופיל מהשרת, משתמש בנתונים מקומיים');
        // ממשיך בלי שגיאה כי כבר יש את הנתונים הבסיסיים
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };
  
  const fetchStats = async () => {
    try {
      // בעולם אמיתי - כאן תהיה קריאה לשרת להביא סטטיסטיקות
      // כרגע נשתמש בנתונים לדוגמה
      
      // נסה להביא נתונים מהשרת, אם יש endpoint מתאים
      const token = await AsyncStorage.getItem('token');
      
      try {
        // נתונים לדוגמה כרגע
        setStats({
          citizens: 158,
          employees: 12,
          openComplaints: 8,
          resolvedComplaints: 126
        });
      } catch (error) {
        console.log('לא ניתן לטעון סטטיסטיקות מהשרת');
      }
    } catch (error) {
      console.error('Error in fetchStats:', error);
    }
  };
  
  const fetchRecentActivity = async () => {
    try {
      // בעולם אמיתי - כאן תהיה קריאה לשרת להביא פעילות אחרונה
      // כרגע נשתמש בנתונים לדוגמה
      
      setRecentActivity([
        {
          id: 1,
          type: 'employee_added',
          icon: 'account-plus',
          color: '#4CAF50',
          title: 'עובד חדש נוסף למערכת',
          description: 'יוסי כהן - מחלקת תשתיות',
          time: 'לפני 2 שעות'
        },
        {
          id: 2,
          type: 'new_complaint',
          icon: 'alert-circle',
          color: '#F44336',
          title: 'התקבלה תלונה חדשה',
          description: 'תשתיות - תאורת רחוב לא תקינה',
          time: 'לפני 4 שעות'
        },
        {
          id: 3,
          type: 'complaint_resolved',
          icon: 'check-circle',
          color: '#2196F3',
          title: 'תלונה טופלה בהצלחה',
          description: 'ניקיון - פינוי פסולת',
          time: 'לפני 6 שעות'
        }
      ]);
    } catch (error) {
      console.error('Error in fetchRecentActivity:', error);
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'יציאה מהמערכת',
      'האם אתה בטוח שברצונך להתנתק?',
      [
        {
          text: 'ביטול',
          style: 'cancel'
        },
        {
          text: 'יציאה',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('user');
            navigation.replace('loginScreen');
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: 'סטטיסטיקות חוות דעת',
      icon: 'chart-bar',
      color: '#9C27B0',
      onPress: () => navigation.navigate('FeedbackDashboard')
    }, 
    {
      title: 'רשימת עובדים',
      icon: 'account-group',
      count: stats.employees.toString(),
      color: '#4CAF50',
      onPress: () => navigation.navigate('EmployeeList')
    },
    {
      title: 'רשימת אזרחים',
      icon: 'account-multiple',
      count: stats.citizens.toString(),
      color: '#2196F3',
      onPress: () => navigation.navigate('CitizenList')
    },
    {
      title: 'תלונות פתוחות',
      icon: 'message-alert',
      count: stats.openComplaints.toString(),
      color: '#F44336',
      badge: stats.openComplaints > 0 ? stats.openComplaints.toString() : null,
      onPress: () => navigation.navigate('ViewComplaints')
    },
    {
      title: 'הגדרות מערכת',
      icon: 'cog',
      color: '#FF9800',
      onPress: () => navigation.navigate('SystemSettings')
    },
    {
      title: 'הפרופיל שלי',
      icon: 'account-cog',
      color: '#607D8B',
      onPress: () => navigation.navigate('ProfilePage')
    }
  ];

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>טוען נתונים...</Text>
      </View>
    );
  }

  const fullName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'מנהל';

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Title style={styles.welcomeText}>שלום, {fullName}</Title>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('he-IL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
          <IconButton
            icon="logout"
            size={24}
            color="#FFF"
            onPress={handleLogout}
          />
        </View>
      </Surface>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4f46e5']} />
        }
      >
        {/* Quick Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard 
              icon="account-multiple" 
              title="אזרחים" 
              value={stats.citizens}
              color="#2196F3"
            />
            <StatCard 
              icon="account-group" 
              title="עובדים" 
              value={stats.employees}
              color="#4CAF50"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard 
              icon="message-alert" 
              title="תלונות פתוחות" 
              value={stats.openComplaints}
              color="#F44336"
              subtitle="ממתינות לטיפול"
            />
            <StatCard 
              icon="check-circle" 
              title="תלונות שטופלו" 
              value={stats.resolvedComplaints}
              color="#FF9800"
            />
          </View>
        </View>

        {/* Menu Cards */}
        <Text style={styles.sectionTitle}>ניהול המערכת</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>פעילות אחרונה</Text>
        <Card style={styles.activityCard}>
          <Card.Content>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Avatar.Icon 
                    size={40} 
                    icon={activity.icon} 
                    style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}
                    color={activity.color}
                  />
                  <View style={styles.activityText}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.timeText}>{activity.time}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>אין פעילות חדשה</Text>
              </View>
            )}
          </Card.Content>
          <Card.Actions style={styles.activityActions}>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('ActivityLog')}
              color="#4f46e5"
            >
              צפה בכל הפעילויות
            </Button>
          </Card.Actions>
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
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  dateText: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'right',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  statsContainer: {
    marginTop: -40,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: width / 2 - 26,
    borderRadius: 16,
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
  statCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextContainer: {
    marginRight: 12,
    flex: 1,
    alignItems: 'flex-end',
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuCard: {
    width: width / 2 - 26,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  menuCardContent: {
    padding: 16,
  },
  menuIconContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  menuIcon: {
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  menuTextContainer: {
    alignItems: 'flex-start',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
    color: '#1f2937',
  },
  menuCount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  activityCard: {
    marginBottom: 24,
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  activityIcon: {
    marginLeft: 16,  // Changed from marginRight for RTL
  },
  activityText: {
    flex: 1,
    alignItems: 'flex-end',  // Added for RTL
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'right',
  },
  activityDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
    textAlign: 'right',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  activityActions: {
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});

export default ManagerDashboard;