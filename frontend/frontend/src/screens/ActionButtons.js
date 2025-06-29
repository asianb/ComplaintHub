// ActionButtons.js - רכיב פעולות מהירות לשימוש חוזר
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = ({ 
  onFilterCritical, 
  onFilterOld, 
  onExportReport, 
  onViewTrends,
  onClearFilters,
  currentFilter = 'all',
  complaintsCount = 0,
  style 
}) => {
  const actionButtons = [
    {
      id: 'critical',
      icon: 'alert-circle',
      text: 'קריטיות בלבד',
      color: '#F44336',
      onPress: onFilterCritical,
      isActive: currentFilter === 'critical'
    },
    {
      id: 'old',
      icon: 'time',
      text: 'תלונות ישנות',
      color: '#FF9800',
      onPress: onFilterOld,
      isActive: currentFilter === 'old'
    },
    {
      id: 'export',
      icon: 'download',
      text: 'ייצא דוח',
      color: '#4CAF50',
      onPress: onExportReport,
      isActive: false
    },
    {
      id: 'trends',
      icon: 'analytics',
      text: 'ניתוח מגמות',
      color: '#2196F3',
      onPress: onViewTrends,
      isActive: false
    }
  ];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>פעולות מהירות</Text>
        {complaintsCount > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{complaintsCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonsGrid}>
        {actionButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.actionButton,
              button.isActive && styles.activeButton
            ]}
            onPress={button.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${button.color}15` }]}>
              <Ionicons 
                name={button.icon} 
                size={24} 
                color={button.color} 
              />
            </View>
            <Text style={[
              styles.buttonText,
              button.isActive && styles.activeButtonText
            ]}>
              {button.text}
            </Text>
            {button.isActive && (
              <View style={[styles.activeDot, { backgroundColor: button.color }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {currentFilter !== 'all' && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={onClearFilters}
        >
          <Ionicons name="close-circle" size={16} color="#FF9800" />
          <Text style={styles.clearButtonText}>בטל סינון</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const FilterChip = ({ label, isActive, onPress, color = '#2196F3' }) => (
  <TouchableOpacity
    style={[
      styles.filterChip,
      isActive && { backgroundColor: color + '20', borderColor: color }
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.filterChipText,
      isActive && { color: color, fontWeight: 'bold' }
    ]}>
      {label}
    </Text>
    {isActive && (
      <Ionicons name="checkmark" size={16} color={color} style={styles.chipIcon} />
    )}
  </TouchableOpacity>
);

const ExportProgress = ({ visible, progress = 0, message = 'מייצא...' }) => {
  if (!visible) return null;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    position: 'relative',
  },
  activeButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    alignSelf: 'center',
  },
  clearButtonText: {
    marginLeft: 5,
    color: '#FF9800',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  chipIcon: {
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default ActionButtons;
export { FilterChip, ExportProgress };