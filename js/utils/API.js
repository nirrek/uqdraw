import config from '../config';
let firebaseRoot = config.firebase.base;
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

const APIConstants = keyMirror({
    questions: null,
    lectures: null,
    responses: null,
    subjects: null,
});

// APIConstants will be used to index into the map
let firebasePaths = {
    [APIConstants.lectures]: 'lectures',
    [APIConstants.questions]: 'questions',
    [APIConstants.responses]: 'responses',
    [APIConstants.subjects]: 'courseLists',
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
            current.ref = new Firebase(`${firebaseRoot}/${firebasePaths[refType]}/${filter}`);
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

    // I don't like how this inverts the order of filter and component key.
    // the order here is:       (componentKey, filter)
    // the delegate's order is: (filter, componentKey)
    subscribeToLectures: function(componentKey, courseKey) {
        this.firebaseSubscribe(APIConstants.lectures, courseKey, componentKey, function(content) {
            LectureActions.updateLectures(courseKey, content);
        });
    },

    unsubscribeFromLectures: function(componentKey, courseKey) {
        this.firebaseUnsubscribe(APIConstants.lectures, courseKey, componentKey);
    },

    addToLectures: function(courseKey, lecture, callback) {
        return refs[APIConstants.lectures][courseKey].ref.push(lecture, callback);
    },

    removeLecture: function(courseKey, lectureId, callback) {
        refs[APIConstants.lectures][courseKey].ref.child(lectureId).remove(callback);
    },

    updateLecture: function(courseKey, lectureKey, lecture, callback) {
        refs[APIConstants.lectures][courseKey].ref.child(lectureKey).update(lecture, callback);
    },

    subscribeToQuestions: function(componentKey, courseKey) {
        this.firebaseSubscribe(APIConstants.questions, courseKey, componentKey, function(content) {
            QuestionActions.updateQuestions(courseKey, content);
        });
    },

    unsubscribeFromQuestions: function(componentKey, courseKey) {
        this.firebaseUnsubscribe(APIConstants.questions, courseKey, componentKey);
    },

    addToQuestions: function(courseKey, lectureKey, lecture, question, callback) {
        let count = 0;
        let cb = (error) => {
            count++;
            if (error) callback(error);
            if (count >= 2) {
                callback(null);
            }
        };
        let lectureRef = refs[APIConstants.lectures][courseKey].ref.child(lectureKey);
        let questionRef = lectureRef.child('questions').push(question, cb);
        let questionKey = questionRef.key();
        let questionOrder = lecture.questionOrder || [];
        questionOrder.push(questionKey);
        lectureRef.child('questionOrder').update(questionOrder, cb);
        return questionKey;
    },

    removeQuestion: function(courseKey, lectureKey, lecture, questionKey, callback) {
        // Remove question from lecture object
        let index = Array.findIndex(lecture.questionOrder, x => x === questionKey);
        lecture.questionOrder.splice(index, 1);
        if (lecture.questions[questionKey]) {
            delete lecture.questions[questionKey];
        }

        // Update lecture object
        let lectureRef = refs[APIConstants.lectures][courseKey].ref.child(lectureKey);
        lectureRef.update(lecture, callback);
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
        this.firebaseUnsubscribe(APIConstants.subjects, userId, componentKey);
    },

    addToSubjects: function(userId, subjectName, callback) {
        return refs[APIConstants.subjects][userId].ref.push(subjectName, callback);
    },

    getRefs: function() {
        return refs;
    },

    setFirebaseRoot: function(newFirebaseRoot) {
        firebaseRoot = newFirebaseRoot;
    },
};

let publicAPI = {
    getRefs: API.getRefs, // exposed for testing
    setFirebaseRoot: API.setFirebaseRoot, // exposed for test configurationn
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
