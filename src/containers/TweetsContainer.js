import React, { Component } from 'react';
import { TweetsThunkActions } from '../store/ducks/tweets';
import { ReactReduxContext } from 'react-redux';
import { Modal } from '../components/Modal';
import Tweet from '../components/Tweet';

export class TweetsContainer extends Component {

  static contextType = ReactReduxContext;
  
  constructor() {
    super();
    this.state = {
      tweets: [],
      tweetAtivoModal: {}
    }
  }
  
  componentDidMount() {
    const store = this.context.store;
    
    store.subscribe(() => {
      this.setState({
        tweets: store.getState().tweets.data,
        tweetAtivoModal: store.getState().tweets.activeDataItem
      });
    });

    store.dispatch(TweetsThunkActions.carregaTweets());
    //console.log(store.getState());
  }

  likeHandler = (id) => {
    this.context.store.dispatch(TweetsThunkActions.like(id));
  };

  removeTweet = (id) => {
    this.context.store
      .dispatch(TweetsThunkActions.removeTweet(id))
  };

  abreModal = id => {
    this.context.store
      .dispatch(TweetsThunkActions.setTweetAtivo(id))
  };

  fechaModal = () => {
    this.context.store
      .dispatch(TweetsThunkActions.unsetTweetAtivo())
  }

  renderTweet = () => {
    return this.state.tweets.length > 0 ? this.state.tweets.map(
      (tweet) => {
        // console.log(tweet);
        return <Tweet
          key={tweet._id}
          id={tweet._id}
          texto={tweet.conteudo}
          usuario={tweet.usuario}
          likeado={tweet.likeado}
          totalLikes={tweet.totalLikes}
          removivel={tweet.removivel}
          removeHandler={this.removeTweet}
          likeHandler={this.likeHandler}
          onClickConteudo={() => this.abreModal(tweet._id)} />
      }
    )
      : 'Sua lista está vazia, que tal criar um tweet?'
  }

  render() {
    //console.log(this.state.tweetAtivoModal);
    return (
      <>
        <div className="tweetsArea">
          {this.renderTweet()}
        </div>
        <Modal
          isOpen={!!this.state.tweetAtivoModal._id}
          onClose={this.fechaModal}
        >
          {() => (
            <Tweet
              key={this.state.tweetAtivoModal._id}
              id={this.state.tweetAtivoModal._id}
              texto={this.state.tweetAtivoModal.conteudo}
              opened={!!this.state.tweetAtivoModal._id}
              usuario={this.state.tweetAtivoModal.usuario}
              likeado={this.state.tweetAtivoModal.likeado}
              totalLikes={this.state.tweetAtivoModal.totalLikes}
              removivel={this.state.tweetAtivoModal.removivel}
              removeHandler={() => this.removeTweet(this.state.tweetAtivoModal._id)}
              likeHandler={() => this.likeHandler(this.state.tweetAtivoModal._id)}
            />
          )}
        </Modal>
      </>
    )
  }
}