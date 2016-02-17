import Dispatcher from '../dispatcher/Dispatcher.js';
import { EventEmitter } from 'events';
import LectureConstants from '../constants/LectureConstants.js';
const ActionTypes = LectureConstants.ActionTypes;

const CHANGE_EVENT = 'change';

const _lectures = {};

const LectureStore = Object.assign({}, EventEmitter.prototype, {
  get(courseId, lectureId) {
    if (!courseId || !lectureId) throw new Error('LectureStore.get requires a courseId and a lectureId');
    if (!_lectures[courseId]) return;
    return _lectures[courseId][lectureId];
  },

  getAll(courseId) {
    if (!courseId) throw new Error('LectureStore.getAll requires a courseId');
    return _lectures[courseId] || {};
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

const dispatcherCallback = (action) => {
  switch(action.type) {
    case ActionTypes.LECTURE_CREATE_SUCCESS: {
      const { courseKey, lectureKey, lecture } = action;
      if (lecture) {
        if (!_lectures[courseKey]) _lectures[courseKey] = {};
        _lectures[courseKey][lectureKey] = lecture;
        LectureStore.emitChange();
      }
      break;
    }

    case ActionTypes.LECTURES_UPDATE_SUCCESS: {
      const { courseKey, lectures } = action;
      if (lectures) {
        if (!_lectures[courseKey]) {
          _lectures[courseKey] = lectures;
        } else {
          Object.assign(_lectures[courseKey], lectures);
        }
        LectureStore.emitChange();
      }
      break;
    }

    case ActionTypes.LECTURE_DELETE_SUCCESS: {
      const { courseKey, lectureKey } = action;
      if (lectureKey) {
        if (_lectures[courseKey] &&
          _lectures[courseKey][lectureKey]) {
          delete _lectures[courseKey][lectureKey];
          LectureStore.emitChange();
        }
      }
      break;
    }

    case ActionTypes.QUESTION_CREATE_SUCCESS: {
      const { courseKey, lectureKey, questionKey, question } = action;
      if (questionKey) {
        if (!_lectures[courseKey]) _lectures[courseKey] = {};
        if (_lectures[courseKey][lectureKey]) {
          const lecture = _lectures[courseKey][lectureKey];
          if (!lecture.questions) lecture.questions = {};
          if (!lecture.questionOrder) lecture.questionOrder = [];
          lecture.questions[questionKey] = question;
          lecture.questionOrder.push(questionKey);
        }
      }
      LectureStore.emitChange();
      break;
    }

    case ActionTypes.QUESTION_UPDATE_SUCCESS: {
      const { courseKey, lectureKey, questionKey, question } = action;
      if (questionKey) {
        if (!_lectures[courseKey]) _lectures[courseKey] = {};
        if (_lectures[courseKey][lectureKey]) {
          const lecture = _lectures[courseKey][lectureKey];
          if (!lecture.questions) lecture.questions = {};
          if (!lecture.questions[questionKey]) {
            lecture.questions[questionKey] = question;
            if (!lecture.questionOrder) lecture.questionOrder = [];
            lecture.questionOrder.push(questionKey);
          } else {
            Object.assign(lecture.questions[questionKey], question);
          }
        }
      }
      LectureStore.emitChange();
      break;
    }

    case ActionTypes.QUESTION_DELETE_SUCCESS: {
      const { courseKey, lectureKey, questionKey } = action;
      if (courseKey && questionKey) {
        if (!_lectures[courseKey]) break;
        if (_lectures[courseKey][lectureKey]) {
          const lecture = _lectures[courseKey][lectureKey];

          // Remove question from questionOrder
          const index = lecture.questionOrder.findIndex(x => x === questionKey);
          if (index) {
            lecture.questionOrder.splice(index, 1);
          }

          // Remove actual question object
          if (lecture.questions[questionKey]) {
            delete lecture.questions[questionKey];
          }
        }
      }
      LectureStore.emitChange();
      break;
    }
    default:
      //noop
  }
};

LectureStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default LectureStore;
