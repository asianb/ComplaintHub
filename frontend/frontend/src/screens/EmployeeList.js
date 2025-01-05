//EmployeeList.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EmployeeList = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://192.168.23.111:3000/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      Alert.alert('שגיאה', 'לא ניתן לטעון את רשימת העובדים');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (employeeId) => {
    Alert.alert(
      'אישור מחיקה',
      'האם אתה בטוח שברצונך למחוק עובד זה?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://172.19.33.111:3000/api/employees/${employeeId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Failed to delete employee');
              }
              setEmployees(employees.filter(emp => emp._id !== employeeId));
              Alert.alert('הצלחה', 'העובד נמחק בהצלחה');
            } catch (error) {
              console.error('Error deleting employee:', error);
              Alert.alert('שגיאה', 'לא ניתן למחוק את העובד');
            }
          }
        }
      ]
    );
  };
  const anfal = async (employee_id) => {
    console.log('anfaaaaaaaaaaal'); // הדפיסי את currentUser

  }
  const navigateToChat = async (employee_id) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      console.log('Stored User:', storedUser); // הדפסת המידע שנשמר ב-AsyncStorage
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      const selectedEmployee = employees.find(emp => emp._id === employee_id);
  
      console.log('Current User:', currentUser); // הדפיסי את currentUser
      console.log('Selected Employee:', selectedEmployee); // הדפיסי את selectedEmployee
  
      if (!selectedEmployee) {
        Alert.alert("שגיאה", "לא נמצא משתמש מתאים.");
        return;
      }
  
      if (!currentUser) {
        Alert.alert("שגיאה", "פרטי המשתמש המחובר אינם זמינים.");
        return;
      }
  
      try {
        navigation.navigate('Chat', {
          currentUser: currentUser,
          selectedUser: selectedEmployee,
        });
      } catch (error) {
        console.error('Error navigating to Chat:', error);
        Alert.alert('שגיאה', 'אירעה שגיאה בעת מעבר לצ\'אט');
      }
  
    } catch (error) {
      console.error('Error in navigateToChat:', error);
    }
  };
  

  const renderEmployee = ({ item, index }) => {
    const animatedValue = new Animated.Value(0);
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={[
          styles.employeeCard,
          {
            opacity: animatedValue,
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.firstName[0]}{item.lastName[0]}
            </Text>
          </View>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.roleText}>{item.role}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Icon name="badge" size={16} color="#666" />
              <Text style={styles.employeeDetail}>{item.idNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="email" size={16} color="#666" />
              <Text style={styles.employeeDetail}>{item.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="phone" size={16} color="#666" />
              <Text style={styles.employeeDetail}>{item.phoneNumber}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
        <TouchableOpacity  
        style={styles.chatButton}
        onPress={() => {
            console.log('Chat Button Pressed');
            navigateToChat(item._id);
        }}
        >
        <Icon name="chat" size={24} color="#007AFF" />
        </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteEmployee(item._id)}
          >
            <Icon name="delete-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>רשימת עובדים</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>טוען רשימת עובדים...</Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>לא נמצאו עובדים</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    actionButtons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 8,
      },
      chatButton: {
        padding: 8,
        marginBottom: 8,
      },
      deleteButton: {
        padding: 8,
      },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  employeeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'right',
  },
  roleText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
    textAlign: 'right',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  employeeDetail: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    textAlign: 'right',
  },
//   deleteButton: {
//     padding: 8,
//   },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default EmployeeList;