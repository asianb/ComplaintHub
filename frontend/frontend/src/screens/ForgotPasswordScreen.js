import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Surface, Title } from 'react-native-paper';
import axios from 'axios';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1); // 1 = הכנס ID, 2 = הכנס קוד ושנה סיסמה
  const [idNumber, setIdNumber] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendCode = async () => {
    if (!idNumber) {
      Alert.alert('שגיאה', 'נא להכניס תעודת זהות');
      return;
    }

    if (idNumber.length !== 9) {
      Alert.alert('שגיאה', 'תעודת זהות חייבת להכיל 9 ספרות');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.3:3000/api/forgot-password', {
        idNumber: idNumber
      });

      if (response.data.status === 'success') {
        Alert.alert('הצלחה', response.data.message);
        setStep(2);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'שגיאה בשליחת הקוד';
      Alert.alert('שגיאה', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('שגיאה', 'קוד האימות חייב להכיל 6 ספרות');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('שגיאה', 'הסיסמאות לא תואמות');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('שגיאה', 'הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.3:3000/api/reset-password', {
        idNumber: idNumber,
        code: code,
        newPassword: newPassword
      });

      if (response.data.status === 'success') {
        Alert.alert('הצלחה', response.data.message, [
          {
            text: 'אישור',
            onPress: () => navigation.navigate('LoginScreen')
          }
        ]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'שגיאה באיפוס הסיסמה';
      Alert.alert('שגיאה', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.formContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔐</Text>
      </View>
      
      <Text style={styles.title}>איפוס סיסמה</Text>
      <Text style={styles.subtitle}>
        הכנס את תעודת הזהות שלך ונשלח לך קוד אימות למייל
      </Text>
      
      <Text style={styles.label}>תעודת זהות</Text>
      <TextInput
        placeholder="הכנס תעודת זהות"
        style={styles.input}
        value={idNumber}
        onChangeText={setIdNumber}
        placeholderTextColor="#9CA3AF"
        textAlign="right"
        keyboardType="numeric"
        maxLength={9}
      />

      <TouchableOpacity 
        onPress={handleSendCode} 
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'שולח...' : 'שלח קוד אימות'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>חזור להתחברות</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📧</Text>
      </View>
      
      <Text style={styles.title}>הכנס קוד אימות</Text>
      <Text style={styles.subtitle}>
        הכנס את קוד האימות שנשלח למייל שלך
      </Text>
      
      <Text style={styles.label}>קוד אימות</Text>
      <TextInput
        placeholder="הכנס קוד בן 6 ספרות"
        style={[styles.input, styles.codeInput]}
        value={code}
        onChangeText={setCode}
        placeholderTextColor="#9CA3AF"
        textAlign="center"
        keyboardType="numeric"
        maxLength={6}
      />

      <Text style={styles.label}>סיסמה חדשה</Text>
      <TextInput
        placeholder="הכנס סיסמה חדשה"
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#9CA3AF"
        textAlign="right"
      />

      <Text style={styles.label}>אימות סיסמה</Text>
      <TextInput
        placeholder="הכנס שוב את הסיסמה"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#9CA3AF"
        textAlign="right"
      />

      <TouchableOpacity 
        onPress={handleResetPassword} 
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'מאפס...' : 'אפס סיסמה'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={styles.backText}>חזור</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleSendCode} style={styles.resendButton}>
        <Text style={styles.resendText}>שלח קוד חדש</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>מערכת ניהול תלונות</Title>
        <Text style={styles.headerSubtitle}>איפוס סיסמה</Text>
      </Surface>

      <KeyboardAvoidingView 
        style={styles.formWrapper} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {step === 1 ? renderStep1() : renderStep2()}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'right',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeInput: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backText: {
    marginTop: 16,
    color: '#4f46e5',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  resendText: {
    color: '#6b7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});