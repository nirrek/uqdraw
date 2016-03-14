const database = require('../database/database.js');

// Name of the lectures table in the database.
const tableName = 'responses';

const getResponse = (id) => {
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

const getResponsesByPresentation = (presentation, questionId) => {
  const db = database.getDatabaseRef();

  const filter = questionId ? `AND question= $questionId` : ``;

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM ${tableName}
      WHERE presentation = $presentationId
      ${filter}
    `, {
      $presentationId: presentation.id,
      $questionId: questionId,
    }, (err, rows) => {
      console.log('getResponsesByPresentation', rows);
      if (err) return reject(err);
      resolve(rows);
    });
  })
}

const getQuestionRespondingTo = (response) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM questions
      WHERE id = $id
    `, {
      $id: response.inResponseTo
    }, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  })
};

const getPresentation = (response) => {
  console.log(response);
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM presentations
      WHERE id = $id
    `, {
      $id: response.presentation
    }, (err, row) => {
      if (err) return reject(err);
      row.responses = []; // to satisfy interface
      console.log(row);
      resolve(row);
    });
  })
};

const addResponse = (id, question, presentation, response) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO ${tableName}
      VALUES ($id, $question, $presentation, $response)
    `, {
      $id: id,
      $question: question,
      $presentation: presentation,
      $response: response,
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
  getResponse,
  getResponsesByPresentation,
  getQuestionRespondingTo,
  getPresentation,
  addResponse,
};
