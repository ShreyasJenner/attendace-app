import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as DatabaseCRUD from '../components/DatabaseCRUD';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars';

const MarkAttendance = () => {
  const [coursecode, setCoursecode] = useState<DatabaseCRUD.Course[]>([]);

  // states to store selected course and check if it has been filled
  const [selectedcourse, setCourseValue] = useState('');
  const [courseFocus, setCourseFocus] = useState(false);

  // state to store selected periods and check if it has been filled
  const [selectedperiods, setSelectedPeriods] = useState([]);
  
  // state to store selected date
  const [selecteddates, setDate] = useState('');

  // const list to store slots and associated values
  const periods = [
    {label: 'Slot 1', value:'1'},
    {label: 'Slot 2', value:'2'},
    {label: 'Slot 3', value:'3'},
    {label: 'Slot 4', value:'4'},
    {label: 'Slot 5', value:'5'},
    {label: 'Slot 6', value:'6'},
    {label: 'Slot 7', value:'7'},
    {label: 'Slot 8', value:'8'},
    {label: 'Slot 9', value:'9'},
    {label: 'Slot 10', value:'10'},
    {label: 'Slot 11', value:'11'},
    {label: 'Slot 12', value:'12'},
  ];

  // useEffect that runs at start of loading of page, to get all course data
  useEffect(() => {

    // Function to get list of courses
    const FetchData = async () => {
      try {
        const db = await DatabaseCRUD.openDatabase();
        if(db) {
          const res:DatabaseCRUD.Course[] = await DatabaseCRUD.getAllCourses(db);
          
          // fill coursecode state with course_code obtained from res
          setCoursecode(res);

        } else {
          console.error("Error opening databse");
        }
      } catch(err) {
        console.error("Error fetching data");
      }
    }

    FetchData();
  }, []);

  // function to mark attendance and store data in database
  const markAttendance = async () => {

    if((selectedcourse == '') || (selectedperiods.length == 0) || (selecteddates == '')) {
      console.error("Fill all fields");
    } else {
      //TODO: push all data to database

      // set all input arrays to empty
      setCourseValue('Course Code');
      setSelectedPeriods([]);
      setDate('');
    }
  }

  // function to render selected periods in multi-selected prop
  const renderSelectedPeriods = () => {
    return selectedperiods.join(', ');
  }

  return (
    <View style={styles.containerStyle}>
      <View style={styles.inputContainerStyle}>
        {/* Dropdown for course code */}
        <Dropdown 
        style={styles.dropdownStyle}
        data={coursecode} 
        search
        labelField="course_name"
        valueField="course_code"
        value={selectedcourse}
        onChange={item => {setCourseValue(item.course_code); setCourseFocus(false)}}
        onFocus={() => setCourseFocus(true)}
        placeholder={!courseFocus? 'Course Code' : ''}
        searchPlaceholder='Search...'
        />

        {/* Dropdown for period */}
        <MultiSelect 
        style={styles.dropdownStyle}
        search
        data={periods}
        labelField='label'
        valueField='value'
        placeholder={(selectedperiods.length == 0)?'Select Periods':renderSelectedPeriods()}
        searchPlaceholder='Search...'
        value={selectedperiods}
        alwaysRenderSelectedItem={false}
        visibleSelectedItem={false}
        onChange={item => {setSelectedPeriods(item)}}
        />

      </View>

      <View style={styles.inputContainerStyle}>
        {/* Calendar for data selection */}
        <Calendar
        style={styles.calendarStyle}
        onDayPress={day => {setDate(day.dateString)}}
        markedDates={{[selecteddates]: {selected: true, disableTouchEvent: true}}}
        />
      </View>

      <View style={styles.inputContainerStyle}>
        <Button title='Mark Attendance' onPress={markAttendance}/>
      </View>
    </View>
  )
}

export default MarkAttendance;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  inputContainerStyle: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dropdownStyle: {
    flex: 1,
  },
  calendarStyle: {
    
  }
})