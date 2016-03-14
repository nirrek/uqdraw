import * as SubjectActions from '../actions/SubjectActions.js';
import * as UserActions from '../actions/UserActions.js';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';


const initialState = {
  subjects: {},  // Map<FirebaseKey, String>
  isPendingRequest: false,
};

export default function(state=initialState, action) {
  switch (action.type) {
  case UserActions.FETCH_USER_SUCCESS:
    // Massage repsonse to Map<Id, String>
    const keyed = keyBy(action.user.courses, c => c.id);
    const subjects = mapValues(keyed, v => v.name);
    return {
      ...state,
      subjects
    };

  case SubjectActions.SUBJECT_CREATE_REQUEST:
    return {
      ...state,
      subjects: {
        ...state.subjects,
        [action.subjectKey]: action.subjectName
      },
      isPendingRequest: true,
    };

  case SubjectActions.SUBJECT_CREATE_SUCCESS:
    return {
      ...state,
      isPendingRequest: false,
    };

  case SubjectActions.SUBJECT_CREATE_FAILURE:
    // Revert optimistic update
    const nextSubjects = { ...state.subjects };
    delete nextSubjects[action.subjectKey];

    return {
      ...state,
      subjects: nextSubjects,
      isPendingRequest: false,
    };

  case SubjectActions.SUBJECTS_UPDATED:
    return {
      ...state,
      subjects: action.subjects,
    };

  default:
    return state;
  }
};
