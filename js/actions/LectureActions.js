import Dispatcher from '../dispatcher/Dispatcher.js';
import LectureConstants from '../constants/LectureConstants.js';
let ActionTypes = LectureConstants.ActionTypes;

let QuestionActions = {

    updateLectures: (courseKey, lectures) => {
        if (!courseKey || !lectures) return;
        Dispatcher.dispatch({
            type: ActionTypes.LECTURES_UPDATE,
            courseKey: courseKey,
            lectures: lectures,
        });
    },

    create: (text) => {
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_CREATE,
            text: text,
        });
    },

    delete: (key) => {
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_DELETE,
            key: key,
        });
    },
}

export default QuestionActions;