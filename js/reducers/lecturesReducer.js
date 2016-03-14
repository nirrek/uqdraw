import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import * as LectureActions from '../actions/LectureActions.js';
import * as QuestionActions from '../actions/QuestionActions.js';

const initialState = {
  lectures: {}, // Map<FirebaseKey, { questions: {}, questionOrder: {}, title }>
  isPendingRequest: false,
};

export default function(state=initialState, action, questions) {
  switch (action.type) {
  case LectureActions.LECTURES_FETCH_REQUEST:
    return {
      ...state,
      isPendingRequest: true,
    };

  case LectureActions.LECTURES_FETCH_SUCCESS:
    const { lectures } = action;

    // Converts lectures into an object keyed by lecture id, and for each
    // lecture, the questions are converted to a list of question ids.
    const massagedLectures = lectures.reduce((acc, lecture) => {
      lecture.questions = sortBy(lecture.questions, q => q.listPosition)
                            .map(q => q.id);
      acc[lecture.id] = lecture;
      return acc;
    }, {});

    return {
      ...state,
      isPendingRequest: false,
      lectures: massagedLectures
    };

  case LectureActions.LECTURE_CREATE_REQUEST:
    return {
      ...state,
      lectures: {
        ...state.lectures,
        [action.lectureKey]: {
          id: action.lectureKey,
          name: action.lectureName,
          questions: [],
          courseOwner: {
            id: action.courseKey
          }
        },
      },
      isPendingRequest: true,
    };

  case LectureActions.LECTURE_CREATE_SUCCESS:
    return {
      ...state,
      isPendingRequest: false,
    };

  case LectureActions.LECTURE_CREATE_FAILURE: {
    // Revert optimistic update
    const nextLectures = {...state.lectures};
    delete nextLectures[action.lectureKey];

    return {
      ...state,
      lectures: nextLectures,
      isPendingRequest: false,
    };
  }

  case LectureActions.LECTURE_DELETE_REQUEST: {
    // optimistically delete
    const nextLectures = {...state.lectures};
    delete nextLectures[action.lectureKey];

    return {
      ...state,
      lectures: nextLectures,
      isPendingRequest: true,
    };
  }

  case LectureActions.LECTURE_DELETE_SUCCESS:
    return {
      ...state,
      isPendingRequest: false,
    };

  case LectureActions.LECTURE_DELETE_FAILURE:
    return {
      ...state,
      lectures: {
        ...state.lectures,
        [action.lectureKey]: action.lecture, // undo optimistic delete
      },
      isPendingRequest: false,
    };

  case LectureActions.LECTURES_UPDATED:
    return {
      ...state,
      lectures: action.lectures,
    };

  case QuestionActions.QUESTION_CREATE_REQUEST: {
    const { lectureKey } = action;
    const affectedLecture = state.lectures[lectureKey];

    return {
      lectures: {
        ...state.lectures,
        [lectureKey]: {
          ...affectedLecture,
          questions: [
            ...affectedLecture.questions,
            action.id,
          ]
        }
      }
    };
  }

  case QuestionActions.QUESTION_DELETE_REQUEST: {
    const lectureKey = questions.questions[action.questionKey].lectureOwner.id;
    const nextQuestions = [...state.lectures[lectureKey].questions];
    const idx = nextQuestions.indexOf(action.questionKey)
    nextQuestions.splice(idx, 1);
    return {
      ...state,
      lectures: {
        ...state.lectures,
        [lectureKey]: {
          ...state.lectures[lectureKey],
          questions: nextQuestions,
        }
      },
      isPendingRequest: true,
    };
  }

  default:
    return state;
  }
}
