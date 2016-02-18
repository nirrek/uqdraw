import Dispatcher from '../dispatcher/Dispatcher';
import { ActionTypes } from '../constants/LectureConstants.js'
import { addToLectures, removeLecture } from '../utils/API.js';

export const updateLectures = (courseKey, lectures) => {
  if (!courseKey || !lectures) return;
  Dispatcher.dispatch({
    type: ActionTypes.LECTURES_UPDATE_SUCCESS,
    courseKey,
    lectures,
  });
};

export const createLecture = (courseKey, lectureTitle) => {
  let newLecture = {title: lectureTitle, questions: []};
  let ref = addToLectures(courseKey, newLecture, (error) => {
    if (error) {
      Dispatcher.dispatch({
        type: ActionTypes.LECTURE_CREATE_FAIL,
        courseKey,
        lecture: newLecture,
      });
    } else {
      Dispatcher.dispatch({
        type: ActionTypes.LECTURE_CREATE_SUCCESS,
        courseKey,
        lectureKey: ref.key(),
        lecture: newLecture,
      });
    }
  });
  Dispatcher.dispatch({
    type: ActionTypes.LECTURE_CREATE_INITIATED,
    courseKey,
    lecture: newLecture,
  });
};

export const deleteLecture = (courseKey, lectureKey) => {
  removeLecture(courseKey, lectureKey, (error) => {
    if (error) {
      Dispatcher.dispatch({
        type: ActionTypes.LECTURE_DELETE_FAIL,
        courseKey,
        lectureKey,
      });
    } else {
      Dispatcher.dispatch({
        type: ActionTypes.LECTURE_DELETE_SUCCESS,
        courseKey,
        lectureKey,
      });
    }
  });
  Dispatcher.dispatch({
    type: ActionTypes.LECTURE_DELETE_INITIATED,
    courseKey,
    lectureKey,
  });
};
