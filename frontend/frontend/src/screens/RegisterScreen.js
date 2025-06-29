
// // // RegisterScreen.js
// // import React, { useState } from 'react';
// // import { View, StyleSheet, ScrollView } from 'react-native';
// // import { TextInput, Button, Title, Surface, RadioButton } from 'react-native-paper';
// // import axios from 'axios';

// // const RegisterScreen = ({ navigation }) => {
// //   const [idNumber, setIdNumber] = useState('');
// //   const [firstName, setFirstName] = useState('');
// //   const [lastName, setLastName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [phoneNumber, setPhoneNumber] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [role, setRole] = useState('employee');

// //   const handleRegister = async () => {
// //     try {
// //       await axios.post('http://172.19.36.139:3000/api/register', {
// //         idNumber,
// //         firstName,
// //         lastName,
// //         email,
// //         phoneNumber,
// //         password,
// //         role
// //       });
     
// //       alert('ההרשמה בוצעה בהצלחה');
// //       navigation.navigate('Login');
// //     } catch (error) {
// //       alert(error.response?.data?.error || 'ההרשמה נכשלה');
// //     }
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Surface style={styles.surface}>
// //         <Title style={styles.title}>הרשמה למערכת</Title>
// //         <TextInput
// //           label="מספר זהות"
// //           value={idNumber}
// //           onChangeText={setIdNumber}
// //           style={styles.input}
// //           mode="outlined"
// //           keyboardType="numeric"
// //           maxLength={9}
// //         />
// //         <TextInput
// //           label="שם פרטי"
// //           value={firstName}
// //           onChangeText={setFirstName}
// //           style={styles.input}
// //           mode="outlined"
// //         />
// //         <TextInput
// //           label="שם משפחה"
// //           value={lastName}
// //           onChangeText={setLastName}
// //           style={styles.input}
// //           mode="outlined"
// //         />
// //         <TextInput
// //           label="דואר אלקטרוני"
// //           value={email}
// //           onChangeText={setEmail}
// //           keyboardType="email-address"
// //           style={styles.input}
// //           mode="outlined"
// //         />
// //         <TextInput
// //           label="מספר טלפון"
// //           value={phoneNumber}
// //           onChangeText={setPhoneNumber}
// //           keyboardType="phone-pad"
// //           style={styles.input}
// //           mode="outlined"
// //         />
// //         <TextInput
// //           label="סיסמה"
// //           value={password}
// //           onChangeText={setPassword}
// //           secureTextEntry
// //           style={styles.input}
// //           mode="outlined"
// //         />
// //         <View style={styles.radioContainer}>
// //           <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
// //             <View style={styles.radioButton}>
// //               <RadioButton.Item label="עובד" value="employee" />
// //             </View>
// //             <View style={styles.radioButton}>
// //               <RadioButton.Item label="מנהל" value="manager" />
// //             </View>
// //           </RadioButton.Group>
// //         </View>
// //         <Button mode="contained" onPress={handleRegister} style={styles.button}>
// //           הרשם
// //         </Button>
// //         <Button
// //           mode="text"
// //           onPress={() => navigation.navigate('Login')}
// //           style={styles.button}
// //         >
// //           חזור להתחברות
// //         </Button>
// //       </Surface>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#f5f5f5'
// //   },
// //   surface: {
// //     padding: 20,
// //     elevation: 4,
// //     borderRadius: 10,
// //     marginVertical: 20
// //   },
// //   title: {
// //     textAlign: 'center',
// //     marginBottom: 20
// //   },
// //   input: {
// //     marginBottom: 10
// //   },
// //   radioContainer: {
// //     marginVertical: 10
// //   },
// //   radioButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center'
// //   },
// //   button: {
// //     marginTop: 10
// //   }
// // });

// // export default RegisterScreen;

// // RegisterScreen.js
// import React, { useState } from 'react';
// import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

// const COLORS = {
//   black: '#000000',
//   white: '#FFFFFF',
//   gray: '#C0C0C0',
//   primary: '#4CAF50',
//   yellow: '#FFD700',
//   green: '#32CD32',
//   red: '#FF0000',
// };

// const RegisterScreen = () => {
//   const navigation = useNavigation();

//   const [idNumber, setIdNumber] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('employee');
//   const [isPasswordShown, setIsPasswordShown] = useState(false);

//   const handleRegister = async () => {
//     if (!idNumber || !firstName || !lastName || !email || !phoneNumber || !password) {
//       Alert.alert('Error', 'Please fill all fields.');
//       return;
//     }

//     try {
//       await axios.post('http://172.19.37.75:3000/api/register', {
//         idNumber,
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         password,
//         role,
//       });

