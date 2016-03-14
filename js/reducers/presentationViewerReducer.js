import * as Actions from '../actions/PresentationViewerActions.js';

const initialState = {
  isFetchingPresentation: false,
  fetchPresentationError: null,
  presentation: null,
  isSendingResponse: false,
  sendResponseError: null,
  hasResponded: false,
};

export default function presentationViewerReducer(state=initialState, action) {
  switch (action.type) {
  case Actions.PRESENTATION_VIEWER_PRESENTATION_REQUEST:
    return {
      ...state,
      isFetchingPresentation: true,
    };

  case Actions.PRESENTATION_VIEWER_PRESENTATION_SUCCESS:
    return {
      ...state,
      presentation: action.presentation,
      isFetchingPresentation: false,
      isSendingResponse: false,
      sendResponseError: null,
      hasResponded: false,
    };

  case Actions.PRESENTATION_VIEWER_PRESENTATION_FAILURE:
    return {
      ...state,
      fetchPresentationError: action.error,
      isFetchingPresentation: false,
    };

  case Actions.PRESENTATION_VIEWER_CODE_INPUT_FOCUSED:
    return {
      ...state,
      fetchPresentationError: null,
    };

  case Actions.PRESENTATION_VIEWER_RESPONSE_REQUEST:
    return {
      ...state,
      isSendingResponse: true,
    };

  case Actions.PRESENTATION_VIEWER_RESPONSE_SUCCESS:
    return {
      ...state,
      isSendingResponse: false,
      hasResponded: true,
    };

  case Actions.PRESENTATION_VIEWER_RESPONSE_FAILURE:
    return {
      ...state,
      isSendingResponse: false,
    };

  default:
    return state;
  }
}
