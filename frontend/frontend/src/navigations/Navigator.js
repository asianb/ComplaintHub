import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import WelcomeScreen from '../screens/welcomescreen';
import LoginScreen from '../screens/loginScreen';
import HomeTabs from '../screens/homePageC'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import SendComplaint from '../screens/SendComplaint';



const Tab = createBottomTabNavigator();
const HomePage = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        } 
        // else if (route.name === 'Settings') {
        //   iconName = 'settings';
        // }
        return <Icon name={iconName} size={size} color={color} />;
        

      },
      tabBarActiveTintColor: '#FFD700',
      tabBarInactiveTintColor: '#00b4d8',
    })}
  >
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="SendComplaint" component={SendComplaint} />
    {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
  </Tab.Navigator>
);
const Stack = createStackNavigator();
const AppNavigator = () => (
  
  
  <Stack.Navigator
  screenOptions={{
    headerShown: false,
  }}>
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="HomePage" component={HomePage} />
    

  </Stack.Navigator>
);

export default AppNavigator;