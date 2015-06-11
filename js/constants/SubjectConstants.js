let keyMirror = require('keymirror');

export default {
  ActionTypes: keyMirror({
    SUBJECT_CREATE_INITIATED: null,
    SUBJECT_CREATE_SUCCESS: null,
    SUBJECT_CREATE_FAIL: null,
    SUBJECTS_UPDATE: null,
  }),
};
