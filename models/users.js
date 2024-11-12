import db from '../db.js';

export const findAll = (query, callback) => {
  db.query(query, callback);
};

export const findById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], callback);
};

export const create = (userData, callback) => {
    const { first_name, last_name, role = 'student', email, password } = userData;
    const query = `
      INSERT INTO users (first_name, last_name, role, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [first_name, last_name, role, email, password], callback);
  };
  

  export const update = (id, userData, callback) => {
    const { first_name, last_name, role, email, password } = userData;
    const query = `
      UPDATE users 
      SET first_name = ?, last_name = ?, role = ?, email = ?, password = ?
      WHERE id = ?
    `;
    db.query(query, [first_name, last_name, role, email, password, id], callback);
  };
  
export const deleteUser = (id, callback) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], callback);
};