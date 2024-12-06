import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as DatabaseCRUD from '../components/DatabaseCRUD';
import * as DatabaseCalc from '../components/DatabaseCalc';

const Index = () => {
  const [details, setDetails] = useState<DatabaseCalc.Details[]|undefined>([]);

  // threshold value below which attendance percentage should not dip
  const threshold = 0.8;

  useEffect(() => {
    const FetchData = async () => {
      try {
        const db = await DatabaseCRUD.openDatabase();

        if (db) {
          await DatabaseCRUD.createTables(db);

          await DatabaseCRUD.clearTable(db, 'courses');
          await DatabaseCRUD.clearTable(db, 'timestamps');

          await DatabaseCRUD.insertCourseData(db, '19cse301', 'Computer Networks', 5);
          await DatabaseCRUD.insertCourseData(db, '19cse302', 'DAA', 3);
          await DatabaseCRUD.insertCourseData(db, '19cse303', 'Embedded', 10);

          await DatabaseCRUD.insertTimestampData(db, 1, 3, 'temp day', '19cse301');
          await DatabaseCRUD.insertTimestampData(db, 2, 3, 'temp day 2', '19cse301');
          await DatabaseCRUD.insertTimestampData(db, 3, 4, 'temp day 2', '19cse302');
          await DatabaseCRUD.insertTimestampData(db, 4, 2, 'temp day 3', '19cse303');

          const res = await DatabaseCalc.getMainPageDetails(db)
          setDetails(res);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    FetchData();
  }, []);

  // Function to calculate how many days can be skipped or must be attended
  const calculateDiff = (item: DatabaseCalc.Details) => {
    if(item.attendance < (threshold*100)) {
      let diff = Math.round(((threshold * item.total_classes) - item.attended_classes) / (1 - threshold));

      // if the difference is 1, pass appropriate message
      if(diff == 1) {
        return <Text>You must attend {diff} class</Text>
      } else {
        return <Text>You must attend {diff} classes</Text>
      }
      
    } else {
      let diff = Math.floor((item.attended_classes/threshold) - item.total_classes);

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
                <Text>AD: {item.attended_classes}</Text>
                <Text>MD: { item.missed_classes}</Text>
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
export default Index;

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
