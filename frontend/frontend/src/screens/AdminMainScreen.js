// // AdminMainScreen.js - מסך ראשי למנהל העירייה
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   SafeAreaView
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const AdminMainScreen = ({ navigation }) => {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [recentComplaints, setRecentComplaints] = useState([]);
//   const [adminName, setAdminName] = useState('מנהל');

//   useEffect(() => {
//     loadDashboardData();
//     getAdminInfo();
//   }, []);

//   const getAdminInfo = async () => {
//     try {
//       const name = await AsyncStorage.getItem('userName');
//       if (name) {
//         setAdminName(name);
//       }
//     } catch (error) {
//       console.log('Error getting admin info:', error);
//     }
//   };

// // תיקון AdminMainScreen.js - החלף את הפונקציה loadDashboardData

// const loadDashboardData = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
    
//     if (!token) {
//       Alert.alert('שגיאה', 'לא נמצא טוקן אימות');
//       return;
//     }

//     console.log('🔄 Starting to load dashboard data...');
//     console.log('📱 Token found:', token ? 'Yes' : 'No');

//     // **תקן את הכתובת - הוסף :5000**
//     const BASE_URL = 'http://192.168.1.4:5000'; // ✅ הוסף Port!
    
//     console.log('🌐 Connecting to:', BASE_URL);

//     // בקשה יחידה לתלונות
//     const response = await fetch(`${BASE_URL}/api/viewcomplaints`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('📡 Response status:', response.status);

//     if (!response.ok) {
//       throw new Error(`Server responded with status ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('📊 Data received:', {
//       status: data.status,
//       complaintsCount: data.data?.length || 0
//     });

//     if (data.status === 'success') {
//       // חישוב סטטיסטיקות
//       const complaints = data.data;
//       const stats = calculateStats(complaints);
//       setDashboardStats(stats);
      
//       // 5 תלונות אחרונות
//       const recent = complaints
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5);
//       setRecentComplaints(recent);
      
//       console.log('✅ Dashboard data loaded successfully!');
//     } else {
//       throw new Error('Invalid response format');
//     }
//   } catch (error) {
//     console.error('❌ Error loading dashboard data:', error);
//     Alert.alert('שגיאה', `שגיאה בטעינת נתוני דשבורד: ${error.message}`);
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
// };

// // **אלטרנטיבה: נסה ללא אימות אם זה לא עובד**
// const loadDashboardDataNoAuth = async () => {
//   try {
//     console.log('🔄 Trying without authentication...');
    
//     const BASE_URL = 'http://192.168.1.4:5000';
    
//     const response = await fetch(`${BASE_URL}/api/viewcomplaints-no-auth`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('📡 Response status (no auth):', response.status);

//     if (!response.ok) {
//       throw new Error(`Server responded with status ${response.status}`);
//     }

//     const data = await response.json();
    
//     if (data.status === 'success') {
//       const complaints = data.data;
//       const stats = calculateStats(complaints);
//       setDashboardStats(stats);
      
//       const recent = complaints
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5);
//       setRecentComplaints(recent);
      
//       console.log('✅ Dashboard data loaded (no auth)!');
//     }
//   } catch (error) {
//     console.error('❌ Error loading dashboard data (no auth):', error);
//     Alert.alert('שגיאה', error.message);
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
// };

//   const calculateStats = (complaints) => {
//     const total = complaints.length;
//     const open = complaints.filter(c => c.status === 'open').length;
//     const inProgress = complaints.filter(c => c.status === 'in_progress').length;
//     const resolved = complaints.filter(c => c.status === 'resolved').length;
//     const closed = complaints.filter(c => c.status === 'closed').length;

//     // סטטיסטיקות לפי קטגוריה
//     const categories = {};
//     complaints.forEach(c => {
//       categories[c.category] = (categories[c.category] || 0) + 1;
//     });

//     // תלונות השבוע
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     const thisWeek = complaints.filter(c => new Date(c.createdAt) >= weekAgo).length;

//     // תלונות עם משוב
//     const withFeedback = complaints.filter(c => c.feedback && c.feedback.rating).length;
//     const avgRating = withFeedback > 0 ? 
//       complaints
//         .filter(c => c.feedback && c.feedback.rating)
//         .reduce((sum, c) => sum + c.feedback.rating, 0) / withFeedback 
//       : 0;

//     return {
//       total,
//       open,
//       inProgress,
//       resolved,
//       closed,
//       categories,
//       thisWeek,
//       withFeedback,
//       avgRating,
//       resolutionRate: total > 0 ? ((resolved + closed) / total * 100).toFixed(1) : 0
//     };
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     loadDashboardData();
//   }, []);

