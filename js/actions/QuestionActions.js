import uuid from 'node-uuid';

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------
export const QUESTION_CREATE_REQUEST = 'QUESTION_CREATE_REQUEST';
export const QUESTION_CREATE_SUCCESS = 'QUESTION_CREATE_SUCCESS';
export const QUESTION_CREATE_FAILURE = 'QUESTION_CREATE_FAILURE';

export const createQuestion = (lectureKey, question, listPosition) => ({
  type: QUESTION_CREATE_REQUEST,
  id: uuid.v4(),
  question,
  lectureKey,
  listPosition,
});

export const createQuestionSuccess = (questionKey) => ({
  type: QUESTION_CREATE_SUCCESS,
  questionKey,
});

export const createQuestionFailure = (questionKey, error) => ({
  type: QUESTION_CREATE_FAILURE,
  questionKey,
  error,
});

// -----------------------------------------------------------------------------
// Delete
// -----------------------------------------------------------------------------
export const QUESTION_DELETE_REQUEST = 'QUESTION_DELETE_REQUEST';
export const QUESTION_DELETE_SUCCESS = 'QUESTION_DELETE_SUCCESS';
export const QUESTION_DELETE_FAILURE = 'QUESTION_DELETE_FAILURE';

export const deleteQuestion = (questionKey) => ({
  type: QUESTION_DELETE_REQUEST,
  questionKey,
});

export const deleteQuestionSuccess = (questionKey) => ({
  type: QUESTION_DELETE_SUCCESS,
  questionKey,
});

export const deleteQuestionFailure = (questionKey) => ({
  type: QUESTION_DELETE_FAILURE,
  questionKey,
});


// -----------------------------------------------------------------------------
// Update
// -----------------------------------------------------------------------------
export const questionsUpdate = (courseKey, questions) => ({
  type: QUESTION_UPDATE,
  courseKey,
  questions,
});
