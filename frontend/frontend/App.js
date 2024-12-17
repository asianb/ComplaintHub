import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigations/Navigator';
import React from 'react';
import * as Font from 'expo-font';
// import {AppLoading} from 'expo';
import AppLoading from 'expo-app-loading';



export default class App extends React.Component {
  state={
    isFontLoaded:false
  }

  async componentDidMount(){
    await Font.loadAsync({
      'SemiBold':require('./src/fonts/NotoSerif_Condensed-SemiBold.ttf'),
      'Medium':require('./src/fonts/NotoSerif-Medium.ttf'),
      'Regular':require('./src/fonts/NotoSerif-Regular.ttf'),

    });
    this.setState({isFontLoaded:true})
  }

  render(){
    return (
      (this.state.isFontLoaded===true)?(<AppNavigator/>):(AppLoading)
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
