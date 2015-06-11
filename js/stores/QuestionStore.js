let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import QuestionConstants from '../constants/QuestionConstants.js';
let ActionTypes = QuestionConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _questions = {};
let _isQuestionCreating;

let QuestionStore = Object.assign({}, EventEmitter.prototype, {
    get: function(key) {
        return _questions[key];
    },

    getAll: function(courseKey) {
        return _questions[courseKey];
    },

    isQuestionCreating: function() {
        return _isQuestionCreating;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

let dispatcherCallback = function(action) {
    console.log(action);
    switch(action.type) {
        case ActionTypes.QUESTIONS_UPDATE:
            if (action.questions) {
                if (!_questions[action.courseKey]) {
                    _questions[action.courseKey] = {};
                }
                Object.assign(_questions[action.courseKey], action.questions);
                QuestionStore.emitChange();
            }
            break;

        case ActionTypes.QUESTION_CREATE:
            _isQuestionCreating = true;
            QuestionStore.emitChange();
            break;

        case ActionTypes.QUESTION_CREATED:
            _isQuestionCreating = false;
            let question = action.question.trim();
            if (question) {
                if (!_questions[action.courseKey]) _questions[action.courseKey] = {};
                _questions[action.courseKey][action.questionKey] = question;
            }
            QuestionStore.emitChange();
            break;

        case ActionTypes.QUESTION_CREATE_FAIL:
            _isQuestionCreating = false;
            QuestionStore.emitChange();
            break;

        case ActionTypes.QUESTION_DELETE_SUCCESS:
            if (action.courseKey && action.questionKey) {
                if (!_questions[action.courseKey]) break;
                if (_questions[action.courseKey][action.questionKey]) {
                    delete _questions[action.courseKey][action.questionKey];
                }
            }
            QuestionStore.emitChange();
            break;

        default:
            // no op
    }
};

QuestionStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default QuestionStore;
