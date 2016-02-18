import config from '../config';
import Firebase from 'firebase';
import { updateLectures } from '../actions/LectureActions.js';
import { updateResponses } from '../actions/PresentationActions.js';
import { updateSubjects } from '../actions/SubjectActions.js';
import keyMirror from 'keymirror';
import { hasPath } from '../utils/utils.js';
let firebaseRoot = config.firebase.base;

// Tracks currently active Firebase refs, along with the components that are
// currently interested in receiving updates from the ref.
// {
//   questions: {
//     someFilterKey: {
//       ref: firebaseRefObject,
//       listeners: {
//         123412341: 123412341, // component key
//       }
//     }
//   }
// }
const refs = {};

// Subscription types that allow a consumer to specify what logical Firebase
// resource they wish to subscribe/unsubscribe to.
export const APIConstants = keyMirror({
  lectures: null,
  responses: null,
  subjects: null,
});

// Maps a subscription type to a Firebase namespace for the type.
const firebasePaths = {
  [APIConstants.lectures]: 'lectures',
  [APIConstants.responses]: 'responses',
  [APIConstants.subjects]: 'courseLists',
};

// Maps a subscription type to subscribe/unsubscribe functions for the type.
const subscriptionFunctions = {
  [APIConstants.lectures]: {
    subscribe: subscribeToLectures,
    unsubscribe: unsubscribeFromLectures,
  },
  [APIConstants.responses]: {
    subscribe: subscribeToResponses,
    unsubscribe: unsubscribeFromResponses,
  },
  [APIConstants.subjects]: {
    subscribe: subscribeToSubjects,
    unsubscribe: unsubscribeFromSubjects,
  },
}

// getRefInfo :: (String, String) -> Object
// Returns ref information for the given refType and filter. If ref information
// does not exist, it will be initialized.
function getRefInfo(refType, filter) {
  // Does ref info exist for the refType?
  if (!refs[refType]) refs[refType] = {};

  // Does ref info exist for the filter?
  if (!refs[refType][filter])
    refs[refType][filter] = {};

  // Is there a currently active ref for the refType + filter?
  if (!refs[refType][filter].ref)
    refs[refType][filter] = {
      ref: null,
      listening: {},
    };

  return refs[refType][filter];
};

export function subscribe(refType, ...args) {
  if (!refType in subscriptionFunctions)
    return console.error(`Invalid subscribe type: ${refType}`);

  subscriptionFunctions[refType].subscribe(...args);
};

export function unsubscribe(refType, ...args) {
  if (!refType in subscriptionFunctions)
    return console.error(`Invalid unsubscribe type: ${refType}`);

  subscriptionFunctions[refType].unsubscribe(...args);
};

function firebaseSubscribe(refType, filter, componentKey, callback) {
  const refInfo = getRefInfo(refType, filter);

  // If there is no active Firebase ref, initialize one.
  if (!refInfo.ref) {
    refInfo.ref = new Firebase(`${firebaseRoot}/${firebasePaths[refType]}/${filter}`);
    refInfo.ref.on('value', (snapshot) => {
      const content = snapshot.val() || {};
      callback(content);
    });
  }

  // Set the current component as a listener
  refInfo.listening[componentKey] = componentKey;
};

function firebaseUnsubscribe(refType, filter, componentKey) {
  if (!hasPath(refs, [refType, filter, 'listening', componentKey]))
    return;

  const refInfo = refs[refType][filter];
  delete refInfo.listening[componentKey];

  // Remove the ref if we unsubscribed the final subscriber.
  if (!Object.keys(refInfo.listening).length) {
    refInfo.ref.off();
    refInfo.ref = null;
  }
}


// -----------------------------------------------------------------------------
//  Lectures
// -----------------------------------------------------------------------------

// I don't like how this inverts the order of filter and component key.
// the order here is:       (componentKey, filter)
// the delegate's order is: (filter, componentKey)
function subscribeToLectures(componentKey, courseKey) {
  firebaseSubscribe(APIConstants.lectures, courseKey, componentKey, function(content) {
    updateLectures(courseKey, content);
  });
};

function unsubscribeFromLectures(componentKey, courseKey) {
  firebaseUnsubscribe(APIConstants.lectures, courseKey, componentKey);
};

export function addToLectures(courseKey, lecture, callback) {
  return refs[APIConstants.lectures][courseKey].ref.push(lecture, callback);
};

export function removeLecture(courseKey, lectureId, callback) {
  refs[APIConstants.lectures][courseKey].ref.child(lectureId).remove(callback);
};

export function updateLecture(courseKey, lectureKey, lecture, callback) {
  refs[APIConstants.lectures][courseKey].ref.child(lectureKey).update(lecture, callback);
};

export function addToQuestions(courseKey, lectureKey, lecture, question, callback) {
  let count = 0;
  const cb = (error) => {
    count++;
    if (error) callback(error);
    if (count >= 2) {
      callback(null);
    }
  };
  const lectureRef = refs[APIConstants.lectures][courseKey].ref.child(lectureKey);
  const questionRef = lectureRef.child('questions').push(question, cb);
  const questionKey = questionRef.key();
  const questionOrder = lecture.questionOrder || [];
  questionOrder.push(questionKey);
  lectureRef.child('questionOrder').update(questionOrder, cb);
  return questionKey;
};

export function removeQuestion(courseKey, lectureKey, lecture, questionKey, callback) {
  // Remove question from lecture object
  const index = Array.findIndex(lecture.questionOrder, x => x === questionKey);
  lecture.questionOrder.splice(index, 1);
  if (lecture.questions[questionKey]) {
    delete lecture.questions[questionKey];
  }

  // Update lecture object
  const lectureRef = refs[APIConstants.lectures][courseKey].ref.child(lectureKey);
  lectureRef.update(lecture, callback);
};


// -----------------------------------------------------------------------------
//  Responses
// -----------------------------------------------------------------------------
function subscribeToResponses(componentKey, lectureKey) {
  firebaseSubscribe(APIConstants.responses, lectureKey, componentKey, function(content) {
    updateResponses(lectureKey, content);
  });
};

function unsubscribeFromResponses(componentKey, lectureKey) {
  firebaseUnsubscribe(APIConstants.responses, lectureKey, componentKey);
};

export function addToResponses(lectureKey, questionKey, response, callback) {
  const ref = refs[APIConstants.responses][lectureKey].ref
                .child(questionKey).push(response, callback);
  return ref.key();
};


// -----------------------------------------------------------------------------
//  Subjects
// -----------------------------------------------------------------------------
function subscribeToSubjects(componentKey, userId) {
  firebaseSubscribe(APIConstants.subjects, userId, componentKey, function(content) {
    updateSubjects(content);
  });
};

function unsubscribeFromSubjects(componentKey, userId) {
  firebaseUnsubscribe(APIConstants.subjects, userId, componentKey);
};

export function addToSubjects(userId, subjectName, callback) {
  return refs[APIConstants.subjects][userId].ref.push(subjectName, callback);
};


// -----------------------------------------------------------------------------
//  Testing
// -----------------------------------------------------------------------------
// exposed for testing
export function getRefs() {
  return refs;
};

// exposed for test configurationn
export function setFirebaseRoot(newFirebaseRoot) {
  firebaseRoot = newFirebaseRoot;
};
