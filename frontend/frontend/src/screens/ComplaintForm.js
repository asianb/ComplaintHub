

// //ComplaintForm.js
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
//   ActivityIndicator,
//   Image,
//   Dimensions
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ComplaintForm = ({ navigation }) => {
//   // State management
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [address, setAddress] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [images, setImages] = useState([]);
  

  
//   // New state for location
//   const [location, setLocation] = useState({
//     latitude: 31.7683,
//     longitude: 35.2137,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [token, setToken] = useState(null);



//   // Categories with icons
//   const categories = ['תשתית', 'חשמל', 'רעש', 'נקיון','מים וביוב'];
//   const categoryIcons = {
//     'תשתית': '🚧',
//     'חשמל': '💡',
//     'רעש': '🔊',
//     'נקיון': '🧹',
//     'מים וביוב': '💦🚰' 
//   };

//   // Server configuration
//   const SERVER_URL = 'http://192.168.116.111:5000';
//  // Request location permissions and get initial location
//  useEffect(() => {
//   const getToken = async () => {
//     try {
//       const userToken = await AsyncStorage.getItem('userToken');
//       if (!userToken) {
//         Alert.alert('שגיאה', 'נא להתחבר למערכת');
//         navigation.navigate('Login');
//         return;
//       }
//       setToken(userToken);
//     } catch (error) {
//       console.error('Error getting token:', error);
//       Alert.alert('שגיאה', 'בעיה בהתחברות למערכת');
//       navigation.navigate('Login');
//     }
//   };
//   getToken();
//   (async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('הרשאה נדרשת', 'אנא אפשר גישה למיקום כדי להשתמש במפה');
//       return;
//     }

//     let currentLocation = await Location.getCurrentPositionAsync({});
//     setLocation({
//       ...location,
//       latitude: currentLocation.coords.latitude,
//       longitude: currentLocation.coords.longitude,
//     });
//   })();
// }, []);

// // Function to search address
// const searchAddress = async () => {
//   if (!searchQuery.trim()) return;

//   setIsSearching(true);
//   try {
//     const response = await Location.geocodeAsync(searchQuery);
//     if (response.length > 0) {
//       const { latitude, longitude } = response[0];
//       setLocation({
//         ...location,
//         latitude,
//         longitude,
//       });
      
//       // Get address from coordinates
//       const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
//       if (addresses.length > 0) {
//         const addr = addresses[0];
//         setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
//       }
//     } else {
//       Alert.alert('לא נמצאה כתובת', 'נסה לחפש כתובת אחרת');
//     }
//   } catch (error) {
//     Alert.alert('שגיאה', 'אירעה שגיאה בחיפוש הכתובת');
//   } finally {
//     setIsSearching(false);
//   }
// };

// // Handle map marker drag
// const handleMarkerDrag = async (e) => {
//   const { latitude, longitude } = e.nativeEvent.coordinate;
//   setLocation({
//     ...location,
//     latitude,
//     longitude,
//   });

//   try {
//     const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
//     if (addresses.length > 0) {
//       const addr = addresses[0];
//       setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
//     }
//   } catch (error) {
//     console.error('Error getting address:', error);
//   }
// };

//   // Image handling functions
//   const pickImage = async () => {
//     if (Platform.OS !== 'web') {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('הרשאות חסרות', 'אנחנו צריכים הרשאות גישה לגלריה כדי לבחור תמונות');
//         return;
//       }
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.8,
//       allowsMultipleSelection: true,
//       maxSelectedPhotos: 3,
//     });

//     if (!result.canceled) {
//       const newImages = result.assets.map(asset => asset.uri);
//       if (images.length + newImages.length > 3) {
//         Alert.alert('מקסימום תמונות', 'ניתן להעלות עד 3 תמונות');
//         return;
//       }
//       setImages([...images, ...newImages]);
//     }
//   };

//   const removeImage = (index) => {
//     const newImages = [...images];
//     newImages.splice(index, 1);
//     setImages(newImages);
//   };

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
//       Alert.alert('שגיאת אימות', 'אנא הכנס כותרת');
//       return false;
//     }
//     if (!description.trim()) {
//       Alert.alert('שגיאת אימות', 'אנא הכנס תיאור');
//       return false;
//     }
//     if (!category) {
//       Alert.alert('שגיאת אימות', 'אנא בחר קטגוריה');
//       return false;
//     }
//     if (!address.trim()) {
//       Alert.alert('שגיאת אימות', 'אנא הכנס כתובת');
//       return false;
//     }
//     return true;
//   };

//   // // Form submission handler
//   // const handleSubmit = async () => {
//   //   if (!validateForm()) return;
    
//   //   setIsLoading(true);
    
//   //   try {
//   //     // Check connectivity first
//   //     const isConnected = await testConnection();
//   //     if (!isConnected) {
//   //       Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
//   //       return;
//   //     }

//   //     // Create FormData object
//   //     const formData = new FormData();
//   //     formData.append('title', title.trim());
//   //     formData.append('description', description.trim());
//   //     formData.append('category', category);
//   //     formData.append('address', address.trim());

//   //     // Add images to FormData
//   //     images.forEach((image, index) => {
//   //       const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
//   //       const imageName = imageUri.split('/').pop();
//   //       formData.append('images', {
//   //         uri: imageUri,
//   //         type: 'image/jpeg',
//   //         name: imageName || `image${index}.jpg`,
//   //       });
//   //     });

//   //     console.log('Sending data:', formData);
      
//   //     const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
//   //       timeout: 30000,
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       }
//   //     });

