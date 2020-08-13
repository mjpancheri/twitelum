import { TWEETS_CARREGA, TWEETS_CARREGA_SUCESSO, TWEETS_CARREGA_FALHOU } from "../.."
import { TweetsService } from "../../../services/TweetsService";


export const TweetsThunkActions = {
  carregaTweets: () => {
    return dispatch => {
      dispatch({ type: TWEETS_CARREGA });

      TweetsService.carrega()
      .then(tweets => {
        dispatch({
          type: TWEETS_CARREGA_SUCESSO,
          payload: { data: tweets }
        });
      })
      .catch(() => {
        dispatch({ type: TWEETS_CARREGA_FALHOU });
      })
    }
  }
};

const INITIAL_STATE = {
  data: [],
  loading: false,
  error: false
};

export function tweetsReducer(state = INITIAL_STATE, action = {}) {
  if(action.type === TWEETS_CARREGA) {
    return {
      ...state,
      loading: true,
      error: false
    };
  }

  if(action.type === TWEETS_CARREGA_SUCESSO) {
    return {
      ...state,
      data: action.payload.data,
      loading: false,
      error: false
    };
  }

  if(action.type === TWEETS_CARREGA_FALHOU) {
    return {
      ...state,
      data: [],
      loading: false,
      error: true
    };
  }

  return state;
}