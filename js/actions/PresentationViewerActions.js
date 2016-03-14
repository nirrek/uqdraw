import uuid from 'node-uuid';

export const PRESENTATION_VIEWER_PRESENTATION_REQUEST = 'PRESENTATION_VIEWER_PRESENTATION_REQUEST';
export const PRESENTATION_VIEWER_PRESENTATION_SUCCESS = 'PRESENTATION_VIEWER_PRESENTATION_SUCCESS';
export const PRESENTATION_VIEWER_PRESENTATION_FAILURE = 'PRESENTATION_VIEWER_PRESENTATION_FAILURE';

export const presentationRequest = (code) => ({
  type: PRESENTATION_VIEWER_PRESENTATION_REQUEST,
  code,
});

export const presentationSuccess = (presentation) => ({
  type: PRESENTATION_VIEWER_PRESENTATION_SUCCESS,
  presentation,
});

export const presentationFailure = (code, error) => ({
  type: PRESENTATION_VIEWER_PRESENTATION_FAILURE,
  code,
  error,
});


export const PRESENTATION_VIEWER_CODE_INPUT_FOCUSED = 'PRESENTATION_VIEWER_CODE_INPUT_FOCUSED';
export const codeInputFocused = () => ({
  type: PRESENTATION_VIEWER_CODE_INPUT_FOCUSED,
});


export const PRESENTATION_VIEWER_RESPONSE_REQUEST = 'PRESENTATION_VIEWER_RESPONSE_REQUEST';
export const PRESENTATION_VIEWER_RESPONSE_SUCCESS = 'PRESENTATION_VIEWER_RESPONSE_SUCCESS';
export const PRESENTATION_VIEWER_RESPONSE_FAILURE = 'PRESENTATION_VIEWER_RESPONSE_FAILURE';

export const response = (presentationId, questionId, responseImg) => {
  return ({
  type: PRESENTATION_VIEWER_RESPONSE_REQUEST,
  id: uuid.v4(),
  presentationId,
  questionId,
  responseImg,
})
};

export const responseSuccess = () => ({
  type: PRESENTATION_VIEWER_RESPONSE_SUCCESS,
});

export const responseFailure = (error) => ({
  type: PRESENTATION_VIEWER_RESPONSE_FAILURE,
  error
});
