import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DatabaseCRUD from '../components/DatabaseCRUD';
import * as DatabaseCalc from '../components/DatabaseCalc';

const Home = () => {
    const [details, setDetails] = useState<DatabaseCalc.Details[] | undefined>([]);
    const [threshold, setThreshold] = useState(0.8);
    const [tempthreshold, setTemp] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const FetchData = async () => {
            try {
                const db = await DatabaseCRUD.openDatabase();
                if (db) {
                    const res = await DatabaseCalc.getMainPageDetails(db);
                    setDetails(res);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            FetchData();
        });

        return unsubscribe;
    }, [navigation]);

    // Function to calculate number of days that can be skipped or must be attended
    const calculateDiff = (item: DatabaseCalc.Details) => {
        if (item.attendance < threshold * 100) {
            let diff = Math.round(((threshold * item.total_classes) - item.present_classes) / (1 - threshold));
            return (
                <Text>You must attend {diff} class{diff === 1 ? '' : 'es'}</Text>
            );
        } else {
            let diff = Math.floor((item.present_classes / threshold) - item.total_classes);
            return (
                <Text>You can skip {diff} class{diff === 1 ? '' : 'es'}</Text>
            );
        }
    };

    // Function to replace threshold value
    const changeThreshold = () => {
      if(tempthreshold == '') {
        Alert.alert("Error", "Threshold is empty!");
      } else if(parseFloat(tempthreshold) > 1) {
        Alert.alert("Error", "Threshold must have value between 0 and 1");
      } else {
        setThreshold(parseFloat(tempthreshold));
      }
    }

    return (
        <View style={styles.pageStyle}>
            {/* Threshold changer */}
            <View style={styles.thresholdContainer}>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={setTemp}
                    value={tempthreshold}
                    inputMode='decimal'
                    keyboardType="decimal-pad"
                    placeholder="Threshold"
                />
                <Button title="Change Threshold" onPress={changeThreshold} />
            </View>

            {/* Column headers */}
            <View style={styles.headerContainer}>
                <View style={styles.columnHeader}>
                    <Text style={styles.headerText}>Course Code</Text>
                </View>
                <View style={styles.columnHeader}>
                    <Text style={styles.headerText}>Course Data</Text>
                </View>
            </View>
            <View style={styles.headerDivider} />

            {/* Course data */}
            <FlatList
                data={details}
                keyExtractor={(item) => item.course_code}
                renderItem={({ item }) => (
                    <View style={styles.rowContainer}>
                        {/* Course Code */}
                        <View style={styles.columnContent}>
                            <Text>{item.course_code}</Text>
                        </View>
                        {/* Course Details */}
                        <View style={styles.columnContent}>
                            <Text>Total: {item.total_classes}</Text>
                            <Text>Present: {item.present_classes}</Text>
                            <Text>Absent: {item.absent_classes}</Text>
                            <Text>Attendance: {item.attendance}%</Text>
                            {calculateDiff(item)}
                        </View>
                        <View style={styles.rowDivider} />
                    </View>
                )}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    thresholdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    inputStyle: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        flex: 1,
        marginRight: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    columnHeader: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Roboto',
    },
    headerDivider: {
        height: 2,
        backgroundColor: '#333',
    },
    rowContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#ffffff',
    },
    columnContent: {
        flex: 1,
        paddingHorizontal: 5,
    },
    rowDivider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 5,
    },
});
