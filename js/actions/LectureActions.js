import uuid from 'node-uuid';

// -----------------------------------------------------------------------------
// Fetch
// -----------------------------------------------------------------------------
export const LECTURES_FETCH_REQUEST = 'LECTURES_FETCH_REQUEST';
export const LECTURES_FETCH_SUCCESS = 'LECTURES_FETCH_SUCCESS';
export const LECTURES_FETCH_FAILURE = 'LECTURES_FETCH_FAILURE';

export const fetchLectures = (courseId) => ({
  type: LECTURES_FETCH_REQUEST,
  courseId,
});

export const fetchLecturesSuccess = (courseId, lectures) => ({
  type: LECTURES_FETCH_SUCCESS,
  courseId,
  lectures,
})

export const fetchLecturesFailure = (courseId, error) => ({
  type: LECTURES_FETCH_FAILURE,
  courseId,
  error,
});

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------
export const LECTURE_CREATE_REQUEST = 'LECTURE_CREATE_REQUEST';
export const LECTURE_CREATE_SUCCESS = 'LECTURE_CREATE_SUCCESS';
export const LECTURE_CREATE_FAILURE = 'LECTURE_CREATE_FAILURE';

export const createLecture = (courseKey, lectureName) => ({
  type: LECTURE_CREATE_REQUEST,
  lectureKey: uuid.v4(),
  courseKey,
  lectureName,
});

export const createLectureSuccess = (lectureKey, lecture) => ({
  type: LECTURE_CREATE_SUCCESS,
  lectureKey,
  lecture,
});

export const createLectureFailure = (lectureKey, error) => ({
  type: LECTURE_CREATE_FAILURE,
  lectureKey,
  error,
});

// -----------------------------------------------------------------------------
// Delete
// -----------------------------------------------------------------------------
export const LECTURE_DELETE_REQUEST = 'LECTURE_DELETE_REQUEST';
export const LECTURE_DELETE_SUCCESS = 'LECTURE_DELETE_SUCCESS';
export const LECTURE_DELETE_FAILURE = 'LECTURE_DELETE_FAILURE';

export const deleteLecture = (lectureKey) => ({
  type: LECTURE_DELETE_REQUEST,
  lectureKey,
});

export const deleteLectureSuccess = (lectureKey) => ({
  type: LECTURE_DELETE_SUCCESS,
  lectureKey,
});

export const deleteLectureFailure = (lectureKey, lecture, error) => ({
  type: LECTURE_DELETE_FAILURE,
  lectureKey,
  lecture,
  error,
});

// -----------------------------------------------------------------------------
// Update
// -----------------------------------------------------------------------------
export const LECTURES_UPDATED = 'LECTURES_UPDATED';

export const lecturesUpdated = (lectures) => ({
  type: LECTURES_UPDATED,
  lectures,
});
