// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { 
// // //   View, 
// // //   ScrollView, 
// // //   StyleSheet, 
// // //   Dimensions, 
// // //   Alert, 
// // //   RefreshControl, 
// // //   ActivityIndicator,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   Modal
// // // } from 'react-native';
// // // import { 
// // //   Surface, 
// // //   Text, 
// // //   Card, 
// // //   Title, 
// // //   Button, 
// // //   Avatar, 
// // //   IconButton, 
// // //   useTheme, 
// // //   Divider, 
// // //   Badge,
// // //   ProgressBar
// // // } from 'react-native-paper';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import axios from 'axios';

// // // const { width } = Dimensions.get('window');
// // // const API_BASE_URL = 'http://192.168.1.9:5000/api';

// // // // רכיב כרטיס תפריט משופר
// // // const EnhancedMenuCard = ({ 
// // //   title, 
// // //   icon, 
// // //   count, 
// // //   color, 
// // //   onPress, 
// // //   badge, 
// // //   subtitle, 
// // //   trend,
// // //   isAI = false 
// // // }) => (
// // //   <Card style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
// // //     <Card.Content style={styles.menuCardContent}>
// // //       <View style={styles.menuIconContainer}>
// // //         <Avatar.Icon 
// // //           size={48} 
// // //           icon={icon} 
// // //           style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
// // //           color={color}
// // //         />
// // //         {badge && (
// // //           <Badge
// // //             visible={true}
// // //             size={20}
// // //             style={[styles.badge, { backgroundColor: '#F44336' }]}
// // //           >
// // //             {badge}
// // //           </Badge>
// // //         )}
// // //         {isAI && (
// // //           <View style={styles.aiIndicator}>
// // //             <Text style={styles.aiIndicatorText}>AI</Text>
// // //           </View>
// // //         )}
// // //       </View>
      
// // //       <View style={styles.menuTextContainer}>
// // //         <Text style={styles.menuTitle}>{title}</Text>
// // //         {subtitle && (
// // //           <Text style={styles.menuSubtitle}>{subtitle}</Text>
// // //         )}
// // //         {count !== undefined && (
// // //           <Text style={[styles.menuCount, { color }]}>{count}</Text>
// // //         )}
// // //         {trend && (
// // //           <View style={styles.trendContainer}>
// // //             <Ionicons 
// // //               name={trend.type === 'up' ? 'trending-up' : 'trending-down'} 
// // //               size={12} 
// // //               color={trend.type === 'up' ? '#4CAF50' : '#F44336'} 
// // //             />
// // //             <Text style={[styles.trendText, { 
// // //               color: trend.type === 'up' ? '#4CAF50' : '#F44336' 
// // //             }]}>
// // //               {trend.value}
// // //             </Text>
// // //           </View>
// // //         )}
// // //       </View>
// // //     </Card.Content>
// // //   </Card>
// // // );

// // // // רכיב כרטיס סטטיסטיקה משופר
// // // const StatCard = ({ 
// // //   icon, 
// // //   title, 
// // //   value, 
// // //   color, 
// // //   subtitle, 
// // //   progress,
// // //   trend 
// // // }) => (
// // //   <Card style={styles.statCard}>
// // //     <Card.Content style={styles.statCardContent}>
// // //       <View style={styles.statIconContainer}>
// // //         <Avatar.Icon 
// // //           size={40} 
// // //           icon={icon} 
// // //           style={{ backgroundColor: `${color}20` }}
// // //           color={color}
// // //         />
// // //         {trend && (
// // //           <View style={styles.statTrendIndicator}>
// // //             <Ionicons 
// // //               name={trend > 0 ? 'arrow-up' : 'arrow-down'} 
// // //               size={12} 
// // //               color={trend > 0 ? '#4CAF50' : '#F44336'} 
// // //             />
// // //           </View>
// // //         )}
// // //       </View>
      
// // //       <View style={styles.statTextContainer}>
// // //         <Text style={styles.statTitle}>{title}</Text>
// // //         <Text style={[styles.statValue, { color }]}>{value}</Text>
// // //         {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
// // //         {progress !== undefined && (
// // //           <ProgressBar 
// // //             progress={progress / 100} 
// // //             color={color} 
// // //             style={styles.progressBar}
// // //           />
// // //         )}
// // //       </View>
// // //     </Card.Content>
// // //   </Card>
// // // );

// // // // רכיב התראת AI
// // // const AIAlert = ({ alert, onAction }) => (
// // //   <Card style={[styles.aiAlertCard, { borderLeftColor: alert.color }]}>
// // //     <Card.Content style={styles.aiAlertContent}>
// // //       <View style={styles.aiAlertHeader}>
// // //         <Ionicons name={alert.icon} size={24} color={alert.color} />
// // //         <Text style={styles.aiAlertTitle}>{alert.title}</Text>
// // //         <View style={styles.aiLabelContainer}>
// // //           <Text style={styles.aiLabel}>AI</Text>
// // //         </View>
// // //       </View>
      
// // //       <Text style={styles.aiAlertMessage}>{alert.message}</Text>
      
// // //       <TouchableOpacity 
// // //         style={[styles.aiAlertButton, { backgroundColor: alert.color }]}
// // //         onPress={() => onAction(alert.action)}
// // //       >
// // //         <Text style={styles.aiAlertButtonText}>{alert.actionText}</Text>
// // //       </TouchableOpacity>
// // //     </Card.Content>
// // //   </Card>
// // // );

// // // // הרכיב הראשי
// // // const UnifiedManagerDashboard = ({ navigation }) => {
// // //   const theme = useTheme();
// // //   const [userData, setUserData] = useState({});
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [status, setStatus] = useState({ error: '', success: '' });
  
// // //   // נתוני סטטיסטיקות
// // //   const [stats, setStats] = useState({
// // //     citizens: 0,
// // //     employees: 0,
// // //     openComplaints: 0,
// // //     resolvedComplaints: 0,
// // //     totalComplaints: 0,
// // //     avgRating: 0,
// // //     resolutionRate: 0
// // //   });
  
// // //   // נתוני AI
// // //   const [aiInsights, setAiInsights] = useState({
// // //     riskAnalysis: null,
// // //     sentimentAnalysis: null,
// // //     trendsData: null,
// // //     alerts: []
// // //   });
  
// // //   const [recentActivity, setRecentActivity] = useState([]);
// // //   const [quickInsight, setQuickInsight] = useState(null);

// // //   useEffect(() => {
// // //     fetchAllDashboardData();
// // //   }, []);

// // //   const fetchAllDashboardData = async () => {
// // //     setLoading(true);
// // //     await Promise.all([
// // //       fetchProfile(),
// // //       fetchStats(),
// // //       fetchAIInsights(),
// // //       fetchRecentActivity()
// // //     ]);
// // //     setLoading(false);
// // //   };

// // //   const onRefresh = useCallback(async () => {
// // //     setRefreshing(true);
// // //     await fetchAllDashboardData();
// // //     setRefreshing(false);
// // //   }, []);

// // //   // שליפת פרופיל מנהל
// // //   const fetchProfile = async () => {
// // //     try {
// // //       const userString = await AsyncStorage.getItem('user');
// // //       if (!userString) {
// // //         setStatus({ error: 'משתמש לא נמצא', success: '' });
// // //         return;
// // //       }

// // //       const user = JSON.parse(userString);
// // //       setUserData(user);
      
// // //       const token = await AsyncStorage.getItem('token');
// // //       if (!token) return;

// // //       try {
// // //         const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
        
// // //         if (response.data) {
// // //           setUserData(response.data);
// // //         }
// // //       } catch (error) {
// // //         console.log('לא ניתן לטעון פרופיל מהשרת, משתמש בנתונים מקומיים');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error in fetchProfile:', error);
// // //     }
// // //   };

// // //   // שליפת סטטיסטיקות מורחבות
// // //   const fetchStats = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('token');
      
// // //       try {
// // //         // ניסיון לטעון נתונים אמיתיים מהשרת
// // //         const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
// // //           headers: { Authorization: `Bearer ${token}` }
// // //         });
        
// // //         if (response.data && response.data.status === 'success') {
// // //           setStats(response.data.data);
// // //         } else {
// // //           throw new Error('No real data');
// // //         }
// // //       } catch (error) {
// // //         // נתונים לדוגמה אם השרת לא זמין
// // //         const mockStats = {
// // //           citizens: 1847,
// // //           employees: 23,
// // //           openComplaints: 12,
// // //           resolvedComplaints: 156,
// // //           totalComplaints: 168,
// // //           avgRating: 4.2,
// // //           resolutionRate: 92.8,
// // //           weeklyTrend: 8,
// // //           monthlyGrowth: 15
// // //         };
// // //         setStats(mockStats);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error in fetchStats:', error);
// // //     }
// // //   };

// // //   // שליפת תובנות AI
// // //   const fetchAIInsights = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('token');
      
// // //       try {
// // //         // ניסיון לטעון נתוני AI אמיתיים
// // //         const response = await axios.get(`${API_BASE_URL}/admin/ai-dashboard`, {
// // //           headers: { Authorization: `Bearer ${token}` }
// // //         });
        
// // //         if (response.data && response.data.status === 'success') {
// // //           setAiInsights(response.data.data);
// // //           generateAIAlerts(response.data.data);
// // //         } else {
// // //           throw new Error('No AI data');
// // //         }
// // //       } catch (error) {
// // //         // נתוני AI לדוגמה
// // //         const mockAIData = {
// // //           riskAnalysis: {
// // //             highRiskCount: 3,
// // //             totalAnalyzed: 45,
// // //             averageRisk: 0.35
// // //           },
// // //           sentimentAnalysis: {
// // //             positive: 65,
// // //             neutral: 25,
// // //             negative: 10
// // //           },
// // //           trendsData: {
// // //             improving: true,
// // //             trend: 'עלייה בשביעות רצון'
// // //           }
// // //         };
// // //         setAiInsights(mockAIData);
// // //         generateMockAIAlerts();
// // //       }
// // //     } catch (error) {
// // //       console.error('Error in fetchAIInsights:', error);
// // //     }
// // //   };

// // //   // יצירת התראות AI
// // //   const generateAIAlerts = (aiData) => {
// // //     const alerts = [];
    
// // //     if (aiData.riskAnalysis?.highRiskCount > 2) {
// // //       alerts.push({
// // //         id: 1,
// // //         type: 'warning',
// // //         icon: 'warning',
// // //         color: '#FF9800',
// // //         title: 'תלונות בסיכון גבוה',
// // //         message: `זוהו ${aiData.riskAnalysis.highRiskCount} תלונות עם רמת סיכון גבוהה`,
// // //         actionText: 'טפל עכשיו',
// // //         action: 'high-risk'
// // //       });
// // //     }
    
// // //     if (aiData.sentimentAnalysis?.negative > 15) {
// // //       alerts.push({
// // //         id: 2,
// // //         type: 'error',
// // //         icon: 'sad',
// // //         color: '#F44336',
// // //         title: 'סנטימנט שלילי',
// // //         message: `${aiData.sentimentAnalysis.negative}% מהתלונות עם סנטימנט שלילי`,
// // //         actionText: 'צפה בניתוח',
// // //         action: 'sentiment'
// // //       });
// // //     }
    
// // //     setAiInsights(prev => ({ ...prev, alerts }));
// // //   };

// // //   const generateMockAIAlerts = () => {
// // //     const mockAlerts = [
// // //       {
// // //         id: 1,
// // //         type: 'warning',
// // //         icon: 'warning',
// // //         color: '#FF9800',
// // //         title: 'תלונות בסיכון גבוה',
// // //         message: 'זוהו 3 תלונות עם רמת סיכון גבוהה הדורשות טיפול מיידי',
// // //         actionText: 'טפל עכשיו',
// // //         action: 'high-risk'
// // //       },
// // //       {
// // //         id: 2,
// // //         type: 'info',
// // //         icon: 'trending-up',
// // //         color: '#2196F3',
// // //         title: 'מגמה חיובית',
// // //         message: 'שיפור של 15% בזמני תגובה השבוע',
// // //         actionText: 'צפה בדוח',
// // //         action: 'trends'
// // //       }
// // //     ];
    
// // //     setAiInsights(prev => ({ ...prev, alerts: mockAlerts }));
// // //   };

// // //   // שליפת פעילות אחרונה
// // //   const fetchRecentActivity = async () => {
// // //     try {
// // //       const activities = [
// // //         {
// // //           id: 1,
// // //           type: 'ai_analysis',
// // //           icon: 'analytics',
// // //           color: '#9C27B0',
// // //           title: 'ניתוח AI הושלם',
// // //           description: '45 תלונות נותחו, 3 בסיכון גבוה',
// // //           time: 'לפני 30 דקות',
// // //           isNew: true
// // //         },
// // //         {
// // //           id: 2,
// // //           type: 'employee_added',
// // //           icon: 'person-add',
// // //           color: '#4CAF50',
// // //           title: 'עובד חדש נוסף',
// // //           description: 'רחל כהן - מחלקת תשתיות',
// // //           time: 'לפני שעה',
// // //           isNew: false
// // //         },
// // //         {
// // //           id: 3,
// // //           type: 'complaint_urgent',
// // //           icon: 'alert-circle',
// // //           color: '#F44336',
// // //           title: 'תלונה דחופה התקבלה',
// // //           description: 'תאורת רחוב - רחוב הרצל 15',
// // //           time: 'לפני 2 שעות',
// // //           isNew: true
// // //         },
// // //         {
// // //           id: 4,
// // //           type: 'complaint_resolved',
// // //           icon: 'checkmark-circle',
// // //           color: '#2196F3',
// // //           title: 'תלונה נפתרה',
// // //           description: 'ניקיון - איסוף פסולת',
// // //           time: 'לפני 3 שעות',
// // //           isNew: false
// // //         }
// // //       ];
      
// // //       setRecentActivity(activities);
// // //     } catch (error) {
// // //       console.error('Error in fetchRecentActivity:', error);
// // //     }
// // //   };

// // //   // טיפול בפעולות התראות AI
// // //   const handleAIAlertAction = (action) => {
// // //     switch (action) {
// // //       case 'high-risk':
// // //         navigation.navigate('HighRiskComplaintsScreen');
// // //         break;
// // //       case 'sentiment':
// // //         navigation.navigate('AIAnalysisScreen');
// // //         break;
// // //       case 'trends':
// // //         navigation.navigate('TrendsReportScreen');
// // //         break;
// // //       default:
// // //         Alert.alert('מידע', 'פעולה זו עדיין לא מוכנה');
// // //     }
// // //   };

