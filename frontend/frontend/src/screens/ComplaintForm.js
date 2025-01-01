// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   SafeAreaView,
//   Platform,
//   ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import axios from 'axios';

// const ComplaintForm = ({ navigation }) => {
//   // State management
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [address, setAddress] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Categories with icons
//   const categories = ['Infrastructure', 'Lighting', 'Noise', 'Cleaning'];
//   const categoryIcons = {
//     'Infrastructure': '🚧',
//     'Lighting': '💡',
//     'Noise': '🔊',
//     'Cleaning': '🧹'
//   };

//   // Server configuration
//   const SERVER_URL = 'http://172.19.43.232:5000';

//   // Connection test function
//   const testConnection = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}/test`);
//       console.log('Test connection successful:', response.data);
//       return true;
//     } catch (error) {
//       console.log('Test connection failed:', error);
//       return false;
//     }
//   };

//   // Form validation
//   const validateForm = () => {
//     if (!title.trim()) {
//       Alert.alert('Validation Error', 'Please enter a title');
//       return false;
//     }
//     if (!description.trim()) {
//       Alert.alert('Validation Error', 'Please enter a description');
//       return false;
//     }
//     if (!category) {
//       Alert.alert('Validation Error', 'Please select a category');
//       return false;
//     }
//     if (!address.trim()) {
//       Alert.alert('Validation Error', 'Please enter an address');
//       return false;
//     }
//     return true;
//   };

//   // Form submission handler
//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     setIsLoading(true);
    
//     try {
//       // Check connectivity first
//       const isConnected = await testConnection();
//       if (!isConnected) {
//         Alert.alert('Connection Error', 'Cannot connect to server. Please try again later.');
//         return;
//       }

//       const complaintData = {
//         title: title.trim(),
//         description: description.trim(),
//         category,
//         address: address.trim(),
//       };

//       console.log('Sending data:', complaintData);
      
//       const response = await axios.post(`${SERVER_URL}/api/complaints`, complaintData, {
//         timeout: 30000,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       console.log('Response received:', response.data);
      
//       if (response.data.status === 'success') {
//         Alert.alert('Success', 'Complaint submitted successfully');
//         // Clear form
//         setTitle('');
//         setDescription('');
//         setCategory('');
//         setAddress('');
//       }
//     } catch (error) {
//       console.error('Error details:', error);
      
//       let errorMessage = 'Failed to submit complaint';
      
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Connection timeout - please try again';
//       } else if (error.response) {
//         errorMessage = `Server Error: ${error.response.data?.message || 'Unknown error'}`;
//       } else if (error.request) {
//         errorMessage = 'No response from server - check your connection';
//       }
      
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="chevron-left" size={24} color="#1a1a1a" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Report an Issue</Text>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.content}>
//           <Text style={styles.title}>Submit Complaint</Text>
//           <Text style={styles.subtitle}>
//             Help us improve our city by reporting any issues you notice
//           </Text>

//           {/* Title Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="edit" size={20} color="#666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Complaint Title"
//               value={title}
//               onChangeText={setTitle}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//           {/* Description Input */}
//           <View style={styles.inputContainer}>
//             <Icon 
//               name="alert-circle" 
//               size={20} 
//               color="#666" 
//               style={[styles.inputIcon, { top: 15 }]} 
//             />
//             <TextInput
//               style={styles.textArea}
//               placeholder="Describe the issue in detail"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//           {/* Address Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Location of the issue"
//               value={address}
//               onChangeText={setAddress}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//           {/* Categories */}
//           <Text style={styles.categoryLabel}>Category</Text>
//           <View style={styles.categoryContainer}>
//             {categories.map((cat) => (
//               <TouchableOpacity
//                 key={cat}
//                 style={[
//                   styles.categoryButton,
//                   category === cat && styles.categoryButtonActive
//                 ]}
//                 onPress={() => setCategory(cat)}
//                 disabled={isLoading}
//               >
//                 <Text style={styles.categoryIcon}>{categoryIcons[cat]}</Text>
//                 <Text
//                   style={[
//                     styles.categoryText,
//                     category === cat && styles.categoryTextActive
//                   ]}
//                 >
//                   {cat}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
//             onPress={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
//             ) : null}
//             <Text style={styles.submitButtonText}>
//               {isLoading ? 'Submitting...' : 'Submit Report'}
//             </Text>
//             {!isLoading && (
//               <Icon name="send" size={20} color="#fff" style={styles.submitIcon} />
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9ff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginLeft: 16,
//     color: '#5b21b6',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#1a1a1a',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 24,
//   },
//   inputContainer: {
//     marginBottom: 16,
//     position: 'relative',
//   },
//   inputIcon: {
//     position: 'absolute',
//     left: 12,
//     top: 12,
//     zIndex: 1,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     paddingLeft: 40,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     color: '#1a1a1a',
//   },
//   textArea: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     paddingLeft: 40,
//     fontSize: 16,
//     minHeight: 120,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     color: '#1a1a1a',
//     textAlignVertical: 'top',
//   },
//   categoryLabel: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#1a1a1a',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 24,
//   },
//   categoryButton: {
//     flex: 1,
//     minWidth: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   categoryButtonActive: {
//     backgroundColor: '#ede9fe',
//     borderColor: '#8b5cf6',
//   },
//   categoryIcon: {
//     fontSize: 20,
//     marginRight: 8,
//   },
//   categoryText: {
//     fontSize: 16,
//     color: '#1a1a1a',
//   },
//   categoryTextActive: {
//     color: '#5b21b6',
//     fontWeight: '600',
//   },
//   submitButton: {
//     backgroundColor: '#8b5cf6',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   submitButtonDisabled: {
//     opacity: 0.7,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     marginRight: 8,
//   },
//   submitIcon: {
//     marginLeft: 8,
//   },
// });

