// //EmployeeComplaints.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const EmployeeComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('unassigned'); // 'unassigned' or 'assigned'
//   const navigation = useNavigation();

//   useEffect(() => {
//     console.log('Tab changed to:', activeTab);
//     fetchComplaints();
//   }, [activeTab]);

//   // Add this new useEffect for component initialization
//   useEffect(() => {
//     console.log('Component mounted');
//     const checkAssignedComplaints = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userId = await AsyncStorage.getItem('userid');
        
//         if (!token || !userId) {
//           navigation.navigate('loginScreen');
//           return;
//         }

//         // Check if user has any assigned complaints
//         const response = await fetch('http://192.168.252.45:5000/api/employee-assigned-complaints', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Initial check - assigned complaints:', data.data?.length || 0);
          
//           // If user has assigned complaints and tab is unassigned, show message
//           if (data.data?.length > 0 && activeTab === 'unassigned') {
//             Alert.alert(
//               'Assigned Complaints',
//               'You have complaints assigned to you. Would you like to view them?',
//               [
//                 { text: 'No, show unassigned', onPress: () => console.log('Staying on unassigned') },
//                 { text: 'Yes, show my assignments', onPress: () => setActiveTab('assigned') }
//               ]
//             );
//           }
//         }
//       } catch (err) {
//         console.error('Error checking assigned complaints:', err);
//       }
//     };

//     checkAssignedComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userid');
      
//       if (!token || !userId) {
//         navigation.navigate('loginScreen');
//         return;
//       }

//       // Log for debugging
//       console.log('Fetching complaints for tab:', activeTab);
//       console.log('Current user ID:', userId);

//       // Always fetch all complaints in employee's categories
//       const response = await fetch('http://192.168.252.45:5000/api/employee-complaints', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch complaints');
//       }

//       const data = await response.json();
//       console.log('All complaints received:', data.data.length, 'complaints');
      
//       // Filter based on active tab
//       if (activeTab === 'unassigned') {
//         // Show complaints that are not assigned to anyone
//         const unassignedComplaints = data.data.filter(complaint => !complaint.assignedTo);
//         console.log('After filtering, unassigned complaints:', unassignedComplaints.length);
//         setComplaints(unassignedComplaints);
//       } else {
//         // Show complaints assigned to this employee
//         const myComplaints = data.data.filter(complaint => complaint.assignedTo === userId);
//         console.log('My assigned complaints:', myComplaints.length);
//         setComplaints(myComplaints);
//       }
//     } catch (err) {
//       console.error(`Error fetching ${activeTab} complaints:`, err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignToEmployee = async (complaintId) => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userid');
      
//       if (!token || !userId) {
//         navigation.navigate('loginScreen');
//         return;
//       }

//       console.log('Assigning complaint', complaintId, 'to employee', userId);

//       const response = await fetch(`http://192.168.252.45:5000/api/complaints/${complaintId}/assign`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           employeeId: userId
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Server error response:', errorData);
//         throw new Error(errorData.message || 'Failed to assign complaint');
//       }

//       const result = await response.json();
//       console.log('Assignment success response:', result);

//       // First fetch the updated lists - important to do this BEFORE switching tabs
//       await fetchComplaints(); 

//       Alert.alert('Success', 'You have been assigned to this complaint', [
//         { 
//           text: 'OK', 
//           onPress: () => {
//             // Switch to assigned tab after successful assignment
//             setActiveTab('assigned');
//             // Fetch again after tab change
//             setTimeout(() => fetchComplaints(), 300);
//           }
//         }
//       ]);
//     } catch (err) {
//       console.error('Error assigning complaint:', err);
//       Alert.alert('Error', err.message || 'An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateComplaintStatus = async (complaintId, newStatus) => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
      
//       if (!token) {
//         navigation.navigate('loginScreen');
//         return;
//       }

//       const response = await fetch(`http://192.168.252.45:5000/api/complaints/${complaintId}/process`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           status: newStatus
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update status');
//       }

//       fetchComplaints();
//       Alert.alert('Success', `Complaint status updated to ${newStatus}`);
//     } catch (err) {
//       console.error('Error updating status:', err);
//       Alert.alert('Error', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'open': return '#FF9800';
//       case 'in_progress': return '#2196F3';
//       case 'resolved': return '#4CAF50';
//       case 'closed': return '#9E9E9E';
//       default: return '#000000';
//     }
//   };

//   const renderUnassignedComplaintItem = ({ item }) => (
//     <View style={styles.complaintItem}>
//       <View style={styles.statusBar}>
//         <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
//           {item.status?.toUpperCase() || 'OPEN'}
//         </Text>
//         <TouchableOpacity 
//           style={styles.assignButton}
//           onPress={() => assignToEmployee(item._id)}
//         >
//           <Text style={styles.buttonText}>Assign to Me</Text>
//         </TouchableOpacity>
//       </View>
      
//       <TouchableOpacity 
//         onPress={() => navigation.navigate('ComplaintDetails', { complaint: item })}
//       >
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.category}>Category: {item.category}</Text>
//         <Text style={styles.address}>Address: {item.address}</Text>
//         <Text style={styles.description}>{item.description}</Text>
        
//         {item.images && item.images.length > 0 && (
//           <Image 
//             source={{ uri: item.images[0].data }} 
//             style={styles.image}
//             resizeMode="cover"
//           />
//         )}
//       </TouchableOpacity>
      
//       <Text style={styles.date}>
//         {new Date(item.createdAt).toLocaleDateString()}
//       </Text>
//     </View>
//   );

//   const renderAssignedComplaintItem = ({ item }) => (
//     <View style={styles.complaintItem}>
//       <View style={styles.statusBar}>
//         <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
//           {item.status?.toUpperCase() || 'OPEN'}
//         </Text>
//       </View>
      
//       <TouchableOpacity 
//         onPress={() => navigation.navigate('ComplaintDetails', { complaint: item })}
//       >
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.category}>Category: {item.category}</Text>
//         <Text style={styles.address}>Address: {item.address}</Text>
//         <Text style={styles.description}>{item.description}</Text>
        
//         {item.images && item.images.length > 0 && (
//           <Image 
//             source={{ uri: item.images[0].data }} 
//             style={styles.image}
//             resizeMode="cover"
//           />
//         )}
//       </TouchableOpacity>
      
//       <View style={styles.actionButtons}>
//         {item.status !== 'in_progress' && (
//           <TouchableOpacity 
//             style={[styles.statusButton, styles.inProgressButton]}
//             onPress={() => updateComplaintStatus(item._id, 'in_progress')}
//           >
//             <Text style={styles.buttonText}>Mark In Progress</Text>
//           </TouchableOpacity>
//         )}
        
//         {item.status !== 'resolved' && (
//           <TouchableOpacity 
//             style={[styles.statusButton, styles.resolvedButton]}
//             onPress={() => updateComplaintStatus(item._id, 'resolved')}
//           >
//             <Text style={styles.buttonText}>Mark Resolved</Text>
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity 
//           style={styles.replyButton}
//           onPress={() => navigation.navigate('AddResponse', { complaintId: item._id })}
//         >
//           <Text style={styles.buttonText}>Reply to Citizen</Text>
//         </TouchableOpacity>
//       </View>
      