//   //     console.log('Response received:', response.data);
      
//   //     if (response.data.status === 'success') {
//   //       Alert.alert('הצלחה', 'התלונה נשלחה בהצלחה');
//   //       // Clear form
//   //       setTitle('');
//   //       setDescription('');
//   //       setCategory('');
//   //       setAddress('');
//   //       setImages([]);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error details:', error);
      
//   //     let errorMessage = 'שליחת התלונה נכשלה';
      
//   //     if (error.code === 'ECONNABORTED') {
//   //       errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
//   //     } else if (error.response) {
//   //       errorMessage = `שגיאת שרת: ${error.response.data?.message || 'שגיאה לא ידועה'}`;
//   //     } else if (error.request) {
//   //       errorMessage = 'אין תגובה מהשרת - בדוק את החיבור שלך';
//   //     }
      
//   //     Alert.alert('שגיאה', errorMessage);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   // Updated handleSubmit with location data


//     // Update handleSubmit to include token
//     const handleSubmit = async () => {
//       if (!token) {
//         Alert.alert('שגיאה', 'נא להתחבר למערכת');
//         navigation.navigate('Login');
//         return;
//       }
//       const userId = await AsyncStorage.getItem('userId');

//       if (!validateForm()) return;
      
//       setIsLoading(true);
      
//       try {
//         const isConnected = await testConnection();
//         if (!isConnected) {
//           Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
//           return;
//         }
  
//         const formData = new FormData();
//         formData.append('userId',userId );
//         formData.append('title', title.trim());
//         formData.append('description', description.trim());
//         formData.append('category', category);
//         formData.append('address', address.trim());
//         formData.append('location', JSON.stringify({
//           latitude: location.latitude,
//           longitude: location.longitude
//         }));
  
//         images.forEach((image, index) => {
//           const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
//           const imageName = imageUri.split('/').pop();
//           formData.append('images', {
//             uri: imageUri,
//             type: 'image/jpeg',
//             name: imageName || `image${index}.jpg`,
//           });
//         });
  
//         const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
//           timeout: 30000,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${token}` // Add token to headers
//           }
//         });
        
//         if (response.data.status === 'success') {
//           Alert.alert('הצלחה', 'התלונה נשלחה בהצלחה');
//           // Clear form
//           setTitle('');
//           setDescription('');
//           setCategory('');
//           setAddress('');
//           setImages([]);
//           setSearchQuery('');
//         }
//       } catch (error) {
//         console.error('Error details:', error);
//         let errorMessage = 'שליחת התלונה נכשלה';
        
//         if (error.response?.status === 401) {
//           errorMessage = 'נא להתחבר מחדש למערכת';
//           AsyncStorage.removeItem('userToken');
//           navigation.navigate('Login');
//         } else if (error.code === 'ECONNABORTED') {
//           errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
//         } else if (error.response) {
//           errorMessage = `שגיאת שרת: ${error.response.data?.message || 'שגיאה לא ידועה'}`;
//         } else if (error.request) {
//           errorMessage = 'אין תגובה מהשרת - בדוק את החיבור שלך';
//         }
        
//         Alert.alert('שגיאה', errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//   // const handleSubmit = async () => {
//   //   if (!validateForm()) return;
    
//   //   setIsLoading(true);
    
//   //   try {
//   //     const isConnected = await testConnection();
//   //     if (!isConnected) {
//   //       Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
//   //       return;
//   //     }

//   //     const formData = new FormData();
//   //     formData.append('title', title.trim());
//   //     formData.append('description', description.trim());
//   //     formData.append('category', category);
//   //     formData.append('address', address.trim());
//   //     formData.append('location', JSON.stringify({
//   //       latitude: location.latitude,
//   //       longitude: location.longitude
//   //     }));

//   //     // Add images to FormData
//   //     images.forEach((image, index) => {
//   //       const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
//   //       const imageName = imageUri.split('/').pop();
//   //       formData.append('images', {
//   //         uri: imageUri,
//   //         type: 'image/jpeg',
//   //         name: imageName || `image${index}.jpg`,
//   //       });
//   //     });

//   //     const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
//   //       timeout: 30000,
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       }
//   //     });
      
//   //     if (response.data.status === 'success') {
//   //       Alert.alert('הצלחה', 'התלונה נשלחה בהצלחה');
//   //       // Clear form
//   //       setTitle('');
//   //       setDescription('');
//   //       setCategory('');
//   //       setAddress('');
//   //       setImages([]);
//   //       setSearchQuery('');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error details:', error);
//   //     let errorMessage = 'שליחת התלונה נכשלה';
//   //     if (error.code === 'ECONNABORTED') {
//   //       errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
//   //     } else if (error.response) {
//   //       errorMessage = `שגיאת שרת: ${error.response.data?.message || 'שגיאה לא ידועה'}`;
//   //     } else if (error.request) {
//   //       errorMessage = 'אין תגובה מהשרת - בדוק את החיבור שלך';
//   //     }
//   //     Alert.alert('שגיאה', errorMessage);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

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
//         <Text style={styles.headerTitle}>דיווח על בעיה</Text>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.content}>
//           <Text style={styles.title}>שליחת תלונה</Text>
//           <Text style={styles.subtitle}>
//             עזור לנו לשפר את העיר על ידי דיווח על בעיות שאתה מבחין בהן
//           </Text>

