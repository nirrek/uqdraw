jest.dontMock('../LectureStore.js');

describe('LectureStore', () => {
    let LectureConstants = require('../../constants/LectureConstants.js');
    let ActionTypes = LectureConstants.ActionTypes;
    let Dispatcher;
    let LectureStore;
    let callback;

    let testCourseKey = 'testCourseKey';
    let testLectureKey = 'testLectureKey';
    let testLecture = {
        title: 'Test Lecture',
        questions: [
            'test',
            'array',
        ],
    };

    beforeEach(() => {
        Dispatcher = require('../../dispatcher/Dispatcher.js');
        LectureStore = require('../LectureStore.js');
        callback = Dispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(Dispatcher.register.mock.calls.length).toBe(1);
    });

    it('initialises with no lectures', () => {
        let lectures = LectureStore.getAll(testCourseKey);
        expect(lectures).toEqual({});
    });

    describe('LECTURES_CREATE', () => {
        let actionCreateLecture = {
            type: ActionTypes.LECTURE_CREATE,
            courseKey: testCourseKey,
            lectureKey: testLectureKey,
            lecture: testLecture,
        };

        it('adds a single lecture', () => {
            callback(actionCreateLecture);
            let lectures = LectureStore.getAll(testCourseKey);
            let keys = Object.keys(lectures);
            expect(keys.length).toBe(1);
            expect(lectures[keys[0]].title).toEqual('Test Lecture');
        });
    });

    describe('LECTURES_UPDATE', () => {
        let actionUpdateLectures;
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

        beforeEach(() => {
            actionUpdateLectures = {
                type: ActionTypes.LECTURES_UPDATE,
                courseKey: testCourseKey,
                lectures: {},
            };
        });

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
    });

    describe('LECTURES_DELETE', () => {
        let actionUpdateLectures;
        let actionDeleteLecture;
        let testLectures = {
            one: {
                title: 'Test Lecture 1',
                questions: ['test'],
            },
            two: {
                title: 'Test Lecture 2',
                questions: ['test'],
            },
        };

        beforeEach(() => {
            actionUpdateLectures = {
                type: ActionTypes.LECTURES_UPDATE,
                courseKey: testCourseKey,
                lectures: {},
            };
            actionDeleteLecture = {
                type: ActionTypes.LECTURE_DELETE,
                courseKey: testCourseKey,
                lectureKey: '',
            };
        });

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
    });
});
