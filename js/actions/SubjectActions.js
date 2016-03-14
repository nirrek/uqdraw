import uuid from 'node-uuid';

export const SUBJECT_CREATE_REQUEST = 'SUBJECT_CREATE_REQUEST';
export const SUBJECT_CREATE_PUSHED = 'SUBJECT_CREATE_PUSHED';
export const SUBJECT_CREATE_SUCCESS = 'SUBJECT_CREATE_SUCCESS';
export const SUBJECT_CREATE_FAILURE = 'SUBJECT_CREATE_FAILURE';
export const SUBJECTS_UPDATED = 'SUBJECTS_UPDATED';

export const createSubject = (userId, subjectName) => ({
  type: SUBJECT_CREATE_REQUEST,
  subjectKey: uuid.v4(),
  userId,
  subjectName,
});

export const createSubjectSuccess = (subjectKey, subjectName) => ({
  type: SUBJECT_CREATE_SUCCESS,
  subjectKey,
  subjectName,
});

export const createSubjectFailure = (subjectKey, error) => ({
  type: SUBJECT_CREATE_FAILURE,
  subjectKey,
  error,
});

export const subjectsUpdated = (subjects) => ({
  type: SUBJECTS_UPDATED,
  subjects,
});
