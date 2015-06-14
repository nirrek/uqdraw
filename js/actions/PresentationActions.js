import Dispatcher from '../dispatcher/Dispatcher.js';
import PresentationConstants from '../constants/PresentationConstants.js';
let API = require('../utils/API').default;
let actionTypes = PresentationConstants.ActionTypes;


let PresentationActions = {
    createResponse: function(lectureKey, questionKey, response) {
        let responseKey = API.addToResponses(lectureKey, questionKey, response, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: actionTypes.RESPONSE_CREATE_FAIL,
                    lectureKey,
                    questionKey,
                    response,
                    error,
                });
            } else {
                Dispatcher.dispatch({
                    type: actionTypes.RESPONSE_CREATE_SUCCESS,
                    lectureKey,
                    questionKey,
                    responseKey,
                    response,
                });
            }
        });
        Dispatcher.dispatch({
            type: actionTypes.RESPONSE_CREATE_INITIATED,
            lectureKey,
            questionKey,
            response,
        });
    },

    updateResponses: function(lectureKey, responses) {
        Dispatcher.dispatch({
            type: actionTypes.RESPONSES_UPDATE_SUCCESS,
            lectureKey,
            responses,
        });
    }
};

export default PresentationActions;