//       Alert.alert('Success', 'Registration successful!');
//       navigation.navigate('Login');
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white }}>
//     <View style={{ flex: 1, marginHorizontal: 20, paddingVertical: 30 }}>
      
//       {/* Back Button */}
//       <TouchableOpacity
//         style={{ position: 'absolute', top: 40, left: 10 }}
//         onPress={() => navigation.goBack()}
//       >
//         <Ionicons name="arrow-back" size={30} color={COLORS.black} />
//       </TouchableOpacity>

//       <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 }}>
//         Create Account
//       </Text>
//       <Text style={{ fontSize: 16, color: COLORS.gray, marginBottom: 20 }}>
//         Fill in your personal details
//       </Text>

//         {/* ID Number */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>ID Number</Text>
//           <TextInput
//             placeholder="Enter your ID number"
//             keyboardType="numeric"
//             style={{
//               borderColor: COLORS.gray,
//               borderWidth: 1,
//               borderRadius: 8,
//               padding: 10,
//             }}
//             onChangeText={setIdNumber}
//             maxLength={9}
//           />
//         </View>

//         {/* First Name */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>First Name</Text>
//           <TextInput
//             placeholder="Enter your first name"
//             style={{
//               borderColor: COLORS.gray,
//               borderWidth: 1,
//               borderRadius: 8,
//               padding: 10,
//             }}
//             onChangeText={setFirstName}
//           />
//         </View>

//         {/* Last Name */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>Last Name</Text>
//           <TextInput
//             placeholder="Enter your last name"
//             style={{
//               borderColor: COLORS.gray,
//               borderWidth: 1,
//               borderRadius: 8,
//               padding: 10,
//             }}
//             onChangeText={setLastName}
//           />
//         </View>

//         {/* Email */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>Email Address</Text>
//           <TextInput
//             placeholder="Enter your email address"
//             keyboardType="email-address"
//             style={{
//               borderColor: COLORS.gray,
//               borderWidth: 1,
//               borderRadius: 8,
//               padding: 10,
//             }}
//             onChangeText={setEmail}
//           />
//         </View>

//         {/* Phone Number */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>Phone Number</Text>
//           <TextInput
//             placeholder="Enter your phone number"
//             keyboardType="phone-pad"
//             style={{
//               borderColor: COLORS.gray,
//               borderWidth: 1,
//               borderRadius: 8,
//               padding: 10,
//             }}
//             onChangeText={setPhoneNumber}
//           />
//         </View>

//         {/* Password */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>Password</Text>
//           <TextInput
//             placeholder="Enter your password"
//             secureTextEntry={!isPasswordShown}
//             style={{
//               borderColor: COLORS.gray,
//               borderWidth: 1,
//               borderRadius: 8,
//               padding: 10,
//             }}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity
//             style={{ position: 'absolute', right: 12, top: 12 }}
//             onPress={() => setIsPasswordShown(!isPasswordShown)}
//           >
//             <Ionicons name={isPasswordShown ? 'eye' : 'eye-off'} size={24} color={COLORS.black} />
//           </TouchableOpacity>
//         </View>

//         {/* Role */}
//         <View style={{ marginBottom: 15 }}>
//           <Text>Role</Text>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
//             <TouchableOpacity
//               style={{
//                 backgroundColor: role === 'employee' ? COLORS.primary : COLORS.gray,
//                 borderRadius: 8,
//                 padding: 10,
//                 flex: 1,
//                 alignItems: 'center',
//                 marginRight: 5,
//               }}
//               onPress={() => setRole('employee')}
//             >
//               <Text style={{ color: COLORS.white }}>Employee</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 backgroundColor: role === 'manager' ? COLORS.primary : COLORS.gray,
//                 borderRadius: 8,
//                 padding: 10,
//                 flex: 1,
//                 alignItems: 'center',
//               }}
//               onPress={() => setRole('manager')}
//             >
//               <Text style={{ color: COLORS.white }}>Manager</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Register Button */}
//         <TouchableOpacity
//           style={{
//             backgroundColor: COLORS.yellow,
//             height: 48,
//             borderRadius: 8,
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginTop: 20,
//           }}
//           onPress={handleRegister}
//         >
//           <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold' }}>Register</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default RegisterScreen;


