import * as PresentationActions from '../actions/PresentationActions.js';

const initialState = {
  presentations: {},
  activePresentationId: '',
  isPendingRequest: false,
};

export default function(state=initialState, action) {
  switch (action.type) {
  case PresentationActions.PRESENTATION_START_REQUEST:
    return {
      ...state,
      isPendingRequest: true,
    };

  case PresentationActions.PRESENTATION_START_SUCCESS:
    return {
      ...state,
      presentations: {
        ...state.presentations,
        [action.id]: action.presentation
      },
      activePresentationId: action.id,
      isPendingRequest: false,
    };

  case PresentationActions.PRESENTATION_START_FAILURE:
    return {
      ...state,
      isPendingRequest: false,
    };

  case PresentationActions.PRESENTATION_QUESTION_ACTIVATED: {
    const presentation = state.presentations[state.activePresentationId];
    const questions = presentation.questions.map(
      q => (q.id === action.questionId) ? {
        ...q,
        timeElapsed: q.timeElapsed || 0,
      } : q
    );

    return {
      ...state,
      presentations: {
        ...state.presentations,
        [presentation.id]: {
          ...presentation,
          currentQuestion: { id: action.questionId },
          questions
        }
      }
    };
  }

  case PresentationActions.PRESENTATION_START_ACCEPTING_RESPONSES: {
    const presentation = state.presentations[action.presentationId];
    return {
      ...state,
      presentations: {
        ...state.presentations,
        [presentation.id]: {
          ...presentation,
          isAcceptingResponses: true,
        }
      }
    }
  }

  case PresentationActions.PRESENTATION_STOP_ACCEPTING_RESPONSES: {
    const presentation = state.presentations[action.presentationId];
    return {
      ...state,
      presentations: {
        ...state.presentations,
        [presentation.id]: {
          ...presentation,
          isAcceptingResponses: false,
        }
      }
    }
  }

  case PresentationActions.PRESENTATION_RESPONSE_TIMER_TICK: {
    const presentation = state.presentations[state.activePresentationId];
    const questions = presentation.questions.map(
      q => (q.id === presentation.currentQuestion.id) ? {
        ...q,
        timeElapsed: action.timeElapsed
      } : q
    );

    return {
      ...state,
      presentations: {
        ...state.presentations,
        [presentation.id]: {
          ...presentation,
          questions,
        },
      }
    }
  }

  default:
    return state;
  }
}