//   const renderWelcomeHeader = () => {
//     const currentHour = new Date().getHours();
//     let greeting = 'בוקר טוב';
//     if (currentHour >= 12 && currentHour < 17) {
//       greeting = 'צהריים טובים';
//     } else if (currentHour >= 17) {
//       greeting = 'ערב טוב';
//     }

//     return (
//       <View style={styles.welcomeContainer}>
//         <View style={styles.welcomeText}>
//           <Text style={styles.greetingText}>{greeting}, {adminName}</Text>
//           <Text style={styles.welcomeSubtext}>
//             {dashboardStats ? 
//               `יש לך ${dashboardStats.open + dashboardStats.inProgress} תלונות פעילות` :
//               'טוען נתונים...'
//             }
//           </Text>
//         </View>
//         <TouchableOpacity 
//           style={styles.profileButton}
//           onPress={() => navigation.navigate('Settings')}
//         >
//           <Ionicons name="person-circle" size={40} color="#2196F3" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderStatsCards = () => {
//     if (!dashboardStats) return null;

//     const statsCards = [
//       {
//         title: 'סה״כ תלונות',
//         value: dashboardStats.total,
//         icon: 'document-text',
//         color: '#2196F3',
//         trend: `+${dashboardStats.thisWeek} השבוע`
//       },
//       {
//         title: 'ממתינות לטיפול',
//         value: dashboardStats.open,
//         icon: 'time',
//         color: '#FF9800',
//         trend: dashboardStats.open > 10 ? 'דורש תשומת לב' : 'תחת שליטה'
//       },
//       {
//         title: 'בטיפול',
//         value: dashboardStats.inProgress,
//         icon: 'construct',
//         color: '#2196F3',
//         trend: 'פעיל'
//       },
//       {
//         title: 'שיעור פתרון',
//         value: `${dashboardStats.resolutionRate}%`,
//         icon: 'checkmark-circle',
//         color: '#4CAF50',
//         trend: dashboardStats.resolutionRate > 70 ? 'מצוין' : 'ניתן לשפר'
//       }
//     ];

//     return (
//       <View style={styles.statsContainer}>
//         <Text style={styles.sectionTitle}>מבט כללי</Text>
//         <View style={styles.statsGrid}>
//           {statsCards.map((card, index) => (
//             <View key={index} style={[styles.statCard, { borderTopColor: card.color }]}>
//               <View style={styles.statHeader}>
//                 <Ionicons name={card.icon} size={24} color={card.color} />
//                 <Text style={styles.statValue}>{card.value}</Text>
//               </View>
//               <Text style={styles.statTitle}>{card.title}</Text>
//               <Text style={[styles.statTrend, { color: card.color }]}>
//                 {card.trend}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderQuickActions = () => (
//     <View style={styles.quickActionsContainer}>
//       <Text style={styles.sectionTitle}>פעולות מהירות</Text>
//       <View style={styles.quickActionsGrid}>
//         <TouchableOpacity 
//           style={styles.quickActionCard}
//           onPress={() => navigation.navigate('AdminAIDashboard')}
//         >
//           <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
//             <Ionicons name="analytics" size={28} color="#2196F3" />
//           </View>
//           <Text style={styles.quickActionTitle}>ניתוח AI</Text>
//           <Text style={styles.quickActionSubtitle}>דשבורד חכם</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.quickActionCard}
//         //   onPress={() => navigation.navigate('AIDashboard', { screen: 'HighRiskComplaints' })}
//                     onPress={() => navigation.navigate('HighRiskComplaintsScreen')}

//         >
//           <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
//             <Ionicons name="warning" size={28} color="#F44336" />
//           </View>
//           <Text style={styles.quickActionTitle}>תלונות בסיכון</Text>
//           <Text style={styles.quickActionSubtitle}>טיפול דחוף</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.quickActionCard}
//         //   onPress={() => navigation.navigate('AIDashboard', { screen: 'TrendsReport' })}
//                   onPress={() => navigation.navigate('TrendsReportScreen')}

//         >
//           <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
//             <Ionicons name="trending-up" size={28} color="#4CAF50" />
//           </View>
//           <Text style={styles.quickActionTitle}>דוח מגמות</Text>
//           <Text style={styles.quickActionSubtitle}>ניתוח עמוק</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.quickActionCard}
//           onPress={() => loadDashboardData()}
//         >
//           <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
//             <Ionicons name="refresh" size={28} color="#9C27B0" />
//           </View>
//           <Text style={styles.quickActionTitle}>רענן נתונים</Text>
//           <Text style={styles.quickActionSubtitle}>עדכון אחרון</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderCategoryChart = () => {
//     if (!dashboardStats?.categories) return null;

