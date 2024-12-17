import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/Navigator';
import * as Font from 'expo-font';

export default class App extends React.Component {
  state = {
    isFontLoaded: false,
  };

  async componentDidMount() {
    await this.loadFonts();
  }

  async loadFonts() {
    try {
      await Font.loadAsync({
        SemiBold: require('./src/fonts/NotoSerif_Condensed-SemiBold.ttf'),
        Medium: require('./src/fonts/NotoSerif-Medium.ttf'),
        Regular: require('./src/fonts/NotoSerif-Regular.ttf'),
      });
      this.setState({ isFontLoaded: true });
    } catch (err) {
      console.error('Error loading fonts', err);
    }
  }

  render() {
    const { isFontLoaded } = this.state;

    if (!isFontLoaded) {
      // Show a loading indicator while fonts are loading
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
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