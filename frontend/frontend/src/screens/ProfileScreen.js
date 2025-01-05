// import React, { useState, useEffect } from 'react';
// import {View,Text,TextInput,TouchableOpacity,ActivityIndicator,StyleSheet,Animated,ScrollView,} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

// const API_BASE_URL = 'http://10.0.0.4:5001/api';

// // Custom Input Component
// const CustomInput = ({ label, value, onChangeText, secureTextEntry, placeholder }) => (
//   <View style={styles.inputContainer}>
//     <Text style={styles.inputLabel}>{label}</Text>
//     <TextInput
//       style={styles.input}
//       value={value}
//       onChangeText={onChangeText}
//       secureTextEntry={secureTextEntry}
//       placeholder={placeholder}
//       placeholderTextColor="#9ca3af"
//     />
//   </View>
// );

// // Avatar Component
// const ProfileAvatar = ({ firstName, lastName }) => {
//   const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
//   return (
//     <View style={styles.avatarContainer}>
//       <View style={styles.avatar}>
//         <Text style={styles.avatarText}>{initials}</Text>
//       </View>
//     </View>
//   );
// };

// // Info Card Component
// const InfoCard = ({ label, value }) => (
//   <View style={styles.infoCard}>
//     <Text style={styles.infoLabel}>{label}</Text>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );

// // Status Message Component
// const StatusMessage = ({ error, success }) => {
//   if (!error && !success) return null;
  
//   return (
//     <Text style={[
//       styles.statusMessage,
//       error ? styles.errorMessage : styles.successMessage
//     ]}>
//       {error || success}
//     </Text>
//   );
// };

// // Modal Component with Animation
// const AnimatedModal = ({ visible, onClose, children }) => {
//   const [slideAnim] = useState(new Animated.Value(0));

//   useEffect(() => {
//     if (visible) {
//       Animated.spring(slideAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <View style={styles.modalOverlay}>
//       <TouchableOpacity 
//         style={styles.modalBackdrop} 
//         onPress={onClose}
//         activeOpacity={1}
//       />
//       <Animated.View
//         style={[
//           styles.modalContent,
//           {
//             transform: [
//               {
//                 translateY: slideAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [600, 0],
//                 }),
//               },
//             ],
//           },
//         ]}
//       >
//         {children}
//       </Animated.View>
//     </View>
//   );
// };

// // Edit Profile Modal Component
// const EditProfileModal = ({ userData, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     email: userData.email || '',
//     phone: userData.phone || '',
//     address: userData.address || '',
//   });
//   const [status, setStatus] = useState({
//     error: '',
//     success: '',
//   });

//   const handleSubmit = async () => {
//     try {
//       const user = JSON.parse(await AsyncStorage.getItem('user'));
//       const token = await AsyncStorage.getItem('token');

//       const response = await axios.put(
//         `${API_BASE_URL}/update-user`,
//         { id: user.id, ...formData },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setStatus({ error: '', success: 'הפרופיל עודכן בהצלחה' });
//       setTimeout(() => {
//         onSave(response.data.user);
//         onClose();
//       }, 2000);
//     } catch (error) {
//       setStatus({
//         error: error.response?.data?.message || 'שגיאה בעדכון הפרופיל',
//         success: '',
//       });
//     }
//   };

//   return (
//     <View style={styles.modalInner}>
//       <Text style={styles.modalTitle}>עריכת פרופיל</Text>
//       <StatusMessage error={status.error} success={status.success} />
      
//       <CustomInput
//         label="אימייל"
//         value={formData.email}
//         onChangeText={(text) => setFormData({ ...formData, email: text })}
//         placeholder="הזן כתובת אימייל"
//       />
      
//       <CustomInput
//         label="טלפון"
//         value={formData.phone}
//         onChangeText={(text) => setFormData({ ...formData, phone: text })}
//         placeholder="הזן מספר טלפון"
//       />

//       <CustomInput
//         label="כתובת"
//         value={formData.address}
//         onChangeText={(text) => setFormData({ ...formData, address: text })}
//         placeholder="הזן כתובת מגורים"
//       />

//       <View style={styles.modalButtons}>
//         <TouchableOpacity 
//           onPress={handleSubmit} 
//           style={[styles.button, styles.primaryButton]}
//         >
//           <Text style={styles.buttonText}>שמירת שינויים</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={onClose} 
//           style={[styles.button, styles.secondaryButton]}
//         >
//           <Text style={[styles.buttonText, styles.secondaryButtonText]}>ביטול</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// // Main Profile Component
// const ProfileScreen = () => {
//   const navigation = useNavigation();
//   const [isEditProfileVisible, setEditProfileVisible] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [status, setStatus] = useState({ error: '', success: '' });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem('user');
//       if (!userStr) return;

//       const user = JSON.parse(userStr);
//       setUserData(user);
//     } catch (error) {
//       setStatus({ error: 'שגיאה בטעינת הפרופיל', success: '' });
//       setTimeout(() => setStatus({ error: '', success: '' }), 3000);
//     }
//   };

//   if (!userData) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#6366f1" />
//       </View>
//     );
//   }

//   const [firstName, lastName] = userData.name ? userData.name.split(' ') : ['', ''];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//         >
//           <Text style={styles.backButtonText}>חזור</Text>
//         </TouchableOpacity>
        
//         <ProfileAvatar 
//           firstName={firstName} 
//           lastName={lastName} 
//         />
//         <Text style={styles.userName}>{userData.name}</Text>
//         <Text style={styles.userRole}>אזרח</Text>
//       </View>

