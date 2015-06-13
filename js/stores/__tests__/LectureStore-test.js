jest.dontMock('../LectureStore.js');
let clone = obj => JSON.parse(JSON.stringify(obj));

describe('LectureStore', () => {
    let LectureConstants = require('../../constants/LectureConstants.js');
    let ActionTypes = LectureConstants.ActionTypes;
    let Dispatcher;
    let LectureStore;
    let callback;

    let testCourseKey = 'testCourseKey';
    let testLectures = {
        one: {
            title: 'Test Lecture 1',
            questions: {},
            questionOrder: [],
        },
        two: {
            title: 'Test Lecture 2',
            questions: {},
            questionOrder: [],
        },
        three: {
            title: 'Test Lecture 3',
            questions: {},
            questionOrder: [],
        },
        four: {
            title: 'Test Lecture 4',
            questions: {},
            questionOrder: [],
        },
    };
    let testQuestions = {
        'questionKey': {text: 'test question?'},
        'questionKey2': {text: 'test second question?'},
    };

    let actionCreateLecture = {
        type: ActionTypes.LECTURE_CREATE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: '',
        lecture: '',
    };

    let actionUpdateLectures = {
        type: ActionTypes.LECTURES_UPDATE_SUCCESS,
        courseKey: testCourseKey,
        lectures: {},
    };

    let actionDeleteLecture = {
        type: ActionTypes.LECTURE_DELETE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: '',
    };

    let actionCreateQuestion = {
        type: ActionTypes.QUESTION_CREATE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: '',
        questionKey: '',
        question: '',
    };

    let actionUpdateQuestion = {
        type: ActionTypes.QUESTION_UPDATE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: '',
        questionKey: '',
        question: '',
    };

    let actionDeleteQuestion = {
        type: ActionTypes.QUESTION_DELETE_SUCCESS,
        courseKey: testCourseKey,
        lectureKey: '',
        questionKey: '',
    };

    beforeEach(() => {
        Dispatcher = require('../../dispatcher/Dispatcher.js');
        LectureStore = require('../LectureStore.js');
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
            LectureStore.addChangeListener(changeHandler);

            LectureStore.emitChange();

            jest.runAllTicks();
            expect(changeHandler).toBeCalled();
        });

        it('should call multiple change callbacks on change', () => {
            let changeHandlers = [
                jest.genMockFunction(),
                jest.genMockFunction(),
            ];
            LectureStore.addChangeListener(changeHandlers[0]);
            LectureStore.addChangeListener(changeHandlers[1]);

            LectureStore.emitChange();

            jest.runAllTicks();
            expect(changeHandlers[0]).toBeCalled();
            expect(changeHandlers[1]).toBeCalled();
        });
    });

    describe('Actions', () => {
        describe('LECTURE_CREATE_SUCCESS', () => {

            it('adds a single lecture', () => {
                actionCreateLecture.lectureKey = 'one';
                actionCreateLecture.lecture = clone(testLectures.one);
                callback(actionCreateLecture);
                let lectures = LectureStore.getAll(testCourseKey);
                let keys = Object.keys(lectures);
                expect(keys.length).toBe(1);
                expect(lectures[keys[0]].title).toEqual(testLectures.one.title);
            });

            it('emits a change event after adding', () => {
                actionCreateLecture.lectureKey = 'one';
                actionCreateLecture.lecture = clone(testLectures.one);
                let changeHandler = jest.genMockFunction();
                LectureStore.addChangeListener(changeHandler);
                callback(actionCreateLecture);
                jest.runAllTicks();
                expect(changeHandler).toBeCalled();
            });
        });

        describe('LECTURES_UPDATE_SUCCESS', () => {
            it('adds a set of lectures if none exist already', () => {
                let newLectures = {
                    one: clone(testLectures.one),
                    two: clone(testLectures.two),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);
                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({
                    one: testLectures.one,
                    two: testLectures.two,
                });
            });

            it('combines new lectures with existing lectures', () => {
                let newLectures = {
                    one: clone(testLectures.one),
                    two: clone(testLectures.two),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                let newerLectures = {
                    three: clone(testLectures.three),
                    four: clone(testLectures.four),
                };
                actionUpdateLectures.lectures = newerLectures;
                callback(actionUpdateLectures);

                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({
                    one: testLectures.one,
                    two: testLectures.two,
                    three: testLectures.three,
                    four: testLectures.four,
                });
            });

            it('replaces an existing lecture if a new version is in the set', () => {
                let newLectures = {
                    one: clone(testLectures.one),
                    two: clone(testLectures.two),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                // Add a new version of the 'two' property that points to fourth object
                let newerLectures = {
                    three: clone(testLectures.three),
                    two: clone(testLectures.four),
                };
                actionUpdateLectures.lectures = newerLectures;
                callback(actionUpdateLectures);

                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({
                    one: testLectures.one,
                    two: testLectures.four,
                    three: testLectures.three,
                });
            });

            it('emits a change event after updating', () => {
                let changeHandler = jest.genMockFunction();
                LectureStore.addChangeListener(changeHandler);
                let newLectures = {
                    one: clone(testLectures.one),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);
                expect(changeHandler).toBeCalled();
            });
        });

        describe('LECTURE_DELETE_SUCCESS', () => {
            it('can delete a lecture', () => {
                let newLectures = {
                    one: clone(testLectures.one),
                    two: clone(testLectures.two),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                actionDeleteLecture.lectureKey = 'one';
                callback(actionDeleteLecture);

                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({
                    two: testLectures.two,
                });
            });

            it('does nothing if the lecture doesn\'t exist', () => {
                let newLectures = {
                    one: clone(testLectures.one),
                    two: clone(testLectures.two),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                actionDeleteLecture.lectureKey = 'three';
                callback(actionDeleteLecture);

                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({
                    one: testLectures.one,
                    two: testLectures.two,
                });
            });

            it('does nothing if there are no lectures', () => {
                actionDeleteLecture.lectureKey = 'one';
                callback(actionDeleteLecture);

                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({});
            });

            it('emits a change event after deleting', () => {
                let changeHandler = jest.genMockFunction();
                let newLectures = {
                    one: clone(testLectures.one),
                    two: clone(testLectures.two),
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                LectureStore.addChangeListener(changeHandler);
                actionDeleteLecture.lectureKey = 'one';
                callback(actionDeleteLecture);
                expect(changeHandler).toBeCalled();
            });
        });

        describe('QUESTION_CREATE_SUCCESS', () => {
            beforeEach(function() {
                actionCreateLecture.lectureKey = 'one';
                actionCreateLecture.lecture = clone(testLectures.one);
                callback(actionCreateLecture);
            });

            it('adds a single question to the lecture', () => {
                let questionKey = 'questionKey';
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = clone(testQuestions[questionKey]);
                callback(actionCreateQuestion);
                let lecture = LectureStore.get(testCourseKey, 'one');
                expect(lecture.questionOrder.length).toBe(1);
                expect(lecture.questions).toEqual({
                    [questionKey]: testQuestions[questionKey]
                });
                expect(lecture.questionOrder).toEqual([
                    questionKey,
                ]);
            });

            it('emits a change event after adding', () => {
                let questionKey = 'questionKey';
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = clone(testQuestions[questionKey]);
                let changeHandler = jest.genMockFunction();
                LectureStore.addChangeListener(changeHandler);
                callback(actionCreateQuestion);
                jest.runAllTicks();
                expect(changeHandler).toBeCalled();
            });
        });

        describe('QUESTION_UPDATE_SUCCESS', () => {
            beforeEach(() => {
                actionCreateLecture.lectureKey = 'one';
                actionCreateLecture.lecture = clone(testLectures.one);
                callback(actionCreateLecture);
            });

            it('adds a new question if it doesn\'t exist already', () => {
                let questionKey = 'questionKey';
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = clone(testQuestions[questionKey]);
                callback(actionCreateQuestion);
                let lecture = LectureStore.get(testCourseKey, 'one');
                expect(lecture.questions).toEqual({
                    [questionKey]: testQuestions[questionKey]
                });
                expect(lecture.questionOrder).toEqual([
                    questionKey,
                ]);
            });

            it('combines new questions with existing questions', () => {
                // Add first question
                let questionKey = 'questionKey';
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = clone(testQuestions[questionKey]);
                callback(actionCreateQuestion);

                // Add second question
                let questionKey2 = 'questionKey2';
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey2;
                actionCreateQuestion.question = clone(testQuestions[questionKey2]);
                callback(actionCreateQuestion);

                let lecture = LectureStore.get(testCourseKey, 'one');
                expect(lecture.questions).toEqual({
                    [questionKey]: testQuestions[questionKey],
                    [questionKey2]: testQuestions[questionKey2],
                });
                expect(lecture.questionOrder).toEqual([
                    questionKey,
                    questionKey2,
                ]);
            });

            it('replaces an existing question with a new one', () => {
                let questionKey = 'questionKey';

                // Add first question
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = clone(testQuestions[questionKey]);
                callback(actionCreateQuestion);

                // Add a replacement question
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = {text: 'replacement question'};
                callback(actionCreateQuestion);

                let lecture = LectureStore.get(testCourseKey, 'one');
                expect(lecture.questions).toEqual({
                    [questionKey]: actionCreateQuestion.question
                });
            });

            it('emits a change event after updating', () => {
                let changeHandler = jest.genMockFunction();
                LectureStore.addChangeListener(changeHandler);
                let questionKey = 'questionKey';
                actionCreateQuestion.lectureKey = 'one';
                actionCreateQuestion.questionKey = questionKey;
                actionCreateQuestion.question = clone(testQuestions[questionKey]);
                callback(actionCreateQuestion);
                expect(changeHandler).toBeCalled();
            });
        });
    });

    describe('API', () => {
        describe('getAll', () => {
            it('initialises with no lectures', () => {
                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual({});
            });

            it('gets all lectures for the course', () => {
                actionUpdateLectures.lectures = testLectures;
                callback(actionUpdateLectures);
                let lectures = LectureStore.getAll(testCourseKey);
                expect(lectures).toEqual(testLectures);
            });

            it('should throw an error if missing an argument', () => {
                expect(() => LectureStore.getAll()).toThrow();
            });
        });

        describe('get', () => {
            it('should retrieve the correct lecture', () => {
                actionUpdateLectures.lectures = testLectures;
                callback(actionUpdateLectures);
                let lecture = LectureStore.get(testCourseKey, 'three');
                expect(lecture).toEqual(testLectures.three);
            });

            it('should return undefined if lecture doesn\'t exist', () => {
                let lecture = LectureStore.get(testCourseKey, 'three');
                expect(lecture).toBeUndefined();
            });

            it('should throw an error if missing an argument', () => {
                expect(() => LectureStore.get('three')).toThrow();
            });
        });
    });
});
