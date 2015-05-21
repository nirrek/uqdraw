import Dispatcher from '../dispatcher/Dispatcher.js';
import PresentationConstants from '../constants/PresentationConstants.js';
import API, {APIConstants} from '../utils/API.js';
let actionTypes = PresentationConstants.ActionTypes;


let PresentationActions = {
    createResponse: function(lectureKey, questionKey, response) {
        API.addToResponses(lectureKey, questionKey, response);
        Dispatcher.dispatch({
            type: actionTypes.RESPONSE_CREATE,
            lectureKey: lectureKey,
            questionKey: questionKey,
            response: response,
        });
    },

    updateResponses: function(lectureKey, response) {
        Dispatcher.dispatch({
            type: actionTypes.RESPONSES_UPDATE,
            lectureKey: lectureKey,
            responses: response,
        });
    }
};

export default PresentationActions;
