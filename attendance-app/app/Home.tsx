import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as DatabaseCRUD from '../components/DatabaseCRUD';
import * as DatabaseCalc from '../components/DatabaseCalc';
import { DetailsContext } from '@/Context/DetailsContext';

const Home = () => {
    const [details, setDetails] = useState<DatabaseCalc.Details[]|undefined>([]);

  // threshold value below which attendance percentage should not dip
  const threshold = 0.8;

  // get details flag context
  const context = useContext(DetailsContext);
  if(!context) {
    throw new Error("Error getting context for Details Flag");
  }

  const {detailsFlag, setDetailsFlag} = context;

  useEffect(() => {
    const FetchData = async () => {
      try {
        const db = await DatabaseCRUD.openDatabase();
        console.log("home", detailsFlag);
        if (db) {
          // await DatabaseCRUD.dropTable(db, 'courses');
          // await DatabaseCRUD.dropTable(db, 'timestamps'); 

          // await DatabaseCRUD.createTables(db);

          // await DatabaseCRUD.clearTable(db, 'courses');
          // await DatabaseCRUD.clearTable(db, 'timestamps');

          // await DatabaseCRUD.insertCourseData(db, '19cse301', 'Computer Networks');
          // await DatabaseCRUD.insertCourseData(db, '19cse302', 'DAA');
          // await DatabaseCRUD.insertCourseData(db, '19cse303', 'Embedded');

          // await DatabaseCRUD.insertTimestampData(db, 1, 2, 'day 1', 1, '19cse301');
          // await DatabaseCRUD.insertTimestampData(db, 2, 2, 'day 1', 0, '19cse301');
          // await DatabaseCRUD.insertTimestampData(db, 3, 2, 'day 1', 1, '19cse301');

          const res = await DatabaseCalc.getMainPageDetails(db)
          setDetails(res);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    FetchData();
  }, [detailsFlag]);

  // Function to calculate how many days can be skipped or must be attended
  const calculateDiff = (item: DatabaseCalc.Details) => {
    if(item.attendance < (threshold*100)) {
      let diff = Math.round(((threshold * item.total_classes) - item.present_classes) / (1 - threshold));

      // if the difference is 1, pass appropriate message
      if(diff == 1) {
        return <Text>You must attend {diff} class</Text>
      } else {
        return <Text>You must attend {diff} classes</Text>
      }
      
    } else {
      let diff = Math.floor((item.present_classes/threshold) - item.total_classes);

      // if the difference is 1, pass appropriate message
      if(diff == 1) {
        return <Text>You can skip {diff} class</Text>
      } else {
        return <Text>You can skip {diff} classes</Text>
      }
    }
  }

  return (
    
    // View to display column headers
    <View style={styles.pageStyle}>
      {/* temp display */}
      <Text>{detailsFlag?"True":"False"}</Text>

      {/* column headers */}
      <View style={styles.containerStyle}>

        {/* Column 1 view */}
        <View style={styles.item1Style}>
          <Text style={styles.headerStyle}>Course Code</Text>
        </View>

        {/* Column 2 view */}
        <View style={styles.item2Style}>
          <Text style={styles.headerStyle}>Course Data</Text>
        </View>

      </View>

      <View style={styles.headerDividerStyle}></View>

      {/* View to display course data */}
      <View style={styles.containerStyle}>
        <FlatList 
          data={details}
          keyExtractor={(item) => item.course_code}
          renderItem={({item}) => (
            <View style={styles.containerStyle}>

              {/* view for course code */}
              <View style={styles.item1Style}>
                <Text>{item.course_code}</Text>
              </View>

              {/* view for course code data */}
              <View style={styles.item2Style}>
                <Text>TD: {item.total_classes}</Text>
                <Text>AD: {item.present_classes}</Text>
                <Text>MD: { item.absent_classes}</Text>
                <Text>A%: {item.attendance}</Text>
                {calculateDiff(item)}
              </View>

              {/* horizontal divider */}
              <View style={styles.horizontalDividerStyle}></View>
            </View>
          )}
        />
      </View>


    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
    pageStyle: {
      flex: 1,
      flexDirection: 'column'
    },
    headerStyle: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    containerStyle: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },
    item1Style: {
      flexDirection: 'column',
      width: '40%',
    },
    item2Style: {
      flexDirection: 'column',
      width: '60%',
    },
    horizontalDividerStyle: {
      borderBottomColor: 'black',
      borderBottomWidth: 2,
      width: '100%'
    },
    headerDividerStyle: {
      borderBottomColor: 'black',
      borderBottomWidth: 5,
      width: '100%'
    }
})  
