import keyMirror from 'keymirror';

export const ActionTypes = keyMirror({
  QUESTIONS_LISTEN: null,
  QUESTION_UPDATE_SUCCESS: null,
  QUESTION_CREATE_INITIATED: null,
  QUESTION_CREATE_SUCCESS: null,
  QUESTION_CREATE_FAIL: null,
  QUESTION_DELETE_INITIATED: null,
  QUESTION_DELETE_SUCCESS: null,
  QUESTION_DELETE_FAIL: null,
});
