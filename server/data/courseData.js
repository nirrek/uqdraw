const database = require('../database/database.js');

// Name of the courses table in the database.
const tableName = 'courses';

const getCourse = (id) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM ${tableName}
      WHERE id = $id
    `, {
      $id: id
    }, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  })
}

const getCoursesByUser = (user) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM ${tableName}
      WHERE userOwner = $userId
    `, {
      $userId: user.id
    }, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  })
}

const getOwner = (course) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM users
      WHERE id = $id
    `, {
      $id: course.userOwner
    }, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  })
}

const addCourse = (id, name, userOwner) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO ${tableName}
      VALUES ($id, $name, $userOwner)
    `, {
      $id: id,
      $name: name,
      $userOwner: userOwner,
    }, function(err) {
      if (err) return reject(err);

      db.get(`
        SELECT * FROM ${tableName}
        WHERE id = $id
      `, {
        $id: id
      }, function(err, row) {
        if (err) return reject(err);
        resolve(row);
      });
    })
  });
};

module.exports = {
  getCourse,
  getCoursesByUser,
  getOwner,
  addCourse,
};
