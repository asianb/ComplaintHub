import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Surface, Text, Card, Title, Button, Avatar, IconButton, useTheme, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


import { Activity, Calendar, Clock, UserCheck } from 'lucide-react';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://172.19.36.139:3000/api';


const MenuCard = ({ title, icon, color, onPress }) => (
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
      </View>
    </Card.Content>
  </Card>
);

const EmployeeDashboard = ({ navigation }) => {
  const theme = useTheme();
  const [employeeName, setEmployeeName] = useState('');
  const [userData, setUserData] = useState('');
  const managerUserId = '213245100'; // ודא שזה ID תקני

  useEffect(() => {
    fetchProfile();
    fetchManagerData('213245100');
  }, []);
  const fetchManagerData = async (managerUserId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${managerUserId}`);
      console.log('Manager Data:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('Response Error:', error.response.data);
        console.log('Response Status:', error.response.status);
      } else if (error.request) {
        console.log('Request Error:', error.request);
      } else {
        console.log('Error Message:', error.message);
      }
      console.error('Error fetching manager data:', error);
    }
  };
  
  const fetchProfile = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
  
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userRole');
    navigation.replace('loginScreen');
  };
  const navigateToChat = async (managerUserId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users/${managerUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const managerData = response.data;
      console.log('Manager Data:', managerData);
  
      // Pass managerData as selectedUser when navigating to ChatInterface
      navigation.navigate('Chat', { currentUser: userData, selectedUser: managerData });
    } catch (error) {
      console.error('Error fetching manager data:', error);
    }
  };
  
  
  
  const menuItems = [
    {
      title: 'תלונות במערכת',
      icon: 'alert-box',
      color: '#F44336',
      onPress: () => navigation.navigate('ComplaintsPage')
    },
    {
      title: 'לוח פגישות',
      icon: 'calendar',
      color: '#4CAF50',
      onPress: () => navigation.navigate('SchedulePage')
    },
   
      {
        title: 'צ\'אט עם המנהל',
        icon: 'chat',
        color: '#2196F3',
        onPress: () => {
          console.log('Chat Button Pressed');
          navigateToChat('213245100'); // שליחה של מזהה המנהל
        }
      },
     
    {
      title: 'הפרופיל שלי',
      icon: 'account',
      color: '#9C27B0',
      onPress: () => navigation.navigate('ProfilePage')
    },
  ];

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <View>
          <Title style={styles.welcomeText}>שלום, {userData ? userData.firstName : '.'}</Title>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('he-IL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
          <IconButton icon="logout" size={24} color="#FFF" onPress={handleLogout} />
        </View>
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </View>
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
  },
  dateText: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: width / 2 - 24,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    borderRadius: 20,
    backgroundColor: '#ffffff',
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
    textAlign: 'right',
    color: '#1f2937',
  },
});

export default EmployeeDashboard;