// // //   // יציאה מהמערכת
// // //   const handleLogout = async () => {
// // //     Alert.alert(
// // //       'יציאה מהמערכת',
// // //       'האם אתה בטוח שברצונך להתנתק?',
// // //       [
// // //         { text: 'ביטול', style: 'cancel' },
// // //         {
// // //           text: 'יציאה',
// // //           onPress: async () => {
// // //             await AsyncStorage.removeItem('token');
// // //             await AsyncStorage.removeItem('userRole');
// // //             await AsyncStorage.removeItem('user');
// // //             navigation.replace('loginScreen');
// // //           }
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   // עיצוב כרטיסי התפריט
// // //   const menuItems = [
// // //     {
// // //       title: 'רשימת עובדים',
// // //       subtitle: 'ניהול צוות',
// // //       icon: 'people',
// // //       count: stats.employees.toString(),
// // //       color: '#4CAF50',
// // //       onPress: () => navigation.navigate('EmployeeList'),
// // //       trend: { type: 'up', value: '+2 החודש' }
// // //     },
// // //     {
// // //       title: 'רשימת אזרחים',
// // //       subtitle: 'מאגר תושבים',
// // //       icon: 'people-outline',
// // //       count: stats.citizens.toString(),
// // //       color: '#2196F3',
// // //       onPress: () => navigation.navigate('CitizenList'),
// // //       trend: { type: 'up', value: '+15 השבוע' }
// // //     },
// // //     {
// // //       title: 'תלונות פתוחות',
// // //       subtitle: 'טיפול מיידי',
// // //       icon: 'alert-circle',
// // //       count: stats.openComplaints.toString(),
// // //       color: '#F44336',
// // //       badge: stats.openComplaints > 0 ? stats.openComplaints.toString() : null,
// // //       onPress: () => navigation.navigate('ViewComplaints')
// // //     },
// // //     {
// // //       title: 'ניתוח AI חכם',
// // //       subtitle: 'תובנות מתקדמות',
// // //       icon: 'analytics',
// // //       color: '#9C27B0',
// // //       onPress: () => navigation.navigate('AdminAIDashboard'),
// // //       isAI: true
// // //     },
// // //     {
// // //       title: 'תלונות בסיכון',
// // //       subtitle: 'זיהוי מוקדם',
// // //       icon: 'warning',
// // //       count: aiInsights.riskAnalysis?.highRiskCount?.toString() || '0',
// // //       color: '#FF5722',
// // //       onPress: () => navigation.navigate('HighRiskComplaintsScreen'),
// // //       isAI: true
// // //     },
// // //     {
// // //       title: 'דוח מגמות',
// // //       subtitle: 'ניתוח טרנדים',
// // //       icon: 'trending-up',
// // //       color: '#00BCD4',
// // //       onPress: () => navigation.navigate('TrendsReportScreen'),
// // //       isAI: true
// // //     },
// // //     {
// // //       title: 'חוות דעת',
// // //       subtitle: 'משוב תושבים',
// // //       icon: 'star',
// // //       count: stats.avgRating ? `${stats.avgRating}⭐` : 'אין נתונים',
// // //       color: '#FF9800',
// // //       onPress: () => navigation.navigate('FeedbackDashboard')
// // //     },
// // //     {
// // //       title: 'הפרופיל שלי',
// // //       subtitle: 'הגדרות אישיות',
// // //       icon: 'person',
// // //       color: '#607D8B',
// // //       onPress: () => navigation.navigate('ProfilePage')
// // //     }
// // //   ];

// // //   if (loading && !refreshing) {
// // //     return (
// // //       <View style={styles.loadingContainer}>
// // //         <ActivityIndicator size="large" color="#4f46e5" />
// // //         <Text style={styles.loadingText}>טוען דשבורד...</Text>
// // //         <Text style={styles.loadingSubtext}>מכין תובנות AI</Text>
// // //       </View>
// // //     );
// // //   }

// // //   const fullName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'מנהל';

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       {/* כותרת מעוצבת */}
// // //       <Surface style={styles.header}>
// // //         <View style={styles.headerTop}>
// // //           <View style={styles.headerTextContainer}>
// // //             <Title style={styles.welcomeText}>שלום, {fullName}</Title>
// // //             <Text style={styles.dateText}>
// // //               {new Date().toLocaleDateString('he-IL', { 
// // //                 weekday: 'long', 
// // //                 year: 'numeric', 
// // //                 month: 'long', 
// // //                 day: 'numeric' 
// // //               })}
// // //             </Text>
// // //             <View style={styles.statusIndicator}>
// // //               <View style={styles.statusDot} />
// // //               <Text style={styles.statusText}>מערכת פעילה</Text>
// // //             </View>
// // //           </View>
// // //           <IconButton
// // //             icon="logout"
// // //             size={24}
// // //             iconColor="#FFF"
// // //             onPress={handleLogout}
// // //           />
// // //         </View>
// // //       </Surface>

// // //       <ScrollView 
// // //         style={styles.content} 
// // //         showsVerticalScrollIndicator={false}
// // //         refreshControl={
// // //           <RefreshControl 
// // //             refreshing={refreshing} 
// // //             onRefresh={onRefresh} 
// // //             colors={['#4f46e5']}
// // //             tintColor="#4f46e5"
// // //           />
// // //         }
// // //       >
// // //         {/* כרטיסי סטטיסטיקה מהירה */}
// // //         <View style={styles.statsContainer}>
// // //           <Text style={styles.sectionTitle}>מבט כללי</Text>
// // //           <View style={styles.statsRow}>
// // //             <StatCard 
// // //               icon="people" 
// // //               title="אזרחים" 
// // //               value={stats.citizens}
// // //               color="#2196F3"
// // //               progress={75}
// // //               trend={5}
// // //             />
// // //             <StatCard 
// // //               icon="person" 
// // //               title="עובדים" 
// // //               value={stats.employees}
// // //               color="#4CAF50"
// // //               progress={60}
// // //               trend={2}
// // //             />
// // //           </View>
// // //           <View style={styles.statsRow}>
// // //             <StatCard 
// // //               icon="alert-circle" 
// // //               title="תלונות פתוחות" 
// // //               value={stats.openComplaints}
// // //               color="#F44336"
// // //               subtitle="דורש תשומת לב"
// // //               trend={-1}
// // //             />
// // //             <StatCard 
// // //               icon="checkmark-circle" 
// // //               title="שיעור פתרון" 
// // //               value={`${stats.resolutionRate}%`}
// // //               color="#4CAF50"
// // //               progress={stats.resolutionRate}
// // //               trend={3}
// // //             />
// // //           </View>
// // //         </View>

// // //         {/* התראות AI */}
// // //         {aiInsights.alerts && aiInsights.alerts.length > 0 && (
// // //           <View style={styles.aiAlertsContainer}>
// // //             <Text style={styles.sectionTitle}>התראות AI</Text>
// // //             {aiInsights.alerts.map((alert) => (
// // //               <AIAlert 
// // //                 key={alert.id} 
// // //                 alert={alert} 
// // //                 onAction={handleAIAlertAction}
// // //               />
// // //             ))}
// // //           </View>
// // //         )}

// // //         {/* תפריט ראשי */}
// // //         <View style={styles.menuContainer}>
// // //           <Text style={styles.sectionTitle}>ניהול המערכת</Text>
// // //           <View style={styles.menuGrid}>
// // //             {menuItems.map((item, index) => (
// // //               <EnhancedMenuCard key={index} {...item} />
// // //             ))}
// // //           </View>
// // //         </View>

// // //         {/* פעילות אחרונה */}
// // //         <View style={styles.activityContainer}>
// // //           <Text style={styles.sectionTitle}>פעילות אחרונה</Text>
// // //           <Card style={styles.activityCard}>
// // //             <Card.Content>
// // //               {recentActivity.length > 0 ? (
// // //                 recentActivity.map((activity, index) => (
// // //                   <View key={index} style={styles.activityItem}>
// // //                     <Avatar.Icon 
// // //                       size={40} 
// // //                       icon={activity.icon} 
// // //                       style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}
// // //                       color={activity.color}
// // //                     />
// // //                     <View style={styles.activityText}>
// // //                       <View style={styles.activityHeader}>
// // //                         <Text style={styles.activityTitle}>{activity.title}</Text>
// // //                         {activity.isNew && (
// // //                           <Badge size={16} style={styles.newBadge}>חדש</Badge>
// // //                         )}
// // //                       </View>
// // //                       <Text style={styles.activityDescription}>{activity.description}</Text>
// // //                       <Text style={styles.timeText}>{activity.time}</Text>
// // //                     </View>
// // //                   </View>
// // //                 ))
// // //               ) : (
// // //                 <View style={styles.emptyState}>
// // //                   <Text style={styles.emptyStateText}>אין פעילות חדשה</Text>
// // //                 </View>
// // //               )}
// // //             </Card.Content>
// // //             <Card.Actions style={styles.activityActions}>
// // //               <Button 
// // //                 mode="text" 
// // //                 onPress={() => navigation.navigate('ActivityLog')}
// // //                 textColor="#4f46e5"
// // //               >
// // //                 צפה בכל הפעילויות
// // //               </Button>
// // //             </Card.Actions>
// // //           </Card>
// // //         </View>

// // //         {/* תובנת AI מהירה */}
// // //         <View style={styles.quickInsightContainer}>
// // //           <Card style={styles.quickInsightCard}>
// // //             <Card.Content>
// // //               <View style={styles.quickInsightHeader}>
// // //                 <Ionicons name="bulb" size={24} color="#FFC107" />
// // //                 <Text style={styles.quickInsightTitle}>תובנה AI של היום</Text>
// // //                 <View style={styles.aiLabelContainer}>
// // //                   <Text style={styles.aiLabel}>AI</Text>
// // //                 </View>
// // //               </View>
// // //               <Text style={styles.quickInsightText}>
// // //                 {stats.resolutionRate > 90 
// // //                   ? "מצוין! שיעור הפתרון שלכם גבוה מהממוצע. המשיכו כך! 🎉"
// // //                   : stats.openComplaints > 10
// // //                   ? "מומלץ להקצות משאבים נוספים לטיפול בתלונות הפתוחות 📋"
// // //                   : "המערכת פועלת בצורה יעילה. כל הכבוד! ✨"
// // //                 }
// // //               </Text>
// // //             </Card.Content>
// // //           </Card>
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f8fafc',
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f8fafc',
// // //   },
// // //   loadingText: {
// // //     marginTop: 16,
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#4f46e5',
// // //   },
// // //   loadingSubtext: {
// // //     marginTop: 8,
// // //     fontSize: 14,
// // //     color: '#64748b',
// // //   },
// // //   header: {
// // //     padding: 24,
// // //     paddingTop: 60,
// // //     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// // //     backgroundColor: '#4f46e5',
// // //     borderBottomLeftRadius: 40,
// // //     borderBottomRightRadius: 40,
// // //     elevation: 8,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.15,
// // //     shadowRadius: 12,
// // //   },
// // //   headerTop: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //   },
// // //   welcomeText: {
// // //     color: '#ffffff',
// // //     fontSize: 28,
// // //     fontWeight: 'bold',
// // //     textAlign: 'right',
// // //     marginBottom: 8,
// // //   },
// // //   dateText: {
// // //     color: '#e0e7ff',
// // //     fontSize: 16,
// // //     textAlign: 'right',
// // //     marginBottom: 12,
// // //   },
// // //   statusIndicator: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'flex-end',
// // //   },
// // //   statusDot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: '#22c55e',
// // //     marginLeft: 8,
// // //   },
// // //   statusText: {
// // //     color: '#e0e7ff',
// // //     fontSize: 12,
// // //   },
// // //   content: {
// // //     padding: 20,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     color: '#1e293b',
// // //     marginBottom: 16,
// // //     textAlign: 'right',
// // //   },
// // //   statsContainer: {
// // //     marginTop: -40,
// // //     marginBottom: 24,
// // //   },
// // //   statsRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 12,
// // //   },
// // //   statCard: {
// // //     width: width / 2 - 26,
// // //     borderRadius: 20,
// // //     elevation: 4,
// // //     backgroundColor: '#ffffff',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 12,
// // //   },
// // //   statCardContent: {
// // //     padding: 16,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   statIconContainer: {
// // //     position: 'relative',
// // //     marginLeft: 12,
// // //   },
// // //   statTrendIndicator: {
// // //     position: 'absolute',
// // //     top: -4,
// // //     right: -4,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 8,
// // //     padding: 2,
// // //     elevation: 2,
// // //   },
// // //   statTextContainer: {
// // //     flex: 1,
// // //     alignItems: 'flex-end',
// // //   },
// // //   statTitle: {
// // //     fontSize: 12,
// // //     color: '#64748b',
// // //     textAlign: 'right',
// // //     marginBottom: 4,
// // //   },
// // //   statValue: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     textAlign: 'right',
// // //     marginBottom: 4,
// // //   },
// // //   statSubtitle: {
// // //     fontSize: 10,
// // //     color: '#94a3b8',
// // //     textAlign: 'right',
// // //     marginBottom: 8,
// // //   },
// // //   progressBar: {
// // //     height: 4,
// // //     borderRadius: 2,
// // //   },
// // //   aiAlertsContainer: {
// // //     marginBottom: 24,
// // //   },
// // //   aiAlertCard: {
// // //     marginBottom: 12,
// // //     borderRadius: 16,
// // //     borderLeftWidth: 4,
// // //     elevation: 3,
// // //     backgroundColor: '#ffffff',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 8,
// // //   },
// // //   aiAlertContent: {
// // //     padding: 16,
// // //   },
// // //   aiAlertHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   aiAlertTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#1e293b',
// // //     flex: 1,
// // //     marginHorizontal: 12,
// // //     textAlign: 'right',
// // //   },
// // //   aiLabelContainer: {
// // //     backgroundColor: '#8b5cf6',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 12,
// // //   },
// // //   aiLabel: {
// // //     color: '#fff',
// // //     fontSize: 10,
// // //     fontWeight: 'bold',
// // //   },
// // //   aiAlertMessage: {
// // //     fontSize: 14,
// // //     color: '#64748b',
// // //     lineHeight: 20,
// // //     marginBottom: 16,
// // //     textAlign: 'right',
// // //   },
// // //   aiAlertButton: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 12,
// // //     alignSelf: 'flex-end',
// // //   },
// // //   aiAlertButtonText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //   },
// // //   menuContainer: {
// // //     marginBottom: 24,
// // //   },
// // //   menuGrid: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     justifyContent: 'space-between',
// // //   },
// // //   menuCard: {
// // //     width: width / 2 - 26,
// // //     marginBottom: 16,
// // //     borderLeftWidth: 4,
// // //     elevation: 3,
// // //     borderRadius: 20,
// // //     backgroundColor: '#ffffff',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 8,
// // //   },
// // //   menuCardContent: {
// // //     padding: 16,
// // //   },
// // //   menuIconContainer: {
// // //     position: 'relative',
// // //     alignSelf: 'flex-start',
// // //     marginBottom: 12,
// // //   },
// // //   menuIcon: {
// // //     elevation: 2,
// // //   },
// // //   badge: {
// // //     position: 'absolute',
// // //     top: -4,
// // //     right: -4,
// // //   },
// // //   aiIndicator: {
// // //     position: 'absolute',
// // //     bottom: -4,
// // //     left: -4,
// // //     backgroundColor: '#8b5cf6',
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 2,
// // //     borderRadius: 8,
// // //     elevation: 2,
// // //   },
// // //   aiIndicatorText: {
// // //     color: '#fff',
// // //     fontSize: 8,
// // //     fontWeight: 'bold',
// // //   },
// // //   menuTextContainer: {
// // //     alignItems: 'flex-start',
// // //   },
// // //   menuTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginBottom: 4,
// // //     textAlign: 'right',
// // //     color: '#1e293b',
// // //   },
// // //   menuSubtitle: {
// // //     fontSize: 11,
// // //     color: '#64748b',
// // //     marginBottom: 8,
// // //     textAlign: 'right',
// // //   },
// // //   menuCount: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     marginBottom: 4,
// // //   },
// // //   trendContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'flex-end',
// // //   },
// // //   trendText: {
// // //     fontSize: 10,
// // //     fontWeight: '500',
// // //     marginRight: 4,
// // //   },
// // //   activityContainer: {
// // //     marginBottom: 24,
// // //   },
// // //   activityCard: {
// // //     borderRadius: 20,
// // //     elevation: 3,
// // //     backgroundColor: '#ffffff',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 8,
// // //   },
// // //   activityItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 20,
// // //     paddingHorizontal: 4,
// // //   },
// // //   activityIcon: {
// // //     marginLeft: 16,
// // //     elevation: 2,
// // //   },
// // //   activityText: {
// // //     flex: 1,
// // //     alignItems: 'flex-end',
// // //   },
// // //   activityHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'flex-end',
// // //     marginBottom: 4,
// // //   },
// // //   activityTitle: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: '#1e293b',
// // //     textAlign: 'right',
// // //   },
// // //   newBadge: {
// // //     backgroundColor: '#ef4444',
// // //     marginRight: 8,
// // //   },
// // //   activityDescription: {
// // //     fontSize: 13,
// // //     color: '#64748b',
// // //     marginBottom: 4,
// // //     textAlign: 'right',
// // //   },
// // //   timeText: {
// // //     fontSize: 11,
// // //     color: '#94a3b8',
// // //     textAlign: 'right',
// // //   },
// // //   activityActions: {
// // //     justifyContent: 'center',
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#f1f5f9',
// // //     paddingTop: 8,
// // //   },
// // //   emptyState: {
// // //     alignItems: 'center',
// // //     padding: 24,
// // //   },
// // //   emptyStateText: {
// // //     fontSize: 14,
// // //     color: '#94a3b8',
// // //   },
// // //   quickInsightContainer: {
// // //     marginBottom: 24,
// // //   },
// // //   quickInsightCard: {
// // //     borderRadius: 20,
// // //     elevation: 4,
// // //     backgroundColor: '#ffffff',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 12,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#fbbf24',
// // //   },
// // //   quickInsightHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   quickInsightTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#1e293b',
// // //     flex: 1,
// // //     marginHorizontal: 12,
// // //     textAlign: 'right',
// // //   },
// // //   quickInsightText: {
// // //     fontSize: 14,
// // //     color: '#374151',
// // //     lineHeight: 22,
// // //     textAlign: 'right',
// // //   },
// // // });

