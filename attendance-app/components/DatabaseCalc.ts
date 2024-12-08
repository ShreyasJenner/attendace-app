/* File deals with getting data such as total days for a certain course, 
    missed days, number of periods and other calculations involving outputing
    derived data
*/

import * as SQLite from 'expo-sqlite';
import { Course, TimeStamp } from './DatabaseCRUD';

/* Interfaces for typescript */
          // await DatabaseCRUD.dropTable(db, 'time
interface getTimeStampByCourseCodeResult {
    'course_code': string,
    'COUNT(timestamp_id)': number
}

interface DaysResult {
    "COUNT(timestamps.timestamp_id)": number,
    "course_code": string
}

interface Details {
    'course_code': string,
    'total_classes': number,
    'present_classes': number,
    'absent_classes': number,
    'attendance': number
} 

/* Queries */
const getCourseQuery = `SELECT * FROM courses`;

const getTotalDaysQuery = `SELECT course_code, COUNT(timestamps.timestamp_id) FROM timestamps WHERE course_code = ?`;

const getPresentDaysQuery = `SELECT course_code, COUNT(timestamps.timestamp_id) FROM timestamps WHERE course_code = ? 
AND present = 1`;

const getAbsentDaysQuery = `SELECT course_code, COUNT(timestamps.timestamp_id) FROM timestamps WHERE course_code = ? 
AND present = 0`;

const getTimeStampByCourseCodeQuery = `SELECT course_code, COUNT(timestamp_id) FROM timestamps 
GROUP BY course_code`;

const getCourseIdsQuery = `SELECT course_id FROM courses`;


// function to get total number of day for all courses
const getCourse = async(db: SQLite.SQLiteDatabase) => {

    try {
        const res = await db.getAllAsync(getCourseQuery);

        return res;
    } catch(err) {
        console.error("Error getting course data:", err);
        return [];
    }
}


// function to get total number of day for a particular course
const getTotalDays = async(db: SQLite.SQLiteDatabase, course_code: string):Promise<DaysResult> => {

    try {
        const res:DaysResult|null = await db.getFirstAsync(getTotalDaysQuery, course_code);

        if(res != null) 
            return res;
        else
            return {"COUNT(timestamps.timestamp_id)": -1,
                "course_code": '-1'}
    } catch(err) {
        console.error("Error getting total days:", err);
        const res:DaysResult = {"COUNT(timestamps.timestamp_id)": -1,
                                "course_code": '-1'};
        return res;
    }
}

// function to get total number of present days for a particular course
const getPresentDays = async(db: SQLite.SQLiteDatabase, course_code: string):Promise<DaysResult> => {

    try {
        const res:DaysResult|null = await db.getFirstAsync(getPresentDaysQuery, course_code);

        if(res != null)
            return res;
        else 
            return {"COUNT(timestamps.timestamp_id)": -1,
                "course_code": '-1'};
    } catch(err) {
        console.error("Error getting present days:", err);
        return {"COUNT(timestamps.timestamp_id)": -1,
            "course_code": '-1'};
    }
}

// function to get total number of absent days for a particular course
const getAbsentDays = async(db: SQLite.SQLiteDatabase, course_code: string):Promise<DaysResult> => {

    try {
        const res:DaysResult|null = await db.getFirstAsync(getAbsentDaysQuery, course_code);

        if(res != null)
            return res;
        else
            return {"COUNT(timestamps.timestamp_id)": -1,
            "course_code": '-1'};
    } catch(err) {
        console.error("Error getting absent days:", err);
        return {"COUNT(timestamps.timestamp_id)": -1,
            "course_code": '-1'};
    }
}

// function to get count of missed days grouped by courses
const getTimeStampByCourseCode = async(db: SQLite.SQLiteDatabase) => {
    try {
        const res:getTimeStampByCourseCodeResult[]|unknown[] = await db.getAllAsync(getTimeStampByCourseCodeQuery);

        if(res !== null) {
            return res;
        } else {
            return [];
        }
    } catch(err) {
        console.error("Error getting count of missed days:", err);
        return [];
    }
}

// Function to get current attendance percentage
const getMainPageDetails = async(db: SQLite.SQLiteDatabase) => {
    try {
        const total:Course[]|unknown[] = await getCourse(db);

        // console.log("total", total);
        // console.log("Missed", missed);

        // array to be returned
        let details:Details[] = [];

        // iterate through total array first
        console.log(typeof total);
        total.forEach(async ({course_code, course_name})  => {
            const total:DaysResult = await getTotalDays(db, course_code);
            const present:DaysResult = await getPresentDays(db, course_code);
            const absent:DaysResult = await getAbsentDays(db, course_code);
            console.log(absent);

            details.push({
                "course_code": course_code, 
                "total_classes": total['COUNT(timestamps.timestamp_id)'],
                "absent_classes": absent['COUNT(timestamps.timestamp_id)'],
                "present_classes": present['COUNT(timestamps.timestamp_id)'],
                "attendance": 0,
            })
        });

        // calculate the attendance percentage and fill in the details array
        details.forEach((item) => {
            item.attendance = Number(((item.present_classes / item.total_classes) * 100).toFixed(2));
        })

        return details;
    } catch(err) {
        console.error("Error getting attendance percentage");
    }
}


export {
    getCourse,
    getTotalDays,
    getAbsentDays,
    getPresentDays,
    getTimeStampByCourseCode,
    getMainPageDetails,
    Details
}