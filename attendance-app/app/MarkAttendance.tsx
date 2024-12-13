import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import * as DatabaseCRUD from '../components/DatabaseCRUD';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars';
import { DetailsContext } from '@/Context/DetailsContext';
import { useNavigation } from '@react-navigation/native';

// interface for day
interface DayType {
    dateString: string; // e.g., "2023-12-10"
    day: number;        // Day of the month, e.g., 10
    month: number;      // Month number, e.g., 12
    year: number;       // Year, e.g., 2023
    timestamp: number;  // Unix timestamp in milliseconds
}

const MarkAttendance = () => {
  // state to store list of courses
  const [coursecode, setCoursecode] = useState<DatabaseCRUD.Course[]>([]);

  // states to store selected course and check if it has been filled
  const [selectedcourse, setCourseValue] = useState('');
  const [courseFocus, setCourseFocus] = useState(false);

  // state to store selected periods and check if it has been filled
  const [selectedperiods, setSelectedPeriods] = useState<string[]>([]);
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
  
  // state to store selected date
  const [selecteddates, setDate] = useState('');

  // state to store whether present or absent
  const [present, setPresent] = useState(true);
  // const list to store 
  const present_list = [
    {label: 'Present', value: true},
    {label: 'Absent', value: false}
  ];

  // get details flag context
  const context = useContext(DetailsContext);
  if(!context) {
    throw new Error("Getting Details Context failed");
  }

  const {detailsFlag, setDetailsFlag} = context;

  const navigation = useNavigation();


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

    // activate when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      FetchData();
    })
    
    return unsubscribe;
  }, [navigation]);


  // function to mark attendance and store data in database
  const markAttendance = async () => {
    

    if((selectedcourse == '') || (selectedperiods.length == 0) || (selecteddates == '')) {
      console.error("Fill all fields");
      return;
    } else {
      const db = await DatabaseCRUD.openDatabase();
      
      if (db) {
        const promises = selectedperiods.map((item) =>
          DatabaseCRUD.insertTimestampData(db, Number(item), selecteddates, present ? 1 : 0, selectedcourse)
        );
      
        await Promise.all(promises); // Wait for all promises to resolve
      }

      // clear all input arrays
      setCourseValue('Course Code');
      setSelectedPeriods([]);
      setDate('');
      setDetailsFlag(!detailsFlag);
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
        onDayPress={(day:DayType) => {setDate(day.dateString)}}
        markedDates={{[selecteddates]: {selected: true, disableTouchEvent: true}}}
        />

        {/* Dropdown for marking present/absent */}
        <Dropdown 
        style={styles.dropdownStyle}
        data={present_list}
        labelField='label'
        valueField='value'
        onChange={item => {setPresent(item.value)}}
        placeholder={present?"Present":"Absent"}
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