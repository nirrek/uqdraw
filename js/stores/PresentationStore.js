import Dispatcher from '../dispatcher/Dispatcher.js';
import { EventEmitter } from 'events';
import { ActionTypes } from '../constants/PresentationConstants.js';

let CHANGE_EVENT = 'change';

let _responses = {};
let _isSubmitting = false;
const PresentationStore = Object.assign({}, EventEmitter.prototype, {
  getResponses(lectureKey) {
    return _responses[lectureKey];
  },

  getResponsesForQuestion(lectureKey, questionKey) {
    if (!_responses[lectureKey]) return;
    return _responses[lectureKey][questionKey];
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


const dispatchCallback = (action) => {
  switch(action.type) {
    case ActionTypes.RESPONSES_UPDATE_SUCCESS: {
      let {lectureKey, responses} = action;
      if (lectureKey && responses) {
        _responses[lectureKey] = _responses[lectureKey] || {};
        Object.assign(_responses[lectureKey], responses);
        PresentationStore.emitChange();
      }
      break;
    }
    case ActionTypes.RESPONSE_CREATE_INITIATED: {
      _isSubmitting = true;
      PresentationStore.emitChange();
      break;
    }
    case ActionTypes.RESPONSE_CREATE_SUCCESS: {
      let {lectureKey, questionKey, responseKey, response} = action;
      _isSubmitting = false;
      if (lectureKey && response) {
        _responses[lectureKey] = _responses[lectureKey] || {};
        _responses[lectureKey][questionKey] = _responses[lectureKey][questionKey] || {};
        Object.assign(_responses[lectureKey][questionKey], {[responseKey]: response});
      }
      PresentationStore.emitChange();
      break;
    }
    case ActionTypes.RESPONSE_CREATE_FAIL: {
      _isSubmitting = false;
      PresentationStore.emitChange();
      break;
    }
  }
};

console.log('About to register with', Dispatcher, Dispatcher.register);
PresentationStore.dispatchToken = Dispatcher.register(dispatchCallback);

export default PresentationStore;
