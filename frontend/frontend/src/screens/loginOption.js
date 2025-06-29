// // import React from 'react';
// // import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { useNavigation } from '@react-navigation/native';

// // const loginOption = () => {
// //   const navigation = useNavigation(); // שימוש ב-Hook

// //   return (
// //     <LinearGradient
// //       colors={['#FFFFFF', '#00b4d8', '#00b4d8', '#FFFFFF']}
// //       start={{ x: 1, y: 4 }}
// //       end={{ x: 0.5, y: 0 }}
// //       style={styles.container}
// //     >
// //       <Text style={styles.title}>Select Your Role</Text>

// //       <View style={styles.grid}>
// //         <TouchableOpacity
// //           style={styles.card}
// //           onPress={() => navigation.navigate('Login')}
// //         >
// //           <Image
// //             source={{ uri: 'https://img.icons8.com/ios/50/000000/user-male-circle.png' }}
// //             style={styles.icon}
// //           />
// //           <Text style={styles.label}>Citizen</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.card} 
// //             onPress={() => navigation.navigate('loginScreen')}>
// //           <Image
// //             source={{ uri: 'https://img.icons8.com/ios/50/000000/admin-settings-male.png' }}
// //             style={styles.icon}
// //           />
// //           <Text style={styles.label}>Manager</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.card} onPress={() => alert('Guest Selected')}>
// //           <Image
// //             source={{ uri: 'https://img.icons8.com/ios/50/000000/guest-male.png' }}
// //             style={styles.icon}
// //           />
// //           <Text style={styles.label}>Guest</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.card} 
// //             onPress={() => navigation.navigate('loginScreen')}>
// //                           <Image
// //             source={{ uri: 'https://img.icons8.com/ios/50/000000/conference-call.png' }}
// //             style={styles.icon}
// //           />
// //           <Text style={styles.label}>Employee</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </LinearGradient>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 30,
// //     color: '#333',
// //   },
// //   grid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'center',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     width: 120,
// //     height: 120,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     margin: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     elevation: 5,
// //   },
// //   icon: {
// //     width: 50,
// //     height: 50,
// //     marginBottom: 10,
// //   },
// //   label: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#333',
// //   },
// // });

// // export default loginOption;

// // עדכון ל-loginOption.js - גרסה פשוטה עם אורח

// import React from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';

// const loginOption = () => {
//   const navigation = useNavigation();

//   return (
//     <LinearGradient
//       colors={['#FFFFFF', '#00b4d8', '#00b4d8', '#FFFFFF']}
//       start={{ x: 1, y: 4 }}
//       end={{ x: 0.5, y: 0 }}
//       style={styles.container}
//     >
//       <Text style={styles.title}>בחר את סוג המשתמש</Text>

//       <View style={styles.grid}>
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Image
//             source={{ uri: 'https://img.icons8.com/ios/50/000000/user-male-circle.png' }}
//             style={styles.icon}
//           />
//           <Text style={styles.label}>תושב רשום</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('loginScreen')}
//         >
//           <Image
//             source={{ uri: 'https://img.icons8.com/ios/50/000000/admin-settings-male.png' }}
//             style={styles.icon}
//           />
//           <Text style={styles.label}>מנהל</Text>
//         </TouchableOpacity>

//         {/* כפתור אורח פשוט */}
//         <TouchableOpacity 
//           style={[styles.card, styles.guestCard]} 
//           onPress={() => navigation.navigate('SimpleGuestComplaintForm')}
//         >
//           <Image
//             source={{ uri: 'https://img.icons8.com/ios/50/000000/guest-male.png' }}
//             style={styles.icon}
//           />
//           <Text style={styles.label}>אורח</Text>
//           <Text style={styles.sublabel}>הגש תלונה מהר</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('loginScreen')}
//         >
//           <Image
//             source={{ uri: 'https://img.icons8.com/ios/50/000000/conference-call.png' }}
//             style={styles.icon}
//           />
//           <Text style={styles.label}>עובד</Text>
//         </TouchableOpacity>
//       </View>

//       {/* הסבר קצר על אורח */}
//       <View style={styles.explanationBox}>
//         <Text style={styles.explanationText}>
//           💡 בחר "אורח" כדי להגיש תלונה מהר ללא הרשמה
//         </Text>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     color: '#333',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 30,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     width: 120,
//     height: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   guestCard: {
//     backgroundColor: '#e8f5e8',
//     borderColor: '#4CAF50',
//     borderWidth: 2,
//     height: 140, // גובה מוגדל לכפתור אורח
//   },
//   icon: {
//     width: 50,
//     height: 50,
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
//   sublabel: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   explanationBox: {
//     backgroundColor: '#f0f9ff',
//     padding: 15,
//     borderRadius: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#4CAF50',
//     marginHorizontal: 20,
//   },
//   explanationText: {
//     fontSize: 14,
//     color: '#1e40af',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

