jest.dontMock('../PresentationStore.js');
let clone = obj => JSON.parse(JSON.stringify(obj));

describe('PresentationStore', () => {
    let PresentationConstants = require('../../constants/PresentationConstants.js');
    let ActionTypes = PresentationConstants.ActionTypes;
    let Dispatcher;
    let PresentationStore;
    let callback;
    let actions = {
        [ActionTypes.RESPONSE_CREATE_INITIATED]: {
            type: ActionTypes.RESPONSE_CREATE_INITIATED,
        },
        [ActionTypes.RESPONSE_CREATE_SUCCESS]: {
            type: ActionTypes.RESPONSE_CREATE_SUCCESS,
        },
        [ActionTypes.RESPONSE_CREATE_FAIL]: {
            type: ActionTypes.RESPONSE_CREATE_FAIL,
        },
        [ActionTypes.RESPONSES_UPDATE_INITIATED]: {
            type: ActionTypes.RESPONSES_UPDATE_INITIATED,
        },
        [ActionTypes.RESPONSES_UPDATE_SUCCESS]: {
            type: ActionTypes.RESPONSES_UPDATE_SUCCESS,
        },
        [ActionTypes.RESPONSES_UPDATE_FAIL]: {
            type: ActionTypes.RESPONSES_UPDATE_FAIL,
        },
    };

    beforeEach(() => {
        Dispatcher = require('../../dispatcher/Dispatcher.js');
        PresentationStore = require('../PresentationStore.js');
        callback = Dispatcher.register.mock.calls[0][0];
    });

    /*
     * Start Tests
     */

    it('registers a callback with the dispatcher', () => {
        expect(Dispatcher.register.mock.calls.length).toBe(1);
    });

    describe('Change Listeners', () => {
        it('should call a single change callback on change', () => {
            let changeHandler = jest.genMockFunction();
            PresentationStore.addChangeListener(changeHandler);

            PresentationStore.emitChange();

            jest.runAllTicks();
            expect(changeHandler).toBeCalled();
        });

        it('should call multiple change callbacks on change', () => {
            let changeHandlers = [
                jest.genMockFunction(),
                jest.genMockFunction(),
            ];
            PresentationStore.addChangeListener(changeHandlers[0]);
            PresentationStore.addChangeListener(changeHandlers[1]);

            PresentationStore.emitChange();

            jest.runAllTicks();
            expect(changeHandlers[0]).toBeCalled();
            expect(changeHandlers[1]).toBeCalled();
        });
    });

    describe('Actions', () => {
        describe('RESPONSE_CREATE_INITIATED', () => {

            it('it sets the isSubmitting flag to true', () => {
                callback(actions[ActionTypes.RESPONSE_CREATE_INITIATED]);
                let isSubmitting = PresentationStore.isSubmitting();
                expect(isSubmitting).toBe(true);
            });
        });

        describe('RESPONSE_CREATED_SUCCESS', () => {

            it('it sets the isSubmitting flag to false', () => {
                let action = clone(actions[ActionTypes.RESPONSE_CREATE_SUCCESS]);
                action.lectureKey = 'lectureKey';
                action.questionKey = 'questionKey';
                action.responseKey = 'responseKey';
                action.response = {imageURI: 'gibberish'};
                callback(action);
                let isSubmitting = PresentationStore.isSubmitting();
                expect(isSubmitting).toBe(false);
            });

            it('adds a single response', () => {
                let action = clone(actions[ActionTypes.RESPONSE_CREATE_SUCCESS]);
                action.lectureKey = 'lectureKey';
                action.questionKey = 'questionKey';
                action.responseKey = 'responseKey';
                action.response = {imageURI: 'gibberish'};
                callback(action);
                let responses = PresentationStore.getResponsesForQuestion(action.lectureKey, action.questionKey);
                let keys = Object.keys(responses);
                expect(keys.length).toBe(1);
                expect(responses[keys[0]].imageURI).toEqual('gibberish');
            });

            it('emits a change event after adding', () => {
                let action = clone(actions[ActionTypes.RESPONSE_CREATE_SUCCESS]);
                action.lectureKey = 'lectureKey';
                action.questionKey = 'questionKey';
                action.responseKey = 'responseKey';
                action.response = {imageURI: 'gibberish'};
                let changeHandler = jest.genMockFunction();
                PresentationStore.addChangeListener(changeHandler);
                callback(action);
                jest.runAllTicks();
                expect(changeHandler).toBeCalled();
            });
        });
    });

        describe('RESPONSE_CREATED_FAIL', () => {
            it('it sets the isSubmitting flag to false', () => {
                let isSubmitting;
                callback(actions[ActionTypes.RESPONSE_CREATE_INITIATED]);
                isSubmitting = PresentationStore.isSubmitting();
                expect(isSubmitting).toBe(true);
                callback(actions[ActionTypes.RESPONSE_CREATE_FAIL]);
                isSubmitting = PresentationStore.isSubmitting();
                expect(isSubmitting).toBe(false);
            });
        });

    describe('API', () => {
        describe('getResponses', () => {
            it('gets the set of responses for a lecture', () => {
                let action = clone(actions[ActionTypes.RESPONSE_CREATE_SUCCESS]);
                action.lectureKey = 'lecture1';
                action.questionKey = 'question1';
                action.responseKey = 'response1';
                action.response = {imageURI: 'response1'};
                callback(action);
                let action2 = clone(action);
                action2.lectureKey = 'lecture1';
                action2.questionKey = 'question2';
                action2.responseKey = 'response2';
                action2.response = {imageURI: 'response2'};
                callback(action2);

                let responses = PresentationStore.getResponses('lecture1');
                expect(responses).toEqual({
                    'question1': {
                        'response1': {imageURI: 'response1'}
                    },
                    'question2': {
                        'response2': {imageURI: 'response2'}
                    },
                });
            });
        });
        describe('getResponsesForQuestion', () => {
            it('gets the set of responses for a question', () => {
                let action = clone(actions[ActionTypes.RESPONSE_CREATE_SUCCESS]);
                action.lectureKey = 'lecture1';
                action.questionKey = 'question1';
                action.responseKey = 'response1';
                action.response = {imageURI: 'response1'};
                callback(action);

                let responses = PresentationStore.getResponsesForQuestion('lecture1', 'question1');
                expect(responses).toEqual({
                    'response1': {imageURI: 'response1'}
                });
            });
        });
        describe('isSubmitting', () => {
            it('should default to false', () => {
                let isSubmitting = PresentationStore.isSubmitting();
                expect(isSubmitting).toBe(false);
            });
        });
    });
});
