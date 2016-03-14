var sqlite3 = require('sqlite3');
const uuid = require('node-uuid');
const log = console.log.bind(console);

// The sqlite3 database reference used to issue queries.
var db;

function initialize(filename) {
  db = new sqlite3.Database(filename, err => {
    if (err)
      return console.error(err);

    createTables();
    insertFakeData();

    // Enforce FK constraints. Strangely, SQLite does not
    // enforce these by default and must be enabled on a
    // per-connection basis.
    // See: https://www.sqlite.org/foreignkeys.html
    db.get(`PRAGMA foreign_keys = ON`);
  });
}

// Ensures that whenever the process starts up, that all the required tables
// for the application are present.
function createTables() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id CHARACTER(36) PRIMARY KEY,
      username TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      id CHARACTER(36) PRIMARY KEY,
      name TEXT,
      userOwner CHARACTER(36),
      FOREIGN KEY (userOwner) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS lectures (
      id CHARACTER(36) PRIMARY KEY,
      name TEXT,
      courseOwner CHARACTER(36),
      FOREIGN KEY (courseOwner) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS questions (
      id CHARACTER(36) PRIMARY KEY,
      text TEXT,
      lectureOwner CHARACTER(36),
      listPosition INTEGER,
      FOREIGN KEY (lectureOwner) REFERENCES lectures(id)
    );

    CREATE TABLE IF NOT EXISTS presentations (
      id CHARACTER(36) PRIMARY KEY,
      lectureName TEXT,
      startedAt INTEGER DEFAULT (strftime('%s', 'now')),
      isActive BOOLEAN DEFAULT 1,
      code CHARACTER(3),
      currentQuestion CHARACTER(36) DEFAULT NULL,
      isAcceptingResponses BOOLEAN DEFAULT 0,
      FOREIGN KEY (currentQuestion) REFERENCES presentationQuestions(id)
    );

    CREATE TABLE IF NOT EXISTS presentationQuestions (
      id INTEGER PRIMARY KEY,
      text TEXT,
      listPosition INTEGER,
      presentation CHARACTER(36),
      FOREIGN KEY (presentation) REFERENCES presentations(id)
    );

    CREATE TABLE IF NOT EXISTS responses (
      id CHARACTER(36) PRIMARY KEY,
      question CHARACTER(36),
      presentation CHARACTER(36),
      responseUri TEXT,
      FOREIGN KEY (question) REFERENCES presentationQuestions(id),
      FOREIGN KEY (presentation) REFERENCES presentations(id)
    );
  `;

  db.exec(sql, (err) => {
    if (err)
      console.error('Creation of application tables failed.', err);
  });
}

// TODO remove
function insertFakeData() {
  const sql = `
    INSERT INTO users
    VALUES ('8c0287c9-af07-45e4-a844-dd19254860b5', 'kerrin');

    INSERT INTO courses
    VALUES ('d351ef4d-c9be-4d6d-a8e2-97cdd2905f94', 'COMS3000',
      '8c0287c9-af07-45e4-a844-dd19254860b5');

    INSERT INTO lectures
    VALUES ('e56e9d1d-cfed-44d9-a587-9d4f16b14db9', 'Lecture 1',
      'd351ef4d-c9be-4d6d-a8e2-97cdd2905f94');

    INSERT INTO questions
    VALUES ('0f932749-67c7-47ad-ab80-143a0d11f1cb', 'question here',
      'e56e9d1d-cfed-44d9-a587-9d4f16b14db9', 1);

    INSERT INTO questions
    VALUES ('d21213fd-d010-498b-8274-5a6fb94d80c8', 'question here',
      'e56e9d1d-cfed-44d9-a587-9d4f16b14db9', 0);

    INSERT INTO presentations
    VALUES ('28fcbaee-71a6-4f4b-99bf-58619396a59c',
      'Lecture name',
      1456578138877,
      1,
      '3fa',
      'd21213fd-d010-498b-8274-5a6fb94d80c8',
      0
    );

    INSERT INTO responses
    VALUES ('b96a66f7-84aa-414e-a560-f3076c03f295',
      '0f932749-67c7-47ad-ab80-143a0d11f1cb',
      '28fcbaee-71a6-4f4b-99bf-58619396a59c',
      'http://response.uri'
    );
  `;

  db.exec(sql, (err) => {
    if (err)
      console.error('Creation of application tables failed.', err);
  });
}

function getDatabaseRef() {
  if (!db)
    return console.error(`No database available. Initialization failed on startup.`);

  return db;
}

module.exports = {
  initialize,
  getDatabaseRef,
};