// // // export default UnifiedManagerDashboard;


// // // UnifiedManagerDashboard.js - דשבורד מנהל משולב עם נתונים אמיתיים
// // import React, { useState, useEffect, useCallback } from 'react';
// // import { 
// //   View, 
// //   ScrollView, 
// //   StyleSheet, 
// //   Dimensions, 
// //   Alert, 
// //   RefreshControl, 
// //   ActivityIndicator,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   Modal
// // } from 'react-native';
// // import { 
// //   Surface, 
// //   Text, 
// //   Card, 
// //   Title, 
// //   Button, 
// //   Avatar, 
// //   IconButton, 
// //   useTheme, 
// //   Divider, 
// //   Badge,
// //   ProgressBar
// // } from 'react-native-paper';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { Ionicons } from '@expo/vector-icons';
// // import axios from 'axios';

// // const { width } = Dimensions.get('window');
// // const API_BASE_URL = 'http://192.168.1.4:5000/api';

// // // רכיב כרטיס תפריט משופר
// // const EnhancedMenuCard = ({ 
// //   title, 
// //   icon, 
// //   count, 
// //   color, 
// //   onPress, 
// //   badge, 
// //   subtitle, 
// //   trend,
// //   isAI = false 
// // }) => (
// //   <Card style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
// //     <Card.Content style={styles.menuCardContent}>
// //       <View style={styles.menuIconContainer}>
// //         <Avatar.Icon 
// //           size={48} 
// //           icon={icon} 
// //           style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
// //           color={color}
// //         />
// //         {badge && (
// //           <Badge
// //             visible={true}
// //             size={20}
// //             style={[styles.badge, { backgroundColor: '#F44336' }]}
// //           >
// //             {badge}
// //           </Badge>
// //         )}
// //         {isAI && (
// //           <View style={styles.aiIndicator}>
// //             <Text style={styles.aiIndicatorText}>AI</Text>
// //           </View>
// //         )}
// //       </View>
      
// //       <View style={styles.menuTextContainer}>
// //         <Text style={styles.menuTitle}>{title}</Text>
// //         {subtitle && (
// //           <Text style={styles.menuSubtitle}>{subtitle}</Text>
// //         )}
// //         {count !== undefined && (
// //           <Text style={[styles.menuCount, { color }]}>{count}</Text>
// //         )}
// //         {trend && (
// //           <View style={styles.trendContainer}>
// //             <Ionicons 
// //               name={trend.type === 'up' ? 'trending-up' : 'trending-down'} 
// //               size={12} 
// //               color={trend.type === 'up' ? '#4CAF50' : '#F44336'} 
// //             />
// //             <Text style={[styles.trendText, { 
// //               color: trend.type === 'up' ? '#4CAF50' : '#F44336' 
// //             }]}>
// //               {trend.value}
// //             </Text>
// //           </View>
// //         )}
// //       </View>
// //     </Card.Content>
// //   </Card>
// // );

// // // רכיב כרטיס סטטיסטיקה משופר
// // const StatCard = ({ 
// //   icon, 
// //   title, 
// //   value, 
// //   color, 
// //   subtitle, 
// //   progress,
// //   trend 
// // }) => (
// //   <Card style={styles.statCard}>
// //     <Card.Content style={styles.statCardContent}>
// //       <View style={styles.statIconContainer}>
// //         <Avatar.Icon 
// //           size={40} 
// //           icon={icon} 
// //           style={{ backgroundColor: `${color}20` }}
// //           color={color}
// //         />
// //         {trend && (
// //           <View style={styles.statTrendIndicator}>
// //             <Ionicons 
// //               name={trend > 0 ? 'arrow-up' : 'arrow-down'} 
// //               size={12} 
// //               color={trend > 0 ? '#4CAF50' : '#F44336'} 
// //             />
// //           </View>
// //         )}
// //       </View>
      
// //       <View style={styles.statTextContainer}>
// //         <Text style={styles.statTitle}>{title}</Text>
// //         <Text style={[styles.statValue, { color }]}>{value}</Text>
// //         {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
// //         {progress !== undefined && (
// //           <ProgressBar 
// //             progress={progress / 100} 
// //             color={color} 
// //             style={styles.progressBar}
// //           />
// //         )}
// //       </View>
// //     </Card.Content>
// //   </Card>
// // );

// // // רכיב התראת AI
// // const AIAlert = ({ alert, onAction }) => (
// //   <Card style={[styles.aiAlertCard, { borderLeftColor: alert.color }]}>
// //     <Card.Content style={styles.aiAlertContent}>
// //       <View style={styles.aiAlertHeader}>
// //         <Ionicons name={alert.icon} size={24} color={alert.color} />
// //         <Text style={styles.aiAlertTitle}>{alert.title}</Text>
// //         <View style={styles.aiLabelContainer}>
// //           <Text style={styles.aiLabel}>AI</Text>
// //         </View>
// //       </View>
      
// //       <Text style={styles.aiAlertMessage}>{alert.message}</Text>
      
// //       <TouchableOpacity 
// //         style={[styles.aiAlertButton, { backgroundColor: alert.color }]}
// //         onPress={() => onAction(alert.action)}
// //       >
// //         <Text style={styles.aiAlertButtonText}>{alert.actionText}</Text>
// //       </TouchableOpacity>
// //     </Card.Content>
// //   </Card>
// // );

// // // הרכיב הראשי
// // const UnifiedManagerDashboard = ({ navigation }) => {
// //   const theme = useTheme();
// //   const [userData, setUserData] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [status, setStatus] = useState({ error: '', success: '' });
// //   const [connectionStatus, setConnectionStatus] = useState('connected');
  
// //   // נתוני סטטיסטיקות
// //   const [stats, setStats] = useState({
// //     citizens: 0,
// //     employees: 0,
// //     openComplaints: 0,
// //     inProgressComplaints: 0,
// //     resolvedComplaints: 0,
// //     closedComplaints: 0,
// //     totalComplaints: 0,
// //     avgRating: 0,
// //     resolutionRate: 0,
// //     weeklyTrend: 0,
// //     monthlyGrowth: 0
// //   });
  
// //   // נתוני AI
// //   const [aiInsights, setAiInsights] = useState({
// //     riskAnalysis: {
// //       highRiskCount: 0,
// //       totalAnalyzed: 0,
// //       averageRisk: 0
// //     },
// //     sentimentAnalysis: {
// //       positive: 0,
// //       neutral: 0,
// //       negative: 0
// //     },
// //     trendsData: {
// //       improving: true,
// //       trend: 'אין מספיק נתונים לניתוח'
// //     },
// //     alerts: []
// //   });
  
// //   const [recentActivity, setRecentActivity] = useState([]);

// //   useEffect(() => {
// //     fetchAllDashboardData();
// //     setupConnectionMonitoring();
// //   }, []);

// //   const fetchAllDashboardData = async () => {
// //     setLoading(true);
// //     try {
// //       await Promise.all([
// //         fetchProfile(),
// //         fetchStats(),
// //         fetchAIInsights(),
// //         fetchRecentActivity()
// //       ]);
// //     } catch (error) {
// //       console.error('Error fetching dashboard data:', error);
// //     }
// //     setLoading(false);
// //   };

// //   const onRefresh = useCallback(async () => {
// //     setRefreshing(true);
// //     await fetchAllDashboardData();
// //     setRefreshing(false);
// //   }, []);

// //   // שליפת פרופיל מנהל
// //   const fetchProfile = async () => {
// //     try {
// //       const userString = await AsyncStorage.getItem('user');
// //       if (!userString) {
// //         setStatus({ error: 'משתמש לא נמצא', success: '' });
// //         return;
// //       }

// //       const user = JSON.parse(userString);
// //       setUserData(user);
      
// //       const token = await AsyncStorage.getItem('token');
// //       if (!token) return;

// //       try {
// //         const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //           timeout: 5000
// //         });
        
// //         if (response.data) {
// //           setUserData(response.data);
// //           console.log('✅ Profile loaded successfully');
// //         }
// //       } catch (error) {
// //         console.log('⚠️ Could not load profile from server, using local data');
// //       }
// //     } catch (error) {
// //       console.error('❌ Error in fetchProfile:', error);
// //     }
// //   };

// //   // שליפת סטטיסטיקות אמיתיות מהשרת
// //   const fetchStats = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('token');
// //       if (!token) {
// //         console.log('No token found');
// //         return;
// //       }

// //       console.log('🔄 Fetching real dashboard statistics...');

// //       // קריאה לקבלת כל התלונות
// //       const complaintsResponse = await axios.get(`${API_BASE_URL}/viewcomplaints`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //         timeout: 10000
// //       });

// //       if (complaintsResponse.data && complaintsResponse.data.status === 'success') {
// //         const complaints = complaintsResponse.data.data;
// //         console.log(`📊 Loaded ${complaints.length} complaints`);

// //         // חישוב סטטיסטיקות אמיתיות
// //         const totalComplaints = complaints.length;
// //         const openComplaints = complaints.filter(c => c.status === 'open').length;
// //         const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
// //         const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
// //         const closedComplaints = complaints.filter(c => c.status === 'closed').length;

// //         // חישוב שיעור פתרון
// //         const resolutionRate = totalComplaints > 0 ? 
// //           (((resolvedComplaints + closedComplaints) / totalComplaints) * 100).toFixed(1) : 0;

// //         // חישוב דירוג ממוצע מחוות דעת
// //         const complaintsWithFeedback = complaints.filter(c => c.feedback && c.feedback.rating);
// //         const avgRating = complaintsWithFeedback.length > 0 ? 
// //           (complaintsWithFeedback.reduce((sum, c) => sum + c.feedback.rating, 0) / complaintsWithFeedback.length).toFixed(1) : 0;

// //         // חישוב מגמות שבועיות
// //         const weekAgo = new Date();
// //         weekAgo.setDate(weekAgo.getDate() - 7);
// //         const weeklyComplaints = complaints.filter(c => new Date(c.createdAt) >= weekAgo).length;

// //         const monthAgo = new Date();
// //         monthAgo.setMonth(monthAgo.getMonth() - 1);
// //         const monthlyComplaints = complaints.filter(c => new Date(c.createdAt) >= monthAgo).length;

// //         console.log('📈 Calculated statistics:', {
// //           totalComplaints,
// //           openComplaints,
// //           resolvedComplaints,
// //           resolutionRate,
// //           avgRating
// //         });

// //         // הערכת מספר משתמשים
// //         let citizensCount = 0;
// //         let employeesCount = 0;

// //         try {
// //           // ניסיון לקבל נתוני משתמשים מהשרת
// //           const [citizensResponse, employeesResponse] = await Promise.allSettled([
// //             axios.get(`${API_BASE_URL}/admin/citizens`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //               timeout: 5000
// //             }),
// //             axios.get(`${API_BASE_URL}/admin/employees`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //               timeout: 5000
// //             })
// //           ]);

// //           if (citizensResponse.status === 'fulfilled' && citizensResponse.value.data?.status === 'success') {
// //             citizensCount = citizensResponse.value.data.data.length;
// //           } else {
// //             // הערכה על בסיס תלונות ייחודיות
// //             const uniqueCitizens = new Set(complaints.map(c => c.citizenId || c.email || c.phone)).size;
// //             citizensCount = Math.max(uniqueCitizens, Math.floor(totalComplaints * 0.7));
// //           }

// //           if (employeesResponse.status === 'fulfilled' && employeesResponse.value.data?.status === 'success') {
// //             employeesCount = employeesResponse.value.data.data.length;
// //           } else {
// //             // הערכה על בסיס עובדים שטיפלו בתלונות
// //             const uniqueEmployees = new Set(
// //               complaints
// //                 .filter(c => c.assignedTo)
// //                 .map(c => c.assignedTo)
// //             ).size;
// //             employeesCount = Math.max(uniqueEmployees, 8);
// //           }
// //         } catch (error) {
// //           console.log('⚠️ Could not fetch user counts, using estimates');
// //           citizensCount = Math.floor(totalComplaints * 0.8);
// //           employeesCount = Math.max(8, Math.floor(totalComplaints * 0.1));
// //         }

// //         const realStats = {
// //           citizens: Math.round(citizensCount),
// //           employees: Math.round(employeesCount),
// //           openComplaints,
// //           inProgressComplaints,
// //           resolvedComplaints,
// //           closedComplaints,
// //           totalComplaints,
// //           avgRating: parseFloat(avgRating),
// //           resolutionRate: parseFloat(resolutionRate),
// //           weeklyTrend: weeklyComplaints,
// //           monthlyGrowth: monthlyComplaints
// //         };

// //         console.log('✅ Real statistics set:', realStats);
// //         setStats(realStats);
// //         setConnectionStatus('connected');

// //       } else {
// //         throw new Error('Invalid complaints response');
// //       }

// //     } catch (error) {
// //       console.error('❌ Error fetching real stats:', error);
// //       console.log('📋 Using fallback data due to server error');
      
// //       setStats({
// //         citizens: 0,
// //         employees: 0,
// //         openComplaints: 0,
// //         resolvedComplaints: 0,
// //         totalComplaints: 0,
// //         avgRating: 0,
// //         resolutionRate: 0,
// //         weeklyTrend: 0,
// //         monthlyGrowth: 0
// //       });
      
// //       setConnectionStatus('disconnected');
// //       setStatus({ 
// //         error: 'לא ניתן לטעון נתונים מהשרת', 
// //         success: '' 
// //       });
// //     }
// //   };

// //   // שליפת תובנות AI אמיתיות
// //   const fetchAIInsights = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('token');
// //       if (!token) {
// //         console.log('No token for AI insights');
// //         return;
// //       }

// //       console.log('🤖 Fetching real AI insights...');

// //       try {
// //         // ניסיון לקבל ניתוח AI מהשרת
// //         const aiResponse = await axios.get(`${API_BASE_URL}/admin/ai-dashboard`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //           timeout: 8000
// //         });
        
// //         if (aiResponse.data && aiResponse.data.status === 'success') {
// //           console.log('✅ Real AI data received');
// //           setAiInsights(aiResponse.data.data);
// //           generateAIAlerts(aiResponse.data.data);
// //           return;
// //         }
// //       } catch (error) {
// //         console.log('⚠️ AI dashboard endpoint not available, analyzing complaints directly...');
// //       }

