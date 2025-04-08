//Navigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
// import loginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ComplaintForm from '../screens/ComplaintForm';
import ViewComplaints from '../screens/ViewComplaints';
import ManagerDashboard from '../screens/ManagerDashboard';
import EmployeeDashboard from '../screens/EmployeeDashboard';
import EmployeeList from '../screens/EmployeeList';
import ProfilePage from '../screens/ProfilePage';
import ChatInterface from '../screens/chat';
// import WelcomeScreen from '../screens/welcomescreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SendComplaint from '../screens/SendComplaint';
import LoginScreen from '../screens/LoginScreen';
import loginOption from '../screens/loginOption'
import Login from '../screens/Login'
import Register from '../screens/Register'
import HomePage from '../screens/homePageC'
import CitizenList from '../screens/CitizenList'
// import ProfileScreen from '../screens/ProfileScreen'
import CitizenDashboard from '../screens/CitizenDashboard'
import SpeechToTextApp from '../screens/SpeechToTextApp'

const Tab = createBottomTabNavigator();
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Profile') {
          iconName = 'person';
        } else if (route.name === 'SendComplaint') {
          iconName = 'send';  // Changed to appropriate icon
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FFD700',
      tabBarInactiveTintColor: '#00b4d8',
    })}
  >
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="SendComplaint" component={SendComplaint} />
  </Tab.Navigator>
);

const Stack = createStackNavigator();
const AppNavigator = () => (
  <Stack.Navigator initialRouteName="SpeechToTextApp">
    <Stack.Screen name="loginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen   name="ManagerDashboard" component={ManagerDashboard} options={{ headerLeft: null, headerShown: false  }}    />
    <Stack.Screen  name="EmployeeDashboard" component={EmployeeDashboard} options={{headerLeft: null,headerShown: false  }} />
    <Stack.Screen name="EmployeeList" component={EmployeeList} options={{headerShown: false}}/>
    <Stack.Screen name="CitizenList" component={CitizenList} options={{headerShown: false}}/>
    <Stack.Screen name="ProfilePage"  component={ProfilePage}options={{headerShown: false}} />


    <Stack.Screen name="Chat" component={ChatInterface} />
    {/* <Stack.Screen name="ComplaintForm" component={ComplaintForm} /> */}
    <Stack.Screen name="ViewComplaints" component={ViewComplaints} />
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    <Stack.Screen name="loginOption" component={loginOption} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="HomePage" component={HomePage} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="CitizenDashboard" component={CitizenDashboard} />



    <Stack.Screen name="SpeechToTextApp" component={SpeechToTextApp} />




    
  </Stack.Navigator>
);

export default AppNavigator;