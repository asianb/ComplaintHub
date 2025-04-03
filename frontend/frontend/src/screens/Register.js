import React, { useState } from 'react';
import {Text,View,TextInput,TouchableOpacity,Alert,ScrollView,} from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#C0C0C0',
  primary: '#4CAF50',
  yellow: '#FFD700',
  green: '#32CD32',
  red: '#FF0000',
};


const Register = () => {
  const navigation=useNavigation();

  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(false);

  const [id, setId] = useState('');
  const [idValid, setIdValid] = useState(false);

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Handlers
  const handleName = (text) => {
    setName(text);
    setNameValid(text.length > 1);
  };

  const handleId = (text) => {
    setId(text);
    setIdValid(/^\d{9}$/.test(text)); // ת"ז חייבת להיות בת 9 ספרות
  };

  const handleEmail = (text) => {
    setEmail(text);
    setEmailValid(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text)); // אימייל תקין
  };

  const handlePhone = (text) => {
    setPhone(text);
    setPhoneValid(/^05\d{8}$/.test(text)); // מספר טלפון תקין: מתחיל ב-05 ואורך 10 ספרות
  };

  const handlePassword = (text) => {
    setPassword(text);
    setPasswordValid(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,10}$/.test(text)); // סיסמה באורך 8-10, אותיות גדולות, קטנות, ספרות, וסימנים מיוחדים
  };

  const handleConfirmPassword = (text) => {
    setConfirmPassword(text);
    setConfirmPasswordValid(text === password); // בדיקה אם הסיסמה תואמת
  };

 
  
// Client-side (React Native)
// Updated connection and registration handling
const SERVER_URL = "http://172.19.36.139:5001";


const handleSignUp = async () => {
  if (!nameValid || !idValid || !emailValid || !phoneValid || !passwordValid || !confirmPasswordValid) {
    Alert.alert('Validation Error', 'Please fill all fields correctly.');
    return;
  }
  console.log('Starting signup process...');

  try {
    //  // Test basic fetch first
    //  console.log('Testing basic fetch...');
    //  const testFetch = await fetch('http://10.0.0.4:5001/test');
    //  const testData = await testFetch.json();
    //  console.log('Basic fetch test result:', testData);
 
    //  // Then try the actual connection test
    //  const isConnected = await testConnection();
    //  console.log('Connection test result:', isConnected);
     
    //  if (!isConnected) {
    //    console.log('Connection test failed');
    //    return;
    //  }

    const userData = {
      name,
      id,
      email,
      phone,
      password,
      confirmPassword
    };

    const response = await axios.post(`${SERVER_URL}/Register`, userData, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === "success") {
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login')
      
    
      // Add navigation logic here if needed
    } else if (response.data.status === "error" && response.data.message) {
      Alert.alert('Error', response.data.message); // אם יש הודעה של שגיאה מהשרת (כמו תעודת זהות קיימת)
    }else {
      Alert.alert('Error', response.data.message || 'Registration failed');
    }
  } catch (error) {
    let errorMessage = 'An error occurred during registration';
    
    if (error.response) {
      // Server responded with an error
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (!error.response) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    Alert.alert('Error', errorMessage);
    console.error('Registration error:', error);
  }
};

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginVertical: 10 }}>
            Create Account
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.black, marginBottom: 20 }}>
            Fill in your personal details
          </Text>

          {/* Full Name */}
          <View style={{ marginBottom: 15 }}>
            <Text>Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              style={{
                borderColor: nameValid ? COLORS.green : COLORS.red,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
              }}
              onChangeText={handleName}
            />
            {!nameValid && name.length > 0 && (
              <Text style={{ color: COLORS.red }}>Name should be more than 1 character.</Text>
            )}
          </View>

          {/* ID */}
          <View style={{ marginBottom: 15 }}>
            <Text>ID</Text>
            <TextInput
              placeholder="Enter your ID"
              keyboardType="numeric"
              style={{
                borderColor: idValid ? COLORS.green : COLORS.red,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
              }}
              onChangeText={handleId}
            />
            {!idValid && id.length > 0 && (
              <Text style={{ color: COLORS.red }}>ID must be exactly 9 digits.</Text>
            )}
          </View>

          {/* Email */}
          <View style={{ marginBottom: 15 }}>
            <Text>Email Address</Text>
            <TextInput
              placeholder="Enter your email address"
              keyboardType="email-address"
              style={{
                borderColor: emailValid ? COLORS.green : COLORS.red,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
              }}
              onChangeText={handleEmail}
            />
            {!emailValid && email.length > 0 && (
              <Text style={{ color: COLORS.red }}>Enter a valid email address.</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={{ marginBottom: 15 }}>
            <Text>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              keyboardType="numeric"
              style={{
                borderColor: phoneValid ? COLORS.green : COLORS.red,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
              }}
              onChangeText={handlePhone}
              maxLength={10}
            />
            {!phoneValid && phone.length > 0 && (
              <Text style={{ color: COLORS.red }}>Phone number must start with 05 and be 10 digits long.</Text>
            )}
          </View>

          {/* Password */}
          <View style={{ marginBottom: 15 }}>
            <Text>Password</Text>
            <TextInput
              placeholder="Enter your password"
              secureTextEntry={!isPasswordShown}
              style={{
                borderColor: passwordValid ? COLORS.green : COLORS.red,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
              }}
              onChangeText={handlePassword}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 12, top: 12 }}
              onPress={() => setIsPasswordShown(!isPasswordShown)}
            >
              <Ionicons name={isPasswordShown ? 'eye' : 'eye-off'} size={24} color={COLORS.black} />
            </TouchableOpacity>
            {!passwordValid && password.length > 0 && (
              <Text style={{ color: COLORS.red }}>
                Password must be 8-10 characters, include uppercase, lowercase, numbers, and special characters.
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={{ marginBottom: 15 }}>
            <Text>Confirm Password</Text>
            <TextInput
              placeholder="Confirm your password"
              secureTextEntry={!isPasswordShown}
              style={{
                borderColor: confirmPasswordValid ? COLORS.green : COLORS.red,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
              }}
              onChangeText={handleConfirmPassword}
            />
            {!confirmPasswordValid && confirmPassword.length > 0 && (
              <Text style={{ color: COLORS.red }}>Passwords do not match.</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.yellow,
              height: 48,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}
            onPress={()=>handleSignUp()}
          >
            <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold' }}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;
