import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // הגדרת אייקונים לפי שם המסך
          if (route.name === 'Article') {
            iconName = 'article';
          } else if (route.name === 'Chat') {
            iconName = 'chat';
          } else if (route.name === 'Contacts') {
            iconName = 'contacts';
          } else if (route.name === 'Albums') {
            iconName = 'photo-album';
          }

          // החזרת אייקון מתאים
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00b4d8', // צבע כאשר הטאב פעיל
        tabBarInactiveTintColor: '#000000', // צבע כאשר הטאב לא פעיל
      })}
    >
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="SendComplaint" component={SendComplaint} />
      <Tab.Screen name="My complaints" component={MyComplaints} />

      {/* <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Albums" component={AlbumsScreen} /> */}
    </Tab.Navigator>
  );
};
export default HomePage;
