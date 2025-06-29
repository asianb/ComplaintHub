import React, { useState,useEffect  } from "react";
import {View, Text,StyleSheet,TouchableOpacity,ScrollView,TextInput,FlatList,KeyboardAvoidingView,Platform,Modal,Dimensions} from "react-native";
const { height } = Dimensions.get('window');


  
const CalendarWithTasks = () => {
  const [currentMonth, setCurrentMonth] = useState("אפריל");
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(7);
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("12:00");
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [taskPreview, setTaskPreview] = useState("");


  const API_BASE_URL = 'http://172.19.36.84:3000/api';

  // פונקציה לטעינת משימות מהשרת
  const fetchTasks = async (day, month, year) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${day}/${month}/${year}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  // הוסף useEffect לטעינת משימות בעת טעינת הקומפוננטה או שינוי יום נבחר
  useEffect(() => {
    fetchTasks(selectedDay, currentMonth, currentYear);
  }, [selectedDay, currentMonth, currentYear]);

  const hasTasksForDay = (day) => {
    return tasks.some(task => 
      task.day === day && 
      task.month === currentMonth && 
      task.year === currentYear
    );
  };

  const timeOptions = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  const daysInMonth = 30;
  const firstDayOfWeek = 2;

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: null, key: `empty-${i}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, key: `day-${i}` });
    }
    return days;
  };
  

  // פונקציה להוספת משימה חדשה לשרת
  const addTask = async () => {
    if (newTaskText.trim() !== "") {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newTaskText,
            time: newTaskTime,
            day: selectedDay,
            month: currentMonth,
            year: currentYear,
          }),
        });
  
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setNewTaskText("");
        setTaskPreview("");
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };
  
  const handleTextChange = (text) => {
    setNewTaskText(text);
    setTaskPreview(text);
  };

  const renderCalendarDays = () => {
    const days = generateDays();
    const rows = [];
    let cells = [];
  
    days.forEach((item, index) => {
      cells.push(item);
  
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        while (cells.length < 7) {
          cells.push({ day: null, key: `empty-end-${cells.length}` });
        }
  
        rows.push([...cells]);
        cells = [];
      }
    });
  
    return rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.calendarRow}>
        {row.map((item) => {
          const hasTask = item.day && hasTasksForDay(item.day);
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.calendarCell,
                item.day === selectedDay && styles.selectedCell,
                item.day === null && styles.emptyCell,
              ]}
              onPress={() => item.day && setSelectedDay(item.day)}
              disabled={item.day === null}
            >
              <Text style={styles.cellText}>{item.day}</Text>
              {hasTask && <View style={styles.taskDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  const tasksForSelectedDay = tasks.filter((task) => task.day === selectedDay);

  // פונקציה למחיקת משימה מהשרת
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>לוח שנה עם משימות</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>‏&lt; הקודם</Text>
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {currentMonth} {currentYear}
            </Text>

            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>הבא &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekdaysHeader}>
            <Text style={styles.weekdayText}>שבת</Text>
            <Text style={styles.weekdayText}>שישי</Text>
            <Text style={styles.weekdayText}>חמישי</Text>
            <Text style={styles.weekdayText}>רביעי</Text>
            <Text style={styles.weekdayText}>שלישי</Text>
            <Text style={styles.weekdayText}>שני</Text>
            <Text style={styles.weekdayText}>ראשון</Text>
          </View>

          <View style={styles.calendarContainer}>
            {renderCalendarDays()}
          </View>

          <View style={styles.tasksSection}>
            <Text style={styles.tasksSectionTitle}>
              משימות ליום {selectedDay} ב{currentMonth}
            </Text>

            {taskPreview ? (
              <View style={styles.taskPreviewContainer}>
                <Text style={styles.taskPreviewLabel}>תצוגה מקדימה:</Text>
                <View style={styles.taskPreviewItem}>
                  <Text style={styles.taskPreviewTime}>{newTaskTime}</Text>
                  <Text style={styles.taskPreviewText}>{taskPreview}</Text>
                </View>
              </View>
            ) : null}

            {tasksForSelectedDay.length === 0 ? (
              <Text style={styles.noTasksText}>אין משימות ליום זה</Text>
            ) : (
              <FlatList
                data={tasksForSelectedDay}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <View style={styles.taskItem}>
                    <TouchableOpacity onPress={() => deleteTask(item.id)}>
                      <Text style={styles.deleteIcon}>❌</Text>
                    </TouchableOpacity>
                    <Text style={styles.taskTime}>{item.time}</Text>
                    <Text style={styles.taskText}>{item.text}</Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            )}

            <View style={styles.addTaskSection}>
              <TextInput
                style={styles.taskInput}
                value={newTaskText}
                onChangeText={handleTextChange}
                placeholder="הכנס משימה חדשה..."
                placeholderTextColor="#999"
                returnKeyType="done"
                onSubmitEditing={addTask}
              />

              <TouchableOpacity
                style={styles.timeSelector}
                onPress={() => setTimePickerVisible(true)}
              >
                <Text style={styles.timeText}>{newTaskTime}</Text>
                <Text style={styles.timeIcon}>🕒</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>+ הוסף</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent={true}
        visible={timePickerVisible}
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר שעה</Text>
            <FlatList
              data={timeOptions}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timeOption,
                    newTaskTime === item && styles.timeOptionSelected,
                  ]}
                  onPress={() => {
                    setNewTaskTime(item);
                    setTimePickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      newTaskTime === item && styles.timeOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: height * 0.6 }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTimePickerVisible(false)}
            >
              <Text style={styles.closeButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 15,
    backgroundColor: "#4361ee",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
    elevation: 2,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
  },
  navButtonText: {
    fontSize: 16,
    color: "#4361ee",
    fontWeight: "bold",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  weekdaysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#555",
  },
  calendarContainer: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  calendarCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white",
    margin: 2,
  },
  selectedCell: {
    backgroundColor: "#e6eeff",
    borderWidth: 2,
    borderColor: "#4361ee",
  },
  emptyCell: {
    backgroundColor: "#f8f9fa",
  },
  cellText: {
    fontSize: 16,
    color: "#333",
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4361ee",
    marginTop: 4,
  },
  tasksSection: {
    padding: 15,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 12,
  },
  tasksSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "right",
    color: "#333",
  },
  taskPreviewContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  taskPreviewLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4361ee",
    textAlign: "right",
  },
  taskPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  taskPreviewTime: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  taskPreviewText: {
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  noTasksText: {
    textAlign: "right",
    color: "#999",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 15,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskTime: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteIcon: {
    fontSize: 18,
    color: "#e63946",
    marginHorizontal: 10,
  },
  taskText: {
    fontSize: 16,
    textAlign: "right",
    color: "#333",
    flex: 1,
  },
  addTaskSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  timeText: {
    marginRight: 5,
    color: "#333",
  },
  timeIcon: {
    fontSize: 16,
  },
  taskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlign: "right",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#4361ee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 4,
    width: "100%",
    alignItems: "center",
  },
  timeOptionSelected: {
    backgroundColor: "#e6eeff",
  },
  timeOptionText: {
    fontSize: 16,
    color: "#333",
  },
  timeOptionTextSelected: {
    fontWeight: "bold",
    color: "#4361ee",
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4361ee",
    marginTop: 4,
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4361ee",
    marginTop: 4,
    position: 'absolute',
    bottom: 5,
  },
});

export default CalendarWithTasks;