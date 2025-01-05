import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ComplaintForm from '../screens/ComplaintForm';
import HomePage from '../screens/HomePage';
import ViewComplaints from '../screens/ViewComplaints'; // Add this import
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ManagerDashboard from '../screens/ManagerDashboard';
import EmployeeDashboard from '../screens/EmployeeDashboard';
import EmployeeList from '../screens/EmployeeList'
import ProfilePage from '../screens/ProfilePage'
import ChatInterface from '../screens/chat'
import WelcomeScreen from '../screens/welcomescreen';
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
  <Stack.Navigator initialRouteName="ComplaintForm">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
<Stack.Screen 
        name="ManagerDashboard" 
        component={ManagerDashboard}
        options={{ 
          headerLeft: null,
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="EmployeeDashboard" 
        component={EmployeeDashboard}
        options={{ 
          headerLeft: null,
          headerShown: false 
        }}
        
      />
<Stack.Screen 
  name="EmployeeList" 
  component={EmployeeList}
  options={{
    headerShown: false
  }}
/>

<Stack.Screen 
  name="ProfilePage" 
  component={ProfilePage}
  options={{
    headerShown: false
  }}
/>
<Stack.Screen name="Chat" component={ChatInterface} />

    <Stack.Screen name="HomePage" component={HomePage} options={{ title: 'דף הבית' }} />

    <Stack.Screen name="ComplaintForm" component={ComplaintForm} />
    <Stack.Screen 
      name="ViewComplaints" 
      component={ViewComplaints} />
  </Stack.Navigator>
);

export default AppNavigator;