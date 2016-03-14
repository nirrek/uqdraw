import keyBy from 'lodash/keyBy';
import * as QuestionActions from '../actions/QuestionActions.js';
import * as LectureActions from '../actions/LectureActions.js';

const initialQuestionsState = {
  questions: {}, // Map<FirebaseKey, Object>
  isPendingRequest: false,
}
export default function(state=initialQuestionsState, action) {
  switch (action.type) {
    case LectureActions.LECTURES_FETCH_SUCCESS:
      const { lectures } = action;

      // Extract questions and convert collection to be keyed by question id
      const questions = lectures.reduce((acc, lecture) => {
        const questionsById = keyBy(lecture.questions, q => q.id);
        Object.assign(acc, questionsById);
        return acc;
      }, {});

      return {
        ...state,
        questions,
      };

    case QuestionActions.QUESTION_CREATE_REQUEST:
      return {
        ...state,
        isPendingRequest: true,
        questions: {
          ...state.questions,
          [action.id]: {
            id: action.id,
            text: action.question,
            lectureOwner: {
              id: action.lectureKey
            },
            listPosition: action.listPosition
          }
        },
      };

    case QuestionActions.QUESTION_CREATE_SUCCESS:
      return {
        ...state,
        isPendingRequest: false,
      };

    case QuestionActions.QUESTION_CREATE_FAILURE:
      // TODO state reversion using redux-optimist
      return {
        ...state,
        isPendingRequest: false,
      };

    case QuestionActions.QUESTION_DELETE_REQUEST:
      const nextQuestions = {...state.questions};
      delete nextQuestions[action.questionKey];
      return {
        ...state,
        questions: nextQuestions,
        isPendingRequest: true,
      };

    case QuestionActions.QUESTION_DELETE_SUCCESS:
      return {
        ...state,
        isPendingRequest: false,
      };

    case QuestionActions.QUESTION_UPDATE:
      return {
        ...state,
        ...action.questions,
      }

    default:
      return state;
  }
}
