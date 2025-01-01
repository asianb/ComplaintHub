import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HomePage = ({ navigation }) => {
  const updates = [
    { id: '1', title: 'שיפור תשתיות בכבישים באזור הצפון' },
    { id: '2', title: 'אירועי קיץ בפארק העירוני' },
    { id: '3', title: 'הודעה: הפסקת מים מתוכננת ביום חמישי' },
  ];

  const renderUpdate = ({ item }) => (
    <View style={styles.updateCard}>
      <Text style={styles.updateText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* כותרת וברכה */}
      <Text style={styles.title}>ברוך הבא, אזרח יקר!</Text>
      <Text style={styles.subtitle}>מה תרצה לעשות היום?</Text>

      {/* קיצורים מהירים */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ComplaintForm')}
        >
          <MaterialIcons name="report-problem" size={40} color="#fff" />
          <Text style={styles.actionText}>הגש תלונה</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert('בקרוב! מעקב תלונות.')}
        >
          <MaterialIcons name="track-changes" size={40} color="#fff" />
          <Text style={styles.actionText}>מעקב תלונה</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert('פרטי יצירת קשר עם העירייה.')}
        >
          <MaterialIcons name="phone" size={40} color="#fff" />
          <Text style={styles.actionText}>יצירת קשר</Text>
        </TouchableOpacity>
      </View>

      {/* רשימת עדכונים */}
      <Text style={styles.sectionTitle}>עדכונים מהעירייה:</Text>
      <FlatList
        data={updates}
        renderItem={renderUpdate}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
  },
  actionText: {
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  updateCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  updateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomePage;
