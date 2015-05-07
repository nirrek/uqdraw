import config from '../config';
let Firebase = require('firebase');
import LectureActions from '../actions/LectureActions.js';
import QuestionActions from '../actions/QuestionActions.js';

let questionRefs = {};
let lectureRefs = {};
let refs = {};
let firebasePaths = {
    'lectures': 'lectures',
    'questions': 'questions',
};

let publicAPI = {
    subscribe: (refType, ...args) => {
        let formattedRefType = refType[0].toUpperCase() + refType.slice(1).toLowerCase();
        let methodName = 'subscribeTo'+formattedRefType;
        if (API[methodName] && typeof API[methodName] === 'function') {
            API[methodName].apply(API, args);
        } else {
            console.error('There is no subscription for ' + refType);
        }
    },

    unsubscribe: (refType, ...args) => {
        let formattedRefType = refType[0].toUpperCase() + refType.slice(1).toLowerCase();
        let methodName = 'unsubscribeFrom'+formattedRefType;
        if (API[methodName] && typeof API[methodName] === 'function') {
            API[methodName].apply(API, args);
        } else {
            console.error('There is no subscription for ' + refType);
        }
    },

    addToLectures: function(courseKey, lecture) {
        return refs['lectures'][courseKey].ref.push(lecture);
    },

    removeLecture: function(courseKey, lectureId) {
        refs['lectures'][courseKey].ref.child(lectureId).remove();
    },

    addToQuestions: function(courseKey, question) {
        return refs['questions'][courseKey].ref.push(question);
    },

    updateLecture: function(courseKey, lectureKey, lecture) {
        refs['lectures'][courseKey].ref.child(lectureKey).update(lecture);
    },

    removeQuestion: function(courseKey, lectures, questionId) {
        refs['lectures'][courseKey].ref.update(lectures);
        refs['questions'][courseKey].ref.child(questionId).remove();
    },
};

let API = {
    initialiseRefs: function(refType, filter) {
        // If refs for the refType don't exist
        if (!refs[refType]) refs[refType] = {};

        // If refs for the current filter don't exist
        if (!refs[refType][filter]) refs[refType][filter] = {};

        if (!refs[refType][filter].ref) refs[refType][filter].ref = undefined;

        if (!refs[refType][filter].listening) refs[refType][filter].listening = {};

        return refs[refType][filter];
    },
    subscribe: function(refType, filter, componentKey, callback) {
        // Get ref data for the chosen type and filter
        let current = this.initialiseRefs(refType, filter);

        // If a ref for the current course doesn't exist
        if (!current.ref) {
            current.ref = new Firebase(`${config.firebase.base}/${firebasePaths[refType]}/${filter}`);
            current.ref.on('value', (snapshot) => {
              let content = snapshot.val() || {};
              callback(content);
            });
        }

        // Set the current component as a listener
        current.listening[componentKey] = componentKey;
    },
    unsubscribe: function(refType, filter, componentKey) {
        let refData = refs[refType];
        if (refData[filter] && refData[filter].ref && refData[filter].listening) {
            if (refData[filter].listening[componentKey]) {
                // Remove component from list of listeners
                delete refData[filter].listening[componentKey];
                // If the list of listeners is now empty
                if (!Object.keys(refData[filter].listening).length) {
                    // Stop ref listening and set to null
                    refData[filter].ref.off();
                    refData[filter].ref = null;
                }
            }
        }
    },
    subscribeToLectures: function(componentKey, courseKey) {
        this.subscribe('lectures', courseKey, componentKey, function(content) {
            LectureActions.updateLectures(courseKey, content);
        });
    },

    unsubscribeFromLectures: function(componentKey, courseKey) {
        this.unsubscribe('lectures', courseKey, componentKey);
    },

    subscribeToQuestions: function(componentKey, courseKey) {
        this.subscribe('questions', courseKey, componentKey, function(content) {
            QuestionActions.updateQuestions(courseKey, content);
        });
    },

    unsubscribeFromQuestions: function(componentKey, courseKey) {
        this.unsubscribe('questions', courseKey, componentKey);
    },
};



export default publicAPI;
