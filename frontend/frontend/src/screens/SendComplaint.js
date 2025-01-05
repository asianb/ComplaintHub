import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const SendComplaint = () => (
    <View style={styles.screen}>
      <Text style={styles.text}>SendComplaint Screen</Text>
    </View>
  );

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

export default SendComplaint;
