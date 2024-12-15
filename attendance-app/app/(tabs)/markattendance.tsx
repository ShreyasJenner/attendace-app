import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as DatabaseCRUD from '../../components/DatabaseCRUD';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

// Interface for day
interface DayType {
  dateString: string; // e.g., "2023-12-10"
  day: number; // Day of the month, e.g., 10
  month: number; // Month number, e.g., 12
  year: number; // Year, e.g., 2023
  timestamp: number; // Unix timestamp in milliseconds
}

// Interface for storing attendance
interface Attendance {
  course: DatabaseCRUD.Course;
  slots: number,
  present: boolean,
}

const MarkAttendance = () => {
  const [selecteddates, setDate] = useState('');
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const navigation = useNavigation();

  // Component to increment attendance for a particular course
  const incrementAttendance = (item: Attendance) => {
    setAttendance(attendance.map(el => (
      el.course.course_code === item.course.course_code ? 
      {...el , slots: el.slots + 1} : 
      el
    )))
  }

  // Component to decrement attendance for a particular course
  const decrementAttendance = (item: Attendance) => {
    setAttendance(attendance.map(el => (
      el.course === item.course ? 
      {...el, slots: Math.max(el.slots - 1, 0)} : 
      el
    )))
  }

  // Component to mark attendance
  const markAttendance = async (item: Attendance[]) => {
    try {
      if(selecteddates == '') {
        Alert.alert("Error", "Missing Date");
      } else {
        const db = await DatabaseCRUD.openDatabase();
        if(db) {
          item.forEach(async (element) => {
            if(element.slots != 0) {
              await DatabaseCRUD.insertTimestampData(db, selecteddates, 
                element.present?1:0, element.slots, element.course.course_code);
            }
          })
        }
      }      
    } catch(err) {
      console.error("Failed to open database");
    }
  }

  // Fetch data on screen focus
  useEffect(() => {
    const FetchData = async () => {
      try {
        const db = await DatabaseCRUD.openDatabase();
        if (db) {
          const res: DatabaseCRUD.Course[] = await DatabaseCRUD.getAllCourses(db);
          let temp_arr:Attendance[] = [] 

          res.forEach((item) => {
            temp_arr.push({course: item, slots: 0, present: true});
            // setAttendance([...attendance, {course: item, slots: 0, present: true}])
          });

          setAttendance(temp_arr);

        } else {
          console.error('Error opening database');
        }
      } catch (err) {
        console.error('Error fetching data');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      FetchData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.containerStyle}>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendarStyle}
          onDayPress={(day: DayType) => {
            setDate(day.dateString);
          }}
          markedDates={{
            [selecteddates]: { selected: true, disableTouchEvent: true },
          }}
        />
      </View>

      {/* Course List */}
      <View style={styles.listContainer}>
        <FlatList
          data={attendance}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.courseContainer}>
              <Text style={styles.courseCode}>{item.course.course_code}</Text>
              <View style={styles.attendanceActions}>
                <Button title="-" onPress={() => decrementAttendance(item)} />
                <Text style={styles.attendanceText}>{item.slots}</Text>
                <Button title="+" onPress={() => incrementAttendance(item)} />
              </View>
              <Button 
                title={item.present ? 'Present' : 'Absent'}
                color={item.present ? 'green' : 'red'}
                onPress={() => 
                  setAttendance((prevAttendance) => 
                    prevAttendance.map((el) => 
                      el.course === item.course ? {...el, present : !el.present} : el
                    )
                  )
                }
              />
            </View>
          )}
        />
      </View>

      {/* Mark Attendance Button */}
      <View style={styles.buttonContainer}>
        <Button title="Mark Attendance" onPress={() => {
          Alert.alert("Warning", "Mark attendance?", [
            {
              text: "Ok",
              onPress: () => markAttendance(attendance)
            },
            {
              text: "Cancel",
            }
          ])
        }} />
      </View>
    </View>
  );
};

export default MarkAttendance;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarStyle: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    flex: 1,
    marginVertical: 10,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 2,
  },
  attendanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  attendanceText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
