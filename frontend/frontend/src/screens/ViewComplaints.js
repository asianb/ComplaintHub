import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView

} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adminComment, setAdminComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const SERVER_URL = 'http://172.19.43.232:5000';

  const statusColors = {
    pending: '#FBC02D',
    inProgress: '#1976D2',
    resolved: '#43A047',
    rejected: '#D32F2F'
  };

  const fetchComplaints = async (pageNum = 1, refresh = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${SERVER_URL}/api/admin/complaints?page=${pageNum}&limit=10`
      );

      const { data, pagination } = response.data;
      
      if (refresh) {
        setComplaints(data);
      } else {
        setComplaints(prev => [...prev, ...data]);
      }
      
      setHasMore(pagination.currentPage < pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchComplaints(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchComplaints(page + 1);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !selectedStatus) return;

    try {
      await axios.patch(
        `${SERVER_URL}/api/admin/complaints/${selectedComplaint._id}`,
        {
          status: selectedStatus,
          adminComment
        }
      );

      // Update local state
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint._id === selectedComplaint._id
            ? { ...complaint, status: selectedStatus, adminComment }
            : complaint
        )
      );

      setModalVisible(false);
      setSelectedComplaint(null);
      setAdminComment('');
      setSelectedStatus('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedComplaint(item);
        setModalVisible(true);
        setSelectedStatus(item.status || '');
        setAdminComment(item.adminComment || '');
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status || 'pending'] }
          ]}
        >
          <Text style={styles.statusText}>
            {item.status || 'ממתין לטיפול'}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardCategory}>
          <Icon name="tag" size={16} /> {item.category}
        </Text>
        <Text style={styles.cardDate}>
          <Icon name="clock" size={16} />{' '}
          {new Date(item.createdAt).toLocaleDateString('he-IL')}
        </Text>
      </View>

      {item.images && item.images.length > 0 && (
        <ScrollView horizontal style={styles.imageScroll}>
          {item.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.data }}
              style={styles.thumbnail}
            />
          ))}
        </ScrollView>
      )}
    </TouchableOpacity>
  );

  const StatusModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>עדכון סטטוס תלונה</Text>
          
          <View style={styles.statusButtons}>
            {Object.entries(statusColors).map(([status, color]) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  { backgroundColor: color },
                  selectedStatus === status && styles.selectedStatusButton
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={styles.statusButtonText}>
                  {status === 'pending' ? 'ממתין'
                    : status === 'inProgress' ? 'בטיפול'
                    : status === 'resolved' ? 'טופל'
                    : 'נדחה'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="הערות אדמין"
            value={adminComment}
            onChangeText={setAdminComment}
            multiline
            numberOfLines={3}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleStatusUpdate}
            >
              <Text style={styles.buttonText}>שמור</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>ביטול</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ניהול תלונות</Text>
      </View>

      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="large" color="#5b21b6" />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={48} color="#666" />
              <Text style={styles.emptyText}>אין תלונות להצגה</Text>
            </View>
          ) : null
        }
      />

      <StatusModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5b21b6',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardCategory: {
    fontSize: 14,
    color: '#666',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  imageScroll: {
    marginTop: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    margin: 4,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedStatusButton: {
    opacity: 0.8,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 4,
  },
  saveButton: {
    backgroundColor: '#43A047',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ViewComplaints;