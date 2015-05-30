import Dispatcher from '../dispatcher/Dispatcher.js';
import PresentationConstants from '../constants/PresentationConstants.js';
import API, {APIConstants} from '../utils/API.js';
let actionTypes = PresentationConstants.ActionTypes;


let PresentationActions = {
    createResponse: function(lectureKey, questionKey, response) {
        API.addToResponses(lectureKey, questionKey, response, (result) => {
            if (result === null) {
                Dispatcher.dispatch({
                    type: actionTypes.RESPONSE_CREATED,
                    lectureKey: lectureKey,
                    questionKey: questionKey,
                    response: response,
                });
            } else {
                Dispatcher.dispatch({
                    type: actionTypes.RESPONSE_CREATE_FAIL,
                    lectureKey: lectureKey,
                    questionKey: questionKey,
                    response: response,
                    error: result,
                });
            }
        });
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
