import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const loginOption = () => {
  const navigation = useNavigation(); // שימוש ב-Hook

  return (
    <LinearGradient
      colors={['#FFFFFF', '#00b4d8', '#00b4d8', '#FFFFFF']}
      start={{ x: 1, y: 4 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>Select Your Role</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Login')}
        >
          <Image
            source={{ uri: 'https://img.icons8.com/ios/50/000000/user-male-circle.png' }}
            style={styles.icon}
          />
          <Text style={styles.label}>Citizen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} 
            onPress={() => navigation.navigate('loginScreen')}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios/50/000000/admin-settings-male.png' }}
            style={styles.icon}
          />
          <Text style={styles.label}>Manager</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => alert('Guest Selected')}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios/50/000000/guest-male.png' }}
            style={styles.icon}
          />
          <Text style={styles.label}>Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} 
            onPress={() => navigation.navigate('loginScreen')}>
                          <Image
            source={{ uri: 'https://img.icons8.com/ios/50/000000/conference-call.png' }}
            style={styles.icon}
          />
          <Text style={styles.label}>Employee</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default loginOption;