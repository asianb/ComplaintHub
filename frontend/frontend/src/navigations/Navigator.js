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
import EmployeeComplaints from '../screens/EmployeeComplaints'
import AddResponse from '../screens/AddResponse'
import ComplaintDetails from '../screens/ComplaintDetails'
import AssignedComplaints from '../screens/AssignedComplaints'
import MyComplaints from '../screens/MyComplaints'
import CitizenComplaintDetails from '../screens/CitizenComplaintDetails';
import FeedbackDashboard from '../screens/FeedbackDashboard'
import EmployeeComplaintDetails from '../screens/EmployeeComplaintDetails'
import CalendarWithTasks from '../screens/CalendarWithTasks'



import AdminMainScreen from '../screens/AdminMainScreen'
import TrendsReportScreen from '../screens/TrendsReportScreen'
import HighRiskComplaintsScreen  from '../screens/HighRiskComplaintsScreen';
import AIAnalysisScreen from '../screens/AIAnalysisScreen'
import AdminAIDashboard from '../screens/AdminAIDashboard'

import AdminTabNavigator from '../screens/AdminNavigation'

import UnifiedManagerDashboard from '../screens/AdminDashboard'
import EmployeeFollowUpManagement from '../screens/EmployeeFollowUpManagement'


import SimpleGuestComplaintForm from '../screens/SimpleGuestComplaintForm'

import ForgotPassword from '../screens/ForgotPassword'

import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'

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
  <Stack.Navigator initialRouteName="WelcomeScreen">
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
    <Stack.Screen name="EmployeeComplaints" component={EmployeeComplaints} />
    <Stack.Screen name="AddResponse" component={AddResponse} />
    <Stack.Screen name="ComplaintDetails" component={ComplaintDetails} />
    <Stack.Screen name="ComplaintForm" component={ComplaintForm} />
    <Stack.Screen name="AssignedComplaints" component={AssignedComplaints} />
    <Stack.Screen name="MyComplaints" component={MyComplaints} />
    <Stack.Screen name="CitizenComplaintDetails" component={CitizenComplaintDetails} options={{ headerShown: false }}/>
    <Stack.Screen name="FeedbackDashboard" component={FeedbackDashboard} options={{ headerShown: false }}/>
    <Stack.Screen name="EmployeeComplaintDetails" component={EmployeeComplaintDetails} options={{ headerShown: false }}/>
    <Stack.Screen name="CalendarWithTasks" component={CalendarWithTasks} options={{ headerShown: false }}/>
   
   
    <Stack.Screen name="AdminMainScreen" component={AdminMainScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="AIAnalysisScreen" component={AIAnalysisScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="HighRiskComplaintsScreen" component={HighRiskComplaintsScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="TrendsReportScreen" component={TrendsReportScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="AdminAIDashboard" component={AdminAIDashboard} options={{ headerShown: false }}/>
  <Stack.Screen name="AdminDashboard" component={AdminTabNavigator} />

  <Stack.Screen name="newAdminDashboard" component={UnifiedManagerDashboard} />

  
  <Stack.Screen name="EmployeeFollowUpManagement" component={EmployeeFollowUpManagement} />

  <Stack.Screen name="SimpleGuestComplaintForm" component={SimpleGuestComplaintForm} />

<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
<Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />

    
  </Stack.Navigator>
);

export default AppNavigator;