//     const categories = Object.entries(dashboardStats.categories)
//       .sort(([,a], [,b]) => b - a)
//       .slice(0, 5);

//     return (
//       <View style={styles.chartContainer}>
//         <Text style={styles.sectionTitle}>קטגוריות מובילות</Text>
//         <View style={styles.categoryList}>
//           {categories.map(([category, count], index) => {
//             const percentage = (count / dashboardStats.total * 100).toFixed(1);
//             const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
//             const color = colors[index % colors.length];
            
//             return (
//               <View key={category} style={styles.categoryItem}>
//                 <View style={styles.categoryInfo}>
//                   <View style={[styles.categoryDot, { backgroundColor: color }]} />
//                   <Text style={styles.categoryName}>{category}</Text>
//                 </View>
//                 <View style={styles.categoryStats}>
//                   <Text style={styles.categoryCount}>{count}</Text>
//                   <Text style={styles.categoryPercentage}>{percentage}%</Text>
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </View>
//     );
//   };

//   const renderRecentComplaints = () => (
//     <View style={styles.recentContainer}>
//       <View style={styles.recentHeader}>
//         <Text style={styles.sectionTitle}>תלונות אחרונות</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('AllComplaints')}>
//           <Text style={styles.viewAllText}>צפה בהכל</Text>
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.recentList}>
//         {recentComplaints.map((complaint, index) => (
//           <TouchableOpacity 
//             key={complaint._id} 
//             style={styles.recentItem}
//             onPress={() => navigation.navigate('ComplaintDetails', { complaintId: complaint._id })}
//           >
//             <View style={styles.recentItemContent}>
//               <Text style={styles.recentTitle} numberOfLines={1}>
//                 {complaint.title}
//               </Text>
//               <Text style={styles.recentCategory}>
//                 {complaint.category}
//               </Text>
//               <Text style={styles.recentDate}>
//                 {new Date(complaint.createdAt).toLocaleDateString('he-IL')}
//               </Text>
//             </View>
//             <View style={styles.recentStatus}>
//               <View style={[
//                 styles.statusDot, 
//                 { backgroundColor: getStatusColor(complaint.status) }
//               ]} />
//               <Ionicons name="chevron-forward" size={16} color="#ccc" />
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );

//   const renderAIInsight = () => {
//     if (!dashboardStats) return null;

//     const insights = [];
    
//     if (dashboardStats.open > dashboardStats.total * 0.3) {
//       insights.push({
//         type: 'warning',
//         title: 'תשומת לב נדרשת',
//         message: 'יותר מ-30% מהתלונות עדיין פתוחות',
//         action: 'צפה בתלונות בסיכון',
//         actionRoute: 'HighRiskComplaints'
//       });
//     }

//     if (dashboardStats.avgRating > 0 && dashboardStats.avgRating < 3) {
//       insights.push({
//         type: 'error',
//         title: 'דירוג נמוך',
//         message: `דירוג ממוצע: ${dashboardStats.avgRating.toFixed(1)} כוכבים`,
//         action: 'בחן דוח מגמות',
//         actionRoute: 'TrendsReport'
//       });
//     }

//     if (insights.length === 0) {
//       insights.push({
//         type: 'success',
//         title: 'מצב טוב',
//         message: 'הטיפול בתלונות מתבצע ביעילות',
//         action: 'צפה בניתוח AI',
//         actionRoute: 'AIAnalysisScreen'
//       });
//     }

//     const insight = insights[0];
//     const iconName = insight.type === 'warning' ? 'alert-circle' : 
//                      insight.type === 'error' ? 'close-circle' : 'checkmark-circle';
//     const iconColor = insight.type === 'warning' ? '#FF9800' : 
//                       insight.type === 'error' ? '#F44336' : '#4CAF50';

//     return (
//       <View style={styles.insightContainer}>
//         <View style={styles.insightHeader}>
//           <Ionicons name="bulb" size={20} color="#FFC107" />
//           <Text style={styles.sectionTitle}>תובנה AI</Text>
//         </View>
        
