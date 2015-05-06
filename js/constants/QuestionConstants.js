let keyMirror = require('keymirror');

export default {
    ActionTypes: keyMirror({
        QUESTIONS_LISTEN: null,
        QUESTIONS_UPDATE: null,
        QUESTION_CREATE: null,
        QUESTION_DELETE: null,
    }),
};