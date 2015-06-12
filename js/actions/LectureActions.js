import Dispatcher from '../dispatcher/Dispatcher';
import LectureConstants from '../constants/LectureConstants';
let ActionTypes = LectureConstants.ActionTypes;
import API from '../utils/API';

let LectureActions = {

    updateLectures: (courseKey, lectures) => {
        if (!courseKey || !lectures) return;
        Dispatcher.dispatch({
            type: ActionTypes.LECTURES_UPDATE_SUCCESS,
            courseKey: courseKey,
            lectures: lectures,
        });
    },

    create: (courseKey, lectureTitle) => {
        let newLecture = {title: lectureTitle, questions: []};
        let ref = API.addToLectures(courseKey, newLecture, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_FAIL,
                    courseKey: courseKey,
                    lecture: newLecture,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_SUCCESS,
                    courseKey: courseKey,
                    lectureKey: ref.key(),
                    lecture: newLecture,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_CREATE_INITIATED,
            courseKey: courseKey,
            lecture: newLecture,
        });
    },

    delete: (courseKey, lectureKey) => {
        API.removeLecture(courseKey, lectureKey, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_DELETE_FAIL,
                    courseKey,
                    lectureKey,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_DELETE_SUCCESS,
                    courseKey,
                    lectureKey,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_DELETE_INITIATED,
            courseKey,
            lectureKey,
        });
    },
};

export default LectureActions;