// //       // אם אין endpoint מיוחד, ננתח את התלונות בעצמנו
// //       try {
// //         const complaintsResponse = await axios.get(`${API_BASE_URL}/viewcomplaints`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //           timeout: 8000
// //         });

// //         if (complaintsResponse.data && complaintsResponse.data.status === 'success') {
// //           const complaints = complaintsResponse.data.data;
// //           console.log(`🔍 Analyzing ${complaints.length} complaints for AI insights...`);

// //           const analysisResults = analyzeComplaintsLocally(complaints);
// //           setAiInsights(analysisResults);
// //           generateAIAlerts(analysisResults);
          
// //           console.log('✅ Local AI analysis completed');
// //         }
// //       } catch (error) {
// //         console.log('❌ Could not fetch complaints for AI analysis');
// //         setAiInsights(generateEmptyAIInsights());
// //       }

// //     } catch (error) {
// //       console.error('❌ Error in fetchAIInsights:', error);
// //       setAiInsights(generateEmptyAIInsights());
// //     }
// //   };

// //   // ניתוח מקומי של תלונות
// //   const analyzeComplaintsLocally = (complaints) => {
// //     if (!complaints || complaints.length === 0) {
// //       return generateEmptyAIInsights();
// //     }

// //     // 1. ניתוח סיכונים על בסיס זמן פתיחה וסטטוס
// //     const now = new Date();
// //     const highRiskComplaints = complaints.filter(complaint => {
// //       const createdAt = new Date(complaint.createdAt);
// //       const daysOpen = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      
// //       return (
// //         (complaint.status === 'open' && daysOpen > 7) ||
// //         (complaint.status === 'in_progress' && daysOpen > 14) ||
// //         (complaint.priority === 'high' || complaint.priority === 'urgent')
// //       );
// //     });

// //     // 2. ניתוח סנטימנט בסיסי
// //     const negativeKeywords = ['זועם', 'כועס', 'נורא', 'איום', 'לא מקבל', 'בושה', 'חוסר', 'גועל', 'נוראי', 'בלגן', 'זבל'];
// //     const positiveKeywords = ['תודה', 'מעולה', 'מצוין', 'אדיב', 'מקצועי', 'מהיר', 'יפה', 'נחמד', 'יעיל'];
    
// //     let positiveCount = 0;
// //     let negativeCount = 0;
// //     let neutralCount = 0;

// //     complaints.forEach(complaint => {
// //       const text = (complaint.description + ' ' + complaint.title).toLowerCase();
// //       const hasNegative = negativeKeywords.some(word => text.includes(word));
// //       const hasPositive = positiveKeywords.some(word => text.includes(word));
      
// //       if (hasNegative && !hasPositive) {
// //         negativeCount++;
// //       } else if (hasPositive && !hasNegative) {
// //         positiveCount++;
// //       } else {
// //         neutralCount++;
// //       }
// //     });

// //     // 3. ניתוח מגמות
// //     const last30Days = new Date();
// //     last30Days.setDate(last30Days.getDate() - 30);
// //     const recentComplaints = complaints.filter(c => new Date(c.createdAt) >= last30Days);
    
// //     const resolvedRecently = recentComplaints.filter(c => 
// //       c.status === 'resolved' || c.status === 'closed'
// //     ).length;
    
// //     const improvementTrend = recentComplaints.length > 0 ? 
// //       (resolvedRecently / recentComplaints.length) > 0.7 : false;

// //     return {
// //       riskAnalysis: {
// //         highRiskCount: highRiskComplaints.length,
// //         totalAnalyzed: complaints.length,
// //         averageRisk: complaints.length > 0 ? highRiskComplaints.length / complaints.length : 0
// //       },
// //       sentimentAnalysis: {
// //         positive: complaints.length > 0 ? Math.round((positiveCount / complaints.length) * 100) : 0,
// //         neutral: complaints.length > 0 ? Math.round((neutralCount / complaints.length) * 100) : 0,
// //         negative: complaints.length > 0 ? Math.round((negativeCount / complaints.length) * 100) : 0
// //       },
// //       trendsData: {
// //         improving: improvementTrend,
// //         trend: improvementTrend ? 'שיפור בטיפול בתלונות' : 'דרושה תשומת לב לטיפול'
// //       },
// //       lastAnalyzed: new Date().toISOString()
// //     };
// //   };

// //   const generateEmptyAIInsights = () => {
// //     return {
// //       riskAnalysis: {
// //         highRiskCount: 0,
// //         totalAnalyzed: 0,
// //         averageRisk: 0
// //       },
// //       sentimentAnalysis: {
// //         positive: 0,
// //         neutral: 0,
// //         negative: 0
// //       },
// //       trendsData: {
// //         improving: true,
// //         trend: 'אין מספיק נתונים לניתוח'
// //       },
// //       alerts: []
// //     };
// //   };

// //   // שליפת פעילות אחרונה אמיתית
// //   const fetchRecentActivity = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('token');
// //       if (!token) {
// //         console.log('No token for recent activity');
// //         return;
// //       }

// //       console.log('📋 Fetching real recent activity...');

// //       try {
// //         // ניסיון לקבל פעילות אחרונה מהשרת
// //         const activityResponse = await axios.get(`${API_BASE_URL}/admin/recent-activity`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //           timeout: 5000
// //         });
        
// //         if (activityResponse.data && activityResponse.data.status === 'success') {
// //           console.log('✅ Real activity data received');
// //           setRecentActivity(activityResponse.data.data);
// //           return;
// //         }
// //       } catch (error) {
// //         console.log('⚠️ Activity endpoint not available, generating from complaints...');
// //       }

// //       // יצירת פעילות מהתלונות
// //       try {
// //         const complaintsResponse = await axios.get(`${API_BASE_URL}/viewcomplaints`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //           timeout: 5000
// //         });

// //         if (complaintsResponse.data && complaintsResponse.data.status === 'success') {
// //           const complaints = complaintsResponse.data.data;
// //           const activities = generateActivityFromComplaints(complaints);
// //           setRecentActivity(activities);
// //           console.log('✅ Generated activity from complaints');
// //         }
// //       } catch (error) {
// //         console.log('❌ Could not fetch complaints for activity');
// //         setRecentActivity([]);
// //       }

// //     } catch (error) {
// //       console.error('❌ Error in fetchRecentActivity:', error);
// //       setRecentActivity([]);
// //     }
// //   };

// //   // יצירת פעילות מתלונות אמיתיות
// //   const generateActivityFromComplaints = (complaints) => {
// //     if (!complaints || complaints.length === 0) return [];

// //     const activities = [];
// //     const now = new Date();

// //     const sortedComplaints = complaints
// //       .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
// //       .slice(0, 10);

// //     sortedComplaints.forEach((complaint, index) => {
// //       const createdAt = new Date(complaint.createdAt);
// //       const updatedAt = new Date(complaint.updatedAt || complaint.createdAt);
// //       const timeDiff = Math.abs(now - updatedAt);
// //       const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
// //       const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

// //       let timeText;
// //       if (hoursAgo < 1) {
// //         timeText = 'לפני פחות משעה';
// //       } else if (hoursAgo < 24) {
// //         timeText = `לפני ${hoursAgo} שעות`;
// //       } else {
// //         timeText = `לפני ${daysAgo} ימים`;
// //       }

// //       let activityType, icon, color, title, description;
// //       const isNew = hoursAgo <= 6;

// //       switch (complaint.status) {
// //         case 'open':
// //           activityType = 'new_complaint';
// //           icon = 'add-circle';
// //           color = '#FF9800';
// //           title = 'תלונה חדשה התקבלה';
// //           description = `${complaint.category} - ${complaint.title?.substring(0, 30)}...`;
// //           break;
// //         case 'in_progress':
// //           activityType = 'complaint_assigned';
// //           icon = 'person';
// //           color = '#2196F3';
// //           title = 'תלונה הועברה לטיפול';
// //           description = `${complaint.category} - בטיפול`;
// //           break;
// //         case 'resolved':
// //           activityType = 'complaint_resolved';
// //           icon = 'checkmark-circle';
// //           color = '#4CAF50';
// //           title = 'תלונה נפתרה';
// //           description = `${complaint.category} - טופלה בהצלחה`;
// //           break;
// //         case 'closed':
// //           activityType = 'complaint_closed';
// //           icon = 'close-circle';
// //           color = '#9E9E9E';
// //           title = 'תלונה נסגרה';
// //           description = `${complaint.category} - הטיפול הושלם`;
// //           break;
// //         default:
// //           activityType = 'complaint_updated';
// //           icon = 'refresh';
// //           color = '#607D8B';
// //           title = 'תלונה עודכנה';
// //           description = `${complaint.category} - עדכון סטטוס`;
// //       }

// //       activities.push({
// //         id: complaint._id || index,
// //         type: activityType,
// //         icon,
// //         color,
// //         title,
// //         description,
// //         time: timeText,
// //         isNew,
// //         complaintId: complaint._id
// //       });
// //     });

// //     // הוספת פעילות ניתוח AI
// //     if (complaints.length > 0) {
// //       activities.unshift({
// //         id: 'ai_analysis_' + Date.now(),
// //         type: 'ai_analysis',
// //         icon: 'analytics',
// //         color: '#9C27B0',
// //         title: 'ניתוח AI הושלם',
// //         description: `${complaints.length} תלונות נותחו`,
// //         time: 'לפני 30 דקות',
// //         isNew: true
// //       });
// //     }

// //     return activities.slice(0, 6);
// //   };

// //   // יצירת התראות AI על בסיס נתונים אמיתיים
// //   const generateAIAlerts = (aiData) => {
// //     const alerts = [];
    
// //     if (aiData.riskAnalysis?.highRiskCount > 0) {
// //       const urgencyLevel = aiData.riskAnalysis.highRiskCount > 5 ? 'critical' : 'warning';
// //       alerts.push({
// //         id: 1,
// //         type: urgencyLevel,
// //         icon: urgencyLevel === 'critical' ? 'alert-circle' : 'warning',
// //         color: urgencyLevel === 'critical' ? '#F44336' : '#FF9800',
// //         title: `${aiData.riskAnalysis.highRiskCount} תלונות בסיכון גבוה`,
// //         message: `זוהו ${aiData.riskAnalysis.highRiskCount} תלונות הדורשות טיפול מיידי מתוך ${aiData.riskAnalysis.totalAnalyzed} שנותחו`,
// //         actionText: 'טפל עכשיו',
// //         action: 'high-risk'
// //       });
// //     }
    
// //     if (aiData.sentimentAnalysis?.negative > 20) {
// //       alerts.push({
// //         id: 2,
// //         type: 'error',
// //         icon: 'sad',
// //         color: '#F44336',
// //         title: 'סנטימנט שלילי גבוה',
// //         message: `${aiData.sentimentAnalysis.negative}% מהתלונות מכילות סנטימנט שלילי - דרוש שיפור בשירות`,
// //         actionText: 'צפה בניתוח',
// //         action: 'sentiment'
// //       });
// //     } else if (aiData.sentimentAnalysis?.negative > 10) {
// //       alerts.push({
// //         id: 2,
// //         type: 'warning',
// //         icon: 'sad',
// //         color: '#FF9800',
// //         title: 'סנטימנט שלילי מתון',
// //         message: `${aiData.sentimentAnalysis.negative}% מהתלונות מכילות סנטימנט שלילי`,
// //         actionText: 'צפה בניתוח',
// //         action: 'sentiment'
// //       });
// //     }
    
// //     if (aiData.trendsData?.improving && aiData.sentimentAnalysis?.positive > 60) {
// //       alerts.push({
// //         id: 3,
// //         type: 'success',
// //         icon: 'trending-up',
// //         color: '#4CAF50',
// //         title: 'מגמה חיובית! 🎉',
// //         message: `${aiData.sentimentAnalysis.positive}% מהתלונות חיוביות - ${aiData.trendsData.trend}`,
// //         actionText: 'צפה בדוח',
// //         action: 'trends'
// //       });
// //     }

// //     if (alerts.length === 0 && aiData.riskAnalysis?.totalAnalyzed > 0) {
// //       alerts.push({
// //         id: 4,
// //         type: 'info',
// //         icon: 'checkmark-circle',
// //         color: '#2196F3',
// //         title: 'המערכת פועלת תקין ✨',
// //         message: `נותחו ${aiData.riskAnalysis.totalAnalyzed} תלונות - הכל תחת שליטה`,
// //         actionText: 'צפה בניתוח',
// //         action: 'dashboard'
// //       });
// //     }
    
// //     console.log(`🔔 Generated ${alerts.length} AI alerts`);
// //     setAiInsights(prev => ({ ...prev, alerts }));
// //   };

// //   // טיפול בפעולות התראות AI
// //   const handleAIAlertAction = (action) => {
// //     switch (action) {
// //       case 'high-risk':
// //         navigation.navigate('HighRiskComplaintsScreen');
// //         break;
// //       case 'sentiment':
// //         navigation.navigate('AIAnalysisScreen');
// //         break;
// //       case 'trends':
// //         navigation.navigate('TrendsReportScreen');
// //         break;
// //       case 'dashboard':
// //         navigation.navigate('AdminAIDashboard');
// //         break;
// //       default:
// //         Alert.alert('מידע', 'פעולה זו עדיין לא מוכנה');
// //     }
// //   };

// //   // מעקב חיבור לשרת
// //   const setupConnectionMonitoring = () => {
// //     const checkConnection = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('token');
// //         if (!token) {
// //           setConnectionStatus('no-auth');
// //           return;
// //         }

// //         const response = await axios.get(`${API_BASE_URL}/health`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //           timeout: 3000
// //         });
        
// //         setConnectionStatus('connected');
// //       } catch (error) {
// //         setConnectionStatus('disconnected');
// //       }
// //     };

// //     checkConnection();
// //     const interval = setInterval(checkConnection, 30000);
// //     return () => clearInterval(interval);
// //   };

// //   // יציאה מהמערכת
// //   const handleLogout = async () => {
// //     Alert.alert(
// //       'יציאה מהמערכת',
// //       'האם אתה בטוח שברצונך להתנתק?',
// //       [
// //         { text: 'ביטול', style: 'cancel' },
// //         {
// //           text: 'יציאה',
// //           onPress: async () => {
// //             await AsyncStorage.removeItem('token');
// //             await AsyncStorage.removeItem('userRole');
// //             await AsyncStorage.removeItem('user');
// //             navigation.replace('loginScreen');
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // פונקציה ליצירת תובנה יומית דינמית
// //   const generateDailyInsight = () => {
// //     const insights = [];
    
// //     if (stats.resolutionRate > 90) {
// //       insights.push("מצוין! שיעור הפתרון שלכם גבוה מהממוצע. המשיכו כך! 🎉");
// //     } else if (stats.resolutionRate > 70) {
// //       insights.push("שיעור פתרון טוב, אך יש מקום לשיפור. נסו לזהות צווארי בקבוק 📈");
// //     } else if (stats.resolutionRate > 0) {
// //       insights.push("שיעור הפתרון נמוך. מומלץ לבחון את תהליכי הטיפול בתלונות 🔍");
// //     }
    
// //     if (stats.openComplaints > 10) {
// //       insights.push("מומלץ להקצות משאבים נוספים לטיפול בתלונות הפתוחות 📋");
// //     } else if (stats.openComplaints > 5) {
// //       insights.push("יש מספר תלונות פתוחות. כדאי לתעדף לפי דחיפות ⏰");
// //     } else if (stats.openComplaints === 0) {
// //       insights.push("כל הכבוד! אין תלונות פתוחות כרגע ✨");
// //     }
    
// //     if (aiInsights.riskAnalysis?.highRiskCount > 3) {
// //       insights.push("זוהו מספר תלונות בסיכון גבוה - מומלץ טיפול מיידי ⚠️");
// //     } else if (aiInsights.riskAnalysis?.highRiskCount === 0) {
// //       insights.push("אין תלונות בסיכון גבוה - המערכת פועלת יעיל 🛡️");
// //     }
    
