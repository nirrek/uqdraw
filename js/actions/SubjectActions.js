import Dispatcher from '../dispatcher/Dispatcher.js';
import SubjectConstants from '../constants/SubjectConstants.js';
let ActionTypes = SubjectConstants.ActionTypes;

let SubjectActions = {
  create: (subjectName) => {
    if (!subjectName) return;
    Dispatcher.dispatch({
      type: ActionTypes.SUBJECT_CREATE,
      subjectName: subjectName,
    });
  },
};

export default SubjectActions;
