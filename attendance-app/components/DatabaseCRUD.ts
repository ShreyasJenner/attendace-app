import * as SQLite from 'expo-sqlite';

// interface for courses
interface Course {
  course_code: string,
  course_name: string,
  total_days: number
};

// interface for timestamps
interface TimeStamp {
  timestamp_id: number,
  period: number,
  day: string,
  course_code: string
}

// queries to get data from database
const createTablesQuery = `
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS courses (
        course_code varchar(8) PRIMARY KEY,
        course_name varchar(40),
        total_days INTEGER
      );
      CREATE TABLE IF NOT EXISTS timestamps (
        timestamp_id INTEGER PRIMARY KEY,
        period INTEGER,
        day TEXT,
        course_code varchar(8),
        FOREIGN KEY(course_code) REFERENCES courses(course_code)
      );`;

const insertCourseDataQuery = 'INSERT OR IGNORE INTO courses (course_code, course_name, total_days) VALUES (?, ?, ?)';

const getAllCoursesQuery = 'SELECT * FROM courses';

const getAllTimestampsQuery = 'SELECT * FROM timestamps';

const clearTableQuery = (tableName: string) => `DELETE FROM ${tableName}`;


// Function to open a database connection
const openDatabase = async (): Promise<SQLite.SQLiteDatabase | undefined> => {
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
const createTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    await db.execAsync(createTablesQuery);
    console.log("Tables created (if not exists)!");
  } catch (error) {
    console.error("Failed to create tables:", error);
  }
};

// Function to insert data into the courses tables
const insertCourseData = async (db: SQLite.SQLiteDatabase, course_code: string, course_name: string, total_days: number): Promise<void> => {
  try {
    await db.runAsync(insertCourseDataQuery,course_code, course_name, total_days);

    // console.log(res);
  } catch (error) {
    console.error("Failed to insert data:", error);
  }
};

// Function to insert data into timestamps table
const insertTimestampData = async (db: SQLite.SQLiteDatabase, timestamp_id: number, period: number, day: string, course_code: string): Promise<void> => {
  try {
    const res = await db.runAsync(
      'INSERT OR IGNORE INTO timestamps (timestamp_id, period, day, course_code) VALUES (?, ?, ?, ?)', 
      timestamp_id, period, day, course_code);

    // console.log(res);
  } catch(err) {
    console.error("Failed to insert data:", err);
  }
}

// Function to fetch all courses
const getAllCourses = async (db: SQLite.SQLiteDatabase): Promise<any[]> => {
  try {
    const result = await db.getAllAsync(getAllCoursesQuery);
    return result;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
};

// Function to fetch all timestamps
const getAllTimestamps = async (db: SQLite.SQLiteDatabase): Promise<any[]> => {
  try {
    const result = await db.getAllAsync(getAllTimestampsQuery);
    return result;
  } catch (error) {
    console.error("Failed to fetch timestamps:", error);
    return [];
  }
};

// Function to delete all rows in a table
const clearTable = async (db: SQLite.SQLiteDatabase, tableName: string): Promise<any[]> => {
  try {
    const res = await db.getAllAsync(clearTableQuery(tableName));
    return res;
  } catch(err) {
    console.error("Failed to delete table:", err);
    return [];
  }
}

export {Course, TimeStamp, openDatabase, createTables, insertCourseData, 
  insertTimestampData, getAllCourses, getAllTimestamps, clearTable}