/* File deals with getting data such as total days for a certain course, 
    missed days, number of periods and other calculations involving outputing
    derived data
*/

import * as SQLite from 'expo-sqlite';
import { Course, TimeStamp, openDatabase } from './DatabaseCRUD';
import { useState } from 'react';

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
const checkTableExistsQuery = "SELECT * FROM sqlite_master WHERE type='table' AND name=?";

const getCourseQuery = `SELECT * FROM courses`;

const getTotalDaysQuery = `SELECT course_code, COUNT(timestamps.timestamp_id) FROM timestamps WHERE course_code = ?`;

const getPresentDaysQuery = `SELECT course_code, COUNT(timestamps.timestamp_id) FROM timestamps WHERE course_code = ? 
AND present = 1`;

const getAbsentDaysQuery = `SELECT course_code, COUNT(timestamps.timestamp_id) FROM timestamps WHERE course_code = ? 
AND present = 0`;

const getTimeStampByCourseCodeQuery = `SELECT course_code, COUNT(timestamp_id) FROM timestamps 
GROUP BY course_code`;

const getCourseIdsQuery = `SELECT course_id FROM courses`;

// Function to check if table exists
export const checkTableExists = async(db: SQLite.SQLiteDatabase, table_name: string): Promise<boolean> => {
    try {
        const db = await openDatabase();
        if(db) {
            const res = await db.getAllAsync(checkTableExistsQuery, table_name);
            
            return (res.length != 0)
        }
        return false;
    } catch(err) {
        console.error("Error getting sqlite_master", err);
        return false;
    }
}

// function to get total number of day for all courses
const getCourse = async(db: SQLite.SQLiteDatabase): Promise<Course[]> => {

    try {
        const exists = await checkTableExists(db, 'courses');
        if(exists == false) {
            return [];
        }
        const res:Course[] = await db.getAllAsync(getCourseQuery);

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
const getMainPageDetails = async(db: SQLite.SQLiteDatabase): Promise<Details[]|undefined> => {
    try {
        const total:Course[] = await getCourse(db);

        // console.log("total", total);
        // console.log("Missed", missed);


        // array to be returned
        const details: Details[] = await Promise.all(
            total.map(async ({ course_code }) => {
              const totalDays: DaysResult = await getTotalDays(db, course_code);
              const presentDays: DaysResult = await getPresentDays(db, course_code);
              const absentDays: DaysResult = await getAbsentDays(db, course_code);
          
              const totalClasses = totalDays['COUNT(timestamps.timestamp_id)'];
              const presentClasses = presentDays['COUNT(timestamps.timestamp_id)'];
          
              return {
                course_code,
                total_classes: totalClasses,
                absent_classes: absentDays['COUNT(timestamps.timestamp_id)'],
                present_classes: presentClasses,
                attendance: totalClasses
                  ? Number(((presentClasses / totalClasses) * 100).toFixed(2))
                  : 0, // Avoid division by zero
              };
            })
        );


        // calculate the attendance percentage and fill in the details array
        details.forEach((item) => {
            item.attendance = Number(((item.present_classes / item.total_classes) * 100).toFixed(2));
            // console.log("item attendance", item.attendance);
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