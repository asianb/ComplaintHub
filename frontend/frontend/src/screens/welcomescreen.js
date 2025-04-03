import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeScreen=({ navigation })=> {
  return (
    <LinearGradient
    colors={[ '#FFFFFF','#00b4d8','#00b4d8','#FFFFFF']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>Welcome to ComplaintHub</Text>
        <Text style={styles.subtitle}></Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('loginOption')} // Change 'NextScreen' to your actual route name
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#d3d3d3',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#192f6a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default  WelcomeScreen;

