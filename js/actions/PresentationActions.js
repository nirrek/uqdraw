import uuid from 'node-uuid';
import Dispatcher from '../dispatcher/Dispatcher.js';
import { ActionTypes } from '../constants/PresentationConstants.js';
import { addToResponses } from '../utils/API.js';

// ----------------------------------------------------------------------------
// Presentation Start
// ----------------------------------------------------------------------------
export const PRESENTATION_START_REQUEST = 'PRESENTATION_START_REQUEST';
export const PRESENTATION_START_SUCCESS = 'PRESENTATION_START_SUCCESS';
export const PRESENTATION_START_FAILURE = 'PRESENTATION_START_FAILURE';

export const presentationStart = (lectureId) => ({
  type: PRESENTATION_START_REQUEST,
  id: uuid.v4(),
  lectureId,
});

export const presentationStartSuccess = (id, presentation) => ({
  type: PRESENTATION_START_SUCCESS,
  id,
  presentation,
});

export const presentationStartFailure = (id, error) => ({
  type: PRESENTATION_START_FAILURE,
  id,
  error,
});


export const PRESENTATION_QUESTION_ACTIVATED = 'PRESENTATION_QUESTION_ACTIVATED';

export const activateQuestion = (presentationId, questionId) => ({
  type: PRESENTATION_QUESTION_ACTIVATED,
  presentationId,
  questionId,
});

// TODO handle when activation of a question fails.


// ----------------------------------------------------------------------------
// Accepting Responses
// ----------------------------------------------------------------------------
export const PRESENTATION_START_ACCEPTING_RESPONSES = 'PRESENTATION_START_ACCEPTING_RESPONSES';
export const PRESENTATION_STOP_ACCEPTING_RESPONSES = 'PRESENTATION_STOP_ACCEPTING_RESPONSES';

export const startAcceptingResponses = (presentationId) => ({
  type: PRESENTATION_START_ACCEPTING_RESPONSES,
  presentationId,
});

export const stopAcceptingResponses = (presentationId) => ({
  type: PRESENTATION_STOP_ACCEPTING_RESPONSES,
  presentationId,
});
// TODO handle when these requests fail.


// ----------------------------------------------------------------------------
// Timer Tick
// ----------------------------------------------------------------------------
export const PRESENTATION_RESPONSE_TIMER_TICK = 'PRESENTATION_RESPONSE_TIMER_TICK';

export const responseTimerTick = (timeElapsed) => ({
  type: PRESENTATION_RESPONSE_TIMER_TICK,
  timeElapsed,
});


// ----------------------------------------------------------------------------
// Old Api
// ----------------------------------------------------------------------------
export const createResponse = (lectureKey, questionKey, response) => {
  let responseKey =
    addToResponses(lectureKey, questionKey, response, (error) => {
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

