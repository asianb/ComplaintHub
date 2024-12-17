import React from 'react'
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

export default createAppContainer (AppNavigator);





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

