// hooks/useRiskComplaints.js - Hook לניהול תלונות בסיכון גבוה
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const useRiskComplaints = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // טען תלונות בסיכון גבוה
  const loadRiskComplaints = useCallback(async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('לא נמצא טוקן אימות');
      }

      const response = await fetch('http://192.168.1.3:5000/api/admin/high-risk-complaints', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setOriginalData(data.data);
        setFilteredData(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'שגיאה בטעינת תלונות בסיכון גבוה');
      }
    } catch (error) {
      console.error('Error loading high-risk complaints:', error);
      setError(error.message);
      Alert.alert('שגיאה', error.message);
      return null;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // רענן נתונים
  const refresh = useCallback(() => {
    setRefreshing(true);
    loadRiskComplaints();
  }, [loadRiskComplaints]);

  // סנן תלונות קריטיות
  const filterCritical = useCallback(() => {
    if (!originalData?.highRiskComplaints) return;
    
    const criticalComplaints = originalData.highRiskComplaints.filter(complaint => 
      complaint.aiAnalysis.urgency === 'critical' || 
      complaint.aiAnalysis.riskScore >= 0.8
    );
    
    setFilteredData({
      ...originalData,
      highRiskComplaints: criticalComplaints
    });
    setCurrentFilter('critical');
    
    return criticalComplaints.length;
  }, [originalData]);

  // סנן תלונות ישנות
  const filterOld = useCallback(() => {
    if (!originalData?.highRiskComplaints) return;
    
    const oldComplaints = originalData.highRiskComplaints.filter(complaint => 
      complaint.aiAnalysis.daysOpen > 7
    );
    
    setFilteredData({
      ...originalData,
      highRiskComplaints: oldComplaints
    });
    setCurrentFilter('old');
    
    return oldComplaints.length;
  }, [originalData]);

  // סנן תלונות עם סנטימנט שלילי
  const filterNegativeSentiment = useCallback(() => {
    if (!originalData?.highRiskComplaints) return;
    
    const negativeComplaints = originalData.highRiskComplaints.filter(complaint => 
      complaint.aiAnalysis.sentiment === 'negative' || 
      complaint.aiAnalysis.sentiment === 'urgent'
    );
    
    setFilteredData({
      ...originalData,
      highRiskComplaints: negativeComplaints
    });
    setCurrentFilter('negative');
    
    return negativeComplaints.length;
  }, [originalData]);

  // בטל סינון
  const clearFilters = useCallback(() => {
    setFilteredData(originalData);
    setCurrentFilter('all');
  }, [originalData]);

  // ייצא דוח
  const exportReport = useCallback(async (format = 'text') => {
    try {
      setExporting(true);
      const token = await AsyncStorage.getItem('token');
      const complaints = filteredData?.highRiskComplaints || [];
      
      let reportContent;
      if (format === 'csv') {
        reportContent = generateCSVReport(complaints);
      } else {
        reportContent = generateTextReport(complaints, currentFilter);
      }
      
      const response = await fetch('http://192.168.1.3:5000/api/admin/export-risk-report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportContent,
          filterType: currentFilter,
          complaintsCount: complaints.length,
          format
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        Alert.alert(
          'ייצוא הושלם', 
          'הדוח נשמר במערכת ונשלח למייל המנהל'
        );
        return result.data;
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('שגיאה', 'שגיאה בייצוא הדוח');
      return null;
    } finally {
      setExporting(false);
    }
  }, [filteredData, currentFilter]);

  // הקצה תלונה
  const assignComplaint = useCallback(async (complaintId, employeeId = 'current-user') => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`http://192.168.1.3:5000/api/complaints/${complaintId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        Alert.alert('הצלחה', 'התלונה הוקצתה בהצלחה');
        // רענן את הנתונים
        await loadRiskComplaints();
        return true;
      } else {
        throw new Error(data.message || 'שגיאה בהקצאת התלונה');
      }
    } catch (error) {
      console.error('Error assigning complaint:', error);
      Alert.alert('שגיאה', error.message);
      return false;
    }
  }, [loadRiskComplaints]);

  // עדכן סטטוס תלונה
  const updateComplaintStatus = useCallback(async (complaintId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`http://192.168.1.3:5000/api/complaints/${complaintId}/process`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        Alert.alert('הצלחה', 'סטטוס התלונה עודכן בהצלחה');
        // רענן את הנתונים
        await loadRiskComplaints();
        return true;
      } else {
        throw new Error(data.message || 'שגיאה בעדכון סטטוס התלונה');
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      Alert.alert('שגיאה', error.message);
      return false;
    }
  }, [loadRiskComplaints]);

  // פונקציות עזר לדוחות
  const generateTextReport = (complaints, filterType) => {
    const timestamp = new Date().toLocaleString('he-IL');
    const filterText = getFilterLabel(filterType);
    
    let content = `דוח תלונות בסיכון גבוה - ${filterText}\n`;
    content += `נוצר בתאריך: ${timestamp}\n`;
    content += `סה"כ תלונות: ${complaints.length}\n\n`;
    
    // סיכום מנהלים
    content += `סיכום מנהלים:\n`;
    content += `================\n`;
    
    const criticalCount = complaints.filter(c => c.aiAnalysis.urgency === 'critical').length;
    const highRiskCount = complaints.filter(c => c.aiAnalysis.riskScore >= 0.8).length;
    const oldCount = complaints.filter(c => c.aiAnalysis.daysOpen > 7).length;
    
    content += `• תלונות קריטיות: ${criticalCount}\n`;
    content += `• תלונות בסיכון גבוה (80%+): ${highRiskCount}\n`;
    content += `• תלונות פתוחות יותר מ-7 ימים: ${oldCount}\n\n`;
    
    // פירוט תלונות
    content += `פירוט תלונות:\n`;
    content += `===============\n`;
    
    complaints.forEach((complaint, index) => {
      content += `${index + 1}. ${complaint.title}\n`;
      content += `   קטגוריה: ${complaint.category}\n`;
      content += `   סטטוס: ${getStatusLabel(complaint.status)}\n`;
      content += `   דחיפות: ${getUrgencyLabel(complaint.aiAnalysis.urgency)}\n`;
      content += `   ציון סיכון: ${Math.round(complaint.aiAnalysis.riskScore * 100)}%\n`;
      content += `   ימים פתוח: ${complaint.aiAnalysis.daysOpen}\n`;
      if (complaint.aiAnalysis.riskFactors?.length) {
        content += `   גורמי סיכון: ${complaint.aiAnalysis.riskFactors.join(', ')}\n`;
      }
      content += `   תאריך יצירה: ${new Date(complaint.createdAt).toLocaleDateString('he-IL')}\n\n`;
    });
    
    // המלצות
    content += generateRecommendations(complaints);
    
    return content;
  };

  const generateCSVReport = (complaints) => {
    let csv = 'תאריך יצירה,כותרת,קטגוריה,סטטוס,דחיפות,ציון סיכון,ימים פתוח,גורמי סיכון\n';
    
    complaints.forEach(complaint => {
      const date = new Date(complaint.createdAt).toLocaleDateString('he-IL');
      const title = `"${complaint.title.replace(/"/g, '""')}"`;
      const category = complaint.category;
      const status = getStatusLabel(complaint.status);
      const urgency = getUrgencyLabel(complaint.aiAnalysis.urgency);
      const riskScore = Math.round(complaint.aiAnalysis.riskScore * 100);
      const daysOpen = complaint.aiAnalysis.daysOpen;
      const riskFactors = `"${(complaint.aiAnalysis.riskFactors || []).join(', ')}"`;
      
      csv += `${date},${title},${category},${status},${urgency},${riskScore}%,${daysOpen},${riskFactors}\n`;
    });
    
    return csv;
  };

  const generateRecommendations = (complaints) => {
    let recommendations = `המלצות:\n==========\n`;
    
    const criticalCount = complaints.filter(c => c.aiAnalysis.urgency === 'critical').length;
    const oldCount = complaints.filter(c => c.aiAnalysis.daysOpen > 7).length;
    const highRiskCount = complaints.filter(c => c.aiAnalysis.riskScore >= 0.8).length;
    
    if (criticalCount > 0) {
      recommendations += `• טפלו מיידית ב-${criticalCount} התלונות הקריטיות\n`;
    }
    
    if (oldCount > 3) {
      recommendations += `• הקצו משאבים נוספים לטיפול בתלונות ישנות\n`;
    }
    
    if (highRiskCount > complaints.length * 0.5) {
      recommendations += `• רמת הסיכון גבוהה - נדרשת תשומת לב מיוחדת\n`;
    }
    
    if (complaints.length === 0) {
      recommendations += `• מצב טוב - אין תלונות בסיכון גבוה כרגע\n`;
    }
    
    // המלצות לפי קטגוריות
    const categoryStats = {};
    complaints.forEach(c => {
      categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory && topCategory[1] > 2) {
      recommendations += `• קטגוריית "${topCategory[0]}" דורשת תשומת לב מיוחדת (${topCategory[1]} תלונות)\n`;
    }
    
    return recommendations;
  };

  // פונקציות עזר
  const getFilterLabel = (filterType) => {
    const labels = {
      all: 'כל התלונות',
      critical: 'קריטיות',
      old: 'ישנות',
      negative: 'סנטימנט שלילי'
    };
    return labels[filterType] || filterType;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'open': 'פתוח',
      'in_progress': 'בטיפול',
      'resolved': 'טופל',
      'closed': 'סגור'
    };
    return statusMap[status] || status;
  };

  const getUrgencyLabel = (urgency) => {
    const urgencyMap = {
      'critical': 'קריטי',
      'high': 'גבוה',
      'medium': 'בינוני',
      'low': 'נמוך'
    };
    return urgencyMap[urgency] || urgency;
  };

  // סטטיסטיקות
  const getStatistics = () => {
    if (!filteredData?.highRiskComplaints) return null;
    
    const complaints = filteredData.highRiskComplaints;
    
    return {
      total: complaints.length,
      critical: complaints.filter(c => c.aiAnalysis.urgency === 'critical').length,
      highRisk: complaints.filter(c => c.aiAnalysis.riskScore >= 0.8).length,
      old: complaints.filter(c => c.aiAnalysis.daysOpen > 7).length,
      avgRiskScore: complaints.length > 0 ? 
        complaints.reduce((sum, c) => sum + c.aiAnalysis.riskScore, 0) / complaints.length : 0,
      avgDaysOpen: complaints.length > 0 ? 
        complaints.reduce((sum, c) => sum + c.aiAnalysis.daysOpen, 0) / complaints.length : 0,
      byCategory: complaints.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {}),
      byUrgency: complaints.reduce((acc, c) => {
        acc[c.aiAnalysis.urgency] = (acc[c.aiAnalysis.urgency] || 0) + 1;
        return acc;
      }, {})
    };
  };

  // טען נתונים בעת עליה לראשונה
  useEffect(() => {
    loadRiskComplaints();
  }, [loadRiskComplaints]);

  return {
    // נתונים
    loading,
    refreshing,
    error,
    originalData,
    filteredData,
    currentFilter,
    exporting,
    statistics: getStatistics(),
    
    // פעולות
    refresh,
    loadRiskComplaints,
    
    // סינון
    filterCritical,
    filterOld,
    filterNegativeSentiment,
    clearFilters,
    
    // פעולות על תלונות
    assignComplaint,
    updateComplaintStatus,
    exportReport,
    
    // פונקציות עזר
    getFilterLabel,
    getStatusLabel,
    getUrgencyLabel
  };
};

export default useRiskComplaints;