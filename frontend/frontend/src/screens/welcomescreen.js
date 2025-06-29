// import React from 'react';
// import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const WelcomeScreen=({ navigation })=> {
//   return (
//     <LinearGradient
//     colors={[ '#FFFFFF','#00b4d8','#00b4d8','#FFFFFF']} 
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.innerContainer}>
//         <Text style={styles.title}>Welcome to ComplaintHub</Text>
//         <Text style={styles.subtitle}></Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('loginOption')} // Change 'NextScreen' to your actual route name
//         >
//           <Text style={styles.buttonText}>Get Started</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#d3d3d3',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   button: {
//     backgroundColor: '#ffffff',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#192f6a',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default  WelcomeScreen;


import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ComplaintHubLogo = () => (
  <Image 
    source={require('./assets/logo.png')} // או הנתיב לקובץ הלוגו שלכם
    style={styles.logoImage}
    resizeMode="contain"
  />
);

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#4f46e5', '#667eea', '#f5f5f5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        {/* רקע עם עיגולים דקורטיביים */}
        <View style={styles.backgroundShapes}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          {/* לוגו ראשי */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <ComplaintHubLogo />
            </View>
          </View>

          {/* כותרת ראשית */}
          <Text style={styles.brandText}>ComplaintHub</Text>
          <Text style={styles.tagline}>Your Voice, Our Action</Text>
          
          {/* תת-כותרת */}
          <Text style={styles.subtitle}>
            הפלטפורמה החכמה לניהול תלונות עירוניות
          </Text>
          
          {/* תיאור קצר */}
          <Text style={styles.description}>
            דווח על בעיות, עקוב אחר התקדמות ושפר את איכות החיים בעיר שלך
          </Text>

          {/* כפתור התחלה */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('loginOption')}
            activeOpacity={0.9}
          >
            <Text style={styles.startButtonText}>בואו נתחיל</Text>
            <Text style={styles.startButtonArrow}>←</Text>
          </TouchableOpacity>

          {/* נקודות מידע */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>מהיר ופשוט</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>בטוח ומאובטח</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>מעקב בזמן אמת</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1000,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.2,
    left: -50,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  brandText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 18,
    color: '#f0f8ff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: '#e6f3ff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonText: {
    color: '#4f46e5',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  startButtonArrow: {
    color: '#4f46e5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
