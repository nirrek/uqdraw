let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import LectureConstants from '../constants/LectureConstants.js';
let ActionTypes = LectureConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _lectures = {};

let LectureStore = Object.assign({}, EventEmitter.prototype, {
    get: function(courseId, lectureId) {
        if (!_lectures[courseId]) return;
        return _lectures[courseId][lectureId];
    },
    getAll: function(courseId) {
        return _lectures[courseId];
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
        default:
            //noop
    }
};

LectureStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default LectureStore;
