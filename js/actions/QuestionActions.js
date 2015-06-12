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
        let questionKey = API.addToQuestions(courseKey, lectureKey, lecture, question, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.QUESTION_CREATE_FAIL,
                    courseKey,
                    lectureKey,
                    questionKey,
                    question,
                    error
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.QUESTION_CREATE_SUCCESS,
                    courseKey,
                    lectureKey,
                    questionKey,
                    question,
                });
            }
        });

        Dispatcher.dispatch({
            type: ActionTypes.QUESTION_CREATE_INITIATED,
            courseKey,
            lectureKey,
            questionKey,
            question,
        });
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
