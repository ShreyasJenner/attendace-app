import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import * as DatabaseCRUD from "../../components/DatabaseCRUD";
import { useNavigation } from "@react-navigation/native";

const CourseModification = () => {
    // useStates to store original course data and modified course data
    const [courseList, setCourseList] = useState<DatabaseCRUD.Course[]>([]);
    const [newCourseCode, setNewCourseCode] = useState("");
    const [newCourseName, setNewCourseName] = useState("");
    const [editableCourses, setEditableCourses] = useState<{ [key: string]: { courseCode: string; courseName: string } }>({});

    // navigation element to re-render screen on focus
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const db = await DatabaseCRUD.openDatabase();

                if(db) {
                    const res = await DatabaseCRUD.getAllCourses(db);
                    setCourseList(res);
                    const initialEditableState = res.reduce((acc, course) => {
                        acc[course.course_code] = { courseCode: course.course_code, courseName: course.course_name };
                        return acc;
                    }, {} as { [key: string]: { courseCode: string; courseName: string } });
                    setEditableCourses(initialEditableState);
                }
            } catch(err) {
                console.error("Error getting courses", err);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            fetchCourses();
        });
          
        return unsubscribe;
    }, [navigation])

    const handleAddCourse = async () => {
        if (newCourseCode.trim() === "" || newCourseName.trim() === "") {
            Alert.alert("Error", "Course code and name cannot be empty");
            return;
        }

        try {
            const db = await DatabaseCRUD.openDatabase();
            if (db) {
                const res = await DatabaseCRUD.insertCourseData(db, newCourseCode, newCourseName);
                if(res == true) {
                    const updatedList = await DatabaseCRUD.getAllCourses(db);
                    setCourseList(updatedList);
                    setNewCourseCode("");
                    setNewCourseName("");
                } else {
                    Alert.alert("Error", "Failed to insert course data");
                }
            }
        } catch (err) {
            console.error("Error adding course", err);
        }
    };

    const handleUpdateCourse = async (oldCode: string, updatedCode: string, updatedName: string) => {
        try {
            const db = await DatabaseCRUD.openDatabase();
            if (db) {
                await DatabaseCRUD.updateCourseData(db, updatedCode, updatedName, oldCode);
                const updatedList = await DatabaseCRUD.getAllCourses(db);
                setCourseList(updatedList);
                setEditableCourses((prevState) => {
                    const updatedState = { ...prevState };
                    updatedList.forEach((course) => {
                        updatedState[course.course_code] = {
                            courseCode: course.course_code,
                            courseName: course.course_name,
                        };
                    });
                    return updatedState;
                });
            }
        } catch (err) {
            console.error("Error updating course", err);
        }
    };

    const handleDeleteCourse = async (courseCode: string) => {
        try {
            const db = await DatabaseCRUD.openDatabase();
            if (db) {
                await DatabaseCRUD.deleteCourse(db, courseCode);
                const updatedList = await DatabaseCRUD.getAllCourses(db);
                setCourseList(updatedList);
                setEditableCourses((prevState) => {
                    const updatedState = { ...prevState };
                    delete updatedState[courseCode];
                    return updatedState;
                });
            }
        } catch (err) {
            console.error("Error deleting course", err);
        }
    };

    const renderItems = ({ item }: { item: DatabaseCRUD.Course }) => {
        const editableCourse = editableCourses[item.course_code] || { courseCode: item.course_code, courseName: item.course_name };

        return (
            <View style={styles.courseItem}>
                <TextInput
                    style={styles.input}
                    value={editableCourse.courseCode}
                    onChangeText={(text) =>
                        setEditableCourses((prevState) => ({
                            ...prevState,
                            [item.course_code]: { ...editableCourse, courseCode: text },
                        }))
                    }
                />
                <TextInput
                    style={styles.input}
                    value={editableCourse.courseName}
                    onChangeText={(text) =>
                        setEditableCourses((prevState) => ({
                            ...prevState,
                            [item.course_code]: { ...editableCourse, courseName: text },
                        }))
                    }
                />
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => handleUpdateCourse(item.course_code, editableCourse.courseCode, editableCourse.courseName)}
                >
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        Alert.alert("Warning!", "Are you sure you want to delete this course?",  
                            [
                                {text: "Ok", onPress: () => handleDeleteCourse(item.course_code)},
                                {text: "Cancel"},
                            ],
                            { cancelable: true }
                        );
                    }}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Course Modification Page</Text>
            <View style={styles.addCourseContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Course Code"
                    value={newCourseCode}
                    onChangeText={setNewCourseCode}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Course Name"
                    value={newCourseName}
                    onChangeText={setNewCourseName}
                />
                <Button title="Add Course" onPress={handleAddCourse} />
            </View>
            <FlatList
                data={courseList}
                keyExtractor={(item) => item.course_code}
                renderItem={renderItems}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    addCourseContainer: {
        marginBottom: 16,
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    courseItem: {
        flex: 1,
        margin: 8,
        padding: 8,
        backgroundColor: "#e6f7ff",
        borderRadius: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    updateButton: {
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    deleteButton: {
        backgroundColor: "#ff4d4f",
        padding: 8,
        borderRadius: 4,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
});

export default CourseModification;
