// // ProfilePage.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ProfilePage = () => {
//   const [userData, setUserData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: ''
//   });

//   // Get user data from local storage
// //   const user = JSON.parse(localStorage.getItem('user'));
// const fetchUserFromStorage = async () => {
//     const user = await AsyncStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   };
  
//   const saveUserToStorage = async (user) => {
//     await AsyncStorage.setItem('user', JSON.stringify(user));
//   };
// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const response = await axios.get(`http://192.168.1.4:3000/api/profile/${user._id}`, {
// //           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //         });
// //         setUserData(response.data);
// //         setFormData({
// //           firstName: response.data.firstName,
// //           lastName: response.data.lastName,
// //           email: response.data.email,
// //           phoneNumber: response.data.phoneNumber
// //         });
// //       } catch (error) {
// //         setError('שגיאה בטעינת הפרופיל');
// //       }
// //     };

// //     if (user) {
// //       fetchProfile();
// //     }
// //   }, [user]);
// useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const storedUser = await fetchUserFromStorage();
//         if (!storedUser) return;
        
//         const response = await axios.get(`http://192.168.1.4:3000/api/profile/${storedUser._id}`, {
//           headers: { Authorization: `Bearer ${await AsyncStorage.getItem('token')}` },
//         });
  
//         setUserData(response.data);
//         setFormData({
//           firstName: response.data.firstName,
//           lastName: response.data.lastName,
//           email: response.data.email,
//           phoneNumber: response.data.phoneNumber,
//         });
//       } catch (error) {
//         setError('שגיאה בטעינת הפרופיל');
//       }
//     };
  
//     fetchProfile();
//   }, []);
  
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `http://192.168.1.4:3000/api/profile/${user._id}`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }
//       );
      
//       setUserData(response.data.user);
//       setSuccess('הפרופיל עודכן בהצלחה');
//       setIsEditing(false);
//       setError('');
      
//       // Update local storage with new user data
//       localStorage.setItem('user', JSON.stringify({
//         ...user,
//         firstName: formData.firstName,
//         lastName: formData.lastName
//       }));

//       // Clear success message after 3 seconds
//       setTimeout(() => {
//         setSuccess('');
//       }, 3000);
      
//     } catch (error) {
//       setError(error.response?.data?.error || 'שגיאה בעדכון הפרופיל');
      
//       // Clear error message after 3 seconds
//       setTimeout(() => {
//         setError('');
//       }, 3000);
//     }
//   };

//   if (!userData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold text-center mb-8">פרופיל אישי</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
//           {error}
//         </div>
//       )}
      
//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-right">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-right mb-2">מספר זהות</label>
//             <input
//               type="text"
//               value={userData.idNumber}
//               disabled
//               className="w-full p-2 border rounded bg-gray-100 text-right"
//             />
//           </div>
          
//           <div>
//             <label className="block text-right mb-2">תפקיד</label>
//             <input
//               type="text"
//               value={userData.role === 'manager' ? 'מנהל' : 'עובד'}
//               disabled
//               className="w-full p-2 border rounded bg-gray-100 text-right"
//             />
//           </div>

//           <div>
//             <label className="block text-right mb-2">שם פרטי</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               disabled={!isEditing}
//               className={`w-full p-2 border rounded text-right ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
//             />
//           </div>

//           <div>
//             <label className="block text-right mb-2">שם משפחה</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               disabled={!isEditing}
//               className={`w-full p-2 border rounded text-right ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
//             />
//           </div>

//           <div>
//             <label className="block text-right mb-2">אימייל</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               disabled={!isEditing}
//               dir="ltr"
//               className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
//             />
//           </div>

//           <div>
//             <label className="block text-right mb-2">מספר טלפון</label>
//             <input
//               type="text"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleInputChange}
//               disabled={!isEditing}
//               dir="ltr"
//               className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
//             />
//           </div>
//         </div>

