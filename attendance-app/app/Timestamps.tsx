  import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Alert } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import * as DatabaseCRUD from '@/components/DatabaseCRUD';
  import { FlatList } from 'react-native-gesture-handler';
  import { Dropdown } from 'react-native-element-dropdown';
  import { useFocusEffect, useNavigation } from '@react-navigation/native';

  const Timestamps = () => {
    // states
    const [coursecode, setCoursecode] = useState<DatabaseCRUD.Course[]>([]);
    const [selectedcourse, SetCourseValue] = useState('');
    const [opt, setOpt] = useState('');
    const [timestamps, setTimestamps] = useState<DatabaseCRUD.TimeStamp[]>([]);
    
    // state to track id of row being edited
    const [editingRowId, setEditingRowId] = useState(-1);
    const [editableRowData, setEditableRowData] = useState<DatabaseCRUD.TimeStamp>({
      timestamp_id: -1,
      period: 0,
      day: "",
      present: 1,
      course_code: "",
    });
    const [isEditing, setIsEditing] = useState(false);



    // constant data
    const attendOpts = [
      { label: 'Total', value: 0 },
      { label: 'Present', value: 1 },
      { label: 'Absent', value: 2 },
    ];

    // create navigation element to re-render screen on focus
    const navigation = useNavigation();
    

    // use effect that renders timestamps on screen
    useEffect(() => {
      const FetchData = async () => {
        const db = await DatabaseCRUD.openDatabase();

        if (db) {
          const courses = await DatabaseCRUD.getAllCourses(db);
          setCoursecode(courses);
        }
      };

      // re-render screen on focus
      const unsubscribe = navigation.addListener('focus', () => {
        FetchData();
      })
      
      return unsubscribe;
    }, [navigation]);

    // function to set rows in edit mode
    const startEditing = (item: DatabaseCRUD.TimeStamp) => {
      setIsEditing(true);
      setEditingRowId(item.timestamp_id);
      setEditableRowData({...item});
    }

    // function to get timestamps
    const getTimestamps = async () => {
      const db = await DatabaseCRUD.openDatabase();

      if (db) {
        if(opt == 'Total') {
          const res = await DatabaseCRUD.getAllTimestamps(db, selectedcourse);
          setTimestamps(res);
        } else {
          const res = await DatabaseCRUD.getSelectiveTimestamps(db, selectedcourse, opt == "Present" ? 1 : 0);
          setTimestamps(res);
        }
        
      }
    };

    // function to save changes to database
    const saveChanges = async (updatedRow: DatabaseCRUD.TimeStamp) => {
      const db = await DatabaseCRUD.openDatabase();
      if (db) {
        await DatabaseCRUD.updateTimestampData(db, updatedRow); // Assuming `updateTimestamp` exists in DatabaseCRUD
        setTimestamps((prev) =>
          prev.map((item) =>
            item.timestamp_id === updatedRow.timestamp_id ? { ...item, ...updatedRow } : item
          )
        );
      }
    };
    
    // function to delete a timestamp
    const deleteTimestamp = async (id: number) => {
      const db = await DatabaseCRUD.openDatabase();
      if (db) {
        await DatabaseCRUD.deleteTimestampData(db, id);
        setTimestamps((prev) => prev.filter((item) => item.timestamp_id !== id));
      }
    };
    

    // Render each row
    const renderItem = ({ item }: { item: DatabaseCRUD.TimeStamp }) => {
      return (
        <View style={styles.rowStyle}>
          {/* Editable fields */}
          <View style={styles.itemStyle}>
            {(item.timestamp_id == editingRowId) && isEditing ? (
              <TextInput
                style={styles.textInputStyle}
                value={editableRowData.course_code}
                onChangeText={(text) =>
                  setEditableRowData((prev) => ({ ...prev, course_code: text }))
                }
              />
            ) : (
              <Text>{item.course_code}</Text>
            )}
          </View>
          <View style={styles.itemStyle}>
            {(item.timestamp_id == editingRowId) && isEditing ? (
              <TextInput
                style={styles.textInputStyle}
                value={editableRowData.day}
                onChangeText={(text) => 
                  setEditableRowData((prev) => ({...prev, day: text}))
                }
              />
            ) : (
              <Text>{item.day}</Text>
            )}
          </View>
          <View style={styles.itemStyle}>
            {(item.timestamp_id == editingRowId) && isEditing ? (
              <TextInput
                style={styles.textInputStyle}
                value={editableRowData.period.toString()}
                onChangeText={(text) =>
                  setEditableRowData({...editableRowData, period: Number(text)})
                }
                keyboardType='numeric'
              />
            ) : (
              <Text>{item.period}</Text>
            )}
          </View>
          <View style={styles.itemStyle}>
            {(item.timestamp_id == editingRowId) && isEditing ? (
              <TextInput
                style={styles.textInputStyle}
                value={editableRowData.present.toString()}
                onChangeText={(text) =>
                  setEditableRowData({...editableRowData, present: Number(text)})
                }
                keyboardType='numeric'
              />
            ) : (
              <Text>{item.present}</Text>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainerStyle}>
            {(item.timestamp_id == editingRowId) && isEditing ? (
              <TouchableOpacity
                style={styles.saveButtonStyle}
                onPress={() => {saveChanges(editableRowData); setIsEditing(false); setEditingRowId(-1);}}
              >
                <Text style={styles.buttonTextStyle}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modifyButtonStyle}
                onPress={() => startEditing(item)}
              >
                <Text style={styles.buttonTextStyle}>Modify</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButtonStyle}
              onPress={() => {
                Alert.alert("Warning!", "Are you sure you want to delete this course?",  
                  [
                      {text: "Ok", onPress: () => deleteTimestamp(item.timestamp_id)},
                      {text: "Cancel"},
                  ],
                  { cancelable: true }
              );
              }}
            >
              <Text style={styles.buttonTextStyle}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.containerStyle}>
        <View style={styles.inputContainerStyle}>
          {/* dropdown for course code */}
          <Dropdown
            style={styles.dropdownStyle}
            data={coursecode}
            search
            labelField={'course_name'}
            valueField={'course_code'}
            value={selectedcourse}
            onChange={(item) => {
              SetCourseValue(item.course_code);
            }}
            placeholder="Course Code"
            searchPlaceholder="Search ..."
          />

          {/* dropdown for options total, present, absent */}
          <Dropdown
            style={styles.dropdownStyle}
            data={attendOpts}
            labelField="label"
            valueField="value"
            value={opt}
            onChange={(item) => {
              setOpt(item.label);
            }}
            placeholder={'Select mode'}
          />
        </View>

        {/* button to get timestamps */}
        <View style={styles.inputContainerStyle}>
          <Button title="Get timestamps" onPress={getTimestamps} />
        </View>

        {/* column headers */}
        <View style={styles.rowStyle}>
          <View style={styles.itemStyle}>
            <Text style={styles.headerStyle}>Course Code</Text>
          </View>
          <View style={styles.itemStyle}>
            <Text style={styles.headerStyle}>Date</Text>
          </View>
          <View style={styles.itemStyle}>
            <Text style={styles.headerStyle}>Period</Text>
          </View>
          <View style={styles.itemStyle}>
            <Text style={styles.headerStyle}>Status</Text>
          </View>
          <View style={styles.itemStyle}>
            <Text style={styles.headerStyle}>Actions</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.horizontalDividerStyle} />

        {/* FlatList for timestamps */}
        <FlatList
          data={timestamps}
          renderItem={renderItem}
          keyExtractor={(item) => item.timestamp_id.toString()}
        />
      </View>
    );
  };

  export default Timestamps;

  const styles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
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
    pageStyle: {
      flex: 1,
      flexDirection: 'column',
    },
    headerStyle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    itemStyle: {
      flexDirection: 'column',
      width: '20%',
    },
    buttonContainerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '30%',
    },
    modifyButtonStyle: {
      backgroundColor: 'blue',
      padding: 5,
      borderRadius: 5,
    },
    deleteButtonStyle: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
    },
    buttonTextStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    horizontalDividerStyle: {
      borderBottomColor: 'black',
      borderBottomWidth: 2,
      width: '100%',
    },
    rowStyle: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 5,
    },
    textInputStyle: {
      borderWidth: 1, // Adds a border around the input field
      borderColor: 'gray', // Sets the border color
      borderRadius: 5, // Rounds the corners
      padding: 5, // Adds some internal spacing
      backgroundColor: '#f9f9f9', // Sets a light background color
      width: '90%', // Adjusts width relative to the container
      fontSize: 16, // Sets the font size
    },
    saveButtonStyle: {
      backgroundColor: 'green', // Green to indicate saving
      padding: 5,
      borderRadius: 5,
    },  
  });
