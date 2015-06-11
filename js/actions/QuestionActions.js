import Dispatcher from '../dispatcher/Dispatcher.js';
import QuestionConstants from '../constants/QuestionConstants.js';
let ActionTypes = QuestionConstants.ActionTypes;
import API from '../utils/API.js';

let QuestionActions = {

    updateQuestions: (courseKey, questions) => {
        if (!courseKey || !questions) return;
        Dispatcher.dispatch({
            type: ActionTypes.QUESTIONS_UPDATE,
            courseKey: courseKey,
            questions: questions,
        });
    },

    create: (courseKey, lectureKey, lecture, question) => {
        let questionRef;
        let questionUpdated = false;
        let lectureUpdated = false;

        let dispatchInitiated = () => {
            Dispatcher.dispatch({
                type: ActionTypes.QUESTION_CREATE,
                courseKey,
                question,
            });
        };

        let dispatchSuccess = () => {
            Dispatcher.dispatch({
                type: ActionTypes.QUESTION_CREATED,
                courseKey,
                questionKey: questionRef.key(),
                question,
            });
        };

        let dispatchFail = (error) => {
            Dispatcher.dispatch({
                type: ActionTypes.QUESTION_CREATE_FAIL,
                courseKey,
                lectureKey,
                lecture,
                question,
                error
            });
        };

        let callback = (type, response) => {
            if (response !== null) {
                dispatchFail(response);
            } else {
                if (type === 'question') questionUpdated = true;
                if (type === 'lecture') lectureUpdated = true;
                if (questionUpdated && lectureUpdated) {
                    dispatchSuccess();
                }
            }
        };

        questionRef = API.addToQuestions(courseKey, question, (response) => callback('question', response));
        lecture.questions.push(questionRef.key());
        API.updateLecture(courseKey, lectureKey, lecture, (response) => callback('lecture', response));

        dispatchInitiated();
    },

    delete: (courseKey, lectureKey, lecture, questionKey) => {
        let callback = (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.QUESTION_DELETE_FAIL,
                    courseKey,
                    lectureKey,
                    questionKey,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.QUESTION_DELETE_SUCCESS,
                    courseKey,
                    lectureKey,
                    questionKey,
                });
            }
        };

        // Remove question from lecture object
        let index = Array.findIndex(lecture.questions, x => x === questionKey);
        lecture.questions.splice(index, 1);

        API.removeQuestion(courseKey, lectureKey, lecture, questionKey, callback);
        Dispatcher.dispatch({
            type: ActionTypes.QUESTION_DELETE_INITIATED,
            courseKey,
            lectureKey,
            questionKey,
        });
    },
};

export default QuestionActions;
