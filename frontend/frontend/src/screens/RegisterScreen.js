
// RegisterScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Surface, RadioButton } from 'react-native-paper';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [idNumber, setIdNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const handleRegister = async () => {
    try {
      await axios.post('http://192.168.23.111:3000/api/register', {
        idNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role
      });
     
      alert('ההרשמה בוצעה בהצלחה');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.response?.data?.error || 'ההרשמה נכשלה');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>הרשמה למערכת</Title>
        <TextInput
          label="מספר זהות"
          value={idNumber}
          onChangeText={setIdNumber}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          maxLength={9}
        />
        <TextInput
          label="שם פרטי"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="שם משפחה"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="דואר אלקטרוני"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="מספר טלפון"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="סיסמה"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <View style={styles.radioContainer}>
          <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
            <View style={styles.radioButton}>
              <RadioButton.Item label="עובד" value="employee" />
            </View>
            <View style={styles.radioButton}>
              <RadioButton.Item label="מנהל" value="manager" />
            </View>
          </RadioButton.Group>
        </View>
        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          הרשם
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          חזור להתחברות
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 10,
    marginVertical: 20
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    marginBottom: 10
  },
  radioContainer: {
    marginVertical: 10
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginTop: 10
  }
});

export default RegisterScreen;