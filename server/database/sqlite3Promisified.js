import sqlite3 from 'sqlite3';

export function openDatabase(filename, mode) {
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(filename, mode, err => {
        if (err) return reject(err);
        resolve(createWrappedDatabase(db))
      });
    }
  );
}

export function createWrappedDatabase(db) {
  // run :: (String, Object) -> Promise
  const run = (sql, params) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) return reject(err);
        resolve(null);
      });
    });

  // get :: (String, Object) -> Promise<Object>
  const get = (sql, params) =>
    new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

  // all :: (String, Object) -> Promise<Array<Object>
  const all = (sql, params) =>
    new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

  // exec :: (String) -> Promise
  const exec = (sql) =>
    new Promise((resolve, reject) => {
      db.exec(sql, err => {
        if (err) reject(err);
        resolve(null);
      });
    });

  return Object.freeze({
    run,
    get,
    all,
    exec,
  });
}
