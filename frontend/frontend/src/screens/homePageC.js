// import React from 'react';
// import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

// const HomePage = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>ברוך הבא למערכת!</Text>
      
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('Profile')}>
//           <Text style={styles.buttonText}>לפרופיל שלי</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('Settings')}>
//           <Text style={styles.buttonText}>הגדרות</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => alert('התנתקות')}>
//           <Text style={styles.buttonText}>התנתקות</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     width: '80%',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default HomePage;


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
        tabBarActiveTintColor: '#ff0000', // צבע כאשר הטאב פעיל
        tabBarInactiveTintColor: '#808080', // צבע כאשר הטאב לא פעיל
      })}
    >
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="SendComplaint" component={SendComplaint} />
      {/* <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Albums" component={AlbumsScreen} /> */}
    </Tab.Navigator>
  );
};
export default HomePage;
