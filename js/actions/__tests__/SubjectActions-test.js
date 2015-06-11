jest.dontMock('../SubjectActions.js');
jest.dontMock('keymirror');

let API = require('../../utils/API.js').default;
let Dispatcher = require('../../dispatcher/Dispatcher.js');
let SubjectActions = require('../SubjectActions.js');
import SubjectConstants from '../../constants/SubjectConstants.js';
let actionTypes = SubjectConstants.ActionTypes;

describe('SubjectActions', () => {

  describe('create', () => {
    it('does not call the API or dispatch actions if no subject provided', () => {
      SubjectActions.create('user', '');
      expect(API.addToSubjects.mock.calls.length).toBe(0);
      expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
    });

    it('tells the API to add a new subject', () => {
      SubjectActions.create('user', 'subject');

      expect(API.addToSubjects).lastCalledWith('user', 'subject', jasmine.any(Function));
    });

    it('dispatches a SUBJECT_CREATE_INITIATED action', () => {
      SubjectActions.create('user', 'subject');

      expect(Dispatcher.dispatch).lastCalledWith({
        type: actionTypes.SUBJECT_CREATE_INITIATED,
        subjectName: 'subject',
      });
    });

    it('dispatches a SUBJECT_CREATE_SUCCESS action when API invokes success callback', () => {
      SubjectActions.create('user', 'subject');

      // Get a ref to the callback the action creator gave to API
      // then invoke it with a null error
      let calls = API.addToSubjects.mock.calls;
      let callback = calls[calls.length - 1][2];
      callback(null);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: actionTypes.SUBJECT_CREATE_SUCCESS,
        userId: 'user',
        subjectName: 'subject',
      });
    });

    it('dispatches a SUBJECT_CREATE_FAIL action when API invokes error callback', () => {
      SubjectActions.create('user', 'subject');

      // Get a ref to the callback the action creator gave to API
      // then invoke it with an error
      let calls = API.addToSubjects.mock.calls;
      let callback = calls[calls.length - 1][2];
      let apiError = new Error('internet exploded error');
      callback(apiError);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: actionTypes.SUBJECT_CREATE_FAIL,
        userId: 'user',
        subjectName: 'subject',
        error: apiError,
      });
    });
  });

  describe('updateSubjects', () => {
    it('dispatches SUBJECT_UPDATE with correct subjects', () => {
      let subjects = {
        '-JlUd0xRBkwULfuGFGqo': 'COMS3200',
        '-JldDBERX2jaTHTanV-P': 'INFS3202',
        '-Jli22md1TMXq7YhqMHd': 'DECO3800',
      };
      SubjectActions.updateSubjects(subjects);

      expect(Dispatcher.dispatch).lastCalledWith({
        type: actionTypes.SUBJECTS_UPDATE,
        subjects: subjects,
      });
    });
  });
});