//           {/* Title Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="edit" size={20} color="#666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="כותרת התלונה"
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
//               placeholder="תאר את הבעיה בפירוט"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//          {/* Location Selection */}
//          <View style={styles.mapSection}>
//             <Text style={styles.categoryLabel}>בחירת מיקום</Text>
            
//             {/* Address Search */}
//             <View style={styles.searchContainer}>
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="חפש כתובת"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 onSubmitEditing={searchAddress}
//                 returnKeyType="search"
//               />
//               <TouchableOpacity 
//                 style={styles.searchButton}
//                 onPress={searchAddress}
//                 disabled={isSearching}
//               >
//                 {isSearching ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Icon name="search" size={20} color="#fff" />
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Selected Address Display */}
//             {address ? (
//               <View style={styles.selectedAddress}>
//                 <Icon name="map-pin" size={16} color="#666" />
//                 <Text style={styles.addressText}>{address}</Text>
//               </View>
//             ) : null}

//             {/* Map View */}
//             <MapView
//               style={styles.map}
//               region={location}
//               onRegionChangeComplete={setLocation}
//             >
//               <Marker
//                 coordinate={{
//                   latitude: location.latitude,
//                   longitude: location.longitude,
//                 }}
//                 draggable
//                 onDragEnd={handleMarkerDrag}
//               />
//             </MapView>
//           </View>

//           {/* Address Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="מיקום הבעיה"
//               value={address}
//               onChangeText={setAddress}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//           {/* Image Upload Section */}
//           <View style={styles.imageSection}>
//             <Text style={styles.categoryLabel}>הוספת תמונות (אופציונלי)</Text>
//             <Text style={styles.imageSubtext}>עד 3 תמונות</Text>
            
//             <View style={styles.imageContainer}>
//               {images.map((image, index) => (
//                 <View key={index} style={styles.imageWrapper}>
//                   <Image source={{ uri: image }} style={styles.imagePreview} />
//                   <TouchableOpacity
//                     style={styles.removeImageButton}
//                     onPress={() => removeImage(index)}
//                   >
//                     <Icon name="x" size={20} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
              
