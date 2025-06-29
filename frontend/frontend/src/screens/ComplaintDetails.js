// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ComplaintDetails = ({ route, navigation }) => {
//   const { complaint: initialComplaint } = route.params;
//   const [complaint, setComplaint] = useState(initialComplaint);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchComplaintDetails();
//   }, []);

//   const fetchComplaintDetails = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
      
//       if (!token) {
//         navigation.navigate('Login');
//         return;
//       }

//       const response = await fetch(`http://192.168.116.111:5000/api/complaints/${complaint._id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch complaint details');
//       }

//       const data = await response.json();
//       setComplaint(data.data);
//     } catch (err) {
//       console.error('Error fetching complaint details:', err);
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

//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" style={styles.loader} />
//       ) : (
//         <>
//           <View style={styles.header}>
//             <Text style={styles.title}>{complaint.title}</Text>
//             <View style={[styles.statusBadge, {backgroundColor: getStatusColor(complaint.status)}]}>
//               <Text style={styles.statusText}>{complaint.status?.toUpperCase() || 'OPEN'}</Text>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Details</Text>
//             <Text style={styles.label}>Category:</Text>
//             <Text style={styles.value}>{complaint.category}</Text>
            
//             <Text style={styles.label}>Address:</Text>
//             <Text style={styles.value}>{complaint.address}</Text>
            
//             <Text style={styles.label}>Description:</Text>
//             <Text style={styles.value}>{complaint.description}</Text>
            
//             <Text style={styles.label}>Submitted:</Text>
//             <Text style={styles.value}>{formatDate(complaint.createdAt)}</Text>
//           </View>

//           {complaint.images && complaint.images.length > 0 && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Images</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {complaint.images.map((image, index) => (
//                   <Image 
//                     key={index}
//                     source={{ uri: image.data }} 
//                     style={styles.image}
//                     resizeMode="cover"
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Communication</Text>
            
//             {!complaint.responses || complaint.responses.length === 0 ? (
//               <Text style={styles.noResponses}>No messages yet</Text>
//             ) : (
//               complaint.responses.map((response, index) => (
//                 <View 
//                   key={index} 
//                   style={[
//                     styles.responseItem, 
//                     response.fromEmployee ? styles.employeeResponse : styles.citizenResponse
//                   ]}
//                 >
//                   <Text style={styles.responseText}>{response.message}</Text>
//                   <Text style={styles.responseDate}>
//                     {formatDate(response.createdAt)} - {response.fromEmployee ? 'Employee' : 'Citizen'}
//                   </Text>
//                 </View>
//               ))
//             )}
//           </View>
          
//           <TouchableOpacity 
//             style={styles.replyButton}
//             onPress={() => navigation.navigate('AddResponse', { complaintId: complaint._id })}
//           >
//             <Text style={styles.buttonText}>Reply to Citizen</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 16
//   },
//   loader: {
//     marginTop: 50
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     flex: 1
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//     marginLeft: 10
//   },
//   statusText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 12
//   },
//   section: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333'
//   },
//   label: {
//     fontWeight: '500',
//     marginTop: 8,
//     color: '#666'
//   },
//   value: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333'
//   },
//   image: {
//     width: 200,
//     height: 150,
//     borderRadius: 8,
//     marginRight: 10
//   },
//   responseItem: {
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10
//   },
//   employeeResponse: {
//     backgroundColor: '#E1F5FE',
//     marginLeft: 20,
//     marginRight: 0
//   },
//   citizenResponse: {
//     backgroundColor: '#F5F5F5',
//     marginRight: 20,
//     marginLeft: 0
//   },
//   responseText: {
//     fontSize: 14
//   },
//   responseDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 5,
//     textAlign: 'right'
//   },
//   noResponses: {
//     textAlign: 'center',
//     color: '#888',
//     padding: 20
//   },
//   replyButton: {
//     backgroundColor: '#9C27B0',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 30
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16
//   }
// });

// export default ComplaintDetails;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ComplaintDetails = ({ route, navigation }) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // בדיקה אם יש תלונה שהועברה בפרמטרים
        if (route.params?.complaint) {
          setComplaint(route.params.complaint);
          setLoading(false);
          return;
        }

        // אם לא, נטען מהשרת לפי ID
        if (route.params?.complaintId) {
          const token = await AsyncStorage.getItem('token');
          
          if (!token) {
            navigation.navigate('Login');
            return;
          }

          const response = await fetch(`http://172.19.36.84:5000/api/complaints/${route.params.complaintId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch complaint details');
          }

          const data = await response.json();
          setComplaint(data.data);
        } else {
          throw new Error('No complaint data provided');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#FF9800';
      case 'in_progress': return '#2196F3';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      default: return '#000000';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading complaint</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchData();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Complaint not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{complaint.title || 'No title'}</Text>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(complaint.status)}]}>
          <Text style={styles.statusText}>{complaint.status?.toUpperCase() || 'UNKNOWN'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{complaint.category || 'No category'}</Text>
        
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{complaint.address || 'No address'}</Text>
        
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{complaint.description || 'No description'}</Text>
        
        <Text style={styles.label}>Submitted:</Text>
        <Text style={styles.value}>{formatDate(complaint.createdAt)}</Text>
      </View>

      {complaint.images?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {complaint.images.map((image, index) => (
              <Image 
                key={index}
                source={{ uri: image.data }} 
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication</Text>
        
        {!complaint.responses || complaint.responses.length === 0 ? (
          <Text style={styles.noResponses}>No messages yet</Text>
        ) : (
          complaint.responses.map((response, index) => (
            <View 
              key={index} 
              style={[
                styles.responseItem, 
                response.fromEmployee ? styles.employeeResponse : styles.citizenResponse
              ]}
            >
              <Text style={styles.responseText}>{response.message}</Text>
              <Text style={styles.responseDate}>
                {formatDate(response.createdAt)} - {response.fromEmployee ? 'Employee' : 'Citizen'}
              </Text>
            </View>
          ))
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.replyButton}
        onPress={() => {
          if (!complaint._id) {
            Alert.alert('Error', 'Cannot reply to this complaint');
            return;
          }
          navigation.navigate('AddResponse', { complaintId: complaint._id });
        }}
      >
        <Text style={styles.buttonText}>Reply to Citizen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// הוספת סגנונות נוספים
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16
      },
      loader: {
        marginTop: 50
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1
      },
      statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginLeft: 10
      },
      statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12
      },
      section: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333'
      },
      label: {
        fontWeight: '500',
        marginTop: 8,
        color: '#666'
      },
      value: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333'
      },
      image: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginRight: 10
      },
      responseItem: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
      },
      employeeResponse: {
        backgroundColor: '#E1F5FE',
        marginLeft: 20,
        marginRight: 0
      },
      citizenResponse: {
        backgroundColor: '#F5F5F5',
        marginRight: 20,
        marginLeft: 0
      },
      responseText: {
        fontSize: 14
      },
      responseDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        textAlign: 'right'
      },
      noResponses: {
        textAlign: 'center',
        color: '#888',
        padding: 20
      },
      replyButton: {
        backgroundColor: '#9C27B0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
      }
});

export default ComplaintDetails;