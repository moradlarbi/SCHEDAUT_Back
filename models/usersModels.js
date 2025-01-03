import db from "../db.js";
import bcrypt from "bcryptjs";

export const getAllUsers = (req, res) => {
  const query = `
    SELECT 
      A.*, 
      B.id AS idCl, 
      B.name AS className,
      GROUP_CONCAT(C.idCourse) AS idCourses
    FROM 
      users A
    LEFT JOIN 
      class B ON A.idClass = B.id
    LEFT JOIN 
      teacherCourse C ON A.id = C.idTeacher
    GROUP BY 
      A.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }

    // Transform the results
    const users = results.map(user => ({
      ...user,
      idCourses: user.idCourses ? user.idCourses.split(",").map(Number) : [], // Convert idCourses to an array
    }));

    res.status(200).json({
      status: 200,
      message: "Users fetched successfully",
      data: users,
    });
  });
};
export const getTeachers = (req, res) => {
  const query = `SELECT 
  A.*, 
  B.id AS idCl, 
  B.name AS className,
  GROUP_CONCAT(C.idCourse) AS idCourses
FROM 
  users A
LEFT JOIN 
  class B ON A.idClass = B.id
LEFT JOIN 
  teacherCourse C ON A.id = C.idTeacher
WHERE 
  A.role = 'teacher' AND A.active = 1
GROUP BY 
  A.id;`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    const users = results.map(user => ({
      ...user,
      idCourses: user.idCourses ? user.idCourses.split(",").map(Number) : [], // Convert idCourses to an array
    }));
    res.status(200).json({ status: 200, message: "OK", data: users });
  });

}

// Create a new user
export const createUserController = (req, res) => {
  const { first_name, last_name, email, password, role, idClass, active, idCourses } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  let query;
  let values;

  // Construct query and values based on role
  if (role === "student") {
    if (!idClass) {
      return res
        .status(400)
        .json({ status: 400, message: "idClass is required for students" });
    }
    query =
      "INSERT INTO users (first_name, last_name, email, password, role, active, idClass) VALUES (?, ?, ?, ?, ?, ?, ?)";
    values = [first_name, last_name, email, password, role, active, idClass];
  }

  if (role === "teacher") {
    if (!idCourses || !Array.isArray(idCourses) || idCourses.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Courses is required for teachers" });
    }
    query =
      "INSERT INTO users (first_name, last_name, email, password, role, active) VALUES (?, ?, ?, ?, ?, ?)";
    values = [first_name, last_name, email, password, role, active];
  }

  // Execute the user insertion query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating user:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    const userId = results.insertId; // Get the newly created user's ID

    // If the user is a teacher, insert into the teacherCourse table
    if (role === "teacher") {
      const courseQueries = idCourses.map((idCourse) => {
        return new Promise((resolve, reject) => {
          const courseQuery = "INSERT INTO teacherCourse (idTeacher, idCourse) VALUES (?, ?)";
          db.query(courseQuery, [userId, idCourse], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      });

      // Execute all course insertion queries
      Promise.all(courseQueries)
        .then(() => {
          res.status(201).json({
            status: 201,
            message: "Teacher created successfully",
            data: {
              id: userId,
              first_name,
              last_name,
              email,
              role,
              idCourses,
            },
          });
        })
        .catch((err) => {
          console.error("Error assigning courses to teacher:", err);
          res.status(500).json({
            status: 500,
            message: "Internal Server Error while assigning courses",
          });
        });
    } else {
      // Respond for students
      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: {
          id: userId,
          first_name,
          last_name,
          email,
          role,
          ...(role === "student" && { idClass }), // Include idClass only if the user is a student
        },
      });
    }
  });
};


export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT users.*, 
           class.id AS idClass, 
           class.name AS className, 
           class.nb_stud AS classNb_stud
    FROM users
    LEFT JOIN class ON users.idClass = class.id
    WHERE users.id = ? AND users.active = 1
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user by ID:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const user = results[0];
    const responseData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active,
    };

    if (user.role === "student") {
      responseData.class = {
        idClass: user.idClass || null,
        className: user.className || null,
        classNb_stud: user.classNb_stud || null,
      };
    }

    res.status(200).json({
      status: 200,
      message: "OK",
      data: responseData,
    });
  });
};

export const findById = (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ? AND active = 1";
  db.query(query, [id], callback);
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, role, active, idClass, idCourses } = req.body;

  // Vérification des champs requis
  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

   const hashedPassword = await bcrypt.hash(password, 10);

  // Définir la requête de base pour mettre à jour l'utilisateur
  const query =
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, role = ?, active = ?, idClass = ? WHERE id = ?";

  db.query(
    query,
    [first_name, last_name, email, hashedPassword, role, active, idClass, id],
    (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }

      // Si l'utilisateur est un enseignant, gérer les cours
      if (role === "teacher") {
        // Supprimer les anciens cours pour cet enseignant
        const deleteCoursesQuery = "DELETE FROM teacherCourse WHERE idTeacher = ?";
        db.query(deleteCoursesQuery, [id], (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting courses:", deleteErr);
            return res
              .status(500)
              .json({ status: 500, message: "Error updating courses" });
          }

          // Insérer les nouveaux cours si `idCourses` est fourni
          if (idCourses && Array.isArray(idCourses) && idCourses.length > 0) {
            const insertCoursesQuery = "INSERT INTO teacherCourse (idTeacher, idCourse) VALUES ?";
            const courseValues = idCourses.map((courseId) => [id, courseId]);
            db.query(insertCoursesQuery, [courseValues], (insertErr) => {
              if (insertErr) {
                console.error("Error inserting courses:", insertErr);
                return res
                  .status(500)
                  .json({ status: 500, message: "Error updating courses" });
              }

              // Succès complet
              res.status(200).json({
                status: 200,
                message: "User and courses updated successfully",
              });
            });
          } else {
            // Pas de nouveaux cours à ajouter, succès de l'utilisateur uniquement
            res.status(200).json({
              status: 200,
              message: "User updated successfully (no courses provided)",
            });
          }
        });
      } else {
        // Succès pour les rôles autres que teacher
        res.status(200).json({
          status: 200,
          message: "User updated successfully",
        });
      }
    }
  );
};


export const deleteUserController = (req, res) => {
  const { id } = req.params;
  const query = "UPDATE users SET active = false WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error marking user as inactive:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: 200, message: "User marked as inactive successfully" });
  });
};
