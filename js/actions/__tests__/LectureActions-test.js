jest.dontMock('../LectureActions.js');
jest.dontMock('keymirror');

// let API = require('../../utils/API.js').default;Z
let API;
let Dispatcher;
let LectureActions;
let ActionTypes = require('../../constants/LectureConstants.js').ActionTypes;

describe('LectureActions', () => {
  // Common arguments used in the nested test suites.
  let testCourseKey = 'as9dfa9sdf8';
  let testLectureTitle = 'Great Title!';
  let testLectureKey = '-9asdf8as9d8f';
  let testLectures = {
    [testLectureKey]: {
      title: testLectureTitle,
      questions: {},
      questionOrder: [],
    }
  };

  beforeEach(() => {
    // Get a fresh version of all our dependencies each time.
    Dispatcher = require('../../dispatcher/Dispatcher.js');
    API = require('../../utils/API').default;
    LectureActions = require('../LectureActions.js');
  });

  describe('updateLectures', () => {
    it('dispatches a LECTURES_UPDATE_SUCCESS action', () => {
      LectureActions.updateLectures(testCourseKey, testLectures);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURES_UPDATE_SUCCESS,
        courseKey: testCourseKey,
        lectures: testLectures,
      });
    });

    it('does not dispatch an action if no courseKey provided', () => {
      LectureActions.updateLectures(null, testLectures);
      expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
    });

    it('does not dispatch an action if no lectures provided', () => {
      LectureActions.updateLectures(testCourseKey, null);
      expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
    });
  });

  describe('create', () => {
    it('tells the API to add a new lecture', () => {
      LectureActions.create(testCourseKey, testLectureTitle);
      expect(API.addToLectures).lastCalledWith(testCourseKey, jasmine.any(Object), jasmine.any(Function));
    });

    it('dispatches a LECTURE_CREATE_INITIATED action', () => {
      LectureActions.create(testCourseKey, testLectureTitle);
      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURE_CREATE_INITIATED,
        courseKey: testCourseKey,
        lecture: jasmine.any(Object), // TODO figure out how to shape match instead.
      });
    });

    it('dispatches a LECTURE_CREATE_FAIL action when API invokes error callback', () => {
      LectureActions.create(testCourseKey, testLectureTitle);

      // Get a ref to the callback given to the API; invoke with error arg.
      let calls = API.addToLectures.mock.calls;
      let callback = calls[calls.length - 1][2];
      callback(new Error('crazy town error'));

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURE_CREATE_FAIL,
        courseKey: testCourseKey,
        lecture: jasmine.any(Object), // TODO figure out how to shape match instead.
      });
    });

    it('dispatches a LECTURE_CREATE_SUCCESS action when API invokes success callback', () => {
      // Must return an invokable object to prevent LectureActions from erroring out.
      API.addToLectures = jest.genMockFunction().mockImpl(() => {
        return { key() { return 'aas9df8s9df'; } };
      });

      LectureActions.create(testCourseKey, testLectureTitle);

      // Get a ref to the callback given to the API; invoke with null error arg.
      let calls = API.addToLectures.mock.calls;
      let callback = calls[calls.length - 1][2];
      callback(null);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURE_CREATE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: jasmine.any(String),
        lecture: jasmine.any(Object), // TODO figure out how to shape match instead.
      });
    });
  });

  describe('delete', () => {
    it('tells the API to delete a lecture', () => {
      LectureActions.delete(testCourseKey, testLectureKey);
      expect(API.removeLecture)
        .lastCalledWith(testCourseKey, testLectureKey, jasmine.any(Function));
    });

    it('dispatches a LECTURE_DELETE_INITIATED action', () => {
      LectureActions.delete(testCourseKey, testLectureKey);
      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURE_DELETE_INITIATED,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
      });
    });

    it('dispatches a LECTURE_DELETE_FAIL action when API invokes error callback', () => {
      LectureActions.delete(testCourseKey, testLectureKey);

      // Get a ref to the callback given to the API; invoke with error arg.
      let calls = API.removeLecture.mock.calls;
      let callback = calls[calls.length - 1][2];
      callback(new Error('crazy town error'));

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURE_DELETE_FAIL,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
      });
    });

    it('dispatches a LECTURE_DELETE_SUCCESS action when API invokes success callback', () => {
      LectureActions.delete(testCourseKey, testLectureKey);

      // Get a ref to the callback given to the API; invoke with null error arg.
      let calls = API.removeLecture.mock.calls;
      let callback = calls[calls.length - 1][2];
      callback(null);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.LECTURE_DELETE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
      });
    });
  });
});
