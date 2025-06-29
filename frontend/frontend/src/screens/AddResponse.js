// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AddResponse = ({ route, navigation }) => {
//   // כעת קבל את complaintId וגם את title אם קיים
//   const { complaintId, title } = route.params;
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const submitResponse = async () => {
//     if (!message.trim()) {
//       Alert.alert('שגיאה', 'אנא הזן תגובה');
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
      
//       if (!token) {
//         navigation.navigate('loginScreen');
//         return;
//       }

//       // עדכון ה-URL לשרת שלך
//       const response = await fetch(`http://172.19.35.220:5000/api/complaints/${complaintId}/respond`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           message: message,
//           fromEmployee: true
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'שגיאה בשליחת התגובה');
//       }

//       Alert.alert(
//         'הצלחה', 
//         'התגובה נשלחה בהצלחה',
//         [{ 
//           text: 'אישור', 
//           onPress: () => navigation.navigate('EmployeeComplaints', { refresh: true }) 
//         }]
//       );
//     } catch (err) {
//       console.error('Error submitting response:', err);
//       Alert.alert('שגיאה', err.message || 'אירעה שגיאה, אנא נסה שוב');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>הוספת תגובה</Text>
      
//       {/* אם יש כותרת, הצג אותה */}
//       {title && (
//         <Text style={styles.complaintTitle}>תלונה: {title}</Text>
//       )}
      
//       <Text style={styles.label}>התגובה שלך:</Text>
      
//       <TextInput
//         style={styles.input}
//         multiline
//         numberOfLines={6}
//         placeholder="הקלד את הודעתך כאן..."
//         value={message}
//         onChangeText={setMessage}
//         textAlign="right"
//         textAlignVertical="top"
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#2196F3" />
//       ) : (
//         <TouchableOpacity style={styles.submitButton} onPress={submitResponse}>
//           <Text style={styles.buttonText}>שלח תגובה</Text>
//         </TouchableOpacity>
//       )}
      
//       <TouchableOpacity 
//         style={styles.cancelButton} 
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={styles.cancelText}>ביטול</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     direction: 'rtl'
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center'
//   },
//   complaintTitle: {
//     fontSize: 18,
//     color: '#333',
//     marginBottom: 16,
//     textAlign: 'center'
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     fontWeight: '500'
//   },
//   input: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 24,
//     minHeight: 120
//   },
//   submitButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 16
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   cancelButton: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center'
//   },
//   cancelText: {
//     color: '#666',
//     fontWeight: '500',
//     fontSize: 16
//   }
// });

// export default AddResponse;



import React, { useState } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import {
  Surface,
  Text,
  Title,
  TextInput,
  Button,
  ActivityIndicator,
  useTheme,
  Provider as PaperProvider,
  IconButton
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const AddResponse = ({ route, navigation }) => {
  // Define a default theme - להבטיח שיש לנו תמה גם אם אין Provider
  const theme = useTheme() || {
    colors: {
      primary: '#4f46e5',
      accent: '#2196F3',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#333333',
      error: '#B00020',
    }
  };

  // כעת קבל את complaintId וגם את title אם קיים
  const { complaintId, title } = route.params;
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitResponse = async () => {
    if (!message.trim()) {
      Alert.alert('שגיאה', 'אנא הזן תגובה');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        navigation.navigate('loginScreen');
        return;
      }

      // עדכון ה-URL לשרת שלך
      const response = await fetch(`http://172.19.36.84:5000/api/complaints/${complaintId}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          fromEmployee: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בשליחת התגובה');
      }

      Alert.alert(
        'הצלחה', 
        'התגובה נשלחה בהצלחה',
        [{ 
          text: 'אישור', 
          onPress: () => navigation.navigate('EmployeeComplaints', { refresh: true }) 
        }]
      );
    } catch (err) {
      console.error('Error submitting response:', err);
      Alert.alert('שגיאה', err.message || 'אירעה שגיאה, אנא נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <IconButton
                icon="arrow-right"
                size={24}
                color="white"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              />
              <Title style={styles.headerTitle}>הוספת תגובה</Title>
              <View style={{ width: 40 }} /> {/* Spacer for alignment */}
            </View>
            
            {/* אם יש כותרת, הצג אותה */}
            {title && (
              <Text style={styles.headerSubtitle}>{title}</Text>
            )}
          </View>
        </Surface>

        <View style={styles.content}>
          <Text style={styles.label}>התגובה שלך:</Text>
          
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={8}
            placeholder="הקלד את הודעתך כאן..."
            value={message}
            onChangeText={setMessage}
            textAlign="right"
            textAlignVertical="top"
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor={theme.colors.primary}
          />

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <>
                <Button 
                  mode="contained" 
                  icon="send"
                  onPress={submitResponse}
                  style={styles.submitButton}
                  contentStyle={styles.buttonContent}
                  buttonColor={theme.colors.primary}
                >
                  שלח תגובה
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={() => navigation.goBack()}
                  style={styles.cancelButton}
                  contentStyle={styles.buttonContent}
                >
                  ביטול
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    direction: 'rtl'
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 24,
    minHeight: 160,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    width: '100%',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    flexDirection: 'row-reverse', // For RTL button content
  },
});

export default AddResponse;