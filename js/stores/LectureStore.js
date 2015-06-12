let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import LectureConstants from '../constants/LectureConstants.js';
let ActionTypes = LectureConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _lectures = {};

let LectureStore = Object.assign({}, EventEmitter.prototype, {
    get: function(courseId, lectureId) {
        if (!courseId || !lectureId) throw new Error('LectureStore.get requires a courseId and a lectureId');
        if (!_lectures[courseId]) return;
        return _lectures[courseId][lectureId];
    },
    getAll: function(courseId) {
        if (!courseId) throw new Error('LectureStore.getAll requires a courseId');
        return _lectures[courseId] || {};
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
});

let dispatcherCallback = function(action) {
    switch(action.type) {
        case ActionTypes.LECTURE_CREATE:
            if (action.lecture) {
                if (!_lectures[action.courseKey]) _lectures[action.courseKey] = {};
                _lectures[action.courseKey][action.lectureKey] = action.lecture;
                LectureStore.emitChange();
            }
            break;

        case ActionTypes.LECTURES_UPDATE:
            if (action.lectures) {
                if (!_lectures[action.courseKey]) {
                    _lectures[action.courseKey] = action.lectures;
                } else {
                    Object.assign(_lectures[action.courseKey], action.lectures);
                }
                LectureStore.emitChange();
            }
            break;

        case ActionTypes.LECTURE_DELETE:
            if (action.lectureKey) {
                if (!_lectures[action.courseKey]) _lectures[action.courseKey] = {};
                if (_lectures[action.courseKey][action.lectureKey]) {
                    delete _lectures[action.courseKey][action.lectureKey];
                }
                LectureStore.emitChange();
            }
            break;

        case ActionTypes.QUESTION_CREATE_SUCCESS:
            if (action.questionKey) {
                if (!_lectures[action.courseKey]) _lectures[action.courseKey] = {};
                if (_lectures[action.courseKey][action.lectureKey]) {
                    let lecture = _lectures[action.courseKey][action.lectureKey];
                    if (!lecture.questions) lecture.questions = {};
                    if (!lecture.questionOrder) lecture.questionOrder = [];
                    lecture.questions[action.questionKey] = action.question;
                    lecture.questionOrder.push(action.questionKey);
                }
            }
            LectureStore.emitChange();
            break;

        case ActionTypes.QUESTION_UPDATE_SUCCESS:
            if (action.questionKey) {
                if (!_lectures[action.courseKey]) _lectures[action.courseKey] = {};
                if (_lectures[action.courseKey][action.lectureKey]) {
                    let lecture = _lectures[action.courseKey][action.lectureKey];
                    Object.assign(lecture.questions[action.questionKey], action.question);
                }
            }
            LectureStore.emitChange();
            break;

        case ActionTypes.QUESTION_DELETE_SUCCESS:
            if (action.courseKey && action.questionKey) {
                if (!_lectures[action.courseKey]) break;
                if (_lectures[action.courseKey][action.lectureKey]) {
                    let lecture = _lectures[action.courseKey][action.lectureKey];

                    // Remove question from questionOrder
                    let index = lecture.questionOrder.findIndex(x => x === action.questionKey);
                    if (index) {
                        lecture.questionOrder.splice(index, 1);
                    }

                    // Remove actual question object
                    if (lecture.questions[action.questionKey]) {
                        delete lecture.questions[action.questionKey];
                    }
                }
            }
            LectureStore.emitChange();
            break;

        default:
            //noop
    }
};

LectureStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default LectureStore;
