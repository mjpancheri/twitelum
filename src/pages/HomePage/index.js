import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import { Helmet } from 'react-helmet';
import { ReactReduxContext } from 'react-redux';
import { TweetsThunkActions } from '../../store/ducks/tweets';
import { TweetsContainer } from '../../containers/TweetsContainer';

class HomePage extends Component {
  static contextType = ReactReduxContext;
  
  constructor() {
    super();
    this.state = {
      novoTweet: '',
      totalTweets: 0
    }
    
    this.usuario = '@mjpancheri';
  }
  
  componentDidMount() {
    const store = this.context.store;
    
    store.subscribe(() => {
      this.setState({
        totalTweets: store.getState().tweets.data.length
      })
    })

    store.dispatch(TweetsThunkActions.carregaTweets());
  }

  adicionaTweet = event => {
    event.preventDefault();
    if (this.state.novoTweet.length > 0) {
      const conteudo = this.state.novoTweet;
      this.context.store
        .dispatch(TweetsThunkActions.addTweet(conteudo))
        .then(() => {
          this.setState({ novoTweet: ''})
        })
    }
  };

  render() {
    const { novoTweet } = this.state;
    const limite = 140;
    const tweetMaiorPermitido = novoTweet.length > limite;
    const classeTweetInvalido = tweetMaiorPermitido ? 'novoTweet__status--invalido' : '';
    const botaoDesabilitado = tweetMaiorPermitido || novoTweet.length === 0;

    return (
      <Fragment>
        <Helmet>
          <title>Twitelum ({`${this.state.totalTweets}`})</title>
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
              <TweetsContainer />
            </Widget>
          </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;
