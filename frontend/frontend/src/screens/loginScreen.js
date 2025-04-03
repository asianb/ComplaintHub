
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!idNumber || !password) {
      Alert.alert("שגיאה", "נא להזין תעודת זהות וסיסמה");
      return;
    }

    try {
      const response = await axios.post('http://172.19.36.139:3000/api/login', {
        idNumber,
        password
      });
      
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userRole', response.data.user.role);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      Alert.alert("הצלחה", "התחברת בהצלחה!");

      if (response.data.user.role === 'manager') {
        navigation.replace('ManagerDashboard');
      } else {
        navigation.replace('EmployeeDashboard');
      }
    } catch (error) {
      Alert.alert(
        "שגיאה בהתחברות",
        error.response?.data?.error || 'אנא בדקי את החיבור לאינטרנט ונסי שוב'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
      <LinearGradient
        colors={['#FFFFFF', '#00b4d8', '#00b4d8', '#FFFFFF']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.container}
      >
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon size={20} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.illustrationContainer}>
          <Image
            source={require('../images/img9.png')}
            style={styles.illustration}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>מערכת ניהול תלונות</Text>
          
          <Text style={styles.label}>תעודת זהות</Text>
          <TextInput
            placeholder="הכנס תעודת זהות"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            value={idNumber}
            onChangeText={setIdNumber}
            keyboardType="numeric"
            maxLength={9}
          />

          <Text style={styles.label}>סיסמה</Text>
          <TextInput
            placeholder="סיסמה"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>שכחת סיסמה?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>התחבר</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              אין לך חשבון?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.signUpLink}>הרשם</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: -20 
  },
  backButton: { 
    backgroundColor: '#FFD700', 
    padding: 10, 
    borderRadius: 10, 
    margin: 10 
  },
  illustrationContainer: { 
    alignItems: 'center', 
    marginTop: -20 
  },
  illustration: { 
    width: 200, 
    height: 200, 
    resizeMode: 'contain' 
  },
  formContainer: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    marginHorizontal: 10 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  label: { 
    fontSize: 16, 
    fontWeight: '400', 
    marginVertical: 10, 
    color: '#333',
    textAlign: 'right'
  },
  input: { 
    backgroundColor: '#F5F5F5', 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 10, 
    color: '#000',
    textAlign: 'right'
  },
  forgotPassword: { 
    alignItems: 'flex-start', 
    marginVertical: 5 
  },
  forgotPasswordText: { 
    color: '#A9A9A9', 
    fontSize: 14 
  },
  loginButton: { 
    backgroundColor: '#FFD700', 
    paddingVertical: 15, 
    borderRadius: 10, 
    marginVertical: 20 
  },
  loginButtonText: { 
    textAlign: 'center', 
    color: '#000', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  signUpContainer: { 
    alignItems: 'center', 
    marginTop: 10 
  },
  signUpText: { 
    color: '#333', 
    fontSize: 14 
  },
  signUpLink: { 
    color: '#318CE7', 
    fontSize: 14, 
    fontWeight: 'bold' 
  }
});


