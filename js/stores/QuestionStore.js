let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import QuestionConstants from '../constants/QuestionConstants.js';
let ActionTypes = QuestionConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _questions = {};

function create(text) {
    console.log('creating');
}

function update(id, updates) {

}

function destroy(id) {

}

let QuestionStore = Object.assign({}, EventEmitter.prototype, {
    get: function(key) {
        return _questions[key];
    },

    getAll: function(courseKey) {
        return _questions[courseKey];
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
    let text;
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
            text = action.text.trim();
            if (text !== '') {
                create(text);
                QuestionStore.emitChange();
            }
            break;

        default:
            // no op
    }
};

QuestionStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default QuestionStore;
