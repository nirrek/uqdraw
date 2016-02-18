import Dispatcher from '../dispatcher/Dispatcher.js';
import { ActionTypes } from '../constants/SubjectConstants.js';
import { addToSubjects } from '../utils/API.js';

export const create = (userId, subjectName) => {
  if (!subjectName) return;

  addToSubjects(userId, subjectName, (error) => {
    if (error === null) {
      Dispatcher.dispatch({
        type: ActionTypes.SUBJECT_CREATE_SUCCESS,
        userId,
        subjectName,
      });
    } else {
      Dispatcher.dispatch({
        type: ActionTypes.SUBJECT_CREATE_FAIL,
        userId,
        subjectName,
        error,
      });
    }
  });

  Dispatcher.dispatch({
    type: ActionTypes.SUBJECT_CREATE_INITIATED,
    subjectName,
  });
};

export const updateSubjects = (subjectsMap) => {
  Dispatcher.dispatch({
    type: ActionTypes.SUBJECTS_UPDATE,
    subjects: subjectsMap,
  });
};