//       <Text style={styles.date}>
//         {new Date(item.createdAt).toLocaleDateString()}
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.error}>Error: {error}</Text>
//         <TouchableOpacity onPress={fetchComplaints}>
//           <Text style={styles.retry}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Employee Complaints</Text>
      
//       <View style={styles.tabContainer}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'unassigned' && styles.activeTab]}
//           onPress={() => setActiveTab('unassigned')}
//         >
//           <Text style={[styles.tabText, activeTab === 'unassigned' && styles.activeTabText]}>
//             Unassigned
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
//           onPress={() => setActiveTab('assigned')}
//         >
//           <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>
//             Assigned to Me
//           </Text>
//         </TouchableOpacity>
//       </View>
      
//       {complaints.length === 0 ? (
//         <Text style={styles.noComplaints}>
//           No {activeTab === 'unassigned' ? 'unassigned' : 'assigned'} complaints available
//         </Text>
//       ) : (
//         <FlatList
//           data={complaints}
//           renderItem={activeTab === 'unassigned' ? renderUnassignedComplaintItem : renderAssignedComplaintItem}
//           keyExtractor={(item) => item._id}
//           refreshing={loading}
//           onRefresh={fetchComplaints}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f5f5f5'
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 15,
//     borderRadius: 8,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#ddd'
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     backgroundColor: '#f0f0f0',
//     alignItems: 'center'
//   },
//   activeTab: {
//     backgroundColor: '#2196F3'
//   },
//   tabText: {
//     fontWeight: 'bold',
//     color: '#555'
//   },
//   activeTabText: {
//     color: 'white'
//   },
//   complaintItem: {
//     backgroundColor: 'white',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   statusBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   statusText: {
//     fontWeight: 'bold',
//     fontSize: 14
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5
//   },
//   category: {
//     color: '#666',
//     marginBottom: 5
//   },
//   address: {
//     color: '#444',
//     marginBottom: 5
//   },
//   description: {
//     marginBottom: 10
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     borderRadius: 5,
//     marginBottom: 10
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginTop: 10,
//     marginBottom: 10
//   },
//   assignButton: {
//     backgroundColor: '#9C27B0',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 4
//   },
//   statusButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     flex: 1,
//     marginHorizontal: 2
//   },
//   inProgressButton: {
//     backgroundColor: '#2196F3'
//   },
//   resolvedButton: {
//     backgroundColor: '#4CAF50'
//   },
//   replyButton: {
//     backgroundColor: '#FF9800',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     flex: 1,
//     marginTop: 5
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 12
//   },
//   date: {
//     color: '#888',
//     fontSize: 12,
//     textAlign: 'right',
//     marginTop: 5
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10
//   },
//   retry: {
//     color: 'blue'
//   },
//   noComplaints: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#666'
//   }
// });

// export default EmployeeComplaints;








// /// hatha shaghal
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   Image,
//   ScrollView
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Base URL should match your server
// const BASE_URL = 'http://172.19.35.220:5000';

// const EmployeeComplaints = ({ navigation, route }) => {
//   // Get category from route params if available
//   const userCategory = route.params?.category;
  
//   // We'll get token and userId from AsyncStorage instead of context
//   const [userToken, setUserToken] = useState(null);
//   const [userId, setUserId] = useState(null);
  
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [complaints, setComplaints] = useState([]);
//   const [assignedComplaints, setAssignedComplaints] = useState([]);
//   const [activeTab, setActiveTab] = useState('category'); // 'category' or 'assigned'
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [responseText, setResponseText] = useState('');
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
  
//   // Status options for Hebrew display
//   const statusOptions = [
//     { value: 'open', label: 'ממתין לטיפול' },
//     { value: 'in_progress', label: 'בטיפול' },
//     { value: 'resolved', label: 'טופל' },
//     { value: 'closed', label: 'סגור' }
//   ];

//   useEffect(() => {
//     // Get auth token and user ID from AsyncStorage
//     const loadAuthData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userString = await AsyncStorage.getItem('user');
        
//         if (token && userString) {
//           const user = JSON.parse(userString);
//           setUserToken(token);
//           setUserId(user._id);
//           fetchComplaints(token);
//         } else {
//           Alert.alert('שגיאה', 'אנא התחבר מחדש למערכת');
//           navigation.navigate('loginScreen');
//         }
//       } catch (error) {
//         console.error('Error loading auth data:', error);
//         Alert.alert('שגיאה', 'בעיה בטעינת נתוני התחברות');
//       }
//     };
    
//     loadAuthData();
//   }, []);

//   const fetchComplaints = async (token = userToken) => {
//     setLoading(true);
//     try {
//       // Make sure we have a token
//       if (!token) {
//         console.error('No token available for request');
//         return;
//       }
      
//       // Fetch complaints that match employee's categories
//       const categoryResponse = await axios.get(`${BASE_URL}/api/employee-complaints`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       // Fetch complaints assigned to this employee
//       const assignedResponse = await axios.get(`${BASE_URL}/api/employee-assigned-complaints`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       console.log('Category Complaints:', categoryResponse.data);
//       console.log('Assigned Complaints:', assignedResponse.data);
      
//       if (categoryResponse.data.status === 'success') {
//         setComplaints(categoryResponse.data.data);
//       }
      
//       if (assignedResponse.data.status === 'success') {
//         setAssignedComplaints(assignedResponse.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching complaints:', error.response?.data || error.message);
//       Alert.alert('שגיאה', 'לא ניתן לטעון תלונות, אנא נסה שוב מאוחר יותר');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchComplaints();
//   };

//   const assignToMe = async (complaintId) => {
//     try {
//       const response = await axios.patch(
//         `${BASE_URL}/api/complaints/${complaintId}/assign`,
//         { employeeId: userId },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`
//           }
//         }
//       );
      
//       if (response.data.status === 'success') {
//         Alert.alert('הצלחה', 'התלונה שויכה אליך בהצלחה');
//         // Refresh the complaints list
//         fetchComplaints();
//       }
//     } catch (error) {
//       console.error('Error assigning complaint:', error);
//       Alert.alert('שגיאה', 'לא ניתן לשייך את התלונה, אנא נסה שוב');
//     }
//   };

//   const updateStatus = async (complaintId, status) => {
//     try {
//       const response = await axios.patch(
//         `${BASE_URL}/api/complaints/${complaintId}/process`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`
//           }
//         }
//       );
      
//       if (response.data.status === 'success') {
//         Alert.alert('הצלחה', `סטטוס התלונה עודכן ל${getStatusLabel(status)}`);
//         setStatusModalVisible(false);
//         // Refresh the complaints list
//         fetchComplaints();
//       }
//     } catch (error) {
//       console.error('Error updating status:', error.response?.data || error);
//       Alert.alert('שגיאה', 'לא ניתן לעדכן סטטוס, אנא נסה שוב');
//     }
//   };

//   const addResponse = async () => {
//     if (!responseText.trim()) {
//       Alert.alert('שגיאה', 'אנא הזן תגובה');
//       return;
//     }
    
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/complaints/${selectedComplaint._id}/respond`,
//         {
//           message: responseText,
//           fromEmployee: true
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`
//           }
//         }
//       );
      
//       if (response.data.status === 'success') {
//         Alert.alert('הצלחה', 'התגובה נוספה בהצלחה');
//         setResponseText('');
//         setModalVisible(false);
//         // Refresh the complaints
//         fetchComplaints();
//       }
//     } catch (error) {
//       console.error('Error adding response:', error);
//       Alert.alert('שגיאה', 'לא ניתן להוסיף תגובה, אנא נסה שוב');
//     }
//   };

