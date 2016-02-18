import Dispatcher from '../dispatcher/Dispatcher.js';
import { EventEmitter } from 'events';
import { ActionTypes } from '../constants/SubjectConstants.js';

let CHANGE_EVENT = 'change';

// Map of subject name strings, keyed by Firebase key
let _subjects = {};

// Is an operation to add a subject to Firebase in progress?
let _isSubmitting = false;

const SubjectStore = Object.assign({}, EventEmitter.prototype, {
  getAll() {
    return _subjects;
  },

  isSubmitting() {
    return _isSubmitting;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

const dispatcherCallback = (action) => {
  switch(action.type) {
    case ActionTypes.SUBJECT_CREATE_INITIATED: {
      let { subjectName } = action;
      _isSubmitting = true;
      SubjectStore.emitChange();
      break;
    }

    case ActionTypes.SUBJECT_CREATE_SUCCESS: {
      let { userId, subjectName } = action;
      _isSubmitting = false;
      SubjectStore.emitChange();
      break;
    }

    case ActionTypes.SUBJECT_CREATE_FAIL: {
      let { userId, subjectName, error } = action;
      _isSubmitting = false;
      SubjectStore.emitChange();
      break;
    }

    case ActionTypes.SUBJECTS_UPDATE: {
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