//         <View style={[styles.insightCard, { borderLeftColor: iconColor }]}>
//           <View style={styles.insightContent}>
//             <View style={styles.insightIconContainer}>
//               <Ionicons name={iconName} size={24} color={iconColor} />
//             </View>
//             <View style={styles.insightText}>
//               <Text style={styles.insightTitle}>{insight.title}</Text>
//               <Text style={styles.insightMessage}>{insight.message}</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity 
//             style={[styles.insightAction, { backgroundColor: iconColor }]}
//             onPress={() => navigation.navigate('AIDashboard', { screen: insight.actionRoute })}
//           >
//             <Text style={styles.insightActionText}>{insight.action}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'open': return '#FF9800';
//       case 'in_progress': return '#2196F3';
//       case 'resolved': return '#4CAF50';
//       case 'closed': return '#9E9E9E';
//       default: return '#666';
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2196F3" />
//         <Text style={styles.loadingText}>טוען דשבורד...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {renderWelcomeHeader()}
//         {renderStatsCards()}
//         {renderAIInsight()}
//         {renderQuickActions()}
//         {renderCategoryChart()}
//         {renderRecentComplaints()}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   welcomeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom: 15,
//   },
//   welcomeText: {
//     flex: 1,
//   },
//   greetingText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   welcomeSubtext: {
//     fontSize: 14,
//     color: '#666',
//   },
//   profileButton: {
//     padding: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   statsContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: (width - 50) / 2,
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     borderTopWidth: 3,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   statHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   statTitle: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 5,
//   },
//   statTrend: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   quickActionsContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   quickActionsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   quickActionCard: {
//     width: (width - 50) / 2,
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   quickActionIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   quickActionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   quickActionSubtitle: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   chartContainer: {
//     backgroundColor: '#fff',
//     margin: 20,
//     padding: 20,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   categoryList: {
//     gap: 12,
//   },
//   categoryItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   categoryInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   categoryDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   categoryName: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryStats: {
//     alignItems: 'flex-end',
//   },
//   categoryCount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   categoryPercentage: {
//     fontSize: 12,
//     color: '#666',
//   },
//   recentContainer: {
//     backgroundColor: '#fff',
//     margin: 20,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   recentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     paddingBottom: 10,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: '#2196F3',
//     fontWeight: '500',
//   },
//   recentList: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   recentItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   recentItemContent: {
//     flex: 1,
//   },
//   recentTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 4,
//   },
//   recentCategory: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 2,
//   },
//   recentDate: {
//     fontSize: 11,
//     color: '#999',
//   },
//   recentStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   insightContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   insightHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   insightCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   insightContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   insightIconContainer: {
//     marginRight: 15,
//   },
//   insightText: {
//     flex: 1,
//   },
//   insightTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   insightMessage: {
//     fontSize: 14,
//     color: '#666',
//   },
//   insightAction: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//   },
//   insightActionText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });

// export default AdminMainScreen;

// AdminMainScreen.js - תיקון ניווט AI
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

const AdminMainScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [adminName, setAdminName] = useState('מנהל');

  useEffect(() => {
    loadDashboardData();
    getAdminInfo();
  }, []);

  const getAdminInfo = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setAdminName(name);
      }
    } catch (error) {
      console.log('Error getting admin info:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('שגיאה', 'לא נמצא טוקן אימות');
        return;
      }

      console.log('🔄 Starting to load dashboard data...');
      console.log('📱 Token found:', token ? 'Yes' : 'No');

      const BASE_URL = 'http:/192.168.1.3:5000';
      
      console.log('🌐 Connecting to:', BASE_URL);

      const response = await fetch(`${BASE_URL}/api/viewcomplaints`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Data received:', {
        status: data.status,
        complaintsCount: data.data?.length || 0
      });

      if (data.status === 'success') {
        const complaints = data.data;
        const stats = calculateStats(complaints);
        setDashboardStats(stats);
        
        const recent = complaints
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentComplaints(recent);
        
        console.log('✅ Dashboard data loaded successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      Alert.alert('שגיאה', `שגיאה בטעינת נתוני דשבורד: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const renderWelcomeHeader = () => {
    const currentHour = new Date().getHours();
    let greeting = 'בוקר טוב';
    if (currentHour >= 12 && currentHour < 17) {
      greeting = 'צהריים טובים';
    } else if (currentHour >= 17) {
      greeting = 'ערב טוב';
    }

    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeText}>
          <Text style={styles.greetingText}>{greeting}, {adminName}</Text>
          <Text style={styles.welcomeSubtext}>
            {dashboardStats ? 
              `יש לך ${dashboardStats.open + dashboardStats.inProgress} תלונות פעילות` :
              'טוען נתונים...'
            }
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="person-circle" size={40} color="#2196F3" />
        </TouchableOpacity>
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

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>פעולות מהירות</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('AdminAIDashboard')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="analytics" size={28} color="#2196F3" />
          </View>
          <Text style={styles.quickActionTitle}>ניתוח AI</Text>
          <Text style={styles.quickActionSubtitle}>דשבורד חכם</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('HighRiskComplaintsScreen')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="warning" size={28} color="#F44336" />
          </View>
          <Text style={styles.quickActionTitle}>תלונות בסיכון</Text>
          <Text style={styles.quickActionSubtitle}>טיפול דחוף</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('TrendsReportScreen')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="trending-up" size={28} color="#4CAF50" />
          </View>
          <Text style={styles.quickActionTitle}>דוח מגמות</Text>
          <Text style={styles.quickActionSubtitle}>ניתוח עמוק</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => loadDashboardData()}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="refresh" size={28} color="#9C27B0" />
          </View>
          <Text style={styles.quickActionTitle}>רענן נתונים</Text>
          <Text style={styles.quickActionSubtitle}>עדכון אחרון</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryChart = () => {
    if (!dashboardStats?.categories) return null;

    const categories = Object.entries(dashboardStats.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>קטגוריות מובילות</Text>
        <View style={styles.categoryList}>
          {categories.map(([category, count], index) => {
            const percentage = (count / dashboardStats.total * 100).toFixed(1);
            const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
            const color = colors[index % colors.length];
            
            return (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: color }]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryCount}>{count}</Text>
                  <Text style={styles.categoryPercentage}>{percentage}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderRecentComplaints = () => (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>תלונות אחרונות</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllComplaints')}>
          <Text style={styles.viewAllText}>צפה בהכל</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.recentList}>
        {recentComplaints.map((complaint, index) => (
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

  const renderAIInsight = () => {
    if (!dashboardStats) return null;

    const insights = [];
    
    if (dashboardStats.open > dashboardStats.total * 0.3) {
      insights.push({
        type: 'warning',
        title: 'תשומת לב נדרשת',
        message: 'יותר מ-30% מהתלונות עדיין פתוחות',
        action: 'צפה בתלונות בסיכון',
        actionRoute: 'HighRiskComplaintsScreen'
      });
    }

    if (dashboardStats.avgRating > 0 && dashboardStats.avgRating < 3) {
      insights.push({
        type: 'error',
        title: 'דירוג נמוך',
        message: `דירוג ממוצע: ${dashboardStats.avgRating.toFixed(1)} כוכבים`,
        action: 'בחן דוח מגמות',
        actionRoute: 'TrendsReportScreen'
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'success',
        title: 'מצב טוב',
        message: 'הטיפול בתלונות מתבצע ביעילות',
        action: 'צפה בניתוח AI',
        actionRoute: 'AIAnalysisScreen'
      });
    }

    const insight = insights[0];
    const iconName = insight.type === 'warning' ? 'alert-circle' : 
                     insight.type === 'error' ? 'close-circle' : 'checkmark-circle';
    const iconColor = insight.type === 'warning' ? '#FF9800' : 
                      insight.type === 'error' ? '#F44336' : '#4CAF50';

    return (
      <View style={styles.insightContainer}>
        <View style={styles.insightHeader}>
          <Ionicons name="bulb" size={20} color="#FFC107" />
          <Text style={styles.sectionTitle}>תובנה AI</Text>
        </View>
        
        <View style={[styles.insightCard, { borderLeftColor: iconColor }]}>
          <View style={styles.insightContent}>
            <View style={styles.insightIconContainer}>
              <Ionicons name={iconName} size={24} color={iconColor} />
            </View>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightMessage}>{insight.message}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.insightAction, { backgroundColor: iconColor }]}
            onPress={() => navigation.navigate(insight.actionRoute)}
          >
            <Text style={styles.insightActionText}>{insight.action}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>טוען דשבורד...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderWelcomeHeader()}
        {renderStatsCards()}
        {renderAIInsight()}
        {renderQuickActions()}
        {renderCategoryChart()}
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
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  welcomeText: {
    flex: 1,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    paddingHorizontal: 20,
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
  },
  statTrend: {
    fontSize: 10,
    fontWeight: '500',
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
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
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
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
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
    color: '#2196F3',
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
  },
  recentCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 11,
    color: '#999',
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
  insightContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  insightIconContainer: {
    marginRight: 15,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  insightMessage: {
    fontSize: 14,
    color: '#666',
  },
  insightAction: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AdminMainScreen;