// SimpleGuestComplaintForm.js - טופס פשוט להגשת תלונת אורח

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const SimpleGuestComplaintForm = ({ navigation }) => {
  // State עבור פרטי האורח
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  // State עבור פרטי התלונה
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  
  // State עבור מיקום
  const [location, setLocation] = useState({
    latitude: 31.7683,
    longitude: 35.2137,
  });

  // קטגוריות
  const categories = ['תשתית', 'חשמל', 'רעש', 'נקיון', 'מים וביוב'];
  const categoryIcons = {
    'תשתית': '🚧',
    'חשמל': '💡',
    'רעש': '🔊',
    'נקיון': '🧹',
    'מים וביוב': '💦🚰'
  };

  const SERVER_URL = 'http://192.168.1.4:5000';

  // קבלת מיקום נוכחי
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
          
          // נסה לקבל כתובת אוטומטית
          const addresses = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
          });
          
          if (addresses.length > 0) {
            const addr = addresses[0];
            setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
          }
        } catch (error) {
          console.log('Location error:', error);
        }
      }
    })();
  }, []);

  // הוספת תמונות
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('הרשאות חסרות', 'אנחנו צריכים הרשאות גישה לגלריה');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
      maxSelectedPhotos: 3,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      if (images.length + newImages.length > 3) {
        Alert.alert('מקסימום תמונות', 'ניתן להעלות עד 3 תמונות');
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // בדיקת תקינות הטופס
  const validateForm = () => {
    if (!guestName.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס שם מלא');
      return false;
    }
    if (!guestEmail.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס כתובת אימייל');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס כותרת התלונה');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס תיאור התלונה');
      return false;
    }
    if (!category) {
      Alert.alert('שגיאת אימות', 'אנא בחר קטגוריה');
      return false;
    }

    // בדיקת תקינות אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      Alert.alert('שגיאת אימות', 'כתובת אימייל לא תקינה');
      return false;
    }

    return true;
  };

  // שליחת התלונה
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('guestName', guestName.trim());
      formData.append('guestEmail', guestEmail.trim());
      formData.append('guestPhone', guestPhone.trim());
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('address', address.trim());
      formData.append('location', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude
      }));

      images.forEach((image, index) => {
        const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
        const imageName = imageUri.split('/').pop();
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: imageName || `image${index}.jpg`,
        });
      });

      const response = await axios.post(`${SERVER_URL}/api/guest-complaint`, formData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.status === 'success') {
        Alert.alert(
          'תודה!', 
          'התלונה נשלחה בהצלחה.\nתקבל עדכון באימייל כאשר יטפלו בתלונה.',
          [
            {
              text: 'הגש תלונה נוספת',
              onPress: () => {
                // איפוס הטופס
                setGuestName('');
                setGuestEmail('');
                setGuestPhone('');
                setTitle('');
                setDescription('');
                setCategory('');
                setAddress('');
                setImages([]);
              }
            },
            {
              text: 'חזרה לדף הבית',
              onPress: () => navigation.navigate('loginOption')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error details:', error);
      let errorMessage = 'שליחת התלונה נכשלה';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
      } else if (error.request) {
        errorMessage = 'אין תגובה מהשרת - בדוק את החיבור שלך';
      }
      
      Alert.alert('שגיאה', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>הגשת תלונה</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>הגש תלונה לעירייה</Text>
          <Text style={styles.subtitle}>
            מלא את הפרטים ושלח את התלונה. תקבל עדכון באימייל
          </Text>

          {/* פרטי יצירת קשר */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פרטי יצירת קשר</Text>
            
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="שם מלא *"
                value={guestName}
                onChangeText={setGuestName}
                placeholderTextColor="#666"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="כתובת אימייל *"
                value={guestEmail}
                onChangeText={setGuestEmail}
                placeholderTextColor="#666"
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="מספר טלפון (אופציונלי)"
                value={guestPhone}
                onChangeText={setGuestPhone}
                placeholderTextColor="#666"
                editable={!isLoading}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* פרטי התלונה */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פרטי התלונה</Text>

            <View style={styles.inputContainer}>
              <Icon name="edit" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="כותרת התלונה *"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#666"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon 
                name="alert-circle" 
                size={20} 
                color="#666" 
                style={[styles.inputIcon, { top: 15 }]} 
              />
              <TextInput
                style={styles.textArea}
                placeholder="תאר את הבעיה בפירוט *"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#666"
                editable={!isLoading}
              />
            </View>

            {/* קטגוריות */}
            <Text style={styles.categoryLabel}>קטגוריה *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive
                  ]}
                  onPress={() => setCategory(cat)}
                  disabled={isLoading}
                >
                  <Text style={styles.categoryIcon}>{categoryIcons[cat]}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* מיקום */}
            <View style={styles.inputContainer}>
              <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="מיקום הבעיה (כתובת)"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="#666"
                editable={!isLoading}
              />
            </View>

            {/* העלאת תמונות */}
            <View style={styles.imageSection}>
              <Text style={styles.categoryLabel}>תמונות (אופציונלי)</Text>
              <Text style={styles.imageSubtext}>עד 3 תמונות</Text>
              
              <View style={styles.imageContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Icon name="x" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {images.length < 3 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={pickImage}
                    disabled={isLoading}
                  >
                    <Icon name="camera" size={24} color="#8b5cf6" />
                    <Text style={styles.addImageText}>הוסף תמונה</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* כפתור שליחה */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : null}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'שולח...' : 'שלח תלונה'}
            </Text>
            {!isLoading && (
              <Icon name="send" size={20} color="#fff" style={styles.submitIcon} />
            )}
          </TouchableOpacity>

          {/* הודעת מידע */}
          <View style={styles.infoBox}>
            <Icon name="info" size={20} color="#4f46e5" />
            <Text style={styles.infoText}>
              * שדות חובה{'\n'}
              התלונה תועבר לטיפול הגורמים הרלוונטיים בעירייה ותקבל עדכון באימייל.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    color: '#5b21b6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1a1a1a',
    textAlignVertical: 'top',
    textAlign: 'right',
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#ede9fe',
    borderColor: '#8b5cf6',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  categoryTextActive: {
    color: '#5b21b6',
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3ff',
  },
  addImageText: {
    color: '#8b5cf6',
    fontSize: 14,
    marginTop: 4,
  },
  imageSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  submitIcon: {
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#1e40af',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right',
  },
});

export default SimpleGuestComplaintForm;