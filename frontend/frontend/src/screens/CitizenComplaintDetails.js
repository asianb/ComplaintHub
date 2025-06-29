// //CitizenComplaintDetails.js
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
//   Linking,
//   Platform,
//   Modal,
//   TextInput
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const STATUS_COLORS = {
//   open: '#92400e',
//   in_progress: '#1e40af',
//   resolved: '#166534',
//   closed: '#374151'
// };

// const STATUS_ICONS = {
//   open: 'time',
//   in_progress: 'reload',
//   resolved: 'checkmark-circle',
//   closed: 'checkmark-done-circle'
// };

// const STATUS_LABELS = {
//   open: 'ממתין לטיפול',
//   in_progress: 'בטיפול',
//   resolved: 'טופל',
//   closed: 'סגור'
// };

// const CitizenComplaintDetails = ({ route, navigation }) => {
//   const { complaintId } = route.params;
//   const [complaint, setComplaint] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userToken, setUserToken] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
//   // משתני מצב לחוות דעת
//   const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
//   const [feedbackRating, setFeedbackRating] = useState(0);
//   const [feedbackComment, setFeedbackComment] = useState('');
//   const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const [[, storedUserId], [, storedUserToken]] = await AsyncStorage.multiGet([
//           'userId', 
//           'userToken'
//         ]);
        
//         if (!storedUserToken || !storedUserId) {
//           navigation.replace('Login');
//           return;
//         }
        
//         setUserId(storedUserId);
//         setUserToken(storedUserToken);
//         fetchComplaintDetails(storedUserToken);
//       } catch (error) {
//         console.error('Error loading user data:', error);
//         setError('שגיאה בטעינת נתוני משתמש');
//         setLoading(false);
//       }
//     };
    
//     loadUserData();
//   }, [complaintId, navigation]);

//   const fetchComplaintDetails = async (token) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://192.168.1.3:5000/api/complaints/${complaintId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       if (response.data.status === 'success') {
//         setComplaint(response.data.data);
//       } else {
//         setError('שגיאה בטעינת פרטי התלונה');
//       }
//     } catch (error) {
//       console.error('Error fetching complaint details:', error);
      
//       if (error.response?.status === 401) {
//         await AsyncStorage.multiRemove(['userToken', 'userId']);
//         navigation.replace('Login');
//       } else if (error.response?.status === 403) {
//         setError('אין לך הרשאה לצפות בתלונה זו');
//       } else if (error.response?.status === 404) {
//         setError('התלונה לא נמצאה');
//       } else {
//         setError('שגיאה בטעינת פרטי התלונה');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // פונקציה לשליחת חוות דעת
//   const submitFeedback = async () => {
//     if (feedbackRating === 0) {
//       Alert.alert('שגיאה', 'אנא בחר דירוג כוכבים');
//       return;
//     }

//     setIsSubmittingFeedback(true);
//     try {
//       const response = await axios.post(
//         `http://192.168.1.3:5000/api/complaints/${complaintId}/feedback`,
//         {
//           rating: feedbackRating,
//           comment: feedbackComment
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${userToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.status === 'success') {
//         // עדכון נתוני התלונה עם חוות הדעת החדשה
//         setComplaint(response.data.data);
//         Alert.alert('תודה', 'חוות הדעת שלך התקבלה בהצלחה');
//         // איפוס ערכי חוות הדעת וסגירת המודאל
//         setFeedbackModalVisible(false);
//         setFeedbackComment('');
//         setFeedbackRating(0);
//       }
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       Alert.alert('שגיאה', 'אירעה שגיאה בשליחת חוות הדעת');
//     } finally {
//       setIsSubmittingFeedback(false);
//     }
//   };

//   // פונקציות עזר לחוות דעת
//   const canLeaveFeedback = () => {
//     if (!complaint) return false;
//     return (
//       (complaint.status === 'resolved' || complaint.status === 'closed') && 
//       !complaint.feedback
//     );
//   };

//   const hasFeedback = () => {
//     return complaint && complaint.feedback;
//   };

//   // קומפוננטת דירוג כוכבים
//   const StarRating = ({ rating, setRating, disabled = false }) => {
//     return (
//       <View style={styles.starsContainer}>
//         {[1, 2, 3, 4, 5].map((star) => (
//           <TouchableOpacity 
//             key={star} 
//             onPress={() => !disabled && setRating(star)}
//             disabled={disabled}
//             style={styles.starButton}
//           >
//             <Ionicons
//               name={star <= rating ? 'star' : 'star-outline'}
//               size={32}
//               color={star <= rating ? '#f59e0b' : '#d1d5db'}
//             />
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   };

//   // קומפוננטת תצוגת חוות דעת קיימת
//   const FeedbackDisplay = ({ feedback }) => {
//     if (!feedback) return null;

//     return (
//       <View style={styles.feedbackDisplay}>
//         <Text style={styles.sectionTitle}>חוות דעת שלך</Text>
//         <View style={styles.feedbackContent}>
//           <View style={styles.feedbackHeader}>
//             <Text style={styles.feedbackDate}>
//               {new Date(feedback.submittedAt).toLocaleDateString('he-IL')}
//             </Text>
//             <StarRating rating={feedback.rating} disabled={true} />
//           </View>
//           {feedback.comment ? (
//             <Text style={styles.feedbackComment}>{feedback.comment}</Text>
//           ) : null}
//         </View>
//       </View>
//     );
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('he-IL', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };
  
//   const getStatusDescription = (status) => {
//     switch(status) {
//       case 'open':
//         return 'התלונה שלך התקבלה ונמצאת בבדיקה ראשונית. נעדכן אותך על כל התקדמות.';
//       case 'in_progress':
//         return 'התלונה שלך בטיפול. צוות העירייה מטפל בנושא.';
//       case 'resolved':
//         return 'התלונה שלך טופלה. אנא וודא שהבעיה אכן נפתרה.';
//       case 'closed':
//         return 'התלונה סגורה. אם יש עדיין בעיה, אנא פתח תלונה חדשה.';
//       default:
//         return 'התלונה שלך התקבלה במערכת.';
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4f46e5" />
//         <Text style={styles.loadingText}>טוען פרטי תלונה...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="alert-circle" size={48} color="#ef4444" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>חזור</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!complaint) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
//         <Text style={styles.errorText}>התלונה לא נמצאה</Text>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>חזור</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const status = complaint.status || 'open';
//   const statusColor = STATUS_COLORS[status] || '#6b7280';
//   const statusIcon = STATUS_ICONS[status] || 'alert-circle';
//   const statusLabel = STATUS_LABELS[status] || 'ממתין לטיפול';
//   const isAssigned = !!complaint.assignedTo;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="arrow-forward" size={24} color="#ffffff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>פרטי התלונה שלי</Text>
//         <View style={{ width: 40 }} />
//       </View>
      
//       <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.complaintTitle}>{complaint.title}</Text>
//             <Text style={styles.complaintDate}>{formatDate(complaint.createdAt)}</Text>
//           </View>
          
//           <View style={styles.statusContainer}>
//             <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
//               <Ionicons name={statusIcon} size={18} color={statusColor} />
//               <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
//             </View>
            
//             <Text style={styles.statusDescription}>
//               {getStatusDescription(status)}
//             </Text>
//           </View>
          
//           <View style={styles.statusProgressBar}>
//             <View 
//               style={[
//                 styles.statusProgress, 
//                 { 
//                   width: status === 'open' ? '25%' : 
//                          status === 'in_progress' ? '50%' : 
//                          status === 'resolved' ? '75%' : '100%',
//                   backgroundColor: statusColor 
//                 }
//               ]} 
//             />
            
//             <View style={[styles.statusDot, { backgroundColor: status === 'open' || status === 'in_progress' || status === 'resolved' || status === 'closed' ? statusColor : '#d1d5db' }]} />
//             <View style={[styles.statusDot, { left: '33%', backgroundColor: status === 'in_progress' || status === 'resolved' || status === 'closed' ? statusColor : '#d1d5db' }]} />
//             <View style={[styles.statusDot, { left: '66%', backgroundColor: status === 'resolved' || status === 'closed' ? statusColor : '#d1d5db' }]} />
//             <View style={[styles.statusDot, { right: 0, backgroundColor: status === 'closed' ? statusColor : '#d1d5db' }]} />
            
//             <View style={styles.statusLabelsContainer}>
//               <Text style={[styles.statusProgressLabel, { color: status === 'open' ? statusColor : '#6b7280' }]}>פתוח</Text>
//               <Text style={[styles.statusProgressLabel, { color: status === 'in_progress' ? statusColor : '#6b7280' }]}>בטיפול</Text>
//               <Text style={[styles.statusProgressLabel, { color: status === 'resolved' ? statusColor : '#6b7280' }]}>טופל</Text>
//               <Text style={[styles.statusProgressLabel, { color: status === 'closed' ? statusColor : '#6b7280' }]}>סגור</Text>
//             </View>
//           </View>
//         </View>
        
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>פרטי התלונה</Text>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>קטגוריה:</Text>
//             <Text style={styles.infoValue}>{complaint.category}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>כתובת:</Text>
//             <Text style={styles.infoValue}>{complaint.address}</Text>
//           </View>
          
//           {isAssigned && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>סטטוס טיפול:</Text>
//               <Text style={styles.infoValue}>בטיפול צוות העירייה</Text>
//             </View>
//           )}
          
//           <Text style={styles.sectionSubtitle}>תיאור התלונה</Text>
//           <Text style={styles.descriptionText}>{complaint.description}</Text>
          
//           {complaint.location && complaint.location.latitude && complaint.location.longitude && (
//             <TouchableOpacity 
//               style={styles.mapButton}
//               onPress={() => {
//                 const url = Platform.select({
//                   ios: `maps:${complaint.location.latitude},${complaint.location.longitude}`,
//                   android: `geo:${complaint.location.latitude},${complaint.location.longitude}?q=${complaint.location.latitude},${complaint.location.longitude}`
//                 });
//                 Linking.canOpenURL(url).then(supported => {
//                   if (supported) {
//                     return Linking.openURL(url);
//                   } else {
//                     const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${complaint.location.latitude},${complaint.location.longitude}`;
//                     return Linking.openURL(googleMapsUrl);
//                   }
//                 });
//               }}
//             >
//               <Ionicons name="location" size={16} color="#ffffff" />
//               <Text style={styles.mapButtonText}>הצג במפה</Text>
//             </TouchableOpacity>
//           )}
//         </View>
        
//         {/* הצגת חוות דעת קיימת */}
//         {hasFeedback() && (
//           <View style={styles.card}>
//             <FeedbackDisplay feedback={complaint.feedback} />
//           </View>
//         )}
        
//         {/* כפתור להוספת חוות דעת אם הטיפול הסתיים ואין עדיין חוות דעת */}
//         {canLeaveFeedback() && (
//           <View style={styles.card}>
//             <Text style={styles.feedbackPromptTitle}>הטיפול בתלונה הסתיים</Text>
//             <Text style={styles.feedbackPromptText}>
//               נשמח לקבל את חוות דעתך על אופן הטיפול בתלונה
//             </Text>
//             <TouchableOpacity
//               style={styles.feedbackButton}
//               onPress={() => setFeedbackModalVisible(true)}
//             >
//               <Ionicons name="star" size={18} color="#ffffff" />
//               <Text style={styles.feedbackButtonText}>דרג את הטיפול בתלונה</Text>
//             </TouchableOpacity>
//           </View>
//         )}
        
//         {complaint.images && complaint.images.length > 0 && (
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>תמונות מצורפות</Text>
            
//             <View style={styles.imageContainer}>
//               <Image 
//                 source={{ uri: complaint.images[currentImageIndex].data }} 
//                 style={styles.image}
//                 resizeMode="contain"
//               />
//             </View>
            
//             {complaint.images.length > 1 && (
//               <View style={styles.imageNavigation}>
//                 <TouchableOpacity 
//                   onPress={() => setCurrentImageIndex(prev => (prev === 0 ? complaint.images.length - 1 : prev - 1))}
//                   style={styles.imageNavButton}
//                 >
//                   <Ionicons name="chevron-forward" size={24} color="#4f46e5" />
//                 </TouchableOpacity>
                
//                 <Text style={styles.imageCounter}>
//                   {currentImageIndex + 1} מתוך {complaint.images.length}
//                 </Text>
                
//                 <TouchableOpacity 
//                   onPress={() => setCurrentImageIndex(prev => (prev === complaint.images.length - 1 ? 0 : prev + 1))}
//                   style={styles.imageNavButton}
//                 >
//                   <Ionicons name="chevron-back" size={24} color="#4f46e5" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}
        
//         <View style={styles.card}>
//           <View style={styles.sectionTitleContainer}>
//             <Text style={styles.sectionTitle}>התכתבות ועדכונים</Text>
//             {complaint.responses && complaint.responses.length > 0 && (
//               <View style={styles.badgeContainer}>
//                 <Text style={styles.badgeText}>{complaint.responses.length}</Text>
//               </View>
//             )}
//           </View>
          
//           {complaint.responses && complaint.responses.length > 0 ? (
//             <View style={styles.timelineContainer}>
//               {complaint.responses.map((response, index) => (
//                 <View key={index} style={styles.timelineItem}>
//                   <View 
//                     style={[
//                       styles.timelineDot,
//                       { 
//                         backgroundColor: response.systemGenerated ? '#9ca3af' : 
//                                          response.fromEmployee ? '#4f46e5' : 
//                                          '#10b981' 
//                       }
//                     ]}
//                   />
//                   {index < complaint.responses.length - 1 && <View style={styles.timelineLine} />}
                  
//                   <View 
//                     style={[
//                       styles.responseItem,
//                       { 
//                         backgroundColor: response.systemGenerated ? '#f3f4f6' :
//                                          response.fromEmployee ? '#eef2ff' : 
//                                          '#ecfdf5'
//                       }
//                     ]}
//                   >
//                     <Text style={styles.responseText}>{response.message}</Text>
//                     <View style={styles.responseFooter}>
//                       <Text style={styles.responseDate}>
//                         {formatDate(response.createdAt)}
//                       </Text>
//                       <Text 
//                         style={[
//                           styles.responseSender,
//                           {
//                             color: response.systemGenerated ? '#6b7280' :
//                                    response.fromEmployee ? '#4f46e5' : 
//                                    '#10b981'
//                           }
//                         ]}
//                       >
//                         {response.systemGenerated ? 'מערכת' : 
//                          response.fromEmployee ? 'צוות העירייה' : 
//                          'אני'}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <View style={styles.noResponsesContainer}>
//               <Ionicons name="chatbubble-ellipses-outline" size={48} color="#d1d5db" />
//               <Text style={styles.noResponsesText}>
//                 אין עדיין תגובות או עדכונים
//               </Text>
//               <Text style={styles.noResponsesSubtext}>
//                 נעדכן אותך כאשר יהיו התפתחויות בתלונה שלך
//               </Text>
//             </View>
//           )}
//         </View>
        
//         <View style={styles.footerActions}>
//           <TouchableOpacity 
//             style={styles.footerButton}
//             onPress={() => navigation.navigate('MyComplaints')}
//           >
//             <Ionicons name="list" size={20} color="#4f46e5" />
//             <Text style={styles.footerButtonText}>לכל התלונות שלי</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.footerButton, styles.primaryButton]}
//             onPress={() => navigation.navigate('ComplaintForm')}
//           >
//             <Ionicons name="add-circle" size={20} color="#ffffff" />
//             <Text style={styles.primaryButtonText}>תלונה חדשה</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* מודאל חוות דעת */}
//       <Modal
//         visible={feedbackModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setFeedbackModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setFeedbackModalVisible(false)}
//             >
//               <Ionicons name="close" size={24} color="#6b7280" />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>חוות דעת על הטיפול בתלונה</Text>
//             <Text style={styles.modalSubtitle}>כיצד תדרג את הטיפול בתלונה?</Text>

//             <StarRating rating={feedbackRating} setRating={setFeedbackRating} />

//             <Text style={styles.inputLabel}>הערות והארות (אופציונלי)</Text>
//             <TextInput
//               style={styles.commentInput}
//               placeholder="שתף את חוויתך לגבי הטיפול בתלונה"
//               value={feedbackComment}
//               onChangeText={setFeedbackComment}
//               multiline
//               numberOfLines={4}
//               placeholderTextColor="#9ca3af"
//             />

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setFeedbackModalVisible(false)}
//                 disabled={isSubmittingFeedback}
//               >
//                 <Text style={styles.cancelButtonText}>ביטול</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={submitFeedback}
//                 disabled={isSubmittingFeedback}
//               >
//                 {isSubmittingFeedback ? (
//                   <ActivityIndicator size="small" color="#ffffff" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>שלח חוות דעת</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#4f46e5',
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   content: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 30,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   cardHeader: {
//     marginBottom: 12,
//   },
//   complaintTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   complaintDate: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   statusContainer: {
//     marginBottom: 16,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 8,
//   },
//   statusText: {
//     marginLeft: 6,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   statusDescription: {
//     fontSize: 14,
//     color: '#4b5563',
//     lineHeight: 20,
//   },
//   statusProgressBar: {
//     height: 4,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 2,
//     marginTop: 16,
//     position: 'relative',
//   },
//   statusProgress: {
//     height: '100%',
//     borderRadius: 2,
//     position: 'absolute',
//     left: 0,
//     top: 0,
//   },
//   statusDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#d1d5db',
//     position: 'absolute',
//     top: -4,
//     left: 0,
//     borderWidth: 2,
//     borderColor: '#ffffff',
//   },
//   statusLabelsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//   },
//   statusProgressLabel: {
//     fontSize: 12,
//     textAlign: 'center',
//     width: '25%',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   sectionSubtitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#374151',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//     width: 80,
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#1f2937',
//     flex: 1,
//     fontWeight: '500',
//   },
//   descriptionText: {
//     fontSize: 14,
//     color: '#4b5563',
//     lineHeight: 20,
//   },
//   mapButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4f46e5',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   mapButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '500',
//     marginLeft: 8,
//   },
//   imageContainer: {
//     height: 200,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#f3f4f6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   imageNavigation: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageNavButton: {
//     padding: 8,
//   },
//   imageCounter: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginHorizontal: 10,
//   },
//   sectionTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   badgeContainer: {
//     backgroundColor: '#4f46e5',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     marginLeft: 8,
//   },
//   badgeText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   timelineContainer: {
//     marginLeft: 6,
//   },
//   timelineItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   timelineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginTop: 6,
//     marginRight: 12,
//     zIndex: 2,
//   },
//   timelineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginTop: 6,
//     marginRight: 12,
//     zIndex: 2,
//   },
//   timelineLine: {
//     position: 'absolute',
//     left: 5.5,
//     top: 18,
//     bottom: -8,
//     width: 1,
//     backgroundColor: '#e5e7eb',
//     zIndex: 1,
//   },
//   responseItem: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 12,
//   },
//   responseText: {
//     fontSize: 14,
//     color: '#1f2937',
//     lineHeight: 20,
//   },
//   responseFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   responseDate: {
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   responseSender: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   noResponsesContainer: {
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   noResponsesText: {
//     fontSize: 16,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginTop: 16,
//     fontWeight: '500',
//   },
//   noResponsesSubtext: {
//     fontSize: 14,
//     color: '#9ca3af',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   footerActions: {
//     flexDirection: 'row',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   footerButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ffffff',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: '#4f46e5',
//   },
//   footerButtonText: {
//     color: '#4f46e5',
//     fontSize: 14,
//     fontWeight: '500',
//     marginLeft: 8,
//   },
//   primaryButton: {
//     backgroundColor: '#4f46e5',
//     borderWidth: 0,
//   },
//   primaryButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '500',
//     marginLeft: 8,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#4f46e5',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     marginTop: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     color: '#ef4444',
//     textAlign: 'center',
//   },
//   backButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
  
//   // חוות דעת סטיילים
//   feedbackPromptTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 8,
//   },
//   feedbackPromptText: {
//     fontSize: 14,
//     color: '#4b5563',
//     marginBottom: 16,
//   },
//   feedbackButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4f46e5',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   feedbackButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '500',
//     marginLeft: 8,
//   },
//   // סטיילים לתצוגת חוות דעת
//   feedbackDisplay: {
//     borderRadius: 8,
//   },
//   feedbackContent: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 12,
//     padding: 16,
//   },
//   feedbackHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   feedbackDate: {
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   feedbackComment: {
//     fontSize: 14,
//     color: '#4b5563',
//     lineHeight: 20,
//     marginTop: 8,
//   },
//   // סטיילים למודאל חוות דעת
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   modalContent: {
//     backgroundColor: '#ffffff',
//     width: '100%',
//     borderRadius: 16,
//     padding: 24,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     padding: 4,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: '#4b5563',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   starButton: {
//     padding: 4,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   commentInput: {
//     backgroundColor: '#f9fafb',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 12,
//     minHeight: 100,
//     textAlignVertical: 'top',
//     fontSize: 14,
//     color: '#1f2937',
//     marginBottom: 24,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f3f4f6',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginRight: 8,
//     flex: 1,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#6b7280',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   submitButton: {
//     backgroundColor: '#4f46e5',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     flex: 2,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

// export default CitizenComplaintDetails;

// CitizenComplaintDetails.js - Enhanced with Follow-up Features
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

const CitizenComplaintDetails = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // משתני מצב לחוות דעת
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  // 🆕 משתני מצב לתמיכה נוספת
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [followUpType, setFollowUpType] = useState('not_satisfied'); // 'not_satisfied', 'new_issue', 'chat_request'
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [[, storedUserId], [, storedUserToken]] = await AsyncStorage.multiGet([
          'userId', 
          'userToken'
        ]);
        
        if (!storedUserToken || !storedUserId) {
          navigation.replace('Login');
          return;
        }
        
        setUserId(storedUserId);
        setUserToken(storedUserToken);
        fetchComplaintDetails(storedUserToken);
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('שגיאה בטעינת נתוני משתמש');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [complaintId, navigation]);

  const fetchComplaintDetails = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.5:5000/api/complaints/${complaintId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success') {
        setComplaint(response.data.data);
      } else {
        setError('שגיאה בטעינת פרטי התלונה');
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      
      if (error.response?.status === 401) {
        await AsyncStorage.multiRemove(['userToken', 'userId']);
        navigation.replace('Login');
      } else if (error.response?.status === 403) {
        setError('אין לך הרשאה לצפות בתלונה זו');
      } else if (error.response?.status === 404) {
        setError('התלונה לא נמצאה');
      } else {
        setError('שגיאה בטעינת פרטי התלונה');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🆕 פונקציה לרענון נתוני התלונה
  const refreshComplaint = async () => {
    setRefreshing(true);
    await fetchComplaintDetails(userToken);
    setRefreshing(false);
  };

  // פונקציה לשליחת חוות דעת
  const submitFeedback = async () => {
    if (feedbackRating === 0) {
      Alert.alert('שגיאה', 'אנא בחר דירוג כוכבים');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const response = await axios.post(
        `http://192.168.1.5:5000/api/complaints/${complaintId}/feedback`,
        {
          rating: feedbackRating,
          comment: feedbackComment
        },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setComplaint(response.data.data);
        Alert.alert('תודה', 'חוות הדעת שלך התקבלה בהצלחה');
        setFeedbackModalVisible(false);
        setFeedbackComment('');
        setFeedbackRating(0);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת חוות הדעת');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // 🆕 פונקציה לשליחת בקשת המשך טיפול
  const submitFollowUp = async () => {
    if (!followUpMessage.trim()) {
      Alert.alert('שגיאה', 'אנא כתוב את פרטי הבקשה');
      return;
    }

    setIsSubmittingFollowUp(true);
    try {
      const response = await axios.post(
        `http://192.168.1.5:5000/api/complaints/${complaintId}/follow-up`,
        {
          type: followUpType,
          message: followUpMessage,
          reason: getFollowUpReason()
        },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setComplaint(response.data.data);
        Alert.alert('הבקשה נשלחה', 'בקשתך להמשך טיפול נשלחה בהצלחה');
        setFollowUpModalVisible(false);
        setFollowUpMessage('');
      }
    } catch (error) {
      console.error('Error submitting follow up:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת הבקשה');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  // 🆕 פונקציה לשליחת הודעה בצ'אט
  const submitChatMessage = async () => {
    if (!chatMessage.trim()) {
      Alert.alert('שגיאה', 'אנא כתוב הודעה');
      return;
    }

    setIsSubmittingFollowUp(true);
    try {
      const response = await axios.post(
        `http://192.168.1.5:5000/api/complaints/${complaintId}/respond`,
        {
          message: chatMessage,
          fromEmployee: false
        },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setComplaint(response.data.data);
        setChatMessage('');
        setChatModalVisible(false);
        Alert.alert('הודעה נשלחה', 'ההודעה שלך נשלחה לצוות הטיפול');
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בשליחת ההודעה');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  // 🆕 פונקציות עזר
  const getFollowUpReason = () => {
    switch(followUpType) {
      case 'not_satisfied':
        return 'אינו מרוצה מהטיפול';
      case 'new_issue':
        return 'בעיה חדשה או קשורה';
      case 'chat_request':
        return 'בקשה לתקשורת עם הצוות';
      default:
        return 'המשך טיפול';
    }
  };

  const canRequestFollowUp = () => {
    if (!complaint) return false;
    return complaint.status === 'closed' || complaint.status === 'resolved';
  };

  const canSendMessage = () => {
    if (!complaint) return false;
    return complaint.status === 'open' || complaint.status === 'in_progress';
  };

  const hasRecentFeedback = () => {
    if (!complaint || !complaint.feedback) return false;
    const feedbackDate = new Date(complaint.feedback.submittedAt);
    const daysSince = (new Date() - feedbackDate) / (1000 * 60 * 60 * 24);
    return daysSince < 30; // חוות דעת מהחודש האחרון
  };

  // פונקציות עזר לחוות דעת
  const canLeaveFeedback = () => {
    if (!complaint) return false;
    return (
      (complaint.status === 'resolved' || complaint.status === 'closed') && 
      !complaint.feedback
    );
  };

  const hasFeedback = () => {
    return complaint && complaint.feedback;
  };

  // קומפוננטת דירוג כוכבים
  const StarRating = ({ rating, setRating, disabled = false }) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => !disabled && setRating(star)}
            disabled={disabled}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#f59e0b' : '#d1d5db'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 🆕 קומפוננטת כפתורי פעולות מתקדמות
  const AdvancedActions = () => {
    if (!complaint) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>פעולות נוספות</Text>
        
        {/* צ'אט עם הצוות */}
        {canSendMessage() && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setChatModalVisible(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#4f46e5" />
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>שלח הודעה לצוות</Text>
              <Text style={styles.actionButtonSubtitle}>תקשורת ישירה עם המטפל</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}

        {/* בקשת המשך טיפול */}
        {canRequestFollowUp() && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setFollowUpModalVisible(true)}
          >
            <Ionicons name="refresh" size={20} color="#f59e0b" />
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>בקש המשך טיפול</Text>
              <Text style={styles.actionButtonSubtitle}>הבעיה לא נפתרה או חזרה?</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}

        {/* פתיחת תלונה קשורה */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ComplaintForm', { 
            relatedComplaintId: complaintId,
            prefillCategory: complaint.category,
            prefillAddress: complaint.address 
          })}
        >
          <Ionicons name="add-circle" size={20} color="#10b981" />
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>תלונה קשורה</Text>
            <Text style={styles.actionButtonSubtitle}>פתח תלונה חדשה באותו נושא</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* שיתוף התלונה */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            const shareText = `תלונה ${complaint.title}\nכתובת: ${complaint.address}\nסטטוס: ${STATUS_LABELS[complaint.status]}`;
            // כאן אפשר להוסיף שיתוף למדיה חברתית או ווטסאפ
            Alert.alert('שיתוף', 'נוסף בקרוב - שיתוף במדיה חברתית');
          }}
        >
          <Ionicons name="share" size={20} color="#6b7280" />
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>שתף תלונה</Text>
            <Text style={styles.actionButtonSubtitle}>הפץ מודעות לבעיה</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    );
  };

  // קומפוננטת תצוגת חוות דעת קיימת
  const FeedbackDisplay = ({ feedback }) => {
    if (!feedback) return null;

    return (
      <View style={styles.feedbackDisplay}>
        <Text style={styles.sectionTitle}>חוות דעת שלך</Text>
        <View style={styles.feedbackContent}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.feedbackDate}>
              {new Date(feedback.submittedAt).toLocaleDateString('he-IL')}
            </Text>
            <StarRating rating={feedback.rating} disabled={true} />
          </View>
          {feedback.comment ? (
            <Text style={styles.feedbackComment}>{feedback.comment}</Text>
          ) : null}
        </View>
      </View>
    );
  };

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
  
  const getStatusDescription = (status) => {
    switch(status) {
      case 'open':
        return 'התלונה שלך התקבלה ונמצאת בבדיקה ראשונית. נעדכן אותך על כל התקדמות.';
      case 'in_progress':
        return 'התלונה שלך בטיפול. צוות העירייה מטפל בנושא.';
      case 'resolved':
        return 'התלונה שלך טופלה. אנא וודא שהבעיה אכן נפתרה.';
      case 'closed':
        return 'התלונה סגורה. אם יש עדיין בעיה, אנא פתח תלונה חדשה.';
      default:
        return 'התלונה שלך התקבלה במערכת.';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>טוען פרטי תלונה...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
        <Text style={styles.errorText}>התלונה לא נמצאה</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = complaint.status || 'open';
  const statusColor = STATUS_COLORS[status] || '#6b7280';
  const statusIcon = STATUS_ICONS[status] || 'alert-circle';
  const statusLabel = STATUS_LABELS[status] || 'ממתין לטיפול';
  const isAssigned = !!complaint.assignedTo;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>פרטי התלונה שלי</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshComplaint}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color="#ffffff" 
            style={refreshing ? { opacity: 0.5 } : {}}
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* כרטיס ראשי עם סטטוס */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.complaintTitle}>{complaint.title}</Text>
            <Text style={styles.complaintDate}>{formatDate(complaint.createdAt)}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <Ionicons name={statusIcon} size={18} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
            
            <Text style={styles.statusDescription}>
              {getStatusDescription(status)}
            </Text>
          </View>
          
          <View style={styles.statusProgressBar}>
            <View 
              style={[
                styles.statusProgress, 
                { 
                  width: status === 'open' ? '25%' : 
                         status === 'in_progress' ? '50%' : 
                         status === 'resolved' ? '75%' : '100%',
                  backgroundColor: statusColor 
                }
              ]} 
            />
            
            <View style={[styles.statusDot, { backgroundColor: status === 'open' || status === 'in_progress' || status === 'resolved' || status === 'closed' ? statusColor : '#d1d5db' }]} />
            <View style={[styles.statusDot, { left: '33%', backgroundColor: status === 'in_progress' || status === 'resolved' || status === 'closed' ? statusColor : '#d1d5db' }]} />
            <View style={[styles.statusDot, { left: '66%', backgroundColor: status === 'resolved' || status === 'closed' ? statusColor : '#d1d5db' }]} />
            <View style={[styles.statusDot, { right: 0, backgroundColor: status === 'closed' ? statusColor : '#d1d5db' }]} />
            
            <View style={styles.statusLabelsContainer}>
              <Text style={[styles.statusProgressLabel, { color: status === 'open' ? statusColor : '#6b7280' }]}>פתוח</Text>
              <Text style={[styles.statusProgressLabel, { color: status === 'in_progress' ? statusColor : '#6b7280' }]}>בטיפול</Text>
              <Text style={[styles.statusProgressLabel, { color: status === 'resolved' ? statusColor : '#6b7280' }]}>טופל</Text>
              <Text style={[styles.statusProgressLabel, { color: status === 'closed' ? statusColor : '#6b7280' }]}>סגור</Text>
            </View>
          </View>
        </View>
        
        {/* פרטי התלונה */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>פרטי התלונה</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>קטגוריה:</Text>
            <Text style={styles.infoValue}>{complaint.category}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>כתובת:</Text>
            <Text style={styles.infoValue}>{complaint.address}</Text>
          </View>
          
          {isAssigned && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>סטטוס טיפול:</Text>
              <Text style={styles.infoValue}>בטיפול צוות העירייה</Text>
            </View>
          )}
          
          <Text style={styles.sectionSubtitle}>תיאור התלונה</Text>
          <Text style={styles.descriptionText}>{complaint.description}</Text>
          
          {complaint.location && complaint.location.latitude && complaint.location.longitude && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => {
                const url = Platform.select({
                  ios: `maps:${complaint.location.latitude},${complaint.location.longitude}`,
                  android: `geo:${complaint.location.latitude},${complaint.location.longitude}?q=${complaint.location.latitude},${complaint.location.longitude}`
                });
                Linking.canOpenURL(url).then(supported => {
                  if (supported) {
                    return Linking.openURL(url);
                  } else {
                    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${complaint.location.latitude},${complaint.location.longitude}`;
                    return Linking.openURL(googleMapsUrl);
                  }
                });
              }}
            >
              <Ionicons name="location" size={16} color="#ffffff" />
              <Text style={styles.mapButtonText}>הצג במפה</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 🆕 פעולות מתקדמות */}
        <AdvancedActions />

        {/* הצגת חוות דעת קיימת */}
        {hasFeedback() && (
          <View style={styles.card}>
            <FeedbackDisplay feedback={complaint.feedback} />
          </View>
        )}
        
        {/* כפתור להוספת חוות דעת אם הטיפול הסתיים ואין עדיין חוות דעת */}
        {canLeaveFeedback() && (
          <View style={styles.card}>
            <Text style={styles.feedbackPromptTitle}>הטיפול בתלונה הסתיים</Text>
            <Text style={styles.feedbackPromptText}>
              נשמח לקבל את חוות דעתך על אופן הטיפול בתלונה
            </Text>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => setFeedbackModalVisible(true)}
            >
              <Ionicons name="star" size={18} color="#ffffff" />
              <Text style={styles.feedbackButtonText}>דרג את הטיפול בתלונה</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* תמונות */}
        {complaint.images && complaint.images.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>תמונות מצורפות</Text>
            
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: complaint.images[currentImageIndex].data }} 
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            
            {complaint.images.length > 1 && (
              <View style={styles.imageNavigation}>
                <TouchableOpacity 
                  onPress={() => setCurrentImageIndex(prev => (prev === 0 ? complaint.images.length - 1 : prev - 1))}
                  style={styles.imageNavButton}
                >
                  <Ionicons name="chevron-forward" size={24} color="#4f46e5" />
                </TouchableOpacity>
                
                <Text style={styles.imageCounter}>
                  {currentImageIndex + 1} מתוך {complaint.images.length}
                </Text>
                
                <TouchableOpacity 
                  onPress={() => setCurrentImageIndex(prev => (prev === complaint.images.length - 1 ? 0 : prev + 1))}
                  style={styles.imageNavButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#4f46e5" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* התכתבות ועדכונים */}
        <View style={styles.card}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>התכתבות ועדכונים</Text>
            {complaint.responses && complaint.responses.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{complaint.responses.length}</Text>
              </View>
            )}
          </View>
          
          {complaint.responses && complaint.responses.length > 0 ? (
            <View style={styles.timelineContainer}>
              {complaint.responses.map((response, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View 
                    style={[
                      styles.timelineDot,
                      { 
                        backgroundColor: response.systemGenerated ? '#9ca3af' : 
                                         response.fromEmployee ? '#4f46e5' : 
                                         '#10b981' 
                      }
                    ]}
                  />
                  {index < complaint.responses.length - 1 && <View style={styles.timelineLine} />}
                  
                  <View 
                    style={[
                      styles.responseItem,
                      { 
                        backgroundColor: response.systemGenerated ? '#f3f4f6' :
                                         response.fromEmployee ? '#eef2ff' : 
                                         '#ecfdf5'
                      }
                    ]}
                  >
                    <Text style={styles.responseText}>{response.message}</Text>
                    <View style={styles.responseFooter}>
                      <Text style={styles.responseDate}>
                        {formatDate(response.createdAt)}
                      </Text>
                      <Text 
                        style={[
                          styles.responseSender,
                          {
                            color: response.systemGenerated ? '#6b7280' :
                                   response.fromEmployee ? '#4f46e5' : 
                                   '#10b981'
                          }
                        ]}
                      >
                        {response.systemGenerated ? 'מערכת' : 
                         response.fromEmployee ? 'צוות העירייה' : 
                         'אני'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noResponsesContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color="#d1d5db" />
              <Text style={styles.noResponsesText}>
                אין עדיין תגובות או עדכונים
              </Text>
              <Text style={styles.noResponsesSubtext}>
                נעדכן אותך כאשר יהיו התפתחויות בתלונה שלך
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => navigation.navigate('MyComplaints')}
          >
            <Ionicons name="list" size={20} color="#4f46e5" />
            <Text style={styles.footerButtonText}>לכל התלונות שלי</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.footerButton, styles.primaryButton]}
            onPress={() => navigation.navigate('ComplaintForm')}
          >
            <Ionicons name="add-circle" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>תלונה חדשה</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🆕 מודאל בקשת המשך טיפול */}
      <Modal
        visible={followUpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFollowUpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setFollowUpModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>בקשת המשך טיפול</Text>
            <Text style={styles.modalSubtitle}>
              אנא בחר את סוג הבקשה ופרט את הנושא
            </Text>

            {/* סוגי בקשות */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  followUpType === 'not_satisfied' && styles.optionButtonActive
                ]}
                onPress={() => setFollowUpType('not_satisfied')}
              >
                <Ionicons 
                  name="thumbs-down" 
                  size={20} 
                  color={followUpType === 'not_satisfied' ? '#ffffff' : '#ef4444'} 
                />
                <Text style={[
                  styles.optionText,
                  followUpType === 'not_satisfied' && styles.optionTextActive
                ]}>
                  הבעיה לא נפתרה כראוי
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  followUpType === 'new_issue' && styles.optionButtonActive
                ]}
                onPress={() => setFollowUpType('new_issue')}
              >
                <Ionicons 
                  name="alert-circle" 
                  size={20} 
                  color={followUpType === 'new_issue' ? '#ffffff' : '#f59e0b'} 
                />
                <Text style={[
                  styles.optionText,
                  followUpType === 'new_issue' && styles.optionTextActive
                ]}>
                  הבעיה חזרה או התפתחה
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  followUpType === 'chat_request' && styles.optionButtonActive
                ]}
                onPress={() => setFollowUpType('chat_request')}
              >
                <Ionicons 
                  name="chatbubbles" 
                  size={20} 
                  color={followUpType === 'chat_request' ? '#ffffff' : '#4f46e5'} 
                />
                <Text style={[
                  styles.optionText,
                  followUpType === 'chat_request' && styles.optionTextActive
                ]}>
                  רוצה לדבר עם הצוות
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>פרט את הבקשה</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="תאר את הבעיה או הבקשה שלך..."
              value={followUpMessage}
              onChangeText={setFollowUpMessage}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setFollowUpModalVisible(false)}
                disabled={isSubmittingFollowUp}
              >
                <Text style={styles.cancelButtonText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitFollowUp}
                disabled={isSubmittingFollowUp}
              >
                {isSubmittingFollowUp ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>שלח בקשה</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🆕 מודאל צ'אט */}
      <Modal
        visible={chatModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setChatModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>שלח הודעה לצוות</Text>
            <Text style={styles.modalSubtitle}>
              ההודעה תישלח ישירות לצוות המטפל בתלונה שלך
            </Text>

            <Text style={styles.inputLabel}>ההודעה שלך</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="כתוב את ההודעה שלך לצוות..."
              value={chatMessage}
              onChangeText={setChatMessage}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setChatModalVisible(false)}
                disabled={isSubmittingFollowUp}
              >
                <Text style={styles.cancelButtonText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitChatMessage}
                disabled={isSubmittingFollowUp}
              >
                {isSubmittingFollowUp ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>שלח הודעה</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* מודאל חוות דעת מקורי */}
      <Modal
        visible={feedbackModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setFeedbackModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>חוות דעת על הטיפול בתלונה</Text>
            <Text style={styles.modalSubtitle}>כיצד תדרג את הטיפול בתלונה?</Text>

            <StarRating rating={feedbackRating} setRating={setFeedbackRating} />

            <Text style={styles.inputLabel}>הערות והארות (אופציונלי)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="שתף את חוויתך לגבי הטיפול בתלונה"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setFeedbackModalVisible(false)}
                disabled={isSubmittingFeedback}
              >
                <Text style={styles.cancelButtonText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>שלח חוות דעת</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  refreshButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  complaintDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  statusDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  statusProgressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 16,
    position: 'relative',
  },
  statusProgress: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
    position: 'absolute',
    top: -4,
    left: 0,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  statusLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statusProgressLabel: {
    fontSize: 12,
    textAlign: 'center',
    width: '25%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  mapButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },

  // 🆕 סטיילים לפעולות מתקדמות
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },

  // סטיילים למודלים
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    textAlign: 'center',
  },

  // 🆕 סטיילים לאפשרויות בקשת המשך טיפול
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#ffffff',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 2,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // שאר הסטיילים הקיימים...
  imageContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavButton: {
    padding: 8,
  },
  imageCounter: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineContainer: {
    marginLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 12,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    left: 5.5,
    top: 18,
    bottom: -8,
    width: 1,
    backgroundColor: '#e5e7eb',
    zIndex: 1,
  },
  responseItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  responseText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  responseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  responseDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  responseSender: {
    fontSize: 12,
    fontWeight: '500',
  },
  noResponsesContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResponsesText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  noResponsesSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  footerActions: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  footerButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderWidth: 0,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
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
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // חוות דעת סטיילים
  feedbackPromptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  feedbackPromptText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  feedbackButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  feedbackDisplay: {
    borderRadius: 8,
  },
  feedbackContent: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  feedbackComment: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
});

export default CitizenComplaintDetails;