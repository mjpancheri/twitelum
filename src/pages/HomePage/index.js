import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import { Helmet } from 'react-helmet';
import { Modal } from '../../components/Modal';
import { ReactReduxContext } from 'react-redux';
import { TweetsService } from '../../services/TweetsService';
import { TweetsThunkActions } from '../../store/ducks/tweets';

class HomePage extends Component {
  static contextType = ReactReduxContext;

  constructor() {
    super();
    this.state = {
      tweets: [],
      novoTweet: '',
      tweetAtivoModal: {}
    }

    this.usuario = '@mjpancheri';
    this.token = localStorage.getItem('TOKEN');
  }

  componentDidMount() {
    const store = this.context.store;

    store.subscribe(() => {
      this.setState({
        tweets: store.getState().tweets.data
      })
    })

    store.dispatch(TweetsThunkActions.carregaTweets());
  }

  adicionaTweet = event => {
    event.preventDefault();
    if (this.state.novoTweet.length > 0) {
      TweetsService.adiciona(this.state.novoTweet)
        .then((tweetServer) => {
          //console.log(tweetServer);

          this.setState({
            tweets: [tweetServer, ...this.state.tweets],
            novoTweet: ''
          })
        })
    }
  };

  removeTweet = (id) => {
    TweetsService.remove(id)
    .then((response) => {
      //console.log(response);
      const newTweets = this.state.tweets.filter((tweet) => tweet._id !== id);
      this.setState({
        tweets: newTweets
      })
      this.fechaModal();
    })
  };

  abreModal = tweetParaModal => {
    this.setState({
      tweetAtivoModal: tweetParaModal
    }, () => {
      console.log('twite: ', this.state.tweetAtivoModal);
    });
  };

  fechaModal = () => this.setState({ tweetAtivoModal: {} });

  renderTweet = () => {
    return this.state.tweets.length > 0 ? this.state.tweets.map(
      (tweet, idx) => {
        //console.log('user:', usuario);
        return <Tweet
          key={tweet._id}
          id={tweet._id}
          texto={tweet.conteudo}
          usuario={tweet.usuario}
          likeado={tweet.likeado}
          totalLikes={tweet.totalLikes}
          removivel={tweet.removivel}
          removeHandler={() => this.removeTweet(tweet._id)}
          onClickConteudo={() => this.abreModal(tweet)} />
      }
    )
      : 'Sua lista está vazia, que tal criar um tweet?'
  }

  render() {
    const { novoTweet } = this.state;
    const limite = 140;
    const tweetMaiorPermitido = novoTweet.length > limite;
    const classeTweetInvalido = tweetMaiorPermitido ? 'novoTweet__status--invalido' : '';
    const botaoDesabilitado = tweetMaiorPermitido || novoTweet.length === 0;

    return (
      <Fragment>
        <Helmet>
          <title>Twitelum ({`${this.state.tweets.length}`})</title>
        </Helmet>
        <Cabecalho>
          <NavMenu usuario={this.usuario} />
        </Cabecalho>
        <div className="container">
          <Dashboard>
            <Widget>
              <form className="novoTweet" onSubmit={this.adicionaTweet}>
                <div className="novoTweet__editorArea">
                  <span
                    className={`novoTweet__status ${classeTweetInvalido}`}
                  >{novoTweet.length}/{limite}</span>
                  <textarea
                    className="novoTweet__editor"
                    value={novoTweet}
                    onChange={(event) => this.setState({ novoTweet: event.target.value })}
                    placeholder="O que está acontecendo?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="novoTweet__envia"
                  disabled={botaoDesabilitado}
                >Tweetar</button>
              </form>
            </Widget>
            <Widget>
              <TrendsArea />
            </Widget>
          </Dashboard>
          <Dashboard posicao="centro">
            <Widget>
              <div className="tweetsArea">
                {this.renderTweet()}
              </div>
            </Widget>
          </Dashboard>
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
            />
          )}
        </Modal>
      </Fragment>
    );
  }
}

export default HomePage;