//               {images.length < 3 && (
//                 <TouchableOpacity
//                   style={styles.addImageButton}
//                   onPress={pickImage}
//                   disabled={isLoading}
//                 >
//                   <Icon name="camera" size={24} color="#8b5cf6" />
//                   <Text style={styles.addImageText}>הוסף תמונה</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* Categories */}
//           <Text style={styles.categoryLabel}>קטגוריה</Text>
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
//               {isLoading ? 'שולח...' : 'שלח דיווח'}
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
//     textAlign: 'right',
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
//     textAlign: 'right',
//   },
//   imageSection: {
//     marginBottom: 24,
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   imageWrapper: {
//     position: 'relative',
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   removeImageButton: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: '#ef4444',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addImageButton: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#8b5cf6',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f5f3ff',
//   },
//   addImageText: {
//     color: '#8b5cf6',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   imageSubtext: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
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


//   // New styles for map integration
//   mapSection: {
//     marginBottom: 24,
//   },
//   map: {
//     height: 200,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     marginRight: 8,
//     textAlign: 'right',
//   },
//   searchButton: {
//     backgroundColor: '#8b5cf6',
//     borderRadius: 12,
//     width: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectedAddress: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   addressText: {
//     marginLeft: 8,
//     color: '#666',
//     flex: 1,
//     textAlign: 'right',
//   },
// });

// export default ComplaintForm;







///////////////////////////////////////////////////////////////////////////////////////////////////
// ComplaintForm.js with Voice Recording Integration
// import React, { useState, useEffect } from 'react';
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
//   ActivityIndicator,
//   Image,
//   LogBox
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';

// // Ignore specific MapView warnings since we're using a simpler location approach
// LogBox.ignoreLogs([
//   'Possible Unhandled Promise Rejection',
//   'Warning: componentWillReceiveProps',
//   'Warning: componentWillMount',
//   'Tried to register two views with the same name AIRMapMarker'
// ]);

// // AssemblyAI API Key
// const ASSEMBLYAI_API_KEY = '80d26ee504f24552a40bda89c25a44d2';

// const ComplaintForm = ({ navigation }) => {
//   // State management
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [address, setAddress] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [images, setImages] = useState([]);
  
//   // Voice recording states
//   const [recording, setRecording] = useState(null);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [recordingStatus, setRecordingStatus] = useState('');
  
//   // Location state - simplified to avoid MapView conflicts
//   const [location, setLocation] = useState({
//     latitude: 31.7683,
//     longitude: 35.2137,
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [token, setToken] = useState(null);
//   const [showLocationPicker, setShowLocationPicker] = useState(false);

//   // Categories with icons
//   const categories = ['תשתית', 'חשמל', 'רעש', 'נקיון','מים וביוב'];
//   const categoryIcons = {
//     'תשתית': '🚧',
//     'חשמל': '💡',
//     'רעש': '🔊',
//     'נקיון': '🧹',
//     'מים וביוב': '💦🚰' 
//   };

//   // Server configuration
//   const SERVER_URL = 'http://192.168.116.111:5000';
  
//   // Request location permissions and get initial location
//   useEffect(() => {
//     const getToken = async () => {
//       try {
//         const userToken = await AsyncStorage.getItem('userToken');
//         if (!userToken) {
//           Alert.alert('שגיאה', 'נא להתחבר למערכת');
//           navigation.navigate('Login');
//           return;
//         }
//         setToken(userToken);
//       } catch (error) {
//         console.error('Error getting token:', error);
//         Alert.alert('שגיאה', 'בעיה בהתחברות למערכת');
//         navigation.navigate('Login');
//       }
//     };
//     getToken();
    
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('הרשאה נדרשת', 'אנא אפשר גישה למיקום כדי להשתמש במיקום הנוכחי');
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//       });
      
//       // Get address from coordinates
//       try {
//         const addresses = await Location.reverseGeocodeAsync({
//           latitude: currentLocation.coords.latitude,
//           longitude: currentLocation.coords.longitude
//         });
        
//         if (addresses.length > 0) {
//           const addr = addresses[0];
//           setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
//         }
//       } catch (error) {
//         console.error('Error getting address:', error);
//       }
//     })();
//   }, []);

//   // Voice recording functions
//   const startRecording = async () => {
//     try {
//       setRecordingStatus('מתחיל הקלטה...');
//       await Audio.requestPermissionsAsync();

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       setRecordingStatus('מקליט... לחץ שוב לסיום');
//     } catch (err) {
//       console.error('Error starting recording:', err);
//       Alert.alert('שגיאה', 'לא ניתן להתחיל הקלטה');
//       setRecordingStatus('');
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       setRecordingStatus('מסיים הקלטה...');
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecording(null);
//       await sendToAssemblyAI(uri);
//     } catch (err) {
//       console.error('Error stopping recording:', err);
//       Alert.alert('שגיאה', 'לא ניתן לסיים הקלטה');
//       setRecordingStatus('');
//     }
//   };

//   const sendToAssemblyAI = async (uri) => {
//     try {
//       setIsTranscribing(true);
//       setRecordingStatus('מתמלל הקלטה...');

//       // Upload audio file
//       const uploadRes = await FileSystem.uploadAsync('https://api.assemblyai.com/v2/upload', uri, {
//         headers: {
//           authorization: ASSEMBLYAI_API_KEY,
//         },
//         httpMethod: 'POST',
//         uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
//       });

//       const uploadData = JSON.parse(uploadRes.body);
//       const audioUrl = uploadData.upload_url;

//       // Request transcription
//       const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
//         method: 'POST',
//         headers: {
//           authorization: ASSEMBLYAI_API_KEY,
//           'content-type': 'application/json',
//         },
//         body: JSON.stringify({
//           audio_url: audioUrl,
//           language_code: 'he',
//           speech_model: 'nano'
//         }),
//       });

//       const transcriptData = await transcriptRes.json();
//       const transcriptId = transcriptData.id;

//       // Polling for results
//       let done = false;
//       let resultText = '';
//       while (!done) {
//         const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
//           headers: { authorization: ASSEMBLYAI_API_KEY },
//         });

//         const pollingData = await pollingRes.json();

//         if (pollingData.status === 'completed') {
//           resultText = pollingData.text;
//           done = true;
//         } else if (pollingData.status === 'error') {
//           resultText = '';
//           Alert.alert('שגיאה', `שגיאה בתמלול: ${pollingData.error}`);
//           done = true;
//         } else {
//           await new Promise((resolve) => setTimeout(resolve, 2000));
//         }
//       }

//       // Add the transcribed text to the description
//       if (resultText) {
//         setDescription(prevDescription => {
//           if (prevDescription.trim()) {
//             return `${prevDescription}\n\n${resultText}`;
//           }
//           return resultText;
//         });
//       }
//     } catch (err) {
//       console.error('Error in transcription process:', err);
//       Alert.alert('שגיאה', `שגיאה בתמלול: ${err.message}`);
//     } finally {
//       setIsTranscribing(false);
//       setRecordingStatus('');
//     }
//   };

//   // Function to search address
//   const searchAddress = async () => {
//     if (!searchQuery.trim()) return;

//     setIsSearching(true);
//     try {
//       const response = await Location.geocodeAsync(searchQuery);
//       if (response.length > 0) {
//         const { latitude, longitude } = response[0];
//         setLocation({
//           latitude,
//           longitude,
//         });
        
//         // Get address from coordinates
//         const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
//         if (addresses.length > 0) {
//           const addr = addresses[0];
//           setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
//         }
//       } else {
//         Alert.alert('לא נמצאה כתובת', 'נסה לחפש כתובת אחרת');
//       }
//     } catch (error) {
//       Alert.alert('שגיאה', 'אירעה שגיאה בחיפוש הכתובת');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Image handling functions
//   const pickImage = async () => {
//     if (Platform.OS !== 'web') {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('הרשאות חסרות', 'אנחנו צריכים הרשאות גישה לגלריה כדי לבחור תמונות');
//         return;
//       }
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.8,
//       allowsMultipleSelection: true,
//       maxSelectedPhotos: 3,
//     });

//     if (!result.canceled) {
//       const newImages = result.assets.map(asset => asset.uri);
//       if (images.length + newImages.length > 3) {
//         Alert.alert('מקסימום תמונות', 'ניתן להעלות עד 3 תמונות');
//         return;
//       }
//       setImages([...images, ...newImages]);
//     }
//   };

//   const removeImage = (index) => {
//     const newImages = [...images];
//     newImages.splice(index, 1);
//     setImages(newImages);
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     try {
//       setIsSearching(true);
//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//       });
      
//       // Get address from coordinates
//       const addresses = await Location.reverseGeocodeAsync({
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude
//       });
      
//       if (addresses.length > 0) {
//         const addr = addresses[0];
//         setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
//       }
//     } catch (error) {
//       console.error('Error getting current location:', error);
//       Alert.alert('שגיאה', 'לא ניתן לקבל את המיקום הנוכחי');
//     } finally {
//       setIsSearching(false);
//     }
//   };

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
//       Alert.alert('שגיאת אימות', 'אנא הכנס כותרת');
//       return false;
//     }
//     if (!description.trim()) {
//       Alert.alert('שגיאת אימות', 'אנא הכנס תיאור');
//       return false;
//     }
//     if (!category) {
//       Alert.alert('שגיאת אימות', 'אנא בחר קטגוריה');
//       return false;
//     }
//     if (!address.trim()) {
//       Alert.alert('שגיאת אימות', 'אנא הכנס כתובת');
//       return false;
//     }
//     return true;
//   };

//   // Form submission handler
//   const handleSubmit = async () => {
//     if (!token) {
//       Alert.alert('שגיאה', 'נא להתחבר למערכת');
//       navigation.navigate('Login');
//       return;
//     }
//     const userId = await AsyncStorage.getItem('userId');

//     if (!validateForm()) return;
    
//     setIsLoading(true);
    
//     try {
//       const isConnected = await testConnection();
//       if (!isConnected) {
//         Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
//         return;
//       }

//       const formData = new FormData();
//       formData.append('userId', userId);
//       formData.append('title', title.trim());
//       formData.append('description', description.trim());
//       formData.append('category', category);
//       formData.append('address', address.trim());
//       formData.append('location', JSON.stringify({
//         latitude: location.latitude,
//         longitude: location.longitude
//       }));

//       images.forEach((image, index) => {
//         const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
//         const imageName = imageUri.split('/').pop();
//         formData.append('images', {
//           uri: imageUri,
//           type: 'image/jpeg',
//           name: imageName || `image${index}.jpg`,
//         });
//       });

//       const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
//         timeout: 30000,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.status === 'success') {
//         Alert.alert('הצלחה', 'התלונה נשלחה בהצלחה');
//         // Clear form
//         setTitle('');
//         setDescription('');
//         setCategory('');
//         setAddress('');
//         setImages([]);
//         setSearchQuery('');
//       }
//     } catch (error) {
//       console.error('Error details:', error);
//       let errorMessage = 'שליחת התלונה נכשלה';
      
//       if (error.response?.status === 401) {
//         errorMessage = 'נא להתחבר מחדש למערכת';
//         AsyncStorage.removeItem('userToken');
//         navigation.navigate('Login');
//       } else if (error.code === 'ECONNABORTED') {
//         errorMessage = 'תם הזמן הקצוב לחיבור - אנא נסה שוב';
//       } else if (error.response) {
//         errorMessage = `שגיאת שרת: ${error.response.data?.message || 'שגיאה לא ידועה'}`;
//       } else if (error.request) {
//         errorMessage = 'אין תגובה מהשרת - בדוק את החיבור שלך';
//       }
      
//       Alert.alert('שגיאה', errorMessage);
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
//         <Text style={styles.headerTitle}>דיווח על בעיה</Text>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.content}>
//           <Text style={styles.title}>שליחת תלונה</Text>
         

//           {/* Title Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="edit" size={20} color="#666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="כותרת התלונה"
//               value={title}
//               onChangeText={setTitle}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//           {/* Description Input with Voice Recording */}
//           <View style={styles.inputContainer}>
//             <Icon 
//               name="alert-circle" 
//               size={20} 
//               color="#666" 
//               style={[styles.inputIcon, { top: 15 }]} 
//             />
//             <TextInput
//               style={styles.textArea}
//               placeholder="תאר את הבעיה בפירוט"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//               placeholderTextColor="#666"
//               editable={!isLoading && !isTranscribing}
//             />
            
//             {/* Voice Recording Button */}
//             <View style={styles.voiceButtonContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.voiceButton,
//                   recording && styles.voiceButtonRecording,
//                   isTranscribing && styles.voiceButtonDisabled
//                 ]}
//                 onPress={recording ? stopRecording : startRecording}
//                 disabled={isLoading || isTranscribing}
//               >
//                 <Icon 
//                   name={recording ? "square" : "mic"} 
//                   size={20} 
//                   color="#fff" 
//                 />
//                 <Text style={styles.voiceButtonText}>
//                   {recording ? "עצור הקלטה" : "הקלט קול"}
//                 </Text>
//               </TouchableOpacity>
              
//               {recordingStatus ? (
//                 <Text style={styles.recordingStatusText}>{recordingStatus}</Text>
//               ) : null}
              
//               {isTranscribing && (
//                 <ActivityIndicator size="small" color="#8b5cf6" style={{ marginLeft: 8 }} />
//               )}
//             </View>
//           </View>

//           {/* Location Selection - Simplified without MapView */}
//           <View style={styles.locationSection}>
//             <Text style={styles.categoryLabel}>בחירת מיקום</Text>
            
//             {/* Address Search */}
//             <View style={styles.searchContainer}>
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="חפש כתובת"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 onSubmitEditing={searchAddress}
//                 returnKeyType="search"
//               />
//               <TouchableOpacity 
//                 style={styles.searchButton}
//                 onPress={searchAddress}
//                 disabled={isSearching}
//               >
//                 {isSearching ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Icon name="search" size={20} color="#fff" />
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Current Location Button */}
//             <TouchableOpacity
//               style={styles.currentLocationButton}
//               onPress={getCurrentLocation}
//               disabled={isSearching}
//             >
//               <Icon name="map-pin" size={18} color="#fff" />
//               <Text style={styles.currentLocationText}>השתמש במיקום הנוכחי</Text>
//             </TouchableOpacity>

//             {/* Selected Address Display */}
//             {address ? (
//               <View style={styles.selectedAddress}>
//                 <Icon name="map-pin" size={16} color="#666" />
//                 <Text style={styles.addressText}>{address}</Text>
//               </View>
//             ) : null}
            
//             {/* Location Info */}
//             <View style={styles.locationInfo}>
//               <Text style={styles.locationInfoText}>
//                 נקודות ציון: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
//               </Text>
//             </View>
//           </View>

//           {/* Address Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="מיקום הבעיה"
//               value={address}
//               onChangeText={setAddress}
//               placeholderTextColor="#666"
//               editable={!isLoading}
//             />
//           </View>

//           {/* Image Upload Section */}
//           <View style={styles.imageSection}>
//             <Text style={styles.categoryLabel}>הוספת תמונות (אופציונלי)</Text>
//             <Text style={styles.imageSubtext}>עד 3 תמונות</Text>
            
//             <View style={styles.imageContainer}>
//               {images.map((image, index) => (
//                 <View key={index} style={styles.imageWrapper}>
//                   <Image source={{ uri: image }} style={styles.imagePreview} />
//                   <TouchableOpacity
//                     style={styles.removeImageButton}
//                     onPress={() => removeImage(index)}
//                   >
//                     <Icon name="x" size={20} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
              
//               {images.length < 3 && (
//                 <TouchableOpacity
//                   style={styles.addImageButton}
//                   onPress={pickImage}
//                   disabled={isLoading}
//                 >
//                   <Icon name="camera" size={24} color="#8b5cf6" />
//                   <Text style={styles.addImageText}>הוסף תמונה</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* Categories */}
//           <Text style={styles.categoryLabel}>קטגוריה</Text>
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
//               {isLoading ? 'שולח...' : 'שלח דיווח'}
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
//     textAlign: 'right',
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
//     textAlign: 'right',
//   },
//   // Voice recording styles
//   voiceButtonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   voiceButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#8b5cf6',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   voiceButtonRecording: {
//     backgroundColor: '#ef4444',
//   },
//   voiceButtonDisabled: {
//     opacity: 0.5,
//   },
//   voiceButtonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   recordingStatusText: {
//     marginLeft: 12,
//     color: '#666',
//     fontSize: 14,
//   },
//   // Location styles - simplified without MapView
//   locationSection: {
//     marginBottom: 24,
//   },
//   currentLocationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#6b7280',
//     padding: 12,
//     borderRadius: 12,
//     marginTop: 8,
//     marginBottom: 12,
//     justifyContent: 'center',
//   },
//   currentLocationText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   locationInfo: {
//     backgroundColor: '#f3f4f6',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   locationInfoText: {
//     color: '#4b5563',
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     marginRight: 8,
//     textAlign: 'right',
//   },
//   searchButton: {
//     backgroundColor: '#8b5cf6',
//     borderRadius: 12,
//     width: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectedAddress: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   addressText: {
//     marginLeft: 8,
//     color: '#666',
//     flex: 1,
//     textAlign: 'right',
//   },
//   // Image upload styles
//   imageSection: {
//     marginBottom: 24,
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   imageWrapper: {
//     position: 'relative',
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   removeImageButton: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: '#ef4444',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addImageButton: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#8b5cf6',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f5f3ff',
//   },
//   addImageText: {
//     color: '#8b5cf6',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   imageSubtext: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
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

//   // Map styles
//   mapSection: {
//     marginBottom: 24,
//   },
//   map: {
//     height: 200,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     marginRight: 8,
//     textAlign: 'right',
//   },
//   searchButton: {
//     backgroundColor: '#8b5cf6',
//     borderRadius: 12,
//     width: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectedAddress: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   addressText: {
//     marginLeft: 8,
//     color: '#666',
//     flex: 1,
//     textAlign: 'right',
//   },
// });

// export default ComplaintForm;



/////////////////////////
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
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// AssemblyAI API Key - consider storing this securely
const ASSEMBLYAI_API_KEY = '80d26ee504f24552a40bda89c25a44d2';

const ComplaintForm = ({ navigation }) => {
  // Original state management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({
    latitude: 31.7683,
    longitude: 35.2137,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [token, setToken] = useState(null);

  // Voice recording state
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeRecordingField, setActiveRecordingField] = useState(null); // 'title', 'description', or 'address'

  // Categories with icons
  const categories = ['תשתית', 'חשמל', 'רעש', 'נקיון','מים וביוב'];
  const categoryIcons = {
    'תשתית': '🚧',
    'חשמל': '💡',
    'רעש': '🔊',
    'נקיון': '🧹',
    'מים וביוב': '💦🚰' 
  };

  // Server configuration
  const SERVER_URL = 'http://192.168.1.3:5000';
  
  // Request location permissions and get initial location
  useEffect(() => {
    const getToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          Alert.alert('שגיאה', 'נא להתחבר למערכת');
          navigation.navigate('Login');
          return;
        }
        setToken(userToken);
      } catch (error) {
        console.error('Error getting token:', error);
        Alert.alert('שגיאה', 'בעיה בהתחברות למערכת');
        navigation.navigate('Login');
      }
    };
    
    getToken();
    
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

  // Voice recording functions
  const startRecording = async (fieldName) => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setActiveRecordingField(fieldName);
    } catch (err) {
      console.error('Error starting recording:', err);
      Alert.alert('שגיאה', 'לא ניתן להתחיל הקלטה');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      
      setIsRecording(false);
      setIsTranscribing(true);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      // Send the recording for transcription
      await sendToAssemblyAI(uri);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setIsTranscribing(false);
      setActiveRecordingField(null);
      Alert.alert('שגיאה', 'אירעה שגיאה בהקלטה');
    }
  };

  const cancelRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
      setIsRecording(false);
      setActiveRecordingField(null);
    } catch (err) {
      console.error('Error canceling recording:', err);
    }
  };

  const sendToAssemblyAI = async (uri) => {
    try {
      console.log("Uploading audio file...");

      // Upload audio file
      const uploadRes = await FileSystem.uploadAsync('https://api.assemblyai.com/v2/upload', uri, {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      const uploadData = JSON.parse(uploadRes.body);
      console.log("Upload response:", uploadData);

      const audioUrl = uploadData.upload_url;

      console.log("Audio uploaded. Sending transcription request...");

      // Request transcription
      const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          language_code: 'he',  // Hebrew transcription
          speech_model: 'nano'  // nano model
        }),
      });

      const transcriptData = await transcriptRes.json();
      console.log("Transcript request response:", transcriptData);

      const transcriptId = transcriptData.id;

      // Polling for results
      let done = false;
      let resultText = '';
      while (!done) {
        const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { authorization: ASSEMBLYAI_API_KEY },
        });

        const pollingData = await pollingRes.json();
        console.log("Polling response:", pollingData);

        if (pollingData.status === 'completed') {
          resultText = pollingData.text;
          done = true;
        } else if (pollingData.status === 'error') {
          resultText = '';
          Alert.alert('שגיאה בתמלול', pollingData.error || 'אירעה שגיאה לא ידועה');
          done = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Update the appropriate field with transcribed text based on activeRecordingField
      if (resultText) {
        switch (activeRecordingField) {
          case 'title':
            setTitle(title ? title + ' ' + resultText : resultText);
            break;
          case 'description':
            setDescription(description ? description + ' ' + resultText : resultText);
            break;
          case 'address':
            setAddress(address ? address + ' ' + resultText : resultText);
            // Try to search for this address if it was transcribed
            if (resultText.trim()) {
              setSearchQuery(resultText.trim());
              // We'll search for this address after a short delay to ensure the UI updates first
              setTimeout(() => {
                searchAddress();
              }, 500);
            }
            break;
          default:
            break;
        }
      }
    } catch (err) {
      console.error('Error in transcription process:', err);
      Alert.alert('שגיאה', `שגיאה בתמלול: ${err.message}`);
    } finally {
      setIsTranscribing(false);
      setActiveRecordingField(null);
    }
  };

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

  // Form submission handler
  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('שגיאה', 'נא להתחבר למערכת');
      navigation.navigate('Login');
      return;
    }
    const userId = await AsyncStorage.getItem('userId');

    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        Alert.alert('שגיאת חיבור', 'לא ניתן להתחבר לשרת. אנא נסה שוב מאוחר יותר');
        return;
      }

      const formData = new FormData();
      formData.append('userId', userId);
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

      const response = await axios.post(`${SERVER_URL}/api/complaints`, formData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
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
      
      if (error.response?.status === 401) {
        errorMessage = 'נא להתחבר מחדש למערכת';
        AsyncStorage.removeItem('userToken');
        navigation.navigate('Login');
      } else if (error.code === 'ECONNABORTED') {
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

          {/* Title Input with Voice Recording */}
          <View style={styles.inputContainer}>
            <Icon name="edit" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="כותרת התלונה"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#666"
              editable={!isLoading && !isRecording && !(isTranscribing && activeRecordingField === 'title')}
            />
          </View>
          
          {/* Title Voice Recording Controls */}
          <View style={styles.voiceControlsContainer}>
            {!isRecording && !isTranscribing ? (
              <TouchableOpacity 
                style={styles.voiceButton}
                onPress={() => startRecording('title')}
                disabled={isLoading}
              >
                <Icon name="mic" size={20} color="#8b5cf6" />
                <Text style={styles.voiceButtonText}>הקלט כותרת</Text>
              </TouchableOpacity>
            ) : activeRecordingField === 'title' && isRecording ? (
              <View style={styles.recordingControls}>
                <TouchableOpacity 
                  style={[styles.recordingButton, styles.stopButton]}
                  onPress={stopRecording}
                >
                  <Icon name="stop-circle" size={24} color="#ef4444" />
                  <Text style={styles.recordingButtonText}>סיים הקלטה</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.recordingButton}
                  onPress={cancelRecording}
                >
                  <Icon name="x-circle" size={24} color="#666" />
                  <Text style={styles.recordingButtonText}>בטל</Text>
                </TouchableOpacity>
              </View>
            ) : activeRecordingField === 'title' && isTranscribing ? (
              <View style={styles.transcribingIndicator}>
                <ActivityIndicator color="#8b5cf6" />
                <Text style={styles.transcribingText}>מתמלל הקלטה...</Text>
              </View>
            ) : null}
          </View>

          {/* Description Input with Voice Recording */}
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
              editable={!isLoading && !isRecording && !(isTranscribing && activeRecordingField === 'description')}
            />
            
            {/* Voice Recording Controls */}
            <View style={styles.voiceControlsContainer}>
              {!isRecording && !isTranscribing ? (
                <TouchableOpacity 
                  style={styles.voiceButton}
                  onPress={() => startRecording('description')}
                  disabled={isLoading}
                >
                  <Icon name="mic" size={20} color="#8b5cf6" />
                  <Text style={styles.voiceButtonText}>הקלט תיאור</Text>
                </TouchableOpacity>
              ) : activeRecordingField === 'description' && isRecording ? (
                <View style={styles.recordingControls}>
                  <TouchableOpacity 
                    style={[styles.recordingButton, styles.stopButton]}
                    onPress={stopRecording}
                  >
                    <Icon name="stop-circle" size={24} color="#ef4444" />
                    <Text style={styles.recordingButtonText}>סיים הקלטה</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.recordingButton}
                    onPress={cancelRecording}
                  >
                    <Icon name="x-circle" size={24} color="#666" />
                    <Text style={styles.recordingButtonText}>בטל</Text>
                  </TouchableOpacity>
                </View>
              ) : activeRecordingField === 'description' && isTranscribing ? (
                <View style={styles.transcribingIndicator}>
                  <ActivityIndicator color="#8b5cf6" />
                  <Text style={styles.transcribingText}>מתמלל הקלטה...</Text>
                </View>
              ) : null}
            </View>
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

          {/* Address Input with Voice Recording */}
          <View style={styles.inputContainer}>
            <Icon name="map-pin" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="מיקום הבעיה"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#666"
              editable={!isLoading && !isRecording && !(isTranscribing && activeRecordingField === 'address')}
            />
          </View>
          
          {/* Address Voice Recording Controls */}
          <View style={styles.voiceControlsContainer}>
            {!isRecording && !isTranscribing ? (
              <TouchableOpacity 
                style={styles.voiceButton}
                onPress={() => startRecording('address')}
                disabled={isLoading}
              >
                <Icon name="mic" size={20} color="#8b5cf6" />
                <Text style={styles.voiceButtonText}>הקלט מיקום</Text>
              </TouchableOpacity>
            ) : activeRecordingField === 'address' && isRecording ? (
              <View style={styles.recordingControls}>
                <TouchableOpacity 
                  style={[styles.recordingButton, styles.stopButton]}
                  onPress={stopRecording}
                >
                  <Icon name="stop-circle" size={24} color="#ef4444" />
                  <Text style={styles.recordingButtonText}>סיים הקלטה</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.recordingButton}
                  onPress={cancelRecording}
                >
                  <Icon name="x-circle" size={24} color="#666" />
                  <Text style={styles.recordingButtonText}>בטל</Text>
                </TouchableOpacity>
              </View>
            ) : activeRecordingField === 'address' && isTranscribing ? (
              <View style={styles.transcribingIndicator}>
                <ActivityIndicator color="#8b5cf6" />
                <Text style={styles.transcribingText}>מתמלל הקלטה...</Text>
              </View>
            ) : null}
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
  
  // Voice Recording Styles
  voiceControlsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  voiceButtonText: {
    color: '#8b5cf6',
    marginLeft: 8,
    fontWeight: '500',
  },
  recordingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  recordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  stopButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  recordingButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  transcribingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  transcribingText: {
    marginLeft: 8,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  
  // Field voice recording buttons
  fieldVoiceButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#f5f3ff',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  fieldRecordingStatus: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#f5f3ff',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d8b4fe',
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

  // Map styles
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
}
);

export default ComplaintForm;