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

const CitizenList = ({ navigation }) => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = async () => {
    try {
      const response = await fetch('http://172.19.36.139:5001/api/Citizen');
      if (!response.ok) {
        throw new Error('Failed to fetch citizens');
      }
      const data = await response.json();
      // Filter out any null or undefined items
      const validData = data.filter(item => item && item._id);
      setCitizens(validData);
    } catch (error) {
      console.error('Error fetching citizens:', error);
      Alert.alert('שגיאה', 'לא ניתן לטעון את רשימת האזרחים');
      setCitizens([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteCitizen = async (citizenId) => {
    if (!citizenId) {
      console.error('Invalid citizen ID');
      return;
    }

    Alert.alert(
      'אישור מחיקה',
      'האם אתה בטוח שברצונך למחוק אזרח זה?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://172.19.36.139:5001/api/Citizen/${citizenId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Failed to delete citizen');
              }
              setCitizens(citizens.filter(citizen => citizen._id !== citizenId));
              Alert.alert('הצלחה', 'האזרח נמחק בהצלחה');
            } catch (error) {
              console.error('Error deleting citizen:', error);
              Alert.alert('שגיאה', 'לא ניתן למחוק את האזרח');
            }
          }
        }
      ]
    );
  };

  const navigateToChat = async (citizen_id) => {
    if (!citizen_id) {
      console.error('Invalid citizen ID');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      const selectedCitizen = citizens.find(citizen => citizen && citizen._id === citizen_id);
  
      if (!selectedCitizen) {
        Alert.alert("שגיאה", "לא נמצא משתמש מתאים.");
        return;
      }
  
      if (!currentUser) {
        Alert.alert("שגיאה", "פרטי המשתמש המחובר אינם זמינים.");
        return;
      }
  
      navigation.navigate('Chat', {
        currentUser: currentUser,
        selectedUser: selectedCitizen,
      });
    } catch (error) {
      console.error('Error in navigateToChat:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בעת מעבר לצ\'אט');
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name[0];
  };

  const renderCitizen = ({ item, index }) => {
    // Add safety check for item
    if (!item || !item.name) {
      console.error('Invalid item data:', item);
      return null;
    }

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
          styles.citizenCard,
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
              {getInitials(item.name)}
            </Text>
          </View>
        </View>
        <View style={styles.citizenInfo}>
          <Text style={styles.citizenName}>{item.name}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Icon name="badge" size={16} color="#666" />
              <Text style={styles.citizenDetail}>{item.id || 'אין מספר זהות'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="email" size={16} color="#666" />
              <Text style={styles.citizenDetail}>{item.email || 'אין אימייל'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="phone" size={16} color="#666" />
              <Text style={styles.citizenDetail}>{item.phone || 'אין מספר טלפון'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              if (item._id) {
                navigateToChat(item._id);
              }
            }}
          >
            <Icon name="chat" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {
              if (item._id) {
                deleteCitizen(item._id);
              }
            }}
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
        <Text style={styles.headerTitle}>רשימת אזרחים</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>טוען רשימת אזרחים...</Text>
        </View>
      ) : (
        <FlatList
          data={citizens}
          renderItem={renderCitizen}
          keyExtractor={item => item?._id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>לא נמצאו אזרחים</Text>
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
  citizenCard: {
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
  citizenInfo: {
    flex: 1,
  },
  citizenName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
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
  citizenDetail: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    textAlign: 'right',
  },
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

export default CitizenList;