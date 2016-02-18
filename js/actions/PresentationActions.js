import Dispatcher from '../dispatcher/Dispatcher.js';
import { ActionTypes } from '../constants/PresentationConstants.js';
import API from '../utils/API.js';

export const createResponse = (lectureKey, questionKey, response) => {
  let responseKey =
    API.addToResponses(lectureKey, questionKey, response, (error) => {
      if (error) {
        Dispatcher.dispatch({
          type: ActionTypes.RESPONSE_CREATE_FAIL,
          lectureKey,
          questionKey,
          response,
          error,
        });
      } else {
        Dispatcher.dispatch({
          type: ActionTypes.RESPONSE_CREATE_SUCCESS,
          lectureKey,
          questionKey,
          responseKey,
          response,
        });
      }
    }
  );
  Dispatcher.dispatch({
    type: ActionTypes.RESPONSE_CREATE_INITIATED,
    lectureKey,
    questionKey,
    response,
  });
};

export const updateResponses = (lectureKey, responses) => {
  Dispatcher.dispatch({
    type: ActionTypes.RESPONSES_UPDATE_SUCCESS,
    lectureKey,
    responses,
  });
};

