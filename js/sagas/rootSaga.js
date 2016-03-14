import { takeEvery } from 'redux-saga';
import { fork, call, put, select } from 'redux-saga/effects';
import {
  SUBJECT_CREATE_REQUEST,
  createSubjectPushed,
  createSubjectSuccess,
  createSubjectFailure
} from '../actions/SubjectActions.js';
import * as LectureActions from '../actions/LectureActions.js';
import * as QuestionActions from '../actions/QuestionActions.js';
import * as UserActions from '../actions/UserActions.js';
import * as PresentationActions from '../actions/PresentationActions.js';
import * as PresentationViewerActions from '../actions/PresentationViewerActions.js';
import * as Api from '../utils/API.js';
import * as GraphQLApi from '../utils/GraphQLApi.js'
import uuid from 'node-uuid';

// Adapt Api methods that are push()ing to firebase for use in sagas.
const addToSubjects = sagaifyFirebasePush(Api.addToSubjects);
const addToLectures = sagaifyFirebasePush(Api.addToLectures);
const addToQuestions = sagaifyFirebasePush(Api.addToLectures);

// Allows firebase push() api calls to be used in sagas.
function sagaifyFirebasePush(method) {
  return (...args) => {
    const ref = method(...args);
    return Promise.resolve({
      key: ref.key(),
      thenable: ref,
    });
  };
}

// -----------------------------------------------------------------------------
//  Selectors — TODO extract for sharing between sagas
// -----------------------------------------------------------------------------
const Selectors = {
  lectures: state => state.lectures.lectures,
  questions: state => state.questions.questions,
};

// -----------------------------------------------------------------------------
//  Sagas
// -----------------------------------------------------------------------------
function* createSubject(action) {
  const { userId, subjectName } = action;
  const subjectId = uuid.v4();

  try {
    const res = yield call(GraphQLApi.createSubject, subjectId, userId, subjectName);
    yield put(createSubjectSuccess(subjectId, subjectName));
  } catch (error) {
    console.error(error, error.errors);
    yield put(createSubjectFailure(subjectId, error));
  }
}

function* createLecture(action) {
  const { lectureKey, courseKey, lectureName } = action;
  const newLecture = {
    id: lectureKey,
    name: lectureName,
    questions: [],
  };

  try {
    const res = yield call(GraphQLApi.createLecture, lectureKey, lectureName, courseKey);
    yield put(LectureActions.createLectureSuccess(lectureKey, newLecture));
  } catch (error) {
    console.error(error, error.errors);
    yield put(LectureActions.createLectureFailure(lectureKey, error));
  }
}

function* deleteLecture(action) {
  const { lectureKey } = action;

  // hold on to the lecture so we can revert optimistic update on failure
  const lectures = yield select(Selectors.lectures);
  const lecture = lectures[lectureKey];

  try {
    yield call(GraphQLApi.deleteLecture, lectureKey);
    yield put(LectureActions.deleteLectureSuccess(lectureKey));
  } catch (error) {
    console.error(error);
    yield put(LectureActions.deleteLectureFailure(lectureKey, lecture, error))
  }
}

function* createQuestion(action) {
  const { id, lectureKey, question, listPosition } = action;

  // Date record for optimisitic updating.
  const questionRecord = {
    id,
    text: question,
    lectureOwner: {
      id: lectureKey
    },
    listPosition
  };

  try {
    yield call(
      GraphQLApi.createQuestion,
      id, question, lectureKey, listPosition
    );
    yield put(QuestionActions.createQuestionSuccess(id));
  } catch (error) {
    console.error(error);
    yield put(QuestionActions.createQuestionFailure(id, error));
  }
}

function* deleteQuestion(action) {
  const { questionKey } = action;

  try {
    yield call(GraphQLApi.deleteQuestion, questionKey);
    yield put(QuestionActions.deleteQuestionSuccess(questionKey));
  } catch (error) {
    console.error(error);
    // TODO implement optimistic update reversion with redux-optimist
    yield put(QuestionActions.deleteQuestionFailure(questionKey));
  }
}

// TODO this ought be replaced with a login response instead.
function* fetchUser(action) {
  const response = yield call(GraphQLApi.fetchUser, action.id);
  yield put(UserActions.fetchUserSuccess(response.data.user));
}

function* fetchLectures(action) {
  const { courseId } = action;
  try {
    const response = yield call(GraphQLApi.fetchLectures, courseId);
    const { lectures } = response.data.course;
    yield put(LectureActions.fetchLecturesSuccess(courseId, lectures));
  } catch (error) {
    console.error(error);
    yield put(LectureActions.fetchLecturesFailure(courseId, error));
  }
}

