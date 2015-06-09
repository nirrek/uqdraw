let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import SubjectActions from '../constants/SubjectConstants.js';
let ActionTypes = SubjectActions.ActionTypes;

let CHANGE_EVENT = 'change';

// List of subject name strings
let _subjects = [];

let SubjectStore = Object.assign({}, EventEmitter.prototype, {
  getAll: function() {
    // This gives a pointer into the data structure. This means outside
    // people can mutate the state. How to prevent?
    return _subjects;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  }
});

let dispatcherCallback = function(action) {
  switch(action.type) {
    case ActionTypes.SUBJECT_CREATE:
      _subjects.push(action.subjectName);
      console.log('STORE update for _subjects: ', SubjectStore.getAll());
      SubjectStore.emitChange();
      break;
    default:
      // noop
  }
};

SubjectStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default SubjectStore;