//   const openDetailModal = (complaint) => {
//     setSelectedComplaint(complaint);
//     setModalVisible(true);
//   };

//   const openStatusModal = (complaint) => {
//     setSelectedComplaint(complaint);
//     setStatusModalVisible(true);
//   };

//   const getStatusLabel = (status) => {
//     const option = statusOptions.find(opt => opt.value === status);
//     return option ? option.label : status;
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'open':
//         return '#ff9800';
//       case 'in_progress':
//         return '#2196F3';
//       case 'resolved':
//         return '#4CAF50';
//       case 'closed':
//         return '#9E9E9E';
//       default:
//         return '#757575';
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Intl.DateTimeFormat('he-IL', options).format(date);
//   };

//   const renderComplaintItem = ({ item }) => {
//     const isAssigned = item.assignedTo === userId;
//     const isAssignedToSomeone = !!item.assignedTo;
    
//     return (
//       <TouchableOpacity
//         style={styles.complaintItem}
//         onPress={() => openDetailModal(item)}
//       >
//         <View style={styles.complaintHeader}>
//           <Text style={styles.complaintTitle}>{item.title}</Text>
//           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//             <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
//           </View>
//         </View>
        
//         <Text style={styles.categoryText}>קטגוריה: {item.category}</Text>
//         <Text style={styles.dateText}>נוצר ב: {formatDate(item.createdAt)}</Text>
        
//         <Text style={styles.description} numberOfLines={2}>
//           {item.description}
//         </Text>
        
//         <View style={styles.actionButtons}>
//           {!isAssignedToSomeone && (
//             <TouchableOpacity
//               style={styles.assignButton}
//               onPress={() => assignToMe(item._id)}
//             >
//               <Text style={styles.buttonIcon}>✓</Text>
//               <Text style={styles.buttonText}>שייך אלי</Text>
//             </TouchableOpacity>
//           )}
          
//           {isAssigned && (
//             <>
//               <TouchableOpacity
//                 style={styles.responseButton}
//                 onPress={() => openDetailModal(item)}
//               >
//                 <Text style={styles.buttonIcon}>💬</Text>
//                 <Text style={styles.buttonText}>הגב</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.statusButton}
//                 onPress={() => openStatusModal(item)}
//               >
//                 <Text style={styles.buttonIcon}>⟳</Text>
//                 <Text style={styles.buttonText}>עדכן סטטוס</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyList = () => (
//     <View style={styles.emptyContainer}>
//       <Text style={styles.emptyIcon}>📥</Text>
//       <Text style={styles.emptyText}>אין תלונות זמינות</Text>
//     </View>
//   );

//   // Function to render complaint images
//   const renderImages = (images) => {
//     if (!images || !images.length) return null;
    
//     return (
//       <ScrollView horizontal style={styles.imageScroll}>
//         {images.map((img, index) => (
//           <Image
//             key={index}
//             source={{ uri: img.data }}
//             style={styles.complaintImage}
//             resizeMode="cover"
//           />
//         ))}
//       </ScrollView>
//     );
//   };

//   // Function to render complaint responses
//   const renderResponses = (responses) => {
//     if (!responses || !responses.length) {
//       return (
//         <View style={styles.noResponseContainer}>
//           <Text style={styles.noResponseText}>אין תגובות עדיין</Text>
//         </View>
//       );
//     }

//     return (
//       <FlatList
//         data={responses}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={[
//             styles.responseItem,
//             item.fromEmployee ? styles.employeeResponse : styles.citizenResponse
//           ]}>
//             <Text style={styles.responseHeader}>
//               {item.fromEmployee ? 'עובד' : 'תושב'} | {formatDate(item.createdAt)}
//             </Text>
//             <Text style={styles.responseMessage}>{item.message}</Text>
//           </View>
//         )}
//       />
//     );
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text style={styles.loadingText}>טוען תלונות...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Tab navigation */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'category' && styles.activeTab]}
//           onPress={() => setActiveTab('category')}
//         >
//           <Text style={styles.tabText}>תלונות לפי קטגוריה</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
//           onPress={() => setActiveTab('assigned')}
//         >
//           <Text style={styles.tabText}>תלונות משויכות אלי</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Complaints list */}
//       <FlatList
//         data={activeTab === 'category' ? complaints : assignedComplaints}
//         renderItem={renderComplaintItem}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={renderEmptyList}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       />

//       {/* Complaint detail modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>✕</Text>
//             </TouchableOpacity>

//             {selectedComplaint && (
//               <ScrollView style={styles.modalContent}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalTitle}>{selectedComplaint.title}</Text>
//                   <View style={[
//                     styles.statusBadge, 
//                     { backgroundColor: getStatusColor(selectedComplaint.status) }
//                   ]}>
//                     <Text style={styles.statusText}>
//                       {getStatusLabel(selectedComplaint.status)}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text style={styles.modalCategory}>קטגוריה: {selectedComplaint.category}</Text>
//                 <Text style={styles.modalDate}>נוצר ב: {formatDate(selectedComplaint.createdAt)}</Text>
//                 <Text style={styles.modalAddress}>כתובת: {selectedComplaint.address}</Text>

//                 <Text style={styles.sectionTitle}>תיאור התלונה:</Text>
//                 <Text style={styles.modalDescription}>{selectedComplaint.description}</Text>

//                 {selectedComplaint.images && selectedComplaint.images.length > 0 && (
//                   <>
//                     <Text style={styles.sectionTitle}>תמונות:</Text>
//                     {renderImages(selectedComplaint.images)}
//                   </>
//                 )}

//                 <Text style={styles.sectionTitle}>תגובות:</Text>
//                 {renderResponses(selectedComplaint.responses)}

//                 {/* Only show response form if complaint is assigned to current employee */}
//                 {selectedComplaint.assignedTo === userId && (
//                   <View style={styles.responseForm}>
//                     <Text style={styles.sectionTitle}>הוסף תגובה:</Text>
//                     <TextInput
//                       style={styles.responseInput}
//                       placeholder="כתוב תגובה..."
//                       multiline
//                       value={responseText}
//                       onChangeText={setResponseText}
//                     />
//                     <TouchableOpacity
//                       style={styles.submitButton}
//                       onPress={addResponse}
//                     >
//                       <Text style={styles.buttonText}>שלח תגובה</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Status update modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={statusModalVisible}
//         onRequestClose={() => setStatusModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.statusModalView}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setStatusModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>✕</Text>
//             </TouchableOpacity>
            
//             <Text style={styles.statusModalTitle}>עדכון סטטוס תלונה</Text>
            
//             {selectedComplaint && (
//               <>
//                 <Text style={styles.statusModalText}>
//                   עדכון סטטוס עבור: {selectedComplaint.title}
//                 </Text>
//                 <Text style={styles.statusModalText}>
//                   סטטוס נוכחי: {getStatusLabel(selectedComplaint.status)}
//                 </Text>
                
