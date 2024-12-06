/* File deals with getting data such as total days for a certain course, 
    missed days, number of periods and other calculations involving outputing
    derived data
*/

import * as SQLite from 'expo-sqlite';
import { Course, TimeStamp } from './DatabaseCRUD';
import { deleteAsync } from 'expo-file-system';

/* Interfaces for typescript */
interface getMissedDaysResult {
    'course_code': string,
    'COUNT(timestamp_id)': number
}

interface Details {
    'course_code': string,
    'total_classes': number,
    'missed_classes': number,
    'attended_classes': number,
    'attendance': number
} 

/* Queries */
const getTotalDaysQuery = `SELECT * FROM courses`;

const getMissedDaysQuery = `SELECT course_code, COUNT(timestamp_id) FROM timestamps 
GROUP BY course_code`;

const getCoursesQuery = `SELECT course_id FROM courses`;


// function to get total number of day for a particular course
const getTotalDays = async(db: SQLite.SQLiteDatabase) => {

    try {
        const res:Course[]|unknown[] = await db.getAllAsync(getTotalDaysQuery);

        if(res !== null) {
            return res;
        } else {
            return [];
        }
    } catch(err) {
        console.error("Error getting total days:", err);
        return [];
    }
}

// function to get count of missed days grouped by courses
const getMissedDays = async(db: SQLite.SQLiteDatabase) => {
    try {
        const res:getMissedDaysResult[]|unknown[] = await db.getAllAsync(getMissedDaysQuery);

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
        const total:Course[] = await getTotalDays(db);
        const missed:getMissedDaysResult[] = await getMissedDays(db);

        // console.log("total", total);
        // console.log("Missed", missed);

        // array to be returned
        let details:Details[] = [];

        // iterate through total array first
        total.forEach(({course_code, course_name, total_days})  => {
            details.push({"course_code": course_code, 
                "total_classes": total_days,
                "missed_classes": 0,
                "attended_classes": total_days,
                "attendance": 0,
            })
        });

        // iterate through missed array filling in all details in details array 
        missed.forEach((item) => {
            const detailItem = details.find(detail => detail.course_code === item.course_code);
            if(detailItem) {
                detailItem.missed_classes = item['COUNT(timestamp_id)'];
            }
        });

        // calculate the attendance percentage and fill in the details array
        details.forEach((item) => {
            item.attended_classes = (item.total_classes - item.missed_classes);
            item.attendance = Number(((item.attended_classes / item.total_classes) * 100).toFixed(2));
        })

        return details;
    } catch(err) {
        console.error("Error getting attendance percentage");
    }
}


export {
    getTotalDays,
    getMissedDays,
    getMainPageDetails,
    Details
}