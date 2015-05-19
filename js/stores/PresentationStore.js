let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import PresentationConstants from '../constants/PresentationConstants.js';
let ActionTypes = PresentationConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _responses = {};
let PresentationStore = Object.assign({}, EventEmitter.prototype, {
    getResponses: function(lectureKey, questionKey) {
        if (!_responses[lectureKey]) return;
        return _responses[lectureKey][questionKey];
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


let dispatchCallback = function(action) {
    switch(action.type) {
        case ActionTypes.RESPONSES_UPDATE:
            if (action.lectureKey && action.responses) {
                _responses[action.lectureKey] = _responses[action.lectureKey] || {};
                Object.assign(_responses[action.lectureKey], action.responses);
                PresentationStore.emitChange();
            }
            break;
    }
};

PresentationStore.dispatchToken = Dispatcher.register(dispatchCallback);

export default PresentationStore;