//       <View style={styles.content}>
//         <StatusMessage error={status.error} success={status.success} />
        
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>פרטים אישיים</Text>
//           <View style={styles.cardsGrid}>
//             <InfoCard 
//               label="תעודת זהות" 
//               value={userData.id} 
//             />
//             <InfoCard 
//               label="אימייל" 
//               value={userData.email} 
//             />
//             <InfoCard 
//               label="טלפון" 
//               value={userData.phone} 
//             />
//             {userData.address && (
//               <InfoCard 
//                 label="כתובת" 
//                 value={userData.address} 
//               />
//             )}
//           </View>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => setEditProfileVisible(true)}
//             style={[styles.button, styles.primaryButton]}
//           >
//             <Text style={styles.buttonText}>עריכת פרופיל</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <AnimatedModal 
//         visible={isEditProfileVisible} 
//         onClose={() => setEditProfileVisible(false)}
//       >
//         <EditProfileModal
//           userData={userData}
//           onClose={() => setEditProfileVisible(false)}
//           onSave={updatedUser => {
//             setUserData(updatedUser);
//             setStatus({ error: '', success: 'הפרופיל עודכן בהצלחה' });
//             setTimeout(() => setStatus({ error: '', success: '' }), 3000);
//           }}
//         />
//       </AnimatedModal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     backgroundColor: '#4f46e5',
//     paddingTop: 60,
//     paddingBottom: 40,
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     alignItems: 'center',
//     position: 'relative',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     zIndex: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     padding: 8,
//     borderRadius: 12,
//   },
//   backButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   avatarContainer: {
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   avatarText: {
//     fontSize: 42,
//     color: '#4f46e5',
//     fontWeight: 'bold',
//   },
//   userName: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   userRole: {
//     color: '#e0e7ff',
//     fontSize: 18,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   content: {
//     padding: 24,
//   },
//   section: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#1f2937',
//     textAlign: 'right',
//   },
//   cardsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 16,
//   },
//   infoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//     marginBottom: 12,
//   },
//   infoLabel: {
//     color: '#6b7280',
//     fontSize: 16,
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   infoValue: {
//     color: '#111827',
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'right',
//   },
//   actionButtons: {
//     gap: 16,
//     marginTop: 12,
//   },
//   button: {
//     padding: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   primaryButton: {
//     backgroundColor: '#4f46e5',
//   },
//   secondaryButton: {
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#4f46e5',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   secondaryButtonText: {
//     color: '#4f46e5',
//   },
//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-end',
//   },
//   modalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     padding: 24,
//     minHeight: '60%',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   modalInner: {
//     padding: 16,
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 24,
//     textAlign: 'right',
//   },
//   modalButtons: {
//     gap: 16,
//     marginTop: 24,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 16,
//     color: '#4b5563',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   input: {
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//     padding: 16
//   },
//   });

//   export default ProfileScreen;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.0.4:5001/api'; // Update with your server URL

// Status Message Component
const StatusMessage = ({ type, message }) => {
  if (!message) return null;

  return (
    <View style={[
      styles.statusContainer,
      type === 'error' ? styles.errorContainer : styles.successContainer
    ]}>
      <Text style={[
        styles.statusText,
        type === 'error' ? styles.errorText : styles.successText
      ]}>
        {message}
      </Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        `${API_BASE_URL}/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUserData(response.data);
      setEditedData({
        email: response.data.email,
        phone: response.data.phone,
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'שגיאה בטעינת הנתונים'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put(
        `${API_BASE_URL}/profile/${userId}`,
        editedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUserData(response.data.user);
      setStatus({ type: 'success', message: 'הפרופיל עודכן בהצלחה' });
      setIsEditing(false);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'שגיאה בעדכון הפרופיל'
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: 'error', message: 'הסיסמאות החדשות אינן תואמות' });
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      await axios.put(
        `${API_BASE_URL}/profile/${userId}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStatus({ type: 'success', message: 'הסיסמה שונתה בהצלחה' });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'שגיאה בשינוי הסיסמה'
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>פרופיל משתמש</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData?.name?.[0]?.toUpperCase() || ''}
          </Text>
        </View>
        <Text style={styles.userName}>{userData?.name}</Text>
        <Text style={styles.userId}>ת.ז: {userData?.id}</Text>
      </View>

      <View style={styles.content}>
        <StatusMessage type={status.type} message={status.message} />

        {isEditing ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={editedData.email}
              onChangeText={(text) => setEditedData({ ...editedData, email: text })}
              placeholder="אימייל"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={editedData.phone}
              onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
              placeholder="טלפון"
              keyboardType="phone-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>שמירת שינויים</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>ביטול</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>אימייל:</Text>
              <Text style={styles.infoValue}>{userData?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>טלפון:</Text>
              <Text style={styles.infoValue}>{userData?.phone}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>עריכת פרטים</Text>
            </TouchableOpacity>
          </View>
        )}

        {isChangingPassword ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={passwordData.currentPassword}
              onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
              placeholder="סיסמה נוכחית"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={passwordData.newPassword}
              onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
              placeholder="סיסמה חדשה"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={passwordData.confirmPassword}
              onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
              placeholder="אימות סיסמה חדשה"
              secureTextEntry
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>שינוי סיסמה</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setIsChangingPassword(false)}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>ביטול</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, styles.passwordButton]}
            onPress={() => setIsChangingPassword(true)}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>שינוי סיסמה</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    color: '#4f46e5',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  statusContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
  },
  successContainer: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: '#dc2626',
  },
  successText: {
    color: '#16a34a',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#4f46e5',
  },
  passwordButton: {
    marginTop: 20,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// // Add logout functionality
// const handleLogout = async () => {
//   try {
//     await AsyncStorage.multiRemove(['token', 'userId']);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   } catch (error) {
//     console.error('Error logging out:', error);
//   }
// };

export default ProfileScreen;