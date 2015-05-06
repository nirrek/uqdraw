let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
let objectAssign = require('object-assign');
import LectureConstants from '../constants/LectureConstants.js';
let ActionTypes = LectureConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _lectures = {};

let LectureStore = objectAssign({}, EventEmitter.prototype, {
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

LectureStore.dispatchToken = Dispatcher.register(dispatcherCallback);

function dispatcherCallback(action) {
    switch(action.type) {
        case ActionTypes.LECTURES_UPDATE:
            if (action.lectures) {
                if (!_lectures[action.courseKey]) {
                    _lectures[action.courseKey] = action.lectures;
                } else {
                    objectAssign(_lectures[action.courseKey], action.lectures);
                }
                LectureStore.emitChange();
            }
            break;
        default:
            //noop
    }
}

export default LectureStore;