import * as SubjectActions from '../actions/SubjectActions.js';
import * as LectureActions from '../actions/LectureActions.js';
import * as QuestionActions from '../actions/QuestionActions.js';
import * as PresentationActions from '../actions/PresentationActions.js';
import * as PresentationViewerActions from '../actions/PresentationViewerActions.js';

const initialState = {
  errorMessage: null, // String | null
};

export default function(state=initialState, action) {
  switch (action.type) {
  case SubjectActions.SUBJECT_CREATE_FAILURE:
  case LectureActions.LECTURE_CREATE_FAILURE:
  case LectureActions.LECTURE_DELETE_FAILURE:
  case QuestionActions.QUESTION_CREATE_FAILURE:
  case PresentationActions.PRESENTATION_START_FAILURE:
  case PresentationViewerActions.PRESENTATION_VIEWER_RESPONSE_FAILURE:
    return {
      ...state,
      errorMessage: action.error && action.error.message
    };

  default:
    return state;
  }
}