//                 <View style={styles.statusOptionsContainer}>
//                   {statusOptions.map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       style={[
//                         styles.statusOption,
//                         { backgroundColor: getStatusColor(option.value) },
//                         selectedComplaint.status === option.value && styles.disabledOption
//                       ]}
//                       onPress={() => updateStatus(selectedComplaint._id, option.value)}
//                       disabled={selectedComplaint.status === option.value}
//                     >
//                       <Text style={styles.statusOptionText}>{option.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </>
//             )}
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
//     direction: 'rtl'
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555'
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     backgroundColor: '#fff'
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 15,
//     alignItems: 'center'
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#2196F3'
//   },
//   tabText: {
//     fontWeight: 'bold',
//     color: '#555'
//   },
//   listContent: {
//     padding: 10
//   },
//   complaintItem: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41
//   },
//   complaintHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   complaintTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     flex: 1
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//     marginLeft: 10
//   },
//   statusText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold'
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 4
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#777',
//     marginBottom: 8
//   },
//   description: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 12
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end'
//   },
//   assignButton: {
//     flexDirection: 'row',
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginLeft: 8
//   },
//   responseButton: {
//     flexDirection: 'row',
//     backgroundColor: '#2196F3',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginLeft: 8
//   },
//   statusButton: {
//     flexDirection: 'row',
//     backgroundColor: '#FF9800',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     alignItems: 'center'
//   },
//   buttonIcon: {
//     color: 'white',
//     fontSize: 16,
//     marginRight: 4
//   },
//   buttonText: {
//     color: 'white',
//     marginLeft: 4,
//     fontWeight: 'bold'
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20
//   },
//   emptyIcon: {
//     fontSize: 40,
//     color: '#9E9E9E',
//     marginBottom: 10
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#9E9E9E',
//     marginTop: 10
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)'
//   },
//   closeButton: {
//     alignSelf: 'flex-start',
//     padding: 8,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   modalView: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   statusModalView: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   modalContent: {
//     flex: 1
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1
//   },
//   modalCategory: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5
//   },
//   modalDate: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5
//   },
//   modalAddress: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 10
//   },
//   modalDescription: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#333'
//   },
//   imageScroll: {
//     flexDirection: 'row',
//     marginVertical: 10
//   },
//   complaintImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 8,
//     marginRight: 10
//   },
//   responseItem: {
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10
//   },
//   employeeResponse: {
//     backgroundColor: '#E1F5FE',
//     borderRightWidth: 4,
//     borderRightColor: '#2196F3'
//   },
//   citizenResponse: {
//     backgroundColor: '#F1F8E9',
//     borderRightWidth: 4,
//     borderRightColor: '#4CAF50'
//   },
//   responseHeader: {
//     fontSize: 12,
//     color: '#757575',
//     marginBottom: 5
//   },
//   responseMessage: {
//     fontSize: 14,
//     color: '#333'
//   },
//   noResponseContainer: {
//     padding: 20,
//     alignItems: 'center'
//   },
//   noResponseText: {
//     color: '#9E9E9E',
//     fontSize: 14
//   },
//   responseForm: {
//     marginTop: 20,
//     marginBottom: 20
//   },
//   responseInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     minHeight: 100,
//     textAlign: 'right',
//     textAlignVertical: 'top'
//   },
//   submitButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginTop: 10
//   },
//   statusModalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 15,
//     textAlign: 'center'
//   },
//   statusModalText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   statusOptionsContainer: {
//     marginTop: 20
//   },
//   statusOption: {
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     alignItems: 'center'
//   },
//   statusOptionText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   disabledOption: {
//     opacity: 0.5
//   }
// });

// export default EmployeeComplaints;






































// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   Image,
//   ScrollView
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Base URL should match your server
// const BASE_URL = 'http://172.19.35.220:5000';

// const EmployeeComplaints = ({ navigation, route }) => {
//   // Get category from route params if available
//   const userCategory = route.params?.category;
  
//   // We'll get token and userId from AsyncStorage instead of context
//   const [userToken, setUserToken] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [userIdNumber, setUserIdNumber] = useState(null); // תעודת זהות
  
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [allComplaints, setAllComplaints] = useState([]);
//   const [unassignedComplaints, setUnassignedComplaints] = useState([]);
//   const [assignedComplaints, setAssignedComplaints] = useState([]);
//   const [activeTab, setActiveTab] = useState('category'); // 'category' or 'assigned'
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [responseText, setResponseText] = useState('');
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
  
//   // Status options for Hebrew display
//   const statusOptions = [
//     { value: 'open', label: 'ממתין לטיפול' },
//     { value: 'in_progress', label: 'בטיפול' },
//     { value: 'resolved', label: 'טופל' },
//     { value: 'closed', label: 'סגור' }
//   ];

//   useEffect(() => {
//     // Get auth token and user ID from AsyncStorage
//     const loadAuthData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userString = await AsyncStorage.getItem('user');
        
//         if (token && userString) {
//           const user = JSON.parse(userString);
//           setUserToken(token);
//           setUserId(user._id); // מזהה MongoDB
//           setUserIdNumber(user.idNumber); // תעודת זהות אם קיימת
//           console.log("User data loaded:", { id: user._id, idNumber: user.idNumber || 'N/A' });
          
//           // נשתמש בתעודת זהות אם קיימת, אחרת ב-ID רגיל
//           const effectiveId = user.idNumber || user._id;
//           fetchComplaints(token, effectiveId);
//         } else {
//           Alert.alert('שגיאה', 'אנא התחבר מחדש למערכת');
//           navigation.navigate('loginScreen');
//         }
//       } catch (error) {
//         console.error('Error loading auth data:', error);
//         Alert.alert('שגיאה', 'בעיה בטעינת נתוני התחברות');
//       }
//     };
    
//     loadAuthData();
//   }, []);

//   const fetchComplaints = async (token = userToken, effectiveId = userIdNumber || userId) => {
//     setLoading(true);
//     try {
//       // Make sure we have a token
//       if (!token) {
//         console.error('No token available for request');
//         return;
//       }
      
//       console.log("Fetching with effective ID:", effectiveId);
      
//       // Fetch all complaints that match employee's categories
//       const categoryResponse = await axios.get(`${BASE_URL}/api/employee-complaints`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       // Process the data from the response
//       if (categoryResponse.data.status === 'success') {
//         const allCategoryComplaints = categoryResponse.data.data || [];
        
//         // Save all the complaints
//         setAllComplaints(allCategoryComplaints);
        
//         // Process complaints by assignment status
//         // Filter for unassigned complaints
//         const unassigned = allCategoryComplaints.filter(complaint => !complaint.assignedTo);
//         setUnassignedComplaints(unassigned);
        
//         // Filter for complaints assigned to this employee by teudat zehut (ID number)
//         // NOTE: we're comparing both string and number forms to be safe
//         const assigned = allCategoryComplaints.filter(complaint => {
//           const assignedId = complaint.assignedTo;
//           return assignedId === effectiveId || 
//                  assignedId === String(effectiveId) || 
//                  assignedId === Number(effectiveId);
//         });
//         setAssignedComplaints(assigned);
        
//         console.log(`Found ${unassigned.length} unassigned complaints`);
//         console.log(`Found ${assigned.length} assigned complaints for user with ID ${effectiveId}`);
        
//         // Log all assignedTo values to help debug
//         console.log("All assignedTo values:", allCategoryComplaints.map(c => 
//           ({ id: c._id, title: c.title, assignedTo: c.assignedTo, 
//              match: c.assignedTo === effectiveId })
//         ));
//       }
//     } catch (error) {
//       console.error('Error fetching complaints:', error.response?.data || error.message);
//       Alert.alert('שגיאה', 'לא ניתן לטעון תלונות, אנא נסה שוב מאוחר יותר');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchComplaints();
//   };