// export default ComplaintForm;

import React, { useState } from 'react';
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
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect } from 'react';

const ComplaintForm = ({ navigation }) => {
  // State management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  

  
  // New state for location
  const [location, setLocation] = useState({
    latitude: 31.7683,
    longitude: 35.2137,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Categories with icons
  const categories = ['Infrastructure', 'Lighting', 'Noise', 'Cleaning'];
  const categoryIcons = {
    'Infrastructure': '🚧',
    'Lighting': '💡',
    'Noise': '🔊',
    'Cleaning': '🧹'
  };

  // Server configuration
  const SERVER_URL = 'http://172.19.43.232:5000';
 // Request location permissions and get initial location
 useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('הרשאה נדרשת', 'אנא אפשר גישה למיקום כדי להשתמש במפה');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      ...location,
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  })();
}, []);

// Function to search address
const searchAddress = async () => {
  if (!searchQuery.trim()) return;

  setIsSearching(true);
  try {
    const response = await Location.geocodeAsync(searchQuery);
    if (response.length > 0) {
      const { latitude, longitude } = response[0];
      setLocation({
        ...location,
        latitude,
        longitude,
      });
      
      // Get address from coordinates
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addresses.length > 0) {
        const addr = addresses[0];
        setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
      }
    } else {
      Alert.alert('לא נמצאה כתובת', 'נסה לחפש כתובת אחרת');
    }
  } catch (error) {
    Alert.alert('שגיאה', 'אירעה שגיאה בחיפוש הכתובת');
  } finally {
    setIsSearching(false);
  }
};

