import questionsReducer from './questionsReducer.js';
import subjectsReducer from './subjectsReducer.js';
import lecturesReducer from './lecturesReducer.js';
import appStatusReducer from './appStatusReducer.js';
import userReducer from './userReducer.js';
import presentationReducer from './presentationsReducer.js';
import presentationViewerReducer from './presentationViewerReducer.js';

const initialState = {
  course: {
    key: '', // String
    lectures: [], // [LectureKey]
  },
};

export default function rootReducer(state={}, action) {
  return {
    user: userReducer(state.user, action),
    questions: questionsReducer(state.questions, action),
    lectures: lecturesReducer(state.lectures, action, state.questions),
    subjects: subjectsReducer(state.subjects, action),
    appStatus: appStatusReducer(state.appStatus, action),
    presentations: presentationReducer(state.presentations, action),
    presentationViewer: presentationViewerReducer(state.presentationViewer, action),
  };
}
