import Dispatcher from '../dispatcher/Dispatcher.js';
import { ActionTypes } from '../constants/QuestionConstants.js';
import API from '../utils/API.js';

export const updateQuestions = (courseKey, questions) => {
  if (!courseKey || !questions) return;
  Dispatcher.dispatch({
    type: ActionTypes.QUESTIONS_UPDATE,
    courseKey,
    questions,
  });
};

export const createQuestion = (courseKey, lectureKey, lecture, question) => {
  let questionKey =
    API.addToQuestions(courseKey, lectureKey, lecture, question, (error) => {
      if (error) {
        Dispatcher.dispatch({
          type: ActionTypes.QUESTION_CREATE_FAIL,
          courseKey,
          lectureKey,
          questionKey,
          question,
          error
        });
      } else {
        Dispatcher.dispatch({
          type: ActionTypes.QUESTION_CREATE_SUCCESS,
          courseKey,
          lectureKey,
          questionKey,
          question,
        });
      }
  });

  Dispatcher.dispatch({
    type: ActionTypes.QUESTION_CREATE_INITIATED,
    courseKey,
    lectureKey,
    questionKey,
    question,
  });
};

export const deleteQuestion = (courseKey, lectureKey, lecture, questionKey) => {
    let callback = (error) => {
      if (error) {
        Dispatcher.dispatch({
          type: ActionTypes.QUESTION_DELETE_FAIL,
          courseKey,
          lectureKey,
          questionKey,
        });
      } else {
        Dispatcher.dispatch({
          type: ActionTypes.QUESTION_DELETE_SUCCESS,
          courseKey,
          lectureKey,
          questionKey,
        });
      }
    };

    API.removeQuestion(courseKey, lectureKey, lecture, questionKey, callback);
    Dispatcher.dispatch({
      type: ActionTypes.QUESTION_DELETE_INITIATED,
      courseKey,
      lectureKey,
      questionKey,
    });
};
