const database = require('../database/database.js');

// Name of the users table in the database.
const tableName = 'users';

const getUser = (id) => {
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

const addUser = (id, username) => {
  const db = database.getDatabaseRef();

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO ${tableName}
      VALUES ($id, $username)
    `, {
      $id: id,
      $username: username,
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
  getUser,
  addUser,
};
