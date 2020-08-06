import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            tweets: [],
            novoTweet: ''
        }

        this.usuario = '@mjpancheri';
    }

    adicionaTweet = event => {
        event.preventDefault();
        if(this.state.novoTweet.length > 0){
            this.setState({
                tweets: [this.state.novoTweet, ...this.state.tweets],
                novoTweet: ''
            });
        }
    };

    renderTweet = () => {
        return this.state.tweets.length > 0 ? this.state.tweets.map(
            (tweet, idx) => {
                return <Tweet
                    key={tweet+idx}
                    texto={tweet} 
                    usuario={this.usuario} />
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
                                onChange={ (event) => this.setState({novoTweet: event.target.value})}
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
      </Fragment>
    );
  }
}

export default HomePage;