//   const assignToMe = async (complaintId) => {
//     try {
//       // משתמשים בתעודת זהות אם קיימת, אחרת ב-ID רגיל
//       const effectiveId = userIdNumber || userId;
//       console.log(`Assigning complaint ${complaintId} to user with ID ${effectiveId}`);
      
//       const response = await axios.patch(
//         `${BASE_URL}/api/complaints/${complaintId}/assign`,
//         { employeeId: effectiveId },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`
//           }
//         }
//       );
      
//       if (response.data.status === 'success') {
//         Alert.alert('הצלחה', 'התלונה שויכה אליך בהצלחה');
//         // Refresh the complaints list
//         fetchComplaints();
//       }
//     } catch (error) {
//       console.error('Error assigning complaint:', error);
//       Alert.alert('שגיאה', 'לא ניתן לשייך את התלונה, אנא נסה שוב');
//     }
//   };

//   const updateStatus = async (complaintId, status) => {
//     try {
//       console.log(`Updating complaint ${complaintId} status to ${status}`);
      
//       const response = await axios.patch(
//         `${BASE_URL}/api/complaints/${complaintId}/process`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       if (response.data.status === 'success') {
//         Alert.alert('הצלחה', `סטטוס התלונה עודכן ל${getStatusLabel(status)}`);
//         setStatusModalVisible(false);
//         // Refresh the complaints list
//         fetchComplaints();
//       } else {
//         // Handle non-success response
//         Alert.alert('שגיאה', response.data.message || 'אירעה שגיאה בעדכון הסטטוס');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error.response?.data || error.message);
//       const errorMessage = error.response?.data?.message || 'לא ניתן לעדכן סטטוס, אנא נסה שוב';
//       Alert.alert('שגיאה', errorMessage);
//     }
//   };
  
//   // const addResponse = async () => {
//   //   if (!responseText.trim()) {
//   //     Alert.alert('שגיאה', 'אנא הזן תגובה');
//   //     return;
//   //   }
    
//   //   try {
//   //     const response = await axios.post(
//   //       `${BASE_URL}/api/complaints/${selectedComplaint._id}/respond`,
//   //       {
//   //         message: responseText,
//   //         fromEmployee: true
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${userToken}`
//   //         }
//   //       }
//   //     );
      
//   //     if (response.data.status === 'success') {
//   //       Alert.alert('הצלחה', 'התגובה נוספה בהצלחה');
//   //       setResponseText('');
//   //       setModalVisible(false);
//   //       // Refresh the complaints
//   //       fetchComplaints();
//   //     }
//   //   } catch (error) {
//   //     console.error('Error adding response:', error);
//   //     Alert.alert('שגיאה', 'לא ניתן להוסיף תגובה, אנא נסה שוב');
//   //   }
//   // };
// // Replace the existing addResponse function with this improved version
// const addResponse = async () => {
//   if (!responseText.trim()) {
//     Alert.alert('שגיאה', 'אנא הזן תגובה');
//     return;
//   }
  
//   try {
//     console.log(`Adding response to complaint ${selectedComplaint?._id}`);
    
//     const response = await axios.post(
//       `${BASE_URL}/api/complaints/${selectedComplaint._id}/respond`,
//       {
//         message: responseText,
//         fromEmployee: true  // חשוב לציין שזו תגובה מעובד
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     if (response.data.status === 'success') {
//       Alert.alert('הצלחה', 'התגובה נוספה בהצלחה');
//       setResponseText('');
//       setModalVisible(false);
//       // רענון רשימת התלונות
//       fetchComplaints();
//     } else {
//       Alert.alert('שגיאה', response.data.message || 'אירעה שגיאה בהוספת התגובה');
//     }
//   } catch (error) {
//     console.error('Error adding response:', error);
    
//     // הוספת לוגים מפורטים יותר לדיבאג
//     if (error.response) {
//       // השרת השיב עם קוד סטטוס שאינו בטווח 2xx
//       console.error('Response data:', error.response.data);
//       console.error('Response status:', error.response.status);
//       console.error('Response headers:', error.response.headers);
      
//       const errorMessage = error.response.data?.message || 'לא ניתן להוסיף תגובה, אנא נסה שוב';
//       Alert.alert('שגיאה', errorMessage);
//     } else if (error.request) {
//       // הבקשה נשלחה אך לא התקבלה תשובה
//       console.error('No response received:', error.request);
//       Alert.alert('שגיאה', 'לא התקבלה תשובה מהשרת, אנא בדוק את החיבור לאינטרנט');
//     } else {
//       // אירעה שגיאה בהגדרת הבקשה
//       console.error('Error message:', error.message);
//       Alert.alert('שגיאה', 'אירעה שגיאה בעת שליחת התגובה');
//     }
//   }
// };



//   const openDetailModal = (complaint) => {
//     setSelectedComplaint(complaint);
//     setModalVisible(true);
//   };

//   const openStatusModal = (complaint) => {
//     setSelectedComplaint(complaint);
//     setStatusModalVisible(true);
//   };

//   const getStatusLabel = (status) => {
//     const option = statusOptions.find(opt => opt.value === status);
//     return option ? option.label : status;
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'open':
//         return '#FF9800'; // Orange
//       case 'in_progress':
//         return '#2196F3'; // Blue
//       case 'resolved':
//         return '#4CAF50'; // Green
//       case 'closed':
//         return '#9E9E9E'; // Gray
//       default:
//         return '#757575';
//     }
//   };

//   const getStatusBadgeStyle = (status) => {
//     // Based on your UI images, this matches the badges shown
//     if (status === 'in_progress') {
//       return styles.inProgressBadge;
//     }
//     return styles.waitingBadge;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     const hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, '0');
    
//     // Format: "נוצר ב: 3 במאי' 2025, 17:44"
//     const months = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
//     return `נוצר ב: ${day} ב${months[month-1]}' ${year}, ${hours}:${minutes}`;
//   };

//   const isMyComplaint = (complaint) => {
//     // משתמשים בתעודת זהות אם קיימת, אחרת ב-ID רגיל
//     const effectiveId = userIdNumber || userId;
//     const assignedId = complaint.assignedTo;
  
//     return assignedId === effectiveId || 
//            assignedId === String(effectiveId) || 
//            assignedId === Number(effectiveId);
//   };

//   const renderComplaintItem = ({ item }) => {
//     const isAssigned = isMyComplaint(item);
//     const isAssignedToSomeone = !!item.assignedTo;
//     const badgeColor = item.status === 'in_progress' ? styles.inProgressBadge : styles.waitingBadge;
//     const badgeTextStyle = item.status === 'in_progress' ? styles.inProgressText : styles.waitingText;
    
//     return (
//       <TouchableOpacity
//         style={styles.complaintItem}
//         onPress={() => openDetailModal(item)}
//       >
//         <View style={styles.complaintHeader}>
//           <Text style={styles.complaintTitle}>{item.title}</Text>
//           {item.status !== 'open' && (
//             <View style={[styles.statusBadge, badgeColor]}>
//               <Text style={[styles.statusText, badgeTextStyle]}>{getStatusLabel(item.status)}</Text>
//             </View>
//           )}
//           {item.status === 'open' && (
//             <View style={[styles.statusBadge, styles.waitingBadge]}>
//               <Text style={[styles.statusText, styles.waitingText]}>ממתין לטיפול</Text>
//             </View>
//           )}
//         </View>
        
