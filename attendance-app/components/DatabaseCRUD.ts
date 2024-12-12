import * as SQLite from 'expo-sqlite';

// interface for courses
interface Course {
  course_code: string,
  course_name: string,
};

// interface for timestamps
interface TimeStamp {
  timestamp_id: number,
  period: number,
  day: string,
  present: number,
  course_code: string
}

// queries to get data from database
const createTablesQuery = `
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS courses (
        course_code varchar(8) PRIMARY KEY,
        course_name varchar(40)
      );
      CREATE TABLE IF NOT EXISTS timestamps (
        timestamp_id INTEGER PRIMARY KEY,
        period INTEGER,
        day TEXT,
        present INTEGER,
        course_code varchar(8),
        FOREIGN KEY(course_code) REFERENCES courses(course_code)
      );`;

const insertCourseDataQuery = 'INSERT OR IGNORE INTO courses (course_code, course_name) VALUES (?, ?)';

const updateCourseDataQuery = 'UPDATE courses SET course_code = ?, course_name = ? WHERE course_code = ?';

const updateCourseCodeInTimestampsQuery = 'UPDATE timestamps SET course_code = ? WHERE course_code = ?';

const getAllCoursesQuery = 'SELECT * FROM courses';

const getAllTimestampsQuery = 'SELECT * FROM timestamps where course_code = ?';

const deleteCourseQuery = 'DELETE FROM courses WHERE course_code = ?';

const deleteTimestampDataByCourseQuery = 'DELETE FROM timestamps WHERE course_code = ?';

const clearTableQuery = (tableName: string) => `DELETE FROM ${tableName}`;

const dropTableQuery = (tableName: string) => `DROP TABLE IF EXISTS ${tableName}`;

const modifyTimestampDataQuery = 'UPDATE timestamps SET period = ?, day = ?, present = ?, course_code = ? WHERE timestamp_id = ?';

const deleteTimestampDataQuery = 'DELETE FROM timestamps WHERE timestamp_id = ?';

const getTimestampbyIdQuery = 'SELECT * FROM timestamps WHERE timestamp_id = ?';

const getSelectiveTimestampsQuery = 'SELECT * FROM timestamps WHERE course_code = ? AND present = ?';


// Function to open a database connection
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase | undefined> => {
  try {
    const db = await SQLite.openDatabaseAsync('attendance.db');
    console.log("Database connected!");
    return db;
  } catch (error) {
    console.error("Failed to open database:", error);
    return undefined;
  }
};

// Function to create the tables in the database
export const createTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    await db.execAsync(createTablesQuery);
    console.log("Tables created (if not exists)!");
  } catch (error) {
    console.error("Failed to create tables:", error);
  }
};

// Function to insert data into the courses tables
export const insertCourseData = async (db: SQLite.SQLiteDatabase, course_code: string, course_name: string): Promise<void> => {
  try {
    await db.runAsync(insertCourseDataQuery,course_code, course_name);

    // console.log(res);
  } catch (error) {
    console.error("Failed to insert data:", error);
  }
};

// Function to modify timestamp data
export const updateTimestampData = async (db : SQLite.SQLiteDatabase, data: TimeStamp) => {
  try {
    if(db) {
      const res = await db.runAsync(modifyTimestampDataQuery, data.period, data.day, data.present, data.course_code, data.timestamp_id);
      console.log("Updated timestamp data");
      // console.log("res", res);
    } 
  } catch (err) {
    console.error("Error running updateTimestampData", err);
  }
}

// Function to modify course data
export const updateCourseData = async(db: SQLite.SQLiteDatabase, course_code: string, course_name: string, old_course_code: string) => {
  try {
    if(db) {
      console.log("check", course_code, course_name, old_course_code);
      const res = await db.runAsync(updateCourseDataQuery, course_code, course_name, old_course_code);
      const res2 = await db.runAsync(updateCourseCodeInTimestampsQuery, course_code, old_course_code);
      console.log("Update course code", res);
      console.log("Updated timestamp course code", res2);
    }
  } catch(err) {
    console.error("Error updating course code");
  }
}

// Function to delete timestamp data
export const deleteTimestampData = async (db : SQLite.SQLiteDatabase, id: number) => {
  try {
    const res = await db.runAsync(deleteTimestampDataQuery, id);
    console.log("Deleted timestamp",res);
  } catch(err) {
    console.log("deleteTimestampData", err);
  }
}

// Function to delete course data
export const deleteCourse = async (db: SQLite.SQLiteDatabase, course_code: string) => {
  try {
    if(db) {
      const res = await db.runAsync(deleteCourseQuery, course_code);
      const res2 = await db.runAsync(deleteTimestampDataByCourseQuery, course_code);
      console.log("Deleted course", res);
      console.log("Delete related timestamp data", res2);
    }
  } catch(err) {
    console.error("Error deleting course code");
  }
} 

// Function to insert data into timestamps table
export const insertTimestampData = async (db: SQLite.SQLiteDatabase, period: number, day: string, present: number, course_code: string): Promise<void> => {
  try {
    const res = await db.runAsync(
      'INSERT OR IGNORE INTO timestamps (period, day, present, course_code) VALUES (?, ?, ?, ?)', 
      period, day, present, course_code);

    // console.log(res);
  } catch(err) {
    console.error("Failed to insert data:", err);
  }
}

// Function to fetch all courses
export const getAllCourses = async (db: SQLite.SQLiteDatabase): Promise<any[]> => {
  try {
    const result = await db.getAllAsync(getAllCoursesQuery);
    return result;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
};

// Function to fetch all timestamps by course
export const getAllTimestamps = async (db: SQLite.SQLiteDatabase, course_code: string): Promise<any[]> => {
  try {
    const result = await db.getAllAsync(getAllTimestampsQuery, course_code);
    return result;
  } catch (error) {
    console.error("Failed to fetch timestamps:", error);
    return [];
  }
};

// Function to selectively fetch timestamps
export const getSelectiveTimestamps = async (db: SQLite.SQLiteDatabase, course_code: string, present: number): Promise<any[]> => {
  try {
    const res = await db.getAllAsync(getSelectiveTimestampsQuery, course_code, present);
    return res;
  } catch(err) {
    console.error("Failed to get selective timestamps:", err);
    return [];
  }
}

// Function to delete all rows in a table
export const clearTable = async (db: SQLite.SQLiteDatabase, tableName: string): Promise<any[]> => {
  try {
    const res = await db.getAllAsync(clearTableQuery(tableName));
    return res;
  } catch(err) {
    console.error("Failed to delete table:", err);
    return [];
  }
}

// Function to drop tables
export const dropTable = async (db: SQLite.SQLiteDatabase, tableName: string): Promise<any[]> => {
  try {
    const res = await db.getAllAsync(dropTableQuery(tableName));
    return res;
  } catch(err) {
    console.error("Failed to drop table:", err);
    return [];
  }
}

export {Course, TimeStamp}