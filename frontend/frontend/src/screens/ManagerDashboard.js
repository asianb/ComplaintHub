import React, { useState,useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.23.111/api';

const MenuCard = ({ title, icon, count, color, onPress }) => (
  <Card style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
    <Card.Content style={styles.menuCardContent}>
      <Avatar.Icon 
        size={48} 
        icon={icon} 
        style={[styles.menuIcon, { backgroundColor: `${color}20` }]}
        color={color}
      />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {count !== undefined && (
          <Text style={[styles.menuCount, { color }]}>{count}</Text>
        )}
      </View>
    </Card.Content>
  </Card>
);

const ManagerDashboard = ({ navigation }) => {
  const theme = useTheme();
  const [managerName, setManagerName] = useState('');
  const [userData, setUserData] = useState('');  // Start with null to show loading state

  useEffect(() => {
    fetchProfile();
  }, []);

  // const fetchProfile = async () => {
  //   try {
  //     const user = JSON.parse(await AsyncStorage.getItem('user'));
  //     if (!user) return;

  //     const token = await AsyncStorage.getItem('token');
  //     const response = await axios.get(
  //       `${API_BASE_URL}/profile/${user._id}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setUserData(response.data);
  //     console.log(response.data.firstName || 'לא נמצא שם פרטי');


  //   } catch (error) {
  //     setStatus({ error: 'שגיאה בטעינת הפרופיל', success: '' });
  //     setTimeout(() => setStatus({ error: '', success: '' }), 3000);
  //   }
  // };
  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
  
      // שליפת פרטי המשתמש מ-AsyncStorage
      const userString = await AsyncStorage.getItem('user');
      console.log('User String:', userString);
  
      if (!userString) {
        console.error('משתמש לא נמצא ב-AsyncStorage');
        setStatus({ error: 'משתמש לא נמצא', success: '' });
        return;
      }
  
      const user = JSON.parse(userString);
  
      // שליפת טוקן מ-AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
  
      if (!token) {
        console.error('טוקן לא נמצא ב-AsyncStorage');
        setStatus({ error: 'טוקן לא נמצא', success: '' });
        return;
      }
  
      // קריאה ל-API כדי לשלוף את פרופיל המשתמש
      const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Response:', response);
  
      if (response.data) {
        // עדכון הנתונים שהתקבלו
        console.log('Response Data:', response.data);
        setUserData(response.data);
  
        // הדפסת שם פרטי אם זמין
        console.log('First Name:', response.data.firstName || 'לא נמצא שם פרטי');
      } else {
        console.error('No data in response.');
        setStatus({ error: 'לא התקבלו נתונים מהשרת', success: '' });
      }
    } catch (error) {
      // טיפול בשגיאות
      console.error('Error occurred:', error);
  
      const errorMessage = error.response?.data?.message || 'שגיאה בלתי צפויה';
      setStatus({ error: `שגיאה בטעינת הפרופיל: ${errorMessage}`, success: '' });
  
      // איפוס הודעות סטטוס לאחר 3 שניות
      setTimeout(() => setStatus({ error: '', success: '' }), 3000);
    }
  };
  
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userRole');
    navigation.replace('Login');
  };

  const menuItems = [
    {
      title: 'רשימת עובדים',
      icon: 'account-group',
      count: '12',
      color: '#4CAF50',
      onPress: () => navigation.navigate('EmployeeList')
    },
    {
      title: 'רשימת אזרחים',
      icon: 'account-multiple',
      count: '158',
      color: '#2196F3',
      onPress: () => navigation.navigate('CitizensList')
    },
    {
      title: 'תלונות פתוחות',
      icon: 'message-alert',
      count: '5',
      color: '#F44336',
      onPress: () => navigation.navigate('ComplaintsList')
    },
    {
      title: 'הפרופיל שלי',
      icon: 'account-cog',
      color: '#9C27B0',
      onPress: () => navigation.navigate('ProfilePage')
    }
  ];

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Title style={styles.welcomeText}>שלום, {userData.firstName}</Title>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('he-IL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
          <IconButton
            icon="logout"
            size={24}
            color="#FFF"
            onPress={handleLogout}
          />
        </View>
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>158</Text>
                <Text style={styles.statLabel}>אזרחים רשומים</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>תלונות חדשות</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>עובדים פעילים</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </View>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Title 
            title="פעילות אחרונה"
            right={(props) => (
              <IconButton {...props} icon="clock-outline" onPress={() => {}} />
            )}
          />
          <Card.Content>
            <View style={styles.activityItem}>
              <Avatar.Icon 
                size={40} 
                icon="account-plus" 
                style={[styles.activityIcon, { backgroundColor: '#4CAF5020' }]}
                color="#4CAF50"
              />
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>עובד חדש נוסף למערכת</Text>
                <Text style={styles.timeText}>לפני 2 שעות</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Avatar.Icon 
                size={40} 
                icon="alert-circle" 
                style={[styles.activityIcon, { backgroundColor: '#F4433620' }]}
                color="#F44336"
              />
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>התקבלה תלונה חדשה</Text>
                <Text style={styles.timeText}>לפני 4 שעות</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  dateText: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'right',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    marginTop: -40,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  statsCard: {
    elevation: 4,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  verticalDivider: {
    height: '100%',
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuCard: {
    width: width / 2 - 24,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  menuCardContent: {
    padding: 20,
  },
  menuIcon: {
    marginBottom: 16,
  },
  menuTextContainer: {
    alignItems: 'flex-start',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
    color: '#1f2937',
  },
  menuCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  activityCard: {
    marginBottom: 24,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  activityIcon: {
    marginLeft: 16,  // Changed from marginRight for RTL
  },
  activityText: {
    flex: 1,
    alignItems: 'flex-end',  // Added for RTL
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'right',
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  }
});

export default ManagerDashboard;