// Handle map marker drag
const handleMarkerDrag = async (e) => {
  const { latitude, longitude } = e.nativeEvent.coordinate;
  setLocation({
    ...location,
    latitude,
    longitude,
  });

  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addresses.length > 0) {
      const addr = addresses[0];
      setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
    }
  } catch (error) {
    console.error('Error getting address:', error);
  }
};

  // Image handling functions
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('הרשאות חסרות', 'אנחנו צריכים הרשאות גישה לגלריה כדי לבחור תמונות');
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

  // Connection test function
  const testConnection = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/test`);
      console.log('Test connection successful:', response.data);
      return true;
    } catch (error) {
      console.log('Test connection failed:', error);
      return false;
    }
  };

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס כותרת');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס תיאור');
      return false;
    }
    if (!category) {
      Alert.alert('שגיאת אימות', 'אנא בחר קטגוריה');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('שגיאת אימות', 'אנא הכנס כתובת');
      return false;
    }
    return true;
  };

  // // Form submission handler
  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
    
  //   setIsLoading(true);
    
  //   try {
  //     // Check connectivity first
  //     const isConnected = await testConnection();
  //     if (!isConnected) {
  //       Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
  //       return;
  //     }

  //     // Create FormData object
  //     const formData = new FormData();
  //     formData.append('title', title.trim());
  //     formData.append('description', description.trim());
  //     formData.append('category', category);
  //     formData.append('address', address.trim());

  //     // Add images to FormData
  //     images.forEach((image, index) => {
  //       const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
  //       const imageName = imageUri.split('/').pop();
  //       formData.append('images', {
  //         uri: imageUri,
  //         type: 'image/jpeg',
  //         name: imageName || `image${index}.jpg`,
  //       });
  //     });

  //     console.log('Sending data:', formData);
      
  //     const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
  //       timeout: 30000,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       }
  //     });

  //     console.log('Response received:', response.data);
      
  //     if (response.data.status === 'success') {
  //       Alert.alert('הצלחה', 'התלונה נשלחה בהצלחה');
  //       // Clear form
  //       setTitle('');
  //       setDescription('');
  //       setCategory('');
  //       setAddress('');
  //       setImages([]);
  //     }
  //   } catch (error) {
  //     console.error('Error details:', error);
      
  //     let errorMessage = 'שליחת התלונה נכשלה';
      
  //     if (error.code === 'ECONNABORTED') {
  //       errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
  //     } else if (error.response) {
  //       errorMessage = `שגיאת שרת: ${error.response.data?.message || 'שגיאה לא ידועה'}`;
  //     } else if (error.request) {
  //       errorMessage = 'אין תגובה מהשרת - בדוק את החיבור שלך';
  //     }
      
  //     Alert.alert('שגיאה', errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // Updated handleSubmit with location data
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
        return;
      }

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('address', address.trim());
      formData.append('location', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude
      }));

      // Add images to FormData
      images.forEach((image, index) => {
        const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
        const imageName = imageUri.split('/').pop();
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: imageName || `image${index}.jpg`,
        });
      });

      const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.status === 'success') {
        Alert.alert('הצלחה', 'התלונה נשלחה בהצלחה');
        // Clear form
        setTitle('');
        setDescription('');
        setCategory('');
        setAddress('');
        setImages([]);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error details:', error);
      let errorMessage = 'שליחת התלונה נכשלה';
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
      } else if (error.response) {
        errorMessage = `שגיאת שרת: ${error.response.data?.message || 'שגיאה לא ידועה'}`;
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
        <Text style={styles.headerTitle}>דיווח על בעיה</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>שליחת תלונה</Text>
          <Text style={styles.subtitle}>
            עזור לנו לשפר את העיר על ידי דיווח על בעיות שאתה מבחין בהן
          </Text>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Icon name="edit" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="כותרת התלונה"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#666"
              editable={!isLoading}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Icon 
              name="alert-circle" 
              size={20} 
              color="#666" 
              style={[styles.inputIcon, { top: 15 }]} 
            />
            <TextInput
              style={styles.textArea}
              placeholder="תאר את הבעיה בפירוט"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#666"
              editable={!isLoading}
            />
          </View>

         {/* Location Selection */}
         <View style={styles.mapSection}>
            <Text style={styles.categoryLabel}>בחירת מיקום</Text>
            
            {/* Address Search */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="חפש כתובת"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={searchAddress}
                returnKeyType="search"
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={searchAddress}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Icon name="search" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            {/* Selected Address Display */}
            {address ? (
              <View style={styles.selectedAddress}>
                <Icon name="map-pin" size={16} color="#666" />
                <Text style={styles.addressText}>{address}</Text>
              </View>
            ) : null}

            {/* Map View */}
            <MapView
              style={styles.map}
              region={location}
              onRegionChangeComplete={setLocation}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                draggable
                onDragEnd={handleMarkerDrag}
              />
            </MapView>
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="מיקום הבעיה"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#666"
              editable={!isLoading}
            />
          </View>

          {/* Image Upload Section */}
          <View style={styles.imageSection}>
            <Text style={styles.categoryLabel}>הוספת תמונות (אופציונלי)</Text>
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

          {/* Categories */}
          <Text style={styles.categoryLabel}>קטגוריה</Text>
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

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : null}
            <Text style={styles.submitButtonText}>
              {isLoading ? 'שולח...' : 'שלח דיווח'}
            </Text>
            {!isLoading && (
              <Icon name="send" size={20} color="#fff" style={styles.submitIcon} />
            )}
          </TouchableOpacity>
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


  // New styles for map integration
  mapSection: {
    marginBottom: 24,
  },
  map: {
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
    textAlign: 'right',
  },
  searchButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  addressText: {
    marginLeft: 8,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
});

export default ComplaintForm;