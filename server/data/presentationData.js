import { getDatabaseRef } from '../database/database.js';
import { createWrappedDatabase } from '../database/sqlite3Promisified.js';

// Name of the lectures table in the
const tableName = 'presentations';

export const getPresentation = (id) => {
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  return db.get(`
    SELECT * FROM ${tableName}
    WHERE id = $id
  `, {
    $id: id
  });
}

export const getPresentationByCode = (code) => {
  console.log('getPresentationByCode', code);
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  return db.get(`
    SELECT * FROM ${tableName}
    WHERE isActive = 1
      AND code = $code
  `, {
    $code: code
  });
}

export const getCurrentQuestion = (presentation) => {
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  return db.get(`
    SELECT * FROM presentationQuestions
    WHERE id = $id
  `, {
    $id: presentation.currentQuestion
  });
}

export const getQuestions = (presentation) => {
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  return db.all(`
    SELECT * FROM presentationQuestions
    WHERE presentation = $id
  `, {
    $id: presentation.id
  });
}

export const addPresentation = (id, lectureId) => {
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  // Note: Ideally this should be an atomic transaction,
  // I can't currently see that node-sqlite3 supports this.
  return Promise.all([
    db.get(`
      SELECT name
      FROM lectures
      WHERE id = $lectureId
    `, {
      $lectureId: lectureId,
    }),
    db.all(`
      SELECT code FROM presentations
      WHERE isActive = 1
    `)
  ])
    .then(([lecture, presentationRows]) => {
      const activeCodes = presentationRows.map(row => row.code);
      return db.run(`
        INSERT INTO ${tableName} (id, lectureName, code)
        VALUES ($id, $lectureName, $code)
      `, {
        $id: id,
        $lectureName: lecture.name,
        $code: genUnusedCode(activeCodes),
      })
    })
    .then(() =>
      db.run(`
        INSERT INTO presentationQuestions
          SELECT NULL as rowid, text, listPosition, $id as presentation
          FROM questions
          WHERE lectureOwner = $lectureId;
      `, {
        $id: id,
        $lectureId: lectureId,
      })
    )
    .then(() =>
      db.get(`
        SELECT * FROM ${tableName} WHERE id = $id
      `, {
        $id: id
      })
    );
};

// Code configuration settings.
var codeSize = 3;
var codeChars = '0123456789abcdefghijklmnopqrstuvwxyz';

// genCode :: (Int, String) -> String
function genCode(codeSize, codeChars) {
  let code = '';
  for (let i = 0; i < codeSize; i++) {
    const char = codeChars[Math.floor(Math.random() * codeChars.length)];
    code += char;
  }
  return code;
}

// [String] -> String
function genUnusedCode(existingCodes) {
  let code;
  let attemptedCodes = new Set();
  let totalPossibleCodes = Math.pow(codeChars.length, codeSize);

  while (attemptedCodes.size < totalPossibleCodes) {
    code = genCode(codeSize, codeChars);
    if (!existingCodes.includes(code))
      return code;
    attemptedCodes.add(code);
  }

  throw new Error('All possible codes are in use');
}

export const activateQuestion = (presentationId, questionId) => {
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  return db.run(`
    UPDATE presentations
    SET currentQuestion = $questionId
    WHERE id = $id
  `, {
    $questionId: questionId,
    $id: presentationId,
  });
};

export const updateResponseAcceptance = (presentationId, isAcceptingResponses) => {
  let db = getDatabaseRef();
  db = createWrappedDatabase(db);

  return db.run(`
    UPDATE presentations
    SET isAcceptingResponses = $value
    WHERE id = $id
  `, {
    $value: isAcceptingResponses ? 1 : 0,
    $id: presentationId,
  })
}