//         <Text style={styles.categoryText}>קטגוריה: {item.category}</Text>
//         <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        
//         <Text style={styles.description} numberOfLines={2}>
//           {item.description}
//         </Text>
        
//         <View style={styles.actionButtons}>
//           {/* Only show assign button for unassigned complaints in the category tab */}
//           {!isAssignedToSomeone && activeTab === 'category' && (
//             <TouchableOpacity
//               style={styles.assignButton}
//               onPress={() => assignToMe(item._id)}
//             >
//               <Text style={styles.buttonText}>שייך אלי</Text>
//             </TouchableOpacity>
//           )}
          
//           {/* Only show these buttons for complaints assigned to the current employee */}
//           {isAssigned && (
//             <>
//               <TouchableOpacity
//                 style={styles.responseButton}
//                 onPress={() => openDetailModal(item)}
//               >
//                 <Text style={styles.buttonText}>הגב</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.statusButton}
//                 onPress={() => openStatusModal(item)}
//               >
//                 <Text style={styles.buttonText}>עדכן סטטוס</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyList = () => (
//     <View style={styles.emptyContainer}>
//       <Text style={styles.emptyIcon}>📥</Text>
//       <Text style={styles.emptyText}>אין תלונות זמינות</Text>
//     </View>
//   );

//   // Function to render complaint images
//   const renderImages = (images) => {
//     if (!images || !images.length) return null;
    
//     return (
//       <ScrollView horizontal style={styles.imageScroll}>
//         {images.map((img, index) => (
//           <Image
//             key={index}
//             source={{ uri: img.data }}
//             style={styles.complaintImage}
//             resizeMode="cover"
//           />
//         ))}
//       </ScrollView>
//     );
//   };

//   // Function to render complaint responses
//   // Replace the existing renderResponses function with this
// const renderResponses = (responses) => {
//   if (!responses || !responses.length) {
//     return (
//       <View style={styles.noResponseContainer}>
//         <Text style={styles.noResponseText}>אין תגובות עדיין</Text>
//       </View>
//     );
//   }

//   // במקום להשתמש ב-FlatList, נשתמש בלולאה פשוטה כדי להציג את התגובות
//   return (
//     <View>
//       {responses.map((item, index) => (
//         <View 
//           key={index}
//           style={[
//             styles.responseItem,
//             item.fromEmployee ? styles.employeeResponse : styles.citizenResponse
//           ]}
//         >
//           <Text style={styles.responseHeader}>
//             {item.fromEmployee ? 'עובד' : 'תושב'} | {formatDate(item.createdAt)}
//           </Text>
//           <Text style={styles.responseMessage}>{item.message}</Text>
//         </View>
//       ))}
//     </View>
//   );
// };

//   // Determine which complaints to show based on active tab
//   const getDisplayedComplaints = () => {
//     if (activeTab === 'category') {
//       // Show only unassigned complaints in the category tab
//       return unassignedComplaints;
//     } else {
//       // Show only complaints assigned to this employee in the assigned tab
//       return assignedComplaints;
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text style={styles.loadingText}>טוען תלונות...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Tab navigation */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
//           onPress={() => setActiveTab('assigned')}
//         >
//           <Text style={styles.tabText}>תלונות משויכות אלי</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'category' && styles.activeTab]}
//           onPress={() => setActiveTab('category')}
//         >
//           <Text style={styles.tabText}>תלונות לפי קטגוריה</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Complaints list */}
//       <FlatList
//         data={getDisplayedComplaints()}
//         renderItem={renderComplaintItem}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={renderEmptyList}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       />

//       {/* Complaint detail modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>✕</Text>
//             </TouchableOpacity>

//             {selectedComplaint && (
//               <ScrollView style={styles.modalContent}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalTitle}>{selectedComplaint.title}</Text>
//                   <View style={[
//                     styles.statusBadge, 
//                     getStatusBadgeStyle(selectedComplaint.status)
//                   ]}>
//                     <Text style={[
//                       styles.statusText,
//                       selectedComplaint.status === 'in_progress' ? styles.inProgressText : styles.waitingText
//                     ]}>
//                       {getStatusLabel(selectedComplaint.status)}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text style={styles.modalCategory}>קטגוריה: {selectedComplaint.category}</Text>
//                 <Text style={styles.modalDate}>{formatDate(selectedComplaint.createdAt)}</Text>
//                 <Text style={styles.modalAddress}>כתובת: {selectedComplaint.address}</Text>

//                 <Text style={styles.sectionTitle}>תיאור התלונה:</Text>
//                 <Text style={styles.modalDescription}>{selectedComplaint.description}</Text>

//                 {selectedComplaint.images && selectedComplaint.images.length > 0 && (
//                   <>
//                     <Text style={styles.sectionTitle}>תמונות:</Text>
//                     {renderImages(selectedComplaint.images)}
//                   </>
//                 )}

//                 <Text style={styles.sectionTitle}>תגובות:</Text>
//                 {renderResponses(selectedComplaint.responses)}

//                 {/* Only show response form if complaint is assigned to current employee */}
//                 {isMyComplaint(selectedComplaint) && (
//                   <View style={styles.responseForm}>
//                     <Text style={styles.sectionTitle}>הוסף תגובה:</Text>
//                     <TextInput
//                       style={styles.responseInput}
//                       placeholder="כתוב תגובה..."
//                       multiline
//                       value={responseText}
//                       onChangeText={setResponseText}
//                     />
//                     <TouchableOpacity
//                       style={styles.submitButton}
//                       onPress={addResponse}
//                     >
//                       <Text style={styles.buttonText}>שלח תגובה</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Status update modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={statusModalVisible}
//         onRequestClose={() => setStatusModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.statusModalView}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setStatusModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>✕</Text>
//             </TouchableOpacity>
            
//             <Text style={styles.statusModalTitle}>עדכון סטטוס תלונה</Text>
            
//             {selectedComplaint && (
//               <>
//                 <Text style={styles.statusModalText}>
//                   עדכון סטטוס עבור: {selectedComplaint.title}
//                 </Text>
//                 <Text style={styles.statusModalText}>
//                   סטטוס נוכחי: {getStatusLabel(selectedComplaint.status)}
//                 </Text>
                
