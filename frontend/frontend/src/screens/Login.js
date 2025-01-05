import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function Login({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  

  function handleSubmit() {
    console.log("Login button pressed");
    
    const userData = {
      id: id,
      password: password,
    };
  
    axios.post("http://10.0.0.4:5001/login-user", userData)
      .then(res => {
        console.log("Server response:", res.data);
        if (res.data.status === "ok") {
          Alert.alert("הצלחה", res.data.message, [
            {
              text: "OK",
              onPress: () => navigation.navigate('HomePage')
            }
          ]);
        }
      })
      .catch(err => {
        console.log("Error details:", err.response?.data);
        
        const errorMessage = err.response?.data?.message || "אירעה שגיאה, אנא נסי שוב";
        
        Alert.alert("שגיאה", errorMessage);
      });
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
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
          <Text style={styles.label}>ID</Text>
          <TextInput
            placeholder="Enter your ID"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            value={id}
            onChangeText={setId}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={()=>handleSubmit()}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: -20 },
  backButton: { backgroundColor: '#FFD700', padding: 10, borderRadius: 10, margin: 10 },
  illustrationContainer: { alignItems: 'center', marginTop: -20 },
  illustration: { width: 200, height: 200, resizeMode: 'contain' },
  formContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, marginHorizontal: 10 },
  label: { fontSize: 16, fontWeight: '400', marginVertical: 10, color: '#333' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginVertical: 10, color: '#000' },
  forgotPassword: { alignItems: 'flex-end', marginVertical: 5 },
  forgotPasswordText: { color: '#A9A9A9', fontSize: 14 },
  loginButton: { backgroundColor: '#FFD700', paddingVertical: 15, borderRadius: 10, marginVertical: 20 },
  loginButtonText: { textAlign: 'center', color: '#000', fontSize: 16, fontWeight: 'bold' },
  signUpContainer: { alignItems: 'center', marginTop: 10 },
  signUpText: { color: '#333', fontSize: 14 },
  signUpLink: { color: '#318CE7', fontSize: 14, fontWeight: 'bold' },
});
