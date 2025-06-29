// // HighRiskComplaintsScreen.js - מסך תלונות בסיכון גבוה
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   FlatList,
//   SafeAreaView,
//   RefreshControl
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// const HighRiskComplaintsScreen = ({ navigation }) => {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [highRiskData, setHighRiskData] = useState(null);

//   useEffect(() => {
//     loadHighRiskComplaints();
//   }, []);

//   const loadHighRiskComplaints = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       if (!token) {
//         Alert.alert('שגיאה', 'לא נמצא טוקן אימות');
//         return;
//       }

//       const response = await fetch('http://192.168.1.4:5000/api/admin/high-risk-complaints', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setHighRiskData(data.data);
//       } else {
//         Alert.alert('שגיאה', data.message || 'שגיאה בטעינת תלונות בסיכון גבוה');
//       }
//     } catch (error) {
//       console.error('Error loading high-risk complaints:', error);
//       Alert.alert('שגיאה', 'שגיאה בחיבור לשרת');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadHighRiskComplaints();
//   };

//   const getRiskLevelColor = (level) => {
//     switch (level) {
//       case 'high': return '#F44336';
//       case 'medium': return '#FF9800';
//       case 'low': return '#4CAF50';
//       default: return '#9E9E9E';
//     }
//   };

//   const getRiskLevelLabel = (level) => {
//     switch (level) {
//       case 'high': return 'רמת סיכון גבוהה';
//       case 'medium': return 'רמת סיכון בינונית';
//       case 'low': return 'רמת סיכון נמוכה';
//       default: return 'לא ידוע';
//     }
//   };

//   const getRiskLevelIcon = (level) => {
//     switch (level) {
//       case 'high': return 'alert-circle';
//       case 'medium': return 'warning';
//       case 'low': return 'checkmark-circle';
//       default: return 'help-circle';
//     }
//   };

//   const renderRiskHeader = () => {
//     if (!highRiskData) return null;

//     const riskLevel = highRiskData.riskLevel;
//     const riskColor = getRiskLevelColor(riskLevel);