//                 <View style={styles.statusOptionsContainer}>
//                   {statusOptions.map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       style={[
//                         styles.statusOption,
//                         { backgroundColor: getStatusColor(option.value) },
//                         selectedComplaint.status === option.value && styles.disabledOption
//                       ]}
//                       onPress={() => updateStatus(selectedComplaint._id, option.value)}
//                       disabled={selectedComplaint.status === option.value}
//                     >
//                       <Text style={styles.statusOptionText}>{option.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </>
//             )}
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
//     direction: 'rtl'
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555'
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     backgroundColor: '#fff'
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 15,
//     alignItems: 'center'
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#2196F3'
//   },
//   tabText: {
//     fontWeight: 'bold',
//     color: '#555'
//   },
//   listContent: {
//     padding: 10
//   },
//   complaintItem: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41
//   },
//   complaintHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   complaintTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     flex: 1
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//     marginLeft: 10
//   },
//   waitingBadge: {
//     backgroundColor: '#FF9800',
//   },
//   waitingText: {
//     color: 'white',
//   },
//   inProgressBadge: {
//     backgroundColor: '#2196F3',
//   },
//   inProgressText: {
//     color: 'white',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold'
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 4
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#777',
//     marginBottom: 8
//   },
//   description: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 12
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end'
//   },
//   assignButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginLeft: 8
//   },
//   responseButton: {
//     backgroundColor: '#2196F3',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginLeft: 8
//   },
//   statusButton: {
//     backgroundColor: '#FF9800',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20
//   },
//   emptyIcon: {
//     fontSize: 40,
//     color: '#9E9E9E',
//     marginBottom: 10
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#9E9E9E',
//     marginTop: 10
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)'
//   },
//   closeButton: {
//     alignSelf: 'flex-start',
//     padding: 8,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   modalView: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   statusModalView: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   modalContent: {
//     flex: 1
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1
//   },
//   modalCategory: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5
//   },
//   modalDate: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5
//   },
//   modalAddress: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 15
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 10
//   },
//   modalDescription: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#333'
//   },
//   imageScroll: {
//     flexDirection: 'row',
//     marginVertical: 10
//   },
//   complaintImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 8,
//     marginRight: 10
//   },
//   responseItem: {
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10
//   },
//   employeeResponse: {
//     backgroundColor: '#E1F5FE',
//     borderRightWidth: 4,
//     borderRightColor: '#2196F3'
//   },
//   citizenResponse: {
//     backgroundColor: '#F1F8E9',
//     borderRightWidth: 4,
//     borderRightColor: '#4CAF50'
//   },
//   responseHeader: {
//     fontSize: 12,
//     color: '#757575',
//     marginBottom: 5
//   },
//   responseMessage: {
//     fontSize: 14,
//     color: '#333'
//   },
//   noResponseContainer: {
//     padding: 20,
//     alignItems: 'center'
//   },
//   noResponseText: {
//     color: '#9E9E9E',
//     fontSize: 14
//   },
//   responseForm: {
//     marginTop: 20,
//     marginBottom: 20
//   },
//   responseInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     minHeight: 100,
//     textAlign: 'right',
//     textAlignVertical: 'top'
//   },
//   submitButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginTop: 10
//   },
//   statusModalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 15,
//     textAlign: 'center'
//   },
//   statusModalText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   statusOptionsContainer: {
//     marginTop: 20
//   },
//   statusOption: {
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     alignItems: 'center'
//   },
//   statusOptionText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   disabledOption: {
//     opacity: 0.5
//   }
// });

