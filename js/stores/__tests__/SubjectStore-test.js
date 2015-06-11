jest.dontMock('../SubjectStore.js');

describe('SubjectStore', () => {
  let SubjectConstant = require('../../constants/SubjectConstants.js');
  let ActionTypes = SubjectConstant.ActionTypes;
  let Dispatcher;
  let SubjectStore;
  let callback; // SubjectStores registered callback w/ dispatcher

  beforeEach(() => {
    Dispatcher = require('../../dispatcher/Dispatcher.js');
    SubjectStore = require('../SubjectStore.js');
    callback = Dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(Dispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no subjects', () => {
    let subjects = SubjectStore.getAll();
    expect(subjects).toEqual({});
  });

  it('initializes with _isSubmitting as false', () => {
    expect(SubjectStore.isSubmitting()).toBe(false);
  });

  it('invokes registered listeners', () => {
    let listener1 = jest.genMockFunction();
    let listener2 = jest.genMockFunction();
    SubjectStore.addChangeListener(listener1);
    SubjectStore.addChangeListener(listener2);
    SubjectStore.emit('change'); // string not exposed; fragile

    expect(listener1.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(1);
  });

  it('does not invoke deregistered listeners', () => {
    let listener1 = jest.genMockFunction();
    let listener2 = jest.genMockFunction();
    SubjectStore.addChangeListener(listener1);
    SubjectStore.addChangeListener(listener2);
    SubjectStore.removeChangeListener(listener2);
    SubjectStore.emit('change'); // string not exposed; fragile

    expect(listener1.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(0);
  });

  it('unrecognized action types are treated as a noop', () => {
    let action = {
      type: 'someRandomAction'
    };
    callback(action);
    expect(SubjectStore.getAll()).toEqual({});
    expect(SubjectStore.isSubmitting()).toBe(false);
  });

  describe('SUBJECT_CREATE_INITIATED action', () => {
    let action = {
      type: ActionTypes.SUBJECT_CREATE_INITIATED,
      subjectName: 'COMS3200',
    };

    it('sets _isSubmitting to true', () => {
      callback(action);
      expect(SubjectStore.isSubmitting()).toBe(true);
    });

    it('emits a change event', () => {
      let listener = jest.genMockFunction();
      SubjectStore.addChangeListener(listener);
      callback(action);

      expect(listener.mock.calls.length).toBe(1);
    });
  });

  describe('SUBJECT_CREATE_SUCCESS action', () => {
    it('sets _isSubmitting to false', () => {
      let action = {
        type: ActionTypes.SUBJECT_CREATE_SUCCESS,
        userId: 'bob',
        subjectName: 'testSubject',
      };
      callback(action);

      expect(SubjectStore.isSubmitting()).toBe(false);
    });
  });

  describe('SUBJECT_CREATE_FAIL action', () => {
    it('sets _isSubmitting to false', () => {
      let action = {
        type: ActionTypes.SUBJECT_CREATE_FAIL,
        userId: 'bob',
        subjectName: 'testSubject',
        error: new Error(),
      };
      callback(action);

      expect(SubjectStore.isSubmitting()).toBe(false);
    });
  });

  describe('SUBJECTS_UPDATE action', () => {
    it('updates subjects map', () => {
      let subjects = {
        '-JlUd0xRBkwULfuGFGqo': 'COMS3200',
        '-JldDBERX2jaTHTanV-P': 'INFS3202',
        '-Jli22md1TMXq7YhqMHd': 'DECO3800',
      };
      let action = {
        type: ActionTypes.SUBJECTS_UPDATE,
        subjects: subjects,
      };
      callback(action);

      let updatedSubjects = SubjectStore.getAll();
      expect(updatedSubjects).toEqual(subjects);
    });
  });

});
