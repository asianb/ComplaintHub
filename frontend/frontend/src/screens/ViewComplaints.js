import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { Surface, Text, Card, Title, Avatar, useTheme } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const SERVER_URL = 'http://172.19.36.139:5000';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/viewcomplaints`);
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const renderComplaint = (item) => (
    <Card style={styles.card} key={item._id}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Icon size={40} icon="alert-circle" style={[styles.icon, { backgroundColor: '#F4433620' }]} color="#F44336" />
          <View style={styles.cardHeaderText}>
            <Title style={styles.title}>{item.title}</Title>
            <Text style={styles.status}>סטטוס: {item.status}</Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>תלונות</Title>
      </Surface>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {complaints.map(renderComplaint)}
        </ScrollView>
      )}
    </View>
  );
};

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginLeft: 16,
  },
  cardHeaderText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
  },
  status: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'right',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewComplaints;
