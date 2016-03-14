const database = require('../database/database.js');

// Name of the questions table in the database.
const tableName = 'questions';

const getQuestion = (id) => {
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

const getQuestionsByLecture = (lecture) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM ${tableName}
      WHERE lectureOwner = $lectureOwner
    `, {
      $lectureOwner: lecture.id
    }, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  })
}

const getOwner = (question) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM lectures
      WHERE id = $id
    `, {
      $id: question.lectureOwner
    }, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  })
}

const addQuestion = (id, text, lectureOwner, listPosition) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO ${tableName}
      VALUES ($id, $text, $lectureOwner, $listPosition)
    `, {
      $id: id,
      $text: text,
      $lectureOwner: lectureOwner,
      $listPosition: listPosition,
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

const deleteQuestion = (id) => {
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
    })
  });
};

module.exports = {
  getQuestion,
  getQuestionsByLecture,
  getOwner,
  addQuestion,
  deleteQuestion,
};
