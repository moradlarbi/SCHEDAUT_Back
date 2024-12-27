import db from './db.js';
const createClassRoomTable = `
CREATE TABLE IF NOT EXISTS classRoom (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity int DEFAULT 0
)
`;
const createClassTable = `
CREATE TABLE IF NOT EXISTS class (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nb_stud int DEFAULT 0
)
`;
const createCourseTable = `
CREATE TABLE IF NOT EXISTS course (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nb_hour int DEFAULT 0
)
`;
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(100) DEFAULT 'student',
  email VARCHAR(40) NOT NULL,
  password VARCHAR(40) NOT NULL
)
`;
const createTeacherCourseTable = `
CREATE TABLE IF NOT EXISTS teacherCourse (
  idTeacher INT NOT NULL,
  idCourse INT NOT NULL,
  PRIMARY KEY (idTeacher, idCourse),
  FOREIGN KEY (idTeacher) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (idCourse) REFERENCES course(id) ON DELETE CASCADE
)
`;
const createEventTable = `
CREATE TABLE IF NOT EXISTS event (
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  idTeacher INT NOT NULL,
  idCourse INT NOT NULL,
  PRIMARY KEY (startTime, endTime),
  FOREIGN KEY (idTeacher, idCourse) 
    REFERENCES teacherCourse(idTeacher, idCourse) 
    ON DELETE CASCADE,
  FOREIGN KEY (idTeacher) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (idCourse) REFERENCES course(id) ON DELETE CASCADE
);
`;
const createClassCourseTable = `
CREATE TABLE IF NOT EXISTS classCourse (
  idClass INT NOT NULL,
  idCourse INT NOT NULL,
  PRIMARY KEY (idClass, idCourse),
  FOREIGN KEY (idClass) REFERENCES class(id) ON DELETE CASCADE,
  FOREIGN KEY (idCourse) REFERENCES course(id) ON DELETE CASCADE
)
`;
const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
      db.query(query, (err, results, fields) => {
        if (err) {
          console.error('Error executing query:', err.stack);
          reject(err);
        } else {
          console.log('Query executed successfully:', query);
          resolve(results);
        }
      });
    });
  };
  const createTables = async () => {
    try {
      await executeQuery(createClassRoomTable);
      await executeQuery(createClassTable);
      await executeQuery(createCourseTable);
      await executeQuery(createUserTable);
      await executeQuery(createTeacherCourseTable);
      await executeQuery(createEventTable);
      await executeQuery(createClassCourseTable);
  
    } catch (err) {
      console.error('Error in tables:', err);
    } finally {
      // Close the database connection
      db.end();
    }
  };
  createTables();