//         <div className="flex justify-center space-x-4">
//           {!isEditing ? (
//             <button
//               type="button"
//               onClick={() => setIsEditing(true)}
//               className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
//             >
//               ערוך פרופיל
//             </button>
//           ) : (
//             <>
//               <button
//                 type="submit"
//                 className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
//               >
//                 שמור שינויים
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setFormData({
//                     firstName: userData.firstName,
//                     lastName: userData.lastName,
//                     email: userData.email,
//                     phoneNumber: userData.phoneNumber
//                   });
//                 }}
//                 className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
//               >
//                 בטל
//               </button>
//             </>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProfilePage;


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native'; // ייבוא useNavigation

// const ChangePasswordModal = ({ onClose }) => {
//     const navigation = useNavigation(); // שימוש ב-navigation

//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
  
//     const handleChangePassword = async () => {
//       if (newPassword !== confirmPassword) {
//         setError('הסיסמאות החדשות אינן תואמות');
//         return;
//       }
  
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const user = JSON.parse(await AsyncStorage.getItem('user'));
//         const response = await axios.put(
//           `http://192.168.1.4:3000/api/profile/${user._id}/change-password`,
//           { currentPassword, newPassword },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
  
//         setSuccess('הסיסמה שונתה בהצלחה');
//         setError('');
//         setTimeout(() => onClose(), 2000); // Close modal after success
//       } catch (error) {
//         setError(error.response?.data?.error || 'שגיאה בשינוי הסיסמה');
//         setSuccess('');
//       }
//     };
  
//     return (
//       <View style={styles.modal}>
//         <Text style={styles.modalTitle}>שינוי סיסמה</Text>
//         {error ? <Text style={styles.error}>{error}</Text> : null}
//         {success ? <Text style={styles.success}>{success}</Text> : null}
  
//         <TextInput
//           placeholder="סיסמה נוכחית"
//           secureTextEntry
//           style={styles.input}
//           value={currentPassword}
//           onChangeText={setCurrentPassword}
//         />
//         <TextInput
//           placeholder="סיסמה חדשה"
//           secureTextEntry
//           style={styles.input}
//           value={newPassword}
//           onChangeText={setNewPassword}
//         />
//         <TextInput
//           placeholder="אימות סיסמה חדשה"
//           secureTextEntry
//           style={styles.input}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />
  
//         <TouchableOpacity onPress={handleChangePassword} style={styles.saveButton}>
//           <Text style={styles.buttonText}>שנה סיסמה</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
//           <Text style={styles.buttonText}>בטל</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };
// const ProfilePage = ({navigation}) => {
//     const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);

//   const [userData, setUserData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//   });

//   const fetchUserFromStorage = async () => {
//     try {
//       const user = await AsyncStorage.getItem('user');
//       return user ? JSON.parse(user) : null;
//     } catch (error) {
//       console.error('Error fetching user from storage:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const user = await fetchUserFromStorage();
//         if (!user) return;

//         const token = await AsyncStorage.getItem('token');
//         const response = await axios.get(
//           `http://192.168.1.4:3000/api/profile/${user._id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setUserData(response.data);
//         setFormData({
//           firstName: response.data.firstName,
//           lastName: response.data.lastName,
//           email: response.data.email,
//           phoneNumber: response.data.phoneNumber,
//         });
//       } catch (error) {
//         setError('שגיאה בטעינת הפרופיל');
//         setTimeout(() => setError(''), 3000);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const user = await fetchUserFromStorage();
//       const token = await AsyncStorage.getItem('token');

//       const response = await axios.put(
//         `http://192.168.1.4:3000/api/profile/${user._id}`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setUserData(response.data.user);
//       setSuccess('הפרופיל עודכן בהצלחה');
//       setIsEditing(false);

//       await AsyncStorage.setItem(
//         'user',
//         JSON.stringify({
//           ...user,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//         })
//       );

//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       setError(error.response?.data?.error || 'שגיאה בעדכון הפרופיל');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   if (!userData) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text style={styles.buttonText}>חזור</Text>
//       </TouchableOpacity>
//       <Text style={styles.title}>פרופיל אישי</Text>

//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       {success ? <Text style={styles.success}>{success}</Text> : null}

//       <View style={styles.form}>
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>מספר זהות</Text>
//           <TextInput
//             value={userData.idNumber}
//             editable={false}
//             style={[styles.input, styles.disabledInput]}
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>תפקיד</Text>
//           <TextInput
//             value={userData.role === 'manager' ? 'מנהל' : 'עובד'}
//             editable={false}
//             style={[styles.input, styles.disabledInput]}
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>שם פרטי</Text>
//           <TextInput
//             value={formData.firstName}
//             onChangeText={(value) => handleInputChange('firstName', value)}
//             editable={false}
//             style={[styles.input, styles.disabledInput]}
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>שם משפחה</Text>
//           <TextInput
//             value={formData.lastName}
//             onChangeText={(value) => handleInputChange('lastName', value)}
//             editable={false}
//             style={[styles.input, styles.disabledInput]}
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>אימייל</Text>
//           <TextInput
//             value={formData.email}
//             onChangeText={(value) => handleInputChange('email', value)}
//             editable={isEditing}
//             style={[styles.input, !isEditing && styles.disabledInput]}
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>מספר טלפון</Text>
//           <TextInput
//             value={formData.phoneNumber}
//             onChangeText={(value) => handleInputChange('phoneNumber', value)}
//             editable={isEditing}
//             style={[styles.input, !isEditing && styles.disabledInput]}
//           />
//         </View>
//       </View>

//       <View style={styles.buttonContainer}>
//         {!isEditing ? (
//           <TouchableOpacity
//             onPress={() => setIsEditing(true)}
//             style={styles.editButton}
//           >
//             <Text style={styles.buttonText}>ערוך פרופיל</Text>
//           </TouchableOpacity>
//         ) : (
//           <>
//             <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
//               <Text style={styles.buttonText}>שמור שינויים</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => {
//                 setIsEditing(false);
//                 setFormData({
//                   firstName: userData.firstName,
//                   lastName: userData.lastName,
//                   email: userData.email,
//                   phoneNumber: userData.phoneNumber,
//                 });
//               }}
//               style={styles.cancelButton}
//             >
//               <Text style={styles.buttonText}>בטל</Text>
//             </TouchableOpacity>
//           </>
//         )}

// <TouchableOpacity
//           onPress={() => setChangePasswordVisible(true)}
//           style={styles.changePasswordButton}
//         >
//           <Text style={styles.buttonText}>שינוי סיסמה</Text>
//         </TouchableOpacity>
//       </View>

//       {isChangePasswordVisible && (
//         <ChangePasswordModal onClose={() => setChangePasswordVisible(false)} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: { padding: 20, backgroundColor: '#fff', flex: 1 },
//     backButton: { marginBottom: 15, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
//     buttonText: { color: '#fff', textAlign: 'center' },
//     title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   container: { padding: 20, backgroundColor: '#fff', flex: 1 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   form: { marginBottom: 20 },
//   inputGroup: { marginBottom: 10 },
//   label: { marginBottom: 5, fontWeight: 'bold' },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
//   disabledInput: { backgroundColor: '#f0f0f0' },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
//   editButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
//   saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5 },
//   cancelButton: { backgroundColor: '#6c757d', padding: 15, borderRadius: 5 },
//   buttonText: { color: '#fff', textAlign: 'center' },
//   error: { color: 'red', marginBottom: 10 },
//   success: { color: 'green', marginBottom: 10 },
//   loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   changePasswordButton: { backgroundColor: '#ffc107', padding: 15, borderRadius: 5 },

// });

// export default ProfilePage;



//this for empolee
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
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://192.168.1.4:3000/api';

// Custom Input Component
const CustomInput = ({ label, value, onChangeText, secureTextEntry, placeholder }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
    />
  </View>
);

// Avatar Component
const ProfileAvatar = ({ firstName, lastName }) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    </View>
  );
};