function* startPresentation(action) {
  const { id, lectureId } = action;
  try {
    const response = yield call(GraphQLApi.startPresentation, id, lectureId);
    const { presentation } = response.data;
    yield put(PresentationActions.presentationStartSuccess(id, presentation));
  } catch (error) {
    console.error(error);
    yield put(PresentationActions.presentationStartFailure(id, error))
  }
}

function* activateQuestion(action) {
  const { presentationId, questionId } = action;
  try {
    const response = yield call(
      GraphQLApi.activateQuestion,
      presentationId, questionId
    );
    // yield put(PresentationActions.presentationStartSuccess(id, presentation));
  } catch (error) {
    console.error(error);
    // yield put(PresentationActions.presentationStartFailure(id, error))
  }
}

function* updateResponseAcceptance(doAcceptResponses, action) {
  const { presentationId } = action;
  try {
    yield call(
      GraphQLApi.updateResponseAcceptance,
      presentationId, doAcceptResponses
    );
    // TODO add success action
  } catch (error) {
    console.error(error);
    // TODO add failure action
  }
}

function* fetchPresentation(action) {
  const { code } = action;
  try {
    const response = yield call(GraphQLApi.fetchPresentationByCode, code);
    const { presentation } = response.data;
    if (presentation) {
      yield put(PresentationViewerActions.presentationSuccess(presentation));
    } else {
      throw new Error('No active presentation with that code');
    }
  } catch (error) {
    console.error(error);
    yield put(PresentationViewerActions.presentationFailure(code, error))
  }
}

function* submitResponse(action) {
  const { id, presentationId, questionId, responseImg } = action;
  try {
    const response = yield call(
      GraphQLApi.submitResponse,
      id, presentationId, questionId, responseImg
    );
    yield put(PresentationViewerActions.responseSuccess());
  } catch (error) {
    console.error(error);
    yield put(PresentationViewerActions.responseFailure(error))
  }
}

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------
function* watchSubjectCreate() {
  yield* takeEvery(SUBJECT_CREATE_REQUEST, createSubject);
}

function* watchLectureCreate() {
  yield* takeEvery(LectureActions.LECTURE_CREATE_REQUEST, createLecture);
}

function* watchLectureDelete() {
  yield* takeEvery(LectureActions.LECTURE_DELETE_REQUEST, deleteLecture);
}

function* watchQuestionCreate() {
  yield* takeEvery(QuestionActions.QUESTION_CREATE_REQUEST, createQuestion);
}

function* watchQuestionDelete() {
  yield* takeEvery(QuestionActions.QUESTION_DELETE_REQUEST, deleteQuestion);
}

function* watchFetchUser() {
  yield* takeEvery(UserActions.FETCH_USER, fetchUser);
}

function* watchFetchLectures() {
  yield* takeEvery(LectureActions.LECTURES_FETCH_REQUEST, fetchLectures);
}

function* watchPresentationStart() {
  yield* takeEvery(PresentationActions.PRESENTATION_START_REQUEST, startPresentation);
}

function* watchActivateQuestion() {
  yield* takeEvery(PresentationActions.PRESENTATION_QUESTION_ACTIVATED, activateQuestion);
}

function* watchStartAcceptingResponses() {
  yield* takeEvery(PresentationActions.PRESENTATION_START_ACCEPTING_RESPONSES, updateResponseAcceptance, true);
}

function* watchStopAcceptingResponses() {
  yield* takeEvery(PresentationActions.PRESENTATION_STOP_ACCEPTING_RESPONSES, updateResponseAcceptance, false);
}

function* watchPresentationViewerRequest() {
  yield* takeEvery(PresentationViewerActions.PRESENTATION_VIEWER_PRESENTATION_REQUEST, fetchPresentation);
}

function* watchPresentationResponse() {
  yield* takeEvery(PresentationViewerActions.PRESENTATION_VIEWER_RESPONSE_REQUEST, submitResponse);
}


// -----------------------------------------------------------------------------
// Root Saga
// -----------------------------------------------------------------------------
export default function* rootSaga() {
  yield fork(watchSubjectCreate);
  yield fork(watchLectureCreate);
  yield fork(watchLectureDelete);
  yield fork(watchQuestionCreate);
  yield fork(watchQuestionDelete);
  yield fork(watchFetchUser);
  yield fork(watchFetchLectures);
  yield fork(watchPresentationStart);
  yield fork(watchActivateQuestion);
  yield fork(watchStartAcceptingResponses);
  yield fork(watchStopAcceptingResponses);
  yield fork(watchPresentationViewerRequest);
  yield fork(watchPresentationResponse);
}
