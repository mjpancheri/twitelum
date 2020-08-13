import { createStore } from 'redux';

export const CARREGA_TWEETS = 'CARREGA_TWEETS';

function tweetsReducer(state = [], action = {}) {
  if(action.type === CARREGA_TWEETS) {
    return action.tweets
  }

  return state
}

export default createStore(tweetsReducer)
