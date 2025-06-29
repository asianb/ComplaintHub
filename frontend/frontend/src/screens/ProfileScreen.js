



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

const API_BASE_URL = 'http://192.168.1.3:5001/api'; // Update with your server URL

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
      const userToken = await AsyncStorage.getItem('userToken');
      console.log("Using token:", userToken); // שינוי מ-`userToken` ל-`token`

      if (!userToken || !userId) {
        navigation.replace('Login'); // Navigate to login if token or userId is missing
        return;
      }
  
      console.log("Fetching profile for user:", userId); // Debugging
      console.log("Using token:", userToken); // Debugging
  
      const response = await axios.get(
        `${API_BASE_URL}/profile/${userId}`, // Fixed template literal
        {
          headers: { 
            Authorization: `Bearer ${userToken}`, // Correct format
            'Content-Type': 'application/json' // Explicit content type
          }
        }
      );
  
      setUserData(response.data);
      setEditedData({
        email: response.data.email,
        phone: response.data.phone,
      });
      setStatus({ type: 'success', message: 'פרטי המשתמש נטענו בהצלחה' });
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message); // Debugging
  
      // Handle token expiration or other errors
      if (error.response?.status === 401) {
        await AsyncStorage.multiRemove(['userToken', 'userId']);
        navigation.replace('Login');
      }
  
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'שגיאה בטעינת הנתונים'
      });
    } finally {
      setLoading(false);
    }
  };
  // const fetchUserData = async () => {
  //   try {
  //     const userId = await AsyncStorage.getItem('userId');
  //     const token = await AsyncStorage.getItem('token');

  //     const response = await axios.get(
  //       `${API_BASE_URL}/profile/${userId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }
  //     );

  //     setUserData(response.data);
  //     setEditedData({
  //       email: response.data.email,
  //       phone: response.data.phone,
  //     });
  //   } catch (error) {
  //     setStatus({
  //       type: 'error',
  //       message: error.response?.data?.message || 'שגיאה בטעינת הנתונים'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

// Add logout functionality
const handleLogout = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'userId']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default ProfileScreen;