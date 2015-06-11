let keyMirror = require('keymirror');

export default {
    ActionTypes: keyMirror({
        QUESTIONS_LISTEN: null,
        QUESTIONS_UPDATE: null,
        QUESTION_CREATE: null,
        QUESTION_CREATED: null,
        QUESTION_CREATE_FAIL: null,
        QUESTION_DELETE_INITIATED: null,
        QUESTION_DELETE_SUCCESS: null,
        QUESTION_DELETE_FAIL: null,
    }),
};
