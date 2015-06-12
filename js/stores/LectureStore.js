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
            let {courseKey, lectureKey, lecture} = action;
            if (lecture) {
                if (!_lectures[courseKey]) _lectures[courseKey] = {};
                _lectures[courseKey][lectureKey] = lecture;
                LectureStore.emitChange();
            }
            break;

        case ActionTypes.LECTURES_UPDATE:
            let {courseKey, lectures} = action;
            if (lectures) {
                if (!_lectures[courseKey]) {
                    _lectures[courseKey] = lectures;
                } else {
                    Object.assign(_lectures[courseKey], lectures);
                }
                LectureStore.emitChange();
            }
            break;

        case ActionTypes.LECTURE_DELETE:
            let {courseKey, lectureKey} = action;
            if (lectureKey) {
                if (!_lectures[courseKey]) _lectures[courseKey] = {};
                if (_lectures[courseKey][lectureKey]) {
                    delete _lectures[courseKey][lectureKey];
                }
                LectureStore.emitChange();
            }
            break;

        case ActionTypes.QUESTION_CREATE_SUCCESS:
            let {courseKey, lectureKey, questionKey, question} = action;
            if (questionKey) {
                if (!_lectures[courseKey]) _lectures[courseKey] = {};
                if (_lectures[courseKey][lectureKey]) {
                    let lecture = _lectures[courseKey][lectureKey];
                    if (!lecture.questions) lecture.questions = {};
                    if (!lecture.questionOrder) lecture.questionOrder = [];
                    lecture.questions[questionKey] = question;
                    lecture.questionOrder.push(questionKey);
                }
            }
            LectureStore.emitChange();
            break;

        case ActionTypes.QUESTION_UPDATE_SUCCESS:
            let {courseKey, lectureKey, questionKey, question} = action;
            if (questionKey) {
                if (!_lectures[courseKey]) _lectures[courseKey] = {};
                if (_lectures[courseKey][lectureKey]) {
                    let lecture = _lectures[courseKey][lectureKey];
                    Object.assign(lecture.questions[questionKey], question);
                }
            }
            LectureStore.emitChange();
            break;

        case ActionTypes.QUESTION_DELETE_SUCCESS:
            let {courseKey, lectureKey, questionKey} = action;
            if (courseKey && questionKey) {
                if (!_lectures[courseKey]) break;
                if (_lectures[courseKey][lectureKey]) {
                    let lecture = _lectures[courseKey][lectureKey];

                    // Remove question from questionOrder
                    let index = lecture.questionOrder.findIndex(x => x === questionKey);
                    if (index) {
                        lecture.questionOrder.splice(index, 1);
                    }

                    // Remove actual question object
                    if (lecture.questions[questionKey]) {
                        delete lecture.questions[questionKey];
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
