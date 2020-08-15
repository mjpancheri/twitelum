import { TweetsService } from "../../../services/TweetsService";

const TWEETS_CARREGA = 'tweets/CARREGA';
const TWEETS_CARREGA_SUCESSO = 'tweets/CARREGA_SUCESSO';
const TWEETS_CARREGA_FALHOU = 'tweets/CARREGA_FALHOU';
const TWEETS_ADD = 'tweets/ADD';
const TWEETS_REMOVE = 'tweets/REMOVE';
const TWEETS_SET_ACTIVE = 'tweets/SET_ACTIVE';
const TWEETS_UNSET_ACTIVE = 'tweets/UNSET_ACTIVE';
const TWEETS_LIKE = 'tweets/LIKE';

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
  },
  addTweet: conteudo => {
    return async dispatch => {
      const response = await TweetsService.adiciona(conteudo);
      dispatch({ type: TWEETS_ADD, payload: { tweet: response } });
    };
  },
  removeTweet: id => {
    return async dispatch => {
      await TweetsService.remove(id);
      dispatch({ type: TWEETS_REMOVE, payload: { idTweet: id } });
    };
  },
  setTweetAtivo: id => {
    return dispatch => {
      dispatch({ type: TWEETS_SET_ACTIVE, payload: { id } });
    };
  },
  unsetTweetAtivo: () => {
    return dispatch => {
      dispatch({ type: TWEETS_UNSET_ACTIVE });
    };
  },
  like: id => {
    return async dispatch => {
      await TweetsService.like(id)
      .then(() => {
        dispatch({ type: TWEETS_LIKE, payload: { id } });
      })
    };
  }
};

const INITIAL_STATE = {
  data: [],
  activeDataItem: {},
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

  if(action.type === TWEETS_ADD) {
    return {
      ...state,
      data: [action.payload.tweet, ...state.data],
    };
  }

  if(action.type === TWEETS_REMOVE) {
    const newTweets = state.data.filter((tweet) => tweet._id !== action.payload.idTweet);
    return {
      ...state,
      data: newTweets,
      activeDataItem: {}
    };
  }

  if(action.type === TWEETS_SET_ACTIVE) {
    const activeTweet = state.data.find((tweet) => tweet._id === action.payload.id);
    return {
      ...state,
      activeDataItem: activeTweet
    };
  }

  if(action.type === TWEETS_UNSET_ACTIVE) {
    return {
      ...state,
      activeDataItem: {}
    };
  }

  if(action.type === TWEETS_LIKE) {
    const idTweetLikeado = action.payload.id;
    const stateParcial = state.data.reduce(
      (stateParcial, tweetAtual) => {
        const isLikedTweet = idTweetLikeado === tweetAtual._id;

        if(isLikedTweet) {
          // debugger;
          const { likeado, totalLikes } = tweetAtual;
          const updatedTweet = {
            ...tweetAtual,
            totalLikes: likeado ? totalLikes - 1 : totalLikes + 1,
            likeado: !likeado
          };

          stateParcial.data = [...stateParcial.data, updatedTweet];
          stateParcial.activeDataItem = Object.keys(stateParcial.activeDataItem).length
            ? updatedTweet
            : stateParcial.activeDataItem;
        } else {
          stateParcial.data = [...stateParcial.data, tweetAtual];
        }

        return stateParcial;
      },{
        activeDataItem: state.activeDataItem,
        data: []
      }
    );

    return {
      ...state,
      ...stateParcial
    }
  }

  return state;
}