// //     if (stats.avgRating >= 4) {
// //       insights.push(`דירוג מצוין (${stats.avgRating}⭐) - התושבים מרוצים מהשירות!`);
// //     } else if (stats.avgRating >= 3) {
// //       insights.push(`דירוג סביר (${stats.avgRating}⭐) - יש מקום לשיפור איכות השירות`);
// //     } else if (stats.avgRating > 0) {
// //       insights.push(`דירוג נמוך (${stats.avgRating}⭐) - נדרש שיפור משמעותי בשירות`);
// //     }
    
// //     if (aiInsights.sentimentAnalysis?.positive > 70) {
// //       insights.push("הסנטימנט של התושבים חיובי מאוד! 😊");
// //     } else if (aiInsights.sentimentAnalysis?.negative > 30) {
// //       insights.push("יש הרבה סנטימנט שלילי - כדאי לבחון את איכות השירות");
// //     }
    
// //     if (insights.length === 0) {
// //       return "המערכת פועלת תקין. המשיכו לעקוב אחר הנתונים לתובנות נוספות 📊";
// //     }
    
// //     return insights[Math.floor(Math.random() * insights.length)];
// //   };

// //   // אינדיקטור סטטוס
// //   const getStatusIndicator = () => {
// //     switch (connectionStatus) {
// //       case 'connected':
// //         return { dot: '#22c55e', text: 'מערכת פעילה', icon: 'checkmark-circle' };
// //       case 'disconnected':
// //         return { dot: '#ef4444', text: 'בעיית חיבור', icon: 'alert-circle' };
// //       case 'no-auth':
// //         return { dot: '#f59e0b', text: 'נדרש אימות', icon: 'lock-closed' };
// //       default:
// //         return { dot: '#6b7280', text: 'בודק חיבור...', icon: 'time' };
// //     }
// //   };

// //   // עיצוב כרטיסי התפריט עם נתונים דינמיים
// //   const menuItems = [
// //     {
// //       title: 'רשימת עובדים',
// //       subtitle: 'ניהול צוות',
// //       icon: 'people',
// //       count: stats.employees > 0 ? stats.employees.toString() : 'טוען...',
// //       color: '#4CAF50',
// //       onPress: () => navigation.navigate('EmployeeList'),
// //       trend: stats.employees > 0 ? { type: 'up', value: `${stats.employees} פעילים` } : null
// //     },
// //     {
// //       title: 'רשימת אזרחים',
// //       subtitle: 'מאגר תושבים',
// //       icon: 'people-outline',
// //       count: stats.citizens > 0 ? stats.citizens.toString() : 'טוען...',
// //       color: '#2196F3',
// //       onPress: () => navigation.navigate('CitizenList'),
// //       trend: stats.weeklyTrend > 0 ? { type: 'up', value: `+${stats.weeklyTrend} השבוע` } : null
// //     },
// //     {
// //       title: 'תלונות פתוחות',
// //       subtitle: stats.openComplaints > 5 ? 'דורש תשומת לב' : 'תחת שליטה',
// //       icon: 'alert-circle',
// //       count: stats.openComplaints >= 0 ? stats.openComplaints.toString() : 'טוען...',
// //       color: stats.openComplaints > 5 ? '#F44336' : '#FF9800',
// //       badge: stats.openComplaints > 0 ? stats.openComplaints.toString() : null,
// //       onPress: () => navigation.navigate('ViewComplaints')
// //     },
// //     {
// //       title: 'ניתוח AI חכם',
// //       subtitle: 'תובנות מתקדמות',
// //       icon: 'analytics',
// //       count: aiInsights.riskAnalysis?.totalAnalyzed > 0 ? `${aiInsights.riskAnalysis.totalAnalyzed} נותחו` : undefined,
// //       color: '#9C27B0',
// //       onPress: () => navigation.navigate('AdminAIDashboard'),
// //       isAI: true
// //     },
// //     {
// //       title: 'תלונות בסיכון',
// //       subtitle: 'זיהוי מוקדם',
// //       icon: 'warning',
// //       count: aiInsights.riskAnalysis?.highRiskCount >= 0 ? aiInsights.riskAnalysis.highRiskCount.toString() : 'טוען...',
// //       color: aiInsights.riskAnalysis?.highRiskCount > 3 ? '#F44336' : '#FF5722',
// //       onPress: () => navigation.navigate('HighRiskComplaintsScreen'),
// //       isAI: true,
// //       badge: aiInsights.riskAnalysis?.highRiskCount > 0 ? aiInsights.riskAnalysis.highRiskCount.toString() : null
// //     },
// //     {
// //       title: 'דוח מגמות',
// //       subtitle: aiInsights.trendsData?.improving ? 'מגמה חיובית' : 'ניתוח טרנדים',
// //       icon: 'trending-up',
// //       color: '#00BCD4',
// //       onPress: () => navigation.navigate('TrendsReportScreen'),
// //       isAI: true
// //     },
// //     {
// //       title: 'חוות דעת',
// //       subtitle: 'משוב תושבים',
// //       icon: 'star',
// //       count: stats.avgRating > 0 ? `${stats.avgRating}⭐` : 'אין נתונים',
// //       color: stats.avgRating >= 4 ? '#4CAF50' : stats.avgRating >= 3 ? '#FF9800' : '#F44336',
// //       onPress: () => navigation.navigate('FeedbackDashboard'),
// //       trend: stats.avgRating > 0 ? { 
// //         type: stats.avgRating >= 4 ? 'up' : 'down', 
// //         value: `${stats.avgRating}/5` 
// //       } : null
// //     },
// //     {
// //       title: 'הפרופיל שלי',
// //       subtitle: 'הגדרות אישיות',
// //       icon: 'person',
// //       color: '#607D8B',
// //       onPress: () => navigation.navigate('ProfilePage')
// //     }
// //   ];

// //   if (loading && !refreshing) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#4f46e5" />
// //         <Text style={styles.loadingText}>טוען דשבורד...</Text>
// //         <Text style={styles.loadingSubtext}>מביא נתונים אמיתיים מהשרת</Text>
// //         <View style={styles.loadingSteps}>
// //           <Text style={styles.loadingStep}>📊 טוען סטטיסטיקות...</Text>
// //           <Text style={styles.loadingStep}>🤖 מנתח נתוני AI...</Text>
// //           <Text style={styles.loadingStep}>📋 מביא פעילות אחרונה...</Text>
// //         </View>
// //       </View>
// //     );
// //   }

// //   const fullName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'מנהל';
// //   const statusInfo = getStatusIndicator();

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* כותרת מעוצבת עם אינדיקטור סטטוס */}
// //       <Surface style={styles.header}>
// //         <View style={styles.headerTop}>
// //           <View style={styles.headerTextContainer}>
// //             <Title style={styles.welcomeText}>שלום, {fullName}</Title>
// //             <Text style={styles.dateText}>
// //               {new Date().toLocaleDateString('he-IL', { 
// //                 weekday: 'long', 
// //                 year: 'numeric', 
// //                 month: 'long', 
// //                 day: 'numeric' 
// //               })}
// //             </Text>
// //             <View style={styles.statusIndicator}>
// //               <View style={[styles.statusDot, { backgroundColor: statusInfo.dot }]} />
// //               <Text style={styles.statusText}>{statusInfo.text}</Text>
// //               <Ionicons name={statusInfo.icon} size={12} color="#e0e7ff" style={{ marginRight: 4 }} />
// //             </View>
// //           </View>
// //           <IconButton
// //             icon="logout"
// //             size={24}
// //             iconColor="#FFF"
// //             onPress={handleLogout}
// //           />
// //         </View>
// //       </Surface>

