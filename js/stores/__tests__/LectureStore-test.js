jest.dontMock('../LectureStore.js');

describe('LectureStore', () => {
    let LectureConstants = require('../../constants/LectureConstants.js');
    let ActionTypes = LectureConstants.ActionTypes;
    let Dispatcher;
    let LectureStore;
    let callback;

    let testCourseKey = 'testCourseKey';
    let testLectureKey = 'testLectureKey';
    let testLectures = {
        one: {
            title: 'Test Lecture 1',
            questions: ['test'],
        },
        two: {
            title: 'Test Lecture 2',
            questions: ['test'],
        },
        three: {
            title: 'Test Lecture 3',
            questions: ['test'],
        },
        four: {
            title: 'Test Lecture 4',
            questions: ['test'],
        },
    };

    let actionCreateLecture = {
        type: ActionTypes.LECTURE_CREATE,
        courseKey: testCourseKey,
        lectureKey: '',
        lecture: '',
    };

    let actionUpdateLectures = {
        type: ActionTypes.LECTURES_UPDATE,
        courseKey: testCourseKey,
        lectures: {},
    };

    let actionDeleteLecture = {
        type: ActionTypes.LECTURE_DELETE,
        courseKey: testCourseKey,
        lectureKey: '',
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
        describe('LECTURES_CREATE', () => {

            it('adds a single lecture', () => {
                actionCreateLecture.lectureKey = 'one';
                actionCreateLecture.lecture = testLectures.one;
                callback(actionCreateLecture);
                let lectures = LectureStore.getAll(testCourseKey);
                let keys = Object.keys(lectures);
                expect(keys.length).toBe(1);
                expect(lectures[keys[0]].title).toEqual(testLectures.one.title);
            });

            it('emits a change event after adding', () => {
                actionCreateLecture.lectureKey = 'one';
                actionCreateLecture.lecture = testLectures.one;
                let changeHandler = jest.genMockFunction();
                LectureStore.addChangeListener(changeHandler);
                callback(actionCreateLecture);
                jest.runAllTicks();
                expect(changeHandler).toBeCalled();
            });
        });

        describe('LECTURES_UPDATE', () => {
            it('adds a set of lectures if none exist already', () => {
                let newLectures = {
                    one: testLectures.one,
                    two: testLectures.two,
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
                    one: testLectures.one,
                    two: testLectures.two,
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                let newerLectures = {
                    three: testLectures.three,
                    four: testLectures.four,
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
                    one: testLectures.one,
                    two: testLectures.two,
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                // Add a new version of the 'two' property that points to fourth object
                let newerLectures = {
                    three: testLectures.three,
                    two: testLectures.four,
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
                    one: testLectures.one,
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);
                expect(changeHandler).toBeCalled();
            });
        });

        describe('LECTURES_DELETE', () => {
            it('can delete a lecture', () => {
                let newLectures = {
                    one: testLectures.one,
                    two: testLectures.two,
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
                    one: testLectures.one,
                    two: testLectures.two,
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
                    one: testLectures.one,
                    two: testLectures.two,
                };
                actionUpdateLectures.lectures = newLectures;
                callback(actionUpdateLectures);

                LectureStore.addChangeListener(changeHandler);
                actionDeleteLecture.lectureKey = 'one';
                callback(actionDeleteLecture);
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