// export default loginOption;

// import React, { useEffect, useRef } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const loginOption = () => {
//   const navigation = useNavigation();
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const userTypes = [
//     {
//       id: 'citizen',
//       title: 'תושב רשום',
//       subtitle: 'גישה מלאה למערכת',
//       icon: 'https://img.icons8.com/fluency/96/000000/user.png',
//       colors: ['#4f46e5', '#667eea'],
//       onPress: () => navigation.navigate('Login'),
//     },
//     {
//       id: 'manager',
//       title: 'מנהל',
//       subtitle: 'ניהול תלונות ודוחות',
//       icon: 'https://img.icons8.com/fluency/96/000000/admin-settings-male.png',
//       colors: ['#2196F3', '#42A5F5'],
//       onPress: () => navigation.navigate('loginScreen'),
//     },
//     {
//       id: 'guest',
//       title: 'אורח',
//       subtitle: 'הגש תלונה מהר',
//       icon: 'https://img.icons8.com/fluency/96/000000/guest-male.png',
//       colors: ['#4CAF50', '#66BB6A'],
//       onPress: () => navigation.navigate('SimpleGuestComplaintForm'),
//       featured: true,
//     },
//     {
//       id: 'employee',
//       title: 'עובד',
//       subtitle: 'טיפול בתלונות',
//       icon: 'https://img.icons8.com/fluency/96/000000/conference-call.png',
//       colors: ['#FF9800', '#FFB74D'],
//       onPress: () => navigation.navigate('loginScreen'),
//     },
//   ];

//   return (
//     <LinearGradient
//       colors={['#4f46e5', '#667eea', '#f5f5f5']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.container}
//     >
//       {/* רקע דקורטיבי */}
//       <View style={styles.backgroundPattern}>
//         <View style={[styles.patternCircle, styles.circle1]} />
//         <View style={[styles.patternCircle, styles.circle2]} />
//         <View style={[styles.patternCircle, styles.circle3]} />
//       </View>

//       <Animated.View
//         style={[
//           styles.content,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           },
//         ]}
//       >
//         {/* כותרת */}
//         <View style={styles.header}>
//           <Text style={styles.title}>בחר את סוג המשתמש</Text>
//           <Text style={styles.subtitle}>איך תרצה להשתמש במערכת?</Text>
//         </View>

//         {/* רשת הכפתורים */}
//         <View style={styles.grid}>
//           {userTypes.map((userType, index) => (
//             <Animated.View
//               key={userType.id}
//               style={[
//                 {
//                   transform: [{
//                     translateY: slideAnim.interpolate({
//                       inputRange: [0, 30],
//                       outputRange: [0, 30 + (index * 10)],
//                     })
//                   }]
//                 }
//               ]}
//             >
//               <TouchableOpacity
//                 style={[
//                   styles.card,
//                   userType.featured && styles.featuredCard,
//                 ]}
//                 onPress={userType.onPress}
//                 activeOpacity={0.8}
//               >
//                 <LinearGradient
//                   colors={userType.colors}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.cardGradient}
//                 >
//                   {/* {userType.featured && (
//                     <View style={styles.featuredBadge}>
//                       <Text style={styles.featuredText}>מומלץ</Text>
//                     </View>
//                   )}
//                    */}
//                   <View style={styles.iconContainer}>
//                     <Image source={{ uri: userType.icon }} style={styles.icon} />
//                   </View>
                  
//                   <Text style={styles.cardTitle}>{userType.title}</Text>
//                   <Text style={styles.cardSubtitle}>{userType.subtitle}</Text>
                  
//                   <View style={styles.arrowContainer}>
//                     <Text style={styles.arrow}>→</Text>
//                   </View>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </Animated.View>
//           ))}
//         </View>

//         {/* הסבר על אורח
//         <Animated.View
//           style={[
//             styles.infoBox,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateY: slideAnim }],
//             },
//           ]}
//         >
//           <View style={styles.infoContent}>
//             <Text style={styles.infoIcon}>💡</Text>
//             <View style={styles.infoTextContainer}>
//               <Text style={styles.infoTitle}>טיפ:</Text>
//               <Text style={styles.infoText}>
//                 בחר "אורח" כדי להגיש תלונה מהר ללא הרשמה
//               </Text>
//             </View>
//           </View>
//         </Animated.View> */}
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundPattern: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   patternCircle: {
//     position: 'absolute',
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: 1000,
//   },
//   circle1: {
//     width: 300,
//     height: 300,
//     top: -150,
//     right: -150,
//   },
//   circle2: {
//     width: 200,
//     height: 200,
//     bottom: -100,
//     left: -100,
//   },
//   circle3: {
//     width: 150,
//     height: 150,
//     top: '40%',
//     left: -75,
//   },
//   content: {
//     flex: 1,
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 8,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#e6f3ff',
//     textAlign: 'center',
//     opacity: 0.9,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//   },
//   card: {
//     width: (width - 60) / 2,
//     marginBottom: 20,
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   featuredCard: {
//     transform: [{ scale: 1.05 }],
//   },
//   cardGradient: {
//     padding: 20,
//     alignItems: 'center',
//     minHeight: 160,
//     position: 'relative',
//   },
//   featuredBadge: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   featuredText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   iconContainer: {
//     marginBottom: 12,
//   },
//   icon: {
//     width: 50,
//     height: 50,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   cardSubtitle: {
//     fontSize: 12,
//     color: '#ffffff',
//     textAlign: 'center',
//     opacity: 0.8,
//     marginBottom: 12,
//   },
//   arrowContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   arrow: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   infoBox: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     borderRadius: 15,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   infoContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   infoIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   infoTextContainer: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#4f46e5',
//     marginBottom: 2,
//   },
//   infoText: {
//     fontSize: 13,
//     color: '#1f2937',
//     lineHeight: 18,
//   },
// });

// export default loginOption;
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const loginOption = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const userTypes = [
    {
      id: 'citizen',
      title: 'תושב רשום',
      subtitle: 'גישה מלאה למערכת',
      icon: 'https://img.icons8.com/color/96/000000/user.png',
      color: '#4f46e5',
      onPress: () => navigation.navigate('Login'),
    },
    {
      id: 'manager',
      title: 'מנהל',
      subtitle: 'ניהול תלונות ודוחות',
      icon: 'https://img.icons8.com/fluency/96/000000/admin-settings-male.png',
      color: '#2196F3',
      onPress: () => navigation.navigate('loginScreen'),
    },
    {
      id: 'guest',
      title: 'אורח',
      subtitle: 'הגש תלונה מהר',
      icon: 'https://img.icons8.com/fluency/96/000000/guest-male.png',
      color: '#4CAF50',
      onPress: () => navigation.navigate('SimpleGuestComplaintForm'),
    },
    {
      id: 'employee',
      title: 'עובד',
      subtitle: 'טיפול בתלונות',
      icon: 'https://img.icons8.com/fluency/96/000000/conference-call.png',
      color: '#FF9800',
      onPress: () => navigation.navigate('loginScreen'),
    },
  ];

  return (
    <LinearGradient
      colors={['#4f46e5', '#667eea', '#f5f5f5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* רקע דקורטיבי */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.patternCircle, styles.circle1]} />
        <View style={[styles.patternCircle, styles.circle2]} />
        <View style={[styles.patternCircle, styles.circle3]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* כותרת */}
        <View style={styles.header}>
          <Text style={styles.title}>בחר את סוג המשתמש</Text>
          <Text style={styles.subtitle}>איך תרצה להשתמש במערכת?</Text>
        </View>

        {/* רשת הכפתורים */}
        <View style={styles.grid}>
          {userTypes.map((userType, index) => (
            <Animated.View
              key={userType.id}
              style={[
                {
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + (index * 10)],
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={userType.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${userType.color}20` }]}>
                    <Image source={{ uri: userType.icon }} style={styles.icon} />
                  </View>
                  
                  <Text style={styles.cardTitle}>{userType.title}</Text>
                  <Text style={styles.cardSubtitle}>{userType.subtitle}</Text>
                  
                  <View style={[styles.arrowContainer, { backgroundColor: `${userType.color}20` }]}>
                    <Text style={[styles.arrow, { color: userType.color }]}>←</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1000,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -150,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -100,
    left: -100,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    left: -75,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#e6f3ff',
    textAlign: 'center',
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: (width - 80) / 2,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
  },
  iconContainer: {
    marginBottom: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default loginOption;