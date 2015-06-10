import config from '../config';
let Firebase = require('firebase');
import LectureActions from '../actions/LectureActions.js';
import QuestionActions from '../actions/QuestionActions.js';
import PresentationActions from '../actions/PresentationActions.js';
import SubjectActions from '../actions/SubjectActions.js';
let keyMirror = require('keymirror');

// Map of currently active Firebase refs, and who is observing said refs.
// {
//     questions: {
//         presentationId1234: {
//             ref: firebaseRefObject,
//             listeners: {
//                 123412341: 123412341
//             }
//         }
//     }
// }
let refs = {};

// APIConstants will be used to index into the map
let firebasePaths = {
    lectures: 'lectures',
    questions: 'questions',
    responses: 'responses',
    subjects: 'courseLists',
};

const APIConstants = keyMirror({
    questions: null,
    lectures: null,
    responses: null,
    subjects: null,
});

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

    subscribe: (refType, ...args) => {
        let refTypeVal = APIConstants[refType];
        let formattedRefType = refTypeVal[0].toUpperCase() + refTypeVal.slice(1).toLowerCase();
        let methodName = 'subscribeTo' + formattedRefType;
        if (API[methodName] && typeof API[methodName] === 'function') {
            API[methodName].apply(API, args);
        } else {
            console.error('There is no subscription for ' + refType);
        }
    },

    unsubscribe: (refType, ...args) => {
        let refTypeVal = APIConstants[refType];
        let formattedRefType = refTypeVal[0].toUpperCase() + refTypeVal.slice(1).toLowerCase();
        let methodName = 'unsubscribeFrom' + formattedRefType;
        if (API[methodName] && typeof API[methodName] === 'function') {
            API[methodName].apply(API, args);
        } else {
            console.error('There is no subscription for ' + refType);
        }
    },

    firebaseSubscribe: function(refType, filter, componentKey, callback) {
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

    firebaseUnsubscribe: function(refType, filter, componentKey) {
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
        this.firebaseSubscribe(APIConstants.lectures, courseKey, componentKey, function(content) {
            LectureActions.updateLectures(courseKey, content);
        });
    },

    unsubscribeFromLectures: function(componentKey, courseKey) {
        this.firebaseUnsubscribe(APIConstants.lectures, courseKey, componentKey);
    },

    addToLectures: function(courseKey, lecture) {
        return refs[APIConstants.lectures][courseKey].ref.push(lecture);
    },

    removeLecture: function(courseKey, lectureId) {
        refs[APIConstants.lectures][courseKey].ref.child(lectureId).remove();
    },

    updateLecture: function(courseKey, lectureKey, lecture) {
        refs[APIConstants.lectures][courseKey].ref.child(lectureKey).update(lecture);
    },

    subscribeToQuestions: function(componentKey, courseKey) {
        this.firebaseSubscribe(APIConstants.questions, courseKey, componentKey, function(content) {
            QuestionActions.updateQuestions(courseKey, content);
        });
    },

    unsubscribeFromQuestions: function(componentKey, courseKey) {
        this.firebaseUnsubscribe(APIConstants.questions, courseKey, componentKey);
    },

    addToQuestions: function(courseKey, question) {
        return refs[APIConstants.questions][courseKey].ref.push(question);
    },

    removeQuestion: function(courseKey, lectures, questionId) {
        refs[APIConstants.lectures][courseKey].ref.update(lectures);
        refs[APIConstants.questions][courseKey].ref.child(questionId).remove();
    },

    subscribeToResponses: function(componentKey, lectureKey) {
        this.firebaseSubscribe(APIConstants.responses, lectureKey, componentKey, function(content) {
            PresentationActions.updateResponses(lectureKey, content);
        });
    },

    unsubscribeFromResponses: function(componentKey, lectureKey) {
        this.firebaseUnsubscribe(APIConstants.responses, lectureKey, componentKey);
    },

    addToResponses: function(lectureKey, questionKey, response, callback) {
        return refs[APIConstants.responses][lectureKey].ref
                    .child(questionKey).push(response, callback);
    },

    subscribeToSubjects: function(componentKey, userId) {
        this.firebaseSubscribe(APIConstants.subjects, userId, componentKey, function(content) {
            SubjectActions.updateSubjects(content);
        });
    },

    unsubscribeFromSubjects: function(componentKey, userId) {
        this.firebaseSubscribe(APIConstants.subjects, userId, componentKey);
    },

    addToSubjects: function(userId, subjectName, callback) {
        return refs[APIConstants.subjects][userId].ref.push(subjectName, callback);
    },
};

let publicAPI = {
    subscribe: API.subscribe,
    unsubscribe: API.unsubscribe,
    addToLectures: API.addToLectures,
    removeLecture: API.removeLecture,
    updateLecture: API.updateLecture,
    addToQuestions: API.addToQuestions,
    removeQuestion: API.removeQuestion,
    addToResponses: API.addToResponses,
    addToSubjects: API.addToSubjects,
};

export default publicAPI;
export {APIConstants};
