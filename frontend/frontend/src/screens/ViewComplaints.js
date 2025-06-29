// import React, { useState, useEffect } from 'react';
// import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
// import { Surface, Text, Card, Title, Avatar, useTheme } from 'react-native-paper';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width } = Dimensions.get('window');
// const SERVER_URL = 'http://192.168.1.7:5000';

// const ViewComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const theme = useTheme();

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${SERVER_URL}/api/viewcomplaints`);
//       setComplaints(response.data.data);
//     } catch (error) {
//       console.error('Error fetching complaints:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchComplaints();
//   };

//   const renderComplaint = (item) => (
//     <Card style={styles.card} key={item._id}>
//       <Card.Content>
//         <View style={styles.cardHeader}>
//           <Avatar.Icon size={40} icon="alert-circle" style={[styles.icon, { backgroundColor: '#F4433620' }]} color="#F44336" />
//           <View style={styles.cardHeaderText}>
//             <Title style={styles.title}>{item.title}</Title>
//             <Text style={styles.status}>סטטוס: {item.status}</Text>
//           </View>
//         </View>
//         <Text style={styles.description}>{item.description}</Text>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       <Surface style={styles.header}>
//         <Title style={styles.headerTitle}>תלונות</Title>
//       </Surface>
//       {loading ? (
//         <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
//       ) : (
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         >
//           {complaints.map(renderComplaint)}
//         </ScrollView>
//       )}
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
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   headerTitle: {
//     color: '#ffffff',
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'right',
//   },
//   scrollContent: {
//     padding: 20,
//   },
//   card: {
//     marginBottom: 16,
//     borderRadius: 20,
//     elevation: 3,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   icon: {
//     marginLeft: 16,
//   },
//   cardHeaderText: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1f2937',
//     textAlign: 'right',
//   },
//   status: {
//     fontSize: 14,
//     color: '#6b7280',
//     textAlign: 'right',
//   },
//   description: {
//     fontSize: 16,
//     color: '#4b5563',
//     textAlign: 'right',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ViewComplaints;
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, Image } from 'react-native';
import { Surface, Text, Card, Title, Avatar, useTheme, Chip, Button, Divider } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const SERVER_URL = 'http://192.168.1.3:5000';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/viewcomplaints`);
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#F44336';
      case 'in_progress': return '#FF9800';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'פתוח';
      case 'in_progress': return 'בטיפול';
      case 'resolved': return 'טופל';
      case 'closed': return 'סגור';
      default: return status;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'תחזוקה': return 'wrench';
      case 'תברואה': return 'delete';
      case 'תשתיות': return 'road';
      case 'חניה': return 'car';
      case 'גינון': return 'flower';
      case 'תאורה': return 'lightbulb';
      default: return 'alert-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const renderComplaint = (item) => (
    <TouchableOpacity key={item._id} onPress={() => openDetailModal(item)}>
      <Card style={styles.card}>
        <Card.Content>
          {/* כותרת הכרטיס */}
          <View style={styles.cardHeader}>
            <Avatar.Icon 
              size={40} 
              icon={getCategoryIcon(item.category)} 
              style={[styles.icon, { backgroundColor: getStatusColor(item.status) + '20' }]} 
              color={getStatusColor(item.status)} 
            />
            <View style={styles.cardHeaderText}>
              <Title style={styles.title}>{item.title}</Title>
              <Chip 
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                textStyle={[styles.statusText, { color: getStatusColor(item.status) }]}
              >
                {getStatusText(item.status)}
              </Chip>
            </View>
          </View>

          {/* תיאור התלונה */}
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {/* פרטים נוספים */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={16} color="#666" />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="clock" size={16} color="#666" />
              <Text style={styles.detailText}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>

          {/* כתובת */}
          {item.address && (
            <View style={styles.addressContainer}>
              <Icon name="home" size={16} color="#666" />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          )}

          {/* מטפל */}
          {item.assignedTo && (
            <View style={styles.assignedContainer}>
              <Icon name="account" size={16} color="#4CAF50" />
              <Text style={styles.assignedText}>מטפל: {item.assignedTo}</Text>
            </View>
          )}

          {/* תגובות */}
          {item.responses && item.responses.length > 0 && (
            <View style={styles.responsesContainer}>
              <Icon name="message" size={16} color="#2196F3" />
              <Text style={styles.responsesText}>{item.responses.length} תגובות</Text>
            </View>
          )}

          {/* דירוג */}
          {item.feedback && item.feedback.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>דירוג: {item.feedback.rating}/5</Text>
            </View>
          )}

          {/* תמונות */}
          {item.images && item.images.length > 0 && (
            <View style={styles.imagesIndicator}>
              <Icon name="camera" size={16} color="#9C27B0" />
              <Text style={styles.imagesText}>{item.images.length} תמונות</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderDetailModal = () => {
    if (!selectedComplaint) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScroll}>
              {/* כותרת המודל */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Title style={styles.modalTitle}>פרטי תלונה</Title>
              </View>

              <Divider style={styles.divider} />

              {/* פרטים בסיסיים */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>פרטים כלליים</Text>
                <Text style={styles.modalText}><Text style={styles.label}>כותרת:</Text> {selectedComplaint.title}</Text>
                <Text style={styles.modalText}><Text style={styles.label}>תיאור:</Text> {selectedComplaint.description}</Text>
<Text style={styles.modalText}><Text style={styles.label}>קטגוריה:</Text> {selectedComplaint.category}</Text>
               <Text style={styles.modalText}><Text style={styles.label}>סטטוס:</Text> {getStatusText(selectedComplaint.status)}</Text>
               <Text style={styles.modalText}><Text style={styles.label}>תאריך יצירה:</Text> {formatDate(selectedComplaint.createdAt)}</Text>
             </View>

             {/* כתובת ומיקום */}
             {selectedComplaint.address && (
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>מיקום</Text>
                 <Text style={styles.modalText}><Text style={styles.label}>כתובת:</Text> {selectedComplaint.address}</Text>
                 {selectedComplaint.location && (
                   <>
                     <Text style={styles.modalText}>
                       <Text style={styles.label}>קו רוחב:</Text> {selectedComplaint.location.latitude}
                     </Text>
                     <Text style={styles.modalText}>
                       <Text style={styles.label}>קו אורך:</Text> {selectedComplaint.location.longitude}
                     </Text>
                   </>
                 )}
               </View>
             )}

             {/* מטפל */}
             {selectedComplaint.assignedTo && (
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>טיפול</Text>
                 <Text style={styles.modalText}><Text style={styles.label}>מטפל:</Text> {selectedComplaint.assignedTo}</Text>
               </View>
             )}

             {/* תגובות */}
             {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>תגובות ({selectedComplaint.responses.length})</Text>
                 {selectedComplaint.responses.map((response, index) => (
                   <View key={index} style={styles.responseItem}>
                     <View style={styles.responseHeader}>
                       <Text style={styles.responseType}>
                         {response.fromEmployee ? 'עובד עירייה' : 'תושב'}
                       </Text>
                       <Text style={styles.responseDate}>
                         {formatDate(response.createdAt)}
                       </Text>
                     </View>
                     <Text style={styles.responseMessage}>{response.message}</Text>
                   </View>
                 ))}
               </View>
             )}

             {/* חוות דעת */}
             {selectedComplaint.feedback && (
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>חוות דעת</Text>
                 <View style={styles.feedbackContainer}>
                   <View style={styles.starsContainer}>
                     {[1, 2, 3, 4, 5].map((star) => (
                       <Icon
                         key={star}
                         name="star"
                         size={20}
                         color={star <= selectedComplaint.feedback.rating ? '#FFC107' : '#E0E0E0'}
                       />
                     ))}
                     <Text style={styles.ratingValue}>({selectedComplaint.feedback.rating}/5)</Text>
                   </View>
                   {selectedComplaint.feedback.comment && (
                     <Text style={styles.feedbackComment}>{selectedComplaint.feedback.comment}</Text>
                   )}
                   <Text style={styles.feedbackDate}>
                     {formatDate(selectedComplaint.feedback.submittedAt)}
                   </Text>
                 </View>
               </View>
             )}

             {/* תמונות */}
             {selectedComplaint.images && selectedComplaint.images.length > 0 && (
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>תמונות ({selectedComplaint.images.length})</Text>
                 <ScrollView horizontal style={styles.imagesContainer}>
                   {selectedComplaint.images.map((image, index) => (
                     <Image
                       key={index}
                       source={{ uri: image.data }}
                       style={styles.complaintImage}
                       resizeMode="cover"
                     />
                   ))}
                 </ScrollView>
               </View>
             )}

             {/* מידע נוסף */}
             <View style={styles.modalSection}>
               <Text style={styles.sectionTitle}>מידע נוסף</Text>
               <Text style={styles.modalText}>
                 <Text style={styles.label}>מזהה תלונה:</Text> {selectedComplaint._id}
               </Text>
               <Text style={styles.modalText}>
                 <Text style={styles.label}>מזהה משתמש:</Text> {selectedComplaint.userId}
               </Text>
             </View>
           </ScrollView>
         </View>
       </View>
     </Modal>
   );
 };

 return (
   <View style={styles.container}>
     <Surface style={styles.header}>
       <Title style={styles.headerTitle}>כל התלונות ({complaints.length})</Title>
     </Surface>
     
     {loading ? (
       <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
     ) : (
       <ScrollView
         contentContainerStyle={styles.scrollContent}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
       >
         {complaints.map(renderComplaint)}
       </ScrollView>
     )}

     {renderDetailModal()}
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
 },
 header: {
   padding: 24,
   paddingTop: 60,
   backgroundColor: '#4f46e5',
   borderBottomLeftRadius: 40,
   borderBottomRightRadius: 40,
   elevation: 8,
 },
 headerTitle: {
   color: '#ffffff',
   fontSize: 28,
   fontWeight: 'bold',
   textAlign: 'right',
 },
 scrollContent: {
   padding: 16,
 },
 card: {
   marginBottom: 16,
   borderRadius: 16,
   elevation: 3,
   backgroundColor: '#ffffff',
 },
 cardHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 12,
 },
 icon: {
   marginLeft: 16,
 },
 cardHeaderText: {
   flex: 1,
   alignItems: 'flex-end',
 },
 title: {
   fontSize: 18,
   fontWeight: '600',
   color: '#1f2937',
   textAlign: 'right',
   marginBottom: 4,
 },
 statusChip: {
   alignSelf: 'flex-end',
 },
 statusText: {
   fontSize: 12,
   fontWeight: '600',
 },
 description: {
   fontSize: 16,
   color: '#4b5563',
   textAlign: 'right',
   marginBottom: 12,
   lineHeight: 22,
 },
 detailsRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 8,
 },
 detailItem: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 detailText: {
   fontSize: 12,
   color: '#666',
   marginLeft: 4,
 },
 addressContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 4,
 },
 addressText: {
   fontSize: 12,
   color: '#666',
   marginLeft: 4,
   flex: 1,
 },
 assignedContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 4,
 },
 assignedText: {
   fontSize: 12,
   color: '#4CAF50',
   marginLeft: 4,
   fontWeight: '600',
 },
 responsesContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 4,
 },
 responsesText: {
   fontSize: 12,
   color: '#2196F3',
   marginLeft: 4,
   fontWeight: '600',
 },
 ratingContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 4,
 },
 ratingText: {
   fontSize: 12,
   color: '#FFC107',
   marginLeft: 4,
   fontWeight: '600',
 },
 imagesIndicator: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 imagesText: {
   fontSize: 12,
   color: '#9C27B0',
   marginLeft: 4,
   fontWeight: '600',
 },
 loader: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },

 // Modal styles
 modalOverlay: {
   flex: 1,
   backgroundColor: 'rgba(0, 0, 0, 0.5)',
   justifyContent: 'flex-end',
 },
 modalContent: {
   backgroundColor: '#fff',
   borderTopLeftRadius: 20,
   borderTopRightRadius: 20,
   maxHeight: '90%',
   minHeight: '50%',
 },
 modalScroll: {
   padding: 20,
 },
 modalHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 16,
 },
 modalTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#1f2937',
 },
 divider: {
   marginBottom: 16,
 },
 modalSection: {
   marginBottom: 20,
 },
 sectionTitle: {
   fontSize: 16,
   fontWeight: 'bold',
   color: '#4f46e5',
   marginBottom: 8,
   textAlign: 'right',
 },
 modalText: {
   fontSize: 14,
   color: '#374151',
   marginBottom: 4,
   textAlign: 'right',
   lineHeight: 20,
 },
 label: {
   fontWeight: 'bold',
   color: '#1f2937',
 },
 responseItem: {
   backgroundColor: '#f9fafb',
   padding: 12,
   borderRadius: 8,
   marginBottom: 8,
 },
 responseHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 4,
 },
 responseType: {
   fontSize: 12,
   fontWeight: 'bold',
   color: '#4f46e5',
 },
 responseDate: {
   fontSize: 10,
   color: '#6b7280',
 },
 responseMessage: {
   fontSize: 14,
   color: '#374151',
   textAlign: 'right',
 },
 feedbackContainer: {
   backgroundColor: '#f9fafb',
   padding: 12,
   borderRadius: 8,
 },
 starsContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 8,
   justifyContent: 'flex-end',
 },
 ratingValue: {
   marginLeft: 8,
   fontSize: 14,
   color: '#374151',
   fontWeight: '600',
 },
 feedbackComment: {
   fontSize: 14,
   color: '#374151',
   textAlign: 'right',
   marginBottom: 4,
   fontStyle: 'italic',
 },
 feedbackDate: {
   fontSize: 10,
   color: '#6b7280',
   textAlign: 'right',
 },
 imagesContainer: {
   flexDirection: 'row',
 },
 complaintImage: {
   width: 100,
   height: 100,
   borderRadius: 8,
   marginLeft: 8,
 },
});

export default ViewComplaints;