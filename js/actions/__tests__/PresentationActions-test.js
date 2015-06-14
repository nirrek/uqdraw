jest.dontMock('../PresentationActions.js');
jest.dontMock('keymirror');

let API;
let Dispatcher;
let PresentationActions;
let ActionTypes = require('../../constants/PresentationConstants.js').ActionTypes;

describe('PresentationActions', () => {
  // Common arguments used in the nested test suites.
  let testLectureKey = '-9asdf8as9d8f';
  let testQuestionKey = '-c6vbn46c5vbn';
  let testResponse = 'data:image/png;base64,iVBORw0KGgoA..';
  let testResponses = {};

  beforeEach(() => {
    // Get a fresh version of all our dependencies each time.
    Dispatcher = require('../../dispatcher/Dispatcher.js');
    API = require('../../utils/API').default;
    PresentationActions = require('../PresentationActions.js');
  });

  describe('createResponse', () => {
    it('tells the API to add a new response', () => {
      PresentationActions.createResponse(testLectureKey, testQuestionKey, testResponse);
      expect(API.addToResponses)
        .lastCalledWith(testLectureKey, testQuestionKey, testResponse, jasmine.any(Function));
    });

    it('dispatches a RESPONSE_CREATE_INITIATED action', () => {
      PresentationActions.createResponse(testLectureKey, testQuestionKey, testResponse);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.RESPONSE_CREATE_INITIATED,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
        response: testResponse,
      });
    });

    it('dispatches a RESPONSE_CREATE_FAIL action when API invokes error callback', () => {
      PresentationActions.createResponse(testLectureKey, testQuestionKey, testResponse);

      // Get a ref to the callback given to the API; invoke with error arg.
      let calls = API.addToResponses.mock.calls;
      let callback = calls[calls.length - 1][3];
      callback(new Error('crazy town error'));

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.RESPONSE_CREATE_FAIL,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
        response: testResponse,
        error: jasmine.any(Object),
      });
    });

    it('dispatches a RESPONSE_CREATE_SUCCESS action when API invokes success callback', () => {
      // Must return a Firebase key for the added responses.
      API.addToResponses = jest.genMockFunction().mockImpl(() => {
        return 'aas9df8s9df';
      });

      PresentationActions.createResponse(testLectureKey, testQuestionKey, testResponse);

      // Get a ref to the callback given to the API; invoke with null error arg.
      let calls = API.addToResponses.mock.calls;
      let callback = calls[calls.length - 1][3];
      callback(null);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: ActionTypes.RESPONSE_CREATE_SUCCESS,
        lectureKey: testLectureKey,
        questionKey: testQuestionKey,
        responseKey: 'aas9df8s9df',
        response: testResponse,
      });
    });
  });

  describe('updateResponses', () => {
    it('dispatches a RESPONSES_UPDATE_SUCCESS action', () => {
      PresentationActions.updateResponses(testLectureKey, testResponses);

    });
  });
});
