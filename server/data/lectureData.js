const database = require('../database/database.js');

// Name of the lectures table in the database.
const tableName = 'lectures';

const getLecture = (id) => {
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

const getLecturesByCourse = (course) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM ${tableName}
      WHERE courseOwner = $courseOwner
    `, {
      $courseOwner: course.id
    }, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  })
}

const getOwner = (lecture) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM courses
      WHERE id = $id
    `, {
      $id: lecture.courseOwner
    }, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  })
}

const addLecture = (id, name, courseOwner) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO ${tableName}
      VALUES ($id, $name, $courseOwner)
    `, {
      $id: id,
      $name: name,
      $courseOwner: courseOwner,
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

// deleteLecture :: String -> Promise<lectureType>
const deleteLecture = (id) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.run(`
      DELETE FROM ${tableName}
      WHERE id = $id
    `, {
      $id: id
    }, err => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

module.exports = {
  getLecture,
  getLecturesByCourse,
  getOwner,
  addLecture,
  deleteLecture,
};