// //       <ScrollView 
// //         style={styles.content} 
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={
// //           <RefreshControl 
// //             refreshing={refreshing} 
// //             onRefresh={onRefresh} 
// //             colors={['#4f46e5']}
// //             tintColor="#4f46e5"
// //             title="מביא נתונים אמיתיים..."
// //             titleColor="#4f46e5"
// //           />
// //         }
// //       >
// //         {/* הודעת שגיאה אם יש */}
// //         {status.error ? (
// //           <Card style={styles.errorCard}>
// //             <Card.Content style={styles.errorContent}>
// //               <Ionicons name="warning" size={20} color="#F44336" />
// //               <Text style={styles.errorText}>{status.error}</Text>
// //               <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
// //                 <Text style={styles.retryText}>נסה שוב</Text>
// //               </TouchableOpacity>
// //             </Card.Content>
// //           </Card>
// //         ) : null}

// //         {/* כרטיסי סטטיסטיקה מהירה */}
// //         <View style={styles.statsContainer}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>מבט כללי</Text>
// //             {stats.totalComplaints > 0 && (
// //               <Text style={styles.sectionSubtitle}>
// //                 מבוסס על {stats.totalComplaints} תלונות
// //               </Text>
// //             )}
// //           </View>
// //           <View style={styles.statsRow}>
// //             <StatCard 
// //               icon="people" 
// //               title="אזרחים" 
// //               value={stats.citizens > 0 ? stats.citizens : '0'}
// //               color="#2196F3"
// //               progress={stats.citizens > 0 ? Math.min((stats.citizens / 2000) * 100, 100) : 0}
// //               trend={stats.weeklyTrend}
// //             />
// //             <StatCard 
// //               icon="person" 
// //               title="עובדים" 
// //               value={stats.employees > 0 ? stats.employees : '0'}
// //               color="#4CAF50"
// //               progress={stats.employees > 0 ? Math.min((stats.employees / 50) * 100, 100) : 0}
// //               trend={1}
// //             />
// //           </View>
// //           <View style={styles.statsRow}>
// //             <StatCard 
// //               icon="alert-circle" 
// //               title="תלונות פתוחות" 
// //               value={stats.openComplaints >= 0 ? stats.openComplaints : '0'}
// //               color={stats.openComplaints > 5 ? '#F44336' : '#FF9800'}
// //               subtitle={stats.openComplaints > 5 ? "דורש תשומת לב" : "תחת שליטה"}
// //               trend={stats.openComplaints > 10 ? 1 : -1}
// //             />
// //             <StatCard 
// //               icon="checkmark-circle" 
// //               title="שיעור פתרון" 
// //               value={stats.resolutionRate > 0 ? `${stats.resolutionRate}%` : '0%'}
// //               color={stats.resolutionRate > 80 ? '#4CAF50' : stats.resolutionRate > 60 ? '#FF9800' : '#F44336'}
// //               progress={stats.resolutionRate}
// //               trend={stats.resolutionRate > 80 ? 1 : -1}
// //             />
// //           </View>
// //         </View>

// //         {/* התראות AI */}
// //         {aiInsights.alerts && aiInsights.alerts.length > 0 && (
// //           <View style={styles.aiAlertsContainer}>
// //             <Text style={styles.sectionTitle}>התראות AI</Text>
// //             {aiInsights.alerts.map((alert) => (
// //               <AIAlert 
// //                 key={alert.id} 
// //                 alert={alert} 
// //                 onAction={handleAIAlertAction}
// //               />
// //             ))}
// //           </View>
// //         )}

// //         {/* תפריט ראשי */}
// //         <View style={styles.menuContainer}>
// //           <Text style={styles.sectionTitle}>ניהול המערכת</Text>
// //           <View style={styles.menuGrid}>
// //             {menuItems.map((item, index) => (
// //               <EnhancedMenuCard key={index} {...item} />
// //             ))}
// //           </View>
// //         </View>

// //         {/* פעילות אחרונה */}
// //         <View style={styles.activityContainer}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>פעילות אחרונה</Text>
// //             {recentActivity.length > 0 && (
// //               <Text style={styles.sectionSubtitle}>
// //                 {recentActivity.filter(a => a.isNew).length} חדשות
// //               </Text>
// //             )}
// //           </View>
// //           <Card style={styles.activityCard}>
// //             <Card.Content>
// //               {recentActivity.length > 0 ? (
// //                 recentActivity.map((activity, index) => (
// //                   <TouchableOpacity 
// //                     key={index} 
// //                     style={styles.activityItem}
// //                     onPress={() => {
// //                       if (activity.complaintId) {
// //                         navigation.navigate('ComplaintDetails', { complaintId: activity.complaintId });
// //                       }
// //                     }}
// //                   >
// //                     <Avatar.Icon 
// //                       size={40} 
// //                       icon={activity.icon} 
// //                       style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}
// //                       color={activity.color}
// //                     />
// //                     <View style={styles.activityText}>
// //                       <View style={styles.activityHeader}>
// //                         <Text style={styles.activityTitle}>{activity.title}</Text>
// //                         {activity.isNew && (
// //                           <Badge size={16} style={styles.newBadge}>חדש</Badge>
// //                         )}
// //                       </View>
// //                       <Text style={styles.activityDescription}>{activity.description}</Text>
// //                       <Text style={styles.timeText}>{activity.time}</Text>
// //                     </View>
// //                     <Ionicons name="chevron-back" size={16} color="#ccc" />
// //                   </TouchableOpacity>
// //                 ))
// //               ) : (
// //                 <View style={styles.emptyState}>
// //                   <Ionicons name="time" size={48} color="#ccc" />
// //                   <Text style={styles.emptyStateText}>אין פעילות חדשה</Text>
// //                   <Text style={styles.emptyStateSubtext}>הפעילויות יופיעו כאן</Text>
// //                 </View>
// //               )}
// //             </Card.Content>
// //             {recentActivity.length > 0 && (
// //               <Card.Actions style={styles.activityActions}>
// //                 <Button 
// //                   mode="text" 
// //                   onPress={() => navigation.navigate('ActivityLog')}
// //                   textColor="#4f46e5"
// //                 >
// //                   צפה בכל הפעילויות
// //                 </Button>
// //               </Card.Actions>
// //             )}
// //           </Card>
// //         </View>

// //         {/* תובנת AI מהירה */}
// //         <View style={styles.quickInsightContainer}>
// //           <Card style={styles.quickInsightCard}>
// //             <Card.Content>
// //               <View style={styles.quickInsightHeader}>
// //                 <Ionicons name="bulb" size={24} color="#FFC107" />
// //                 <Text style={styles.quickInsightTitle}>תובנה AI של היום</Text>
// //                 <View style={styles.aiLabelContainer}>
// //                   <Text style={styles.aiLabel}>AI</Text>
// //                 </View>
// //               </View>
// //               <Text style={styles.quickInsightText}>
// //                 {generateDailyInsight()}
// //               </Text>
// //               {connectionStatus === 'connected' && (
// //                 <View style={styles.insightFooter}>
// //                   <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
// //                   <Text style={styles.insightFooterText}>מבוסס על נתונים אמיתיים</Text>
// //                 </View>
// //               )}
// //             </Card.Content>
// //           </Card>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // // סטיילים מלאים
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8fafc',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f8fafc',
// //     padding: 20,
// //   },
// //   loadingText: {
// //     marginTop: 16,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#4f46e5',
// //   },
// //   loadingSubtext: {
// //     marginTop: 8,
// //     fontSize: 14,
// //     color: '#64748b',
// //     textAlign: 'center',
// //   },
// //   loadingSteps: {
// //     marginTop: 20,
// //     alignItems: 'center',
// //   },
// //   loadingStep: {
// //     fontSize: 12,
// //     color: '#94a3b8',
// //     marginBottom: 4,
// //   },
// //   errorCard: {
// //     margin: 15,
// //     borderRadius: 12,
// //     borderLeftWidth: 4,
// //     borderLeftColor: '#F44336',
// //   },
// //   errorContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //   },
// //   errorText: {
// //     flex: 1,
// //     marginHorizontal: 12,
// //     fontSize: 14,
// //     color: '#F44336',
// //   },
// //   retryButton: {
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     backgroundColor: '#F44336',
// //     borderRadius: 8,
// //   },
// //   retryText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   header: {
// //     padding: 24,
// //     paddingTop: 60,
// //     backgroundColor: '#4f46e5',
// //     borderBottomLeftRadius: 40,
// //     borderBottomRightRadius: 40,
// //     elevation: 8,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 12,
// //   },
// //   headerTop: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //   },
// //   welcomeText: {
// //     color: '#ffffff',
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     textAlign: 'right',
// //     marginBottom: 8,
// //   },
// //   dateText: {
// //     color: '#e0e7ff',
// //     fontSize: 16,
// //     textAlign: 'right',
// //     marginBottom: 12,
// //   },
// //   statusIndicator: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'flex-end',
// //   },
// //   statusDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     marginLeft: 8,
// //   },
// //   statusText: {
// //     color: '#e0e7ff',
// //     fontSize: 12,
// //     marginRight: 4,
// //   },
// //   content: {
// //     padding: 20,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#1e293b',
// //     marginBottom: 16,
// //     textAlign: 'right',
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   sectionSubtitle: {
// //     fontSize: 12,
// //     color: '#64748b',
// //   },
// //   statsContainer: {
// //     marginTop: -40,
// //     marginBottom: 24,
// //   },
// //   statsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 12,
// //   },
// //   statCard: {
// //     width: width / 2 - 26,
// //     borderRadius: 20,
// //     elevation: 4,
// //     backgroundColor: '#ffffff',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 12,
// //   },
// //   statCardContent: {
// //     padding: 16,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   statIconContainer: {
// //     position: 'relative',
// //     marginLeft: 12,
// //   },
// //   statTrendIndicator: {
// //     position: 'absolute',
// //     top: -4,
// //     right: -4,
// //     backgroundColor: '#fff',
// //     borderRadius: 8,
// //     padding: 2,
// //     elevation: 2,
// //   },
// //   statTextContainer: {
// //     flex: 1,
// //     alignItems: 'flex-end',
// //   },
// //   statTitle: {
// //     fontSize: 12,
// //     color: '#64748b',
// //     textAlign: 'right',
// //     marginBottom: 4,
// //   },
// //   statValue: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     textAlign: 'right',
// //     marginBottom: 4,
// //   },
// //   statSubtitle: {
// //     fontSize: 10,
// //     color: '#94a3b8',
// //     textAlign: 'right',
// //     marginBottom: 8,
// //   },
// //   progressBar: {
// //     height: 4,
// //     borderRadius: 2,
// //   },
// //   aiAlertsContainer: {
// //     marginBottom: 24,
// //   },
// //   aiAlertCard: {
// //     marginBottom: 12,
// //     borderRadius: 16,
// //     borderLeftWidth: 4,
// //     elevation: 3,
// //     backgroundColor: '#ffffff',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 8,
// //   },
// //   aiAlertContent: {
// //     padding: 16,
// //   },
// //   aiAlertHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   aiAlertTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#1e293b',
// //     flex: 1,
// //     marginHorizontal: 12,
// //     textAlign: 'right',
// //   },
// //   aiLabelContainer: {
// //     backgroundColor: '#8b5cf6',
// //     paddingHorizontal: 8,
// //     paddingVertical: 2,
// //     borderRadius: 12,
// //   },
// //   aiLabel: {
// //     color: '#fff',
// //     fontSize: 10,
// //     fontWeight: 'bold',
// //   },
// //   aiAlertMessage: {
// //     fontSize: 14,
// //     color: '#64748b',
// //     lineHeight: 20,
// //     marginBottom: 16,
// //     textAlign: 'right',
// //   },
// //   aiAlertButton: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 12,
// //     alignSelf: 'flex-end',
// //   },
// //   aiAlertButtonText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   menuContainer: {
// //     marginBottom: 24,
// //   },
// //   menuGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   menuCard: {
// //     width: width / 2 - 26,
// //     marginBottom: 16,
// //     borderLeftWidth: 4,
// //     elevation: 3,
// //     borderRadius: 20,
// //     backgroundColor: '#ffffff',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 8,
// //   },
// //   menuCardContent: {
// //     padding: 16,
// //   },
// //   menuIconContainer: {
// //     position: 'relative',
// //     alignSelf: 'flex-start',
// //     marginBottom: 12,
// //   },
// //   menuIcon: {
// //     elevation: 2,
// //   },
// //   badge: {
// //     position: 'absolute',
// //     top: -4,
// //     right: -4,
// //   },
// //   aiIndicator: {
// //     position: 'absolute',
// //     bottom: -4,
// //     left: -4,
// //     backgroundColor: '#8b5cf6',
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 8,
// //     elevation: 2,
// //   },
// //   aiIndicatorText: {
// //     color: '#fff',
// //     fontSize: 8,
// //     fontWeight: 'bold',
// //   },
// //   menuTextContainer: {
// //     alignItems: 'flex-start',
// //   },
// //   menuTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 4,
// //     textAlign: 'right',
// //     color: '#1e293b',
// //   },
// //   menuSubtitle: {
// //     fontSize: 11,
// //     color: '#64748b',
// //     marginBottom: 8,
// //     textAlign: 'right',
// //   },
// //   menuCount: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 4,
// //   },
// //   trendContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'flex-end',
// //   },
// //   trendText: {
// //     fontSize: 10,
// //     fontWeight: '500',
// //     marginRight: 4,
// //   },
// //   activityContainer: {
// //     marginBottom: 24,
// //   },
// //   activityCard: {
// //     // border
// //     Radius: 20,
// // elevation: 3,
// // backgroundColor: '#ffffff',
// // shadowColor: '#000',
// // shadowOffset: { width: 0, height: 2 },
// // shadowOpacity: 0.08,
// // shadowRadius: 8,
// // },
// // activityItem: {
// // flexDirection: 'row',
// // alignItems: 'flex-start',
// // marginBottom: 20,
// // paddingHorizontal: 4,
// // paddingVertical: 8,
// // borderRadius: 12,
// // },
// // activityIcon: {
// // marginLeft: 16,
// // elevation: 2,
// // },
// // activityText: {
// // flex: 1,
// // alignItems: 'flex-end',
// // },
// // activityHeader: {
// // flexDirection: 'row',
// // alignItems: 'center',
// // justifyContent: 'flex-end',
// // marginBottom: 4,
// // },
// // activityTitle: {
// // fontSize: 15,
// // fontWeight: '600',
// // color: '#1e293b',
// // textAlign: 'right',
// // },
// // newBadge: {
// // backgroundColor: '#ef4444',
// // marginRight: 8,
// // },
// // activityDescription: {
// // fontSize: 13,
// // color: '#64748b',
// // marginBottom: 4,
// // textAlign: 'right',
// // },
// // timeText: {
// // fontSize: 11,
// // color: '#94a3b8',
// // textAlign: 'right',
// // },
// // activityActions: {
// // justifyContent: 'center',
// // borderTopWidth: 1,
// // borderTopColor: '#f1f5f9',
// // paddingTop: 8,
// // },
// // emptyState: {
// // alignItems: 'center',
// // padding: 32,
// // },
// // emptyStateText: {
// // fontSize: 16,
// // color: '#94a3b8',
// // marginTop: 12,
// // },
// // emptyStateSubtext: {
// // fontSize: 12,
// // color: '#cbd5e1',
// // marginTop: 4,
// // },
// // quickInsightContainer: {
// // marginBottom: 24,
// // },
// // quickInsightCard: {
// // borderRadius: 20,
// // elevation: 4,
// // backgroundColor: '#ffffff',
// // shadowColor: '#000',
// // shadowOffset: { width: 0, height: 2 },
// // shadowOpacity: 0.1,
// // shadowRadius: 12,
// // borderLeftWidth: 4,
// // borderLeftColor: '#fbbf24',
// // },
// // quickInsightHeader: {
// // flexDirection: 'row',
// // alignItems: 'center',
// // marginBottom: 12,
// // },
// // quickInsightTitle: {
// // fontSize: 16,
// // fontWeight: 'bold',
// // color: '#1e293b',
// // flex: 1,
// // marginHorizontal: 12,
// // textAlign: 'right',
// // },
// // quickInsightText: {
// // fontSize: 14,
// // color: '#374151',
// // lineHeight: 22,
// // textAlign: 'right',
// // },
// // insightFooter: {
// // flexDirection: 'row',
// // alignItems: 'center',
// // justifyContent: 'flex-end',
// // marginTop: 12,
// // paddingTop: 12,
// // borderTopWidth: 1,
// // borderTopColor: '#f1f5f9',
// // },
// // insightFooterText: {
// // fontSize: 12,
// // color: '#4CAF50',
// // marginRight: 6,
// // fontWeight: '500',
// // },
// // });
// // export default UnifiedManagerDashboard;



// // EnhancedManagerDashboard.js - גרסה מתוקנת עם טיפול בבעיות רשת
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   RefreshControl,
//   ActivityIndicator,
//   TouchableOpacity,
//   Text,
//   SafeAreaView
// } from 'react-native';
// import { 
//   Surface, 
//   Card, 
//   Title, 
//   Avatar, 
//   IconButton, 
//   useTheme, 
//   Divider, 
//   Badge,
//   Button,
//   Chip
// } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.1.4:5000/api';

// // הגדרת timeout קצר יותר ופונקציות עזר לטיפול ברשת
// const NETWORK_TIMEOUT = 8000; // 8 שניות במקום ברירת המחדל

// const fetchWithTimeout = async (url, options = {}) => {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT);
  
//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//     clearTimeout(timeoutId);
//     return response;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     throw error;
//   }
// };

// const UnifiedManagerDashboard = ({ navigation }) => {
//   const theme = useTheme();
//   const [userData, setUserData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [status, setStatus] = useState({ error: '', success: '' });
//   const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'online', 'offline'
  
//   // נתונים אמיתיים עם ערכי ברירת מחדל
//   const [realTimeStats, setRealTimeStats] = useState({
//     totalComplaints: 0,
//     openComplaints: 0,
//     inProgressComplaints: 0,
//     resolvedComplaints: 0,
//     closedComplaints: 0,
//     totalEmployees: 12, // ערך ברירת מחדל
//     totalCitizens: 158, // ערך ברירת מחדל
//     averageRating: '0',
//     feedbackCount: 0
//   });
  
//   // נתוני AI עם ערכי ברירת מחדל
//   const [aiInsights, setAiInsights] = useState({
//     sentimentDistribution: { positive: 3, negative: 2, neutral: 1, urgent: 1 },
//     urgencyDistribution: { low: 2, medium: 3, high: 2, critical: 0 },
//     analyzedComplaints: 7,
//     highRiskCount: 2
//   });
  
//   // התראות עם ערכי ברירת מחדל
//   const [alerts, setAlerts] = useState([]);
  
//   // תלונות אחרונות עם ערכי ברירת מחדל
//   const [recentComplaints, setRecentComplaints] = useState([]);

//   useEffect(() => {
//     checkConnectionAndLoadData();
//   }, []);

//   const checkConnectionAndLoadData = async () => {
//     setConnectionStatus('checking');
//     try {
//       // בדיקת חיבור פשוטה
//       const response = await fetchWithTimeout(`${API_BASE_URL.replace('/api', '')}/test`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' }
//       });
      
//       if (response.ok) {
//         setConnectionStatus('online');
//         await fetchAllDashboardData();
//       } else {
//         throw new Error('Server not responding');
//       }
//     } catch (error) {
//       console.log('Connection failed:', error.message);
//       setConnectionStatus('offline');
//       loadOfflineData();
//     }
//   };

//   const fetchAllDashboardData = async () => {
//     setLoading(true);
    
//     // טען נתונים בסדר עדיפויות - הכי חשוב קודם
//     await fetchProfile();
//     await fetchRealTimeStats();
    
//     // נתונים פחות חשובים - אם נכשל זה לא קריטי
//     try {
//       await Promise.allSettled([
//         fetchRecentComplaints(),
//         fetchAIInsights()
//       ]);
//     } catch (error) {
//       console.log('Non-critical data fetch failed:', error);
//     }
    
//     setLoading(false);
//   };

//   const loadOfflineData = () => {
//     setLoading(false);
//     // נתונים לדוגמה במצב offline
//     setRealTimeStats({
//       totalComplaints: 45,
//       openComplaints: 8,
//       inProgressComplaints: 12,
//       resolvedComplaints: 20,
//       closedComplaints: 5,
//       totalEmployees: 12,
//       totalCitizens: 158,
//       averageRating: '4.2',
//       feedbackCount: 25
//     });
    
//     setRecentComplaints([
//       {
//         _id: '1',
//         title: 'בור בכביש',
//         category: 'תשתיות',
//         status: 'open',
//         createdAt: new Date().toISOString()
//       },
//       {
//         _id: '2', 
//         title: 'תאורת רחוב לא עובדת',
//         category: 'תאורה',
//         status: 'in_progress',
//         createdAt: new Date(Date.now() - 86400000).toISOString()
//       }
//     ]);

//     setAlerts([
//       {
//         type: 'warning',
//         message: 'מצב לא מקוון - נתונים עשויים להיות לא עדכניים',
//         action: 'retry-connection'
//       }
//     ]);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await checkConnectionAndLoadData();
//     setRefreshing(false);
//   };

//   // טעינת פרופיל המנהל - עם fallback
//   const fetchProfile = async () => {
//     try {
//       const userString = await AsyncStorage.getItem('user');
//       if (!userString) {
//         setStatus({ error: 'משתמש לא נמצא', success: '' });
//         return;
//       }

//       const user = JSON.parse(userString);
//       setUserData(user);
      
//       if (connectionStatus === 'offline') return;

//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetchWithTimeout(`${API_BASE_URL}/profile/${user._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data);
//         }
//       } catch (error) {
//         console.log('לא ניתן לטעון פרופיל מהשרת, משתמש בנתונים מקומיים');
//       }
//     } catch (error) {
//       console.error('Error in fetchProfile:', error);
//     }
//   };

//   // טעינת סטטיסטיקות אמיתיות עם fallback
//   const fetchRealTimeStats = async () => {
//     if (connectionStatus === 'offline') return;

//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       // נסה לקבל נתוני תלונות עם timeout קצר
//       const complaintsResponse = await fetchWithTimeout(`${API_BASE_URL}/viewcomplaints`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (complaintsResponse.ok) {
//         const complaintsData = await complaintsResponse.json();
//         const complaints = complaintsData.data || [];
        
//         // חישוב סטטיסטיקות תלונות
//         const stats = {
//           totalComplaints: complaints.length,
//           openComplaints: complaints.filter(c => c.status === 'open').length,
//           inProgressComplaints: complaints.filter(c => c.status === 'in_progress').length,
//           resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
//           closedComplaints: complaints.filter(c => c.status === 'closed').length,
//         };

//         // חישוב ממוצע דירוגים
//         const complaintsWithFeedback = complaints.filter(c => c.feedback && c.feedback.rating);
//         if (complaintsWithFeedback.length > 0) {
//           const totalRating = complaintsWithFeedback.reduce((sum, c) => sum + c.feedback.rating, 0);
//           stats.averageRating = (totalRating / complaintsWithFeedback.length).toFixed(1);
//           stats.feedbackCount = complaintsWithFeedback.length;
//         }

//         setRealTimeStats(prevStats => ({ ...prevStats, ...stats }));
//       }

//     } catch (error) {
//       console.error('Error fetching real-time stats:', error);
//       // אל תשנה כלום אם יש שגיאה - השאר את הערכים הקיימים
//     }
//   };

//   // טעינת תובנות AI עם fallback
//   const fetchAIInsights = async () => {
//     if (connectionStatus === 'offline') return;

//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       const response = await fetchWithTimeout(`${API_BASE_URL}/admin/ai-dashboard`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === 'success') {
//           setAiInsights(data.data.aiInsights || aiInsights);
//           setAlerts(data.data.alerts || []);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching AI insights:', error);
//       // השאר את הערכים הקיימים במקרה של שגיאה
//     }
//   };

//   // טעינת תלונות אחרונות עם fallback
//   const fetchRecentComplaints = async () => {
//     if (connectionStatus === 'offline') return;

//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       const response = await fetchWithTimeout(`${API_BASE_URL}/viewcomplaints`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.data) {
//           setRecentComplaints(data.data.slice(0, 5));
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching recent complaints:', error);
//       // השאר את הערכים הקיימים
//     }
//   };

//   const handleLogout = async () => {
//     Alert.alert(
//       'יציאה מהמערכת',
//       'האם אתה בטוח שברצונך להתנתק?',
//       [
//         { text: 'ביטול', style: 'cancel' },
//         {
//           text: 'יציאה',
//           onPress: async () => {
//             await AsyncStorage.removeItem('token');
//             await AsyncStorage.removeItem('userRole');
//             await AsyncStorage.removeItem('user');
//             navigation.replace('loginScreen');
//           }
//         }
//       ]
//     );
//   };

//   // רכיב אינדיקטור חיבור
//   const ConnectionStatus = () => {
//     if (connectionStatus === 'checking') {
//       return (
//         <View style={styles.connectionStatus}>
//           <ActivityIndicator size="small" color="#FF9800" />
//           <Text style={styles.connectionText}>בודק חיבור...</Text>
//         </View>
//       );
//     }
    
//     if (connectionStatus === 'offline') {
//       return (
//         <TouchableOpacity 
//           style={[styles.connectionStatus, styles.offlineStatus]} 
//           onPress={checkConnectionAndLoadData}
//         >
//           <Ionicons name="cloud-offline" size={16} color="#F44336" />
//           <Text style={[styles.connectionText, { color: '#F44336' }]}>לא מקוון - לחץ לחיבור</Text>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <View style={[styles.connectionStatus, styles.onlineStatus]}>
//         <Ionicons name="cloud-done" size={16} color="#4CAF50" />
//         <Text style={[styles.connectionText, { color: '#4CAF50' }]}>מקוון</Text>
//       </View>
//     );
//   };

//   // רכיב כרטיסיית סטטיסטיקה
//   const StatCard = ({ icon, title, value, color, subtitle, trend, onPress }) => (
//     <TouchableOpacity style={styles.statCard} onPress={onPress}>
//       <Card.Content style={styles.statCardContent}>
//         <View style={styles.statIconContainer}>
//           <Avatar.Icon 
//             size={36} 
//             icon={icon} 
//             style={{ backgroundColor: `${color}20` }}
//             color={color}
//           />
//           {trend && (
//             <Ionicons 
//               name={trend === 'up' ? 'trending-up' : 'trending-down'} 
//               size={16} 
//               color={trend === 'up' ? '#4CAF50' : '#F44336'}
//               style={styles.trendIcon}
//             />
//           )}
//         </View>
//         <View style={styles.statTextContainer}>
//           <Text style={styles.statTitle}>{title}</Text>
//           <Text style={[styles.statValue, { color }]}>{value}</Text>
//           {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
//         </View>
//       </Card.Content>
//     </TouchableOpacity>
//   );

//   // רכיב כרטיסיית תפריט משופרת
//   const MenuCard = ({ title, icon, count, color, onPress, badge, description }) => (
//     <TouchableOpacity style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
//       <Card.Content style={styles.menuCardContent}>
//         <View style={styles.menuIconContainer}>
//           <Avatar.Icon 
//             size={48} 
//             icon={icon} 
//             style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
//             color={color}
//           />
//           {badge && (
//             <Badge
//               visible={true}
//               size={22}
//               style={[styles.badge, { backgroundColor: '#F44336' }]}
//             >
//               {badge}
//             </Badge>
//           )}
//         </View>
//         <View style={styles.menuTextContainer}>
//           <Text style={styles.menuTitle}>{title}</Text>
//           {description && <Text style={styles.menuDescription}>{description}</Text>}
//           {count !== undefined && (
//             <Text style={[styles.menuCount, { color }]}>{count}</Text>
//           )}
//         </View>
//       </Card.Content>
//     </TouchableOpacity>
//   );

//   // רכיב תובנות AI
//   const AIInsightsCard = () => (
//     <Card style={styles.aiCard}>
//       <Card.Title 
//         title="תובנות בינה מלאכותית"
//         left={(props) => <Avatar.Icon {...props} icon="brain" />}
//         right={(props) => (
//           <TouchableOpacity onPress={() => navigation.navigate('AdminAIDashboard')}>
//             <Ionicons name="chevron-forward" size={24} color="#666" />
//           </TouchableOpacity>
//         )}
//       />
//       <Card.Content>
//         <View style={styles.aiInsightsContainer}>
//           <View style={styles.aiInsightItem}>
//             <Text style={styles.aiInsightTitle}>ניתוחים שבוצעו</Text>
//             <Text style={styles.aiInsightValue}>{aiInsights.analyzedComplaints || 0}</Text>
//           </View>
//           <View style={styles.aiInsightItem}>
//             <Text style={styles.aiInsightTitle}>סיכון גבוה</Text>
//             <Text style={[styles.aiInsightValue, { color: '#F44336' }]}>
//               {aiInsights.highRiskCount || 0}
//             </Text>
//           </View>
//         </View>
        
//         {/* גרף סנטימנט מיני */}
//         <View style={styles.miniChart}>
//           <Text style={styles.miniChartTitle}>סנטימנט</Text>
//           <View style={styles.miniChartBars}>
//             {Object.entries(aiInsights.sentimentDistribution || {}).map(([sentiment, count]) => (
//               <View key={sentiment} style={styles.miniBarContainer}>
//                 <View 
//                   style={[
//                     styles.miniBar, 
//                     { 
//                       height: Math.max(count * 10, 5),
//                       backgroundColor: getSentimentColor(sentiment)
//                     }
//                   ]} 
//                 />
//                 <Text style={styles.miniBarLabel}>{getSentimentEmoji(sentiment)}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   // רכיב התראות
//   const AlertsCard = () => {
//     const displayAlerts = connectionStatus === 'offline' 
//       ? [{
//           type: 'warning',
//           message: 'מצב לא מקוון - נתונים עשויים להיות לא עדכניים',
//           action: 'retry-connection'
//         }, ...alerts]
//       : alerts;

//     if (!displayAlerts || displayAlerts.length === 0) {
//       return (
//         <Card style={styles.alertsCard}>
//           <Card.Content style={styles.noAlertsContainer}>
//             <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
//             <Text style={styles.noAlertsText}>אין התראות פעילות</Text>
//           </Card.Content>
//         </Card>
//       );
//     }

//     return (
//       <Card style={styles.alertsCard}>
//         <Card.Title title="התראות מערכת" />
//         <Card.Content>
//           {displayAlerts.slice(0, 3).map((alert, index) => (
//             <TouchableOpacity 
//               key={index} 
//               style={[styles.alertItem, { backgroundColor: getAlertColor(alert.type) }]}
//               onPress={() => handleAlertAction(alert.action)}
//             >
//               <Ionicons 
//                 name={getAlertIcon(alert.type)} 
//                 size={20} 
//                 color="#fff" 
//                 style={styles.alertIcon}
//               />
//               <Text style={styles.alertMessage}>{alert.message}</Text>
//             </TouchableOpacity>
//           ))}
//         </Card.Content>
//       </Card>
//     );
//   };

//   // פונקציות עזר
//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return '#4CAF50';
//       case 'negative': return '#FF5722';
//       case 'urgent': return '#FF9800';
//       default: return '#9E9E9E';
//     }
//   };

//   const getSentimentEmoji = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return '😊';
//       case 'negative': return '😞';
//       case 'urgent': return '🚨';
//       default: return '😐';
//     }
//   };

//   const getAlertColor = (type) => {
//     switch (type) {
//       case 'critical': return '#F44336';
//       case 'warning': return '#FF9800';
//       case 'info': return '#2196F3';
//       default: return '#757575';
//     }
//   };

//   const getAlertIcon = (type) => {
//     switch (type) {
//       case 'critical': return 'alert-circle';
//       case 'warning': return 'warning';
//       case 'info': return 'information-circle';
//       default: return 'notifications';
//     }
//   };

//   const handleAlertAction = (action) => {
//     switch (action) {
//       case 'retry-connection':
//         checkConnectionAndLoadData();
//         break;
//       case 'view-critical-complaints':
//         navigation.navigate('ViewComplaints');
//         break;
//       case 'review-urgent-complaints':
//         navigation.navigate('AdminAIDashboard');
//         break;
//       default:
//         Alert.alert('מידע', 'פעולה זו עדיין לא מוכנה');
//     }
//   };

//   // רכיבי התפריט
//   const menuItems = [
//     {
//       title: 'ניתוח AI מתקדם',
//       description: 'תובנות וניתוחים',
//       icon: 'brain',
//       color: '#9C27B0',
//       onPress: () => navigation.navigate('AdminAIDashboard')
//     },
//     {
//       title: 'רשימת עובדים',
//       description: 'ניהול צוות',
//       icon: 'account-group',
//       count: realTimeStats.totalEmployees?.toString() || '0',
//       color: '#4CAF50',
//       onPress: () => navigation.navigate('EmployeeList')
//     },
//     {
//       title: 'רשימת אזרחים',
//       description: 'משתמשי המערכת',
//       icon: 'account-multiple',
//       count: realTimeStats.totalCitizens?.toString() || '0',
//       color: '#2196F3',
//       onPress: () => navigation.navigate('CitizenList')
//     },
//     {
//       title: 'תלונות פתוחות',
//       description: 'דורשות טיפול',
//       icon: 'message-alert',
//       count: realTimeStats.openComplaints?.toString() || '0',
//       color: '#F44336',
//       badge: realTimeStats.openComplaints > 5 ? realTimeStats.openComplaints.toString() : null,
//       onPress: () => navigation.navigate('ViewComplaints')
//     },
//     {
//       title: 'חוות דעת',
//       description: 'דירוגים וסטטיסטיקות',
//       icon: 'chart-bar',
//       count: `${realTimeStats.averageRating}⭐`,
//       color: '#FF9800',
//       onPress: () => navigation.navigate('FeedbackDashboard')
//     },
//     {
//       title: 'הפרופיל שלי',
//       description: 'הגדרות אישיות',
//       icon: 'account-cog',
//       color: '#607D8B',
//       onPress: () => navigation.navigate('ProfilePage')
//     }
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'open': return '#FF9800';
//       case 'in_progress': return '#2196F3';
//       case 'resolved': return '#4CAF50';
//       case 'closed': return '#9E9E9E';
//       default: return '#757575';
//     }
//   };

//   const getStatusLabel = (status) => {
//     switch (status) {
//       case 'open': return 'פתוח';
//       case 'in_progress': return 'בטיפול';
//       case 'resolved': return 'טופל';
//       case 'closed': return 'סגור';
//       default: return 'לא ידוע';
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4f46e5" />
//         <Text style={styles.loadingText}>טוען נתונים...</Text>
//         <ConnectionStatus />
//       </View>
//     );
//   }

//   const fullName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'מנהל';

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <Surface style={styles.header}>
//         <View style={styles.headerTop}>
//           <View>
//             <Title style={styles.welcomeText}>שלום, {fullName}</Title>
//             <Text style={styles.dateText}>
//               {new Date().toLocaleDateString('he-IL', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })}
//             </Text>
//           </View>
//           <View style={styles.headerActions}>
//             <ConnectionStatus />
//             <IconButton
//               icon="refresh"
//               size={24}
//               color="#FFF"
//               onPress={onRefresh}
//             />
//             <IconButton
//               icon="logout"
//               size={24}
//               color="#FFF"
//               onPress={handleLogout}
//             />
//           </View>
//         </View>
//       </Surface>

//       <ScrollView 
//         style={styles.content} 
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4f46e5']} />
//         }
//       >
//         {/* סטטיסטיקות מהירות */}
//         <View style={styles.statsContainer}>
//           <Text style={styles.sectionTitle}>סקירה כללית</Text>
//           <View style={styles.statsRow}>
//             <StatCard 
//               icon="file-document-multiple" 
//               title="סה״כ תלונות" 
//               value={realTimeStats.totalComplaints}
//               color="#2196F3"
//               onPress={() => navigation.navigate('ViewComplaints')}
//             />
//             <StatCard 
//               icon="clock-outline" 
//               title="פתוחות" 
//               value={realTimeStats.openComplaints}
//               color="#FF9800"
//               subtitle="דורשות טיפול"
//               onPress={() => navigation.navigate('ViewComplaints')}
//             />
//           </View>
//           <View style={styles.statsRow}>
//             <StatCard 
//               icon="progress-clock" 
//               title="בטיפול" 
//               value={realTimeStats.inProgressComplaints}
//               color="#3F51B5"
//               subtitle="בתהליך"
//             />
//             <StatCard 
//               icon="check-circle" 
//               title="טופלו" 
//               value={realTimeStats.resolvedComplaints + realTimeStats.closedComplaints}
//               color="#4CAF50"
//               subtitle="הסתיימו"
//             />
//           </View>
//         </View>

//         {/* תובנות AI */}
//         <View style={styles.aiSection}>
//           <Text style={styles.sectionTitle}>תובנות בינה מלאכותית</Text>
//           <AIInsightsCard />
//         </View>

//         {/* התראות */}
//         <View style={styles.alertsSection}>
//           <Text style={styles.sectionTitle}>התראות מערכת</Text>
//           <AlertsCard />
//         </View>

//         {/* תפריט פעולות */}
//         <View style={styles.menuSection}>
//           <Text style={styles.sectionTitle}>ניהול המערכת</Text>
//           <View style={styles.menuGrid}>
//             {menuItems.map((item, index) => (
//               <MenuCard key={index} {...item} />
//             ))}
//           </View>
//         </View>

//         {/* פעילות אחרונה */}
//         <View style={styles.activitySection}>
//           <Text style={styles.sectionTitle}>תלונות אחרונות</Text>
//           <Card style={styles.activityCard}>
//             <Card.Content>
//               {recentComplaints.length > 0 ? (
//                 recentComplaints.map((complaint, index) => (
//                   <View key={index} style={styles.activityItem}>
//                     <Avatar.Icon 
//                       size={40} 
//                       icon="message-text" 
//                       style={[styles.activityIcon, { backgroundColor: `${getStatusColor(complaint.status)}20` }]}
//                       color={getStatusColor(complaint.status)}
//                     />
//                     <View style={styles.activityText}>
//                       <Text style={styles.activityTitle}>{complaint.title}</Text>
//                       <Text style={styles.activityCategory}>{complaint.category}</Text>
//                       <Text style={styles.timeText}>
//                         {new Date(complaint.createdAt).toLocaleDateString('he-IL')}
//                       </Text>
//                     </View>
//                     <Chip 
//                       mode="outlined" 
//                       style={[styles.statusChip, { borderColor: getStatusColor(complaint.status) }]}
//                       textStyle={{ color: getStatusColor(complaint.status), fontSize: 10 }}
//                     >
//                       {getStatusLabel(complaint.status)}
//                     </Chip>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.emptyState}>
//                   <Text style={styles.emptyStateText}>
//                     {connectionStatus === 'offline' ? 'לא ניתן לטעון תלונות - אין חיבור' : 'אין תלונות חדשות'}
//                   </Text>
//                 </View>
//               )}
//             </Card.Content>
//             <Card.Actions style={styles.activityActions}>
//               <Button 
//                 mode="text" 
//                 onPress={() => navigation.navigate('ViewComplaints')}
//                 color="#4f46e5"
//               >
//                 צפה בכל התלונות
//               </Button>
//             </Card.Actions>
//           </Card>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#4f46e5',
//   },
//   connectionStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginRight: 8,
//   },
//   connectionText: {
//     fontSize: 12,
//     marginLeft: 4,
//     color: '#FF9800',
//   },
//   onlineStatus: {
//     backgroundColor: '#4CAF5020',
//   },
//   offlineStatus: {
//     backgroundColor: '#F4433620',
//   },
//   header: {
//     padding: 24,
//     paddingTop: 60,
//     backgroundColor: '#4f46e5',
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerActions: {
//     flexDirection: 'row',
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
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 12,
//     marginTop: 8,
//     textAlign: 'right',
//   },
//   statsContainer: {
//     marginTop: -40,
//     marginBottom: 24,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   statCard: {
//     width: width / 2 - 26,
//     borderRadius: 16,
//     elevation: 3,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
//   statCardContent: {
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statIconContainer: {
//     position: 'relative',
//   },
//   trendIcon: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//   },
//   statTextContainer: {
//     marginRight: 12,
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   statTitle: {
//     fontSize: 14,
//     color: '#6b7280',
//     textAlign: 'right',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'right',
//   },
//   statSubtitle: {
//     fontSize: 12,
//     color: '#9ca3af',
//     textAlign: 'right',
//     marginTop: 2,
//   },
//   aiSection: {
//     marginBottom: 24,
//   },
//   aiCard: {
//     borderRadius: 20,
//     elevation: 3,
//     backgroundColor: '#ffffff',
//   },
//   aiInsightsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   aiInsightItem: {
//     alignItems: 'center',
//   },
//   aiInsightTitle: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   aiInsightValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2196F3',
//   },
//   miniChart: {
//     marginTop: 16,
//   },
//   miniChartTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   miniChartBars: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'flex-end',
//     height: 50,
//   },
//   miniBarContainer: {
//     alignItems: 'center',
//   },
//   miniBar: {
//     width: 20,
//     borderRadius: 10,
//     marginBottom: 4,
//   },
//   miniBarLabel: {
//     fontSize: 16,
//   },
//   alertsSection: {
//     marginBottom: 24,
//   },
//   alertsCard: {
//     borderRadius: 20,
//     elevation: 3,
//     backgroundColor: '#ffffff',
//   },
//   noAlertsContainer: {
//     alignItems: 'center',
//     padding: 24,
//   },
//   noAlertsText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#4CAF50',
//     fontWeight: '500',
//   },
//   alertItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   alertIcon: {
//     marginRight: 12,
//   },
//   alertMessage: {
//     color: '#fff',
//     fontSize: 14,
//     flex: 1,
//   },
//   menuSection: {
//     marginBottom: 24,
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   menuCard: {
//     width: width / 2 - 26,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     elevation: 3,
//     borderRadius: 20,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
//   menuCardContent: {
//     padding: 16,
//   },
//   menuIconContainer: {
//     position: 'relative',
//     alignSelf: 'flex-start',
//     marginBottom: 12,
//   },
//   menuIcon: {
//     marginBottom: 4,
//   },
//   badge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//   },
//   menuTextContainer: {
//     alignItems: 'flex-start',
//   },
//   menuTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//     textAlign: 'right',
//     color: '#1f2937',
//   },
//   menuDescription: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   menuCount: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   activitySection: {
//     marginBottom: 24,
//   },
//   activityCard: {
//     borderRadius: 20,
//     elevation: 3,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingHorizontal: 4,
//   },
//   activityIcon: {
//     marginLeft: 16,
//   },
//   activityText: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   activityTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1f2937',
//     textAlign: 'right',
//   },
//   activityCategory: {
//     fontSize: 12,
//     color: '#4b5563',
//     marginTop: 2,
//     textAlign: 'right',
//   },
//   timeText: {
//     fontSize: 10,
//     color: '#9ca3af',
//     marginTop: 2,
//     textAlign: 'right',
//   },
//   statusChip: {
//     height: 24,
//     marginLeft: 8,
//   },
//   activityActions: {
//     justifyContent: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#f3f4f6',
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 24,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#9ca3af',
//     textAlign: 'center',
//   },
// });

// export default UnifiedManagerDashboard;

// UnifiedManagerDashboard.js - דשבורד מנהל מאוחד עם AI
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

const UnifiedManagerDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [highRiskComplaints, setHighRiskComplaints] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [status, setStatus] = useState({ error: '', success: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchDashboardStats(),
      fetchAIInsights(),
      fetchHighRiskComplaints(),
      fetchFeedbackStats(),
      fetchRecentActivity()
    ]);
    setLoading(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData().finally(() => setRefreshing(false));
  }, []);

  const fetchProfile = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setUserData(user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const BASE_URL = 'http://1192.168.1.3:5000';
      
      const response = await fetch(`${BASE_URL}/api/viewcomplaints`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const complaints = data.data;
          const stats = calculateStats(complaints);
          setDashboardStats(stats);
          
          const recent = complaints
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setRecentComplaints(recent);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchAIInsights = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const BASE_URL = 'http://192.168.1.3:5000';
      
      const response = await fetch(`${BASE_URL}/api/admin/ai-dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setAiInsights(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const fetchHighRiskComplaints = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const BASE_URL = 'http://192.168.1.3:5000';
      
      const response = await fetch(`${BASE_URL}/api/admin/high-risk-complaints`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setHighRiskComplaints(data.data.highRiskComplaints || []);
        }
      }
    } catch (error) {
      console.error('Error fetching high risk complaints:', error);
    }
  };

  const fetchFeedbackStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const BASE_URL = 'http://192.168.1.3:5000';
      
      const response = await fetch(`${BASE_URL}/api/admin/feedback-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setFeedbackStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // נתונים לדוגמה - ניתן להחליף בקריאה אמיתית לשרת
      setRecentActivity([
        {
          id: 1,
          type: 'new_complaint',
          icon: 'alert-circle',
          color: '#F44336',
          title: 'התקבלה תלונה חדשה',
          description: 'תשתיות - בור בכביש',
          time: 'לפני שעה'
        },
        {
          id: 2,
          type: 'complaint_resolved',
          icon: 'check-circle',
          color: '#4CAF50',
          title: 'תלונה טופלה',
          description: 'ניקיון - פינוי אשפה',
          time: 'לפני 3 שעות'
        },
        {
          id: 3,
          type: 'ai_alert',
          icon: 'brain',
          color: '#9C27B0',
          title: 'התראת AI',
          description: 'זוהו 3 תלונות בסיכון גבוה',
          time: 'לפני 5 שעות'
        }
      ]);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const calculateStats = (complaints) => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === 'open').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const closed = complaints.filter(c => c.status === 'closed').length;

    const categories = {};
    complaints.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = complaints.filter(c => new Date(c.createdAt) >= weekAgo).length;

    const withFeedback = complaints.filter(c => c.feedback && c.feedback.rating).length;
    const avgRating = withFeedback > 0 ? 
      complaints
        .filter(c => c.feedback && c.feedback.rating)
        .reduce((sum, c) => sum + c.feedback.rating, 0) / withFeedback 
      : 0;

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      categories,
      thisWeek,
      withFeedback,
      avgRating,
      resolutionRate: total > 0 ? ((resolved + closed) / total * 100).toFixed(1) : 0
    };
  };

  const handleLogout = async () => {
    Alert.alert(
      'יציאה מהמערכת',
      'האם אתה בטוח שברצונך להתנתק?',
      [
        { text: 'ביטול', style: 'cancel' },
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

  const renderWelcomeHeader = () => {
    const currentHour = new Date().getHours();
    let greeting = 'בוקר טוב';
    if (currentHour >= 12 && currentHour < 17) {
      greeting = 'צהריים טובים';
    } else if (currentHour >= 17) {
      greeting = 'ערב טוב';
    }

    const fullName = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'מנהל';

    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>{greeting}, {fullName}</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('he-IL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            {dashboardStats && (
              <Text style={styles.statsText}>
                {dashboardStats.open + dashboardStats.inProgress} תלונות פעילות
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleLogout}
          >
            <Ionicons name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStatsCards = () => {
    if (!dashboardStats) return null;

    const statsCards = [
      {
        title: 'סה״כ תלונות',
        value: dashboardStats.total,
        icon: 'document-text',
        color: '#2196F3',
        trend: `+${dashboardStats.thisWeek} השבוע`
      },
      {
        title: 'ממתינות לטיפול',
        value: dashboardStats.open,
        icon: 'time',
        color: '#FF9800',
        trend: dashboardStats.open > 10 ? 'דורש תשומת לב' : 'תחת שליטה'
      },
      {
        title: 'בטיפול',
        value: dashboardStats.inProgress,
        icon: 'construct',
        color: '#2196F3',
        trend: 'פעיל'
      },
      {
        title: 'שיעור פתרון',
        value: `${dashboardStats.resolutionRate}%`,
        icon: 'checkmark-circle',
        color: '#4CAF50',
        trend: dashboardStats.resolutionRate > 70 ? 'מצוין' : 'ניתן לשפר'
      }
    ];

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>מבט כללי</Text>
        <View style={styles.statsGrid}>
          {statsCards.map((card, index) => (
            <View key={index} style={[styles.statCard, { borderTopColor: card.color }]}>
              <View style={styles.statHeader}>
                <Ionicons name={card.icon} size={24} color={card.color} />
                <Text style={styles.statValue}>{card.value}</Text>
              </View>
              <Text style={styles.statTitle}>{card.title}</Text>
              <Text style={[styles.statTrend, { color: card.color }]}>
                {card.trend}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAIInsights = () => {
    if (!aiInsights) return null;

    const { sentimentDistribution = {}, urgencyDistribution = {}, alerts = [] } = aiInsights.aiInsights || {};
    
    return (
      <View style={styles.aiContainer}>
        <View style={styles.aiHeader}>
          <Ionicons name="brain" size={20} color="#9C27B0" />
          <Text style={styles.sectionTitle}>תובנות AI</Text>
        </View>
        
        {alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {alerts.slice(0, 2).map((alert, index) => (
              <View key={index} style={[styles.alertCard, { 
                borderLeftColor: alert.type === 'critical' ? '#F44336' : '#FF9800' 
              }]}>
                <View style={styles.alertContent}>
                  <Ionicons 
                    name={alert.type === 'critical' ? 'warning' : 'information-circle'} 
                    size={20} 
                    color={alert.type === 'critical' ? '#F44336' : '#FF9800'} 
                  />
                  <Text style={styles.alertText}>{alert.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sentimentContainer}>
          <Text style={styles.subSectionTitle}>ניתוח סנטימנט</Text>
          <View style={styles.sentimentGrid}>
            {Object.entries(sentimentDistribution).map(([sentiment, count]) => (
              <View key={sentiment} style={styles.sentimentItem}>
                <Text style={styles.sentimentLabel}>
                  {sentiment === 'positive' ? 'חיובי' : 
                   sentiment === 'negative' ? 'שלילי' : 
                   sentiment === 'urgent' ? 'דחוף' : 'נייטרלי'}
                </Text>
                <Text style={[styles.sentimentCount, { 
                  color: sentiment === 'positive' ? '#4CAF50' : 
                         sentiment === 'negative' ? '#F44336' : 
                         sentiment === 'urgent' ? '#FF5722' : '#9E9E9E'
                }]}>
                  {count}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderQuickActions = () => {
    const menuItems = [
      {
        title: 'ניתוח AI מקיף',
        icon: 'analytics',
        color: '#9C27B0',
        badge: aiInsights?.alerts?.length || null,
        onPress: () => navigation.navigate('AdminAIDashboard')
      },
      {
        title: 'תלונות בסיכון',
        icon: 'warning',
        color: '#F44336',
        badge: highRiskComplaints.length || null,
        onPress: () => navigation.navigate('HighRiskComplaintsScreen')
      },
      {
        title: 'דוח מגמות',
        icon: 'trending-up',
        color: '#4CAF50',
        onPress: () => navigation.navigate('TrendsReportScreen')
      },
      {
        title: 'רשימת עובדים',
        icon: 'people',
        color: '#2196F3',
        count: '12',
        onPress: () => navigation.navigate('EmployeeList')
      },
      {
        title: 'רשימת אזרחים',
        icon: 'person-add',
        color: '#FF9800',
        count: dashboardStats?.total?.toString() || '0',
        onPress: () => navigation.navigate('CitizenList')
      },
      {
        title: 'סטטיסטיקות חוות דעת',
        icon: 'star',
        color: '#FFC107',
        count: feedbackStats?.overall?.count?.toString() || '0',
        onPress: () => navigation.navigate('FeedbackDashboard')
      },
      {
        title: 'כל התלונות',
        icon: 'list',
        color: '#607D8B',
        onPress: () => navigation.navigate('ViewComplaints')
      },
      {
        title: 'הפרופיל שלי',
        icon: 'person',
        color: '#795548',
        onPress: () => navigation.navigate('ProfilePage')
      }
    ];

    return (
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>ניהול המערכת</Text>
        <View style={styles.quickActionsGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.quickActionCard}
              onPress={item.onPress}
            >
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon} size={28} color={item.color} />
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quickActionTitle}>{item.title}</Text>
                {item.count && (
                  <Text style={[styles.quickActionCount, { color: item.color }]}>
                    {item.count}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

//   const renderRecentActivity = () => (
//     <View style={styles.activityContainer}>
//       <Text style={styles.sectionTitle}>פעילות אחרונה</Text>
//       <View style={styles.activityList}>
//         {recentActivity.map((activity) => (
//           <View key={activity.id} style={styles.activityItem}>
//             <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
//               <Ionicons name={activity.icon} size={24} color={activity.color} />
//             </View>
//             <View style={styles.activityText}>
//               <Text style={styles.activityTitle}>{activity.title}</Text>
//               <Text style={styles.activityDescription}>{activity.description}</Text>
//               <Text style={styles.activityTime}>{activity.time}</Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     </View>
//   );

  const renderRecentComplaints = () => (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>תלונות אחרונות</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewComplaints')}>
          <Text style={styles.viewAllText}>צפה בהכל</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.recentList}>
        {recentComplaints.map((complaint) => (
          <TouchableOpacity 
            key={complaint._id} 
            style={styles.recentItem}
            onPress={() => navigation.navigate('ComplaintDetails', { complaintId: complaint._id })}
          >
            <View style={styles.recentItemContent}>
              <Text style={styles.recentTitle} numberOfLines={1}>
                {complaint.title}
              </Text>
              <Text style={styles.recentCategory}>
                {complaint.category}
              </Text>
              <Text style={styles.recentDate}>
                {new Date(complaint.createdAt).toLocaleDateString('he-IL')}
              </Text>
            </View>
            <View style={styles.recentStatus}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: getStatusColor(complaint.status) }
              ]} />
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#FF9800';
      case 'in_progress': return '#2196F3';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>טוען דשבורד...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4f46e5']} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderWelcomeHeader()}
        {renderStatsCards()}
        {renderAIInsights()}
        {renderQuickActions()}
        {/* {renderRecentActivity()} */}
        {renderRecentComplaints()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    shadowOffset: { width: 0, height: 4 },
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
  statsText: {
    color: '#c7d2fe',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -40,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'right',
  },
  statTrend: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
  },
  aiContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertsContainer: {
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 8,
    elevation: 1,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
    flex: 1,
    textAlign: 'right',
  },
  sentimentContainer: {
    marginTop: 10,
  },
  sentimentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sentimentItem: {
    alignItems: 'center',
    marginBottom: 10,
    width: (width - 80) / 4,
  },
  sentimentLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sentimentCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionContent: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activityContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  activityText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'right',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  recentContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
  },
  recentList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentItemContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  recentCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textAlign: 'right',
  },
  recentDate: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  recentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default UnifiedManagerDashboard;