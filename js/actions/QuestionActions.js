import Dispatcher from '../dispatcher/Dispatcher.js';
import QuestionConstants from '../constants/QuestionConstants.js';
let ActionTypes = QuestionConstants.ActionTypes;

let QuestionActions = {

    updateQuestions: (courseKey, questions) => {
        if (!courseKey || !questions) return;
        Dispatcher.dispatch({
            type: ActionTypes.QUESTIONS_UPDATE,
            courseKey: courseKey,
            questions: questions,
        });
    },

    create: (text) => {
        Dispatcher.dispatch({
            type: ActionTypes.QUESTION_CREATE,
            text: text,
        });
    },

    delete: (key) => {
        Dispatcher.dispatch({
            type: ActionTypes.QUESTION_DELETE,
            key: key,
        });
    },
}

export default QuestionActions;