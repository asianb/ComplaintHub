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

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = הכנס ID, 2 = הכנס קוד, 3 = הכנס סיסמה חדשה
  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendCode = async () => {
    if (!id) {
      Alert.alert('שגיאה', 'נא להכניס תעודת זהות');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.4:5001/forgot-password', {
        id: id
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
      const response = await axios.post('http://192.168.1.4:5001/reset-password', {
        id: id,
        code: code,
        newPassword: newPassword
      });

      if (response.data.status === 'success') {
        Alert.alert('הצלחה', response.data.message, [
          {
            text: 'אישור',
            onPress: () => navigation.navigate('Login')
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
      <Text style={styles.title}>איפוס סיסמה</Text>
      <Text style={styles.subtitle}>
        הכנס את תעודת הזהות שלך ונשלח לך קוד אימות למייל
      </Text>
      
      <Text style={styles.label}>תעודת זהות</Text>
      <TextInput
        placeholder="הכנס תעודת זהות"
        style={styles.input}
        value={id}
        onChangeText={setId}
        placeholderTextColor="#9CA3AF"
        textAlign="right"
        keyboardType="numeric"
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
      <Text style={styles.title}>הכנס קוד אימות</Text>
      <Text style={styles.subtitle}>
        הכנס את קוד האימות שנשלח למייל שלך
      </Text>
      
      <Text style={styles.label}>קוד אימות</Text>
      <TextInput
        placeholder="הכנס קוד בן 6 ספרות"
        style={styles.input}
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>איפוס סיסמה</Title>
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
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
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
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
});