// export default EmployeeComplaints;

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native';
import {
  Surface,
  Text,
  Card,
  Title,
  Button,
  Avatar,
  IconButton,
  ActivityIndicator,
  Chip,
  Divider,
  Badge,
  useTheme,
  Provider as PaperProvider,
  Portal,
  Dialog,
  Paragraph
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL should match your server
const BASE_URL = 'http://192.168.1.4:5000';
const { width } = Dimensions.get('window');

const EmployeeComplaints = ({ navigation, route }) => {
  // Define a default theme - esto asegura que tenemos un tema incluso si no hay un Provider
  const theme = useTheme() || {
    colors: {
      primary: '#4f46e5',
      accent: '#2196F3',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#333333',
      error: '#B00020',
    }
  };
  // Get category from route params if available
  const userCategory = route.params?.category;
  
  // We'll get token and userId from AsyncStorage instead of context
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userIdNumber, setUserIdNumber] = useState(null); // תעודת זהות
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allComplaints, setAllComplaints] = useState([]);
  const [unassignedComplaints, setUnassignedComplaints] = useState([]);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('category'); // 'category' or 'assigned'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  
  // Status options for Hebrew display
  const statusOptions = [
    { value: 'open', label: 'ממתין לטיפול', color: '#FF9800' },
    { value: 'in_progress', label: 'בטיפול', color: '#2196F3' },
    { value: 'resolved', label: 'טופל', color: '#4CAF50' },
    { value: 'closed', label: 'סגור', color: '#9E9E9E' }
  ];

  useEffect(() => {
    // Get auth token and user ID from AsyncStorage
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');
        
        if (token && userString) {
          const user = JSON.parse(userString);
          setUserToken(token);
          setUserId(user._id); // מזהה MongoDB
          setUserIdNumber(user.idNumber); // תעודת זהות אם קיימת
          console.log("User data loaded:", { id: user._id, idNumber: user.idNumber || 'N/A' });
          
          // נשתמש בתעודת זהות אם קיימת, אחרת ב-ID רגיל
          const effectiveId = user.idNumber || user._id;
          fetchComplaints(token, effectiveId);
        } else {
          Alert.alert('שגיאה', 'אנא התחבר מחדש למערכת');
          navigation.navigate('loginScreen');
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        Alert.alert('שגיאה', 'בעיה בטעינת נתוני התחברות');
      }
    };
    
    loadAuthData();
  }, []);

  // חזרה מדף התגובה - נרענן את התלונות
  useEffect(() => {
    if (route.params?.refresh) {
      fetchComplaints();
    }
  }, [route.params?.refresh]);

  const fetchComplaints = async (token = userToken, effectiveId = userIdNumber || userId) => {
    setLoading(true);
    try {
      // Make sure we have a token
      if (!token) {
        console.error('No token available for request');
        return;
      }
      
      console.log("Fetching with effective ID:", effectiveId);
      
      // Fetch all complaints that match employee's categories
      const categoryResponse = await axios.get(`${BASE_URL}/api/employee-complaints`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Process the data from the response
      if (categoryResponse.data.status === 'success') {
        const allCategoryComplaints = categoryResponse.data.data || [];
        
        // Save all the complaints
        setAllComplaints(allCategoryComplaints);
        
        // Process complaints by assignment status
        // Filter for unassigned complaints
        const unassigned = allCategoryComplaints.filter(complaint => !complaint.assignedTo);
        setUnassignedComplaints(unassigned);
        
        // Filter for complaints assigned to this employee by teudat zehut (ID number)
        // NOTE: we're comparing both string and number forms to be safe
        const assigned = allCategoryComplaints.filter(complaint => {
          const assignedId = complaint.assignedTo;
          return assignedId === effectiveId || 
                 assignedId === String(effectiveId) || 
                 assignedId === Number(effectiveId);
        });
        setAssignedComplaints(assigned);
        
        console.log(`Found ${unassigned.length} unassigned complaints`);
        console.log(`Found ${assigned.length} assigned complaints for user with ID ${effectiveId}`);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error.response?.data || error.message);
      Alert.alert('שגיאה', 'לא ניתן לטעון תלונות, אנא נסה שוב מאוחר יותר');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const assignToMe = async (complaintId) => {
    try {
      // משתמשים בתעודת זהות אם קיימת, אחרת ב-ID רגיל
      const effectiveId = userIdNumber || userId;
      console.log(`Assigning complaint ${complaintId} to user with ID ${effectiveId}`);
      
      const response = await axios.patch(
        `${BASE_URL}/api/complaints/${complaintId}/assign`,
        { employeeId: effectiveId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      
      if (response.data.status === 'success') {
        Alert.alert('הצלחה', 'התלונה שויכה אליך בהצלחה');
        // Refresh the complaints list
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error assigning complaint:', error);
      Alert.alert('שגיאה', 'לא ניתן לשייך את התלונה, אנא נסה שוב');
    }
  };

  const updateStatus = async (complaintId, status) => {
    try {
      console.log(`Updating complaint ${complaintId} status to ${status}`);
      
      const response = await axios.patch(
        `${BASE_URL}/api/complaints/${complaintId}/process`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success') {
        Alert.alert('הצלחה', `סטטוס התלונה עודכן ל${getStatusLabel(status)}`);
        setStatusDialogVisible(false);
        // Refresh the complaints list
        fetchComplaints();
      } else {
        // Handle non-success response
        Alert.alert('שגיאה', response.data.message || 'אירעה שגיאה בעדכון הסטטוס');
      }
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'לא ניתן לעדכן סטטוס, אנא נסה שוב';
      Alert.alert('שגיאה', errorMessage);
    }
  };

  // פונקציה לניווט לדף התגובה במקום להשתמש במודאל
  const navigateToAddResponse = (complaint) => {
    navigation.navigate('AddResponse', { 
      complaintId: complaint._id,
      title: complaint.title  // אופציונלי - להעביר גם את הכותרת לדף התגובה
    });
  };

  const openStatusDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusDialogVisible(true);
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#757575';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Format: "נוצר ב: 3 במאי' 2025, 17:44"
    const months = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
    return `${day} ב${months[month-1]}' ${year}, ${hours}:${minutes}`;
  };

  const isMyComplaint = (complaint) => {
    // משתמשים בתעודת זהות אם קיימת, אחרת ב-ID רגיל
    const effectiveId = userIdNumber || userId;
    const assignedId = complaint.assignedTo;
  
    return assignedId === effectiveId || 
           assignedId === String(effectiveId) || 
           assignedId === Number(effectiveId);
  };

  const renderComplaintItem = ({ item }) => {
    const isAssigned = isMyComplaint(item);
    const isAssignedToSomeone = !!item.assignedTo;
    const statusColor = getStatusColor(item.status);
    
    return (
      <Card style={styles.complaintCard} mode="elevated">
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.complaintTitle}>{item.title}</Title>
            <Chip
              mode="flat"
              textStyle={{ color: 'white', fontWeight: 'bold' }}
              style={[styles.statusChip, { backgroundColor: statusColor }]}
            >
              {getStatusLabel(item.status)}
            </Chip>
          </View>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaRow}>
              <IconButton icon="folder" size={20} color={theme.colors.primary} style={styles.metaIcon} />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
            
            <View style={styles.metaRow}>
              <IconButton icon="calendar" size={20} color={theme.colors.primary} style={styles.metaIcon} />
              <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          
          <Paragraph numberOfLines={2} style={styles.description}>
            {item.description}
          </Paragraph>
          
          {item.images && item.images.length > 0 && (
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: item.images[0].data }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              {item.images.length > 1 && (
                <Badge size={24} style={styles.imageBadge}>+{item.images.length - 1}</Badge>
              )}
            </View>
          )}
        </Card.Content>
        
        <Divider style={styles.cardDivider} />
        
        <Card.Actions style={styles.cardActions}>
          {!isAssignedToSomeone && activeTab === 'category' && (
            <Button 
              mode="contained" 
              icon="account-check"
              buttonColor="#4CAF50"
              onPress={() => assignToMe(item._id)}
            >
              שייך אלי
            </Button>
          )}
          
          {isAssigned && (
            <>
              <Button 
                mode="contained" 
                icon="reply"
                buttonColor="#2196F3"
                onPress={() => navigateToAddResponse(item)}
              >
                הגב
              </Button>
              
              <Button 
                mode="contained" 
                icon="refresh"
                buttonColor="#FF9800"
                onPress={() => openStatusDialog(item)}
              >
                עדכן סטטוס
              </Button>
            </>
          )}
          
          <Button 
            mode="outlined" 
            icon="eye"
            onPress={() => navigation.navigate('EmployeeComplaintDetails', { complaintId: item._id })}
          >
            פרטים
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderEmptyList = () => (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyContent}>
        <Avatar.Icon 
          size={80} 
          icon="inbox" 
          style={styles.emptyIcon} 
          color={theme.colors.primary}
        />
        <Title style={styles.emptyText}>אין תלונות זמינות</Title>
        <Text>לא נמצאו תלונות {activeTab === 'category' ? 'לא משויכות' : 'משויכות'}</Text>
      </Card.Content>
    </Card>
  );

  // Determine which complaints to show based on active tab
  const getDisplayedComplaints = () => {
    if (activeTab === 'category') {
      // Show only unassigned complaints in the category tab
      return unassignedComplaints;
    } else {
      // Show only complaints assigned to this employee in the assigned tab
      return assignedComplaints;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>טוען תלונות...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <Title style={styles.headerTitle}>ניהול תלונות</Title>
            <Text style={styles.headerSubtitle}>
              {activeTab === 'category' ? 'תלונות לפי קטגוריה' : 'התלונות שלי'}
            </Text>
          </View>
        </Surface>

        {/* Tab navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
            onPress={() => setActiveTab('assigned')}
          >
            <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>
              תלונות משויכות אלי
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'category' && styles.activeTab]}
            onPress={() => setActiveTab('category')}
          >
            <Text style={[styles.tabText, activeTab === 'category' && styles.activeTabText]}>
              תלונות לפי קטגוריה
            </Text>
          </TouchableOpacity>
        </View>

        {/* Complaints list */}
        <FlatList
          data={getDisplayedComplaints()}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />

        {/* Status update dialog */}
        <Portal>
          <Dialog
            visible={statusDialogVisible}
            onDismiss={() => setStatusDialogVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>עדכון סטטוס תלונה</Dialog.Title>
            <Dialog.Content>
              {selectedComplaint && (
                <>
                  <Paragraph style={styles.dialogText}>
                    עדכון סטטוס עבור: {selectedComplaint.title}
                  </Paragraph>
                  <Paragraph style={styles.dialogText}>
                    סטטוס נוכחי: {getStatusLabel(selectedComplaint.status)}
                  </Paragraph>
                  
                  <View style={styles.statusOptionsContainer}>
                    {statusOptions.map((option) => (
                      <Button
                        key={option.value}
                        mode="contained"
                        buttonColor={option.color}
                        style={[
                          styles.statusOption,
                          selectedComplaint.status === option.value && styles.disabledOption
                        ]}
                        onPress={() => updateStatus(selectedComplaint._id, option.value)}
                        disabled={selectedComplaint.status === option.value}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </View>
                </>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setStatusDialogVisible(false)}>ביטול</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
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
    color: '#555',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 3,
    borderBottomColor: '#4f46e5',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#4f46e5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  complaintCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  statusChip: {
    borderRadius: 16,
  },
  metaInfo: {
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaIcon: {
    margin: 0,
    marginRight: -8,
  },
  metaText: {
    fontSize: 14,
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
    textAlign: 'right',
  },
  imagePreview: {
    position: 'relative',
    marginTop: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  imageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
  },
  cardDivider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: '#eee',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyCard: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    backgroundColor: '#EEF2FF',
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
    color: '#555',
  },
  dialog: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  statusOptionsContainer: {
    marginTop: 16,
  },
  statusOption: {
    marginBottom: 8,
    borderRadius: 8,
  },
  disabledOption: {
    opacity: 0.6,
  }
});

export default EmployeeComplaints;