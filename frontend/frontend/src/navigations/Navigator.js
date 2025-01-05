/* import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {createAppContainer} from 'react-navigation'
import Login from '../screens/Login';
import Register from '../screens/Register'
// import Home from '../screens/Home'
// import Details from '../screens/Details'

const stackNavigatorOption={
    headerShown:false
}
const AppNavigator = createStackNavigator({
    Login:{screen:Login},
    Register:{screen:Register}
},
{
    defaultNavigationOptions: stackNavigatorOption

}
);

export default AppNavigator;





// const stack = createStaticNavigation();
// const screenOptionStyle={
//     headerShown:false
// }
// const HomeStackNavigator= () => {
//     return(
//         <Stack.Navigator screenOptions={screenOptionStyle}>
//             <Stack.Screen name="Home" component={Home} />
//             <Stack.Screen name="Detail" component={Detail} />

//         </Stack.Navigator>
//     );
// };

 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import Login from '../screens/Login';
// import Register from '../screens/Register';
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