import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const COMPLAINT_CATEGORIES = [
  { label: 'Infrastructure', value: 'Infrastructure', icon: '🚧' },
  { label: 'Lighting', value: 'Lighting', icon: '💡' },
  { label: 'Noise', value: 'Noise', icon: '🔊' },
  { label: 'Cleaning', value: 'Cleaning', icon: '🧹' }
];

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [idNumber, setIdNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [category, setCategory] = useState(null);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // const handleRegister = async () => {
  //   if (!idNumber || !firstName || !lastName || !email || !phoneNumber || !password) {
  //     Alert.alert('Error', 'Please fill all fields.');
  //     return;
  //   }

  //   if (role === 'employee' && !category) {
  //     Alert.alert('Error', 'Please select a category for employee');
  //     return;
  //   }

  //   try {
  //     await axios.post('http://192.168.1.9:3000/api/register', {
  //       idNumber,
  //       firstName,
  //       lastName,
  //       email,
  //       phoneNumber,
  //       password,
  //       role,
  //       category: role === 'employee' ? category : null
  //     });

  //     Alert.alert('Success', 'Registration successful!');
  //     navigation.navigate('Login');
  //   } catch (error) {
  //     Alert.alert('Error', error.response?.data?.error || 'Registration failed');
  //   }
  // };
  const handleRegister = async () => {
    // בדיקת שדות חובה
    if (!idNumber || !firstName || !lastName || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    // בדיקת קטגוריה לעובדים
    if (role === 'employee' && !category) {
      Alert.alert('Error', 'Please select a category for employee');
      return;
    }
  
    try {
      const response = await axios.post('http://172.19.35.201:3000/api/register', {
        idNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
        categories: role === 'employee' ? [category] : []
      });
  
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.response) {
        // הצג הודעת שגיאה ספציפית מהשרת
        errorMessage = error.response.data?.error || errorMessage;
      }
      Alert.alert('Error', errorMessage);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 20, paddingVertical: 30 }}>
        
        {/* Back Button */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 40, left: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 }}>
          Create Account
        </Text>
        <Text style={{ fontSize: 16, color: COLORS.gray, marginBottom: 20 }}>
          Fill in your personal details
        </Text>

        {/* ID Number */}
        <View style={{ marginBottom: 15 }}>
          <Text>ID Number</Text>
          <TextInput
            placeholder="Enter your ID number"
            keyboardType="numeric"
            style={{
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={setIdNumber}
            maxLength={9}
          />
        </View>

        {/* First Name */}
        <View style={{ marginBottom: 15 }}>
          <Text>First Name</Text>
          <TextInput
            placeholder="Enter your first name"
            style={{
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={setFirstName}
          />
        </View>

        {/* Last Name */}
        <View style={{ marginBottom: 15 }}>
          <Text>Last Name</Text>
          <TextInput
            placeholder="Enter your last name"
            style={{
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={setLastName}
          />
        </View>

        {/* Email */}
        <View style={{ marginBottom: 15 }}>
          <Text>Email Address</Text>
          <TextInput
            placeholder="Enter your email address"
            keyboardType="email-address"
            style={{
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={setEmail}
          />
        </View>

        {/* Phone Number */}
        <View style={{ marginBottom: 15 }}>
          <Text>Phone Number</Text>
          <TextInput
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            style={{
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Password */}
        <View style={{ marginBottom: 15 }}>
          <Text>Password</Text>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!isPasswordShown}
            style={{
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 12, top: 12 }}
            onPress={() => setIsPasswordShown(!isPasswordShown)}
          >
            <Ionicons name={isPasswordShown ? 'eye' : 'eye-off'} size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        {/* Role */}
        <View style={{ marginBottom: 15 }}>
          <Text>Role</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: role === 'employee' ? COLORS.primary : COLORS.gray,
                borderRadius: 8,
                padding: 10,
                flex: 1,
                alignItems: 'center',
                marginRight: 5,
              }}
              onPress={() => setRole('employee')}
            >
              <Text style={{ color: COLORS.white }}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: role === 'manager' ? COLORS.primary : COLORS.gray,
                borderRadius: 8,
                padding: 10,
                flex: 1,
                alignItems: 'center',
              }}
              onPress={() => setRole('manager')}
            >
              <Text style={{ color: COLORS.white }}>Manager</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category (only for employees) */}
        {role === 'employee' && (
          <View style={{ marginBottom: 15 }}>
            <Text>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={{
                    backgroundColor: category === cat.value ? COLORS.primary : COLORS.gray,
                    borderRadius: 8,
                    padding: 10,
                    width: '48%',
                    alignItems: 'center',
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text style={{ marginRight: 5 }}>{cat.icon}</Text>
                  <Text style={{ color: category === cat.value ? COLORS.white : COLORS.black }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Register Button */}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.yellow,
            height: 48,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}
          onPress={handleRegister}
        >
          <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
