// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { ArrowLeftIcon } from 'react-native-heroicons/outline';
// import { ScrollView } from 'react-native-gesture-handler';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Login({ navigation }) {
//   const [id, setId] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

  

//   async function handleSubmit() {
//     console.log("Login button pressed");
    
//     // const userData = {
//     //   id: id,
//     //   password: password,
//     // };
//     if (!id || !password) {
//       Alert.alert('שגיאה', 'נא למלא את כל השדות');
//       return;
//     }
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://172.19.36.84:5001/login-user', {
//         id,
//         password
//       });

//       if (response.data.status === 'ok') {
//         // Save token
//         await AsyncStorage.setItem('userToken', response.data.data);
//         // Save user ID (might be useful for future features)
//         await AsyncStorage.setItem('userId', id);
        
//         Alert.alert('הצלחה', response.data.message);
//         navigation.replace('CitizenDashboard'); 
//       }
//     } catch (error) {
//       console.log("Error details:", error.response?.data);

//       let errorMessage = 'שגיאה בהתחברות';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       Alert.alert('שגיאה', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//     // axios.post("http://172.19.36.139:5001/login-user", userData)
//     //   .then(res => {
//     //     console.log("Server response:", res.data);
//     //     if (res.data.status === "ok") {
//     //       Alert.alert("הצלחה", res.data.message, [
//     //         {
//     //           text: "OK",
//     //           onPress: () => navigation.navigate('HomePage')
//     //         }
//     //       ]);
//     //     }
//     //   })
//     //   .catch(err => {
//     //     console.log("Error details:", err.response?.data);
        
//     //     const errorMessage = err.response?.data?.message || "אירעה שגיאה, אנא נסי שוב";
        
//     //     Alert.alert("שגיאה", errorMessage);
//     //   });
//   }


//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
//       <LinearGradient
//         colors={['#FFFFFF', '#00b4d8', '#00b4d8', '#FFFFFF']} 
//         start={{ x: 1, y: 1 }}
//         end={{ x: 0.5, y: 0 }}
//         style={styles.container}
//       >
//         <SafeAreaView>
//           <View style={styles.header}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <ArrowLeftIcon size={20} color="black" />
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>

//         <View style={styles.illustrationContainer}>
//           <Image
//             source={require('../images/img9.png')}
//             style={styles.illustration}
//           />
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.label}>ID</Text>
//           <TextInput
//             placeholder="Enter your ID"
//             placeholderTextColor="#A9A9A9"
//             style={styles.input}
//             value={id}
//             onChangeText={setId}
//           />

//           <Text style={styles.label}>Password</Text>
//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#A9A9A9"
//             style={styles.input}
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity style={styles.forgotPassword}>
//             <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.loginButton} onPress={()=>handleSubmit()}>
//             <Text style={styles.loginButtonText}>Login</Text>
//           </TouchableOpacity>

//           <View style={styles.signUpContainer}>
//             <Text style={styles.signUpText}>
//               Don't have an account?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//                 <Text style={styles.signUpLink}>Sign Up</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         </View>
//       </LinearGradient>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', alignItems: 'center', padding: -20 },
//   backButton: { backgroundColor: '#FFD700', padding: 10, borderRadius: 10, margin: 10 },
//   illustrationContainer: { alignItems: 'center', marginTop: -20 },
//   illustration: { width: 200, height: 200, resizeMode: 'contain' },
//   formContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, marginHorizontal: 10 },
//   label: { fontSize: 16, fontWeight: '400', marginVertical: 10, color: '#333' },
//   input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginVertical: 10, color: '#000' },
//   forgotPassword: { alignItems: 'flex-end', marginVertical: 5 },
//   forgotPasswordText: { color: '#A9A9A9', fontSize: 14 },
//   loginButton: { backgroundColor: '#FFD700', paddingVertical: 15, borderRadius: 10, marginVertical: 20 },
//   loginButtonText: { textAlign: 'center', color: '#000', fontSize: 16, fontWeight: 'bold' },
//   signUpContainer: { alignItems: 'center', marginTop: 10 },
//   signUpText: { color: '#333', fontSize: 14 },
//   signUpLink: { color: '#318CE7', fontSize: 14, fontWeight: 'bold' },
// });


import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Surface, Title, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!id || !password) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.4:5001/login-user', {
        id,
        password,
      });

      if (response.data.status === 'ok') {
        await AsyncStorage.setItem('userToken', response.data.data);
        await AsyncStorage.setItem('userId', id);
        Alert.alert('הצלחה', response.data.message);
        navigation.replace('CitizenDashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'שגיאה בהתחברות';
      Alert.alert('שגיאה', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <Title style={styles.welcomeText}>ברוך הבא</Title>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('he-IL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </Surface>

      <KeyboardAvoidingView style={styles.formWrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>תעודת זהות</Text>
          <TextInput
            placeholder="הכנס תעודת זהות"
            style={styles.input}
            value={id}
            onChangeText={setId}
            placeholderTextColor="#9CA3AF"
            textAlign="right"

          />

          <Text style={styles.label}>סיסמה</Text>
          <TextInput
            placeholder="הכנס סיסמה"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#9CA3AF"
            textAlign="right"

          />

          <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>התחבר</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
             <Text style={styles.forgotPasswordText}>שכחת סיסמה?</Text>
            </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>אין לך חשבון? הרשם</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
  },
  headerTop: {
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateText: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    textAlign:"right"
  },
  input: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 16,
    color: '#4f46e5',
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  forgotPasswordText: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
  labelRight: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 10,
    color: '#333',
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  
});
