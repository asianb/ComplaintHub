import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/Navigator';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

export default class App extends React.Component {
  state = {
    isFontLoaded: false,
  };

  async loadFonts() {
    await Font.loadAsync({
      SemiBold: require('./src/fonts/NotoSerif_Condensed-SemiBold.ttf'),
      Medium: require('./src/fonts/NotoSerif-Medium.ttf'),
      Regular: require('./src/fonts/NotoSerif-Regular.ttf'),
    });
  }

  render() {
    const { isFontLoaded } = this.state;

    if (!isFontLoaded) {
      return (
        <AppLoading
          startAsync={() => this.loadFonts()}
          onFinish={() => this.setState({ isFontLoaded: true })}
          onError={(err) => console.error(err)}
        />
      );
    }

    return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
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