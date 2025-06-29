// AdminNavigation.js - מערכת ניווט למנהל העירייה
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// ייבוא המסכים
import AdminAIDashboard from './AdminAIDashboard';
import AIAnalysisScreen from './AIAnalysisScreen';
import HighRiskComplaintsScreen from './HighRiskComplaintsScreen';
import TrendsReportScreen from './TrendsReportScreen';
import AdminMainScreen from './AdminMainScreen'; // מסך ראשי למנהל
// import ComplaintDetailsScreen from './ComplaintDetailsScreen'; // פרטי תלונה
// import SettingsScreen from './SettingsScreen'; // הגדרות

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator עבור AI Dashboard וכל המסכים הקשורים
const AIDashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="AIDashboardMain" 
        component={AdminAIDashboard}
        options={{ title: 'דשבורד AI' }}
      />
      <Stack.Screen 
        name="AIAnalysis" 
        component={AIAnalysisScreen}
        options={{ title: 'ניתוח AI מפורט' }}
      />
      <Stack.Screen 
        name="HighRiskComplaints" 
        component={HighRiskComplaintsScreen}
        options={{ title: 'תלונות בסיכון גבוה' }}
      />
      <Stack.Screen 
        name="TrendsReport" 
        component={TrendsReportScreen}
        options={{ title: 'דוח מגמות' }}
      />
      <Stack.Screen 
        name="ComplaintDetails" 
        component={ComplaintDetailsScreen}
        options={{ title: 'פרטי תלונה' }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator עבור המסך הראשי
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="AdminMainScreen" 
        component={AdminMainScreen}
        options={{ title: 'דשבורד ראשי' }}
      />
      <Stack.Screen 
        name="ComplaintDetails" 
        component={ComplaintDetailsScreen}
        options={{ title: 'פרטי תלונה' }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator עבור הגדרות
const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen}
        options={{ title: 'הגדרות' }}
      />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator ראשי
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AIDashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingVertical: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={MainStack}
        options={{
          tabBarLabel: 'דשבורד',
        }}
      />
      <Tab.Screen 
        name="AIDashboard" 
        component={AIDashboardStack}
        options={{
          tabBarLabel: 'AI ניתוח',
          tabBarBadge: '🤖',
          tabBarBadgeStyle: {
            backgroundColor: '#4CAF50',
            color: '#fff',
            fontSize: 10,
          }
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={{
          tabBarLabel: 'הגדרות',
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;