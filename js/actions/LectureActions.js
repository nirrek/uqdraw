import Dispatcher from '../dispatcher/Dispatcher';
import LectureConstants from '../constants/LectureConstants';
let ActionTypes = LectureConstants.ActionTypes;
import API from '../utils/API';

let LectureActions = {

    updateLectures: (courseKey, lectures) => {
        if (!courseKey || !lectures) return;
        Dispatcher.dispatch({
            type: ActionTypes.LECTURES_UPDATE,
            courseKey: courseKey,
            lectures: lectures,
        });
    },

    create: (courseKey, lectureTitle) => {
        let newLecture = {title: lectureTitle, questions: []};
        let ref = API.addToLectures(courseKey, newLecture);
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_CREATE,
            courseKey: courseKey,
            lectureKey: ref.key(),
            lecture: newLecture,
        });
    },

    delete: (courseKey, lectureKey) => {
        API.removeLecture(courseKey, lectureKey);
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_DELETE,
            courseKey,
            lectureKey,
        });
    },
};

export default LectureActions;
