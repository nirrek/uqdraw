jest.dontMock('../QuestionActions.js');
jest.dontMock('keymirror');

let API;
let Dispatcher;
let QuestionActions;
let ActionTypes = require('../../constants/QuestionConstants.js').ActionTypes;

describe('QuestionActions', () => {
  // Common arguments used in the nested test suites.
  let testCourseKey = '-z98asd7f8sa1';
  let testLectureKey = '-9asdf8as9d8f';
  let testLecture = {};
  let testQuestion = 'A question';
  let testQuestionKey = '-b98as76fa457s';
  let testQuestions = {
    '-Jra-WapzY84e1LQTRsV': 'a question',
    '-Jra5GHqOZ1zxGxei5NY': 'another question',
  };

  beforeEach(() => {
    // Get a fresh version of all our dependencies each time.
    Dispatcher = require('../../dispatcher/Dispatcher.js');
    API = require('../../utils/API').default;
    QuestionActions = require('../QuestionActions.js');

    // Remock API.addToQuestions to return a questionKey
    API.addToQuestions = jest.genMockFunction().mockImpl(() => {
      return testQuestionKey;
    });
  });

  describe('updateQuestions', () => {
    it('dispatches a QUESTIONS_UPDATE action', () => {
      QuestionActions.updateQuestions(testCourseKey, testQuestions);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTIONS_UPDATE,
        courseKey: testCourseKey,
        questions: testQuestions,
      });
    });

    it('does not dispatch an action if no courseKey provided', () => {
      QuestionActions.updateQuestions(null, testQuestions);

      expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
    });

    it('does not dispatch an action if no questions provided', () => {
      QuestionActions.updateQuestions(testCourseKey, null);

      expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
    });
  });

  describe('create', () => {
    it('tells the API to add a new set of questions', () => {
      QuestionActions.create(testCourseKey, testLectureKey, testLecture, testQuestion);

      expect(API.addToQuestions)
        .lastCalledWith(testCourseKey, testLectureKey, testLecture, testQuestion, jasmine.any(Function));
    });

    it('dispatches a QUESTION_CREATE_INITIATED action', () => {
      QuestionActions.create(testCourseKey, testLectureKey, testLecture, testQuestion);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTION_CREATE_INITIATED,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
        question: testQuestion,
      });
    });

    it('dispatches a QUESTION_CREATE_FAIL action when API invokes error callback', () => {
      QuestionActions.create(testCourseKey, testLectureKey, testLecture, testQuestion);

      // Get a ref to the callback given to the API; invoke with error arg.
      let calls = API.addToQuestions.mock.calls;
      let callback = calls[calls.length - 1][4];
      callback(new Error('crazy town error'));

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTION_CREATE_FAIL,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
        question: testQuestion,
        error: jasmine.any(Error),
      });
    });

    it('dispatches a QUESTION_CREATE_SUCCESS action when API invokes success callback', () => {
      QuestionActions.create(testCourseKey, testLectureKey, testLecture, testQuestion);

      // Get a ref to the callback given to the API; invoke with null error arg.
      let calls = API.addToQuestions.mock.calls;
      let callback = calls[calls.length - 1][4];
      callback(null);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTION_CREATE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
        question: testQuestion,
      });
    });
  });

  describe('delete', () => {
    it('tells the API to delete a question', () => {
      QuestionActions.delete(testCourseKey, testLectureKey, testLecture, testQuestionKey);
      expect(API.removeQuestion)
        .lastCalledWith(testCourseKey, testLectureKey, testLecture, testQuestionKey, jasmine.any(Function));
    });

    it('dispatches a QUESTION_DELETE_INITIATED action', () => {
      QuestionActions.delete(testCourseKey, testLectureKey, testLecture, testQuestionKey);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTION_DELETE_INITIATED,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
      });
    });

    it('dispatches a QUESTION_DELETE_FAIL action when API invokes error callback', () => {
      QuestionActions.delete(testCourseKey, testLectureKey, testLecture, testQuestionKey);

      // Get a ref to the callback given to the API; invoke with error arg.
      let calls = API.removeQuestion.mock.calls;
      let callback = calls[calls.length - 1][4];
      callback(new Error('crazy town error'));

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTION_DELETE_FAIL,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
      });
    });

    it('dispatches a QUESTION_DELETE_SUCCESS action when API invokes success callback', () => {
      QuestionActions.delete(testCourseKey, testLectureKey, testLecture, testQuestionKey);

      // Get a ref to the callback given to the API; invoke with null error arg.
      let calls = API.removeQuestion.mock.calls;
      let callback = calls[calls.length - 1][4];
      callback(null);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.QUESTION_DELETE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
      });
    });
  });

});
