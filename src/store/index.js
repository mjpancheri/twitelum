import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { tweetsReducer } from './ducks/tweets';

export const TWEETS_CARREGA = 'tweets/CARREGA';
export const TWEETS_CARREGA_SUCESSO = 'tweets/CARREGA_SUCESSO';
export const TWEETS_CARREGA_FALHOU = 'tweets/CARREGA_FALHOU';

const store = createStore(
  combineReducers({
    tweets: tweetsReducer
  }),
  applyMiddleware(thunkMiddleware)
)

export default store;