// Info Card Component
const InfoCard = ({ label, value }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// Status Message Component
const StatusMessage = ({ error, success }) => {
  if (!error && !success) return null;
  
  return (
    <Text style={[
      styles.statusMessage,
      error ? styles.errorMessage : styles.successMessage
    ]}>
      {error || success}
    </Text>
  );
};

// Modal Component with Animation
const AnimatedModal = ({ visible, onClose, children }) => {
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity 
        style={styles.modalBackdrop} 
        onPress={onClose}
        activeOpacity={1}
      />
      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

// Change Password Modal Component
const ChangePasswordModal = ({ onClose }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({
    error: '',
    success: '',
  });

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (newPassword !== confirmPassword) {
      setStatus({ error: 'הסיסמאות החדשות אינן תואמות', success: '' });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      await axios.put(
        `${API_BASE_URL}/profile/${user._id}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({ error: '', success: 'הסיסמה שונתה בהצלחה' });
      setTimeout(onClose, 2000);
    } catch (error) {
      setStatus({
        error: error.response?.data?.error || 'שגיאה בשינוי הסיסמה',
        success: '',
      });
    }
  };

  return (
    <View style={styles.modalInner}>
      <Text style={styles.modalTitle}>שינוי סיסמה</Text>
      <StatusMessage error={status.error} success={status.success} />
      
      <CustomInput
        label="סיסמה נוכחית"
        value={passwords.currentPassword}
        onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })}
        secureTextEntry
        placeholder="הזן סיסמה נוכחית"
      />
      
      <CustomInput
        label="סיסמה חדשה"
        value={passwords.newPassword}
        onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
        secureTextEntry
        placeholder="הזן סיסמה חדשה"
      />
      
      <CustomInput
        label="אימות סיסמה חדשה"
        value={passwords.confirmPassword}
        onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
        secureTextEntry
        placeholder="הזן שוב את הסיסמה החדשה"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity 
          onPress={handleChangePassword} 
          style={[styles.button, styles.primaryButton]}
        >
          <Text style={styles.buttonText}>שינוי סיסמה</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onClose} 
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>ביטול</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Edit Profile Modal Component
const EditProfileModal = ({ userData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: userData.email || '',
    phoneNumber: userData.phoneNumber || '',
  });
  const [status, setStatus] = useState({
    error: '',
    success: '',
  });

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put(
        `${API_BASE_URL}/profile/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus({ error: '', success: 'הפרופיל עודכן בהצלחה' });
      setTimeout(() => {
        onSave(response.data.user);
        onClose();
      }, 2000);
    } catch (error) {
      setStatus({
        error: error.response?.data?.error || 'שגיאה בעדכון הפרופיל',
        success: '',
      });
    }
  };

  return (
    <View style={styles.modalInner}>
      <Text style={styles.modalTitle}>עריכת פרופיל</Text>
      <StatusMessage error={status.error} success={status.success} />
      
      <CustomInput
        label="אימייל"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder="הזן כתובת אימייל"
      />
      
      <CustomInput
        label="מספר טלפון"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        placeholder="הזן מספר טלפון"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.button, styles.primaryButton]}
        >
          <Text style={styles.buttonText}>שמירת שינויים</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onClose} 
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>ביטול</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Profile Component
const ProfilePage = () => {
  const navigation = useNavigation();
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return;

      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/profile/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserData(response.data);
    } catch (error) {
      setStatus({ error: 'שגיאה בטעינת הפרופיל', success: '' });
      setTimeout(() => setStatus({ error: '', success: '' }), 3000);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>חזור</Text>
        </TouchableOpacity>
        
        <ProfileAvatar 
          firstName={userData.firstName} 
          lastName={userData.lastName} 
        />
        <Text style={styles.userName}>
          {`${userData.firstName} ${userData.lastName}`}
        </Text>
        <Text style={styles.userRole}>
          {userData.role === 'manager' ? 'מנהל' : 'עובד'}
        </Text>
      </View>

      <View style={styles.content}>
        <StatusMessage error={status.error} success={status.success} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>פרטים אישיים</Text>
          <View style={styles.cardsGrid}>
            <InfoCard 
              label="מספר זהות" 
              value={userData.idNumber} 
            />
            <InfoCard 
              label="אימייל" 
              value={userData.email} 
            />
            <InfoCard 
              label="טלפון" 
              value={userData.phoneNumber} 
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => setEditProfileVisible(true)}
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.buttonText}>עריכת פרופיל</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setChangePasswordVisible(true)}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              שינוי סיסמה
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <AnimatedModal 
        visible={isEditProfileVisible} 
        onClose={() => setEditProfileVisible(false)}
      >
        <EditProfileModal
          userData={userData}
          onClose={() => setEditProfileVisible(false)}
          onSave={updatedUser => {
            setUserData(updatedUser);
            setStatus({ error: '', success: 'הפרופיל עודכן בהצלחה' });
            setTimeout(() => setStatus({ error: '', success: '' }), 3000);
          }}
        />
      </AnimatedModal>

      <AnimatedModal 
        visible={isChangePasswordVisible} 
        onClose={() => setChangePasswordVisible(false)}
      >
        <ChangePasswordModal 
          onClose={() => setChangePasswordVisible(false)} 
        />
      </AnimatedModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#ffffff',
        },
        header: {
          backgroundColor: '#4f46e5',
          paddingTop: 60,
          paddingBottom: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          alignItems: 'center',
          position: 'relative',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        backButton: {
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: 8,
          borderRadius: 12,
        },
        backButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
        },
        avatarContainer: {
          marginBottom: 20,
        },
        avatar: {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        avatarText: {
          fontSize: 42,
          color: '#4f46e5',
          fontWeight: 'bold',
        },
        userName: {
          color: '#fff',
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 8,
        },
        userRole: {
          color: '#e0e7ff',
          fontSize: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: 20,
        },
        content: {
          padding: 24,
        },
        section: {
          marginBottom: 30,
        },
        sectionTitle: {
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20,
          color: '#1f2937',
          textAlign: 'right',
        },
        cardsGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16,
        },
        infoCard: {
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
          width: '100%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
          marginBottom: 12,
        },
        infoLabel: {
          color: '#6b7280',
          fontSize: 16,
          marginBottom: 8,
          textAlign: 'right',
        },
        infoValue: {
          color: '#111827',
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'right',
        },
        actionButtons: {
          gap: 16,
          marginTop: 12,
        },
        button: {
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        },
        primaryButton: {
          backgroundColor: '#4f46e5',
        },
        secondaryButton: {
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: '#4f46e5',
        },
        buttonText: {
          color: '#fff',
          fontSize: 18,
          fontWeight: '600',
        },
        secondaryButtonText: {
          color: '#4f46e5',
        },
        modalOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'flex-end',
        },
        modalBackdrop: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        modalContent: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 24,
          minHeight: '60%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        modalInner: {
          padding: 16,
        },
        modalTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: 24,
          textAlign: 'right',
        },
        modalButtons: {
          gap: 16,
          marginTop: 24,
        },
        inputContainer: {
          marginBottom: 20,
        },
        inputLabel: {
          fontSize: 16,
          color: '#4b5563',
          marginBottom: 8,
          textAlign: 'right',
        },
        input: {
          backgroundColor: '#f9fafb',
          borderRadius: 12,
          padding: 16,
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          textAlign: 'right',
        },
        statusMessage: {
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          textAlign: 'right',
        },
        errorMessage: {
          backgroundColor: '#fee2e2',
          color: '#dc2626',
        },
        successMessage: {
          backgroundColor: '#dcfce7',
          color: '#16a34a',
        },
        loaderContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        },
});

export default ProfilePage;