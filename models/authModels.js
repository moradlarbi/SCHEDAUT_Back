import db from '../db.js';

// Get the user's password by email
export const getPassword = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    console.log(query)
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error getting password:', err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
};

// Create a new user
export const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, role = 'student', email, password } = userData;
    const query = `
      INSERT INTO users (first_name, last_name, role, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [first_name, last_name, role, email, password],
      (err, results) => {
        if (err) {
          console.error('Error creating user:', err);
          return reject(err);
        }
        resolve({ id: results.insertId, ...userData });
      }
    );
  });
};


// Get a user by ID
export const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error getting user:', err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
};

// Get a user by email
export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error getting user by email:', err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
};