//     return (
//       <View style={[styles.riskHeader, { backgroundColor: riskColor }]}>
//         <View style={styles.riskHeaderContent}>
//           <Ionicons 
//             name={getRiskLevelIcon(riskLevel)} 
//             size={32} 
//             color="#fff" 
//           />
//           <View style={styles.riskHeaderText}>
//             <Text style={styles.riskHeaderTitle}>
//               {getRiskLevelLabel(riskLevel)}
//             </Text>
//             <Text style={styles.riskHeaderSubtitle}>
//               נמצאו {highRiskData.highRiskComplaints?.length || 0} תלונות בסיכון
//             </Text>
//             <Text style={styles.riskHeaderSubtitle}>
//               מתוך {highRiskData.totalAnalyzed} שנותחו
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const renderRiskFactorsBadge = (factors) => {
//     if (!factors || factors.length === 0) return null;

//     return (
//       <View style={styles.riskFactorsContainer}>
//         <Text style={styles.riskFactorsTitle}>גורמי סיכון:</Text>
//         <View style={styles.riskFactorsList}>
//           {factors.map((factor, index) => (
//             <View key={index} style={styles.riskFactorBadge}>
//               <Text style={styles.riskFactorText}>{factor}</Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderComplaintCard = ({ item }) => {
//     const analysis = item.aiAnalysis;
//     const riskPercentage = Math.round(analysis.riskScore * 100);
    
//     return (
//       <View style={[styles.complaintCard, { borderLeftColor: getRiskColor(analysis.riskScore) }]}>
//         <View style={styles.cardHeader}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.complaintTitle} numberOfLines={2}>
//               {item.title}
//             </Text>
//             <Text style={styles.complaintCategory}>
//               {item.category}
//             </Text>
//           </View>
          
//           <View style={styles.riskIndicator}>
//             <View style={[styles.riskCircle, { backgroundColor: getRiskColor(analysis.riskScore) }]}>
//               <Text style={styles.riskPercentage}>{riskPercentage}%</Text>
//             </View>
//             <Text style={styles.riskLabel}>סיכון</Text>
//           </View>
//         </View>

//         <View style={styles.cardContent}>
//           <View style={styles.analysisGrid}>
//             <View style={styles.analysisItem}>
//               <Ionicons 
//                 name={getSentimentIcon(analysis.sentiment)} 
//                 size={16} 
//                 color={getSentimentColor(analysis.sentiment)} 
//               />
//               <Text style={styles.analysisLabel}>
//                 {getSentimentLabel(analysis.sentiment)}
//               </Text>
//             </View>
            
//             <View style={styles.analysisItem}>
//               <Ionicons 
//                 name="alert-circle" 
//                 size={16} 
//                 color={getUrgencyColor(analysis.urgency)} 
//               />
//               <Text style={styles.analysisLabel}>
//                 {getUrgencyLabel(analysis.urgency)}
//               </Text>
//             </View>
            
//             <View style={styles.analysisItem}>
//               <Ionicons name="calendar" size={16} color="#666" />
//               <Text style={styles.analysisLabel}>
//                 {analysis.daysOpen} ימים פתוח
//               </Text>
//             </View>
//           </View>

//           {renderRiskFactorsBadge(analysis.riskFactors)}
          
//           <View style={styles.statusContainer}>
//             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//               <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
//             </View>
//             <Text style={styles.dateText}>
//               {new Date(item.createdAt).toLocaleDateString('he-IL')}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.cardActions}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.viewButton]}
//             onPress={() => viewComplaintDetails(item)}
//           >
//             <Ionicons name="eye" size={16} color="#2196F3" />
//             <Text style={styles.actionButtonText}>צפה</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.assignButton]}
//             onPress={() => assignComplaint(item)}
//           >
//             <Ionicons name="person-add" size={16} color="#4CAF50" />
//             <Text style={styles.actionButtonText}>הקצה</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.priorityButton]}
//             onPress={() => markAsPriority(item)}
//           >
//             <Ionicons name="flag" size={16} color="#FF9800" />
//             <Text style={styles.actionButtonText}>עדיפות</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const viewComplaintDetails = (complaint) => {
//     // ניווט לפרטי התלונה
//     navigation.navigate('ComplaintDetails', { complaintId: complaint._id });
//   };

//   const assignComplaint = (complaint) => {
//     Alert.alert(
//       'הקצאת תלונה',
//       `האם ברצונך להקצות את התלונה "${complaint.title}" לטיפול?`,
//       [
//         { text: 'ביטול', style: 'cancel' },
//         { 
//           text: 'הקצה', 
//           onPress: () => handleAssignComplaint(complaint._id) 
//         }
//       ]
//     );
//   };

//   const markAsPriority = (complaint) => {
//     Alert.alert(
//       'סימון כעדיפות',
//       `האם ברצונך לסמן את התלונה "${complaint.title}" כבעלת עדיפות גבוהה?`,
//       [
//         { text: 'ביטול', style: 'cancel' },
//         { 
//           text: 'סמן', 
//           onPress: () => handleMarkAsPriority(complaint._id) 
//         }
//       ]
//     );
//   };

//   const handleAssignComplaint = async (complaintId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await fetch(`http://192.168.1.4:5000/api/complaints/${complaintId}/assign`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           employeeId: 'current-user' // או ID של העובד הנוכחי
//         })
//       });

//       const data = await response.json();
      
//       if (data.status === 'success') {
//         Alert.alert('הצלחה', 'התלונה הוקצתה בהצלחה');
//         loadHighRiskComplaints(); // רענון הנתונים
//       } else {
//         Alert.alert('שגיאה', data.message || 'שגיאה בהקצאת התלונה');
//       }
//     } catch (error) {
//       console.error('Error assigning complaint:', error);
//       Alert.alert('שגיאה', 'שגיאה בחיבור לשרת');
//     }
//   };

//   const handleMarkAsPriority = async (complaintId) => {
//     // כאן תוכל להוסיף לוגיקה לסימון התלונה כבעלת עדיפות
//     Alert.alert('מידע', 'פיצ\'ר זה יוטמע בגרסה הבאה');
//   };

//   const renderQuickActions = () => (
//     <View style={styles.quickActionsContainer}>
//       <Text style={styles.quickActionsTitle}>פעולות מהירות</Text>
//       <View style={styles.quickActionsGrid}>
//         <TouchableOpacity 
//           style={styles.quickActionButton}
//           onPress={() => filterByCritical()}
//         >
//           <Ionicons name="alert-circle" size={24} color="#F44336" />
//           <Text style={styles.quickActionText}>קריטיות בלבד</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.quickActionButton}
//           onPress={() => filterByOldComplaints()}
//         >
//           <Ionicons name="time" size={24} color="#FF9800" />
//           <Text style={styles.quickActionText}>תלונות ישנות</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.quickActionButton}
//           onPress={() => exportReport()}
//         >
//           <Ionicons name="download" size={24} color="#4CAF50" />
//           <Text style={styles.quickActionText}>ייצא דוח</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.quickActionButton}
//           onPress={() => navigation.navigate('TrendsReport')}
//         >
//           <Ionicons name="analytics" size={24} color="#2196F3" />
//           <Text style={styles.quickActionText}>ניתוח מגמות</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const filterByCritical = () => {
//     // סינון רק תלונות קריטיות
//     Alert.alert('מידע', 'מציג רק תלונות קריטיות');
//   };

//   const filterByOldComplaints = () => {
//     // סינון תלונות שפתוחות יותר מ-7 ימים
//     Alert.alert('מידע', 'מציג תלונות פתוחות יותר מ-7 ימים');
//   };

//   const exportReport = () => {
//     Alert.alert('ייצוא דוח', 'הדוח יישלח למייל שלך תוך 5 דקות');
//   };

//   // פונקציות עזר
//   const getRiskColor = (score) => {
//     if (score >= 0.8) return '#F44336';
//     if (score >= 0.6) return '#FF9800';
//     if (score >= 0.4) return '#FFC107';
//     return '#4CAF50';
//   };

//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return '#4CAF50';
//       case 'negative': return '#F44336';
//       case 'urgent': return '#FF9800';
//       default: return '#9E9E9E';
//     }
//   };

//   const getSentimentIcon = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return 'happy';
//       case 'negative': return 'sad';
//       case 'urgent': return 'warning';
//       default: return 'remove';
//     }
//   };

//   const getSentimentLabel = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return 'חיובי';
//       case 'negative': return 'שלילי';
//       case 'urgent': return 'דחוף';
//       default: return 'נייטרלי';
//     }
//   };

//   const getUrgencyColor = (urgency) => {
//     switch (urgency) {
//       case 'critical': return '#F44336';
//       case 'high': return '#FF9800';
//       case 'medium': return '#FFC107';
//       case 'low': return '#4CAF50';
//       default: return '#9E9E9E';
//     }
//   };

//   const getUrgencyLabel = (urgency) => {
//     switch (urgency) {
//       case 'critical': return 'קריטי';
//       case 'high': return 'גבוה';
//       case 'medium': return 'בינוני';
//       case 'low': return 'נמוך';
//       default: return 'לא ידוע';
//     }
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

//   const getStatusLabel = (status) => {
//     switch (status) {
//       case 'open': return 'פתוח';
//       case 'in_progress': return 'בטיפול';
//       case 'resolved': return 'טופל';
//       case 'closed': return 'סגור';
//       default: return 'לא ידוע';
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#F44336" />
//         <Text style={styles.loadingText}>מזהה תלונות בסיכון...</Text>
//         <Text style={styles.loadingSubtext}>מנתח רמות דחיפות וסיכון</Text>
//       </View>
//     );
//   }

//   if (!highRiskData) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="warning" size={48} color="#FF5722" />
//         <Text style={styles.errorText}>שגיאה בטעינת תלונות בסיכון</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={loadHighRiskComplaints}>
//           <Text style={styles.retryButtonText}>נסה שוב</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#F44336" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>תלונות בסיכון גבוה</Text>
//         <TouchableOpacity onPress={onRefresh}>
//           <Ionicons name="refresh" size={24} color="#F44336" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {renderRiskHeader()}
//         {renderQuickActions()}

//         <View style={styles.complaintsContainer}>
//           <Text style={styles.complaintsTitle}>
//             תלונות דורשות תשומת לב מיידית ({highRiskData.highRiskComplaints?.length || 0})
//           </Text>
          
//           {highRiskData.highRiskComplaints && highRiskData.highRiskComplaints.length > 0 ? (
//             <FlatList
//               data={highRiskData.highRiskComplaints}
//               renderItem={renderComplaintCard}
//               keyExtractor={(item) => item._id}
//               showsVerticalScrollIndicator={false}
//               scrollEnabled={false}
//             />
//           ) : (
//             <View style={styles.emptyContainer}>
//               <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
//               <Text style={styles.emptyTitle}>מצוין!</Text>
//               <Text style={styles.emptyText}>אין תלונות בסיכון גבוה כרגע</Text>
//               <Text style={styles.emptySubtext}>כל התלונות מטופלות כראוי</Text>
//             </View>
//           )}
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
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#fff',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
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
//     marginTop: 15,
//     fontSize: 16,
//     color: '#666',
//     fontWeight: 'bold',
//   },
//   loadingSubtext: {
//     marginTop: 5,
//     fontSize: 14,
//     color: '#999',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   errorText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#F44336',
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   riskHeader: {
//     margin: 15,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   riskHeaderContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//   },
//   riskHeaderText: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   riskHeaderTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//   },
//   riskHeaderSubtitle: {
//     fontSize: 14,
//     color: '#fff',
//     opacity: 0.9,
//   },
//   quickActionsContainer: {
//     margin: 15,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   quickActionsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   quickActionsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   quickActionButton: {
//     width: '48%',
//     padding: 15,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },
//   quickActionText: {
//     marginTop: 8,
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   complaintsContainer: {
//     margin: 15,
//   },
//   complaintsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   complaintCard: {
//     backgroundColor: '#fff',
//     marginBottom: 15,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     padding: 15,
//     paddingBottom: 10,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 15,
//   },
//   complaintTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   complaintCategory: {
//     fontSize: 12,
//     color: '#666',
//     backgroundColor: '#f0f0f0',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//     alignSelf: 'flex-start',
//   },
//   riskIndicator: {
//     alignItems: 'center',
//   },
//   riskCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   riskPercentage: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   riskLabel: {
//     fontSize: 10,
//     color: '#666',
//   },
//   cardContent: {
//     paddingHorizontal: 15,
//   },
//   analysisGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   analysisItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   analysisLabel: {
//     marginLeft: 5,
//     fontSize: 11,
//     color: '#666',
//   },
//   riskFactorsContainer: {
//     marginBottom: 10,
//   },
//   riskFactorsTitle: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 5,
//   },
//   riskFactorsList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   riskFactorBadge: {
//     backgroundColor: '#FFEBEE',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//     marginRight: 5,
//     marginBottom: 3,
//   },
//   riskFactorText: {
//     fontSize: 10,
//     color: '#D32F2F',
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#999',
//   },
//   cardActions: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRightWidth: 1,
//     borderRightColor: '#f0f0f0',
//   },
//   actionButtonText: {
//     marginLeft: 5,
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   viewButton: {
//     borderRightWidth: 1,
//   },
//   assignButton: {
//     borderRightWidth: 1,
//   },
//   priorityButton: {
//     borderRightWidth: 0,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginTop: 15,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     marginTop: 5,
//     textAlign: 'center',
//   },
// });

// export default HighRiskComplaintsScreen;

// HighRiskComplaintsScreen.js - גרסה מעודכנת עם Hook
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useRiskComplaints from './hooks/useRiskComplaints';
import ActionButtons from './ActionButtons';

const HighRiskComplaintsScreen = ({ navigation }) => {
  const {
    loading,
    refreshing,
    error,
    filteredData,
    currentFilter,
    exporting,
    statistics,
    refresh,
    filterCritical,
    filterOld,
    clearFilters,
    exportReport,
    assignComplaint,
    updateComplaintStatus,
    getStatusLabel,
    getUrgencyLabel
  } = useRiskComplaints();

  // מימוש הפעולות המהירות
  const handleFilterCritical = () => {
    const count = filterCritical();
    Alert.alert(
      'סינון קריטי', 
      `נמצאו ${count} תלונות קריטיות`,
      [{ text: 'אישור', style: 'default' }]
    );
  };

  const handleFilterOld = () => {
    const count = filterOld();
    Alert.alert(
      'תלונות ישנות', 
      `נמצאו ${count} תלונות פתוחות יותר מ-7 ימים`,
      [{ text: 'אישור', style: 'default' }]
    );
  };

  const handleClearFilters = () => {
    clearFilters();
    Alert.alert('סינון', 'הסינון בוטל - מציג את כל התלונות');
  };

  const handleExportReport = async () => {
    Alert.alert(
      'ייצוא דוח',
      'איך תרצה לייצא את הדוח?',
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'טקסט', 
          onPress: () => exportReport('text') 
        },
        { 
          text: 'Excel (CSV)', 
          onPress: () => exportReport('csv') 
        }
      ]
    );
  };

  const handleViewTrends = () => {
    navigation.navigate('TrendsReportScreen');
  };

  // מימוש פעולות על תלונות בודדות
  const viewComplaintDetails = (complaint) => {
    navigation.navigate('ComplaintDetails', { complaintId: complaint._id });
  };

  const handleAssignComplaint = (complaint) => {
    Alert.alert(
      'הקצאת תלונה',
      `האם ברצונך להקצות את התלונה "${complaint.title}" לטיפול?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'הקצה', 
          onPress: () => assignComplaint(complaint._id) 
        }
      ]
    );
  };

  const handleMarkAsPriority = (complaint) => {
    Alert.alert(
      'סימון כעדיפות',
      `בחר פעולה עבור התלונה "${complaint.title}":`,
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'העבר לטיפול', 
          onPress: () => updateComplaintStatus(complaint._id, 'in_progress') 
        },
        { 
          text: 'סמן כטופל', 
          onPress: () => updateComplaintStatus(complaint._id, 'resolved') 
        }
      ]
    );
  };

  // רכיבי UI
  const renderRiskHeader = () => {
    if (!filteredData || !statistics) return null;

    const riskLevel = filteredData.riskLevel || 'medium';
    const riskColor = getRiskLevelColor(riskLevel);

    return (
      <View style={[styles.riskHeader, { backgroundColor: riskColor }]}>
        <View style={styles.riskHeaderContent}>
          <Ionicons 
            name={getRiskLevelIcon(riskLevel)} 
            size={32} 
            color="#fff" 
          />
          <View style={styles.riskHeaderText}>
            <Text style={styles.riskHeaderTitle}>
              {getRiskLevelLabel(riskLevel)}
            </Text>
            <Text style={styles.riskHeaderSubtitle}>
              נמצאו {statistics.total} תלונות בסיכון
            </Text>
            <Text style={styles.riskHeaderSubtitle}>
              מתוכן {statistics.critical} קריטיות
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStatisticsCards = () => {
    if (!statistics) return null;

    const cards = [
      {
        title: 'קריטיות',
        value: statistics.critical,
        color: '#F44336',
        icon: 'alert-circle'
      },
      {
        title: 'סיכון גבוה',
        value: statistics.highRisk,
        color: '#FF9800',
        icon: 'warning'
      },
      {
        title: 'ישנות (+7 ימים)',
        value: statistics.old,
        color: '#FF5722',
        icon: 'time'
      },
      {
        title: 'ממוצע ימים פתוח',
        value: Math.round(statistics.avgDaysOpen),
        color: '#2196F3',
        icon: 'calendar'
      }
    ];

    return (
      <View style={styles.statisticsContainer}>
        <Text style={styles.sectionTitle}>סטטיסטיקות</Text>
        <View style={styles.statisticsGrid}>
          {cards.map((card, index) => (
            <View key={index} style={[styles.statCard, { borderTopColor: card.color }]}>
              <Ionicons name={card.icon} size={24} color={card.color} />
              <Text style={[styles.statValue, { color: card.color }]}>
                {card.value}
              </Text>
              <Text style={styles.statTitle}>{card.title}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFilterStatus = () => {
    if (currentFilter === 'all') return null;
    
    const filterLabels = {
      critical: 'מציג תלונות קריטיות בלבד',
      old: 'מציג תלונות ישנות בלבד',
      negative: 'מציג תלונות עם סנטימנט שלילי'
    };
    
    return (
      <View style={styles.filterStatusContainer}>
        <Ionicons name="filter" size={16} color="#2196F3" />
        <Text style={styles.filterStatusText}>{filterLabels[currentFilter]}</Text>
      </View>
    );
  };

  const renderComplaintCard = ({ item }) => {
    const analysis = item.aiAnalysis;
    const riskPercentage = Math.round(analysis.riskScore * 100);
    
    return (
      <View style={[styles.complaintCard, { borderLeftColor: getRiskColor(analysis.riskScore) }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.complaintTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.complaintCategory}>
              {item.category}
            </Text>
          </View>
          
          <View style={styles.riskIndicator}>
            <View style={[styles.riskCircle, { backgroundColor: getRiskColor(analysis.riskScore) }]}>
              <Text style={styles.riskPercentage}>{riskPercentage}%</Text>
            </View>
            <Text style={styles.riskLabel}>סיכון</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Ionicons 
                name={getSentimentIcon(analysis.sentiment)} 
                size={16} 
                color={getSentimentColor(analysis.sentiment)} 
              />
              <Text style={styles.analysisLabel}>
                {getSentimentLabel(analysis.sentiment)}
              </Text>
            </View>
            
            <View style={styles.analysisItem}>
              <Ionicons 
                name="alert-circle" 
                size={16} 
                color={getUrgencyColor(analysis.urgency)} 
              />
              <Text style={styles.analysisLabel}>
                {getUrgencyLabel(analysis.urgency)}
              </Text>
            </View>
            
            <View style={styles.analysisItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.analysisLabel}>
                {analysis.daysOpen} ימים פתוח
              </Text>
            </View>
          </View>

          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <View style={styles.riskFactorsContainer}>
              <Text style={styles.riskFactorsTitle}>גורמי סיכון:</Text>
              <View style={styles.riskFactorsList}>
                {analysis.riskFactors.map((factor, index) => (
                  <View key={index} style={styles.riskFactorBadge}>
                    <Text style={styles.riskFactorText}>{factor}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString('he-IL')}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => viewComplaintDetails(item)}
          >
            <Ionicons name="eye" size={16} color="#2196F3" />
            <Text style={styles.actionButtonText}>צפה</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.assignButton]}
            onPress={() => handleAssignComplaint(item)}
          >
            <Ionicons name="person-add" size={16} color="#4CAF50" />
            <Text style={styles.actionButtonText}>הקצה</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.priorityButton]}
            onPress={() => handleMarkAsPriority(item)}
          >
            <Ionicons name="flag" size={16} color="#FF9800" />
            <Text style={styles.actionButtonText}>עדיפות</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderExportModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={exporting}
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.modalText}>מייצא דוח...</Text>
          <Text style={styles.modalSubText}>אנא המתן</Text>
        </View>
      </View>
    </Modal>
  );

  // פונקציות עזר
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getRiskLevelLabel = (level) => {
    switch (level) {
      case 'high': return 'רמת סיכון גבוהה';
      case 'medium': return 'רמת סיכון בינונית';
      case 'low': return 'רמת סיכון נמוכה';
      default: return 'לא ידוע';
    }
  };

  const getRiskLevelIcon = (level) => {
    switch (level) {
      case 'high': return 'alert-circle';
      case 'medium': return 'warning';
      case 'low': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#FF9800';
      case 'in_progress': return '#2196F3';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return '#666';
    }
  };

  // מסכי טעינה ושגיאות
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        <Text style={styles.loadingText}>מזהה תלונות בסיכון...</Text>
        <Text style={styles.loadingSubtext}>מנתח רמות דחיפות וסיכון</Text>
      </View>
    );
  }

  if (error || !filteredData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#FF5722" />
        <Text style={styles.errorText}>
          {error || 'שגיאה בטעינת תלונות בסיכון'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#F44336" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>תלונות בסיכון גבוה</Text>
        <TouchableOpacity onPress={refresh}>
          <Ionicons name="refresh" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {renderRiskHeader()}
        {renderStatisticsCards()}
        {renderFilterStatus()}
        
        <ActionButtons
          onFilterCritical={handleFilterCritical}
          onFilterOld={handleFilterOld}
          onExportReport={handleExportReport}
          onViewTrends={handleViewTrends}
          onClearFilters={handleClearFilters}
          currentFilter={currentFilter}
          complaintsCount={statistics?.total || 0}
        />

        <View style={styles.complaintsContainer}>
          <Text style={styles.complaintsTitle}>
            תלונות דורשות תשומת לב מיידית ({filteredData.highRiskComplaints?.length || 0})
          </Text>
          
          {filteredData.highRiskComplaints && filteredData.highRiskComplaints.length > 0 ? (
            <FlatList
              data={filteredData.highRiskComplaints}
              renderItem={renderComplaintCard}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.emptyTitle}>מצוין!</Text>
              <Text style={styles.emptyText}>
                {currentFilter === 'all' ? 
                  'אין תלונות בסיכון גבוה כרגע' : 
                  'אין תלונות התואמות לסינון הנוכחי'
                }
              </Text>
              <Text style={styles.emptySubtext}>
                {currentFilter === 'all' ? 
                  'כל התלונות מטופלות כראוי' : 
                  'נסה להחליף את הסינון'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {renderExportModal()}
    </SafeAreaView>
  );
};

// הסטיילים נשארים כמו קודם...
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
    backgroundColor: '#F44336',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  filterStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  filterStatusText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  riskHeader: {
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  riskHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  riskHeaderText: {
    marginLeft: 15,
    flex: 1,
  },
  riskHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  riskHeaderSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statisticsContainer: {
    margin: 15,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
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
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  complaintsContainer: {
    margin: 15,
  },
  complaintsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  complaintCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    paddingBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  complaintCategory: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  riskIndicator: {
    alignItems: 'center',
  },
  riskCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  riskPercentage: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  riskLabel: {
    fontSize: 10,
    color: '#666',
  },
  cardContent: {
    paddingHorizontal: 15,
  },
  analysisGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  analysisLabel: {
    marginLeft: 5,
    fontSize: 11,
    color: '#666',
  },
  riskFactorsContainer: {
    marginBottom: 10,
  },
  riskFactorsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  riskFactorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  riskFactorBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 3,
  },
  riskFactorText: {
    fontSize: 10,
    color: '#D32F2F',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    borderRightWidth: 1,
  },
  assignButton: {
    borderRightWidth: 1,
  },
  priorityButton: {
    borderRightWidth: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
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
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default HighRiskComplaintsScreen;