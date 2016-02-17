import Dispatcher from '../dispatcher/Dispatcher.js';
import { EventEmitter } from 'events';
import SubjectActions from '../constants/SubjectConstants.js';
let actionTypes = SubjectActions.ActionTypes;

let CHANGE_EVENT = 'change';

// Map of subject name strings, keyed by Firebase key
let _subjects = {};

// Is an operation to add a subject to Firebase in progress?
let _isSubmitting = false;

let SubjectStore = Object.assign({}, EventEmitter.prototype, {
  getAll: function() {
    // This gives a pointer into the data structure. This means outside
    // people can mutate the state. How to prevent?
    return _subjects;
  },

  isSubmitting: function() {
    return _isSubmitting;
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
  switch(action.type) {
    case actionTypes.SUBJECT_CREATE_INITIATED: {
      let { subjectName } = action;
      _isSubmitting = true;
      SubjectStore.emitChange();
      break;
    }

    case actionTypes.SUBJECT_CREATE_SUCCESS: {
      let { userId, subjectName } = action;
      _isSubmitting = false;
      SubjectStore.emitChange();
      break;
    }

    case actionTypes.SUBJECT_CREATE_FAIL: {
      let { userId, subjectName, error } = action;
      _isSubmitting = false;
      SubjectStore.emitChange();
      break;
    }

    case actionTypes.SUBJECTS_UPDATE: {
      let { subjects } = action;
      _subjects = subjects;
      SubjectStore.emitChange();
      break;
    }

    default:
      // noop
  }
};

SubjectStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default SubjectStore;
